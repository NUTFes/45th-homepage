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

bucket=""
while IFS="=" read -r key value; do
  if [[ "$key" == "S3_BUCKET" ]]; then
    bucket="${value%$'\r'}"
  fi
done <.env.production
if [[ -z "$bucket" ]]; then
  echo "S3_BUCKET is missing from .env.production" >&2
  exit 1
fi

compose=(
  docker compose
  --env-file .env.production
  --env-file .env.release
  -f compose.prod.yml
  --profile tools
)

case "$action" in
  download)
    mkdir -p "$path"
    "${compose[@]}" run --rm --no-deps media-tool \
      s3 sync "s3://$bucket" "$container_path" --only-show-errors
    ;;
  upload)
    [[ -d "$path" ]] || {
      echo "Media directory does not exist: $path" >&2
      exit 1
    }
    "${compose[@]}" run --rm --no-deps media-tool \
      s3 sync "$container_path" "s3://$bucket" --only-show-errors
    ;;
  inventory)
    mkdir -p "$(dirname "$path")"
    temp_path="${path}.tmp"
    "${compose[@]}" run --rm --no-deps media-tool \
      s3api list-objects-v2 \
      --bucket "$bucket" \
      --query "Contents[].[Key,Size]" \
      --output text |
      awk -F '\t' 'NF == 2 && $2 ~ /^[0-9]+$/ { print $1 "\t" $2 }' |
      LC_ALL=C sort >"$temp_path"
    mv "$temp_path" "$path"
    ;;
  *)
    usage
    ;;
esac
