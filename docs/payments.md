# Payments and Subscriptions

## Provider and Entry Points

- Stripe is used for checkout and subscription flows.
- Main route for checkout session creation: `app/api/create-subscription/route.ts`.
- Free signup does not require Stripe. Authenticated dashboard upgrade entry points are temporarily hidden while the dashboard flow is unfinished.

## Current Flow (High Level)

1. Client requests a checkout session with a canonical `planId` (`monthly_subscription`, `yearly_subscription`, or `lifetime`), the matching public `priceId`, and optional referral.
2. Server creates Stripe Checkout Session.
3. Mode is selected by plan type (one-time vs subscription).
4. Authenticated upgrade sessions include Auth0 `sub`, email, plan name, and price ID in Stripe metadata.
5. Pre-auth signup sessions include `signup_funnel_id`, name, email, source, plan name, and price ID in Stripe metadata.
6. User is redirected to Stripe checkout URL.
7. Signup success redirects show the account creation form immediately; `/api/auth/signup` verifies the Stripe session server-side before creating/linking Auth0.
8. Authenticated success/cancel URLs temporarily return to `/`; legacy unauthenticated checkout still returns to signup success/cancel routes.

Pre-auth signup Checkout Sessions automatically apply `SPORTS25`. `app/api/create-subscription` uses `STRIPE_SIGNUP_PROMOTION_CODE_ID` when configured, otherwise it resolves the active code through Stripe. Checkout creation validates the selected plan against the configured price IDs and returns Stripe's discounted total for `begin_checkout` analytics. Signup cancellation returns to the plans step with the selected plan preserved.

## Paid Job Posting Flow

1. `app/api/create-job-posting/route.ts` uploads an optional logo and stores the full job payload through backend `POST /pending_job_postings`.
2. Stripe Checkout metadata receives only the short `pendingJobId` and a job-posting marker. Do not store descriptions or serialized job payloads in Stripe metadata.
3. `app/api/job-webhook/route.ts` handles `checkout.session.completed` and calls backend `POST /pending_job_postings/{id}/publish`.
4. The backend publishes each pending job idempotently, so Stripe webhook retries do not create duplicate public jobs.
5. The webhook temporarily supports legacy Checkout Sessions carrying the old serialized `jobData` metadata key.

## Cancellation Feedback

- Subscription cancellation is handled by `app/api/cancel-subscription/route.ts`.
- The route requires an Auth0 session and uses the session `sub` to fetch billing identity from backend `GET /users/billing`.
- The settings cancellation modal may send optional feedback in the request body:
  - `cancellationFeedback`
  - `cancellationComment`
- The browser must not send email, Stripe customer IDs, or subscription IDs for cancellation lookup.
- `cancellationFeedback` must match Stripe's supported cancellation feedback enum values.
- `cancellationComment` is trimmed and capped at 500 characters.
- Feedback is stored on the Stripe subscription via `cancellation_details.feedback` and `cancellation_details.comment`; v1 does not send email notifications or create a separate database record.
- Cancellation lookup uses backend `stripe_subscription_id` first, then backend `stripe_customer_id`, then backend email as a legacy fallback. Ambiguous Stripe matches return a support error instead of guessing.
- Cancellation schedules the Stripe subscription to end and does not disable the Auth0 account. Premium access should be downgraded through backend entitlement sync/webhooks.

## Entitlement Sync

- Stripe webhooks should be the source of truth for paid access.
- Browser success redirects are not treated as DB authority. `/api/auth/signup` must verify the Stripe session server-side before linking the paid signup row.
- Backend user records should store `stripe_customer_id`, `stripe_subscription_id`, `plan`, and `subscription_status`.
- Pre-auth signup linking should use `signup_funnel_id` and Stripe IDs before email; email is only a legacy fallback.
- Match webhook updates by Auth0 `sub` metadata first, then signup funnel ID/Stripe customer ID, then email only as a fallback.
- See `docs/backend-refactor-2026.md` for the backend contract.

## Related Areas

- Pricing constants live in `pricingPlans.ts`.
- Additional billing/subscription operations exist under `app/api/*` (cancel, webhook, etc.).

## Guardrails

- Validate required request fields (`priceId`, etc.) before provider calls.
- Resolve checkout plan names, values, and modes from the server-side allowlist; do not trust client-provided price values or plan labels.
- Keep payment logic server-side in API routes.
- Keep plan IDs and secret keys in environment variables.
