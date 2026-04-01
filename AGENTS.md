# AGENTS.md

This repository keeps agent docs intentionally small and topic-focused.

Use this file as a map. Read only the sections relevant to your task.

## Quick Map

- Product and architecture overview: `docs/architecture.md`
- Frontend implementation rules: `docs/frontend.md`
- Authentication and user identity: `docs/auth.md`
- Data flow and backend integration: `docs/data-backend.md`
- Payments and subscriptions: `docs/payments.md`
- Analytics and attribution: `docs/analytics.md`
- Performance and caching rules: `docs/performance.md`
- Integrations and webhooks: `docs/integrations-webhooks.md`
- Content and SEO rules: `docs/content-seo.md`
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
- Keep comments that explain complex logic unless you are sure they are obsolete.
- Favor small, explicit changes over broad refactors.

## Source Priority

When information conflicts, use this order:
1. Current code paths in the repository
2. `docs/*.md` topic documents
3. `.github/instructions/copilot-instructions.md`
4. External assumptions
