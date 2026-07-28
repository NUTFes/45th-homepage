#!/usr/bin/env bash
set -Eeuo pipefail
umask 077

SCRIPT_DIR="$(cd -P -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
OPERATION_NAME="deploy"
# shellcheck source=scripts/production-common.sh
source "${SCRIPT_DIR}/production-common.sh"

DEPLOY_HEALTH_TIMEOUT="${DEPLOY_HEALTH_TIMEOUT:-180}"
TUNNEL_HEALTH_TIMEOUT="${TUNNEL_HEALTH_TIMEOUT:-60}"
MIGRATION_TIMEOUT="${MIGRATION_TIMEOUT:-900}"
DEPLOY_BACKUP_TIMEOUT="${DEPLOY_BACKUP_TIMEOUT:-7200}"
SMOKE_TIMEOUT="${SMOKE_TIMEOUT:-120}"
MIN_BACKUP_FREE_KIB="${MIN_BACKUP_FREE_KIB:-1048576}"

for command_name in curl docker flock grep mktemp realpath stat tee timeout; do
  require_command "${command_name}"
done
validate_positive_integer DEPLOY_HEALTH_TIMEOUT "${DEPLOY_HEALTH_TIMEOUT}"
validate_positive_integer TUNNEL_HEALTH_TIMEOUT "${TUNNEL_HEALTH_TIMEOUT}"
validate_positive_integer MIGRATION_TIMEOUT "${MIGRATION_TIMEOUT}"
validate_positive_integer DEPLOY_BACKUP_TIMEOUT "${DEPLOY_BACKUP_TIMEOUT}"
validate_positive_integer SMOKE_TIMEOUT "${SMOKE_TIMEOUT}"
validate_positive_integer MIN_BACKUP_FREE_KIB "${MIN_BACKUP_FREE_KIB}"

[[ -f "${COMPOSE_FILE}" && ! -L "${COMPOSE_FILE}" ]] ||
  production_die "Compose file not found or is a symlink: ${COMPOSE_FILE}"
validate_production_environment
validate_release_manifest
prepare_state_directory

backup_dir="$(validate_backup_directory "$(read_env_value BACKUP_DIR "${ENV_FILE}")")"
site_url="$(read_env_value NEXT_PUBLIC_SITE_URL "${ENV_FILE}")"
s3_bucket="$(read_env_value S3_BUCKET "${ENV_FILE}")"
media_endpoint="http://seaweedfs-s3:8333"
smoke_url="${PRODUCTION_SMOKE_URL:-${site_url%/}/api/health}"
page_smoke_url="${PRODUCTION_PAGE_SMOKE_URL:-${site_url%/}/}"
weed_mini_cutover_file="${STATE_DIR}/weed-mini-cutover.env"
cutover_marker_tmp=""

validate_weed_mini_cutover_marker() {
  local invalid_lines
  local marker_status
  local marker_created_at
  local marker_backup_path

  validate_private_file "${weed_mini_cutover_file}" "weed mini cutover marker"
  invalid_lines="$(
    sed -E '/^[[:space:]]*(#|$)/d' "${weed_mini_cutover_file}" |
      grep -Ev '^(status|created_at|backup_path)=' ||
      true
  )"
  [[ -z "${invalid_lines}" ]] ||
    production_die "weed mini cutover marker contains unsupported entries"

  marker_status="$(read_env_value status "${weed_mini_cutover_file}")"
  marker_created_at="$(read_env_value created_at "${weed_mini_cutover_file}")"
  marker_backup_path="$(read_env_value backup_path "${weed_mini_cutover_file}")"
  [[ "${marker_status}" == "pending" ]] ||
    production_die "weed mini cutover marker status is invalid"
  [[ "${marker_created_at}" =~ ^[0-9]{4}-[0-9]{2}-[0-9]{2}T ]] ||
    production_die "weed mini cutover marker timestamp is invalid"
  [[ "${marker_backup_path}" == "${backup_dir}/"* ]] ||
    production_die "weed mini cutover marker backup path is invalid"
}

write_weed_mini_cutover_marker() {
  cutover_marker_tmp="$(mktemp "${STATE_DIR}/.weed-mini-cutover.XXXXXX")"
  {
    printf 'status=pending\n'
    printf 'created_at=%s\n' "$(date -u +%FT%TZ)"
    printf 'backup_path=%s\n' "${backup_path}"
  } >"${cutover_marker_tmp}"
  chmod 600 "${cutover_marker_tmp}"
  atomic_replace_private_file \
    "${cutover_marker_tmp}" \
    "${weed_mini_cutover_file}" \
    "weed mini cutover marker"
  cutover_marker_tmp=""
}

remove_weed_mini_cutover_marker() {
  if path_exists "${weed_mini_cutover_file}"; then
    validate_weed_mini_cutover_marker
    rm -f -- "${weed_mini_cutover_file}"
  fi
}

build_compose_command
"${COMPOSE[@]}" config -q
validate_local_docker
acquire_production_lock
require_no_restore_marker

weed_mini_cutover_pending=false
if path_exists "${weed_mini_cutover_file}"; then
  validate_weed_mini_cutover_marker
  weed_mini_cutover_pending=true
  production_log "Resuming the pending split SeaweedFS to weed mini cutover"
fi

available_kib="$(df -Pk "${backup_dir}" | awk 'NR == 2 {print $4}')"
[[ "${available_kib}" =~ ^[0-9]+$ ]] ||
  production_die "could not determine free backup space"
((available_kib >= MIN_BACKUP_FREE_KIB)) ||
  production_die "BACKUP_DIR has less than $((MIN_BACKUP_FREE_KIB / 1024)) MiB free"

production_log "Pulling the immutable release and pinned edge/backup tools"
"${COMPOSE[@]}" pull payload payload-migrate cloudflared media-tool
verify_release_images
verify_database_url_identity payload-migrate

for service in postgres seaweedfs-s3; do
  require_service_healthy "${service}"
done

seaweedfs_container="$(compose_container_id seaweedfs-s3)"
seaweedfs_command="$(
  docker inspect --format '{{json .Config.Cmd}}' "${seaweedfs_container}"
)"
seaweedfs_is_mini=false
if [[ "${seaweedfs_command}" == *'"mini"'* ]]; then
  seaweedfs_is_mini=true
fi

legacy_seaweedfs_layout=false
legacy_seaweedfs_services=0
for service in seaweedfs-master seaweedfs-volume seaweedfs-filer; do
  load_service_container_ids "${service}"
  if ((${#SERVICE_CONTAINER_IDS[@]} > 0)); then
    require_at_most_one_service_container "${service}"
    ((legacy_seaweedfs_services += 1))
  fi
done
if [[ "${seaweedfs_is_mini}" == "true" ]]; then
  if ((legacy_seaweedfs_services > 0)); then
    if [[ "${weed_mini_cutover_pending}" != "true" ]] &&
      ! path_exists "${STATE_DIR}/current-images.env"; then
      production_die "weed mini was started before the legacy S3 backup; recover the old gateway or VM snapshot"
    fi
    production_log "Detected stale split SeaweedFS containers; they will be removed after deploy"
  fi
elif ((legacy_seaweedfs_services != 3)); then
  production_die "seaweedfs-s3 is not weed mini and the complete legacy layout is unavailable"
else
  for service in seaweedfs-master seaweedfs-volume seaweedfs-filer; do
    require_service_healthy "${service}"
  done
  legacy_seaweedfs_layout=true
  production_log "Detected the legacy split SeaweedFS layout; its media will only be backed up"
fi

require_at_most_one_service_container payload
require_at_most_one_service_container cloudflared
require_no_running_service_containers payload-migrate

had_payload=false
had_tunnel=false
old_payload_container="$(compose_container_id payload)"
old_payload_ref=""
old_payload_id=""

if [[ -n "${old_payload_container}" ]]; then
  old_payload_ref="$(docker inspect --format '{{.Config.Image}}' "${old_payload_container}")"
  old_payload_id="$(docker inspect --format '{{.Image}}' "${old_payload_container}")"
fi
if is_service_running payload; then
  had_payload=true
fi
if is_service_running cloudflared; then
  had_tunnel=true
fi

create_legacy_record=false
if path_exists "${STATE_DIR}/current-images.env"; then
  validate_current_release_state "${old_payload_container}"
elif path_exists "${STATE_DIR}/legacy-rollback.env"; then
  validate_release_against_container \
    "${STATE_DIR}/legacy-rollback.env" \
    "${old_payload_container}"
elif [[ -n "${old_payload_id}" ]]; then
  [[ "${had_payload}" == "true" ]] ||
    production_die "an untracked stopped Payload container exists; remove it or restore a recorded release"
  create_legacy_record=true
fi

backup_name="$(date -u +%Y%m%dT%H%M%SZ)-predeploy-${release_revision:0:12}-${BASHPID}"
backup_path="${backup_dir}/${backup_name}"
migration_log="${STATE_DIR}/releases/${backup_name}.migrate.log"
failure_reason=""
phase="pre_stop"
legacy_tmp=""
release_tmp=""
state_tmp=""
restore_marker_tmp=""

write_deploy_restore_marker() {
  local media_required="$1"

  restore_marker_tmp="$(mktemp "${STATE_DIR}/.restore-required.XXXXXX")"
  {
    printf 'operation=deploy\n'
    printf 'created_at=%s\n' "$(date -u +%FT%TZ)"
    printf 'release_revision=%s\n' "${release_revision}"
    printf 'backup_path=%s\n' "${backup_path}"
    printf 'media_restore_required=%s\n' "${media_required}"
  } >"${restore_marker_tmp}"
  chmod 600 "${restore_marker_tmp}"
  atomic_replace_private_file \
    "${restore_marker_tmp}" \
    "${RESTORE_REQUIRED_FILE}" \
    "restore-required marker"
  restore_marker_tmp=""
}

restore_previous_release() {
  local restore_status=0

  production_error "${failure_reason:-deployment failed}; the database migration has not started"

  if [[ "${had_payload}" == "true" ]]; then
    production_log "Restarting the existing Payload container"
    if ! "${COMPOSE[@]}" start payload >/dev/null ||
      ! wait_for_health payload "${DEPLOY_HEALTH_TIMEOUT}"; then
      production_error "previous Payload container could not be restored"
      restore_status=1
    fi
  fi

  if [[ "${had_tunnel}" == "true" ]]; then
    if [[ "${had_payload}" == "true" && "${restore_status}" != "0" ]]; then
      production_error "Cloudflare Tunnel remains stopped because Payload recovery failed"
      return 1
    fi

    production_log "Restarting the existing Cloudflare Tunnel"
    if ! "${COMPOSE[@]}" start cloudflared >/dev/null ||
      ! wait_for_health cloudflared "${TUNNEL_HEALTH_TIMEOUT}"; then
      production_error "previous Cloudflare Tunnel could not be restored"
      restore_status=1
    elif [[ "${had_payload}" == "true" ]] &&
      ! check_external_health "${smoke_url}" "" 10; then
      production_error "external health check failed after restoring the previous release"
      restore_status=1
    fi
  fi

  return "${restore_status}"
}

handle_failed_deploy() {
  local exit_code=$?
  local migrator_ids=""
  local recovery_status=0

  trap - ERR EXIT INT TERM
  set +e
  [[ -z "${legacy_tmp}" ]] || rm -f -- "${legacy_tmp}"
  [[ -z "${release_tmp}" ]] || rm -f -- "${release_tmp}"
  [[ -z "${state_tmp}" ]] || rm -f -- "${state_tmp}"
  [[ -z "${restore_marker_tmp}" ]] || rm -f -- "${restore_marker_tmp}"
  [[ -z "${cutover_marker_tmp}" ]] || rm -f -- "${cutover_marker_tmp}"

  case "${phase}" in
    pre_stop)
      ;;
    stop_started | old_stopped | backup_complete)
      restore_previous_release
      recovery_status=$?
      ;;
    migration_started | payload_started)
      migrator_ids="$(
        docker container ls \
          --quiet \
          --filter "label=com.docker.compose.project=${PRODUCTION_PROJECT_NAME}" \
          --filter "label=com.docker.compose.service=payload-migrate" 2>/dev/null
      )"
      if [[ -n "${migrator_ids}" ]]; then
        # shellcheck disable=SC2086 # Docker emits whitespace-separated IDs.
        docker stop --time 10 ${migrator_ids} >/dev/null 2>&1
      fi
      "${COMPOSE[@]}" stop -t 10 cloudflared payload >/dev/null 2>&1
      printf '\n[deploy] DEPLOYMENT STOPPED: %s\n' \
        "${failure_reason:-unexpected error after migration started}" >&2
      printf '[deploy] External traffic and Payload are stopped to prevent schema skew.\n' >&2
      printf '[deploy] Recovery point: %s\n' "${backup_path}" >&2
      printf '[deploy] Migration log: %s\n' "${migration_log}" >&2
      printf '[deploy] Restore with --restore-media; see docs/production-operations.md.\n' >&2
      ;;
    traffic_starting | traffic_enabled)
      "${COMPOSE[@]}" stop -t 10 cloudflared payload >/dev/null 2>&1
      printf '\n[deploy] DEPLOYMENT STOPPED: %s\n' \
        "${failure_reason:-unexpected error after traffic may have started}" >&2
      printf '[deploy] External traffic and Payload are stopped.\n' >&2
      printf '[deploy] Recovery point: %s\n' "${backup_path}" >&2
      printf '[deploy] Media may have changed; restore with --restore-media.\n' >&2
      ;;
    finalizing)
      printf '\n[deploy] DEPLOYMENT HEALTHY BUT FINALIZATION FAILED: %s\n' \
        "${failure_reason:-could not finalize deployment state}" >&2
      printf '[deploy] Payload and Tunnel remain on the verified new release.\n' >&2
      if path_exists "${RESTORE_REQUIRED_FILE}"; then
        printf '[deploy] Inspect restore-required.env and run the documented restore.\n' >&2
      else
        printf '[deploy] Inspect state and retry deploy before manual media registration.\n' >&2
      fi
      ;;
    complete)
      ;;
  esac

  if ((recovery_status != 0)); then
    exit_code=1
  fi
  exit "${exit_code}"
}

record_unexpected_error() {
  local exit_code=$?
  local line="$1"

  if [[ -z "${failure_reason}" ]]; then
    failure_reason="command failed at line ${line} (exit ${exit_code})"
  fi
  return "${exit_code}"
}

trap 'record_unexpected_error "${LINENO}"' ERR
trap handle_failed_deploy EXIT
trap 'failure_reason="deployment interrupted"; exit 130' INT
trap 'failure_reason="deployment terminated"; exit 143' TERM

if [[ "${create_legacy_record}" == "true" ]]; then
  legacy_tag="45th-homepage:rollback-${backup_name,,}"
  production_log "Preserving the pre-digest Payload image as ${legacy_tag}"
  docker image tag "${old_payload_id}" "${legacy_tag}"

  legacy_tmp="$(mktemp "${STATE_DIR}/.legacy-rollback.XXXXXX")"
  {
    printf 'PAYLOAD_IMAGE=%s\n' "${legacy_tag}"
    printf 'PAYLOAD_MIGRATOR_IMAGE=%s\n' "${migrator_image}"
    printf 'RELEASE_REVISION=legacy\n'
    printf 'EXPECTED_PAYLOAD_IMAGE_ID=%s\n' "${old_payload_id}"
    printf 'ORIGINAL_PAYLOAD_IMAGE=%s\n' "${old_payload_ref}"
  } >"${legacy_tmp}"
  chmod 600 "${legacy_tmp}"
  atomic_replace_private_file \
    "${legacy_tmp}" \
    "${STATE_DIR}/legacy-rollback.env" \
    "legacy rollback record"
  legacy_tmp=""
fi

phase="stop_started"
production_log "Stopping Cloudflare Tunnel and the old Payload container"
failure_reason="could not stop the old release"
"${COMPOSE[@]}" stop -t 30 cloudflared payload
phase="old_stopped"

is_service_running payload &&
  production_die "Payload is still running; migration is not safe"
is_service_running cloudflared &&
  production_die "Cloudflare Tunnel is still running; migration is not safe"

production_log "Creating and validating the pre-deploy recovery point"
failure_reason="pre-deploy backup failed"
if ! PRODUCTION_LOCK_FD=9 \
  BACKUP_NAME="${backup_name}" \
  timeout --foreground "${DEPLOY_BACKUP_TIMEOUT}" \
  "${SCRIPT_DIR}/backup-production.sh"; then
  exit 1
fi
phase="backup_complete"

for service in postgres seaweedfs-s3; do
  require_service_healthy "${service}"
done
if [[ "${legacy_seaweedfs_layout}" == "true" ]]; then
  for service in seaweedfs-master seaweedfs-volume seaweedfs-filer; do
    require_service_healthy "${service}"
  done
fi

if [[ "${legacy_seaweedfs_layout}" == "true" &&
  "${weed_mini_cutover_pending}" != "true" ]]; then
  write_weed_mini_cutover_marker
  weed_mini_cutover_pending=true
  production_log "Recorded the pending weed mini cutover until deploy fully succeeds"
fi

write_deploy_restore_marker true

phase="migration_started"
production_log "Running Payload migrations in the one-shot migrator"
failure_reason="Payload migration failed or timed out"
if ! timeout --foreground "${MIGRATION_TIMEOUT}" \
  "${COMPOSE[@]}" run --rm -T --no-deps payload-migrate 2>&1 |
  tee "${migration_log}"; then
  chmod 600 "${migration_log}" 2>/dev/null || true
  exit 1
fi
chmod 600 "${migration_log}"
require_no_running_service_containers payload-migrate

if [[ "${legacy_seaweedfs_layout}" == "true" ]]; then
  production_log "Replacing the legacy S3 gateway with a fresh weed mini data volume"
  production_log "The recovery point is retained, but media is not imported into weed mini"
  failure_reason="weed mini did not become healthy"
  if ! "${COMPOSE[@]}" up \
    -d \
    --no-deps \
    --force-recreate \
    --wait \
    --wait-timeout "${DEPLOY_HEALTH_TIMEOUT}" \
    seaweedfs-s3; then
    exit 1
  fi
fi

production_log "Waiting for the authenticated media bucket"
failure_reason="media bucket is not ready"
bucket_ready=false
bucket_deadline=$((SECONDS + SMOKE_TIMEOUT))
while ((SECONDS < bucket_deadline)); do
  if timeout --foreground 10 \
    "${COMPOSE[@]}" run --rm -T --no-deps media-tool \
    --endpoint-url "${media_endpoint}" \
    s3api head-bucket \
    --bucket "${s3_bucket}" >/dev/null 2>&1; then
    bucket_ready=true
    break
  fi
  ((SECONDS < bucket_deadline)) && sleep 2
done
if [[ "${bucket_ready}" != "true" ]]; then
  exit 1
fi

if [[ "${weed_mini_cutover_pending}" == "true" ]]; then
  production_log "Emptying weed mini for administrator-led media re-registration"
  failure_reason="weed mini could not be reset for manual media re-registration"
  if ! timeout --foreground "${SMOKE_TIMEOUT}" \
    "${COMPOSE[@]}" run --rm -T --no-deps media-tool \
    --endpoint-url "${media_endpoint}" \
    s3 rm \
    "s3://${s3_bucket}" \
    --recursive \
    --only-show-errors; then
    exit 1
  fi

  cutover_media_listing=""
  if ! cutover_media_listing="$(
    timeout --foreground "${SMOKE_TIMEOUT}" \
      "${COMPOSE[@]}" run --rm -T --no-deps media-tool \
      --endpoint-url "${media_endpoint}" \
      s3 ls \
      "s3://${s3_bucket}" \
      --recursive
  )"; then
    exit 1
  fi
  [[ -z "${cutover_media_listing}" ]] ||
    production_die "weed mini is not empty; automatic media migration is not allowed"
fi

production_log "Starting the new Payload image and waiting for strict health"
failure_reason="Payload did not become healthy"
if ! "${COMPOSE[@]}" up \
  -d \
  --no-deps \
  --wait \
  --wait-timeout "${DEPLOY_HEALTH_TIMEOUT}" \
  payload; then
  exit 1
fi
phase="payload_started"

smoke_key="_deploy-smoke/${backup_name}"

production_log "Checking media bucket read/write/delete"
failure_reason="media write smoke test failed"
if ! timeout --foreground "${SMOKE_TIMEOUT}" \
  "${COMPOSE[@]}" run --rm -T --no-deps media-tool \
  --endpoint-url "${media_endpoint}" \
  s3api put-object \
  --bucket "${s3_bucket}" \
  --key "${smoke_key}" \
  --body /dev/null >/dev/null; then
  exit 1
fi

failure_reason="media read smoke test failed"
if ! timeout --foreground "${SMOKE_TIMEOUT}" \
  "${COMPOSE[@]}" run --rm -T --no-deps media-tool \
  --endpoint-url "${media_endpoint}" \
  s3api head-object \
  --bucket "${s3_bucket}" \
  --key "${smoke_key}" >/dev/null; then
  timeout --foreground "${SMOKE_TIMEOUT}" \
    "${COMPOSE[@]}" run --rm -T --no-deps media-tool \
    --endpoint-url "${media_endpoint}" \
    s3api delete-object \
    --bucket "${s3_bucket}" \
    --key "${smoke_key}" >/dev/null 2>&1 || true
  exit 1
fi

failure_reason="media cleanup smoke test failed"
timeout --foreground "${SMOKE_TIMEOUT}" \
  "${COMPOSE[@]}" run --rm -T --no-deps media-tool \
  --endpoint-url "${media_endpoint}" \
  s3api delete-object \
  --bucket "${s3_bucket}" \
  --key "${smoke_key}" >/dev/null

phase="traffic_starting"
production_log "Starting Cloudflare Tunnel"
failure_reason="Cloudflare Tunnel did not become healthy"
if ! "${COMPOSE[@]}" up \
  -d \
  --no-deps \
  --wait \
  --wait-timeout "${TUNNEL_HEALTH_TIMEOUT}" \
  cloudflared; then
  exit 1
fi

production_log "Checking the external health revision: ${smoke_url}"
failure_reason="external health response did not match release ${release_revision}"
check_external_health "${smoke_url}" "${release_revision}" 10

production_log "Checking a representative page: ${page_smoke_url}"
failure_reason="representative page smoke test failed"
check_external_page "${page_smoke_url}" 10
phase="traffic_enabled"

release_record="${STATE_DIR}/releases/${backup_name}.env"
release_tmp="$(mktemp "${STATE_DIR}/releases/.release.XXXXXX")"
{
  printf 'deployed_at=%s\n' "$(date -u +%FT%TZ)"
  printf 'release_revision=%s\n' "${release_revision}"
  printf 'payload_image=%s\n' "${payload_image}"
  printf 'migrator_image=%s\n' "${migrator_image}"
  printf 'backup_path=%s\n' "${backup_path}"
  printf 'migration_status=success\n'
  printf 'smoke_url=%s\n' "${smoke_url}"
  printf 'page_smoke_url=%s\n' "${page_smoke_url}"
} >"${release_tmp}"
chmod 600 "${release_tmp}"
atomic_replace_private_file \
  "${release_tmp}" \
  "${release_record}" \
  "release record"
release_tmp=""

state_tmp="$(mktemp "${STATE_DIR}/.current-images.XXXXXX")"
cp -- "${IMAGE_ENV_FILE}" "${state_tmp}"
chmod 600 "${state_tmp}"
atomic_replace_private_file \
  "${state_tmp}" \
  "${STATE_DIR}/current-images.env" \
  "current release state"
state_tmp=""

phase="finalizing"
failure_reason="could not finalize successful deployment state"
remove_restore_marker
if [[ "${weed_mini_cutover_pending}" == "true" ]]; then
  remove_weed_mini_cutover_marker
  weed_mini_cutover_pending=false
fi

production_log "Removing services retired from the legacy stack"
if ! "${COMPOSE[@]}" up \
  -d \
  --no-deps \
  --no-recreate \
  --remove-orphans \
  payload >/dev/null; then
  production_error "legacy orphan cleanup failed; retry it after deployment"
fi

phase="complete"
failure_reason=""
production_log "Deployment completed"
printf 'RELEASE_REVISION=%s\n' "${release_revision}"
printf 'PAYLOAD_IMAGE=%s\n' "${payload_image}"
printf 'BACKUP_PATH=%s\n' "${backup_path}"
