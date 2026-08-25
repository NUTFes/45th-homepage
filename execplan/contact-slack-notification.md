# お問い合わせ内容をSlackチャンネルへ安全に投稿する

This ExecPlan is a living document. The sections `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` must be kept up to date as work proceeds.

この計画は `/home/tkymhrt/.agents/skills/execplan/references/PLANS.md` の方法論に従う。実装中も、このファイル単体から作業を再開できる状態を維持する。

## Purpose / Big Picture

現在のお問い合わせ画面には入力UIとクライアント側バリデーションがあるが、実際の送信処理はなく、公開ルート `/contact` も `notFound()` で無効化されている。この変更では、利用者がフォームを送信すると、現行UIで入力された内容が技大祭実行委員会の専用Slack private channelへ通知されるようにする。

ブラウザからSlackへ直接送信せず、Next.jsの `POST /api/contact` を唯一の送信入口にする。Slack Incoming Webhook URLとCloudflare Turnstile secretはサーバーだけで保持する。APIは外部から届いたJSONをTypeScript型どおりだと信用せず、文字列型、必須項目、許可された選択肢、形式、最大文字数を実行時に再検証する。Turnstileのサーバー検証に成功した場合だけSlackへ投稿する。

Slack投稿が成功したときだけ利用者へ完了表示を出す。Slack障害、設定不備、Turnstile失敗、入力不正では成功扱いにせず、フォーム内容を保持して再送できるようにする。Payload CMSやPostgreSQLには問い合わせを保存しないが、Slack上には問い合わせ内容が保存されるため、通知先は閲覧者を限定したprivate channelとし、retention方針を公開前に確認する。

初回実装では、厳密なrequest body byte制御、永続queue、厳密な重複排除、Slack file upload、新しいschema validation libraryは導入しない。現在の固定9項目と2000文字以下の本文を安全にSlackへ届けるために必要な範囲へ実装を絞る。

## Progress

- [x] (2026-08-25 19:17+08:00) 現在のお問い合わせUI、フォーム状態管理、バリデーション、公開ルート、Docker環境変数の構成を調査した。
- [x] (2026-08-25 19:17+08:00) Slack通知方式として、特定チャンネルに固定したSlack AppのIncoming Webhookをサーバー側から呼ぶ方針を決めた。
- [x] (2026-08-25 21:28+08:00) 公開入力のruntime validation、選択肢allowlist、Turnstileのサーバー検証、Slack上の個人情報保存、重複送信の扱いを確認した。
- [x] (2026-08-25 21:53+08:00) 既存のClient `onSubmit` 構造とCloudflare運用に合わせ、送信入口をServer Actionではなく `POST /api/contact` Route Handlerとした。
- [x] (2026-08-25 22:44+08:00) オーバーエンジニアリングを避ける再レビューを行い、独自body stream parser、server fieldErrorsの往復、Turnstile site keyのbuild-time注入、専用hostname envを初回scopeから外した。
- [x] (2026-08-25 23:51+09:00) `feat/contact-slack-notification` ブランチを作成し、共通の選択肢・最大長定数、runtime request parser、共有validation、UIの `maxLength`、pure testを追加した。Milestone 1のtestは10件すべてpassした。
- [ ] Turnstile検証、Slack payload生成、Slack投稿、`POST /api/contact` を実装する。
- [ ] Turnstile widgetと既存フォームをAPIへ接続し、成功・失敗・resetを扱う。
- [ ] production runtime環境変数とCI用dummy値を追加する。Dockerfileやbuild argは変更しない。
- [ ] pure functionの自動テスト、`pnpm run quality:check`、テストSlackチャンネルでの正常系・異常系確認を完了する。
- [ ] Slack private channelの閲覧権限とretention、Cloudflare rate limitを確認し、`/contact` 有効化を含む変更をproductionへdeploy/mergeできる状態にする。

## Surprises & Discoveries

- Observation: お問い合わせフォームは見た目だけで、送信処理はまだ実装されていない。
  Evidence: `src/modules/contact/ContactPageView.tsx` は `onSubmit` に何もしない `validateOnlySubmit` を渡している。

- Observation: 公開URL `/contact` は現在意図的に無効化されている。
  Evidence: `src/app/(frontend)/contact/page.tsx` は `ContactPageView` のimportとreturnをコメントアウトし、`notFound()` を返している。

- Observation: 現在の `validateContactForm` は引数がstringであることをTypeScript型に任せ、`gender` と `inquiryType` がUIの選択肢内かどうかも検証していない。
  Evidence: `src/modules/contact/validation.ts` は必須、email、age、phoneだけを検証し、選択肢定数は `ContactPageView.tsx` 内に閉じている。

- Observation: `ContactSection` はすでに `maxLength` propsを受け取れるため、入力長制限のために共通UIを作り直す必要はない。
  Evidence: `src/modules/contact/ui/ContactSection.tsx` は `maxLength?: number` を定義し、input/textareaへ渡している。

- Observation: 現在の `useContactForm` は `handleSubmit()` 自体が `ContactFormSubmitResult` を返すため、APIからserver field errorsをhookへ戻す新しい送信契約は不要である。
  Evidence: `src/modules/contact/useContactForm.ts` はlocal validation失敗、送信成功、`onSubmit` throwをそれぞれ `{ ok: false }` / `{ ok: true }` に変換している。初回実装では `reset()` の追加だけで成功後のフォーム初期化を実現できる。

- Observation: `/contact/page.tsx` はServer Componentなので、Turnstile site keyを `NEXT_PUBLIC_` build-time envにせずruntimeで読み、Client Componentへpropとして渡せる。
  Evidence: Next.js 16同梱ドキュメントでは `connection()` を呼ぶと、その後の処理をbuild時prerenderから外してrequest時に実行できる。既存 `NEXT_PUBLIC_SITE_URL` もproduction runtime environmentへ渡されている。

- Observation: `import "server-only"` を使うためのnpm package追加はNext.js 16では必須ではない。
  Evidence: リポジトリ同梱のNext.js Server/Client Componentsドキュメントは、Next.jsが `server-only` importを内部で扱い、明示installはoptionalとしている。

- Observation: request streamを自前で読み16 KiBを厳密に保証する実装は、現在のフォーム要件に対して実装・テスト量が大きい。
  Evidence: 現在の入力は固定9項目で本文上限も2000文字である。初回は `Content-Type`、既知の `Content-Length`、runtime field validation、Cloudflare rate limitingを使い、chunked bodyまで厳密な16 KiB保証が必要になった場合だけstream readerを追加する。

- Observation: Slack Incoming Webhookだけではファイルをアップロードできない。
  Evidence: file uploadにはBot/User tokenと `files:write` scopeを使う別のWeb API flowが必要になる。現在の本文上限2000文字では不要である。

- Observation: 最大長はraw文字列へ適用し、形式判定だけtrim後の値へ適用するため、年齢 `" 20 "` は数字形式としては有効でもraw 4文字で3文字上限を超える。
  Evidence: Milestone 1の初回testでこのケースが最大長エラーとなり、ExecPlanの「最大長はraw文字列へ適用する」という既存Decisionどおりの挙動であることを確認した。test fixtureはraw 3文字の `"20 "` に修正し、10件すべてpassした。

## Decision Log

- Decision: Slackへの投稿はSlack AppのIncoming Webhookを使い、Webhookが紐づく1つの専用private channelへ固定する。
  Rationale: 今回必要なのは一方向通知だけであり、Bot tokenと `chat.postMessage` を使うより権限と実装範囲を小さくできる。投稿後の更新、thread返信、複数チャンネルへの動的投稿が必要になったときだけBot token方式を再検討する。
  Date/Author: 2026-08-25 / ChatGPT

- Decision: Webhook URLは `SLACK_CONTACT_WEBHOOK_URL` というserver runtime環境変数にし、ブラウザへ渡さない。
  Rationale: Incoming Webhook URLを取得した第三者は投稿できるため、client bundle、HTML、request payloadへ含めてはならない。
  Date/Author: 2026-08-25 / ChatGPT

- Decision: UIからの送信入口は `src/app/api/contact/route.ts` の `POST /api/contact` Route Handlerにする。
  Rationale: 現行フォームはClient Componentの独自 `onSubmit` hookで制御されている。明示的なAPIなら既存構造を維持でき、Cloudflareのrate limitを `/api/contact` へ設定しやすく、curlでも異常系を確認できる。
  Date/Author: 2026-08-25 / ChatGPT

- Decision: `request.json()` の結果を型assertionせず、`unknown` からruntime parserで検証する。
  Rationale: ネットワーク越しの入力はTypeScript型を持たない。期待するtop-level object、9 fieldのstring、Turnstile tokenを確認してからdomain validationと外部通信へ進める。
  Date/Author: 2026-08-25 / ChatGPT

- Decision: `gender` と `inquiryType` の選択肢、各fieldの最大長を `src/modules/contact/constants.ts` に集約し、UIとserver validationで共有する。
  Rationale: 直接HTTP requestではUIに存在しない値を送れる。allowlistと最大長をserverでも確認し、UIとserverのずれも防ぐ。
  Date/Author: 2026-08-25 / ChatGPT

- Decision: HTTP境界では利用者が入力した9 fieldを勝手にtrimして保存用値へ変換しない。
  Rationale: 問い合わせだけでなく感想や意見も扱うため、本文の改行や空白を不用意に書き換えない。必須判定やemail・age・phoneの形式判定では比較用にtrimした値を使い、最大長はraw文字列へ適用する。
  Date/Author: 2026-08-25 / ChatGPT

- Decision: 初回実装では独自request body stream readerを作らない。
  Rationale: `request.json()` を使い、`Content-Type: application/json` を必須にする。`Content-Length` があり16 KiBを超える場合は早期に413とするが、Content-Lengthがないchunked requestまでアプリ内で厳密な16 KiB上限を保証しない。固定fieldの最大長、token上限、Cloudflare rate limitingで通常の公開フォームに必要な境界を作る。厳密なbyte単位上限が運用要件になった場合だけstream readerを別変更で追加する。
  Date/Author: 2026-08-25 / ChatGPT

- Decision: `turnstileToken` はnon-empty stringかつ2048文字以下に制限する。
  Rationale: Cloudflareへ不要に大きな値を送らず、外部APIへ渡す値の境界を明示する。
  Date/Author: 2026-08-25 / ChatGPT

- Decision: Turnstile Clientは追加のReact wrapper dependencyを導入せず、`next/script` からCloudflare公式scriptをexplicit rendering modeで読み込む専用 `TurnstileWidget` Client Componentとして実装する。
  Rationale: 依存を増やさず、token lifecycleとresetを明示的に管理できる。固定actionは `contact_submit` とし、expired/error/timeoutではtokenを破棄する。API送信を試みた後はwidgetをresetして同じtokenを再利用しない。
  Date/Author: 2026-08-25 / ChatGPT

- Decision: Turnstile site keyは `TURNSTILE_SITE_KEY` というruntime環境変数にし、`src/app/(frontend)/contact/page.tsx` で `await connection()` 後に読み、`ContactPageView` へpropとして渡す。
  Rationale: site keyは秘密ではないが、`NEXT_PUBLIC_` にするとDocker build時に値が固定され、Dockerfileとbuild argsまで変更が波及する。Server Componentからruntime値をpropで渡せば同じ要件をより小さい変更で満たせる。
  Date/Author: 2026-08-25 / ChatGPT

- Decision: Turnstile Siteverifyは `success` と固定actionに加え、本番ではresponse hostnameを既存 `NEXT_PUBLIC_SITE_URL` のhostnameと照合する。専用 `TURNSTILE_EXPECTED_HOSTNAME` は追加しない。
  Rationale: 現在のproduction公開hostnameは `NEXT_PUBLIC_SITE_URL` ですでに構成管理されており、同じ値を別envで二重管理する必要がない。将来Turnstileだけ別hostnameを許可する要件が出た場合に独立envへ分ける。
  Date/Author: 2026-08-25 / ChatGPT

- Decision: Slackへは現行フォームUIの9項目を入力された範囲で転送し、利用者入力はBlock Kitの `plain_text` として扱う。
  Rationale: 氏名、ふりがな、性別、年齢、地域、メール、電話、お問い合わせ種別、本文を担当者が確認できるようにする。任意項目が空ならそのsectionだけ省略する。利用者入力を `mrkdwn` へ直接埋め込まず、意図しないメンションやリンク記法の解釈を避ける。
  Date/Author: 2026-08-25 / ChatGPT

- Decision: 初回実装ではSlack file uploadを行わない。
  Rationale: Incoming Webhookだけではfile uploadできず、追加tokenとscopeが必要になる。本文2000文字ではmessageとして十分である。
  Date/Author: 2026-08-25 / ChatGPT

- Decision: 公開前にTurnstileとCloudflare rate limitingの両方を有効にする。アプリ内rate limiterは実装しない。
  Rationale: Turnstileはbot判定、rate limitingは短時間の連投抑制で目的が異なる。アプリ内メモリカウンタは再起動や複数instanceで一貫しない。初期値は同一IPから `POST /api/contact` を1分に5回までとし、超過時は少なくとも1分blockする。
  Date/Author: 2026-08-25 / ChatGPT

- Decision: 送信結果はContactPageView内のインライン状態表示にする。
  Rationale: 既存ToastRegionはルートへ組み込まれておらず、この機能だけのために通知基盤を広げる必要がない。成功は `role="status"`、全体失敗は `role="alert"` で表示する。
  Date/Author: 2026-08-25 / ChatGPT

- Decision: `useContactForm` の送信契約は変更せず、成功後に初期状態へ戻す `reset()` だけ追加する。
  Rationale: localとserverで同じdomain validationを使うため、通常のブラウザ操作でserverだけfield errorになるケースをUIへ細かく戻す必要はない。APIの400は固定した全体メッセージにし、既存 `handleSubmit()` の成功/失敗結果をContactPageViewが使う。
  Date/Author: 2026-08-25 / ChatGPT

- Decision: `import "server-only"` はsecretを読むmoduleで使うが、初回から `pnpm add server-only` は行わない。
  Rationale: Next.js 16はこのimportを内部で扱い、package installはoptionalである。quality checkや実行環境でdirect dependencyが必要と判明した場合だけ追加する。
  Date/Author: 2026-08-25 / ChatGPT

- Decision: Payload CMS/PostgreSQLには問い合わせを保存せず、Slackを問い合わせデータの保存先として扱う。
  Rationale: Slack messageには個人情報が残り得る。専用private channelの参加者を最小化し、retentionを公開前に確認する。
  Date/Author: 2026-08-25 / ChatGPT

- Decision: 初回実装はexactly-once deliveryを保証しない。
  Rationale: 通常の二重クリックは既存 `isSubmittingRef` で防げるが、Slack投稿後にclientがresponseを受け取れず再送した場合までIncoming Webhookだけで重複排除するのは難しい。厳密な重複排除が必要になったら永続IDと保存・retry設計を別途追加する。
  Date/Author: 2026-08-25 / ChatGPT

## Outcomes & Retrospective

Milestone 1まで実装済みである。`feat/contact-slack-notification` ブランチ上で、UIとserverが共有する選択肢・最大長定数、`unknown` から9つのstring fieldとTurnstile tokenだけを取り出すruntime parser、最大長とallowlistを含むdomain validation、UIの `maxLength` を追加した。pure testは10件すべてpassし、外部通信前にHTTP入力を安全な `ContactFormValues` へ変換できる境界ができた。

中心方針は `POST /api/contact`、runtime validation、Turnstileのserver verification、Slack Incoming Webhook、Cloudflare rate limitingを維持している。初回要件に対して複雑さが先行していた独自16 KiB stream parser、server fieldErrorsをform hookへ戻す送信契約、`NEXT_PUBLIC_TURNSTILE_SITE_KEY` のDocker build-time注入、専用 `TURNSTILE_EXPECTED_HOSTNAME`、`server-only` dependencyの先行追加は引き続きscope外とする。次はMilestone 2としてTurnstile判定とSlack payload/投稿のserver-only境界を実装する。

## Context and Orientation

`src/app/(frontend)/contact/page.tsx` が公開ページの入口である。現在は `notFound()` を返している。実装ブランチ上ではブラウザE2E確認の段階で `ContactPageView` を返すよう変更するが、Slack private channel、Turnstile本番設定、Cloudflare rate limitなどの運用条件が揃うまでproductionへdeploy/mergeしない。このServer Componentは `async` にし、`next/server` の `connection()` をawaitした後で `process.env.TURNSTILE_SITE_KEY` を読み、Client Componentである `ContactPageView` へpropとして渡す。site keyはブラウザから見えてよい値だが、runtimeで差し替えられるよう `NEXT_PUBLIC_` は使わない。

`src/modules/contact/ContactPageView.tsx` は問い合わせフォーム本体で、React Client Componentである。氏名、ふりがな、性別、年齢、地域、メールアドレス、電話番号、お問い合わせ種別、本文の9項目を表示する。現在は `validateOnlySubmit` が空処理なので、ここを `/api/contact` へのfetchへ置き換える。

`src/modules/contact/useContactForm.ts` は入力値、field error、送信中状態を管理するClient Hookである。既存の `ContactFormSubmitter` と `handleSubmit()` の契約は維持する。成功時にvalues、errors、touchedを初期状態へ戻す `reset()` だけ追加する。

`src/modules/contact/types.ts` はフォーム値とfield error等の型を定義する。`ContactFormValues` はTypeScript上のshapeであり、HTTP入力の安全性を保証しない。Route Handlerが受け取ったJSONへ直接型assertionしてはならない。

`src/modules/contact/validation.ts` はClientとServerで共有するdomain validationである。必須、最大長、email、age、phone、選択肢allowlistをここで確認する。

新しく `src/modules/contact/constants.ts` を作り、`GENDER_OPTIONS`、`INQUIRY_TYPE_OPTIONS`、各field最大長、Turnstile token上限、固定actionを置く。Clientからもimportされるためsecretは置かない。

新しく `src/modules/contact/server/parseContactRequest.ts` を作る。`request.json()` で得た `unknown` を検査し、top-level object、`values` object、9 fieldのstring、`turnstileToken` のstringを確認する。9 fieldの値は加工せず保持し、tokenだけtrimしてnon-emptyかつ2048文字以下にする。余分なpropertyはdomain objectへコピーしない。

新しく `src/modules/contact/server/turnstileResponse.ts` を作り、Cloudflare Siteverify responseのshapeと `success`、`action`、`hostname` 判定をpure functionとして置く。これにより外部通信なしでテストできる。

新しく `src/modules/contact/server/verifyTurnstile.ts` を作る。これは `import "server-only";` を使い、関数呼び出し時に `TURNSTILE_SECRET_KEY` と既存 `NEXT_PUBLIC_SITE_URL` をruntime environmentから読む。Cloudflare Siteverifyへtokenを送り、成功、固定action、本番hostname一致を確認する。secret、token、Cloudflare生bodyをログへ出さない。

新しく `src/modules/contact/server/slackPayload.ts` を作り、9項目からSlack Block Kit payloadを組み立てるpure functionを置く。任意項目が空ならそのsectionを省略し、利用者入力は `plain_text` objectに入れる。

新しく `src/modules/contact/server/postContactToSlack.ts` を作る。これは `import "server-only";` を使い、関数呼び出し時に `SLACK_CONTACT_WEBHOOK_URL` を読む。`slackPayload.ts` のpayloadをIncoming Webhookへtimeout付きでPOSTし、非2xxを失敗にする。PIIとWebhook URLはログへ出さない。

新しく `src/app/api/contact/route.ts` を作る。処理順はContent-Type確認、既知のContent-Length確認、`request.json()`、runtime parse、domain validation、Turnstile Siteverify、Slack投稿とする。前段が失敗したら後段を呼ばない。

新しく `src/modules/contact/ui/TurnstileWidget.tsx` を作る。`next/script` でCloudflare公式scriptを `render=explicit` として読み、widget IDを保持する。固定action `contact_submit`、token callback、expired/error/timeout時のtoken破棄、ref経由のreset、unmount時のremoveを実装する。

productionでは `compose.prod.yml` の `payload.environment` に `SLACK_CONTACT_WEBHOOK_URL`、`TURNSTILE_SITE_KEY`、`TURNSTILE_SECRET_KEY` を追加する。`NEXT_PUBLIC_SITE_URL` は既存設定を使う。これらはruntimeだけで必要なのでDockerfileとbuild argsは変更しない。`compose.prod.yml` でrequiredにするため、`.github/workflows/ci.yml` が生成するCI用 `.env.production` にも安全なdummy値を追加する。

Slack Incoming Webhookとは、特定のSlack conversationへJSONをPOSTするための秘密URLである。今回の通知先は問い合わせを閲覧してよい担当者だけが参加するprivate channelとする。

Cloudflare Turnstileとは、フォーム送信が自動botではないことを検証する仕組みである。ブラウザで得た一時tokenをサーバーへ送り、サーバーがsecretを使ってCloudflareへ検証する。ブラウザ側の成功表示だけは信用しない。

## Plan of Work

### Milestone 1: HTTP入力とdomain validationを固める

最初に外部通信を追加せず、ClientとServerで共有する入力ルールを完成させる。

`src/modules/contact/constants.ts` を追加し、現在 `ContactPageView.tsx` 内にある `GENDER_OPTIONS` と `INQUIRY_TYPE_OPTIONS` を移す。最大長は `name` 100、`kana` 100、`age` 3、`region` 100、`email` 254、`phone` 20、`inquiry` 2000を基準にする。`TURNSTILE_TOKEN_MAX_LENGTH` は2048、`TURNSTILE_ACTION` は `contact_submit` とする。

`src/modules/contact/validation.ts` へraw文字列の最大長と選択肢allowlistを追加する。必須判定とemail・age・phone形式判定ではtrimした比較値を使ってよいが、元のfield値は変更しない。`ContactPageView.tsx` のtext/textareaへ同じ最大長を `maxLength` として渡す。

`src/modules/contact/server/parseContactRequest.ts` を追加し、`unknown` から安全な `{ values, turnstileToken }` を返す。文字列でないfield、不足field、配列/null、token型不正、空token、2048文字超tokenは400相当として扱える失敗結果にする。余分なpropertyは無視する。

このMilestoneではNode標準 `node:test` と `node:assert` を `tsx --test` から使い、`validation.test.ts` と `parseContactRequest.test.ts` を追加する。未知選択肢、最大長、空白だけの必須値、型不正、余分なproperty、本文の改行・空白保持、token上限を確認する。

Milestone 1の完了条件は、外部HTTP入力をTypeScript assertionだけで信用する箇所がなく、SlackやTurnstileへ渡す前に不正なfield値を拒否できることである。

### Milestone 2: TurnstileとSlackをserver-only境界へ閉じ込める

`src/modules/contact/server/turnstileResponse.ts` にSiteverify response判定をpure functionとして実装する。productionでは `new URL(process.env.NEXT_PUBLIC_SITE_URL).hostname` を期待hostnameとして使う。developmentではCloudflareのtest keyを使えるようhostname一致を必須にしない。`success !== true`、action不一致、productionのhostname不一致、malformed responseは失敗とする。

`src/modules/contact/server/verifyTurnstile.ts` は `import "server-only";` を宣言し、関数呼び出し時に `TURNSTILE_SECRET_KEY` を読む。Siteverify fetchは5秒程度でtimeoutさせる。設定不足、timeout、非正常response、JSON不正、判定失敗はすべてSlack投稿前に失敗させる。

`src/modules/contact/server/slackPayload.ts` はフォーム9項目をBlock Kitへ変換する。任意項目が空なら省略する。利用者入力は `plain_text` とし、`@here`、`<!channel>`、Slackリンク記法等を `mrkdwn` として解釈させない。

`src/modules/contact/server/postContactToSlack.ts` は `import "server-only";` を宣言し、関数呼び出し時に `SLACK_CONTACT_WEBHOOK_URL` を読む。5秒程度のtimeout付きでPOSTし、非2xxを失敗にする。初回実装ではBot token、file upload、retry queueを追加しない。

`turnstileResponse.test.ts` と `slackPayload.test.ts` を追加し、外部通信なしで判定とpayload生成を確認する。`server-only` をimportする通信moduleそのものはNode標準testから直接importしなくてよい。

Milestone 2の完了条件は、secretを読むコードがClientから分離され、外部入力がvalidationを通った後だけTurnstileとSlackへ渡る構造になっていることである。

### Milestone 3: APIと既存フォームを接続する

`src/app/api/contact/route.ts` を追加する。`Content-Type` のmedia typeが `application/json` でなければ415を返す。`Content-Length` が存在し16 KiBを超える場合は413を返す。その後 `request.json()` を実行し、invalid JSONは400とする。Content-Lengthが無いrequestの実byte数を独自stream parserで数えることは初回scopeに含めない。

JSON parse後は `parseContactRequest`、`validateContactForm`、`verifyTurnstile`、`postContactToSlack` の順に呼ぶ。runtime/domain validation失敗とTurnstile失敗はHTTP 400で固定した安全なmessageを返す。Slack設定不備、timeout、非2xxはHTTP 503とする。SlackやCloudflareの生responseは利用者へ返さない。

API responseは最小限にする。

    HTTP 200
    { "ok": true }

    HTTP 400
    { "ok": false, "message": "入力内容を確認してください" }

    HTTP 503
    { "ok": false, "message": "送信に失敗しました。時間をおいて再度お試しください。" }

`src/modules/contact/useContactForm.ts` には `reset()` を追加する。`ContactFormSubmitter` と `ContactFormSubmitResult` の既存型は変更しない。

`src/modules/contact/ContactPageView.tsx` は `siteKey: string | undefined` のpropを受ける。`validateOnlySubmit` を `/api/contact` へJSON POSTする関数へ置き換え、API失敗時はAPIの安全なmessageで `Error` をthrowする。既存 `handleSubmit()` が返す結果をwrapperで受け、成功時だけ `reset()` と成功表示を行う。失敗時はフォーム値を保持する。

`src/modules/contact/ui/TurnstileWidget.tsx` を追加し、tokenを親へ渡す。tokenがない間は送信ボタンをdisabledにする。API送信を実際に試みた後は成功・失敗にかかわらずwidgetをresetし、同じtokenを再利用しない。site key未設定やscript errorでは送信を有効化せず、固定した利用不可messageを表示する。

`src/app/(frontend)/contact/page.tsx` は `async` にし、`await connection()` の後で `process.env.TURNSTILE_SITE_KEY` を読み `ContactPageView` へ渡す。これによりローカルの `/contact` からTurnstileを含む実際の送信フローを確認できるようにする。この変更をproductionへdeploy/mergeするのはMilestone 4の運用条件を満たした後とする。

Milestone 3の完了条件は、テストWebhookを設定したローカル開発環境の `/contact` で有効な入力を1回送るとSlackへ1件届き、失敗時はフォームを保持して安全なエラーが表示されることである。

### Milestone 4: Runtime環境、運用条件、公開を完成させる

`.env.production.example` に `SLACK_CONTACT_WEBHOOK_URL`、`TURNSTILE_SITE_KEY`、`TURNSTILE_SECRET_KEY` のplaceholderを追加する。実secretはコミットしない。

`compose.prod.yml` の `payload.environment` に同じ3変数を `${VAR:?VAR is required}` で追加する。`NEXT_PUBLIC_SITE_URL` は既存設定をそのまま使う。Turnstile site keyを含め、今回追加する値はすべてruntime environmentとして渡す。Dockerfileと `payload.build.args` は変更しない。

`.github/workflows/ci.yml` のproduction compose検証jobには3変数のdummy値を追加し、`Prepare production environment` で `.env.production` へ書き出す。CIに実運用secretを置かない。

Cloudflare側では `/api/contact` のPOSTを送信元IP単位で制限する。初期値は1分5回まで、超過後少なくとも1分blockとする。Turnstileをrate limitの代替にはしない。

Slack側では本番用Incoming Webhookを問い合わせ専用private channelへ紐づけ、参加者とretentionを確認する。Webhook URLをソース、issue、Plan、ログへ貼らない。

これらを確認した後、Milestone 3で実装済みの `/contact` 有効化をproductionへdeploy/mergeできる状態と判断する。公開後に重大な問題があれば、このpageを再び `notFound()` に戻すことで受付を停止できる。

## Concrete Steps

作業ディレクトリは `/home/tkymhrt/ghq/github.com/NUTFes/45th-homepage` とする。現在のcheckoutに問い合わせ機能と無関係な変更がある場合は、実装開始前に専用branchまたはworktreeへ分離し、別機能の差分を混ぜない。

1. 開発用serviceを起動する。

   docker compose up -d payload postgres seaweedfs-s3
   docker compose ps payload postgres seaweedfs-s3

   package commandは起動済み `payload` container内で実行する。

   docker compose exec -T payload pnpm ...

2. `src/modules/contact/constants.ts` を追加し、選択肢、field最大長、`TURNSTILE_TOKEN_MAX_LENGTH = 2048`、`TURNSTILE_ACTION = "contact_submit"` を定義する。`ContactPageView.tsx` と `validation.ts` を共有定数へ切り替える。

3. `src/modules/contact/server/parseContactRequest.ts` を追加し、`unknown` からtop-level payload、9つのstring field、turnstile tokenをruntime parseする。

4. `src/modules/contact/validation.ts` に最大長とallowlist検証を追加し、Clientのtext/textareaへ同じ `maxLength` を渡す。

5. `src/modules/contact/server/turnstileResponse.ts`、`verifyTurnstile.ts`、`slackPayload.ts`、`postContactToSlack.ts` を追加する。`verifyTurnstile.ts` と `postContactToSlack.ts` だけ `import "server-only";` を使う。初回から `pnpm add server-only` は行わず、quality check等で必要と判明した場合だけ追加する。

6. `src/app/api/contact/route.ts` を追加し、JSON Content-Type、既知のContent-Length、`request.json()`、runtime parse、domain validation、Turnstile、Slackの順で処理する。

7. `src/modules/contact/ui/TurnstileWidget.tsx` を追加し、explicit render、固定action、token callback、expired/error/timeout時のtoken破棄、reset、unmount時removeを実装する。

8. `src/modules/contact/useContactForm.ts` に `reset()` を追加する。既存の `ContactFormSubmitter` / `ContactFormSubmitResult` は変更しない。

9. `src/modules/contact/ContactPageView.tsx` に `siteKey` prop、API送信、成功/失敗表示、Turnstile token lifecycleを接続する。API送信後はwidgetをresetし、フォーム値は成功時だけresetする。

10. `src/app/(frontend)/contact/page.tsx` をruntime site keyを渡すServer Componentへ変更する。`await connection()` 後に `process.env.TURNSTILE_SITE_KEY` を読み、`ContactPageView` を返す。これでローカル `/contact` からE2E確認できる。運用条件が揃うまではこのbranchをproductionへdeploy/mergeしない。

11. pure functionの自動テストを追加する。

    docker compose exec -T payload pnpm exec tsx --test \
     src/modules/contact/validation.test.ts \
     src/modules/contact/server/parseContactRequest.test.ts \
     src/modules/contact/server/turnstileResponse.test.ts \
     src/modules/contact/server/slackPayload.test.ts

期待結果は全testがpassし、未知選択肢、型不正、最大長、本文の空白・改行保持、token上限、Turnstileのsuccess/action/hostname/malformed response、Slack payloadへの9項目転送と `plain_text` 利用が確認できることである。

12. ローカル `.env` にテスト値を追加する。実値はPlanやGitへ記録しない。

    SLACK_CONTACT_WEBHOOK_URL=<test webhook url>
    TURNSTILE_SITE_KEY=<test site key>
    TURNSTILE_SECRET_KEY=<test secret key>

13. `.env.production.example`、`compose.prod.yml`、`.github/workflows/ci.yml` を更新する。Dockerfileは変更しない。CIの `.env.production` には3変数のdummy値を追加する。

14. production compose構成をCI相当の環境値で検証する。

    docker compose --env-file .env.production --env-file .env.release -f compose.prod.yml config -q

15. 変更を整形し、品質チェックを行う。

    docker compose exec -T payload pnpm run fmt
    docker compose exec -T payload pnpm run quality:check

16. ブラウザでTurnstileと正常送信を確認する。有効token取得前は送信できず、送信成功時だけフォームがresetされ、Slack private test channelへ1件届くことを確認する。

17. curlまたはDevToolsで異常系を確認する。少なくとも非JSON Content-Typeの415、invalid JSONの400、型不正の400、明示Content-Length超過の413、missing/oversized tokenの400がSlack投稿前に拒否されることを確認する。Content-Lengthなしchunked bodyの厳密な16 KiB拒否は受け入れ条件に含めない。

18. Slack private channelの参加者・retention、本番Turnstile設定、secret登録、Cloudflare rate limitを確認する。

19. production相当の環境変数とCloudflare/Slack運用条件を揃え、Milestone 3で有効化した `/contact` をdeploy可能な状態として最終確認する。本番相当環境からテスト問い合わせを1件送る。

## Validation and Acceptance

有効な必須項目を入力しTurnstile検証を通過して送信すると、画面は送信中表示になり、Slackの指定private channelへ問い合わせ通知が1件届く。通知には現行フォームUIの9項目のうち入力された値が含まれ、空の任意項目だけは省略される。送信成功後、画面に成功メッセージが表示され、フォームは初期状態へ戻る。

同じ送信処理中に送信ボタンを連打しても、既存 `isSubmittingRef` により2件目のrequestは始まらない。ただし、Slack投稿後にclientがresponseを受け取れず利用者が新しいTurnstile tokenで再送した場合の重複は初回仕様では許容する。

必須項目欠落、email形式不正、数字field不正、最大文字数超過、allowlist外の `gender` / `inquiryType`、field型不正、missing/oversized Turnstile tokenではHTTP 400となり、Slackへ投稿されない。通常のブラウザUIでlocal validationに失敗した場合は既存field errorを表示する。直接APIを叩いたserver validation失敗ではfieldごとの詳細を返す必要はなく、固定した全体messageでよい。

`Content-Type` が `application/json` でないrequestはHTTP 415となる。invalid JSONはHTTP 400となる。`Content-Length` が存在し16 KiBを超えるrequestはHTTP 413となる。Content-Lengthがないrequestについて、アプリ内でbyte streamを独自に読み厳密な16 KiB上限を保証することは今回の受け入れ条件に含めない。

問い合わせ本文へ `@here`、`<!channel>`、Slackリンク記法を入れても、利用者入力部分は `plain_text` として扱われ、意図しないメンションやmrkdwn展開が起きない。

Turnstile tokenを欠落させる、期限切れにする、再利用する、無効値にする、actionを `contact_submit` 以外にする、本番でhostnameが `NEXT_PUBLIC_SITE_URL` のhostnameと一致しない場合はSlackへ投稿されない。利用者にはsecretやCloudflare詳細を含まない固定messageが表示される。

`SLACK_CONTACT_WEBHOOK_URL` が未設定、Slackが非2xx、またはSlack fetchがtimeoutする状態ではHTTP 503相当の失敗になり、画面は成功扱いにならない。フォーム入力は保持される。server logへWebhook URL、email、phone、問い合わせ本文を出さない。

Webhook secretとTurnstile secretがブラウザのJavaScript bundle、HTML、`POST /api/contact` request payloadに含まれない。ブラウザに見えてよいのはServer Componentからpropとして渡されたTurnstile site key、問い合わせ者自身の入力、Turnstileの一時tokenだけである。

production imageはTurnstile site keyや問い合わせsecretをbuild argとして必要とせずbuildできる。production container起動時に `SLACK_CONTACT_WEBHOOK_URL`、`TURNSTILE_SITE_KEY`、`TURNSTILE_SECRET_KEY` がruntime environmentとして渡される。CIのproduction compose validation/buildもdummy値で成功し、実運用secretをハードコードしていない。

Slack本番通知先はprivate channelで、閲覧してよい担当者だけが参加している。retention方針が確認されている。Cloudflareでは `/api/contact` POSTが同一IPにつき1分5回までに制限され、超過した連投が少なくとも1分blockされる。

最終的に次のコマンドが成功する。

    docker compose exec -T payload pnpm exec tsx --test \
      src/modules/contact/validation.test.ts \
      src/modules/contact/server/parseContactRequest.test.ts \
      src/modules/contact/server/turnstileResponse.test.ts \
      src/modules/contact/server/slackPayload.test.ts
    docker compose exec -T payload pnpm run quality:check

また、`/contact` が404ではなくフォームを表示し、本番相当環境からテスト問い合わせを送って指定Slack private channelで受信できる。

## Idempotence and Recovery

ソース変更は通常のGit差分なので繰り返し修正できる。現在のcheckoutに別featureの差分がある場合は問い合わせ用worktreeへ分離し、既存差分を上書きしない。

Webhookを誤って公開した場合は、そのURLを再利用せずSlack App設定で失効させ、新しいWebhookを発行してsecret管理を更新する。Git履歴へ秘密値が入った場合は、履歴修正より先にsecretをローテーションする。

Turnstile secretを誤って公開した場合も同様にローテーションする。Turnstile設定が原因で送信できない場合でも、本番公開のためにserver verificationを外さない。Cloudflare test keyとテストSlack Webhookでそれぞれ切り分ける。

Slack障害時に問い合わせを失わない永続queueは今回のscopeに入れない。Slack投稿失敗時はフォームを保持し再試行を促す。将来「利用者には成功を返しつつSlack障害後に自動再送する」「厳密な重複排除をする」という要件が出た場合は、問い合わせID、最小保存、retry worker、retentionを別計画で設計する。

厳密なrequest body byte上限が必要になった場合は、現在の `request.json()` を無理に拡張せず、stream readerとその専用テストを別変更として追加する。

`/contact` 公開後に重大な問題が見つかった場合は、`src/app/(frontend)/contact/page.tsx` を再び `notFound()` に戻して受付を停止する。Turnstileやrate limitを外して応急公開することはしない。

## Artifacts and Notes

API requestは次の形とする。

    POST /api/contact
    Content-Type: application/json

    {
      "values": {
        "name": "技大 太郎",
        "kana": "ぎだい たろう",
        "gender": "",
        "age": "",
        "region": "",
        "email": "example@example.com",
        "phone": "",
        "inquiryType": "落とし物",
        "inquiry": "昨日会場で財布を紛失しました。"
      },
      "turnstileToken": "one-time-token"
    }

Slackでは概ね次の情報を表示する。各利用者入力はBlock Kitの `plain_text` とする。

    新しいお問い合わせが届きました

    お問い合わせ項目
    落とし物

    お名前
    技大 太郎

    ふりがな
    ぎだい たろう

    メールアドレス
    example@example.com

    お問い合わせ内容
    昨日会場で財布を紛失しました。

空の任意fieldはsectionごと省略する。

## Interfaces and Dependencies

Slack SDK、Turnstile用React wrapper、schema validation libraryは追加しない。外部HTTP通信は標準 `fetch`、Turnstile Client scriptは既存の `next/script` を使う。`import "server-only"` はNext.jsの仕組みを利用し、初回からdependency追加はしない。

`src/modules/contact/constants.ts` は少なくとも次をexportする。

    export const GENDER_OPTIONS = ["男性", "女性", "その他"] as const;

    export const INQUIRY_TYPE_OPTIONS = [
      "ご質問",
      "ご協賛について",
      "出店について",
      "落とし物",
      "その他",
    ] as const;

    export const CONTACT_FIELD_MAX_LENGTHS = {
      name: 100,
      kana: 100,
      age: 3,
      region: 100,
      email: 254,
      phone: 20,
      inquiry: 2000,
    } as const;

    export const CONTACT_REQUEST_MAX_BYTES = 16 * 1024;
    export const TURNSTILE_TOKEN_MAX_LENGTH = 2048;
    export const TURNSTILE_ACTION = "contact_submit" as const;

`src/modules/contact/server/parseContactRequest.ts` は次の意味のinterfaceを持つ。

    export type ParsedContactRequest = {
      values: ContactFormValues;
      turnstileToken: string;
    };

    export function parseContactRequest(input: unknown):
      | { ok: true; data: ParsedContactRequest }
      | { ok: false };

`src/modules/contact/server/turnstileResponse.ts` は `unknown` responseを受け、期待actionと必要に応じたhostnameを満たすか判定するpure functionをexportする。

`src/modules/contact/server/verifyTurnstile.ts` は次をexportする。

    export async function verifyTurnstile(token: string): Promise<boolean>

productionの期待hostnameは `process.env.NEXT_PUBLIC_SITE_URL` を `new URL(...)` でparseして得る。`TURNSTILE_EXPECTED_HOSTNAME` は追加しない。

`src/modules/contact/server/slackPayload.ts` はvalidation済み `ContactFormValues` からIncoming Webhook payloadを生成するpure functionをexportする。

`src/modules/contact/server/postContactToSlack.ts` は次をexportする。

    export async function postContactToSlack(values: ContactFormValues): Promise<void>

`src/modules/contact/ui/TurnstileWidget.tsx` は親から少なくとも `siteKey` とtoken変更callbackを受け、ref経由でresetできるようにする。

    export type TurnstileWidgetHandle = {
      reset: () => void;
    };

`src/modules/contact/useContactForm.ts` の既存送信型は変更しない。returnへ次だけ追加する。

    reset: () => void

`src/modules/contact/ContactPageView.tsx` はruntime site keyを受け取る。

    type ContactPageViewProps = {
      siteKey?: string;
    };

追加するruntime環境変数は3つだけとする。

    SLACK_CONTACT_WEBHOOK_URL   server only, required in production runtime
    TURNSTILE_SITE_KEY          browser-visible after Server Component passes it as a prop, required in production runtime
    TURNSTILE_SECRET_KEY        server only, required in production runtime

既存 `NEXT_PUBLIC_SITE_URL` はTurnstile production hostname照合にも利用する。Dockerfile、Docker build arg、`NEXT_PUBLIC_TURNSTILE_SITE_KEY`、`TURNSTILE_EXPECTED_HOSTNAME` は追加しない。

---

Revision note (2026-08-25): 初版。現行コード調査を踏まえ、Slack Incoming Webhook、server validation、Turnstile、公開有効化までを段階的に実装する計画として作成した。

Revision note (2026-08-25): 公開入力のruntime validation、allowlist、Turnstile action/hostname照合、Slack上の個人情報保存、rate limiting、exactly-once非保証等の安全条件を追加した。

Revision note (2026-08-25): オーバーエンジニアリングを避ける再レビューを反映。独自16 KiB stream parserとそのchunk/UTF-8テスト、server fieldErrorsを `useContactForm` へ戻す新しい送信契約、`NEXT_PUBLIC_TURNSTILE_SITE_KEY` のDocker build-time注入、専用 `TURNSTILE_EXPECTED_HOSTNAME`、`server-only` dependencyの先行追加を初回scopeから外した。Turnstile site keyはServer Componentがruntimeで読みClientへpropで渡し、production hostnameは既存 `NEXT_PUBLIC_SITE_URL` から導出する。初回実装は固定9項目のruntime validation、Turnstile、Slack Incoming Webhook、Cloudflare rate limitingへ集中する。

Revision note (2026-08-25): 実装開始。`feat/contact-slack-notification` ブランチを作成しMilestone 1を完了した。共有定数、runtime parser、最大長・allowlist validation、UI `maxLength`、pure testを追加し、10件passを確認した。raw文字列の最大長判定とtrim後形式判定の差もtestで確認し、Surprises & Discoveriesへ記録した。
