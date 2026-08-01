# 本番運用

単一ホスト上で `postgres`、`seaweedfs-s3`、`payload`、`cloudflared` の4サービスだけを常駐させます。Payloadは常に1コンテナで、デプロイ中は数分の停止を許容します。自動rollbackは行いません。

mediaは将来の外部S3への切り替えを想定し、PayloadからS3互換APIだけを使用します。現在は単一ホスト内の`weed mini`をその境界として維持し、SeaweedFS固有APIへ依存しません。

## 初期設定

初回は空のPostgreSQLとSeaweedFSへDB schemaを作成し、管理画面からデータを登録します。既存releaseのbackupを前提とする`prod:deploy`は使用しません。

この手順は、旧Compose projectと旧`cloudflared`を含むservice・named volumeが削除され、新しい`45th-homepage-prod`のvolumeが存在しないことを確認済みであることを前提とします。
削除対象は`docker compose ls`と`docker volume ls`で人が確認し、旧Tunnelを残したまま新しいTunnelを起動しません。

1. `.env.production.example` を `.env.production` にコピーし、秘密情報を設定する。
2. `.env.release.example` を `.env.release` にコピーし、現在の`main`のcommit SHA付きimageを設定する。
3. Proxmoxで、Docker named volumeを含むVM・CT全体のbackup先、実行間隔、保持世代を設定する。
4. Cloudflare DashboardのTunnelの「Published application route」で、転送先を `http://payload:3000` にする。Traefikなどを経由させない。
5. Compose設定を検証し、imageと空の基盤サービスを準備する。

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
chmod 600 .env.production .env.release

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

DBスキーママイグレーションを適用し、Tunnelを起動せずPayloadだけを起動します。

```bash
bash <<'EOF'
set -euo pipefail
mise run prod:migrate
mise run prod:start-app
mise run prod:ps
EOF
```

Payloadはホストの`127.0.0.1:3000`だけに公開されます。別端末から操作する場合はSSH port forwardingを開始し、`http://127.0.0.1:3000/admin`へアクセスします。

```bash
ssh -L 3000:127.0.0.1:3000 USER@PRODUCTION_HOST
```

初期管理者を作成し、画像、企画タグ、企画、企画ページ設定、お知らせ、トップページ、協賛企業ページ、天候設定の順に登録します。企画とお知らせは公開状態まで確認します。

Tunnelを起動する前に、`prod:ps`でPayloadがhealthyであること、画像のuploadとthumbnail取得、主要ページでの画像表示を確認します。確認後、最初のbaseline backupを作成します。

```bash
bash <<'EOF'
set -euo pipefail
mise run prod:stop
mise run prod:backup
mise run prod:start-app
mise run prod:ps
EOF
```

baseline backupの作成後にProxmox backupを1回実行し、成功したbackupから隔離環境へVM・CTを復元できることを確認します。この確認が終わるまでTunnelを起動しません。

最後にTunnelを起動します。

```bash
mise run prod:start-tunnel
mise run prod:ps
mise run prod:logs
```

ログ確認後に`Ctrl-C`で追跡を終了し、別端末またはブラウザから公開URLへアクセスしてTunnel経由で応答することを確認します。

初回設定とbaseline backupが完了した後の更新だけ、次の通常デプロイを使用します。

## 通常デプロイ

既存のPayload releaseが起動済みであることが前提です。初回構築では前節の手順を使用します。

本番サーバーのコンソールで次だけを実行します。

`prod:deploy`はstdinとstdoutがterminalでない場合は開始しません。確認入力のEOFや`Ctrl-C`、SSH切断は承認として扱わず、確認段階に応じて未記録のPayloadまたはTunnelを停止します。

```bash
git pull --ff-only origin main
mise run prod:deploy
```

スクリプトは直列に以下を行います。

1. `origin`を取得し、checkout済みの`main`が`origin/main`と同じcommitであることを確認する
2. `45th-homepage:<commit-sha>`をbuildする
3. `cloudflared`、`payload`の順に停止する
4. PostgreSQLとmediaを同じディレクトリへbackupする
5. 新imageの`payload-migrate`を1回実行する
6. 新imageのPayloadを1コンテナだけ起動する
7. strict health checkと直近100行のログを表示する
8. 人が承認した場合だけ`.env.release`を一時ファイルから`mv`する
9. `cloudflared`を起動し、状態とログを表示して、人が公開URLへの到達を確認する。確認できなければTunnelを停止する

既存のPayload releaseがない場合は初期設定を案内して開始しません。healthとログの確認を承認しなかった場合、または確認が中断された場合は、未記録の候補Payloadを停止し、Tunnelも停止した状態にします。この時点ではDBスキーママイグレーションが適用済みの可能性があるため、schema互換性を確認せず`.env.release`に記録された旧imageを起動しません。

そのほかの途中失敗では、その場所と現在の状態を表示して終了します。公開URLを確認できない場合は`cloudflared`を停止し、記録済みのPayloadだけを稼働状態に保ちます。旧imageの削除、rollback、DB復元は行わないため、表示されたログを確認して手動で判断してください。

## miseタスク

| タスク              | 内容                                                           |
| ------------------- | -------------------------------------------------------------- |
| `prod:ps`           | サービス状態を表示                                             |
| `prod:logs`         | 本番ログを追跡                                                 |
| `prod:stop`         | PayloadとTunnelを停止                                          |
| `prod:backup`       | 停止状態を確認してDBとmediaをbackup                            |
| `prod:migrate`      | PayloadとTunnelの停止、DBとS3のhealthを確認してmigrationを実行 |
| `prod:start-app`    | `.env.release`のPayloadを1コンテナ起動                         |
| `prod:start-tunnel` | healthyな記録済みPayloadだけにTunnelを起動                     |
| `prod:deploy`       | 上記の通常デプロイを実行                                       |
| `prod:perf`         | 本番相当のLighthouse試験                                       |
| `prod:perf:down`    | Lighthouse試験コンテナを削除                                   |

DBスキーママイグレーションは`prod:migrate`だけを使用します。このタスクはPayloadとTunnelが停止中で、PostgreSQLとSeaweedFSがhealthyな場合だけ、`.env.release`のimageからmigrationを実行します。tools serviceを直接実行してこの確認を迂回しません。

`payload`と`payload-migrate`は同じ`PAYLOAD_IMAGE`を参照します。Payload起動時にDBスキーママイグレーションは実行されません。

## backupと復元

backupスクリプトはサービスを停止・起動しません。PayloadまたはTunnelが稼働中なら失敗します。

定期的な災害復旧backupはProxmoxのVM・CT backupを正とし、Docker named volume上のPostgreSQLとSeaweedFSをVM・CTごと保存します。リポジトリのdeploy時backupは、migration直前の論理backupと将来の外部S3移行用exportであり、最後のdeploy以降の変更を保護しません。

本番公開前に、Proxmox側で次を確定します。

- backup先を本番ホストとは別のstorageにする
- 必要なRPOを満たす実行間隔と保持世代を設定する
- `45th-homepage-prod_pgdata`と`45th-homepage-prod_seaweedfs-mini-data`を格納するVM・CT diskが対象に含まれることを確認する
- backup jobの失敗を運用者が確認できるようにする
- 隔離環境へのVM・CT restore後にDB health、画像取得、主要ページを確認する

手動の論理backupはDB dumpに加え、mediaのobject key、bytes、`Content-Type`を保存します。実行前に空き容量を確認し、Proxmox backupの成功を確認してから、運用側で決めた保持世代を超えた古いディレクトリを手動で削除します。

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
├── media-metadata.json
├── manifest.env
├── SHA256SUMS
└── COMPLETE
```

`postgres.dump`はcustom formatです。backup時にS3上とローカルのobject key・件数・容量・`Content-Type`、`pg_restore --list`、全ファイルのSHA-256を検証します。

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

ホストまたはDocker volumeの障害からの復旧には、Proxmox backupからVM・CT全体を復元します。次の論理復元はrelease単位のrollbackまたは外部S3への移行に使用します。既存データを置換し得るため自動化していません。検証ブロックが成功した場合だけ、追加のProxmox snapshotを取得し、PayloadとTunnelを停止したうえで、できるだけ空のDBとbucketへ復元してください。

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

media uploadはmanifestに記録した`Content-Type`を設定し、upload後のkey・容量・`Content-Type`を検証します。既存objectは自動削除しないため、完全な巻き戻しには空のSeaweedFS volumeを使ってください。

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

## Image保持

公開確認後にDockerの使用量とimage一覧を確認します。

```bash
docker system df
docker image ls 45th-homepage
```

現在のreleaseと直前のrollback候補を残し、それより古いimageは人が確認して削除します。自動pruneは行いません。
