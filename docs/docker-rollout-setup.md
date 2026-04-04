# デプロイセットアップガイド

[docker-rollout](https://docker-rollout.wowu.dev) を使った **ゼロダウンタイムデプロイ** の手順書です。
本番サーバーは Proxmox Ubuntu LXC を使用しています。

> **初めてデプロイする方へ**: [初回セットアップ](#初回サーバーセットアップ) から順番に進めてください。

---

## 目次

- [仕組みの概要](#仕組みの概要)
- [初回サーバーセットアップ](#初回サーバーセットアップ)
- [デプロイコマンドの使い分け](#デプロイコマンドの使い分け)
- [デプロイワークフロー](#デプロイワークフロー)
- [トラブルシューティング](#トラブルシューティング)

---

## 仕組みの概要

### ゼロダウンタイムデプロイとは

通常のデプロイでは「旧コンテナを止めて → 新コンテナを起動」するため、その間にダウンタイムが発生します。
docker-rollout を使うと、以下のように **サービスを止めずに** 入れ替えができます。

```
[現状]
  旧コンテナ (トラフィックを処理中)

[rollout 実行中]
  旧コンテナ (まだ動いている)
  新コンテナ (起動中・ヘルスチェック待ち)

[ヘルスチェック通過後]
  旧コンテナ (削除)
  新コンテナ (トラフィックを処理中)
```

### 構成要素

| コンポーネント        | 役割                                                         |
| --------------------- | ------------------------------------------------------------ |
| **Traefik**           | リバースプロキシ。新旧コンテナ間のトラフィック切り替えを担当 |
| **docker-rollout**    | コンテナの入れ替えを自動化する Docker CLI プラグイン         |
| **Cloudflare Tunnel** | 外部からのリクエストを Traefik に転送                        |

> Cloudflare Tunnel などの外部ルーティングは、アプリケーションではなく **Traefik (`http://traefik:80`)** に向けてください。

---

## 初回サーバーセットアップ

本番サーバー（Proxmox LXC）に初めて環境を構築するときの手順です。
**すでに環境が構築済みの場合は、[デプロイコマンドの使い分け](#デプロイコマンドの使い分け) へ進んでください。**

### 1. docker-rollout をインストール

本番サーバーのコンソール上で以下を実行します。

```bash
# (1) CLI プラグイン用ディレクトリを作成
mkdir -p ~/.docker/cli-plugins

# (2) バイナリをダウンロード
curl https://raw.githubusercontent.com/wowu/docker-rollout/main/docker-rollout \
  -o ~/.docker/cli-plugins/docker-rollout

# (3) 実行権限を付与
chmod +x ~/.docker/cli-plugins/docker-rollout

# (4) インストール確認（ヘルプが表示されれば成功）
docker rollout --help
```

### 2. 環境変数ファイルを配置

`.env.production` ファイルをサーバー上のプロジェクトフォルダに配置してください。
（`.env.example` を参考に、本番用の値を設定してください）

### 3. 初回デプロイを実行

```bash
mise run prod:up
# または
docker compose --env-file .env.production -f compose.prod.yml up -d --build --remove-orphans
```

コンテナが起動すれば準備完了です。
**2回目以降のデプロイは `mise run prod:deploy` を使います。**

---

## デプロイコマンドの使い分け

サーバーの状態によって使うコマンドが異なります。

### 判断フロー

```
デプロイしたい
    │
    ├─ コンテナが稼働中？
    │       │
    │      Yes ──→ mise run prod:deploy  （ローリングアップデート）
    │       │
    │       No ──→ mise run prod:up      （初回 or 再構築）
    │
    └─ わからない場合 → mise run prod:ps で確認
```

### コマンド一覧

| 状況                                   | mise コマンド          | 生の Docker コマンド                                                                           |
| -------------------------------------- | ---------------------- | ---------------------------------------------------------------------------------------------- |
| 初回デプロイ / コンテナ未稼働          | `mise run prod:up`     | `docker compose --env-file .env.production -f compose.prod.yml up -d --build --remove-orphans` |
| コンテナ稼働中・新しいコードをデプロイ | `mise run prod:deploy` | ↓ 下記参照                                                                                     |
| コンテナの停止・削除                   | `mise run prod:down`   | `docker compose --env-file .env.production -f compose.prod.yml down`                           |
| ステータス確認                         | `mise run prod:ps`     | `docker compose --env-file .env.production -f compose.prod.yml ps`                             |
| ログ監視                               | `mise run prod:logs`   | `docker compose --env-file .env.production -f compose.prod.yml logs -f`                        |

**`prod:deploy` の内部動作:**

```bash
git pull
docker compose --env-file .env.production -f compose.prod.yml build payload
docker rollout --env-file .env.production -f compose.prod.yml --timeout 120 payload
```

---

## デプロイワークフロー

通常の機能追加・修正のデプロイは以下の流れです。

### 開発者側（ローカルマシン）

```bash
# 1. 変更をコミット・プッシュ
git add .
git commit -m "feat: ○○を追加"
git push origin <ブランチ名>

# 2. main ブランチにマージ（GitHub の PR 経由で）
```

### 運用担当者側（本番サーバーのコンソール）

```bash
# 3. プロジェクトフォルダに移動
cd /path/to/45th-homepage

# 4. ローリングアップデートを実行
mise run prod:deploy
```

これだけでゼロダウンタイムデプロイが完了します。

---

## データベースマイグレーション（本番）

本番環境では、コンテナ起動時に **未適用のマイグレーションが自動実行** されます。

- 新しいマイグレーションファイルが含まれていれば、デプロイ時に自動でDBへ適用されます
- 一度実行したマイグレーションはDBに記録されるため、再起動しても二重実行されません
- UI（React側）のみの変更ではマイグレーション不要 — 既存データが消えることもありません

---

## トラブルシューティング

### `docker rollout` コマンドが見つからない

```bash
# バイナリが存在するか確認
ls -la ~/.docker/cli-plugins/docker-rollout

# 実行権限を付与
chmod +x ~/.docker/cli-plugins/docker-rollout

# Docker プラグインの認識状態を確認
docker info | grep -i plugin
```

### "No running containers" エラー

docker-rollout はコンテナが稼働中であることを前提としています。
まず `mise run prod:up` でコンテナを起動してから、`mise run prod:deploy` を使ってください。

### ヘルスチェックが失敗してデプロイが止まる

```bash
# コンテナのログを確認
mise run prod:logs

# compose.prod.yml のヘルスチェック設定を見直す
# タイムアウト（--timeout 120）を延ばすことも検討
```

### デプロイ後にアプリが正常に動かない

```bash
# ステータスを確認
mise run prod:ps

# ログで起動エラーがないか確認
mise run prod:logs

# 問題が解決しない場合は一度 down → up で再構築
mise run prod:down
mise run prod:up
```

---

## 参考リンク

- [docker-rollout 公式ドキュメント](https://docker-rollout.wowu.dev)
- [docker-rollout GitHub](https://github.com/wowu/docker-rollout)
- [Traefik ドキュメント](https://doc.traefik.io/traefik/)
