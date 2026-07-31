#!/usr/bin/env bash
set -Eeuo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$repo_root"

on_error() {
  status=$?
  echo "Deploy failed near line ${BASH_LINENO[0]} (exit $status). No rollback was attempted." >&2
  exit "$status"
}
trap on_error ERR

for file in .env.production .env.release; do
  if [[ ! -f "$file" ]]; then
    echo "Required file is missing: $file" >&2
    exit 1
  fi
done

if [[ "$(git branch --show-current)" != "main" ]]; then
  echo "Production deploys must run from the main branch" >&2
  exit 1
fi
if [[ -n "$(git status --porcelain)" ]]; then
  echo "Commit or remove working tree changes before deploying" >&2
  exit 1
fi

compose=(
  docker compose
  --env-file .env.production
  --env-file .env.release
  -f compose.prod.yml
)

payload_id="$("${compose[@]}" ps -a -q payload)"
if [[ -z "$payload_id" ]]; then
  echo "No existing Payload release was found. Follow the initial production setup instead." >&2
  exit 1
fi

echo "1/9 Updating main..."
git pull --ff-only origin main
commit_sha="$(git rev-parse HEAD)"
origin_main_sha="$(git rev-parse origin/main)"
if [[ "$commit_sha" != "$origin_main_sha" ]]; then
  echo "Local main does not match origin/main; inspect unpublished commits before deploying" >&2
  exit 1
fi
new_image="45th-homepage:$commit_sha"

echo "2/9 Building $new_image..."
PAYLOAD_IMAGE="$new_image" "${compose[@]}" build payload

echo "3/9 Stopping the tunnel and Payload..."
"${compose[@]}" stop cloudflared
"${compose[@]}" stop payload

echo "4/9 Backing up PostgreSQL and media..."
scripts/prod/backup.sh

echo "5/9 Running DB schema migrations with $new_image..."
PAYLOAD_IMAGE="$new_image" "${compose[@]}" --profile tools run --rm --no-deps payload-migrate

echo "6/9 Starting one Payload container..."
PAYLOAD_IMAGE="$new_image" "${compose[@]}" up \
  --detach --no-deps --wait --wait-timeout 120 payload

echo "7/9 Review the strict health status and logs:"
PAYLOAD_IMAGE="$new_image" "${compose[@]}" ps payload
PAYLOAD_IMAGE="$new_image" "${compose[@]}" logs --tail 100 payload
printf "Record this release and start Cloudflare Tunnel? [y/N] "
read -r answer
if [[ "$answer" != "y" && "$answer" != "Y" ]]; then
  echo "Release was not recorded. Payload remains running and the tunnel remains stopped." >&2
  exit 1
fi

echo "8/9 Recording $new_image in .env.release..."
release_temp="$(mktemp ./.env.release.XXXXXX)"
printf 'PAYLOAD_IMAGE=%s\n' "$new_image" >"$release_temp"
mv "$release_temp" .env.release

echo "9/9 Starting Cloudflare Tunnel..."
"${compose[@]}" up --detach --no-deps cloudflared
"${compose[@]}" ps payload cloudflared
"${compose[@]}" logs --tail 50 cloudflared
printf "Confirm the public site is reachable through Cloudflare? [y/N] "
read -r answer
if [[ "$answer" != "y" && "$answer" != "Y" ]]; then
  "${compose[@]}" stop cloudflared
  echo "Public reachability was not confirmed. Cloudflare Tunnel was stopped; Payload remains running." >&2
  exit 1
fi

echo "Deploy complete: $new_image"
