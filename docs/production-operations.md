# 本番運用ガイド

単一の VM / CT で `45th-homepage` を運用するための手順です。数十秒から数分の停止を許容し、DB schema の不一致を起こさないことと、人が復旧できることを優先します。

## 構成と判断

```text
Internet
   |
Cloudflare Tunnel
   |
Payload / Next.js (1 container)
   |---------------- PostgreSQL
   |
SeaweedFS weed mini (1 container / 1 data volume / S3)
```

- Payload は常に 1 container です。rolling update、`docker-rollout`、Traefik は使いません。
- Cloudflare Tunnel の接続先は `http://payload:3000` です。host 公開 port はありません。
- Dozzle は確認できた用途がなく、Docker socket と `7007/tcp` の公開を伴っていたため削除しました。通常は `docker compose logs` を使います。
- SeaweedFS は単一 node 用の `weed mini` に統合します。Compose service / 内部 DNS 名の `seaweedfs-s3` は初回切替との互換性のため維持しますが、実体は master、volume、filer、S3 をまとめた 1 process です。
- `weed mini` は新しい `seaweedfs-data` volume を使います。旧 3 volume は mount、変換、自動削除しません。初回切替の既存 media は自動移行せず、管理者が後述の手順で手動再登録します。
- Payload の起動時 migration (`prodMigrations`) は使いません。同じ commit から作った one-shot migrator を、旧 Payload 停止後にだけ実行します。
- `DATABASE_URL` は backup / restore 対象の `postgres:5432`、`POSTGRES_USER`、`POSTGRES_PASSWORD`、`POSTGRES_DB` と一致しなければ script が拒否します。query parameter は使いません。password に URL の予約文字を使う場合は URI encoding した値が decode 後に `POSTGRES_PASSWORD` と一致するようにします。
- 通常の app deploy は PostgreSQL / SeaweedFS を更新しません。初回の split 構成検出時だけ、旧 media の検証済み backup と DB migration の後に S3 service を fresh `weed mini` へ置き換えます。
- GitHub Actions は app / migrator image と同じ commit の運用 file を release bundle にします。app / migrator は `@sha256:...`、基盤 / tool は `latest` ではない exact version tag で実行します。

Compose project 名は本番が `45th-homepage`、性能試験が `45th-homepage-perf` に固定されています。

変更前は rolling 中に起動時 migration が走り得るため新旧 schema の同時利用余地があり、本番 host の `git pull` / build、Traefik と Dozzle の Docker socket、公開 port、`latest`、DB だけの同一 host backup に運用が依存していました。変更後は単一 app の直列切替、CI 生成 digest、専用 migrator、DB/media 一体の検証済み復旧点、最小限の内部 network に役割を絞っています。

## Release bundle

`main` の CI が成功すると、Actions artifact `production-release-<commit SHA>` が作成されます。中の archive には次が含まれます。

```text
production-images.env
compose.prod.yml
.env.production.example
scripts/{production-common,deploy-production,backup-production,restore-production}.sh
docs/production-operations.md
SHA256SUMS
```

本番 host では source の `git pull` や Docker build は不要です。artifact を staging directory で展開・検証し、同じ bundle の Compose と scripts を一緒に配置します。

配置前に backup timer / cron を一時停止し、deploy / backup / restore が実行中でないことを確認します。配置完了後に timer を再開してください。

```bash
sudo install -d -m 0750 -o "$USER" -g "$(id -gn)" /opt/45th-homepage
install -d -m 0700 /opt/45th-homepage/.deploy-state

staging_dir="$(mktemp -d /tmp/45th-release.XXXXXX)"
tar -xzf production-release-<commit>.tar.gz -C "$staging_dir"
bundle_dir="$staging_dir/production-release"
(cd "$bundle_dir" && sha256sum -c SHA256SUMS)

# backup/deploy/restore と混在版の配置が競合しないよう同じ lock を取る
umask 077
exec 9>>/opt/45th-homepage/.deploy-state/production.lock
flock -x 9
install -m 644 "$bundle_dir/compose.prod.yml" /opt/45th-homepage/compose.prod.yml
install -m 644 "$bundle_dir/.env.production.example" /opt/45th-homepage/.env.production.example
install -d -m 755 /opt/45th-homepage/scripts /opt/45th-homepage/docs
install -m 755 "$bundle_dir"/scripts/*.sh /opt/45th-homepage/scripts/
install -m 644 "$bundle_dir/docs/production-operations.md" /opt/45th-homepage/docs/
install -m 600 "$bundle_dir/production-images.env" /opt/45th-homepage/.env.production.images
flock -u 9
exec 9>&-
```

`staging_dir` は確認後に削除できます。private GHCR package を使う場合は、既存本番の初回切替、新規 host のどちらでも、backup / deploy より前に `read:packages` だけを持つ credential を設定します。

```bash
read -rsp "GHCR token: " GHCR_TOKEN
printf '%s' "$GHCR_TOKEN" | docker login ghcr.io -u <github-user> --password-stdin
unset GHCR_TOKEN
```

## 既存本番からの初回切替（split SeaweedFS → weed mini）

この節は本構成を merge した後の最初の 1 回だけ実施します。既存 media の自動移行は行いません。既存の `.env.production` を example で上書きしないでください。

### 切替前の保全と棚卸し

1. VM / CT snapshot を取得し、現在の `pgbackup` volume を別 disk / host に退避します。
2. 公開中の原画像を手元へ保存し、Media の filename / alt、使用箇所を一覧化します。参照箇所は Top Page の `PICKUP`、Programs の `企画画像` / `地図画像`、Sponsors Page の `広告画像` です。
3. 現在の `.env.production`、旧 `compose.prod.yml`、使用中の Payload image 情報を暗号化して別保管します。`.env.production` の mode は `600` にします。
4. 旧 `seaweedfs-master-data`、`seaweedfs-volume-data`、`seaweedfs-filer-data` を snapshot とともに保持します。`docker compose down -v` と `docker volume prune` は実行しません。
5. `/srv/45th-homepage/backups` を deploy user 所有・mode `700` で作成し、既存 `.env.production` に `BACKUP_DIR=/srv/45th-homepage/backups` だけを追記します。

release bundle を配置し、Cloudflare Zero Trust の Public Hostname service を旧 `http://traefik:80` から `http://payload:3000` に変更します。次に、旧 split SeaweedFS がまだ稼働している状態で新 backup script を実行します。

```bash
cd /opt/45th-homepage
chmod 600 .env.production .env.production.images
./scripts/backup-production.sh --stop-app
```

`COMPLETE`、`SHA256SUMS`、DB archive、media 件数・容量・checksum を確認し、recovery point を off-host に複製します。この backup は旧 S3 の object を退避しますが、成功時の `weed mini` へ import する移行処理ではありません。

### 初回デプロイ

事前 backup の検証後に実行します。`seaweedfs-s3` を手動で `up` / recreate してはいけません。旧 S3 の backup 前に fresh volume へ切り替わるのを防ぐためです。

```bash
./scripts/deploy-production.sh
```

script は旧 master / volume / filer の 3 service を検出すると、次の順で処理します。

1. 旧 Payload / Tunnel を停止し、旧 DB と旧 S3 をもう一度同じ recovery point へ保存・検証する
2. one-shot migration を実行する
3. `seaweedfs-s3` container を、空の新規 `seaweedfs-data` を使う `weed mini` として recreate する
4. bucket health を確認し、空であることを検証する。失敗後の再試行でも bucket を空にし、旧 object は import しない
5. 新 Payload / Tunnel を起動し、health と S3 read/write/delete を確認する

必須の初回事前 backup は旧 local Payload image に専用 rollback tag を付け、image ID とともに `.deploy-state/legacy-rollback.env` と recovery point に記録します。deploy も停止後に 2 つ目の recovery point を作成します。script は初回切替を `.deploy-state/weed-mini-cutover.env` に記録し、deploy が最後まで成功した時だけ削除します。この file は手動削除しません。失敗後の再試行でも成功経路へ旧 object が混入しないための marker です。

migration 後の失敗では、表示された recovery point を `--restore-media` 付きで復元します。S3 gateway の置換前なら旧 S3、置換後なら mini に旧 object を戻して旧 DB / Payload を起動します。legacy recovery は media なしでは開始できず、切替 marker を再作成します。これは障害復旧だけに使い、次の切替再試行では marker に従って mini を再度空にします。復旧自体が失敗した場合の最終手段は事前の VM / CT snapshot です。

### 管理者による手動再登録

初回デプロイが `Deployment completed` を表示して終了した後にだけ、管理画面で棚卸し済みの画像を再登録します。

1. 既存 Media record の編集画面で原画像を再 upload できる場合は、alt を確認して同じ record を保存します。ID と既存参照を維持できます。その場合も参照元の Top Page、Sponsors Page、各 Program を保存し直し、Program は必要な公開版まで公開して cache を更新します。
2. 同じ record で置換できない場合は新しい Media を作り、Top Page の `PICKUP`、Programs の `企画画像` / `地図画像`、Sponsors Page の `広告画像` を新しい Media に選び直します。Programs は必要な公開版まで保存・公開します。
3. Media 一覧の thumbnail、Top / Events・各 Program / Sponsors page、代表 media URL を確認します。古い Media record は全参照の付け替え確認後にだけ削除します。
4. 再登録完了後に `./scripts/backup-production.sh --stop-app` を実行し、DB と mini の media を含む新しい recovery point を検証・off-host 複製します。

ここまで終えて初回切替完了です。それまでは事前 snapshot、初回 recovery point、旧 3 volume を削除しません。成功した deploy は最後に旧 master / volume / filer、Traefik、Dozzle、`pg-backup` container の削除を試みます。cleanup 失敗は新 release を停止せず log に残すため、後で `--remove-orphans` を再実行します。旧 data volume と `pgbackup` volume は削除しません。

## 新規 host の初期セットアップ

以下の `cp` は新規 host 専用です。

```bash
cd /opt/45th-homepage
cp .env.production.example .env.production
chmod 600 .env.production .env.production.images
```

`.env.production` の全 placeholder を変更します。`BACKUP_DIR` は既存の canonical な絶対 path でなければなりません。script は `/`、`..`、symlink、別 owner、group / other から読める directory を拒否します。

```bash
sudo install -d -m 0700 -o "$USER" -g "$(id -gn)" /srv/45th-homepage/backups
```

初回だけ data 基盤を起動し、`weed mini` が作成した bucket を確認します。

```bash
docker compose \
  --project-name 45th-homepage \
  --env-file .env.production \
  --env-file .env.production.images \
  -f compose.prod.yml \
  pull postgres seaweedfs-s3

docker compose \
  --project-name 45th-homepage \
  --env-file .env.production \
  --env-file .env.production.images \
  -f compose.prod.yml \
  up -d --wait postgres seaweedfs-s3

docker compose \
  --project-name 45th-homepage \
  --env-file .env.production \
  --env-file .env.production.images \
  -f compose.prod.yml \
  run --rm -T media-tool \
  --endpoint-url http://seaweedfs-s3:8333 \
  s3api head-bucket --bucket media
```

`weed mini` は `S3_BUCKET` の bucket を初回起動時に作ります。`S3_BUCKET` が `media` 以外なら最後の引数も合わせます。その後、通常 deploy を 1 回実行します。

## 通常デプロイ

新しい release bundle 全体を配置してから実行します。

```bash
./scripts/deploy-production.sh
```

repository checkout に `mise.toml` も配置している環境では、`mise run prod:deploy` も同じ script を呼びます。release bundle だけで運用する host は直接 script を実行します。

script は local Docker socket と固定 project を使い、親 shell の `COMPOSE_*` や secret / image 変数を Compose に引き継ぎません。処理順は次の通りです。

1. secret mode、placeholder、path、空き容量、digest、release revision、`DATABASE_URL` と backup 対象 DB の同一性を検証する
2. app / migrator / Tunnel / backup tool だけを pull し、app と migrator の OCI revision が一致することを確認する
3. Payload が 1 container 以下、migration job が停止済みで、PostgreSQL と現在の S3 service（旧 gateway または `weed mini`）が healthy であることを確認する
4. Cloudflare Tunnel と旧 Payload を停止する
5. PostgreSQL dump と media bucket を同じ recovery point に保存して検証する
6. 復旧点を記録した `.deploy-state/restore-required.env` を作り、one-shot migrator を実行する
7. 初回に旧 split 構成を検出した場合だけ S3 service を `weed mini` へ置換し、切替再試行を含め bucket が空であることを確認する。backup から object は import しない
8. bucket readiness、新 Payload の strict DB health、S3 put / head / delete を確認する
9. Tunnel を起動し、外部 health JSON の release revision と代表 page の HTTP 200 を確認する
10. 成功した state を原子的に記録し、復旧要求 marker と初回切替 marker を削除する
11. 旧構成の orphan container を best-effort で削除する。失敗しても検証済み release は継続する

旧 app と新 schema、または新旧 app が同時稼働する時間はありません。通常の停止時間は手順 4 から 9 までです。

### 失敗時

| 段階                      | script の動作                                                                                                               |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| 停止前                    | 何も変更せず終了                                                                                                            |
| 旧 app 停止〜migration 前 | 旧 Payload、health、旧 Tunnel、外部 health の順で復旧を試みる                                                               |
| migration 開始後          | Payload / Tunnel を停止し、recovery point と migration log を表示する。DB/media を同じ時点へ戻すため `--restore-media` 必須 |
| 成功 state 記録後         | 検証済み新 release は継続する。`restore-required.env` が残れば restore、なければ手動再登録前に deploy を再試行する          |

migration は file ごとの transaction なので、途中失敗時は先行 file が commit 済みの場合があります。旧 image を自動起動せず、次の restore を使います。`migrate:down` は使いません。

初回 `weed mini` 切替で migration 境界を越えた後も、同じ `--restore-media` を使います。gateway 置換後なら旧 S3 の論理 backup を mini に復元してから旧 DB / Payload を戻す緊急復旧であり、成功時の手動再登録方針を変更するものではありません。切替 marker は残るため、次の deploy は mini を空にしてから新 Payload を起動します。復元できなければ VM / CT snapshot と旧 Compose / 3 volume を一体で戻します。

`restore-required.env` がある間は deploy と backup を失敗終了させます。marker には使用すべき recovery point と media 復元の要否が記録されています。deploy の migration 境界を越えた失敗では常に DB と media を同じ recovery point へ戻します。手動で marker を削除せず、表示された recovery point に対して restore script を完了させてください。restore 自体も DB を変更する前に同じ marker を作るため、process kill や host 再起動後にも未完了状態が残ります。

```bash
cat .deploy-state/restore-required.env
./scripts/restore-production.sh <markerのrecovery-point-name> --yes
# media_restore_required=true の場合:
./scripts/restore-production.sh <markerのrecovery-point-name> --restore-media --yes
```

## バックアップ

手動 backup は Payload / Tunnel を停止して書き込みを凍結し、完了後に元の container と外部 health を復旧します。

```bash
./scripts/backup-production.sh --stop-app
```

recovery point は `${BACKUP_DIR}/<UTC timestamp>-<target digest prefix>/` に作られます。

```text
COMPLETE                 完了 marker
manifest.env             target / 稼働 image、DB identity、bucket、DB/media size と件数
postgres.dump            PostgreSQL custom-format dump
SHA256SUMS               DB、manifest、listing、image record 等のroot checksum
media/                   S3 object body の論理 copy
media-files.txt          S3 listing
MEDIA_SHA256SUMS         media checksum（空 bucket では空 file）
target-images.env        backup 実行時の deploy 対象
previous-images.env      直前に成功した release（存在する場合、下記と排他）
legacy-rollback.env      初回切替前 image（該当する場合、上記と排他）
```

`.incomplete` directory や `FAILED` marker は有効な backup ではありません。script は事故防止のため古い backup を削除しません。

旧構成の RPO を悪化させない基準として、少なくとも 6 時間ごとに実行します。

```cron
15 */6 * * * cd /opt/45th-homepage && ./scripts/backup-production.sh --stop-app >> .deploy-state/backup.log 2>&1
```

deploy user の crontab に登録します。`.deploy-state` は mode `700` なので log も他 user から読めません。systemd timer を使う場合も同じ user とコマンドを指定します。

運用基準の例:

- local: 6 時間ごと、最低 7 日分
- off-host: 完了済み recovery point を毎日複製し、最低 30 日分
- alert: 最新の `COMPLETE` が 7 時間を超えたら通知
- drill: 少なくとも四半期ごとに隔離環境へ DB と media を実復元

自動削除や off-host 製品は環境依存なので、この repository からは選びません。単一 VM 内だけでは host 障害に耐えないため、backup に加え、暗号化した `.env.production`、Tunnel 設定、release bundle、GHCR credential の再発行手順も別保管します。

構造確認:

```bash
cd /srv/45th-homepage/backups/<recovery-point>
test "$(< COMPLETE)" = ok
sha256sum -c SHA256SUMS
if test -s MEDIA_SHA256SUMS; then sha256sum -c MEDIA_SHA256SUMS; fi
```

S3 backup は object body と key の論理 copy です。任意の object metadata、version history、SeaweedFS 内部 metadata の完全複製ではありません。Payload media の復旧用途を対象とします。初回切替直前の recovery point は旧 split S3 から取得しますが、成功経路では mini へ import せず、緊急復旧時だけ `--restore-media` で利用します。

## ロールバック / 復元

DB schema を変更していないことが確実なら、以前の `production-images.env` を release bundle から戻し、通常 deploy できます。

schema を変更した、migration が失敗した、または不明なら、検証付き restore script を使います。

```bash
./scripts/restore-production.sh <recovery-point-name>
# 非対話:
./scripts/restore-production.sh <recovery-point-name> --yes
```

通常の recovery で media も完全一致させる場合は、破壊的な option を付けます。初回の legacy recovery と marker が要求する場合は必須です。

```bash
./scripts/restore-production.sh <recovery-point-name> --restore-media
```

restore script は production lock を取得し、`COMPLETE`、root と DB/media checksum、`pg_restore --list`、DB user/name、bucket 名、旧 image digest / OCI revision（初回切替では保存済み local image ID）を全て確認してから確認入力を求めます。既存の復旧要求 marker がある場合は同じ recovery point だけを許可し、`media_restore_required=true` なら `--restore-media` なしでは開始しません。その後にだけ次を行います。

1. 復旧要求 marker を原子的に記録し、残存 migrator、Payload、Tunnel を停止確認
2. DB を作り直し、`--exit-on-error --single-transaction` で restore
3. `--restore-media` 指定時は bucket を空にし、全 object を再送して件数・size を照合
4. 旧 Payload、strict health、Tunnel、外部 revision、代表 page を確認
5. `.deploy-state/current-images.env` と rollback record を原子的に更新し、marker を削除

新規 host で Payload が一度も稼働しておらず、rollback image 記録のない recovery point は bootstrap recovery として扱います。DB（指定時は media）だけを復元し、失敗した未追跡 Payload container を削除して Payload / Tunnel を停止したまま終了します。その後、同じ release bundle で通常 deploy を再実行します。既に current / legacy state がある host では、古い bootstrap recovery point の利用を拒否します。

初回の legacy rollback では旧 S3 object の論理 backup も戻すため `--restore-media` が必須で、script も media なしの legacy restore を拒否します。gateway 置換後は復元先が `weed mini` になり、次回 deploy で空にする初回切替 marker が再作成されます。旧 split topology 自体へ戻す必要がある場合は、Payload / Tunnel を停止したまま事前 snapshot と旧 Compose / 3 volume を一体で戻します。rollback 後は `.env.production.images` に次の immutable release bundle を配置してから通常 deploy してください。restore が途中で失敗した場合も marker を削除せず、同じコマンドを再実行します。

## Data 基盤の更新

通常 deploy は PostgreSQL / SeaweedFS image を pull も recreate もしません。version 更新は app release と分け、次の maintenance window で行います。

1. off-host 複製済み recovery point と VM / CT snapshot を確認
2. Payload / Tunnel を停止
3. review 済みの exact version へ対象 image を pull
4. PostgreSQL / `seaweedfs-s3` (`weed mini`) だけを `up -d --wait`
5. current release の通常 deploy を実行し、全 health と page を確認

data volume の major upgrade はこの手順に含めず、製品固有の upgrade / restore drill を別途作成します。

## 障害確認

```bash
docker compose \
  --project-name 45th-homepage \
  --env-file .env.production \
  --env-file .env.production.images \
  -f compose.prod.yml \
  logs --tail=200 payload cloudflared postgres seaweedfs-s3

docker inspect \
  --format '{{json .State.Health}}' \
  "$(docker compose \
    --project-name 45th-homepage \
    --env-file .env.production \
    --env-file .env.production.images \
    -f compose.prod.yml \
    ps -q payload)"
```

確認順:

1. PostgreSQL と `seaweedfs-s3` (`weed mini`)
2. `.deploy-state/releases/*.migrate.log`
3. Payload strict health
4. S3 bucket
5. Cloudflare Tunnel
6. 外部 `/api/health` の `revision` と代表 page / media URL

Docker group は host root 相当の権限です。運用 user を限定し、`.env.production`、`.env.production.images`、`BACKUP_DIR`、`.deploy-state` は他 user から読めない状態を維持してください。
