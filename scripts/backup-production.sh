#!/usr/bin/env bash
set -Eeuo pipefail
umask 077

SCRIPT_DIR="$(cd -P -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
OPERATION_NAME="backup"
# shellcheck source=scripts/production-common.sh
source "${SCRIPT_DIR}/production-common.sh"

RECOVERY_HEALTH_TIMEOUT="${RECOVERY_HEALTH_TIMEOUT:-180}"
BACKUP_OPERATION_TIMEOUT="${BACKUP_OPERATION_TIMEOUT:-3600}"
MIN_BACKUP_FREE_KIB="${MIN_BACKUP_FREE_KIB:-1048576}"

stop_app=false

usage() {
  echo "Usage: $0 [--stop-app]"
  echo
  echo "Creates one recovery point containing a verified PostgreSQL dump and"
  echo "a logical copy of the SeaweedFS S3 bucket."
}

while (($# > 0)); do
  case "$1" in
    --stop-app)
      stop_app=true
      ;;
    -h | --help)
      usage
      exit 0
      ;;
    *)
      usage >&2
      production_die "unknown argument: $1"
      ;;
  esac
  shift
done

for command_name in curl docker flock grep realpath sha256sum stat timeout; do
  require_command "${command_name}"
done
validate_positive_integer RECOVERY_HEALTH_TIMEOUT "${RECOVERY_HEALTH_TIMEOUT}"
validate_positive_integer BACKUP_OPERATION_TIMEOUT "${BACKUP_OPERATION_TIMEOUT}"
validate_positive_integer MIN_BACKUP_FREE_KIB "${MIN_BACKUP_FREE_KIB}"

[[ -f "${COMPOSE_FILE}" && ! -L "${COMPOSE_FILE}" ]] ||
  production_die "Compose file not found or is a symlink: ${COMPOSE_FILE}"
validate_production_environment
validate_release_manifest
prepare_state_directory

backup_dir="$(validate_backup_directory "$(read_env_value BACKUP_DIR "${ENV_FILE}")")"
s3_bucket="$(read_env_value S3_BUCKET "${ENV_FILE}")"
site_url="$(read_env_value NEXT_PUBLIC_SITE_URL "${ENV_FILE}")"
smoke_url="${PRODUCTION_SMOKE_URL:-${site_url%/}/api/health}"
media_endpoint="http://seaweedfs-s3:8333"

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

for service in postgres seaweedfs-master seaweedfs-volume seaweedfs-filer seaweedfs-s3; do
  require_service_healthy "${service}"
done

require_at_most_one_service_container payload
require_at_most_one_service_container cloudflared

if [[ -z "${PRODUCTION_LOCK_FD:-}" ]]; then
  production_log "Ensuring the pinned migration and media backup tools are available"
  "${COMPOSE[@]}" pull payload-migrate media-tool
fi
verify_database_url_identity payload-migrate
require_no_running_service_containers payload-migrate
timeout --foreground "${BACKUP_OPERATION_TIMEOUT}" \
  "${COMPOSE[@]}" run --rm -T --no-deps media-tool \
  --endpoint-url "${media_endpoint}" \
  s3api head-bucket \
  --bucket "${s3_bucket}" >/dev/null

payload_was_running=false
tunnel_was_running=false
running_payload_ref=""
running_payload_id=""
running_payload_revision=""
payload_container="$(compose_container_id payload)"

if is_service_running payload; then
  payload_was_running=true
  running_payload_ref="$(docker inspect --format '{{.Config.Image}}' "${payload_container}")"
  running_payload_id="$(docker inspect --format '{{.Image}}' "${payload_container}")"
  running_payload_revision="$(
    docker inspect \
      --format '{{index .Config.Labels "org.opencontainers.image.revision"}}' \
      "${payload_container}" 2>/dev/null ||
      true
  )"
fi
if is_service_running cloudflared; then
  tunnel_was_running=true
fi

current_record_present=false
legacy_record_present=false
if path_exists "${STATE_DIR}/current-images.env"; then
  validate_current_release_state "${payload_container}"
  current_record_present=true
elif path_exists "${STATE_DIR}/legacy-rollback.env"; then
  validate_release_against_container \
    "${STATE_DIR}/legacy-rollback.env" \
    "${payload_container}"
  legacy_record_present=true
elif [[ -n "${payload_container}" ]]; then
  [[ "${payload_was_running}" == "true" ]] ||
    production_die "an untracked stopped Payload container exists; remove it or restore a recorded release"

  legacy_tag="45th-homepage:rollback-$(date -u +%Y%m%dT%H%M%SZ)-${BASHPID}"
  production_log "Preserving the untracked Payload image as ${legacy_tag}"
  docker image tag "${running_payload_id}" "${legacy_tag}"
  legacy_tmp="$(mktemp "${STATE_DIR}/.legacy-rollback.XXXXXX")"
  {
    printf 'PAYLOAD_IMAGE=%s\n' "${legacy_tag}"
    printf 'PAYLOAD_MIGRATOR_IMAGE=%s\n' "${migrator_image}"
    printf 'RELEASE_REVISION=legacy\n'
    printf 'EXPECTED_PAYLOAD_IMAGE_ID=%s\n' "${running_payload_id}"
    printf 'ORIGINAL_PAYLOAD_IMAGE=%s\n' "${running_payload_ref}"
  } >"${legacy_tmp}"
  chmod 600 "${legacy_tmp}"
  atomic_replace_private_file \
    "${legacy_tmp}" \
    "${STATE_DIR}/legacy-rollback.env" \
    "legacy rollback record"
  legacy_record_present=true
fi

phase="pre_stop"
backup_complete=false
work_path=""

restore_previous_runtime() {
  local restore_status=0

  if [[ "${payload_was_running}" == "true" ]]; then
    production_log "Restarting the previously running Payload container"
    if ! "${COMPOSE[@]}" start payload >/dev/null ||
      ! wait_for_health payload "${RECOVERY_HEALTH_TIMEOUT}"; then
      production_error "previous Payload container could not be restored"
      restore_status=1
    fi
  fi

  if [[ "${tunnel_was_running}" == "true" ]]; then
    if [[ "${payload_was_running}" == "true" && "${restore_status}" != "0" ]]; then
      production_error "Cloudflare Tunnel remains stopped because Payload recovery failed"
      return 1
    fi

    production_log "Restarting the previously running Cloudflare Tunnel"
    if ! "${COMPOSE[@]}" start cloudflared >/dev/null ||
      ! wait_for_health cloudflared "${RECOVERY_HEALTH_TIMEOUT}"; then
      production_error "previous Cloudflare Tunnel could not be restored"
      restore_status=1
    elif [[ "${payload_was_running}" == "true" ]] &&
      ! check_external_health "${smoke_url}" "" 10; then
      production_error "external health check failed after restoring the previous release"
      restore_status=1
    fi
  fi

  return "${restore_status}"
}

cleanup() {
  local exit_code=$?
  local restore_status=0

  trap - EXIT INT TERM
  set +e

  if [[ "${backup_complete}" != "true" && -n "${work_path}" && -d "${work_path}" ]]; then
    printf 'backup failed at %s\n' "$(date -u +%FT%TZ)" >"${work_path}/FAILED" 2>/dev/null ||
      production_error "could not write FAILED marker to ${work_path}"
  fi

  if [[ "${phase}" != "pre_stop" ]]; then
    restore_previous_runtime
    restore_status=$?
  fi

  if ((restore_status != 0)); then
    exit_code=1
  fi
  exit "${exit_code}"
}

trap cleanup EXIT
trap 'exit 130' INT
trap 'exit 143' TERM

if [[ "${stop_app}" == "true" ]]; then
  phase="stop_started"
  production_log "Stopping Cloudflare Tunnel and Payload to freeze writes"
  "${COMPOSE[@]}" stop -t 30 cloudflared payload
  phase="app_stopped"
elif [[ "${payload_was_running}" == "true" || "${tunnel_was_running}" == "true" ]]; then
  production_die "Payload or Tunnel is running; pass --stop-app or let deploy-production.sh call this script"
fi

is_service_running payload &&
  production_die "Payload is still running; refusing an inconsistent backup"
is_service_running cloudflared &&
  production_die "Cloudflare Tunnel is still running; refusing an inconsistent backup"

if [[ -n "${BACKUP_NAME:-}" ]]; then
  [[ -n "${PRODUCTION_LOCK_FD:-}" ]] ||
    production_die "BACKUP_NAME is reserved for deploy-production.sh"
  backup_name="${BACKUP_NAME}"
else
  release_digest="${payload_image##*@sha256:}"
  backup_name="$(date -u +%Y%m%dT%H%M%SZ)-${release_digest:0:12}-${BASHPID}"
fi

[[ "${backup_name}" =~ ^[A-Za-z0-9._-]+$ ]] ||
  production_die "BACKUP_NAME may contain only letters, numbers, dot, underscore, and hyphen"

final_path="${backup_dir}/${backup_name}"
work_path="${backup_dir}/.${backup_name}.incomplete"

[[ ! -e "${final_path}" && ! -L "${final_path}" ]] ||
  production_die "backup already exists: ${final_path}"
[[ ! -e "${work_path}" && ! -L "${work_path}" ]] ||
  production_die "incomplete backup already exists: ${work_path}"

install -d -m 0700 -- "${work_path}" "${work_path}/media"

production_log "Creating PostgreSQL custom-format dump"
db_dump_tmp="${work_path}/postgres.dump.tmp"
db_dump="${work_path}/postgres.dump"
# shellcheck disable=SC2016 # Variables expand inside the PostgreSQL container.
timeout --foreground "${BACKUP_OPERATION_TIMEOUT}" "${COMPOSE[@]}" exec -T postgres sh -ec \
  'PGPASSWORD="$POSTGRES_PASSWORD" exec pg_dump \
    --host=127.0.0.1 \
    --username="$POSTGRES_USER" \
    --dbname="$POSTGRES_DB" \
    --format=custom \
    --no-owner \
    --no-acl' >"${db_dump_tmp}"

[[ -s "${db_dump_tmp}" ]] || production_die "PostgreSQL dump is empty"
timeout --foreground "${BACKUP_OPERATION_TIMEOUT}" \
  "${COMPOSE[@]}" exec -T postgres pg_restore --list \
  <"${db_dump_tmp}" >/dev/null
mv -T -- "${db_dump_tmp}" "${db_dump}"

relative_work_path=".${backup_name}.incomplete"
run_as="$(id -u):$(id -g)"

production_log "Copying media bucket ${s3_bucket} through the S3 API"
timeout --foreground "${BACKUP_OPERATION_TIMEOUT}" \
  "${COMPOSE[@]}" run --rm -T --no-deps --user "${run_as}" media-tool \
  --endpoint-url "${media_endpoint}" \
  s3 sync \
  "s3://${s3_bucket}" \
  "/backups/${relative_work_path}/media" \
  --only-show-errors

timeout --foreground "${BACKUP_OPERATION_TIMEOUT}" \
  "${COMPOSE[@]}" run --rm -T --no-deps --user "${run_as}" media-tool \
  --endpoint-url "${media_endpoint}" \
  s3 ls \
  "s3://${s3_bucket}" \
  --recursive >"${work_path}/media-files.txt"

media_count="$(find "${work_path}/media" -type f | wc -l | tr -d ' ')"
media_bytes="$(
  find "${work_path}/media" -type f -printf '%s\n' |
    awk '{sum += $1} END {print sum + 0}'
)"
listed_count="$(awk 'NF >= 4 {count += 1} END {print count + 0}' "${work_path}/media-files.txt")"
listed_bytes="$(awk 'NF >= 4 {sum += $3} END {print sum + 0}' "${work_path}/media-files.txt")"
[[ "${media_count}" == "${listed_count}" && "${media_bytes}" == "${listed_bytes}" ]] ||
  production_die "media backup count or size does not match the S3 listing"

(
  cd "${work_path}"
  find media -type f -print0 |
    LC_ALL=C sort -z |
    xargs -0 -r sha256sum >MEDIA_SHA256SUMS
)
checksum_media_count="$(wc -l <"${work_path}/MEDIA_SHA256SUMS" | tr -d ' ')"
[[ "${checksum_media_count}" == "${media_count}" ]] ||
  production_die "media checksum coverage does not match the copied media"

cp -- "${IMAGE_ENV_FILE}" "${work_path}/target-images.env"
if [[ "${current_record_present}" == "true" ]]; then
  cp -- "${STATE_DIR}/current-images.env" "${work_path}/previous-images.env"
elif [[ "${legacy_record_present}" == "true" ]]; then
  cp -- "${STATE_DIR}/legacy-rollback.env" "${work_path}/legacy-rollback.env"
fi

postgres_user="$(read_env_value POSTGRES_USER "${ENV_FILE}")"
postgres_db="$(read_env_value POSTGRES_DB "${ENV_FILE}")"
{
  printf 'created_at=%s\n' "$(date -u +%FT%TZ)"
  printf 'backup_name=%s\n' "${backup_name}"
  printf 'target_payload_image=%s\n' "${payload_image}"
  printf 'target_release_revision=%s\n' "${release_revision}"
  printf 'running_payload_ref=%s\n' "${running_payload_ref}"
  printf 'running_payload_image_id=%s\n' "${running_payload_id}"
  printf 'running_payload_revision=%s\n' "${running_payload_revision}"
  printf 'postgres_user=%s\n' "${postgres_user}"
  printf 'postgres_db=%s\n' "${postgres_db}"
  printf 'media_bucket=%s\n' "${s3_bucket}"
  printf 'media_files=%s\n' "${media_count}"
  printf 'media_bytes=%s\n' "${media_bytes}"
  printf 'postgres_dump_bytes=%s\n' "$(stat -c '%s' "${db_dump}")"
} >"${work_path}/manifest.env"

printf 'ok\n' >"${work_path}/COMPLETE"
checksum_files=(
  COMPLETE
  manifest.env
  postgres.dump
  media-files.txt
  MEDIA_SHA256SUMS
  target-images.env
)
[[ "${current_record_present}" != "true" ]] ||
  checksum_files+=(previous-images.env)
[[ "${legacy_record_present}" != "true" ]] ||
  checksum_files+=(legacy-rollback.env)
(
  cd "${work_path}"
  sha256sum "${checksum_files[@]}" >SHA256SUMS
  sha256sum --check --strict --quiet SHA256SUMS
  if [[ -s MEDIA_SHA256SUMS ]]; then
    sha256sum --check --strict --quiet MEDIA_SHA256SUMS
  fi
)

mv -T -- "${work_path}" "${final_path}"
backup_complete=true
phase="backup_complete"

production_log "Verified recovery point: ${final_path}"
printf 'BACKUP_PATH=%s\n' "${final_path}"
