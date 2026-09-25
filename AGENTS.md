# AGENTS.md

This repository keeps agent docs intentionally small and topic-focused.

Use this file as a map. Read only the sections relevant to your task.

## Related Repositories

The SportsJobs project also has two sibling repositories under `C:\Users\franb\projects\sportsjobs\`:

- Backend and database: `C:\Users\franb\projects\sportsjobs\sportsjobs_postgres` (FastAPI, PostgreSQL, API endpoints, and database scripts). Read its `AGENTS.md`, relevant `docs/` page, and current endpoint/schema before changing backend contracts or persistence.
- Scraper: `C:\Users\franb\projects\sportsjobs\sportsjobs` (job collection and enrichment). Read its `AGENTS.md` and `run_scripts.sh` before changing how jobs are collected or which fields are written.

This repo owns the user interface, browser interactions, and Next.js API boundary. The backend repo owns API behavior and persistence; the scraper owns job collection. Work in only the repositories the feature actually needs. A CV collection feature, for example, may need a frontend upload flow and backend storage/access API without needing a scraper change.

## Quick Map

- Product and architecture overview: `docs/architecture.md`
- Frontend implementation rules: `docs/frontend.md`
- Authentication and user identity: `docs/auth.md`
- Data flow and backend integration: `docs/data-backend.md`
- 2026 user/dashboard backend requirements: `docs/backend-refactor-2026.md`
- Payments and subscriptions: `docs/payments.md`
- Analytics and attribution: `docs/analytics.md`
- Performance and caching rules: `docs/performance.md`
- Integrations and webhooks: `docs/integrations-webhooks.md`
- Content and SEO rules: `docs/content-seo.md`
- Search-intent landing page notes: `docs/content-seo.md` and `docs/frontend.md`
- Environment and runbook: `docs/environment.md`

## How To Use These Docs

1. Start here.
2. Open only the topic docs needed for your task.
3. Prefer current implementation reality over stale assumptions.
4. If docs and code disagree, trust code first and update docs in the same change.
5. After a behavior, route, or API contract change, update the relevant `docs/*.md`. Update `AGENTS.md` when its map or repo-wide rules change; keep feature details in topic docs.

## Building a Feature Across Repositories

1. Trace the user-facing page/component, any `lib/*` helper, the local `app/api/*` route, and the backend endpoint it calls. For job data changes, also trace the scraper write and the PostgreSQL field.
2. Decide the smallest request/response contract and the owner of any new field. Keep secrets and backend bearer tokens in server code. For user data such as CVs, define who can upload, read, and delete it, and where file bytes and metadata are stored before implementing the UI.
3. Implement the backend endpoint and schema change when needed, then the local Next.js API route, helper, and UI. Follow each repo's own `AGENTS.md`. Preserve existing Auth0 `sub` identity, error handling, and API shapes unless the feature requires a change.
4. Verify the changed boundary with focused tests or local mocked responses, then run this repo's relevant checks (`npm run lint` and, when route/type/build behavior changes warrant it, `npm run build`). Do not use live payment, email, upload, or database writes as routine validation.

For frontend code, `app/` contains routes/pages, `components/` contains reusable UI, `lib/` contains helpers, and `app/api/` contains the server routes through which client code normally reaches the backend. Server-rendered pages may use an existing server-only backend helper directly when that is the established pattern; see `docs/data-backend.md`. Keep new components and state flow straightforward, and reuse nearby patterns before adding abstractions.

## Repo-Wide Defaults

- Stack: Next.js 14 App Router + Chakra UI + TypeScript.
- API calls: use `fetch` for new work (do not introduce axios in app code).
- Backend access: route external/backend calls through `app/api/*`.
- Signup is currently a pre-account onboarding funnel stored in browser `localStorage` and synced through `app/api/signup-funnel`; do not reconnect direct Auth0 account creation until backend `/users/ensure` is stable.
- Signup funnel rows use a browser-generated `signupFunnelId` as the pre-auth join key through checkout and Auth0 claim; do not use email as the primary paid-signup linkage.
- Signup/onboarding UI uses shared semantic brand constants from `lib/uiTokens.ts`; avoid visible `free` wording in signup CTAs.
- Brand UI must go through `lib/uiTokens.ts` and the semantic Chakra palettes (`brandBg`, `brandFg`, `brandPrimary`, `brandSecondary`). Do not use Chakra built-in color names as brand concepts or hard-code brand hex values in components. Featured cards use primary surfaces; regular cards and common dark panels use secondary surfaces.
- Signup funnel screens should stay focused and vertical: no global chrome, question options as lists, persistent country skip action, progress only through country, and insight screens as concise icon bullets.
- Role/job-type onboarding is paused; keep role fields as `roleInterests: []` and `roleUnsure: true` for backend compatibility.
- Signup pricing should use the focused conversion flow: an automatically applied 25% `SPORTS25` Stripe promotion, selected plan checkout, proof/testimonials/FAQ, and a repeated CTA. Do not use a locally resetting urgency timer.
- Homepage testimonials currently use the shorter DB-backed paged wall; keep the older masonry wall component available for easy rollback.
- Anonymous job-listing surfaces show up to seven featured jobs; keep the homepage server render and featured-jobs API default aligned with that limit.
- User profile and onboarding access goes through `app/api/me`, keyed by Auth0 `sub`.
- Dashboard links are temporarily hidden from global navigation and completion redirects while the dashboard flow is unfinished; keep the route available for direct testing.
- Subscription cancellation must be authenticated, keyed by Auth0 `sub`, and resolved through backend billing IDs before using email as a legacy fallback.
- Expired sessions encountered in subscription settings should reauthenticate through Auth0, return to `/settings`, and show the one-time sign-in verification notice before the user retries the change.
- Keep comments that explain complex logic unless you are sure they are obsolete.
- Favor small, explicit changes over broad refactors.
- Search-intent landing pages include the editorial routes `/sports-analytics-internships`, `/sports-analytics-salaries`, and `/teamwork-online-sports-analytics-jobs`, plus the shared job-category collections configured in `lib/jobLandingPages.ts` and linked from `/job-searches`.
- Public interview-prep resources currently include `/resources/interview-questions/data-scientist`.
- Homepage/global title metadata should stay query-first with `SportsJobs Online` at the end.
- High-cardinality job links should disable automatic Next.js prefetch; see `docs/performance.md`.
- Server-rendered job detail pages should use the shared server-only backend helper, not self-fetch the public `/api/get-job-details` route.
- Job postings use a two-calendar-month `validThrough`; expired archive URLs remain indexable and must be excluded from the job sitemap.
- Job alert creation uses the PostgreSQL backend through `app/api/create-alert`; do not reintroduce Airtable dual writes.
- Paid job submissions should store the full draft in the backend before Stripe Checkout and pass only `pendingJobId` through Stripe metadata.
- Job surfaces should resolve missing and legacy default logos through `lib/jobLogo.ts`; serve the rectangular SportsJobs wordmark from Cloudflare R2 in wider fallback-only containers while keeping uploaded company logos square.
- Job Apply buttons must emit the shared `apply_click` analytics event and use `lib/outboundAttribution.ts`; preserve origin-only referrers and do not append UTMs outside the approved host allowlist.

## Source Priority

When information conflicts, use this order:
1. Current code paths in the repository
2. `docs/*.md` topic documents
3. `.github/instructions/copilot-instructions.md`
4. External assumptions
