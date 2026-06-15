# Payments and Subscriptions

## Provider and Entry Points

- Stripe is used for checkout and subscription flows.
- Main route for checkout session creation: `app/api/create-subscription/route.ts`.
- Free signup does not require Stripe. Stripe checkout is now primarily an authenticated upgrade action from `/dashboard`.

## Current Flow (High Level)

1. Client requests a checkout session with `priceId` (and optional referral).
2. Server creates Stripe Checkout Session.
3. Mode is selected by plan type (one-time vs subscription).
4. Authenticated upgrade sessions include Auth0 `sub`, email, plan name, and price ID in Stripe metadata.
5. User is redirected to Stripe checkout URL.
6. Authenticated success/cancel URLs return to `/dashboard`; legacy unauthenticated checkout still returns to signup success/cancel routes.

## Paid Job Posting Flow

1. `app/api/create-job-posting/route.ts` uploads an optional logo and stores the full job payload through backend `POST /pending_job_postings`.
2. Stripe Checkout metadata receives only the short `pendingJobId` and a job-posting marker. Do not store descriptions or serialized job payloads in Stripe metadata.
3. `app/api/job-webhook/route.ts` handles `checkout.session.completed` and calls backend `POST /pending_job_postings/{id}/publish`.
4. The backend publishes each pending job idempotently, so Stripe webhook retries do not create duplicate public jobs.
5. The webhook temporarily supports legacy Checkout Sessions carrying the old serialized `jobData` metadata key.

## Cancellation Feedback

- Subscription cancellation is handled by `app/api/cancel-subscription/route.ts`.
- The settings cancellation modal may send optional feedback in the request body:
  - `email`
  - `cancellationFeedback`
  - `cancellationComment`
- `cancellationFeedback` must match Stripe's supported cancellation feedback enum values.
- `cancellationComment` is trimmed and capped at 500 characters.
- Feedback is stored on the Stripe subscription via `cancellation_details.feedback` and `cancellation_details.comment`; v1 does not send email notifications or create a separate database record.
- Cancellation schedules the Stripe subscription to end and does not disable the Auth0 account. Premium access should be downgraded through backend entitlement sync/webhooks.

## Entitlement Sync

- Stripe webhooks should be the source of truth for paid access.
- Backend user records should store `stripe_customer_id`, `stripe_subscription_id`, `plan`, and `subscription_status`.
- Match webhook updates by Auth0 `sub` metadata first, then Stripe customer ID, then email only as a fallback.
- See `docs/backend-refactor-2026.md` for the backend contract.

## Related Areas

- Pricing constants live in `pricingPlans.ts`.
- Additional billing/subscription operations exist under `app/api/*` (cancel, webhook, etc.).

## Guardrails

- Validate required request fields (`priceId`, etc.) before provider calls.
- Keep payment logic server-side in API routes.
- Keep plan IDs and secret keys in environment variables.
