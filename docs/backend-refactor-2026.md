# SportsJobs Refactor 2026 Backend Requirements

## Goal

Support free Auth0 signup, an authenticated dashboard, persisted onboarding answers, Stripe-backed premium entitlements, and later user features such as saved jobs, saved searches, and CV review.

## Current Frontend State

`/signup` is a pre-account onboarding funnel. It stores answers/contact in browser `localStorage`, syncs contact plus answers into the backend users table through `app/api/signup-funnel`, records a paid-product acknowledgement click, then shows Stripe checkout plans.

## Identity Model

Use Auth0 `sub` as the stable user key. Email is important for communication and Stripe matching, but it must not be the primary identifier.

Suggested `users` table:

- `id`: backend UUID or integer primary key
- `auth0_sub`: unique, required
- `email`: required, mutable
- `name`: optional
- `stripe_customer_id`: nullable, unique when present
- `stripe_subscription_id`: nullable
- `stripe_checkout_session_id`: nullable, unique when present
- `signup_funnel_id`: nullable, unique when present for pre-auth signup funnel rows
- `plan`: `free`, `monthly_subscription`, `yearly_subscription`, or `lifetime`
- `subscription_status`: `none`, `trialing`, `active`, `past_due`, or `canceled`
- `signup_funnel_answers_json`: nullable JSON payload for pre-auth signup answers
- `signup_funnel_completed_at`: nullable timestamp
- `paid_product_acknowledged_at`: nullable timestamp, set when the user clicks `That's fair`
- `created_at`
- `updated_at`

Suggested `user_profiles` table:

- `user_id`: foreign key to `users`
- `sports_interests`: array or JSON
- `job_search_duration`: string
- `hardest_part`: string
- `country`: nullable string using the same normalized country values as jobs filters
- `role_interests`: array or JSON, optional/empty while role-type onboarding is paused
- `role_unsure`: boolean, true while role-type onboarding is paused
- `onboarding_completed_at`: nullable timestamp
- `answers_json`: JSON payload for forward-compatible onboarding fields
- `created_at`
- `updated_at`

For v1, keep the fixed option values as stable string IDs in code and store those IDs in the profile table. If these options become admin-editable later, add an `onboarding_options` table and keep answer values pointing to stable option IDs.

Suggested option catalog shape if needed later:

- `id`: stable string, for example `basketball`
- `question_key`: `sports_interests`, `job_search_duration`, or `hardest_part`
- `label`: display label
- `sort_order`
- `is_active`

Current onboarding option IDs:

- Sports: `football`, `soccer`, `basketball`, `hockey`, `baseball`, `tennis`, `golf`, `formula_1`, `betting_fantasy`, `esports`
- Job search duration: `just_started`, `few_weeks`, `few_months`, `feels_like_forever`
- Hardest part: `not_hearing_back`, `not_getting_interviews`, `too_much_competition`, `not_enough_jobs`, `lack_of_great_offers`
- Roles are not collected in the current onboarding flow. Frontend sends `roleInterests: []` and `roleUnsure: true` until this question returns.

## Required Endpoints

All endpoints should keep using the existing backend bearer auth header.

### `POST /users/signup_funnel`

Creates or updates a pre-auth user row by normalized email and stores the signup funnel answers.
New clients send `signupFunnelId`/`signup_funnel_id`; when present, match by that value before falling back to email.

Request body:

```json
{
  "signupFunnelId": "sf_...",
  "name": "Person Name",
  "email": "person@example.com",
  "source": "signup-funnel",
  "onboarding": {
    "sportsInterests": ["football", "basketball"],
    "jobSearchDuration": "few_weeks",
    "hardestPart": "not_hearing_back",
    "country": "united states",
    "roleInterests": [],
    "roleUnsure": true
  }
}
```

Behavior:

- Match existing user by normalized email when `auth0_sub` is not available yet.
- Match existing user by `signup_funnel_id` first when provided; email is only a legacy fallback because it can be fake or reused.
- Create the row if no user exists.
- Store `signup_funnel_id`, `name`, `email`, `signup_funnel_answers_json`, and `signup_funnel_completed_at`.
- Leave `auth0_sub` nullable until the Auth0 account is created.
- Return `{ "success": true }` or the updated user summary.

### `PATCH /users/signup_funnel/paid-product-acknowledgement`

Records that the user accepted the paid-product explanation.

Request body:

```json
{
  "signupFunnelId": "sf_...",
  "email": "person@example.com",
  "paidProductAcknowledgedAt": "2026-06-10T12:00:00.000Z"
}
```

Behavior:

- Match user by `signup_funnel_id` first when provided, then normalized email as legacy fallback.
- Set `paid_product_acknowledged_at`.
- Return `{ "success": true }`.

### `POST /stripe/checkout-session/sync`

Optional manual fallback that verifies a Stripe Checkout Session after the browser returns from Stripe and attaches payment state to the pre-auth signup row.

Request body:

```json
{
  "session_id": "cs_test_...",
  "signup_funnel_id": "sf_..."
}
```

Behavior:

- Retrieve the Checkout Session from Stripe using the backend Stripe secret key.
- Require `status = complete` and `payment_status = paid`.
- Find the user row by `signup_funnel_id`, `stripe_checkout_session_id`, `stripe_customer_id`, then email only as legacy fallback.
- Store `stripe_checkout_session_id`, `stripe_customer_id`, `stripe_subscription_id`, `plan`, and `subscription_status`.
- Return `{ "success": true, "name": "...", "email": "..." }` or the updated user summary.

### `POST /users/signup_funnel/claim`

Links the paid pre-auth funnel row to the Auth0 account created after checkout.

Request body:

```json
{
  "auth0Sub": "auth0|abc",
  "sessionId": "cs_test_...",
  "signupFunnelId": "sf_...",
  "email": "final@example.com",
  "name": "Final Name",
  "finalEmail": "final@example.com",
  "finalName": "Final Name",
  "checkoutEmail": "original@example.com",
  "stripeCustomerId": "cus_...",
  "stripeSubscriptionId": "sub_..."
}
```

Behavior:

- Match the existing paid row by `stripe_checkout_session_id`/`sessionId` first, then `signup_funnel_id`, then Stripe customer/subscription IDs when available.
- Attach `auth0_sub`.
- Update mutable `email` and `name` with the final edited values (`finalEmail`/`email` and `finalName`/`name`), even when they differ from checkout metadata or the original funnel email.
- Treat `checkoutEmail` only as a legacy lookup hint; do not keep it as the final user email after claim.
- Do not create duplicate paid users when webhook, checkout sync, and claim all run.
- Return the full profile shape.

### `GET /users/me?auth0_sub=...`

Returns the current user profile.

Frontend response shape expected by `app/api/me`:

```json
{
  "auth0Sub": "auth0|abc",
  "email": "person@example.com",
  "name": "Person Name",
  "plan": "free",
  "subscriptionStatus": "none",
  "onboardingCompletedAt": null,
  "onboarding": {}
}
```

Return `404` if the user does not exist.

### `GET /users/billing?auth0_sub=...`

Returns billing identifiers for authenticated server-side subscription operations.

Frontend response shape expected by `app/api/cancel-subscription`:

```json
{
  "auth0_sub": "auth0|abc",
  "email": "person@example.com",
  "stripe_customer_id": "cus_...",
  "stripe_subscription_id": "sub_...",
  "plan": "monthly_subscription",
  "subscription_status": "active"
}
```

Behavior:

- Match by `auth0_sub` only.
- Return nullable or empty Stripe IDs for legacy users when unavailable.
- Return email as a legacy Stripe lookup fallback; email must not be treated as the primary billing identifier.
- Require the existing backend bearer auth header.
- Return `404` if the user does not exist.

### `POST /users/ensure`

Creates or updates the user from Auth0 session identity and returns the same profile shape.

This endpoint is called after first-party free signup, after successful Auth0 login from the frontend Auth0 callback, and again when `/dashboard` loads through `POST /api/me`. It must be idempotent.

Request body:

```json
{
  "auth0Sub": "auth0|abc",
  "email": "person@example.com",
  "name": "Person Name"
}
```

Behavior:

- If `auth0_sub` exists, update mutable identity fields such as email/name.
- If it does not exist, create a free user with `plan = free` and `subscription_status = none`.
- Return the full profile shape.

### `PATCH /users/me/onboarding`

Persists onboarding answers and returns the updated profile.

Request body:

```json
{
  "auth0Sub": "auth0|abc",
  "onboarding": {
    "sportsInterests": ["football", "basketball"],
    "jobSearchDuration": "few_weeks",
    "hardestPart": "not_hearing_back",
    "country": "united states",
    "roleInterests": [],
    "roleUnsure": true
  }
}
```

Behavior:

- Validate required onboarding fields.
- `country` is optional.
- `roleInterests` is optional and can be empty while role-type onboarding is paused; current frontend sends `roleUnsure: true`.
- Store normalized fields and the raw answers JSON.
- Set `onboarding_completed_at` when the payload is valid.
- Return the full profile shape.

## Stripe Sync

Stripe webhooks should become the source of truth for paid entitlement state.

Required events:

- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- payment events needed for `past_due` recovery if used

Checkout metadata now includes:

- `auth0_sub`
- `email`
- `name`
- `signup_funnel_id`
- `source`
- `priceId`
- `planName`
- `promotekit_referral`

Webhook behavior:

- Match by `auth0_sub` first.
- Fall back to `stripe_customer_id` or email only when necessary.
- Store `stripe_customer_id` and `stripe_subscription_id`.
- Map Stripe price IDs to backend `plan` values.
- For lifetime checkout, set `plan = lifetime` and `subscription_status = active`.
- For canceled subscriptions, keep the user account active and downgrade entitlement when the subscription no longer grants access.

## Later User Features

Suggested saved jobs table:

- `user_id`
- `job_id`
- `notes`
- `status`: `saved`, `applied`, `archived`
- `created_at`
- `updated_at`

Suggested saved searches table:

- `user_id`
- `name`
- `filters_json`
- `alert_frequency`
- `created_at`
- `updated_at`

Suggested CV storage table:

- `user_id`
- `s3_key`
- `filename`
- `content_type`
- `size_bytes`
- `review_status`
- `review_json`
- `created_at`
- `updated_at`

CV upload should use signed S3 upload URLs or a backend upload endpoint. The review API should store review output server-side and return a concise summary to the frontend.
