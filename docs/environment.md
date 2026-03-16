# Environment and Runbook

## Local Commands

- `npm run dev`: start development server
- `npm run build`: production build
- `npm run start`: run built app
- `npm run lint`: lint checks

## Key Environment Variables

### Core app

- `NEXT_PUBLIC_BASE_URL` (optional, used in some routes)
- `NEXT_PUBLIC_POSTHOG_KEY`
- `NEXT_PUBLIC_POSTHOG_HOST`

### Auth0

- `AUTH0_DOMAIN`
- `AUTH0_CLIENT_ID`
- `AUTH0_CLIENT_SECRET`
- `AUTH0_BASE_URL`
- `AUTH0_SECRET`

### Backend API

- `HETZNER_POSTGRES_HOST`
- `HEADER_AUTHORIZATION`

Notes:
- `HETZNER_POSTGRES_HOST` should be host only (for example `localhost` or backend host), because current routes build URLs like `http://$HETZNER_POSTGRES_HOST:8000/...`.

### Stripe

- `STRIPE_SECRET_KEY`
- public/plan price IDs (for example lifetime/yearly/monthly IDs)

## Operational Notes

- Keep secrets in environment configuration only.
- Do not hardcode credentials in routes or components.
- If adding a new integration, update this file with required env vars and route entry points.
- Testimonials proxy route is `app/api/testimonials/route.ts` and requires both `HETZNER_POSTGRES_HOST` and `HEADER_AUTHORIZATION`.
