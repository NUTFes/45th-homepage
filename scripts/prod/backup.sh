#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$repo_root"

compose=(
  docker compose
  --env-file .env.production
  --env-file .env.release
  -f compose.prod.yml
)

for file in .env.production .env.release; do
  if [[ ! -f "$file" ]]; then
    echo "Required file is missing: $file" >&2
    exit 1
  fi
done

for service in payload cloudflared; do
  container_id="$("${compose[@]}" ps -a -q "$service")"
  if [[ -n "$container_id" ]]; then
    state="$(docker inspect --format '{{.State.Status}}' "$container_id")"
    if [[ "$state" != "exited" && "$state" != "created" ]]; then
      echo "Stop payload and cloudflared before backup: mise run prod:stop" >&2
      exit 1
    fi
  fi
done

for service in postgres seaweedfs-s3; do
  container_id="$("${compose[@]}" ps --status running -q "$service")"
  if [[ -z "$container_id" ]]; then
    echo "$service must already be running; backup will not start services" >&2
    exit 1
  fi
  health="$(docker inspect --format '{{.State.Health.Status}}' "$container_id")"
  if [[ "$health" != "healthy" ]]; then
    echo "$service is not healthy: $health" >&2
    exit 1
  fi
done

payload_id="$("${compose[@]}" ps -a -q payload)"
if [[ -z "$payload_id" ]]; then
  echo "Stopped payload container was not found" >&2
  exit 1
fi

payload_image="$(docker inspect --format '{{.Config.Image}}' "$payload_id")"
commit_sha="${payload_image##*:}"
if [[ ! "$commit_sha" =~ ^[0-9a-f]{40}$ ]]; then
  commit_sha="${BACKUP_COMMIT_SHA:-}"
fi
if [[ ! "$commit_sha" =~ ^[0-9a-f]{40}$ ]]; then
  echo "Cannot determine a full commit SHA from image $payload_image" >&2
  echo "For the one-time legacy backup, set BACKUP_COMMIT_SHA explicitly" >&2
  exit 1
fi

timestamp="$(date +%Y%m%dT%H%M%S%z)"
backup_dir="backups/$timestamp"
mkdir -p backups
mkdir "$backup_dir"
mkdir "$backup_dir/media"

echo "Creating PostgreSQL dump..."
# The variables are expanded by sh inside the PostgreSQL container.
# shellcheck disable=SC2016
"${compose[@]}" exec -T postgres sh -c \
  'exec pg_dump --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" --format=custom' \
  >"$backup_dir/postgres.dump"
"${compose[@]}" exec -T postgres pg_restore --list <"$backup_dir/postgres.dump" >/dev/null

source_inventory="$backup_dir/.source-media.json"
local_inventory="$backup_dir/.local-media.json"

echo "Downloading media through the S3 API..."
scripts/prod/media-tool.sh inventory "$source_inventory"
scripts/prod/media-tool.sh download "$backup_dir/media"
node scripts/prod/media-inventory.mjs directory \
  "$backup_dir/media" "$local_inventory"
inventory_stats="$(
  node scripts/prod/media-inventory.mjs compare \
    "$source_inventory" "$local_inventory"
)"
IFS=$'\t' read -r media_objects media_bytes <<<"$inventory_stats"
rm "$source_inventory" "$local_inventory"

cat >"$backup_dir/manifest.env" <<EOF
CREATED_AT=$timestamp
COMMIT_SHA=$commit_sha
PAYLOAD_IMAGE=$payload_image
MEDIA_OBJECTS=$media_objects
MEDIA_BYTES=$media_bytes
EOF

(
  cd "$backup_dir"
  find . -type f \
    ! -path "./SHA256SUMS" \
    ! -path "./SHA256SUMS.tmp" \
    ! -path "./COMPLETE" \
    -print0 |
    LC_ALL=C sort -z |
    xargs -0 sha256sum >SHA256SUMS.tmp
  mv SHA256SUMS.tmp SHA256SUMS
  sha256sum --check SHA256SUMS
)

touch "$backup_dir/COMPLETE"
echo "Backup complete: $backup_dir"
