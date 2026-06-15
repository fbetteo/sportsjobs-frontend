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
- Signup/onboarding UI uses shared primary accent constants from `lib/uiTokens.ts`; avoid visible `free` wording in signup CTAs.
- Brand surfaces, featured treatments, and resource/status tags should use the primary/secondary constants from `lib/uiTokens.ts` instead of hard-coded color schemes or hex values. Featured cards use primary surfaces; regular cards and common dark panels use secondary surfaces.
- Signup funnel screens should stay focused and vertical: no global chrome, question options as lists, persistent country skip action, progress only through country, and insight screens as concise icon bullets.
- Role/job-type onboarding is paused; keep role fields in payloads as empty/default values for backend compatibility.
- Signup pricing should use the focused conversion flow: 25% promo code messaging, selected plan checkout, proof/testimonials/FAQ, and a repeated CTA.
- User profile and onboarding access goes through `app/api/me`, keyed by Auth0 `sub`.
- Keep comments that explain complex logic unless you are sure they are obsolete.
- Favor small, explicit changes over broad refactors.
- Search-intent landing pages currently include `/sports-analytics-internships`, `/sports-analytics-salaries`, and `/teamwork-online-sports-analytics-jobs`.
- Public interview-prep resources currently include `/resources/interview-questions/data-scientist`.
- Homepage/global title metadata should stay query-first with `SportsJobs Online` at the end.
- High-cardinality job links should disable automatic Next.js prefetch; see `docs/performance.md`.
- Server-rendered job detail pages should use the shared server-only backend helper, not self-fetch the public `/api/get-job-details` route.
- Paid job submissions should store the full draft in the backend before Stripe Checkout and pass only `pendingJobId` through Stripe metadata.

## Source Priority

When information conflicts, use this order:
1. Current code paths in the repository
2. `docs/*.md` topic documents
3. `.github/instructions/copilot-instructions.md`
4. External assumptions
