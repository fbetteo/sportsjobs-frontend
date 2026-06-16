# Authentication

## Primary Auth System

- Auth provider: Auth0 via `@auth0/nextjs-auth0`.
- Built-in auth route: `app/api/auth/[auth0]/route.ts`.
- App-wide user context: `UserProvider` in `app/providers.tsx`.
- Client auth state: `useUser()` in client components.
- `/signup` currently does not create Auth0 users. It is a pre-account onboarding funnel while backend user creation is being stabilized.
- `POST /api/auth/signup` exists for direct Auth0 Management API account creation, but it should not be wired back into `/signup` until backend `/users/ensure` is reliable.
- `app/api/auth/[auth0]/route.ts` also customizes the Auth0 callback to call backend `/users/ensure` after successful login.

## Server-Side Auth0 Operations

Use `app/utils/auth0.ts` for management API operations:

- get M2M access token
- create Auth0 users
- disable/block users

## Practical Rules

- Keep user-specific checks explicit in components/routes.
- Prefer stable user identity checks using `user.sub` when optimizing effects.
- Use Auth0 `user.sub` as the primary application user key. Email can change and should only be a secondary matching field.
- Avoid duplicate user fetches triggered by transient Auth0 state updates.
- Canceling a subscription should not block or delete the Auth0 account. Free account access remains valid after cancellation.

## Common Environment Variables

- `AUTH0_DOMAIN`
- `AUTH0_CLIENT_ID`
- `AUTH0_CLIENT_SECRET`
- `AUTH0_BASE_URL`
- `AUTH0_SECRET`

## Notes

- Subscription state should be stored in the backend user record and synced from Stripe webhook events.
- In the paid-before-auth signup flow, the user is not created in Auth0 until after checkout. The success page lets the user edit name/email and choose a password; `/api/auth/signup` verifies the Stripe session server-side before creating Auth0 and sends both checkout email and final edited email to the backend claim route. Backend linking must use `signup_funnel_id` or Stripe session/customer IDs, not email alone, and should store the final edited email on claim.
- `app/api/me` also ensures the backend user exists for the current Auth0 session and persists onboarding answers. This is an idempotent safety net for the callback-time sync.
- If auth behavior changes, update this file with route and helper references.
