# Implement the Sponsors Page and CMS Editing Flow

This ExecPlan is a living document. The sections `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` must be kept up to date as work proceeds.

This plan follows the ExecPlan methodology in `/home/tkymhrt/.agents/skills/execplan/references/PLANS.md`. It is intentionally self-contained so a contributor can resume the work from this file and the current repository checkout without reading earlier chat context.

## Purpose / Big Picture

The public site already has a `/sponsors` route and menu text for "協賛企業一覧", but the route currently returns `notFound()`. After this change, a visitor can open `/sponsors` and see a responsive list of sponsor companies based on the Figma design: sponsor entries with an uploaded advertisement image appear as 4:3 image cards, and entries without an image appear as a company-name-only list. A non-engineer editor can update the thank-you message and reorder sponsor rows from one Payload admin screen without changing code.

The implementation will use the existing Next.js App Router, Payload CMS 3, Tailwind v4 theme tokens, and Cache Components patterns already present in the repository. The observable behavior is: add sponsor rows in the Payload global "協賛企業ページ", then visit `/sponsors` and see the page update after cache revalidation.

## Progress

- [x] (2026-06-17 20:26 +0800) Read project instructions, RTK shell wrapper requirement, ExecPlan methodology, relevant Next.js local docs, Payload guidance, and Context7 docs for Payload globals/fields.
- [x] (2026-06-17 20:26 +0800) Created branch `feat/tkymhrt/issue-147-sponsors` from clean `main` at `bd3832c`.
- [x] (2026-06-17 20:26 +0800) Reviewed GitHub issue #147 and Figma nodes `249:593` and `3084:10820`.
- [x] (2026-06-17 20:26 +0800) Inspected existing route, layout, CMS globals, collections, revalidation hooks, cache tags, image DTO conversion, and theme tokens.
- [x] (2026-06-17 20:32 +0800) Attempted subagent self-review; subagent failed because the account hit a usage limit. Continued with a local plan review at the user's request.
- [x] (2026-06-17 20:31 +0800) Implemented Payload global, admin row label, revalidation hook, cache tag, generated types, import map, and migration.
- [ ] Implement sponsors server data loader, DTO utilities, page view, sponsor card component, metadata, route, and menu link.
- [ ] Run formatting, linting, type checking, and applicable runtime verification.
- [ ] Commit changes in appropriate increments and update this ExecPlan after each major step.

## Surprises & Discoveries

- Observation: `src/app/(frontend)/sponsors/page.tsx` already exists but only calls `notFound()`.
  Evidence: reading the file showed `import { notFound } from "next/navigation";` and `export default function Page() { notFound(); }`.

- Observation: The project uses `src/app`, `src/modules`, `src/components`, `src/globals`, and `src/collections`; the issue text's `app/modules/...` path is not the actual repository convention.
  Evidence: `rg --files src/app src/modules src/components src/collections` shows `src/modules/top`, `src/modules/news`, `src/modules/events`, and `src/app/(frontend)/sponsors/page.tsx`.

- Observation: The Figma mobile frame includes the global header and footer, but this repository already renders shared `Header`, `Footer`, and bottom navigation in `src/app/(frontend)/layout.tsx`.
  Evidence: the layout imports and renders `Header`, `Footer`, and `BottomNavigation` around `<main>{children}</main>`.

- Observation: The Figma design uses colors and spacing that already exist as Tailwind v4 theme tokens in `src/app/(frontend)/styles.css`.
  Evidence: `--color-base: #1b339b`, `--color-main: #3ce0e8`, `--color-secondary: #f6f8ff`, `--spacing-ll: 32px`, `--spacing-4l: 60px`, and other tokens match the generated Figma values.

- Observation: Existing CMS reads use Next.js 16 Cache Components by adding `"use cache"`, `cacheTag(...)`, and `cacheLife("minutes")` in server data functions.
  Evidence: `src/modules/news/server/getNews.ts`, `src/modules/events/server/getEventsPageData.ts`, and `src/modules/top/server/getPickUpSlides.ts`.

- Observation: The requested subagent self-review could not complete because the subagent system reported a usage-limit error.
  Evidence: subagent notification returned `You've hit your usage limit... try again at 10:32 PM`. The user then instructed to continue.

- Observation: Payload migration generation for the sponsors page produced only the expected `sponsors_page` and `sponsors_page_sponsors` tables.
  Evidence: `src/migrations/20260617_133059_add_sponsors_page.ts` creates those two tables plus image and parent foreign keys and indexes.

## Decision Log

- Decision: Use a Payload Global named `SponsorsPage` rather than a separate sponsor collection plus display-order global.
  Rationale: Sponsors are only needed for a single page, and the user explicitly asked for non-engineer-friendly CMS operation. A global with one thank-you-message field and one sortable array keeps editing in one screen. Rows with an image become advertisement cards; rows without an image become the company-name-only list.
  Date/Author: 2026-06-17 / Codex

- Decision: Keep the shared `Header` and `Footer` outside the sponsors page body rather than recreating them inside `SponsorPageView`.
  Rationale: The Figma frames include header and footer for visual context, but the repository already owns those in `src/app/(frontend)/layout.tsx`. Recreating them would duplicate navigation and break consistency.
  Date/Author: 2026-06-17 / Codex

- Decision: Add a small Payload admin RowLabel component for sponsor rows.
  Rationale: Existing `EventsPage` uses a RowLabel to make collapsed array rows readable. Sponsor rows may be numerous, so showing the company name in collapsed rows directly helps non-engineer editors.
  Date/Author: 2026-06-17 / Codex

- Decision: Keep sponsor card images in a strict `aspect-[4/3]` container and use `object-contain` against the dark card background.
  Rationale: Issue #147 requires 4:3. Sponsor advertisement images are often logos or fixed-layout ads; `object-contain` avoids cropping sponsor-provided artwork while the card frame preserves the design dimensions.
  Date/Author: 2026-06-17 / Codex

- Decision: The desktop card grid should be CSS responsive with `auto-fit` and an explicit max column count through container width, not hard-coded separate breakpoints for each count.
  Rationale: The issue requires "as many as fit" with a maximum of five image cards per row and centered placement. A grid with fixed card widths and a max-width equal to five columns plus gaps satisfies that requirement and stays maintainable.
  Date/Author: 2026-06-17 / Codex

- Decision: Proceed after local self-review because the requested subagent review failed due to account usage limits and the user explicitly asked to continue.
  Rationale: Waiting for the quota reset would block progress without improving the codebase. The failure is documented here, and implementation will still follow the review criteria from the plan.
  Date/Author: 2026-06-17 / Codex

## Outcomes & Retrospective

No implementation outcome yet. This section must be updated after each major completed step and at the end of the feature.

## Context and Orientation

The frontend application lives under `src/app/(frontend)`. The shared layout in `src/app/(frontend)/layout.tsx` renders `Header`, `Footer`, and `BottomNavigation` around every frontend page. Routes are regular App Router folders; for example `src/app/(frontend)/news/page.tsx` imports `NewsPageView` from `src/modules/news/NewsPageView.tsx`. The current sponsors route is `src/app/(frontend)/sponsors/page.tsx`, and it currently returns `notFound()`.

Reusable UI components live under `src/components/ui`. The design title underline component is `src/components/ui/SectionTitle.tsx`. It accepts a `title: string` prop and renders a `font-kaisotai` heading with a `border-button-line` underline. Sponsor page work should reuse this component.

The Tailwind v4 theme is defined in `src/app/(frontend)/styles.css`. Use the existing tokens such as `bg-base`, `bg-base-dark`, `bg-secondary`, `text-font-main`, `border-main`, `gap-4l`, `px-ll`, and `md:px-pl` instead of hard-coded colors and arbitrary spacing unless a Figma value has no token equivalent.

Payload configuration is in `src/payload.config.ts`. Collections are registered in the `collections` array and globals in the `globals` array. Existing globals are `TopPage`, `EventsPage`, and `WeatherSettings` under `src/globals`. Existing revalidation hooks live in `src/globals/hooks` and `src/collections/hooks`. Cache tag constants live in `src/lib/cacheTags.ts`.

Generated Payload types are in `src/payload-types.ts`; this file should be regenerated after adding the new global. Payload migrations are in `src/migrations`; README says DB schema changes require running `mise run migrate:create <name>` and committing the generated `.ts`, `.json`, and `src/migrations/index.ts` changes.

The Figma mobile node `249:593` is a 393px-wide "協賛企業一覧" page. It shows the shared header, a blue page body, title "ご協賛いただいた企業様（順不同）", thank-you text, three image cards at 300x225, eight name-only sponsor rows with a white dot, and the shared footer. The Figma desktop node `3084:10820` is a 1280px-wide page body with shared header/footer, title, thank-you text, a 3-column example of 248x186 image cards, and two columns of name-only sponsors. Issue #147 extends this by saying desktop image cards should center and place as many as fit up to five per row, while name-only items should use up to three per row.

## Plan of Work

First, create the CMS surface. Add `src/globals/SponsorsPage.ts` as a Payload Global with label "協賛企業ページ", site-settings group, editor-facing descriptions, an optional or required thank-you message with a sensible default, and a sortable `sponsors` array. Each sponsor row should include `companyName` as required text and `image` as an optional upload relation to `media`. The image field description must explicitly tell editors that rows without an image are shown in the company-name-only list and that image rows should use 4:3 artwork when possible. Add `src/components/admin/SponsorRowLabel.tsx` using `useRowLabel` so collapsed rows show the company name. Register the global in `src/payload.config.ts`, add a cache tag in `src/lib/cacheTags.ts`, and add a revalidation hook under `src/globals/hooks/revalidateSponsorsPage.ts` that revalidates the sponsors tag and `/sponsors`.

Second, generate the CMS artifacts. Run Payload type generation so `src/payload-types.ts` includes the new `SponsorsPage` interface. Generate a migration with `mise run migrate:create add-sponsors-page` if Docker services are available. If Docker is not running, start it with `docker compose up -d` through the project task or direct Docker command, because project instructions say dev/prod are Docker-based. Also regenerate the Payload admin import map because adding a RowLabel component changes `src/app/(payload)/admin/importMap.js`.

Third, add the frontend sponsor module. Create `src/modules/sponsors/types.ts`, `src/modules/sponsors/utils.ts`, `src/modules/sponsors/server/getSponsorsPageData.ts`, `src/modules/sponsors/ui/SponsorCard.tsx`, and `src/modules/sponsors/SponsorPageView.tsx`. The data function should use `"use cache"`, `cacheTag(CACHE_TAGS.sponsorsPage)`, `cacheLife("minutes")`, `getPayload({ config })`, and `payload.findGlobal({ slug: "sponsors-page", depth: 1, overrideAccess: true })`. The DTO should only expose plain serializable data: sponsor id, company name, and optional media url, alt, width, and height. The page view should be a Server Component unless client interactivity becomes necessary; it should split sponsors into image sponsors and name-only sponsors, render a fallback message when no sponsors are registered, and avoid passing non-serializable Payload documents to any Client Component.

Fourth, replace `src/app/(frontend)/sponsors/page.tsx` with a real route. Add route metadata and return `SponsorPageView`. Enable the "協賛企業一覧" menu item in `src/components/layout/Menu.tsx` by adding `href: "/sponsors"` and removing `disabled: true`. Keep unrelated disabled menu items untouched.

Fifth, validate and polish. Run formatter, lint, and type checks. If feasible, start the app via Docker and inspect `/sponsors` visually. Because the CMS data may be empty in a clean database, the page should still render a polished empty state. If runtime verification requires seed data, use the Payload admin or local API only in a disposable dev database; do not commit data.

## Concrete Steps

Work from repository root `/home/tkymhrt/ghq/github.com/NUTFes/45th-homepage`.

1.  Confirm branch and cleanliness:

        rtk git status --short --branch

    Expected: branch is `feat/tkymhrt/issue-147-sponsors`. There may be this ExecPlan file as an uncommitted addition.

2.  After subagent review, add the CMS global, row label, cache tag, and revalidation hook using `apply_patch`.

3.  Generate Payload files:

        rtk pnpm run generate:types
        rtk pnpm run generate:importmap

    If local generation cannot connect to required services or violates Docker-only project workflow, use:

        rtk docker compose up -d
        rtk docker compose exec payload pnpm run generate:types
        rtk docker compose exec payload pnpm run generate:importmap

4.  Generate the migration after schema changes:

        rtk mise run migrate:create add-sponsors-page

    If this fails because containers are not running, start containers:

        rtk docker compose up -d

    Then retry the migration command.

5.  Commit the CMS slice after it formats and type-checks locally enough to be reviewable:

    rtk git status --short
    rtk git add <cms files>
    rtk git commit -m "feat: 協賛企業ページのCMS設定を追加"

6.  Add the frontend module and route, then commit:

    rtk git add <frontend files>
    rtk git commit -m "feat: 協賛企業一覧ページを実装"

7.  Run quality checks:

        rtk pnpm run fmt:check
        rtk pnpm run lint
        rtk pnpm run typecheck

    If formatting fails, run `rtk pnpm run fmt`, inspect the diff, and rerun checks.

## Validation and Acceptance

The route acceptance is: opening `/sponsors` no longer returns a 404. It shows a blue page body under the existing header and above the existing footer. The title reads "ご協賛いただいた企業様（順不同）". The thank-you message is rendered from the Payload global, preserving line breaks. Sponsor rows with images render as centered 4:3 cards with the company name above the framed image area. Sponsor rows without images render as a list of company names with small circular bullets. On desktop, image cards fit as many as possible up to five per row and remain centered. Name-only sponsors fit up to three per row and remain centered. On mobile, both lists collapse to a single readable column.

The CMS acceptance is: in Payload admin, a non-engineer editor can open "サイト設定 > 協賛企業ページ", edit the thank-you message, add sponsor rows, drag rows to reorder them, upload an image for image-card sponsors, leave image blank for name-only sponsors, and identify collapsed rows by company name. Saving this screen triggers revalidation of `/sponsors`.

The code quality acceptance is: `pnpm run fmt:check`, `pnpm run lint`, and `pnpm run typecheck` pass. If Docker is available, `docker compose up -d` followed by opening the site locally should allow visual inspection. If any of these commands cannot be run because of environment limits, document the exact failure in this plan and the final response.

## Idempotence and Recovery

The code edits are additive except for replacing the `/sponsors` placeholder route and enabling the existing menu item. Re-running type generation and import-map generation is safe; inspect generated diffs before committing. Migration generation should be run once per schema change. If a migration command creates an obviously incorrect file, do not hand-edit blindly; inspect the generated SQL, remove only the newly generated migration files if necessary, fix the schema definition, and regenerate.

If Docker containers are already running, `docker compose up -d` is idempotent. Do not run destructive database commands. Do not reset or checkout files owned by someone else. If unrelated user changes appear in `git status`, leave them in place and only stage files related to this feature.

## Artifacts and Notes

Issue #147 summary from GitHub: create a company-name/image component and a sponsor listing page for smartphone and PC; image ratio is fixed at 4:3; desktop image cards should be centered with a maximum of five per row; name-only companies should be centered with a maximum of three per row; use `SectionTitle` and design tokens from `src/app/(frontend)/styles.css`.

Figma observations:

    Mobile frame 249:593:
    - Page body width 393, blue background #1b339b.
    - Title text: ご協賛いただいた企業様（順不同）.
    - Image cards: 300 x 225, dark fill #1b2d7b, 2px cyan border #3ce0e8.
    - Company name above card, white, about 20px.
    - Name-only list uses white bullet and white text.

    Desktop frame 3084:10820:
    - Page width 1280 with existing header/footer.
    - Body title starts at about x=200 and thank-you text max-width about 800.
    - Example cards are 248 x 186, arranged in 3 columns in the static design.
    - Name-only sponsors appear as two columns in the design; issue allows up to three.

## Interfaces and Dependencies

Define `src/globals/SponsorsPage.ts` exporting `SponsorsPage: GlobalConfig`. The global slug should be `sponsors-page`. Fields should include:

- `thanksMessage`: textarea, label "謝礼メッセージ", required true, default value suitable for temporary public display, admin description explaining that line breaks are preserved.
- `sponsors`: array, label "協賛企業", sortable by Payload's array row ordering, admin `initCollapsed: true`, RowLabel component path `/components/admin/SponsorRowLabel#SponsorRowLabel`, fields:
  - `companyName`: text, required true, maxLength around 80.
  - `image`: upload, relationTo `media`, required false, admin description explaining image/no-image display behavior and 4:3 recommendation.

Define `src/components/admin/SponsorRowLabel.tsx` as a client component using `useRowLabel<{ companyName?: string | null }>()` and returning the company name or `協賛企業 <row number>`.

Define `src/globals/hooks/revalidateSponsorsPage.ts` exporting `revalidateSponsorsPageAfterChange: GlobalAfterChangeHook`, which calls `revalidateTag(CACHE_TAGS.sponsorsPage, "max")` and `revalidatePath("/sponsors")` unless `context.disableRevalidate` is set.

Define `src/modules/sponsors/server/getSponsorsPageData.ts` exporting `getSponsorsPageData(): Promise<SponsorsPageData>`.

Define `src/modules/sponsors/ui/SponsorCard.tsx` exporting a server component with props equivalent to:

    type SponsorCardProps = {
      companyName: string;
      image?: {
        url: string;
        alt: string;
        width?: number;
        height?: number;
      };
    };

Define `src/modules/sponsors/SponsorPageView.tsx` exporting the page body component. It should render `SectionTitle`, message, image sponsor grid, name-only grid, and empty state.

Revision note: Initial plan created after repository, Figma, issue, Next.js, and Payload research so implementation can proceed after subagent self-review.
