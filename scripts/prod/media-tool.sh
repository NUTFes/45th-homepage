#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$repo_root"

usage() {
  echo "Usage: media-tool.sh download DIR | upload DIR | inventory FILE" >&2
  exit 2
}

require_backup_path() {
  case "$1" in
    backups/*)
      if [[ "$1" == *"/../"* || "$1" == */.. ]]; then
        echo "Backup path cannot contain '..': $1" >&2
        exit 2
      fi
      ;;
    *)
      echo "Path must be under backups/: $1" >&2
      exit 2
      ;;
  esac
}

[[ "$#" -eq 2 ]] || usage
action="$1"
path="$2"
require_backup_path "$path"
container_path="/backups/${path#backups/}"

compose=(
  docker compose
  --env-file .env.production
  --env-file .env.release
  -f compose.prod.yml
  --profile tools
)

bucket="$(
  "${compose[@]}" config --format json --no-env-resolution |
    node -e '
      const fs = require("node:fs");
      const config = JSON.parse(fs.readFileSync(0, "utf8"));
      process.stdout.write(config.services["seaweedfs-s3"].environment.S3_BUCKET ?? "");
    '
)"
if [[ -z "$bucket" ]]; then
  echo "S3_BUCKET is missing from the resolved Compose configuration" >&2
  exit 1
fi

case "$action" in
  download)
    mkdir -p "$path"
    "${compose[@]}" run --rm --no-deps media-tool \
      s3 sync "s3://$bucket" "$container_path" --only-show-errors
    ;;
  upload)
    [[ "$path" == backups/*/media ]] || {
      echo "Upload path must be a backup media directory: $path" >&2
      exit 2
    }
    [[ -d "$path" ]] || {
      echo "Media directory does not exist: $path" >&2
      exit 1
    }
    backup_dir="${path%/media}"
    [[ -f "$backup_dir/COMPLETE" ]] || {
      echo "Backup is incomplete: $backup_dir/COMPLETE is missing" >&2
      exit 1
    }
    (
      cd "$backup_dir"
      sha256sum --check SHA256SUMS
    )
    "${compose[@]}" run --rm --no-deps media-tool \
      s3 sync "$container_path" "s3://$bucket" --only-show-errors
    ;;
  inventory)
    mkdir -p "$(dirname "$path")"
    temp_path="${path}.tmp"
    "${compose[@]}" run --rm --no-deps media-tool \
      s3api list-objects-v2 \
      --bucket "$bucket" \
      --query "Contents[].{key: Key, size: Size}" \
      --output json >"$temp_path"
    mv "$temp_path" "$path"
    ;;
  *)
    usage
    ;;
esac
