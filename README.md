# 第45回 技大祭ホームページ (45th-homepage)

Next.js + Payload CMS + PostgreSQL を利用したホームページプロジェクトです。
開発環境は Docker と `mise` を活用し、ローカル環境の差異をなくして効率的に開発できるように構築されています。

## 前提条件

このプロジェクトの開発には以下のツールが必要です。

- **Docker** (Docker Compose)
- **mise** ([mise-en-place](https://mise.jdx.dev/)): Node.jsやpnpmのバージョン管理、およびタスクランナーとして使用します。

### `mise` のセットアップ

まだインストールしていない場合は、公式ドキュメントに従って `mise` をインストールしてください。
その後、プロジェクトフォルダ直下で以下のコマンドを実行し、指定されたバージョンのNode.jsとpnpmをインストールします。

```bash
mise install
```

## ローカル開発手順

このプロジェクトでは、ホスト側（手元のPC）とコンテナ側で `node_modules` を分離しています。
そのため、基本的には `mise` で定義されたタスク経由で Docker コンテナを操作して開発を進めます。

### 1. 起動と停止

- **起動**:

  ```bash
  mise run up
  ```

  バックグラウンドでコンテナ（Payload + PostgreSQL）が立ち上がります。

- **停止**:

  ```bash
  mise run down
  ```

  コンテナを停止して削除します（データベースのデータは保持されます）。

- **ログの確認**:
  ```bash
  mise run logs
  ```

### 2. アプリケーションへのアクセス

コンテナ起動後は以下のURLにアクセスして開発を行います：

- アプリケーション: [http://localhost:3000](http://localhost:3000)
- 管理画面 (Payload Admin): [http://localhost:3000/admin](http://localhost:3000/admin)

### 3. パッケージ（依存関係）の管理

ホスト側で単に `pnpm add` を実行してもコンテナ側にはインストールされず、「Module not found」エラーの原因になります。
パッケージの追加・削除は、必ず以下の `mise` コマンドを使用してください。

- **通常パッケージの追加**:

  ```bash
  mise run add <パッケージ名>
  # 例: mise run add lucide-react
  ```

- **開発用パッケージの追加**:

  ```bash
  mise run add-D <パッケージ名>
  # 例: mise run add-D vitest
  ```

- **パッケージの削除**:

  ```bash
  mise run rm <パッケージ名>
  ```

- **依存関係のクリーンインストール**:
  ```bash
  mise run install
  ```
  ※ブランチを切り替えた際など、手元とコンテナ内の依存関係を同期し直したい場合に使います。

### 4. コンテナへのログイン

デバッグ等でNext.js (Payload) コンテナの内部に入りたい場合は以下を実行します:

```bash
mise run sh
```

## 開発ルール

### ブランチ名の命名規則

機能追加やバグ修正を行う際は、以下のルールに従ってブランチを作成してください。

```text
[type]/[name]/[task description]
```

- **type**: 変更の種類
  - `feat`: 新機能の追加
  - `fix`: バグ修正
  - `refactor`: リファクタリング（機能追加やバグ修正を伴わないコードの改善）
  - `chore`: パッケージの更新やビルドツールの設定変更など、ソースコード以外の作業
  - `docs`: ドキュメントのみの変更
- **name**: 作業者の名前（例: `yama`, `tsukachan`）
- **task description**: 作業内容の簡潔な説明（英語のケバブケース推奨）

**例:**

- `feat/yama/initial-task` （yamaが初期化タスクを実装）
- `fix/tsukachan/header-layout` （tsukachanがヘッダーのレイアウト崩れを修正）
- `chore/kiyo/update-deps` （kiyoが依存パッケージを更新）

### コミットメッセージのルール

Conventional Commits の標準的なルールに従い、コミットメッセージの先頭に `type`（変更の種類）をつけてください。

```text
[type]: [コミットの簡単な説明]
```

**type の種類:**

- `feat`: 新機能の追加
- `fix`: バグ修正
- `refactor`: リファクタリング（機能追加やバグ修正を伴わないコードの改善）
- `chore`: パッケージの更新やビルドツールの設定変更など、ソースコード以外の作業
- `docs`: ドキュメントのみの変更
- `test`: テストコードの追加・修正
- `style`: コードの動作に影響しないフォーマットの変更（空白、カンマなど）

**例:**

- `feat: お知らせ一覧ページを追加`
- `fix: スマホ表示時にメニューが重なる問題を修正`
- `chore: vitest を追加`
