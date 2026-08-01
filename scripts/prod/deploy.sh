#!/usr/bin/env bash
set -Eeuo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$repo_root"

on_error() {
  status=$?
  echo "Deploy failed near line ${BASH_LINENO[0]} (exit $status). No rollback was attempted." >&2
  echo "If the maintenance Worker Route is enabled, leave it enabled until recovery." >&2
  exit "$status"
}
trap on_error ERR

leave_maintenance_on_interrupt() {
  trap - HUP INT TERM
  echo "Maintenance confirmation was interrupted. No production services were stopped." >&2
  echo "If the Worker Route is enabled, remove it before resuming normal operation." >&2
  exit 130
}

stop_candidate_on_interrupt() {
  trap - HUP INT TERM
  echo "Confirmation was interrupted. Stopping the unrecorded Payload candidate." >&2
  echo "The maintenance Worker Route remains enabled." >&2
  PAYLOAD_IMAGE="$new_image" "${compose[@]}" stop payload || true
  exit 130
}

stop_tunnel_on_interrupt() {
  trap - HUP INT TERM
  echo "Public confirmation was interrupted. Stopping Cloudflare Tunnel." >&2
  echo "Ensure the maintenance Worker Route is enabled before leaving the site unavailable." >&2
  "${compose[@]}" stop cloudflared || true
  exit 130
}

verify_maintenance_route() {
  SITE_URL="$site_url" node --input-type=module <<'NODE'
try {
  const siteUrl = new URL(process.env.SITE_URL);
  if (siteUrl.protocol !== "https:") {
    throw new Error(`NEXT_PUBLIC_SITE_URL must use HTTPS: ${siteUrl}`);
  }

  const checks = [
    { method: "GET", url: new URL("/", siteUrl) },
    {
      method: "POST",
      url: new URL(`/__maintenance-check?nonce=${Date.now()}`, siteUrl),
    },
  ];

  for (const check of checks) {
    const response = await fetch(check.url, {
      method: check.method,
      cache: "no-store",
      redirect: "manual",
      signal: AbortSignal.timeout(10_000),
    });
    const marker = response.headers.get("x-nutfes-maintenance");
    await response.body?.cancel();

    console.log(
      `${check.method} ${check.url} -> ${response.status}, x-nutfes-maintenance=${marker ?? "<missing>"}`,
    );

    if (response.status !== 503 || marker !== "1") {
      throw new Error("The maintenance Worker Route is not active");
    }
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
NODE
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

site_url="$(
  "${compose[@]}" config --format json |
    node -e '
      const fs = require("node:fs");
      const config = JSON.parse(fs.readFileSync(0, "utf8"));
      const value = config.services?.payload?.environment?.NEXT_PUBLIC_SITE_URL;
      if (typeof value !== "string" || value.length === 0) process.exit(1);
      process.stdout.write(value);
    '
)"

payload_id="$("${compose[@]}" ps -a -q payload)"
if [[ -z "$payload_id" ]]; then
  echo "No existing Payload release was found. Follow the initial production setup instead." >&2
  exit 1
fi

echo "1/10 Fetching origin and verifying the checked-out main..."
git fetch --prune origin
commit_sha="$(git rev-parse HEAD)"
origin_main_sha="$(git rev-parse origin/main)"
if [[ "$commit_sha" != "$origin_main_sha" ]]; then
  echo "Local main does not match origin/main." >&2
  echo "Run 'git pull --ff-only origin main', review the update, then rerun this deploy." >&2
  exit 1
fi
new_image="45th-homepage:$commit_sha"

echo "2/10 Building $new_image..."
PAYLOAD_IMAGE="$new_image" "${compose[@]}" build payload

echo "3/10 Confirming the maintenance page..."
echo "Enable the maintenance Worker Route for the exact production hostname."
printf "Confirm the public URL shows the maintenance page? [y/N] "
answer=""
trap leave_maintenance_on_interrupt HUP INT TERM
if ! read -r answer; then
  echo "Confirmation input closed; treating the maintenance page as unconfirmed." >&2
fi
if [[ "$answer" != "y" && "$answer" != "Y" ]]; then
  trap - HUP INT TERM
  echo "Maintenance page was not confirmed. No production services were stopped." >&2
  echo "If the Worker Route is enabled, remove it before resuming normal operation." >&2
  exit 1
fi
echo "Verifying HTTP 503 and X-NUTFes-Maintenance on GET and POST..."
if ! verify_maintenance_route; then
  echo "Maintenance Worker Route verification failed. No production services were stopped." >&2
  echo "Fix or remove the Worker Route before resuming normal operation." >&2
  exit 1
fi
trap - HUP INT TERM

echo "4/10 Stopping the tunnel and Payload..."
"${compose[@]}" stop cloudflared
"${compose[@]}" stop payload

echo "5/10 Backing up PostgreSQL and media..."
scripts/prod/backup.sh

echo "6/10 Running DB schema migrations with $new_image..."
PAYLOAD_IMAGE="$new_image" "${compose[@]}" --profile tools run --rm --no-deps payload-migrate

echo "7/10 Starting one Payload container..."
PAYLOAD_IMAGE="$new_image" "${compose[@]}" up \
  --detach --no-deps --wait --wait-timeout 120 payload

echo "8/10 Review the strict health status and logs:"
PAYLOAD_IMAGE="$new_image" "${compose[@]}" ps payload
PAYLOAD_IMAGE="$new_image" "${compose[@]}" logs --tail 100 payload
printf "Record this release and start Cloudflare Tunnel behind the maintenance page? [y/N] "
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
  echo "The maintenance Worker Route remains enabled." >&2
  exit 1
fi
trap - HUP INT TERM

echo "9/10 Recording $new_image in .env.release..."
release_temp="$(mktemp ./.env.release.XXXXXX)"
printf 'PAYLOAD_IMAGE=%s\n' "$new_image" >"$release_temp"
mv "$release_temp" .env.release

echo "10/10 Starting Cloudflare Tunnel behind the maintenance page..."
"${compose[@]}" up --detach --no-deps cloudflared
"${compose[@]}" ps payload cloudflared
"${compose[@]}" logs --tail 50 cloudflared
echo "Remove the maintenance Worker Route, then open the public URL."
echo "If the application is not reachable, re-enable the route before answering no."
printf "Confirm the normal site is reachable and the maintenance route is removed? [y/N] "
answer=""
trap stop_tunnel_on_interrupt HUP INT TERM
if ! read -r answer; then
  echo "Confirmation input closed; treating public reachability as unconfirmed." >&2
fi
if [[ "$answer" != "y" && "$answer" != "Y" ]]; then
  trap - HUP INT TERM
  "${compose[@]}" stop cloudflared
  echo "Public reachability was not confirmed. Cloudflare Tunnel was stopped; Payload remains running." >&2
  echo "Ensure the maintenance Worker Route is enabled." >&2
  exit 1
fi
trap - HUP INT TERM

echo "Deploy complete: $new_image"
