# Authentication

## Primary Auth System

- Auth provider: Auth0 via `@auth0/nextjs-auth0`.
- Built-in auth route: `app/api/auth/[auth0]/route.ts`.
- App-wide user context: `UserProvider` in `app/providers.tsx`.
- Client auth state: `useUser()` in client components.

## Server-Side Auth0 Operations

Use `app/utils/auth0.ts` for management API operations:

- get M2M access token
- create Auth0 users
- disable/block users

## Practical Rules

- Keep user-specific checks explicit in components/routes.
- Prefer stable user identity checks using `user.sub` when optimizing effects.
- Avoid duplicate user fetches triggered by transient Auth0 state updates.

## Common Environment Variables

- `AUTH0_DOMAIN`
- `AUTH0_CLIENT_ID`
- `AUTH0_CLIENT_SECRET`
- `AUTH0_BASE_URL`
- `AUTH0_SECRET`

## Notes

- Subscription state can be tied to Auth0 metadata depending on flow.
- If auth behavior changes, update this file with route and helper references.
