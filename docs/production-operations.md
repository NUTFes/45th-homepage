# 本番運用

本番環境では、単一ホスト上で`postgres`、`seaweedfs-s3`、`payload`、`cloudflared`の4サービスだけを常駐させます。
Payloadは常に1コンテナで稼働させ、デプロイ中は数分の停止を許容します。
自動ロールバックは行いません。

メディア保存先は、将来外部S3へ切り替えられる構成にします。
PayloadはS3互換APIだけを使い、SeaweedFS固有APIへ依存しません。
現在は単一ホスト上の`weed mini`をS3互換ストレージとして使用します。

## 空環境の初期構築

初回構築では、空のPostgreSQLにDBスキーマを作成し、空のSeaweedFSを使って管理画面からデータを登録します。
`prod:deploy`は既存リリースのバックアップを前提とするため、初回構築では使用しません。

1. `.env.production.example`を`.env.production`にコピーし、秘密情報を設定する。
2. `.env.release.example`を`.env.release`にコピーする（後続のコマンドが現在の`main`コミットのSHAをタグにしたイメージへ更新する）。
3. Proxmoxで、Dockerの名前付きボリュームを含むVMまたはCT全体のバックアップ先、実行間隔、保持世代を設定する。
4. Cloudflare DashboardのTunnelにある「公開アプリケーションを編集」で、サービスURLを`http://payload:3000`にする。
5. 後述の「メンテナンスページ」に従ってCloudflare Workerをデプロイし、本番ホスト名のWorkerルートは追加しない。
6. Compose設定を検証し、Payloadイメージをビルドして、空のPostgreSQLとSeaweedFSを起動する。

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

DBスキーママイグレーションを適用し、Tunnelを起動せずにPayloadだけを起動します。

```bash
bash <<'EOF'
set -euo pipefail
mise run prod:migrate
mise run prod:start-app
mise run prod:ps
EOF
```

Payloadはホストの`127.0.0.1:3000`だけに公開されます。
別端末から操作する場合はSSHポートフォワーディングを開始し、`http://127.0.0.1:3000/admin`へアクセスします。

```bash
ssh -L 3000:127.0.0.1:3000 USER@PRODUCTION_HOST
```

初期管理者を作成し、画像、企画タグ、企画、企画ページ設定、お知らせ、トップページ、協賛企業ページ、天候設定の順に登録します。
企画とお知らせは公開状態まで確認します。

Tunnelを起動する前に、`prod:ps`でPayloadが`healthy`であることを確認します。
続けて、画像のアップロードとサムネイル取得、主要ページでの画像表示を確認します。
確認後、初期登録完了時点の復旧基点となるベースラインバックアップを作成します。

```bash
bash <<'EOF'
set -euo pipefail
mise run prod:stop
mise run prod:backup
mise run prod:start-app
mise run prod:ps
EOF
```

ベースラインバックアップの作成後にProxmoxバックアップを1回実行し、成功したバックアップから隔離環境へVMまたはCTを復元できることを確認します。
この確認が終わるまでTunnelを起動しません。

最後にTunnelを起動します。

```bash
mise run prod:start-tunnel
mise run prod:ps
mise run prod:logs
```

ログを確認したら`Ctrl-C`で追跡を終了し、別端末またはブラウザから公開URLへアクセスしてTunnel経由で応答することを確認します。

空環境の初期構築とベースラインバックアップが完了した後の更新に限り、次の通常デプロイを使用します。

## メンテナンスページ

メンテナンスページには、`workers/index.js`のCloudflare Workerを使用します。
このWorkerはオリジンや外部アセットに接続せず、HTTP 503を返し、`X-NUTFes-Maintenance: 1`を識別ヘッダーとして付与します。
通常時はWorkerを残し、本番ホスト名のWorkerルートだけを外します。

### Workerの初回デプロイ

1. [Cloudflare Workers Playground](https://workers.cloudflare.com/playground)を開く。
2. `index.js`、`data.js`、`welcome.html`の3モジュールを削除せず、名前も変更しない。
3. `index.js`だけを`workers/index.js`で置き換え、ほかの2モジュールは既存の内容を残す。
4. **Preview**で`GET`と`HEAD`が503になり、`X-NUTFes-Maintenance: 1`が返ることを確認する。
5. `45th-homepage-maintenance`としてデプロイし、公開済みの`workers.dev` URLでも同じ応答を確認する。

**Preview**でHTTP 503がエラーとして表示されるのは正常です。
`No such module`が表示された場合は、モジュール名と配置を修正します。
この時点では、本番ホスト名のWorkerルートを追加しません。

### メンテナンス表示を開始する

1. Workerの **ドメイン > ルートを追加** から`www.nutfes.net/*`を追加する。
2. 公開URLをブラウザで開き、メンテナンスページが表示されることを確認する。
3. `curl -sS -I https://www.nutfes.net/`を実行し、HTTP 503と識別ヘッダーを確認する。
4. ブラウザと`curl`の確認が成功してから、TunnelとPayloadを停止する。

`prod:deploy`を使う場合は、画面の指示に従ってWorkerルートを追加すると、スクリプトが同じ応答を自動確認します。

### 通常表示へ戻す

1. Payloadが`healthy`で、Tunnelが起動していることを確認する。
2. `www.nutfes.net/*`のWorkerルートだけを削除する。
3. 通常ページと画像が表示され、識別ヘッダーが返らないことを確認する。

通常ページを確認できない場合は、同じWorkerルートを戻してから調査します。

## 通常デプロイ

この手順は、既存のPayloadリリースが稼働中であり、前節のWorkerがデプロイ済みであることを前提とします。
初回構築では「空環境の初期構築」の手順を使用します。

`prod:deploy`は、標準入力と標準出力が端末に接続されている場合だけ開始します。
Tunnelを停止する前に、人によるメンテナンスページの確認を要求し、スクリプトも`GET`と`POST`のHTTP 503と識別ヘッダーを検証します。
`EOF`、`Ctrl-C`、SSH切断は承認として扱いません。

本番サーバーのコンソールで、次のコマンドを実行します。

```bash
git pull --ff-only origin main
mise run prod:deploy
```

スクリプトは次の処理を順番に実行します。

1. `origin`を取得し、チェックアウト中の`main`が`origin/main`と同じコミットであることを確認する。
2. `45th-homepage:<commit-sha>`をビルドする。
3. 本番ホスト名へWorkerルートを追加し、人がメンテナンス表示を確認した後、スクリプトが`GET`と`POST`のHTTP 503と識別ヘッダーを検証する。
4. `cloudflared`、`payload`の順に停止する。
5. PostgreSQLとメディアを同じディレクトリへバックアップする。
6. 新しいイメージの`payload-migrate`を1回実行する。
7. 新しいイメージのPayloadを1コンテナだけ起動する。
8. `strict`ヘルスチェックと直近100行のログを表示する。
9. 人が承認した場合に限り、`.env.release`を一時ファイルから`mv`する。
10. `cloudflared`を起動して状態とログを表示した後、人がWorkerルートを削除して通常ページへの到達を確認する。

### デプロイ中断時の状態

- メンテナンスページを確認できない場合や自動検証に失敗した場合は、サービスを停止せず、追加済みのWorkerルートも変更しない。
- 既存のPayloadリリースがない場合は、空環境の初期構築を案内してデプロイを開始しない。
- ヘルスチェックとログを承認しなかった場合や確認が中断された場合は、未記録の候補Payloadを停止し、Tunnelを停止したまま、Workerルートを有効な状態に保つ。
- 通常ページを確認できない場合は、Workerルートを再追加してから否定応答を入力し、スクリプトが`cloudflared`を停止して記録済みのPayloadだけを稼働状態に保つ。
- 別の工程で失敗した場合は、追加済みのWorkerルートを残し、失敗箇所を表示してロールバックせずに終了する。

DBスキーママイグレーションの実行後は、変更が適用済みの可能性があります。
そのため、スキーマ互換性を確認せずに`.env.release`へ記録された旧イメージを起動しません。

スクリプトは旧イメージの削除、ロールバック、DB復元を行わないため、表示されたログとサービスの状態から復旧方法を判断します。

## miseの本番運用タスク

| タスク              | 内容                                                                           |
| ------------------- | ------------------------------------------------------------------------------ |
| `prod:ps`           | サービスの状態を表示                                                           |
| `prod:logs`         | 本番ログを追跡                                                                 |
| `prod:stop`         | PayloadとTunnelを停止                                                          |
| `prod:backup`       | 停止状態を確認し、DBとメディアをバックアップ                                   |
| `prod:migrate`      | PayloadとTunnelが停止し、DBとS3が`healthy`であることを確認してマイグレーション |
| `prod:start-app`    | `.env.release`のPayloadを1コンテナ起動                                         |
| `prod:start-tunnel` | `healthy`な記録済みPayloadに限りTunnelを起動                                   |
| `prod:deploy`       | メンテナンス表示を確認して通常デプロイを実行                                   |
| `prod:perf`         | 本番相当の環境でLighthouseを実行                                               |
| `prod:perf:down`    | Lighthouseの測定用コンテナを削除                                               |

DBスキーママイグレーションには`prod:migrate`だけを使用します。
このタスクはPayloadとTunnelが停止し、PostgreSQLとSeaweedFSが`healthy`な場合に限り、`.env.release`のイメージからマイグレーションを実行します。
`tools`サービスを直接実行して、この確認を迂回しません。

`payload`と`payload-migrate`は同じ`PAYLOAD_IMAGE`を参照します。
Payloadの起動時には、DBスキーママイグレーションを実行しません。

`prod:stop`と`prod:start-tunnel`はWorkerルートを切り替えません。
`prod:deploy`の表示に従うか、前節の手順でWorkerルートを手動操作します。

## バックアップと復元

`prod:backup`はサービスを停止せず、起動もしません。
PayloadまたはTunnelが稼働中の場合は失敗します。

用途が異なるため、2種類のバックアップを区別します。

- **Proxmoxバックアップ**：定期的な障害復旧に使用し、Dockerの名前付きボリュームを含むVMまたはCT全体を保存する。
- **デプロイ時バックアップ**：マイグレーション直前の論理バックアップと、将来の外部S3移行用エクスポートを保存する。

直近のデプロイ時バックアップだけでは、その作成後に更新されたデータを復旧できません。

本番公開前に、Proxmox側で次を確定します。

- バックアップ先を本番ホストとは別のストレージに設定する。
- 必要なRPOを満たす実行間隔と保持世代を設定する。
- `45th-homepage-prod_pgdata`と`45th-homepage-prod_seaweedfs-mini-data`を格納するVMまたはCTのディスクが対象に含まれることを確認する。
- バックアップジョブの失敗を運用者が確認できるようにする。
- 隔離環境へVMまたはCTを復元した後、DBのヘルスチェック、画像取得、主要ページの表示を確認する。

手動の論理バックアップには、DBダンプに加えてメディアのオブジェクトキー、バイト数、`Content-Type`を保存します。
実行前に空き容量とProxmoxバックアップの成功を確認します。
作成後は、運用側で決めた保持世代を超えた古いディレクトリを手動で削除します。

```bash
df -h .
mise run prod:stop
mise run prod:backup
```

すべての処理に成功した場合だけ、最後に`COMPLETE`が作られます。

```text
backups/<timestamp>/
├── postgres.dump
├── media/
├── media-metadata.json
├── manifest.env
├── SHA256SUMS
└── COMPLETE
```

`postgres.dump`は`pg_dump`のカスタム形式です。
バックアップ時には、S3とローカルのメディアについて、オブジェクトキー、件数、容量、`Content-Type`を照合します。
併せて、`pg_restore --list`と全ファイルのSHA-256を検証します。

手動バックアップが成功したら、まずPayloadを起動して状態を確認します。

```bash
mise run prod:start-app
mise run prod:ps
```

`mise run prod:logs`で`strict`ヘルスチェックとログを確認します。
確認後にTunnelを起動し、公開URLへ到達できることを確認します。
バックアップが失敗した場合は自動再開しないため、原因を解消してから同じ手順で再開します。

```bash
mise run prod:start-tunnel
mise run prod:ps
```

復元前に対象のバックアップディレクトリを指定し、内容を再検証します。

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

ホストまたはDockerボリュームの障害から復旧する場合は、ProxmoxバックアップからVMまたはCT全体を復元します。
次の論理復元は、リリース単位のロールバックまたは外部S3への移行に使用します。
論理復元は既存データを置換する可能性があるため、自動化していません。
検証ブロックの成功後にProxmoxスナップショットを追加で取得し、PayloadとTunnelを停止してから、可能な限り空のDBとバケットへ復元します。

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

メディアのアップロード時には、マニフェストに記録した`Content-Type`を設定し、アップロード後のオブジェクトキー、容量、`Content-Type`を検証します。
既存オブジェクトは自動削除されません。
完全に巻き戻す場合は、空のSeaweedFSボリュームを使用します。

## 手動ロールバック

直前のイメージは削除されずに残ります。
DBスキーマに互換性がある場合は、次の順序で戻します。

1. Workerルートを追加し、公開URLのメンテナンス表示を確認する。
2. `mise run prod:stop`を実行する。
3. 旧イメージを指定してPayloadを起動する。
4. `strict`ヘルスチェックと`mise run prod:logs`を確認する。
5. `.env.release`を一時ファイルから`mv`して更新する。
6. `mise run prod:start-tunnel`を実行する。
7. Workerルートを削除し、通常ページを確認する。

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

記録後に`mise run prod:start-tunnel`と`mise run prod:ps`を実行し、`cloudflared`のログを確認します。
続けてWorkerルートを削除し、公開URLを確認します。
通常ページを確認できない場合はWorkerルートを再追加し、Tunnelを停止します。

旧イメージのアプリケーションと新しいDBスキーマに互換性がない場合は、先に同じデプロイで作成したバックアップからDBとメディアを復元します。

## イメージの保持

公開確認後に、Dockerの使用量とイメージ一覧を確認します。

```bash
docker system df
docker image ls 45th-homepage
```

現在のリリースと直前のロールバック候補を残し、それより古いイメージは運用者が確認して削除します。
イメージの自動削除は行いません。
