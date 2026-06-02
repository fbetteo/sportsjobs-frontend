# Integrations and Webhooks

## Purpose

Use this guide when touching third-party integrations, webhook handlers, or external service credentials.

## Primary Integrations in This Repo

- Stripe: checkout + webhook event handling
- Auth0: authentication and management API operations
- Python backend API: jobs, newsletter signup persistence, other data actions
- Cloudflare R2 (S3 API): logo/media uploads
- Beehiiv: newsletter subscriptions
- PostHog: product analytics/pageview capture

## Webhook Pattern (Current)

- Validate provider signatures before processing payloads.
- Handle only expected event types and return safe success responses for ignored events.
- Keep webhook handlers idempotent and defensive against malformed metadata.
- Return a non-2xx response when paid-job publishing fails so Stripe can retry transient failures.
- Log operational errors, but avoid leaking secrets in logs.

## Paid Job Posting

- Store full recruiter-submitted job data in the Python backend through `POST /pending_job_postings` before creating Stripe Checkout.
- Stripe metadata should contain only `pendingJobId` and a job-posting marker.
- Publish paid jobs idempotently through backend `POST /pending_job_postings/{id}/publish` after `checkout.session.completed`.
- Legacy Checkout Sessions with serialized `jobData` metadata remain supported during the transition.

## Route Ownership

- Keep integration calls inside `app/api/*` routes.
- Keep frontend/components calling local API routes, not external provider endpoints directly.
- Keep provider-specific shaping/validation server-side.

## Environment Variables (Integration-Focused)

- Stripe: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
- Python API: `HETZNER_POSTGRES_HOST`, `HEADER_AUTHORIZATION`
- R2: `CLOUDFLARE_R2_ENDPOINT_URL`, `CLOUDFLARE_R2_ACCESS_KEY`, `CLOUDFLARE_R2_SECRET_KEY`, `CLOUDFLARE_R2_BUCKET_NAME`, `CLOUDFLARE_R2_PUBLIC_URL`
- Beehiiv: `BEEHIIV_API_KEY`, `BEEHIV_PUBLICATION_ID`

## Guardrails

- Do not move secrets into client bundles.
- Prefer explicit input validation at route boundaries.
- Preserve existing comments that explain integration-specific edge cases.
