# 協賛企業名一覧をCMSから一括貼り付けで管理する

This ExecPlan is a living document. `Progress`、`Surprises & Discoveries`、`Decision Log`、`Outcomes & Retrospective` は実装に合わせて更新する。

## Purpose / Big Picture

多数の協賛企業名をPayload CMSへ1社ずつ登録する運用をやめ、ExcelやGoogle Sheetsの企業名列を「1行1社」でまとめて貼り付けられるようにする。

既存の `sponsors` 配列は広告掲載企業の管理に使い続け、新しい `sponsorNames` textareaを企業名一覧専用とする。

`/sponsors` では現在の `<ul>` / `<li>` 構造を維持する。CSVアップロード機能、Import Plugin、CSVのGit管理は追加しない。

入力値は表示時に各行を `trim()` し、空行を除去する。企業名内部の空白と重複行は保持する。

## Progress

- [x] 現在の協賛実装、サンプルCSV、運用要件を確認した。
- [x] Collection化、Import/Export Plugin、CSVのGit管理を採用せず、既存Globalへtextareaを追加する方針を決定した。
- [x] 本番DBの `sponsors_page_sponsors` 13件すべてに画像が設定済みであることを確認し、旧画像なしデータへの後方互換を不要と判断した。
- [x] (2026-09-02 01:26 JST) `src/modules/sponsors/utils.ts` に企業名一覧の解析処理と80文字定数を追加した。
- [x] (2026-09-02 01:26 JST) `src/globals/SponsorsPage.ts` に `sponsorNames` textareaを追加した。
- [x] (2026-09-02 01:27 JST) `getSponsorsPageData.ts` と関連型を更新した。
- [x] (2026-09-02 01:27 JST) `SponsorPageView.tsx` を広告と企業名一覧の別データ源に対応させた。
- [x] (2026-09-02 01:26 JST) Payload型とDBマイグレーションを生成した。
- [x] (2026-09-02 01:38 JST) 開発DBへスキーマを反映し、管理画面と公開画面を確認した。
- [x] (2026-09-02 01:40 JST) `quality:check` と解析処理の単体テストを完了した。

## Surprises & Discoveries

- `/sponsors` は既に「順不同」と明記されているため、並び替え機能は不要。
- 協賛広告のデータ取得・表示は `getSponsorsPageData()` / `SponsorAdsSection` に集約されており、各ページを個別改修する必要はない。
- 現在の `sponsors` 配列は、画像ありを広告、画像なしを企業名一覧として兼用している。
- 本番DBを確認したところ `sponsors_page_sponsors` は13件あり、`image_id IS NULL` は0件だった。後方互換は不要なため、画像なしスポンサーへのフォールバックは実装しない。
- `sponsors` は広告専用とし、`image` を必須化する。企業名のみの一覧は `sponsorNames` に分離する。
- スポンサー用utilityは既に `src/modules/sponsors/utils.ts` に集約されているため、新しいutilityファイルは作らない。
- リポジトリには `node:test` を使った既存テストがある。新しいテスト基盤や依存は追加しない。
- 開発DBはPayloadのdev modeでスキーマ同期済みだが、`payload_migrations` に履歴がなかった。そのため `mise run migrate` は初期マイグレーションを再実行しようとして既存テーブルで停止した。開発データを破壊せずPayloadコンテナを再起動し、dev modeのスキーマ同期で `sponsor_names` のnullable列追加と `image_id` のNOT NULL化を反映した。`information_schema.columns` で両方を確認した。

## Decision Log

- **企業名一覧はPayload標準textareaで管理する。**
  - `SponsorsPage.sponsorNames` をoptionalで追加し、1行1社で入力する。
  - カスタムAdmin ComponentやCSVアップロードUIは作らない。

- **既存 `sponsors` 配列は広告専用として残す。**
  - 広告画像・URLを持つ企業の管理用として継続利用する。
  - `image` は必須にし、画像の有無をスポンサー種別の判定に使わない。
  - フィールド名や配列構造は変更しない。

- **新しい企業名一覧は `string[]` として扱う。**
  - `SponsorDTO[]` への変換や人工IDは不要。
  - URLも持たせない。

- **入力の正規化は最小限にする。**
  - 前後空白を除去する。
  - 空行を除去する。
  - 内部空白と重複行は保持する。
  - 自動dedupeやCSV解析はしない。

- **企業名は1行80文字以内とする。**
  - 既存 `companyName` と同じ制限を利用する。
  - バリデーションは `SponsorsPage.ts` に局所化する。

## Context and Orientation

主な変更対象は以下。

- `src/globals/SponsorsPage.ts`
- `src/modules/sponsors/utils.ts`
- `src/modules/sponsors/types.ts`
- `src/modules/sponsors/server/getSponsorsPageData.ts`
- `src/modules/sponsors/SponsorPageView.tsx`
- `src/payload-types.ts`
- Payload生成マイグレーション

現在の `sponsors-page` Globalには `thanksMessage` と `sponsors` がある。

`sponsors` の各行は次を持つ。

- `companyName`
- optional `image`
- optional `href`

現状は公開表示側で画像の有無から広告と企業名一覧を分岐している。今回 `sponsors` を広告専用に変更し、企業名一覧は `sponsorNames` へ分離する。

本番DBでは `sponsors_page_sponsors` 13件すべてに `image_id` が設定されているため、既存データを救済する互換フォールバックは不要。

## Plan of Work

### 1. 企業名一覧の解析処理を追加

`src/modules/sponsors/utils.ts` に追加する。

```ts
export const SPONSOR_NAME_MAX_LENGTH = 80;

export const parseSponsorNameList = (value?: string | null): string[] =>
  (value ?? "")
    .split(/\r?\n/)
    .map((name) => name.trim())
    .filter(Boolean);
```

並び替え、重複排除、URL抽出、CSV解析は行わない。

### 2. Payload Globalを更新

`src/globals/SponsorsPage.ts` に `sponsorNames` textareaを追加する。

- label: `協賛企業名一覧`
- type: `textarea`
- required: `false`
- 1行1社で貼り付けることを説明文に記載
- 各trim済み行を80文字以内に検証

既存 `sponsors` は管理画面上で「広告掲載企業」であることが分かるラベル・説明へ変更する。

`sponsors[].image` は `required: true` にし、説明から画像未登録時の企業名一覧表示に関する記述を削除する。

既存の `companyName.maxLength` も `SPONSOR_NAME_MAX_LENGTH` を利用する。

### 3. データ型を更新

`SponsorsPageData` に `sponsorNames` を追加し、`sponsors` は既存の `SponsorWithImageDTO[]` として広告専用であることを型に反映する。

```ts
sponsorNames: string[];
sponsors: SponsorWithImageDTO[];
```

新しいDTO型は作らず、既存の `SponsorWithImageDTO` を再利用する。`SponsorDTO` は `SponsorCard` の画像なしEmpty Stateプレースホルダーでも使うため、画像optionalのまま残す。

### 4. データ取得処理を更新

`getSponsorsPageData.ts` でGlobalを従来どおり1回取得する。

```ts
const sponsorNames = parseSponsorNameList(sponsorsPage.sponsorNames);
```

`sponsors` は広告専用として `SponsorWithImageDTO[]` にDTO化する。画像relationがpopulate済みオブジェクトでない、または画像URLがない場合は公開側へ不正な画像値を流さないため、その行を除外する防御は維持する。

旧画像なしスポンサーから企業名を補う互換フォールバックは追加しない。

既存の `thanksMessage` とキャッシュ設定は維持する。

### 5. `/sponsors` の表示を更新

`SponsorPageView.tsx` では `sponsors` を広告、`sponsorNames` を企業名一覧としてそのまま別々に扱う。

画像有無で分ける `splitSponsorsByImage` は削除する。`SponsorAdsSection` でもCMS由来の `sponsors` に対する `hasSponsorImage` フィルタは不要にする。

`SponsorNameList` の `<section>` / `<ul>` / `<li>` 構造は維持する。新textarea由来の企業名にリンクは付けない。

空状態は `sponsors.length === 0 && sponsorNames.length === 0` の場合だけ表示する。

`SponsorCard` の画像なしプレースホルダー表示は、広告0件時の既存Empty Stateで利用しているため残す。

### 6. Payload型とDBマイグレーションを生成

型生成後、

```ts
sponsorNames?: string | null;
```

が `SponsorsPage` に追加されていることを確認する。

マイグレーションでは、少なくとも次を確認する。

- `sponsors_page` にnullableな `sponsor_names` 列が追加される。
- `sponsors_page_sponsors.image_id` が画像必須化に合わせて `NOT NULL` になる。
- 上記以外の意図しないスキーマ変更がない。

既存 `sponsors_page_sponsors` のデータ変換・削除は行わない。本番DBでは13件すべて `image_id` が設定済みであることを確認済み。

## Concrete Steps

リポジトリルートで実行する。

```sh
git status --short --branch
git log -5 --oneline --decorate
```

必要なら開発環境を起動する。

```sh
mise run up
```

Payload型を生成する。

```sh
docker compose exec payload pnpm run generate:types
```

マイグレーションを生成する。

```sh
mise run migrate:create add-sponsor-name-list
```

生成されたマイグレーションが `sponsor_names` のnullable列追加と `image_id` の必須化、およびそれらに必要な変更だけであることを確認する。

開発DBへ適用する。

```sh
mise run migrate
```

必要なら状態を確認する。

```sh
mise run migrate:status
```

静的検証を実行する。

```sh
docker compose exec payload pnpm run quality:check
```

format / lint修正が必要な場合のみ実行する。

```sh
docker compose exec payload pnpm run fmt
docker compose exec payload pnpm run lint:fix
docker compose exec payload pnpm run quality:check
```

## Validation and Acceptance

### 管理画面

「協賛企業ページ」に「協賛企業名一覧」textareaが表示されること。

複数行を一度に貼り付けて保存できること。

既存 `sponsors` 配列では広告画像・URLを従来どおり編集できること。

広告画像を未登録のまま `sponsors` 行を保存できないこと。

### textarea未入力時

企業名一覧は表示されず、画像広告は従来どおり表示されること。

広告も企業名一覧も0件の場合だけ「協賛企業一覧は現在準備中です。」が表示されること。

### textarea入力時

例えば次を入力する。

```text
株式会社サンプルA

  株式会社サンプルB　
株式会社サンプルA
```

表示結果が次になること。

```text
株式会社サンプルA
株式会社サンプルB
株式会社サンプルA
```

- 空行は除去
- 前後空白は除去
- 重複は保持

### バリデーション

80文字を超える企業名を含む場合は保存を拒否すること。

空textareaは許可する。

### 回帰確認

`/` と `/sponsors` で既存広告の画像・企業名・リンクが従来どおり動作すること。

公開側の企業名一覧は既存の `<ul>` / `<li>` と「（順不同）」を維持すること。

最後に次が終了コード0で完了すること。

```sh
docker compose exec payload pnpm run quality:check
```

## Idempotence and Recovery

`parseSponsorNameList` は読み取り時の変換だけを行い、保存データを書き換えない。

DBマイグレーションでは `sponsor_names` 追加と `image_id` 必須化を行い、既存スポンサー行の内容は変更・削除しない。本番DBは13件すべて画像設定済みのため `NOT NULL` 化に抵触しないことを確認済み。

後方互換を維持しない方針のため、新フィールド追加後に旧アプリコードへ戻せることは要件にしない。

## Interfaces and Dependencies

新しいnpm/pnpm依存は追加しない。

追加する公開interfaceは以下だけとする。

```ts
export const SPONSOR_NAME_MAX_LENGTH = 80;

export function parseSponsorNameList(value?: string | null): string[];
```

CMS由来の広告は既存 `SponsorWithImageDTO` を使って画像必須を型に反映する。`SponsorDTO` は広告0件時の `SponsorCard` プレースホルダーで使うため画像optionalのまま残し、プレースホルダー専用コンポーネントや新しい抽象化は追加しない。

CSV parser、Import Plugin、文字コード変換ライブラリ、専用の企業名DTO、専用utilityファイル、新しいテスト依存は追加しない。

## Outcomes & Retrospective

Payload管理画面で複数行の企業名を1回の保存操作で登録し、`/sponsors` の既存 `<ul>` / `<li>` 内に「空行除去・前後trim・重複保持」で表示されることを確認した。81文字の行は「企業名は1行80文字以内」で保存拒否され、空textareaはAPI経由で保存できた。画像なしの広告行も「This field is required.」で保存拒否された。検証用の企業名データは最後に空へ戻した。

生成マイグレーション `src/migrations/20260901_162611_add_sponsor_name_list.ts` は `sponsors_page.sponsor_names` のnullable列追加と `sponsors_page_sponsors.image_id` のNOT NULL化、および逆操作だけを含む。Payload生成型では `sponsorNames?: string | null` と必須の `image: number | Media` を確認した。

`docker compose exec payload pnpm run quality:check` はformat、lint、font assets、TypeScriptの全段階を終了コード0で完了した。`node --import tsx --test src/modules/sponsors/utils.test.ts` は2件とも成功した。トップページの協賛枠と `/sponsors` の空状態もブラウザで確認した。

広告掲載企業と企業名一覧のデータ源を分離し、旧画像なしスポンサー向けの互換分岐、新しいCSV Import機構、独自Admin UI、新規依存は追加していない。計画した機能と検証は完了し、残作業はない。

---

2026-09-02更新: 実装結果、開発DBのdev mode同期に関する発見、管理画面・公開画面・自動検証の証跡を反映し、ExecPlanを完了状態にした。
