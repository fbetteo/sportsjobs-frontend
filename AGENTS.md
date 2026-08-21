# AGENTS.md

This repository keeps agent docs intentionally small and topic-focused.

Use this file as a map. Read only the sections relevant to your task.

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
5. After any behavior, route, API contract, or component change, update `AGENTS.md` and relevant `docs/*.md` before finishing.

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
- User profile and onboarding access goes through `app/api/me`, keyed by Auth0 `sub`.
- Dashboard links are temporarily hidden from global navigation and completion redirects while the dashboard flow is unfinished; keep the route available for direct testing.
- Subscription cancellation must be authenticated, keyed by Auth0 `sub`, and resolved through backend billing IDs before using email as a legacy fallback.
- Expired sessions encountered in subscription settings should reauthenticate through Auth0, return to `/settings`, and show the one-time sign-in verification notice before the user retries the change.
- Keep comments that explain complex logic unless you are sure they are obsolete.
- Favor small, explicit changes over broad refactors.
- Search-intent landing pages currently include `/sports-analytics-internships`, `/sports-analytics-salaries`, and `/teamwork-online-sports-analytics-jobs`.
- Public interview-prep resources currently include `/resources/interview-questions/data-scientist`.
- Homepage/global title metadata should stay query-first with `SportsJobs Online` at the end.
- High-cardinality job links should disable automatic Next.js prefetch; see `docs/performance.md`.
- Server-rendered job detail pages should use the shared server-only backend helper, not self-fetch the public `/api/get-job-details` route.
- Job postings use a two-calendar-month `validThrough`; expired archive URLs remain indexable and must be excluded from the job sitemap.
- Job alert creation uses the PostgreSQL backend through `app/api/create-alert`; do not reintroduce Airtable dual writes.
- Paid job submissions should store the full draft in the backend before Stripe Checkout and pass only `pendingJobId` through Stripe metadata.
- Job Apply buttons must emit the shared `apply_click` analytics event and use `lib/outboundAttribution.ts`; preserve origin-only referrers and do not append UTMs outside the approved host allowlist.

## Source Priority

When information conflicts, use this order:
1. Current code paths in the repository
2. `docs/*.md` topic documents
3. `.github/instructions/copilot-instructions.md`
4. External assumptions
