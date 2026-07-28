#!/usr/bin/env bash

# Shared validation and lifecycle helpers for the single-host production scripts.
# This file must be sourced from Bash with `set -Eeuo pipefail` enabled.

PRODUCTION_PROJECT_NAME="45th-homepage"
PRODUCTION_ROOT="$(cd -P -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="${PRODUCTION_ROOT}/.env.production"
IMAGE_ENV_FILE="${PRODUCTION_ROOT}/.env.production.images"
COMPOSE_FILE="${PRODUCTION_ROOT}/compose.prod.yml"
STATE_DIR="${PRODUCTION_ROOT}/.deploy-state"
LOCK_FILE="${STATE_DIR}/production.lock"
RESTORE_REQUIRED_FILE="${STATE_DIR}/restore-required.env"

production_log() {
  printf '[%s] %s\n' "${OPERATION_NAME}" "$*"
}

production_error() {
  printf '[%s] ERROR: %s\n' "${OPERATION_NAME}" "$*" >&2
}

production_die() {
  production_error "$*"
  exit 1
}

require_command() {
  command -v "$1" >/dev/null 2>&1 || production_die "$1 is required"
}

validate_positive_integer() {
  local name="$1"
  local value="$2"

  [[ "${value}" =~ ^[1-9][0-9]*$ ]] ||
    production_die "${name} must be a positive integer"
}

read_env_value() {
  local key="$1"
  local file="$2"
  local value
  local -a matches=()

  mapfile -t matches < <(
    sed -n -E "s/^${key}=(.*)$/\\1/p" "${file}" |
      tr -d '\r'
  )

  ((${#matches[@]} == 1)) ||
    production_die "${key} must occur exactly once in ${file}"
  value="${matches[0]}"

  if [[ "${value}" == \"*\" && "${value}" == *\" ]]; then
    value="${value:1:${#value}-2}"
  elif [[ "${value}" == \'*\' && "${value}" == *\' ]]; then
    value="${value:1:${#value}-2}"
  fi

  [[ -n "${value}" && "${value}" != *$'\n'* ]] ||
    production_die "${key} is empty or invalid in ${file}"
  printf '%s' "${value}"
}

validate_private_file() {
  local file="$1"
  local description="$2"
  local canonical
  local mode
  local owner

  [[ -f "${file}" && ! -L "${file}" ]] ||
    production_die "${description} must be a regular, non-symlink file: ${file}"
  canonical="$(realpath -e -- "${file}")"
  [[ "${canonical}" == "${file}" ]] ||
    production_die "${description} path must be canonical and contain no symlink: ${file}"

  owner="$(stat -c '%u' "${file}")"
  [[ "${owner}" == "${EUID}" ]] ||
    production_die "${description} must be owned by uid ${EUID}: ${file}"

  mode="$(stat -c '%a' "${file}")"
  if ((8#${mode} & 077)); then
    production_die "${description} must not be accessible by group/others (chmod 600 ${file})"
  fi
}

path_exists() {
  [[ -e "$1" || -L "$1" ]]
}

atomic_replace_private_file() {
  local source="$1"
  local destination="$2"
  local description="$3"

  validate_private_file "${source}" "${description} temporary file"
  if path_exists "${destination}"; then
    validate_private_file "${destination}" "${description} destination"
  fi
  mv -T -- "${source}" "${destination}"
}

validate_backup_directory() {
  local requested="$1"
  local canonical
  local mode
  local owner

  while [[ "${requested}" != "/" && "${requested}" == */ ]]; do
    requested="${requested%/}"
  done

  [[ "${requested}" == /* && "${requested}" != "/" ]] ||
    production_die "BACKUP_DIR must be an absolute path other than /"
  [[ ! "${requested}" =~ (^|/)\.\.?(/|$) ]] ||
    production_die "BACKUP_DIR must not contain dot path components"
  [[ -d "${requested}" && ! -L "${requested}" ]] ||
    production_die "BACKUP_DIR must already exist as a non-symlink directory: ${requested}"

  canonical="$(realpath -e -- "${requested}")"
  [[ "${canonical}" == "${requested}" && "${canonical}" != "/" ]] ||
    production_die "BACKUP_DIR must be canonical and contain no symlink: ${requested}"

  owner="$(stat -c '%u' "${canonical}")"
  [[ "${owner}" == "${EUID}" ]] ||
    production_die "BACKUP_DIR must be owned by uid ${EUID}: ${canonical}"

  mode="$(stat -c '%a' "${canonical}")"
  if ((8#${mode} & 077)); then
    production_die "BACKUP_DIR must not be accessible by group/others (chmod 700 ${canonical})"
  fi
  [[ -w "${canonical}" && -x "${canonical}" ]] ||
    production_die "BACKUP_DIR must be writable: ${canonical}"

  printf '%s' "${canonical}"
}

prepare_state_directory() {
  local canonical
  local owner
  local releases_dir="${STATE_DIR}/releases"

  [[ ! -L "${STATE_DIR}" ]] ||
    production_die "STATE_DIR must not be a symlink: ${STATE_DIR}"
  if [[ -e "${STATE_DIR}" && ! -d "${STATE_DIR}" ]]; then
    production_die "STATE_DIR is not a directory: ${STATE_DIR}"
  fi

  if [[ -d "${STATE_DIR}" ]]; then
    canonical="$(realpath -e -- "${STATE_DIR}")"
    [[ "${canonical}" == "${STATE_DIR}" ]] ||
      production_die "STATE_DIR path must be canonical: ${STATE_DIR}"
    owner="$(stat -c '%u' "${STATE_DIR}")"
    [[ "${owner}" == "${EUID}" ]] ||
      production_die "STATE_DIR must be owned by uid ${EUID}: ${STATE_DIR}"
  else
    install -d -m 0700 -- "${STATE_DIR}"
  fi

  chmod 700 -- "${STATE_DIR}"

  [[ ! -L "${releases_dir}" ]] ||
    production_die "release state directory must not be a symlink: ${releases_dir}"
  if [[ -e "${releases_dir}" && ! -d "${releases_dir}" ]]; then
    production_die "release state path is not a directory: ${releases_dir}"
  fi
  if [[ -d "${releases_dir}" ]]; then
    canonical="$(realpath -e -- "${releases_dir}")"
    [[ "${canonical}" == "${releases_dir}" ]] ||
      production_die "release state path must be canonical: ${releases_dir}"
    owner="$(stat -c '%u' "${releases_dir}")"
    [[ "${owner}" == "${EUID}" ]] ||
      production_die "release state directory must be owned by uid ${EUID}"
  else
    install -d -m 0700 -- "${releases_dir}"
  fi
  chmod 700 -- "${releases_dir}"
}

validate_release_record() {
  local file="$1"
  local allow_legacy="${2:-false}"
  local invalid_lines
  local digest_pattern='^.+@sha256:[0-9a-f]{64}$'
  local original_image

  validate_private_file "${file}" "release record"
  validated_release_revision="$(read_env_value RELEASE_REVISION "${file}")"

  if [[ "${allow_legacy}" == "true" && "${validated_release_revision}" == "legacy" ]]; then
    invalid_lines="$(
      sed -E '/^[[:space:]]*(#|$)/d' "${file}" |
        grep -Ev \
          '^(PAYLOAD_IMAGE|PAYLOAD_MIGRATOR_IMAGE|RELEASE_REVISION|EXPECTED_PAYLOAD_IMAGE_ID|ORIGINAL_PAYLOAD_IMAGE)=' ||
        true
    )"
  else
    invalid_lines="$(
      sed -E '/^[[:space:]]*(#|$)/d' "${file}" |
        grep -Ev '^(PAYLOAD_IMAGE|PAYLOAD_MIGRATOR_IMAGE|RELEASE_REVISION)=' ||
        true
    )"
  fi
  [[ -z "${invalid_lines}" ]] ||
    production_die "release record contains unsupported entries: ${file}"

  validated_payload_image="$(read_env_value PAYLOAD_IMAGE "${file}")"
  validated_migrator_image="$(read_env_value PAYLOAD_MIGRATOR_IMAGE "${file}")"
  validated_expected_image_id=""
  validated_original_image=""

  if [[ "${allow_legacy}" == "true" && "${validated_release_revision}" == "legacy" ]]; then
    [[ "${validated_payload_image}" =~ ^[^[:space:]@]+:[^[:space:]]+$ ]] ||
      production_die "legacy PAYLOAD_IMAGE is invalid"
    [[ "${validated_migrator_image}" =~ ${digest_pattern} ]] ||
      production_die "legacy rollback migrator reference must remain an immutable digest"
    validated_expected_image_id="$(read_env_value EXPECTED_PAYLOAD_IMAGE_ID "${file}")"
    original_image="$(read_env_value ORIGINAL_PAYLOAD_IMAGE "${file}")"
    validated_original_image="${original_image}"
    [[ "${validated_expected_image_id}" =~ ^sha256:[0-9a-f]{64}$ ]] ||
      production_die "legacy rollback image ID is invalid"
    [[ "${original_image}" != *[[:space:]]* ]] ||
      production_die "legacy original image reference is invalid"
  else
    [[ "${validated_payload_image}" =~ ${digest_pattern} ]] ||
      production_die "PAYLOAD_IMAGE must be an immutable @sha256 reference"
    [[ "${validated_migrator_image}" =~ ${digest_pattern} ]] ||
      production_die "PAYLOAD_MIGRATOR_IMAGE must be an immutable @sha256 reference"
    [[ "${validated_release_revision}" =~ ^[0-9a-f]{40,64}$ ]] ||
      production_die "RELEASE_REVISION must be a full Git revision"
  fi
}

validate_release_manifest() {
  validate_release_record "${IMAGE_ENV_FILE}" false
  payload_image="${validated_payload_image}"
  migrator_image="${validated_migrator_image}"
  release_revision="${validated_release_revision}"
}

validate_release_against_container() {
  local file="$1"
  local container_id="${2:-}"
  local running_ref
  local running_id
  local running_revision

  validate_release_record "${file}" true
  [[ -n "${container_id}" ]] || return 0

  running_ref="$(docker inspect --format '{{.Config.Image}}' "${container_id}")"
  running_id="$(docker inspect --format '{{.Image}}' "${container_id}")"

  if [[ "${validated_release_revision}" == "legacy" ]]; then
    [[ "${running_ref}" == "${validated_payload_image}" ||
      "${running_ref}" == "${validated_original_image}" ]] ||
      production_die "running legacy Payload reference does not match ${file}"
    [[ "${running_id}" == "${validated_expected_image_id}" ]] ||
      production_die "running legacy Payload image ID does not match ${file}"
  else
    [[ "${running_ref}" == "${validated_payload_image}" ]] ||
      production_die "running Payload image does not match ${file}"
    running_revision="$(
      docker inspect \
        --format '{{index .Config.Labels "org.opencontainers.image.revision"}}' \
        "${container_id}" 2>/dev/null
    )"
    [[ "${running_revision}" == "${validated_release_revision}" ]] ||
      production_die "running Payload revision does not match ${file}"
  fi
}

validate_current_release_state() {
  validate_release_against_container "${STATE_DIR}/current-images.env" "${1:-}"
}

validate_restore_marker() {
  local invalid_lines

  validate_private_file "${RESTORE_REQUIRED_FILE}" "restore-required marker"
  invalid_lines="$(
    sed -E '/^[[:space:]]*(#|$)/d' "${RESTORE_REQUIRED_FILE}" |
      grep -Ev \
        '^(operation|created_at|release_revision|backup_path|media_restore_required)=' ||
      true
  )"
  [[ -z "${invalid_lines}" ]] ||
    production_die "restore-required marker contains unsupported entries"

  validated_marker_operation="$(read_env_value operation "${RESTORE_REQUIRED_FILE}")"
  validated_marker_created_at="$(read_env_value created_at "${RESTORE_REQUIRED_FILE}")"
  validated_marker_revision="$(read_env_value release_revision "${RESTORE_REQUIRED_FILE}")"
  validated_marker_backup_path="$(read_env_value backup_path "${RESTORE_REQUIRED_FILE}")"
  validated_marker_media_required="$(
    read_env_value media_restore_required "${RESTORE_REQUIRED_FILE}"
  )"

  [[ "${validated_marker_operation}" == "deploy" ||
    "${validated_marker_operation}" == "restore" ]] ||
    production_die "restore-required marker operation is invalid"
  [[ "${validated_marker_created_at}" =~ ^[0-9]{4}-[0-9]{2}-[0-9]{2}T ]] ||
    production_die "restore-required marker timestamp is invalid"
  [[ "${validated_marker_revision}" == "legacy" ||
    "${validated_marker_revision}" =~ ^[0-9a-f]{40,64}$ ]] ||
    production_die "restore-required marker revision is invalid"
  [[ "${validated_marker_backup_path}" == /* ]] ||
    production_die "restore-required marker backup path is invalid"
  [[ "${validated_marker_media_required}" == "true" ||
    "${validated_marker_media_required}" == "false" ]] ||
    production_die "restore-required marker media flag is invalid"
}

require_no_restore_marker() {
  if path_exists "${RESTORE_REQUIRED_FILE}"; then
    validate_restore_marker
    production_die "a previous deploy crossed the migration boundary; run restore-production.sh first"
  fi
}

remove_restore_marker() {
  if path_exists "${RESTORE_REQUIRED_FILE}"; then
    validate_restore_marker
    rm -f -- "${RESTORE_REQUIRED_FILE}"
  fi
}

validate_production_environment() {
  local key
  local value
  local -a required_keys=(
    NEXT_PUBLIC_SITE_URL
    POSTGRES_USER
    POSTGRES_PASSWORD
    POSTGRES_DB
    DATABASE_URL
    PAYLOAD_SECRET
    S3_BUCKET
    S3_REGION
    S3_ACCESS_KEY_ID
    S3_SECRET_ACCESS_KEY
    HEALTH_CHECK_KEY
    CLOUDFLARE_TUNNEL_TOKEN
    BACKUP_DIR
  )

  validate_private_file "${ENV_FILE}" "production environment"
  for key in "${required_keys[@]}"; do
    value="$(read_env_value "${key}" "${ENV_FILE}")"
    [[ "${value}" != replace_with_* ]] ||
      production_die "${key} still contains an example placeholder"
  done
}

build_compose_command() {
  local compose_image_file="${1:-${IMAGE_ENV_FILE}}"

  COMPOSE=(
    env
    -u BACKUP_DIR
    -u CLOUDFLARE_TUNNEL_TOKEN
    -u COMPOSE_DISABLE_ENV_FILE
    -u COMPOSE_ENV_FILES
    -u COMPOSE_FILE
    -u COMPOSE_IGNORE_ORPHANS
    -u COMPOSE_PARALLEL_LIMIT
    -u COMPOSE_PATH_SEPARATOR
    -u COMPOSE_PROFILES
    -u COMPOSE_PROJECT_NAME
    -u COMPOSE_REMOVE_ORPHANS
    -u DATABASE_URL
    -u HEALTH_CHECK_KEY
    -u NEXT_PUBLIC_SITE_URL
    -u PAYLOAD_IMAGE
    -u PAYLOAD_MIGRATOR_IMAGE
    -u PAYLOAD_SECRET
    -u POSTGRES_DB
    -u POSTGRES_PASSWORD
    -u POSTGRES_USER
    -u RELEASE_REVISION
    -u S3_ACCESS_KEY_ID
    -u S3_BUCKET
    -u S3_REGION
    -u S3_SECRET_ACCESS_KEY
    docker compose
    --project-name "${PRODUCTION_PROJECT_NAME}"
    --env-file "${ENV_FILE}"
    --env-file "${compose_image_file}"
    -f "${COMPOSE_FILE}"
  )
}

verify_database_url_identity() {
  local service="$1"

  production_log "Verifying that DATABASE_URL targets the managed PostgreSQL service"
  "${COMPOSE[@]}" run \
    --rm \
    -T \
    --no-deps \
    --entrypoint node \
    "${service}" \
    -e '
      const fail = () => {
        console.error("DATABASE_URL must match POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB, and postgres:5432");
        process.exit(1);
      };
      try {
        const url = new URL(process.env.DATABASE_URL);
        if (!url.pathname.startsWith("/") || url.pathname.slice(1).includes("/")) fail();
        const database = decodeURIComponent(url.pathname.slice(1));
        if (
          !["postgres:", "postgresql:"].includes(url.protocol) ||
          url.hostname !== "postgres" ||
          (url.port || "5432") !== "5432" ||
          decodeURIComponent(url.username) !== process.env.POSTGRES_USER ||
          decodeURIComponent(url.password) !== process.env.POSTGRES_PASSWORD ||
          database !== process.env.POSTGRES_DB ||
          url.search !== "" ||
          url.hash !== ""
        ) fail();
      } catch {
        fail();
      }
    '
}

validate_local_docker() {
  local endpoint

  endpoint="$(docker context inspect --format '{{.Endpoints.docker.Host}}' 2>/dev/null)" ||
    production_die "could not inspect the active Docker context"
  [[ "${endpoint}" == unix://* ]] ||
    production_die "production scripts require a local Unix-socket Docker context, got: ${endpoint}"
  docker info >/dev/null
}

load_service_container_ids() {
  local service="$1"
  local output

  output="$(
    docker container ls \
      --all \
      --quiet \
      --filter "label=com.docker.compose.project=${PRODUCTION_PROJECT_NAME}" \
      --filter "label=com.docker.compose.service=${service}"
  )" || production_die "could not inspect Compose service ${service}"
  SERVICE_CONTAINER_IDS=()
  if [[ -n "${output}" ]]; then
    mapfile -t SERVICE_CONTAINER_IDS <<<"${output}"
  fi
}

compose_container_ids() {
  local service="$1"

  load_service_container_ids "${service}"
  ((${#SERVICE_CONTAINER_IDS[@]} == 0)) ||
    printf '%s\n' "${SERVICE_CONTAINER_IDS[@]}"
}

compose_container_id() {
  local service="$1"

  load_service_container_ids "${service}"
  ((${#SERVICE_CONTAINER_IDS[@]} <= 1)) || return 2
  ((${#SERVICE_CONTAINER_IDS[@]} == 0)) ||
    printf '%s' "${SERVICE_CONTAINER_IDS[0]}"
}

require_at_most_one_service_container() {
  local service="$1"

  load_service_container_ids "${service}"
  ((${#SERVICE_CONTAINER_IDS[@]} <= 1)) ||
    production_die "${service} has ${#SERVICE_CONTAINER_IDS[@]} containers; reconcile old rollout replicas first"
}

is_service_running() {
  local service="$1"
  local container_id
  local running

  load_service_container_ids "${service}"
  for container_id in "${SERVICE_CONTAINER_IDS[@]}"; do
    if ! running="$(
      docker inspect --format '{{.State.Running}}' "${container_id}" 2>/dev/null
    )"; then
      docker info >/dev/null ||
        production_die "Docker became unavailable while inspecting ${service}"
      if docker container inspect "${container_id}" >/dev/null 2>&1; then
        production_die "could not inspect Compose service ${service}"
      fi
      continue
    fi

    case "${running}" in
      true)
        return 0
        ;;
      false)
        ;;
      *)
        production_die "invalid running state for Compose service ${service}"
        ;;
    esac
  done
  return 1
}

require_no_running_service_containers() {
  local service="$1"

  if is_service_running "${service}"; then
    production_die "${service} still has a running container"
  fi
}

stop_all_service_containers() {
  local service="$1"
  local timeout_seconds="$2"

  load_service_container_ids "${service}"
  if ((${#SERVICE_CONTAINER_IDS[@]} > 0)); then
    docker stop --time "${timeout_seconds}" "${SERVICE_CONTAINER_IDS[@]}" >/dev/null
  fi
  require_no_running_service_containers "${service}"
}

service_health_status() {
  local service="$1"
  local container_id

  container_id="$(compose_container_id "${service}")"
  [[ -n "${container_id}" ]] || return 1
  docker inspect \
    --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}{{.State.Status}}{{end}}' \
    "${container_id}" 2>/dev/null
}

wait_for_health() {
  local service="$1"
  local timeout_seconds="$2"
  local deadline=$((SECONDS + timeout_seconds))
  local status

  while ((SECONDS < deadline)); do
    status="$(service_health_status "${service}" || true)"
    case "${status}" in
      healthy | running)
        return 0
        ;;
      exited | dead)
        return 1
        ;;
    esac
    sleep 2
  done

  return 1
}

require_service_healthy() {
  local service="$1"

  require_at_most_one_service_container "${service}"
  [[ "$(service_health_status "${service}" || true)" == "healthy" ]] ||
    production_die "${service} must already be running and healthy"
}

check_external_health() {
  local url="$1"
  local expected_revision="${2:-}"
  local attempts="${3:-10}"
  local attempt
  local response
  local status
  local body

  for ((attempt = 1; attempt <= attempts; attempt++)); do
    response="$(
      curl \
        --silent \
        --show-error \
        --connect-timeout 5 \
        --max-time 15 \
        --write-out $'\n%{http_code}' \
        "${url}" 2>/dev/null ||
        true
    )"
    status="${response##*$'\n'}"
    body="${response%$'\n'*}"

    if [[ "${status}" == "200" ]] &&
      grep -Eq '"status"[[:space:]]*:[[:space:]]*"ok"' <<<"${body}" &&
      grep -Eq '"service"[[:space:]]*:[[:space:]]*"45th-homepage"' <<<"${body}" &&
      grep -Eq '"mode"[[:space:]]*:[[:space:]]*"basic"' <<<"${body}"; then
      if [[ -z "${expected_revision}" ]] ||
        grep -Eq "\"revision\"[[:space:]]*:[[:space:]]*\"${expected_revision}\"" <<<"${body}"; then
        return 0
      fi
    fi

    ((attempt < attempts)) && sleep 2
  done

  return 1
}

check_external_page() {
  local url="$1"
  local attempts="${2:-10}"
  local attempt
  local status

  for ((attempt = 1; attempt <= attempts; attempt++)); do
    status="$(
      curl \
        --silent \
        --show-error \
        --output /dev/null \
        --connect-timeout 5 \
        --max-time 20 \
        --write-out '%{http_code}' \
        "${url}" 2>/dev/null ||
        true
    )"
    [[ "${status}" == "200" ]] && return 0
    ((attempt < attempts)) && sleep 2
  done

  return 1
}

acquire_production_lock() {
  local inherited_fd="${PRODUCTION_LOCK_FD:-}"
  local inherited_target

  if [[ -n "${inherited_fd}" ]]; then
    [[ "${inherited_fd}" == "9" && -e "/proc/$$/fd/9" ]] ||
      production_die "invalid inherited production lock"
    inherited_target="$(realpath -e -- "/proc/$$/fd/9")"
    [[ "${inherited_target}" == "${LOCK_FILE}" ]] ||
      production_die "inherited lock does not reference ${LOCK_FILE}"
    flock -n 9 || production_die "another production operation is running"
    return
  fi

  [[ ! -L "${LOCK_FILE}" ]] ||
    production_die "production lock must not be a symlink: ${LOCK_FILE}"
  if [[ -e "${LOCK_FILE}" && ! -f "${LOCK_FILE}" ]]; then
    production_die "production lock is not a regular file: ${LOCK_FILE}"
  fi
  exec 9>>"${LOCK_FILE}"
  flock -n 9 || production_die "another production operation is running"
}

verify_release_images() {
  local app_revision
  local migrator_revision

  app_revision="$(
    docker image inspect \
      --format '{{index .Config.Labels "org.opencontainers.image.revision"}}' \
      "${payload_image}" 2>/dev/null
  )" || production_die "could not inspect pulled Payload image"
  migrator_revision="$(
    docker image inspect \
      --format '{{index .Config.Labels "org.opencontainers.image.revision"}}' \
      "${migrator_image}" 2>/dev/null
  )" || production_die "could not inspect pulled migrator image"

  [[ "${app_revision}" == "${release_revision}" ]] ||
    production_die "Payload image revision does not match the release manifest"
  [[ "${migrator_revision}" == "${release_revision}" ]] ||
    production_die "migrator image revision does not match the release manifest"
}
