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
smoke_url="${PRODUCTION_SMOKE_URL:-${site_url%/}/api/health}"
page_smoke_url="${PRODUCTION_PAGE_SMOKE_URL:-${site_url%/}/}"

build_compose_command
"${COMPOSE[@]}" config -q
validate_local_docker
acquire_production_lock
require_no_restore_marker

available_kib="$(df -Pk "${backup_dir}" | awk 'NR == 2 {print $4}')"
[[ "${available_kib}" =~ ^[0-9]+$ ]] ||
  production_die "could not determine free backup space"
((available_kib >= MIN_BACKUP_FREE_KIB)) ||
  production_die "BACKUP_DIR has less than $((MIN_BACKUP_FREE_KIB / 1024)) MiB free"

production_log "Pulling the immutable release and pinned edge/backup tools"
"${COMPOSE[@]}" pull payload payload-migrate cloudflared media-tool
verify_release_images
verify_database_url_identity payload-migrate

for service in postgres seaweedfs-master seaweedfs-volume seaweedfs-filer seaweedfs-s3; do
  require_service_healthy "${service}"
done

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

for service in postgres seaweedfs-master seaweedfs-volume seaweedfs-filer seaweedfs-s3; do
  require_service_healthy "${service}"
done

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

s3_bucket="$(read_env_value S3_BUCKET "${ENV_FILE}")"
media_endpoint="http://seaweedfs-s3:8333"
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

production_log "Removing services retired from the legacy stack"
failure_reason="legacy orphan cleanup failed"
"${COMPOSE[@]}" up \
  -d \
  --no-deps \
  --no-recreate \
  --remove-orphans \
  payload >/dev/null

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

remove_restore_marker
phase="complete"
failure_reason=""
production_log "Deployment completed"
printf 'RELEASE_REVISION=%s\n' "${release_revision}"
printf 'PAYLOAD_IMAGE=%s\n' "${payload_image}"
printf 'BACKUP_PATH=%s\n' "${backup_path}"
