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

## Related Areas

- Pricing constants live in `pricingPlans.ts`.
- Additional billing/subscription operations exist under `app/api/*` (cancel, webhook, etc.).

## Guardrails

- Validate required request fields (`priceId`, etc.) before provider calls.
- Keep payment logic server-side in API routes.
- Keep plan IDs and secret keys in environment variables.
