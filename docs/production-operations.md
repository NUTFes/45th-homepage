# 本番運用

単一ホスト上で `postgres`、`seaweedfs-s3`、`payload`、`cloudflared` の4サービスだけを常駐させます。Payloadは常に1コンテナで、デプロイ中は数分の停止を許容します。自動rollbackは行いません。

## 初期設定

1. `.env.production.example` を `.env.production` にコピーし、秘密情報を設定する。
2. `.env.release.example` を `.env.release` にコピーし、現在使うcommit SHA付きimageを設定する。新規構築時は現在の`main`のSHAを使う。
3. Cloudflare DashboardのTunnelの「Published application route」で、転送先を `http://payload:3000` にする。Traefikなどを経由させない。
4. Compose設定と基盤サービスを確認する。

```bash
bash <<'EOF'
set -euo pipefail

if [[ "$(git branch --show-current)" != "main" ]]; then
  echo "Production setup must run from the main branch" >&2
  exit 1
fi
if [[ -n "$(git status --porcelain)" ]]; then
  echo "Commit or remove working tree changes before setup" >&2
  exit 1
fi

git pull --ff-only origin main
commit_sha="$(git rev-parse HEAD)"
origin_main_sha="$(git rev-parse origin/main)"
if [[ "$commit_sha" != "$origin_main_sha" ]]; then
  echo "Local main does not match origin/main; inspect unpublished commits before setup" >&2
  exit 1
fi
release_temp="$(mktemp ./.env.release.XXXXXX)"
printf 'PAYLOAD_IMAGE=45th-homepage:%s\n' "$commit_sha" >"$release_temp"
mv "$release_temp" .env.release

docker compose \
  --env-file .env.production \
  --env-file .env.release \
  -f compose.prod.yml config -q

docker compose \
  --env-file .env.production \
  --env-file .env.release \
  -f compose.prod.yml build payload

docker compose \
  --env-file .env.production \
  --env-file .env.release \
  -f compose.prod.yml up -d --wait postgres seaweedfs-s3
EOF
```

初回もmigration、Payload、Tunnelの順に起動し、起動後にログを確認します。

```bash
bash <<'EOF'
set -euo pipefail
mise run prod:migrate
mise run prod:start-app
mise run prod:start-tunnel
mise run prod:logs
EOF
```

別端末またはブラウザから公開URLへアクセスし、Tunnel経由で応答することまで確認します。

## 通常デプロイ

本番サーバーのコンソールで次だけを実行します。

```bash
mise run prod:deploy
```

スクリプトは直列に以下を行います。

1. `origin/main`を取得し、ローカルの`main`が同じcommitであることを確認する
2. `45th-homepage:<commit-sha>`をbuildする
3. `cloudflared`、`payload`の順に停止する
4. PostgreSQLとmediaを同じディレクトリへbackupする
5. 新imageの`payload-migrate`を1回実行する
6. 新imageのPayloadを1コンテナだけ起動する
7. strict health checkと直近100行のログを表示する
8. 人が承認した場合だけ`.env.release`を一時ファイルから`mv`する
9. `cloudflared`を起動し、状態とログを表示して、人が公開URLへの到達を確認する

途中で失敗すると、その場所を表示して終了します。旧imageの削除、rollback、DB復元、Tunnel再開は行いません。表示されたログを確認して手動で判断してください。

## miseタスク

| タスク              | 内容                                   |
| ------------------- | -------------------------------------- |
| `prod:ps`           | サービス状態を表示                     |
| `prod:logs`         | 本番ログを追跡                         |
| `prod:stop`         | PayloadとTunnelを停止                  |
| `prod:backup`       | 停止状態を確認してDBとmediaをbackup    |
| `prod:migrate`      | `.env.release`のimageでmigrationを実行 |
| `prod:start-app`    | `.env.release`のPayloadを1コンテナ起動 |
| `prod:start-tunnel` | Tunnelを起動                           |
| `prod:deploy`       | 上記の通常デプロイを実行               |
| `prod:perf`         | 本番相当のLighthouse試験               |
| `prod:perf:down`    | Lighthouse試験コンテナを削除           |

migrationだけを実行する生のコマンドは次のとおりです。

```bash
docker compose \
  --env-file .env.production \
  --env-file .env.release \
  -f compose.prod.yml \
  --profile tools run --rm --no-deps payload-migrate
```

`payload`と`payload-migrate`は同じ`PAYLOAD_IMAGE`を参照します。Payload起動時にmigrationは実行されません。

## backupと復元

backupスクリプトはサービスを停止・起動しません。PayloadまたはTunnelが稼働中なら失敗します。

このリポジトリではbackupの定期実行や世代削除を行いません。デプロイ時のbackupだけでは、最後のデプロイ以降の変更を失い得ます。必要なRPOに応じて、ホスト側でVM・CT snapshotまたは別ホストへのbackupを定期実行してください。

手動backupはDBとmediaの完全なcopyを毎回作ります。実行前に空き容量を確認し、復元確認済みの外部copyを確保してから、運用側で決めた保持世代を超えた古いディレクトリを手動で削除します。

```bash
df -h .
mise run prod:stop
mise run prod:backup
```

成功時だけ`COMPLETE`が最後に作られます。

```text
backups/<timestamp>/
├── postgres.dump
├── media/
├── manifest.env
├── SHA256SUMS
└── COMPLETE
```

`postgres.dump`はcustom formatです。backup時にS3上とローカルのobject key・件数・容量、`pg_restore --list`、全ファイルのSHA-256を検証します。

手動backupが成功したら、まずPayloadを起動して状態を確認します。

```bash
mise run prod:start-app
mise run prod:ps
```

`mise run prod:logs`でstrict healthとログを確認した後にTunnelを起動し、公開URLへの到達を確認します。backupが失敗した場合は自動再開しないため、原因を確認してから同じ手順で再開します。

```bash
mise run prod:start-tunnel
mise run prod:ps
```

復元前に、対象ディレクトリを明示して再検証します。

```bash
(
  set -euo pipefail

  backup=backups/REPLACE_WITH_TIMESTAMP
  test -f "$backup/COMPLETE"
  (cd "$backup" && sha256sum --check SHA256SUMS)
  docker compose \
    --env-file .env.production \
    --env-file .env.release \
    -f compose.prod.yml exec -T postgres pg_restore --list \
    <"$backup/postgres.dump" >/dev/null
)
```

復元は既存データを置換し得るため自動化していません。上の検証ブロックが成功した場合だけ、VM・CT snapshotを取得し、PayloadとTunnelを停止したうえで、できるだけ空のDBとbucketへ復元してください。

```bash
(
  set -euo pipefail

  backup=backups/REPLACE_WITH_TIMESTAMP
  test -f "$backup/COMPLETE"
  (cd "$backup" && sha256sum --check SHA256SUMS)

  docker compose \
    --env-file .env.production \
    --env-file .env.release \
    -f compose.prod.yml exec -T postgres sh -c \
    'exec pg_restore --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" --clean --if-exists --no-owner --exit-on-error --single-transaction' \
    <"$backup/postgres.dump"

  scripts/prod/media-tool.sh upload "$backup/media"
)
```

media uploadは既存objectを自動削除しません。完全な巻き戻しには空のSeaweedFS volumeを使ってください。

## 手動rollback

直前のimageは削除されません。DB schemaに互換性がある場合は次の順序で戻します。

1. `mise run prod:stop`
2. 旧imageを指定してPayloadを起動する
3. strict healthと`mise run prod:logs`を確認する
4. `.env.release`を一時ファイルから`mv`で更新する
5. `mise run prod:start-tunnel`

```bash
(
  set -euo pipefail

  old_image=45th-homepage:REPLACE_WITH_OLD_COMMIT_SHA
  compose=(
    docker compose
    --env-file .env.production
    --env-file .env.release
    -f compose.prod.yml
  )

  PAYLOAD_IMAGE="$old_image" "${compose[@]}" up \
    -d --no-deps --wait --wait-timeout 120 payload
  PAYLOAD_IMAGE="$old_image" "${compose[@]}" ps payload
  PAYLOAD_IMAGE="$old_image" "${compose[@]}" logs --tail 100 payload

  printf "この旧imageを.env.releaseに記録しますか? [y/N] "
  read -r answer
  if [[ "$answer" != "y" && "$answer" != "Y" ]]; then
    echo "旧imageは稼働中ですが、releaseとして記録していません" >&2
    exit 1
  fi

  release_temp="$(mktemp ./.env.release.XXXXXX)"
  printf 'PAYLOAD_IMAGE=%s\n' "$old_image" >"$release_temp"
  mv "$release_temp" .env.release
)
```

記録後に`mise run prod:start-tunnel`と`mise run prod:ps`を実行し、`cloudflared`のログと公開URLを確認します。

旧アプリと新schemaに互換性がない場合は、先に同じデプロイで作ったbackupからDBとmediaを復元します。

## 初回SeaweedFS移行

これは通常デプロイに混ぜません。旧master・volume・filer・S3 gatewayが稼働している状態から、保守時間を確保して1回だけ手動実施します。

1. VM・CT snapshotを取得する。旧Composeを退避し、旧commitと使用imageを控える。
2. 新しい`origin/main`へ更新し、ローカルの`main`と同じcommitであることを確認する。`prod:deploy`はまだ実行しない。
3. 旧構成が稼働中のままCloudflare Dashboardの転送先を`http://payload:3000`へ変更し、公開URLへの到達を確認する。
4. PayloadとTunnelを停止し、旧S3から統合backupを作る。
5. 旧SeaweedFS、`pg-backup`、Traefikなどのサービスを停止する。旧volumeは削除しない。
6. `seaweedfs-mini-data`という名前を含むvolumeが存在しないことを確認する。存在する場合は削除せず、内容と作成理由を確認する。
7. 新しい`weed mini`を起動し、backupのmediaをS3 API経由でuploadする。
8. object keyと容量の一覧を比較する。
9. 通常デプロイを行い、`cloudflared`のログと公開URLを確認する。CMSのmediaレコードは再登録しない。

```bash
(
  set -euo pipefail

  # 旧構成の稼働中
  old_commit="$(git rev-parse HEAD)"
  cp compose.prod.yml /tmp/compose.prod.legacy.yml
  old_payload_id="$(docker compose --env-file .env.production -f compose.prod.yml ps -aq payload)"
  old_image="$(docker inspect --format '{{.Config.Image}}' "$old_payload_id")"
  release_temp="$(mktemp ./.env.release.XXXXXX)"
  printf 'PAYLOAD_IMAGE=%s\n' "$old_image" >"$release_temp"
  mv "$release_temp" .env.release

  git pull --ff-only origin main
  new_commit="$(git rev-parse HEAD)"
  origin_main_commit="$(git rev-parse origin/main)"
  if [[ "$new_commit" != "$origin_main_commit" ]]; then
    echo "Local main does not match origin/main; inspect unpublished commits before migration" >&2
    exit 1
  fi

  printf "Cloudflare originをhttp://payload:3000へ変更し、公開URLを確認しましたか? [y/N] "
  read -r answer
  if [[ "$answer" != "y" && "$answer" != "Y" ]]; then
    echo "Cloudflare originの切り替えを確認してから再実行してください" >&2
    exit 1
  fi
  mise run prod:stop
  BACKUP_COMMIT_SHA="$old_commit" mise run prod:backup
  # 表示された backups/<timestamp> を以降の backup に設定
  backup=backups/<timestamp>

  node scripts/prod/media-inventory.mjs directory \
    "$backup/media" backups/seaweedfs-old.json

  docker compose \
    --project-directory "$PWD" \
    --env-file .env.production \
    -f /tmp/compose.prod.legacy.yml \
    stop \
    pg-backup \
    seaweedfs-s3 seaweedfs-filer seaweedfs-volume seaweedfs-master \
    traefik dozzle-agent

  existing_volumes="$(docker volume ls --format '{{.Name}}')"
  if grep -q seaweedfs-mini-data <<<"$existing_volumes"; then
    echo "seaweedfs-mini-data already exists; inspect it and stop here" >&2
    exit 1
  fi
  docker compose \
    --env-file .env.production \
    --env-file .env.release \
    -f compose.prod.yml up -d --no-deps --wait seaweedfs-s3

  scripts/prod/media-tool.sh upload "$backup/media"
  scripts/prod/media-tool.sh inventory backups/seaweedfs-new.json
  node scripts/prod/media-inventory.mjs compare \
    backups/seaweedfs-old.json backups/seaweedfs-new.json

  # 旧image tagがcommit SHAでなかった最初の1回だけoverrideする
  BACKUP_COMMIT_SHA="$old_commit" mise run prod:deploy
)
```

確認期間が終わるまで旧SeaweedFS volume、退避したCompose、VM・CT snapshotを保持します。削除はこの手順の対象外です。
