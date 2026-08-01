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

stop_candidate_on_interrupt() {
  trap - HUP INT TERM
  echo "Confirmation was interrupted. Stopping the unrecorded Payload candidate." >&2
  PAYLOAD_IMAGE="$new_image" "${compose[@]}" stop payload || true
  exit 130
}

stop_tunnel_on_interrupt() {
  trap - HUP INT TERM
  echo "Public confirmation was interrupted. Stopping Cloudflare Tunnel." >&2
  "${compose[@]}" stop cloudflared || true
  exit 130
}

for file in .env.production .env.release; do
  if [[ ! -f "$file" ]]; then
    echo "Required file is missing: $file" >&2
    exit 1
  fi
done

if [[ ! -t 0 || ! -t 1 ]]; then
  echo "Production deploys require an interactive terminal for release approval" >&2
  exit 1
fi

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

echo "1/9 Fetching origin and verifying the checked-out main..."
git fetch --prune origin
commit_sha="$(git rev-parse HEAD)"
origin_main_sha="$(git rev-parse origin/main)"
if [[ "$commit_sha" != "$origin_main_sha" ]]; then
  echo "Local main does not match origin/main." >&2
  echo "Run 'git pull --ff-only origin main', review the update, then rerun this deploy." >&2
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
answer=""
trap stop_candidate_on_interrupt HUP INT TERM
if ! read -r answer; then
  echo "Confirmation input closed; treating the release as rejected." >&2
fi
if [[ "$answer" != "y" && "$answer" != "Y" ]]; then
  trap - HUP INT TERM
  PAYLOAD_IMAGE="$new_image" "${compose[@]}" stop payload
  echo "Release was not recorded. Payload and Cloudflare Tunnel are stopped." >&2
  echo "DB schema migrations may already have been applied." >&2
  echo "Do not start the recorded old image without checking schema compatibility." >&2
  exit 1
fi
trap - HUP INT TERM

echo "8/9 Recording $new_image in .env.release..."
release_temp="$(mktemp ./.env.release.XXXXXX)"
printf 'PAYLOAD_IMAGE=%s\n' "$new_image" >"$release_temp"
mv "$release_temp" .env.release

echo "9/9 Starting Cloudflare Tunnel..."
"${compose[@]}" up --detach --no-deps cloudflared
"${compose[@]}" ps payload cloudflared
"${compose[@]}" logs --tail 50 cloudflared
printf "Confirm the public site is reachable through Cloudflare? [y/N] "
answer=""
trap stop_tunnel_on_interrupt HUP INT TERM
if ! read -r answer; then
  echo "Confirmation input closed; treating public reachability as unconfirmed." >&2
fi
if [[ "$answer" != "y" && "$answer" != "Y" ]]; then
  trap - HUP INT TERM
  "${compose[@]}" stop cloudflared
  echo "Public reachability was not confirmed. Cloudflare Tunnel was stopped; Payload remains running." >&2
  exit 1
fi
trap - HUP INT TERM

echo "Deploy complete: $new_image"
