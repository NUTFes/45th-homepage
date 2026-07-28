#!/usr/bin/env bash
set -Eeuo pipefail
umask 077

SCRIPT_DIR="$(cd -P -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
OPERATION_NAME="restore"
# shellcheck source=scripts/production-common.sh
source "${SCRIPT_DIR}/production-common.sh"

RESTORE_HEALTH_TIMEOUT="${RESTORE_HEALTH_TIMEOUT:-180}"
RESTORE_OPERATION_TIMEOUT="${RESTORE_OPERATION_TIMEOUT:-3600}"

restore_media=false
assume_yes=false
recovery_name=""

usage() {
  echo "Usage: $0 <recovery-point-name> [--restore-media] [--yes]"
  echo
  echo "Restores PostgreSQL and the previous Payload image from a verified"
  echo "recovery point. Media is replaced only when --restore-media is given."
}

while (($# > 0)); do
  case "$1" in
    --restore-media)
      restore_media=true
      ;;
    --yes)
      assume_yes=true
      ;;
    -h | --help)
      usage
      exit 0
      ;;
    -*)
      usage >&2
      production_die "unknown option: $1"
      ;;
    *)
      [[ -z "${recovery_name}" ]] ||
        production_die "only one recovery point may be specified"
      recovery_name="$1"
      ;;
  esac
  shift
done

[[ -n "${recovery_name}" ]] || {
  usage >&2
  exit 2
}
[[ "${recovery_name}" =~ ^[A-Za-z0-9._-]+$ ]] ||
  production_die "recovery point must be a directory name, not a path"

for command_name in cmp curl docker flock grep mktemp realpath sha256sum stat timeout; do
  require_command "${command_name}"
done
validate_positive_integer RESTORE_HEALTH_TIMEOUT "${RESTORE_HEALTH_TIMEOUT}"
validate_positive_integer RESTORE_OPERATION_TIMEOUT "${RESTORE_OPERATION_TIMEOUT}"

[[ -f "${COMPOSE_FILE}" && ! -L "${COMPOSE_FILE}" ]] ||
  production_die "Compose file not found or is a symlink: ${COMPOSE_FILE}"
validate_production_environment
prepare_state_directory
backup_dir="$(validate_backup_directory "$(read_env_value BACKUP_DIR "${ENV_FILE}")")"
s3_bucket="$(read_env_value S3_BUCKET "${ENV_FILE}")"
site_url="$(read_env_value NEXT_PUBLIC_SITE_URL "${ENV_FILE}")"
smoke_url="${PRODUCTION_SMOKE_URL:-${site_url%/}/api/health}"
page_smoke_url="${PRODUCTION_PAGE_SMOKE_URL:-${site_url%/}/}"
weed_mini_cutover_file="${STATE_DIR}/weed-mini-cutover.env"

recovery_path="${backup_dir}/${recovery_name}"
[[ -d "${recovery_path}" && ! -L "${recovery_path}" ]] ||
  production_die "recovery point does not exist or is a symlink: ${recovery_path}"
[[ "$(realpath -e -- "${recovery_path}")" == "${recovery_path}" ]] ||
  production_die "recovery point path is not canonical: ${recovery_path}"

acquire_production_lock
validate_local_docker

for required_path in \
  COMPLETE \
  manifest.env \
  postgres.dump \
  SHA256SUMS \
  media-files.txt \
  MEDIA_SHA256SUMS \
  target-images.env; do
  [[ -f "${recovery_path}/${required_path}" && ! -L "${recovery_path}/${required_path}" ]] ||
    production_die "recovery point is missing ${required_path}"
done
[[ -d "${recovery_path}/media" && ! -L "${recovery_path}/media" ]] ||
  production_die "recovery point is missing its media directory"
[[ "$(<"${recovery_path}/COMPLETE")" == "ok" ]] ||
  production_die "recovery point does not have a valid COMPLETE marker"

previous_record_present=false
legacy_record_present=false
if path_exists "${recovery_path}/previous-images.env"; then
  validate_private_file \
    "${recovery_path}/previous-images.env" \
    "previous release record"
  previous_record_present=true
fi
if path_exists "${recovery_path}/legacy-rollback.env"; then
  validate_private_file \
    "${recovery_path}/legacy-rollback.env" \
    "legacy rollback record"
  legacy_record_present=true
fi
[[ "${previous_record_present}" != "true" ||
  "${legacy_record_present}" != "true" ]] ||
  production_die "recovery point has multiple rollback authorities"

root_checksum_count="$(wc -l <"${recovery_path}/SHA256SUMS" | tr -d ' ')"
expected_root_checksum_count=6
[[ "${previous_record_present}" != "true" ]] ||
  ((expected_root_checksum_count += 1))
[[ "${legacy_record_present}" != "true" ]] ||
  ((expected_root_checksum_count += 1))
[[ "${root_checksum_count}" == "${expected_root_checksum_count}" ]] ||
  production_die "recovery point root checksum coverage is incomplete"

root_checksum_files=(
  COMPLETE
  manifest.env
  postgres.dump
  media-files.txt
  MEDIA_SHA256SUMS
  target-images.env
)
[[ "${previous_record_present}" != "true" ]] ||
  root_checksum_files+=(previous-images.env)
[[ "${legacy_record_present}" != "true" ]] ||
  root_checksum_files+=(legacy-rollback.env)
for checksum_file in "${root_checksum_files[@]}"; do
  cut -d ' ' -f 3 "${recovery_path}/SHA256SUMS" |
    grep -Fxq "${checksum_file}" ||
    production_die "root checksum does not cover ${checksum_file}"
done

production_log "Verifying recovery point checksums and PostgreSQL archive"
(
  cd "${recovery_path}"
  if find media -type l -print -quit | grep -q . ||
    find media ! -type d ! -type f -print -quit | grep -q .; then
    production_die "media recovery data contains a symlink or special file"
  fi
  sha256sum --check --strict SHA256SUMS
)
if ! cmp --silent \
  <(
    cd "${recovery_path}"
    find media -type f -print0 |
      LC_ALL=C sort -z |
      xargs -0 -r sha256sum
  ) \
  "${recovery_path}/MEDIA_SHA256SUMS"; then
  production_die "media checksum manifest does not exactly cover recovery media"
fi

backup_bucket="$(read_env_value media_bucket "${recovery_path}/manifest.env")"
[[ "${backup_bucket}" == "${s3_bucket}" ]] ||
  production_die "recovery point bucket ${backup_bucket} does not match configured bucket ${s3_bucket}"
expected_media_count="$(read_env_value media_files "${recovery_path}/manifest.env")"
expected_media_bytes="$(read_env_value media_bytes "${recovery_path}/manifest.env")"
actual_media_count="$(find "${recovery_path}/media" -type f | wc -l | tr -d ' ')"
actual_media_bytes="$(
  find "${recovery_path}/media" -type f -printf '%s\n' |
    awk '{sum += $1} END {print sum + 0}'
)"
media_checksum_count="$(
  wc -l <"${recovery_path}/MEDIA_SHA256SUMS" |
    tr -d ' '
)"
[[ "${actual_media_count}" == "${expected_media_count}" &&
  "${actual_media_bytes}" == "${expected_media_bytes}" &&
  "${media_checksum_count}" == "${actual_media_count}" ]] ||
  production_die "media files do not match the recovery manifest"

restore_mode="immutable"
if [[ "${previous_record_present}" == "true" ]]; then
  restore_image_file="${recovery_path}/previous-images.env"
elif [[ "${legacy_record_present}" == "true" ]]; then
  restore_image_file="${recovery_path}/legacy-rollback.env"
else
  restore_image_file="${recovery_path}/target-images.env"
  restore_mode="bootstrap"
fi
validate_release_record "${restore_image_file}" true

restore_payload_image="${validated_payload_image}"
restore_migrator_image="${validated_migrator_image}"
restore_revision="${validated_release_revision}"

if path_exists "${STATE_DIR}/current-images.env"; then
  validate_release_record "${STATE_DIR}/current-images.env" true
  [[ "${restore_mode}" != "bootstrap" ]] ||
    production_die "bootstrap recovery cannot replace an established current release"
fi
if path_exists "${STATE_DIR}/legacy-rollback.env"; then
  validate_release_record "${STATE_DIR}/legacy-rollback.env" true
  [[ "${restore_mode}" != "bootstrap" ]] ||
    production_die "bootstrap recovery cannot replace an established legacy release"
fi

if [[ "${restore_revision}" == "legacy" ]]; then
  restore_mode="legacy"
  expected_legacy_id="${validated_expected_image_id}"
  actual_legacy_id="$(
    docker image inspect --format '{{.Id}}' "${restore_payload_image}" 2>/dev/null
  )" || production_die "preserved legacy image is not available locally"
  [[ "${actual_legacy_id}" == "${expected_legacy_id}" ]] ||
    production_die "preserved legacy tag no longer points to the recorded image"
else
  production_log "Pulling the recorded rollback image"
  docker pull "${restore_payload_image}" >/dev/null
  image_revision="$(
    docker image inspect \
      --format '{{index .Config.Labels "org.opencontainers.image.revision"}}' \
      "${restore_payload_image}"
  )"
  [[ "${image_revision}" == "${restore_revision}" ]] ||
    production_die "rollback image revision label does not match its record"
fi
production_log "Pulling the recorded migration utility image"
docker pull "${restore_migrator_image}" >/dev/null
if [[ "${restore_revision}" != "legacy" ]]; then
  migrator_revision="$(
    docker image inspect \
      --format '{{index .Config.Labels "org.opencontainers.image.revision"}}' \
      "${restore_migrator_image}"
  )"
  [[ "${migrator_revision}" == "${restore_revision}" ]] ||
    production_die "rollback migrator revision label does not match its record"
fi

build_compose_command "${restore_image_file}"
"${COMPOSE[@]}" config -q
verify_database_url_identity payload-migrate
require_at_most_one_service_container payload
require_at_most_one_service_container cloudflared
require_service_healthy postgres
"${COMPOSE[@]}" pull cloudflared
"${COMPOSE[@]}" pull media-tool

timeout --foreground "${RESTORE_OPERATION_TIMEOUT}" \
  "${COMPOSE[@]}" exec -T postgres pg_restore --list \
  <"${recovery_path}/postgres.dump" >/dev/null

backup_postgres_user="$(read_env_value postgres_user "${recovery_path}/manifest.env")"
backup_postgres_db="$(read_env_value postgres_db "${recovery_path}/manifest.env")"
configured_postgres_user="$(read_env_value POSTGRES_USER "${ENV_FILE}")"
configured_postgres_db="$(read_env_value POSTGRES_DB "${ENV_FILE}")"
[[ "${backup_postgres_user}" == "${configured_postgres_user}" &&
  "${backup_postgres_db}" == "${configured_postgres_db}" ]] ||
  production_die "recovery point PostgreSQL identity does not match production configuration"

marker_media_required=false
if path_exists "${RESTORE_REQUIRED_FILE}"; then
  validate_restore_marker
  [[ "${validated_marker_backup_path}" == "${recovery_path}" ]] ||
    production_die "restore-required marker names a different recovery point"
  marker_media_required="${validated_marker_media_required}"
fi
if [[ "${marker_media_required}" == "true" && "${restore_media}" != "true" ]]; then
  production_die "this recovery requires --restore-media because traffic may have written media"
fi
if [[ "${restore_mode}" == "legacy" && "${restore_media}" != "true" ]]; then
  production_die "legacy recovery requires --restore-media to keep its database and media consistent"
fi

if [[ "${assume_yes}" != "true" ]]; then
  printf 'Recovery point: %s\n' "${recovery_path}"
  printf 'Payload image:  %s\n' "${restore_payload_image}"
  printf 'Restore mode:   %s\n' "${restore_mode}"
  printf 'Restore media:  %s\n' "${restore_media}"
  printf 'Type the recovery point name to continue: '
  read -r confirmation
  [[ "${confirmation}" == "${recovery_name}" ]] ||
    production_die "confirmation did not match; no changes were made"
fi

phase="pre_stop"
failure_reason=""
media_listing=""
rollback_tmp=""
state_tmp=""
desired_tmp=""
restore_marker_tmp=""
cutover_marker_tmp=""

write_restore_marker() {
  local media_required="$1"

  restore_marker_tmp="$(mktemp "${STATE_DIR}/.restore-required.XXXXXX")"
  {
    printf 'operation=restore\n'
    printf 'created_at=%s\n' "$(date -u +%FT%TZ)"
    printf 'release_revision=%s\n' "${restore_revision}"
    printf 'backup_path=%s\n' "${recovery_path}"
    printf 'media_restore_required=%s\n' "${media_required}"
  } >"${restore_marker_tmp}"
  chmod 600 "${restore_marker_tmp}"
  atomic_replace_private_file \
    "${restore_marker_tmp}" \
    "${RESTORE_REQUIRED_FILE}" \
    "restore-required marker"
  restore_marker_tmp=""
}

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
  if path_exists "${weed_mini_cutover_file}"; then
    validate_weed_mini_cutover_marker
  fi

  cutover_marker_tmp="$(mktemp "${STATE_DIR}/.weed-mini-cutover.XXXXXX")"
  {
    printf 'status=pending\n'
    printf 'created_at=%s\n' "$(date -u +%FT%TZ)"
    printf 'backup_path=%s\n' "${recovery_path}"
  } >"${cutover_marker_tmp}"
  chmod 600 "${cutover_marker_tmp}"
  atomic_replace_private_file \
    "${cutover_marker_tmp}" \
    "${weed_mini_cutover_file}" \
    "weed mini cutover marker"
  cutover_marker_tmp=""
}

handle_failed_restore() {
  local exit_code=$?

  trap - ERR EXIT INT TERM
  set +e
  [[ -z "${media_listing}" ]] || rm -f -- "${media_listing}"
  [[ -z "${rollback_tmp}" ]] || rm -f -- "${rollback_tmp}"
  [[ -z "${state_tmp}" ]] || rm -f -- "${state_tmp}"
  [[ -z "${desired_tmp}" ]] || rm -f -- "${desired_tmp}"
  [[ -z "${restore_marker_tmp}" ]] || rm -f -- "${restore_marker_tmp}"
  [[ -z "${cutover_marker_tmp}" ]] || rm -f -- "${cutover_marker_tmp}"
  if [[ "${phase}" != "pre_stop" && "${phase}" != "complete" ]]; then
    "${COMPOSE[@]}" stop -t 10 cloudflared payload >/dev/null 2>&1
    printf '\n[restore] RESTORE INCOMPLETE: %s\n' \
      "${failure_reason:-unexpected restore error}" >&2
    printf '[restore] Payload and external traffic remain stopped.\n' >&2
    printf '[restore] Recovery point: %s\n' "${recovery_path}" >&2
    if path_exists "${RESTORE_REQUIRED_FILE}"; then
      validate_restore_marker
      if [[ "${validated_marker_media_required}" == "true" ]]; then
        printf '[restore] Retry with --restore-media; traffic may have changed media.\n' >&2
      fi
    fi
  fi
  exit "${exit_code}"
}

record_restore_error() {
  local exit_code=$?
  local line="$1"

  if [[ -z "${failure_reason}" ]]; then
    failure_reason="command failed at line ${line} (exit ${exit_code})"
  fi
  return "${exit_code}"
}

trap 'record_restore_error "${LINENO}"' ERR
trap handle_failed_restore EXIT
trap 'failure_reason="restore interrupted"; exit 130' INT
trap 'failure_reason="restore terminated"; exit 143' TERM

media_required_for_marker=false
if [[ "${marker_media_required}" == "true" || "${restore_media}" == "true" ]]; then
  media_required_for_marker=true
fi
write_restore_marker "${media_required_for_marker}"
phase="restore_marked"

phase="stop_started"
failure_reason="could not stop Payload and Cloudflare Tunnel"
production_log "Stopping external traffic and Payload"
stop_all_service_containers payload-migrate 10
"${COMPOSE[@]}" stop -t 30 cloudflared payload
require_no_running_service_containers payload-migrate
require_no_running_service_containers payload
require_no_running_service_containers cloudflared

if [[ "${restore_mode}" == "legacy" ]]; then
  write_weed_mini_cutover_marker
  production_log "Re-armed the weed mini cutover marker for the next deploy"
fi

phase="storage_ready"
failure_reason="weed mini or the media bucket did not become ready"
if [[ "$(service_health_status seaweedfs-s3 || true)" != "healthy" ]]; then
  production_log "Starting weed mini so the verified media backup can be restored"
  "${COMPOSE[@]}" up \
    -d \
    --no-deps \
    --wait \
    --wait-timeout "${RESTORE_HEALTH_TIMEOUT}" \
    seaweedfs-s3
fi
require_service_healthy seaweedfs-s3

production_log "Waiting for the authenticated media bucket"
restore_bucket_ready=false
restore_bucket_deadline=$((SECONDS + RESTORE_HEALTH_TIMEOUT))
while ((SECONDS < restore_bucket_deadline)); do
  if timeout --foreground 10 \
    "${COMPOSE[@]}" run --rm -T --no-deps media-tool \
    --endpoint-url http://seaweedfs-s3:8333 \
    s3api head-bucket \
    --bucket "${s3_bucket}" >/dev/null 2>&1; then
    restore_bucket_ready=true
    break
  fi
  ((SECONDS < restore_bucket_deadline)) && sleep 2
done
[[ "${restore_bucket_ready}" == "true" ]] ||
  production_die "media bucket did not become ready"

phase="database_restore"
failure_reason="PostgreSQL database recreation failed"
production_log "Recreating the PostgreSQL database"
# shellcheck disable=SC2016 # Variables expand inside the PostgreSQL container.
timeout --foreground "${RESTORE_OPERATION_TIMEOUT}" \
  "${COMPOSE[@]}" exec -T postgres sh -ec \
  'PGPASSWORD="$POSTGRES_PASSWORD" dropdb \
      --if-exists \
      --force \
      --host=127.0.0.1 \
      --username="$POSTGRES_USER" \
      "$POSTGRES_DB"
   PGPASSWORD="$POSTGRES_PASSWORD" createdb \
      --host=127.0.0.1 \
      --username="$POSTGRES_USER" \
      "$POSTGRES_DB"'

failure_reason="PostgreSQL restore failed"
# shellcheck disable=SC2016 # Variables expand inside the PostgreSQL container.
timeout --foreground "${RESTORE_OPERATION_TIMEOUT}" \
  "${COMPOSE[@]}" exec -T postgres sh -ec \
  'PGPASSWORD="$POSTGRES_PASSWORD" exec pg_restore \
    --host=127.0.0.1 \
    --username="$POSTGRES_USER" \
    --dbname="$POSTGRES_DB" \
    --no-owner \
    --no-acl \
    --exit-on-error \
    --single-transaction' \
  <"${recovery_path}/postgres.dump"

if [[ "${restore_media}" == "true" ]]; then
  phase="media_restore"
  failure_reason="media bucket restore failed"
  production_log "Replacing media bucket ${s3_bucket} from the recovery point"
  timeout --foreground "${RESTORE_OPERATION_TIMEOUT}" \
    "${COMPOSE[@]}" run --rm -T --no-deps media-tool \
    --endpoint-url http://seaweedfs-s3:8333 \
    s3 rm \
    "s3://${s3_bucket}" \
    --recursive \
    --only-show-errors

  run_as="$(id -u):$(id -g)"
  timeout --foreground "${RESTORE_OPERATION_TIMEOUT}" \
    "${COMPOSE[@]}" run --rm -T --no-deps --user "${run_as}" media-tool \
    --endpoint-url http://seaweedfs-s3:8333 \
    s3 cp \
    "/backups/${recovery_name}/media" \
    "s3://${s3_bucket}" \
    --recursive \
    --no-follow-symlinks \
    --only-show-errors

  media_listing="$(mktemp "${STATE_DIR}/.restore-media.XXXXXX")"
  timeout --foreground "${RESTORE_OPERATION_TIMEOUT}" \
    "${COMPOSE[@]}" run --rm -T --no-deps media-tool \
    --endpoint-url http://seaweedfs-s3:8333 \
    s3 ls \
    "s3://${s3_bucket}" \
    --recursive >"${media_listing}"

  restored_count="$(awk 'NF >= 4 {count += 1} END {print count + 0}' "${media_listing}")"
  restored_bytes="$(awk 'NF >= 4 {sum += $3} END {print sum + 0}' "${media_listing}")"
  expected_count="$(read_env_value media_files "${recovery_path}/manifest.env")"
  expected_bytes="$(read_env_value media_bytes "${recovery_path}/manifest.env")"
  rm -f -- "${media_listing}"
  media_listing=""
  [[ "${restored_count}" == "${expected_count}" && "${restored_bytes}" == "${expected_bytes}" ]] ||
    production_die "restored media count or size does not match the recovery point"
fi

if [[ "${restore_mode}" == "bootstrap" ]]; then
  rollback_record="${STATE_DIR}/releases/$(date -u +%Y%m%dT%H%M%SZ)-bootstrap-restore-${BASHPID}.env"
  rollback_tmp="$(mktemp "${STATE_DIR}/releases/.bootstrap-restore.XXXXXX")"
  {
    printf 'restored_at=%s\n' "$(date -u +%FT%TZ)"
    printf 'recovery_path=%s\n' "${recovery_path}"
    printf 'release_revision=%s\n' "${restore_revision}"
    printf 'payload_started=false\n'
    printf 'media_restored=%s\n' "${restore_media}"
  } >"${rollback_tmp}"
  chmod 600 "${rollback_tmp}"
  atomic_replace_private_file \
    "${rollback_tmp}" \
    "${rollback_record}" \
    "bootstrap restore record"
  rollback_tmp=""

  "${COMPOSE[@]}" rm --force --stop payload cloudflared >/dev/null
  remove_restore_marker
  phase="complete"
  failure_reason=""
  production_log "Bootstrap database restore completed; Payload and Tunnel remain stopped"
  production_log "Re-run deploy-production.sh to perform a clean first application deploy"
  exit 0
fi

write_restore_marker true
phase="payload_start"
failure_reason="rollback Payload image did not become healthy"
production_log "Starting the rollback Payload image"
"${COMPOSE[@]}" up \
  -d \
  --no-deps \
  --pull never \
  --wait \
  --wait-timeout "${RESTORE_HEALTH_TIMEOUT}" \
  payload

phase="traffic_starting"
failure_reason="Cloudflare Tunnel did not become healthy"
production_log "Starting Cloudflare Tunnel"
"${COMPOSE[@]}" up \
  -d \
  --no-deps \
  --wait \
  --wait-timeout "${RESTORE_HEALTH_TIMEOUT}" \
  cloudflared

expected_external_revision="${restore_revision}"
[[ "${restore_mode}" == "immutable" ]] || expected_external_revision=""
failure_reason="external health did not reach the rollback release"
check_external_health "${smoke_url}" "${expected_external_revision}" 10
failure_reason="representative page failed after restore"
check_external_page "${page_smoke_url}" 10

rollback_record="${STATE_DIR}/releases/$(date -u +%Y%m%dT%H%M%SZ)-rollback-${BASHPID}.env"
rollback_tmp="$(mktemp "${STATE_DIR}/releases/.rollback.XXXXXX")"
{
  printf 'restored_at=%s\n' "$(date -u +%FT%TZ)"
  printf 'recovery_path=%s\n' "${recovery_path}"
  printf 'release_revision=%s\n' "${restore_revision}"
  printf 'payload_image=%s\n' "${restore_payload_image}"
  printf 'media_restored=%s\n' "${restore_media}"
} >"${rollback_tmp}"
chmod 600 "${rollback_tmp}"
atomic_replace_private_file \
  "${rollback_tmp}" \
  "${rollback_record}" \
  "rollback record"
rollback_tmp=""

state_tmp="$(mktemp "${STATE_DIR}/.current-images.XXXXXX")"
cp -- "${restore_image_file}" "${state_tmp}"
chmod 600 "${state_tmp}"
atomic_replace_private_file \
  "${state_tmp}" \
  "${STATE_DIR}/current-images.env" \
  "current release state"
state_tmp=""

if [[ "${restore_mode}" == "immutable" ]]; then
  desired_tmp="$(mktemp "${PRODUCTION_ROOT}/.production-images.XXXXXX")"
  cp -- "${restore_image_file}" "${desired_tmp}"
  chmod 600 "${desired_tmp}"
  atomic_replace_private_file \
    "${desired_tmp}" \
    "${IMAGE_ENV_FILE}" \
    "desired release manifest"
  desired_tmp=""
fi

remove_restore_marker
phase="complete"
failure_reason=""
production_log "Restore completed"
printf 'RELEASE_REVISION=%s\n' "${restore_revision}"
printf 'PAYLOAD_IMAGE=%s\n' "${restore_payload_image}"
printf 'MEDIA_RESTORED=%s\n' "${restore_media}"
