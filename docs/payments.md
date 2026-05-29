# Payments and Subscriptions

## Provider and Entry Points

- Stripe is used for checkout and subscription flows.
- Main route for checkout session creation: `app/api/create-subscription/route.ts`.

## Current Flow (High Level)

1. Client requests a checkout session with `priceId` (and optional referral).
2. Server creates Stripe Checkout Session.
3. Mode is selected by plan type (one-time vs subscription).
4. User is redirected to Stripe checkout URL.
5. Success/cancel URLs return user to signup flow routes.

## Cancellation Feedback

- Subscription cancellation is handled by `app/api/cancel-subscription/route.ts`.
- The settings cancellation modal may send optional feedback in the request body:
  - `email`
  - `cancellationFeedback`
  - `cancellationComment`
- `cancellationFeedback` must match Stripe's supported cancellation feedback enum values.
- `cancellationComment` is trimmed and capped at 500 characters.
- Feedback is stored on the Stripe subscription via `cancellation_details.feedback` and `cancellation_details.comment`; v1 does not send email notifications or create a separate database record.

## Related Areas

- Pricing constants live in `pricingPlans.ts`.
- Additional billing/subscription operations exist under `app/api/*` (cancel, webhook, etc.).

## Guardrails

- Validate required request fields (`priceId`, etc.) before provider calls.
- Keep payment logic server-side in API routes.
- Keep plan IDs and secret keys in environment variables.
