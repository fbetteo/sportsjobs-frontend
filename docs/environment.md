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
- `STRIPE_SIGNUP_PROMOTION_CODE_ID` (optional; Stripe promotion-code ID for `SPORTS25`; the checkout route looks up the active code when omitted)
- public/plan price IDs (for example lifetime/yearly/monthly IDs)

### Private resume storage

- `CLOUDFLARE_R2_RESUMES_BUCKET_NAME`: name of a separate private R2 bucket with public access disabled.
- `CLOUDFLARE_R2_RESUMES_ENDPOINT_URL` (optional): use the resume bucket's jurisdiction-specific S3 API endpoint if it differs from the logo bucket. Otherwise the route uses the existing `CLOUDFLARE_R2_ENDPOINT_URL`.
- `CLOUDFLARE_R2_RESUMES_ACCESS_KEY` and `CLOUDFLARE_R2_RESUMES_SECRET_KEY`: server-only R2 S3 credentials from an Object Read & Write token scoped to the resume bucket. Keep the logo credentials separate.
- Deploy the backend profile endpoints and run the `user_profiles.linkedin_url` migration before enabling the frontend resume settings. No bucket or credentials should be exposed through `NEXT_PUBLIC_*`.

## Operational Notes

- Keep secrets in environment configuration only.
- Do not hardcode credentials in routes or components.
- If adding a new integration, update this file with required env vars and route entry points.
- Testimonials proxy route is `app/api/testimonials/route.ts` and requires both `HETZNER_POSTGRES_HOST` and `HEADER_AUTHORIZATION`.
