# 第45回 技大祭ホームページ (45th-homepage)

Next.js + Payload CMS + PostgreSQL を使ったホームページプロジェクトです。

---

## 目次

- [技術スタック](#技術スタック)
- [クイックスタート](#-クイックスタート)
- [ディレクトリ構成](#ディレクトリ構成)
- [開発コマンド一覧](#開発コマンド一覧)
- [パッケージ管理](#パッケージ管理)
- [データベース・マイグレーション](#データベースマイグレーション)
- [コンポーネント試験ページ](#コンポーネント試験ページ)
- [開発ルール](#開発ルール)
- [本番運用・デプロイ](#本番運用デプロイ)
- [トラブルシューティング](#トラブルシューティング)

---

## 技術スタック

| レイヤー                        | 技術                                        |
| ------------------------------- | ------------------------------------------- |
| フロントエンド / API            | [Next.js](https://nextjs.org/) (App Router) |
| CMS                             | [Payload CMS](https://payloadcms.com/)      |
| データベース                    | PostgreSQL + Drizzle ORM                    |
| 開発環境                        | Docker Compose                              |
| バージョン管理 / タスクランナー | [mise](https://mise.jdx.dev/)               |

---

## クイックスタート

初めて環境を構築する場合は、以下の手順を **順番に** 実行してください。

### ステップ 1: 必要なツールをインストール

- [ ] **Docker Desktop**（または Docker Engine + Docker Compose）
      → https://www.docker.com/products/docker-desktop/
- [ ] **mise**（Node.js・pnpm のバージョン管理＋タスクランナー）
      → https://mise.jdx.dev/getting-started.html

### ステップ 2: リポジトリをクローン

```bash
git clone <repository-url>
cd 45th-homepage
```

### ステップ 3: mise で Node.js と pnpm をインストール

```bash
mise install
```

### ステップ 4: 環境変数ファイルを用意する

`.env.example` を `.env` にコピーして、必要な値を設定してください。

```bash
cp .env.example .env
```

> `.env` の各項目については、メンバーに確認してください。

### ステップ 5: 開発サーバーを起動

```bash
mise run up
```

バックグラウンドでコンテナ（Next.js / Payload + PostgreSQL）が起動します。
初回はイメージのビルドがあるため、数分かかる場合があります。

### ステップ 6: アクセスして確認

| URL                         | 説明                                 |
| --------------------------- | ------------------------------------ |
| http://localhost:3000       | アプリケーション本体                 |
| http://localhost:3000/admin | Payload CMS 管理画面                 |
| http://localhost:3000/dev   | コンポーネント試験ページ（開発のみ） |

> ここまで完了したら開発を始められます！

---

## ディレクトリ構成

```
45th-homepage/
├── src/
│   ├── app/              # Next.js App Router（ページ・レイアウト）
│   ├── collections/      # Payload CMS コレクション定義（DBスキーマ）
│   ├── components/       # 共通 React コンポーネント
│   ├── migrations/       # DB マイグレーションファイル（自動生成）
│   └── payload.config.ts # Payload CMS の設定ファイル
├── docs/                 # ドキュメント類
├── compose.yml           # 開発用 Docker Compose 設定
├── compose.prod.yml      # 本番用 Docker Compose 設定
├── scripts/              # 本番のdeploy・backup・restore script
├── mise.toml             # mise タスク定義
└── .env.example          # 環境変数のテンプレート
```

---

## 開発コマンド一覧

日常的な開発作業で使うコマンドをまとめています。

### コンテナの操作

| コマンド        | 説明                                   |
| --------------- | -------------------------------------- |
| `mise run up`   | コンテナをバックグラウンドで起動       |
| `mise run down` | コンテナを停止・削除（DBデータは保持） |
| `mise run logs` | コンテナのログをリアルタイム表示       |
| `mise run sh`   | コンテナ内部に入る（デバッグ用）       |

> コンテナを止めてもデータベースのデータは消えません。データごとリセットしたい場合は Docker の Volume を削除してください。

---

## パッケージ管理

ホスト側（手元のPC）とコンテナ側で `node_modules` を分離しているため、
パッケージ操作には必ず `mise run` 経由のコマンドを使ってください。
**直接 `pnpm add` を実行するとコンテナと同期がとれず、エラーの原因になります。**

| コマンド                          | 説明                                                           |
| --------------------------------- | -------------------------------------------------------------- |
| `mise run add <パッケージ名>`     | 通常パッケージを追加（複数指定可）                             |
| `mise run add -D <パッケージ名>`  | 開発用パッケージを追加（複数指定可）                           |
| `mise run rm <パッケージ名>`      | パッケージを削除                                               |
| `mise run install` / `mise run i` | 依存関係をクリーンインストール（ブランチ切り替え後などに使用） |

**例:**

```bash
# 通常パッケージを追加
mise run add lucide-react motion

# 開発用パッケージを追加
mise run add -D vitest @types/node

# パッケージを削除
mise run rm lodash
```

---

## データベース・マイグレーション

`src/collections/` 以下のコレクション定義（DBスキーマ）を変更した場合、
マイグレーションファイルを作成して Git にコミットする必要があります。

### 基本的な流れ

```
コレクションを変更
    ↓
マイグレーションファイルを作成
    ↓
生成されたファイルを Git にコミット
    ↓
CI が app と専用 migrator image を同じ commit から生成
    ↓
本番 deploy が旧 Payload 停止後に migrator を1回実行
```

### コマンド一覧

| コマンド                         | エイリアス           | 説明                                 |
| -------------------------------- | -------------------- | ------------------------------------ |
| `mise run migrate:create <name>` | `mise run mc <name>` | マイグレーションファイルを作成       |
| `mise run migrate:status`        | `mise run ms`        | マイグレーションの適用状況を確認     |
| `mise run migrate`               | `mise run m`         | 保留中のマイグレーションを手動で実行 |

### 作業手順の例

```bash
# 1. コレクションを編集後、マイグレーションファイルを作成
mise run migrate:create add-news-collection

# 2. src/migrations/ に生成されたファイルを確認
# 3. Git にコミット（.ts / .json / index.ts をすべてコミットすること）
git add src/migrations/
git commit -m "feat: お知らせコレクションのマイグレーションを追加"
```

> UIや見た目のみの変更（Reactコンポーネントなど）では、マイグレーションは不要です。
> `mise run migrate` は開発・保守用です。本番では起動時 migration や手動実行を行わず、直列 deploy script に任せます。

---

## コンポーネント試験ページ

開発環境限定で、コンポーネントの見た目・挙動を確認できるページを用意しています。

- **アクセス先**: http://localhost:3000/dev
- 本番環境にはデプロイされません

確認できるカテゴリ:

- **Layout Components** — Header / Footer / BottomNav
- **Common Components** — NavButton / Carousel
- **Page Modules** — ページ単位のコンポーネント群

---

## 開発ルール

### ブランチ命名規則

```
[type]/[name]/[task-description]
```

| type       | 用途                           |
| ---------- | ------------------------------ |
| `feat`     | 新機能の追加                   |
| `fix`      | バグ修正                       |
| `refactor` | リファクタリング               |
| `chore`    | パッケージ更新・ビルド設定など |
| `docs`     | ドキュメントのみの変更         |

**例:**

```
feat/yama/initial-task
fix/tsukachan/header-layout
chore/kiyo/update-deps
```

### コミットメッセージ（Conventional Commits）

```
[type]: [コミットの簡単な説明]
```

| type       | 用途                                       |
| ---------- | ------------------------------------------ |
| `feat`     | 新機能の追加                               |
| `fix`      | バグ修正                                   |
| `refactor` | リファクタリング                           |
| `chore`    | パッケージ更新・ビルド設定など             |
| `docs`     | ドキュメントのみの変更                     |
| `test`     | テストコードの追加・修正                   |
| `style`    | フォーマットのみの変更（動作に影響しない） |

**例:**

```
feat: お知らせ一覧ページを追加
fix: スマホ表示時にメニューが重なる問題を修正
chore: vitest を追加
```

---

## 本番運用・デプロイ

詳細は [本番運用ガイド](docs/production-operations.md) を参照してください。

本番 image は `main` の CI が GHCR に生成します。CI artifact には同じ commit の digest、Compose、deploy / backup / restore script がまとまっています。VM / CT 上で source を `git pull`・build せず、release bundle 全体を配置して deploy します。

Payload は単一 container とし、旧 Payload 停止 → 検証済み backup → one-shot migration → 新 Payload の strict health → Tunnel 起動、の順で処理します。migration / restore 開始後に `.deploy-state/restore-required.env` が残った場合は、手動削除せず運用ガイドの復旧手順を実行します。

### 主要コマンド

| コマンド                  | 用途                                            |
| ------------------------- | ----------------------------------------------- |
| `mise run prod:up`        | data基盤初期化後の初回appを含む直列デプロイ     |
| `mise run prod:deploy`    | backup・migration・health確認を含む直列デプロイ |
| `mise run prod:backup`    | Payloadを停止してDBとメディアの復旧点を作成     |
| `mise run prod:restore`   | 検証済み復旧点からDBと旧Payloadを復元           |
| `mise run prod:down`      | 本番コンテナの停止・削除（永続volumeは保持）    |
| `mise run prod:ps`        | ステータス確認                                  |
| `mise run prod:logs`      | ログ監視                                        |
| `mise run prod:perf`      | 本番相当の Docker 環境で Lighthouse 実行        |
| `mise run prod:perf:down` | 性能試験用コンテナの停止・削除                  |

---

## 本番公開前のパフォーマンス試験

`compose.perf.yml` は、本番用の Next.js standalone image、PostgreSQL、SeaweedFS S3 Gateway を起動し、別コンテナ内の headless Chromium で Lighthouse CLI を実行します。

```bash
mise run prod:perf
```

デフォルトでは `http://payload:3000/` を計測し、結果を `reports/lighthouse/` に HTML と JSON で保存します。

複数ページを計測する場合は、空白区切りで `LIGHTHOUSE_URLS` を指定します。

```bash
LIGHTHOUSE_URLS="http://payload:3000/ http://payload:3000/news" mise run prod:perf
```

生成されるファイル例:

- `reports/lighthouse/01-payload-3000.report.html`
- `reports/lighthouse/01-payload-3000.report.json`

Docker コンテナ上の計測値はホスト CPU や同時実行中のコンテナの影響で揺れます。公開前の絶対評価だけでなく、同じ環境での変更前後比較に使ってください。

試験後にコンテナを削除する場合:

```bash
mise run prod:perf:down
```

---

## トラブルシューティング

### コンテナが起動しない

```bash
# ログでエラー内容を確認する
mise run logs

# 一度コンテナを削除して再起動する
mise run down
mise run up
```

### パッケージを追加したがコンテナ側で認識されない

```bash
# コンテナとローカルの依存関係を同期し直す
mise run install
```

### マイグレーションエラーが出る

開発環境では次を確認します。

```bash
# マイグレーションの適用状況を確認
mise run migrate:status

# 手動でマイグレーションを実行
mise run migrate
```

本番では旧 image を直接起動したり `migrate:down` を実行したりせず、[本番運用ガイドのロールバック / 復元](docs/production-operations.md#ロールバック--復元) に従い、検証付き restore script で deploy 直前の recovery point を復元します。

### ポート 3000 がすでに使われている

他のプロセスがポートを使っている場合は、該当プロセスを終了するか、`.env` の PORT 設定を変更してください。

```bash
# ポートを使っているプロセスを確認（macOS / Linux）
lsof -i :3000
```

### それでも解決しない場合

Slack で気軽に聞いてください！
