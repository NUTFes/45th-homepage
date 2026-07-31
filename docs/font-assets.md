# フォント運用ガイド

このプロジェクトでは、フォント原本に含まれるWeb表示可能なUnicodeコードポイントを固定チャンクへ分割し、`unicode-range` 付きCSSで配信しています。ページやPayload CMSの本文から使用文字を抽出する方式ではありません。

## 最初に確認すること

| 変更内容                                               | 必要な作業                                       |
| ------------------------------------------------------ | ------------------------------------------------ |
| ページの文言を追加・変更する                           | 何もしない                                       |
| Payload CMSに新しい文言を登録する                      | 何もしない                                       |
| 現在のフォントに含まれる珍しい漢字を初めて使う         | 何もしない。対応チャンクがブラウザから取得される |
| 新しいフォントファミリー、ウェイト、スタイルを追加する | 原本と設定を追加し、`fonts:generate` を実行する  |
| フォント原本を差し替える                               | 原本を差し替え、`fonts:generate` を実行する      |
| チャンク分割設定や生成器を変更する                     | `fonts:generate` を実行する                      |

通常の文言追加では、文字一覧への追記、依存関係の追加、フォント再生成は不要です。

## 構成

| パス                                                     | 役割                                | 手動編集 |
| -------------------------------------------------------- | ----------------------------------- | -------- |
| `assets/fonts/`                                          | フォント原本とライセンス            | 可       |
| `scripts/font-assets.cjs`                                | フォント設定、生成、検証            | 可       |
| `src/app/(frontend)/fonts/generated/fonts.generated.css` | `@font-face` と `unicode-range`     | 不可     |
| `src/app/(frontend)/fonts/generated/fonts.manifest.json` | 入出力ハッシュとチャンク情報        | 不可     |
| `public/font/generated/`                                 | ブラウザへ配信するハッシュ付きWOFF2 | 不可     |
| `src/app/(frontend)/styles.css`                          | Tailwind CSSで使うフォント変数      | 可       |

生成物はGitにコミットします。ビルド時には再生成せず、コミット済み生成物が原本・設定と一致することだけを検証します。

## 新しいフォントを追加する

以下は、新しい本文用フォント `Example Sans` の400ウェイトを追加する例です。

### 1. ライセンスを確認して原本を配置する

Webフォントとしての再配布・変換・サブセット化が許可されていることを確認してください。ライセンスファイルも原本と同じディレクトリへ保存します。

```text
assets/fonts/example-sans/
├── ExampleSans-Regular.ttf
└── LICENSE.txt
```

フォント原本を `public/` に置かないでください。`public/` 配下に置くと原本全体をURLから直接取得できてしまいます。

### 2. `FONT_CONFIGS` に設定を追加する

`scripts/font-assets.cjs` の `FONT_CONFIGS` にエントリーを追加します。

```js
{
  id: "example-sans-400",
  family: "Example Sans 45th",
  source: "assets/fonts/example-sans/ExampleSans-Regular.ttf",
  outputPrefix: "example-sans-400",
  commonProfile: "content",
  weight: "400",
  style: "normal",
},
```

各項目の意味は次のとおりです。

| 項目            | 指定方法                                                              |
| --------------- | --------------------------------------------------------------------- |
| `id`            | 全設定内で一意な識別子                                                |
| `family`        | CSSの `font-family`。同じファミリーの各ウェイト・スタイルで同一にする |
| `source`        | リポジトリルートから原本までの相対パス                                |
| `outputPrefix`  | 生成ファイルの接頭辞。全設定内で一意なkebab-caseにする                |
| `commonProfile` | 本文用は `content`、見出し・装飾用は `display`                        |
| `weight`        | CSSと同じ文字列。例: `"400"`、`"700"`                                 |
| `style`         | 通常書体は `"normal"`、斜体は `"italic"`                              |

`commonProfile` の違い:

- `content`: ASCII、かな、一般的な記号、常用漢字をcommonチャンクに含めます。本文用フォント向けです。
- `display`: ASCII、かな、全角文字の基本範囲と「技大祭」をcommonチャンクに含めます。見出し・装飾用で、初期転送量を抑えたい場合に使います。

同じファミリーに複数ウェイトを追加する場合は、`family` を揃え、`id`、`outputPrefix`、`source`、`weight` をウェイトごとに分けてください。斜体も同様に、別エントリーとして `style: "italic"` を指定します。

### 3. アプリケーション用のCSS変数を追加する

`src/app/(frontend)/styles.css` の `@theme` にフォント変数を追加します。

```css
--font-example: "Example Sans 45th", sans-serif;
```

これにより、Tailwind CSSの `font-example` クラスとして利用できます。

```tsx
<p className="font-example">Example</p>
```

サイト全体の本文フォントを変更する場合は、既存の `--font-sans` と `--default-font-family` を更新してください。フォント設定の `family` とCSS側のファミリー名は完全に一致させます。

### 4. 生成する

```bash
pnpm run fonts:generate
```

このコマンドは次をまとめて実行します。

1. 原本のUnicodeコードポイントを取得
2. commonチャンクと256コードポイント単位のextendedチャンクを生成
3. 内容ハッシュ付きWOFF2を `public/font/generated/` に出力
4. `unicode-range` CSSとマニフェストを更新
5. 古い生成チャンクを削除
6. 欠落・重複・改変がないことを再検証

生成中にエラーが発生した場合、生成CSSを手作業で直さないでください。原本または `FONT_CONFIGS` を修正してから、もう一度生成します。

### 5. 検証する

```bash
pnpm run fonts:check
pnpm run quality:check
```

開発サーバーでも対象画面を開き、ブラウザのNetworkパネルで次を確認します。

- `/font/generated/*.woff2` がHTTP 200で取得される
- 原本ファイルではなく、必要なチャンクだけが取得される
- 見出し、本文、太字、斜体が意図したフォントで表示される

### 6. 変更をコミットする

少なくとも次を一緒にコミットします。

- `assets/fonts/<font-name>/` の原本とライセンス
- `scripts/font-assets.cjs` の設定
- `src/app/(frontend)/styles.css` のフォント変数
- `src/app/(frontend)/fonts/generated/` のCSSとマニフェスト
- `public/font/generated/` の追加・削除されたWOFF2

生成ファイルの一部だけをコミットすると、CIの `fonts:check` が失敗します。

## フォント原本を差し替える

1. `assets/fonts/` の原本を差し替える
2. ファイル名を変えた場合は `FONT_CONFIGS.source` も更新する
3. ライセンスが変わっていないか確認する
4. `pnpm run fonts:generate` を実行する
5. `pnpm run fonts:check` と実画面確認を行う
6. 原本、生成物、設定を同じコミットへ含める

内容ハッシュが変わるため、生成ファイル名も変わります。ファイル名は手作業で変更しないでください。

## フォントを削除する

1. コンポーネントと `styles.css` から利用箇所を削除する
2. `FONT_CONFIGS` から対象エントリーを削除する
3. 他から使われていなければ `assets/fonts/` の原本とライセンスを削除する
4. `pnpm run fonts:generate` を実行する
5. `pnpm run fonts:check` を実行する

生成器が不要になったチャンクを削除します。`public/font/generated/` だけを手作業で削除しないでください。

## CI・ビルドでの扱い

`pnpm run build` と `pnpm run quality:check` は `fonts:check` を実行しますが、`fonts:generate` は実行しません。

この分離により、開発環境とCIで異なるフォントが生成されることを防いでいます。検証に失敗しても、ビルドコマンドへ自動生成を追加しないでください。手元で一度生成し、レビュー可能な生成物をコミットします。

## トラブルシューティング

### `... is stale. Run pnpm run fonts:generate.`

原本、生成器、CSS、マニフェスト、WOFF2のいずれかが一致していません。

```bash
pnpm run fonts:generate
pnpm run fonts:check
```

生成後の全差分をコミットしてください。

### `Generated font asset file list is stale`

不足または余剰のWOFF2があります。生成ディレクトリを手作業で調整せず、`pnpm run fonts:generate` を実行してください。

### `No web font code points found`

`source` のパス、フォントファイルの破損、対応形式を確認してください。空ファイルやWeb表示可能なUnicodeマッピングを持たないフォントは使用できません。

### `Cannot generate an empty ... common chunk`

選択した `commonProfile` と原本に共通する文字がありません。本文フォントなら `content`、装飾フォントなら `display` が適切か確認してください。

### ブラウザでWOFF2が404になる

次を順番に確認します。

1. `pnpm run fonts:check` が成功するか
2. `public/font/generated/` がコミットされているか
3. `fonts.generated.css` とWOFF2が同じ変更から生成されているか
4. 開発サーバーを再読み込みしても再現するか

### 一部の文字だけフォールバックフォントになる

まず、その文字が原本のUnicode文字マップに含まれるか確認します。原本に含まれる文字はextendedチャンクから自動配信されるため、文字一覧への追記は不要です。原本に存在しない文字は、CSSのフォールバックフォントで表示されます。

### 太字・斜体が意図どおりにならない

`FONT_CONFIGS` の `weight` / `style` と、コンポーネント側の `font-weight` / `font-style` が一致しているか確認します。存在しないウェイトをCSSだけで指定すると、ブラウザによる疑似太字・疑似斜体になる場合があります。

## レビュー時のチェックリスト

- [ ] フォントのWeb配信・変換・サブセット化がライセンス上許可されている
- [ ] 原本とライセンスが `assets/fonts/` にあり、`public/` に原本がない
- [ ] `id` と `outputPrefix` が一意
- [ ] 同じファミリーの `family` がウェイト間で一致している
- [ ] CSS側のファミリー名、ウェイト、スタイルが設定と一致している
- [ ] `pnpm run fonts:generate` 後の生成物がすべて含まれている
- [ ] `pnpm run fonts:check` が成功する
- [ ] 対象画面でフォントリクエストがHTTP 200になり、表示が崩れていない
