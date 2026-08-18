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
host_user="$(id -u):$(id -g)"


case "$action" in
  download)
    [[ "$path" == backups/*/media ]] || {
      echo "Download path must be a backup media directory: $path" >&2
      exit 2
    }
    backup_dir="${path%/media}"
    manifest="$backup_dir/media-metadata.json"
    [[ -f "$manifest" ]] || {
      echo "Media manifest does not exist: $manifest" >&2
      exit 1
    }
    mkdir -p "$path"
    "${compose[@]}" run --rm --no-deps --user "$host_user" media-tool \
      download "$container_path" "/backups/${manifest#backups/}"
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
    manifest="$backup_dir/media-metadata.json"
    [[ -f "$manifest" ]] || {
      echo "Media manifest does not exist: $manifest" >&2
      exit 1
    }
    "${compose[@]}" run --rm --no-deps --user "$host_user" media-tool \
      upload "$container_path" "/backups/${manifest#backups/}"
    ;;
  inventory)
    mkdir -p "$(dirname "$path")"
    "${compose[@]}" run --rm --no-deps --user "$host_user" media-tool inventory "$container_path"
    ;;
  *)
    usage
    ;;
esac
