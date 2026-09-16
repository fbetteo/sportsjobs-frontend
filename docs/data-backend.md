# Data and Backend Integration

## Data Flow

1. UI/components call `lib/*` fetch helpers.
2. Helpers call local `app/api/*` routes.
3. API routes call backend services (mainly Python jobs API).
4. API routes transform, trim, and cache responses.

Server-rendered pages may call server-only backend helpers directly when doing so avoids self-fetching the public site API. For job detail pages, `lib/jobDetailsBackend.ts` is the shared source used by both `app/jobs/[id]` and `app/api/get-job-details`.

## User Profile and Onboarding

- `app/api/me` is the frontend boundary for current-user profile data.
- `POST /api/me` ensures the Auth0 user exists in the backend and returns the profile.
- `GET /api/me` fetches the backend profile for the current Auth0 `sub`.
- `PATCH /api/me` persists onboarding answers through backend `/users/me/onboarding`.
- Required backend routes and database fields are documented in `docs/backend-refactor-2026.md`.
- If the backend profile routes are not available yet, `/api/me` can return a free-user fallback for dashboard rendering, but onboarding persistence requires the backend.
- Resume settings call `/api/resume` for private PDF upload, download, replacement, and deletion, and `/api/linkedin` for the optional profile URL. These server routes use the Auth0 session to call backend `/users/me/cv` and `/users/me/linkedin`; the browser never supplies an Auth0 subject or R2 key.
- Resume PDFs use a separate private R2 bucket named by `CLOUDFLARE_R2_RESUMES_BUCKET_NAME`. Configure `CLOUDFLARE_R2_RESUMES_ACCESS_KEY` and `CLOUDFLARE_R2_RESUMES_SECRET_KEY` from a bucket-scoped R2 token; do not expose the bucket through `CLOUDFLARE_R2_PUBLIC_URL` or `r2.dev`. Files are limited to 4 MB. No company sharing or CV processing is enabled until malware scanning and explicit consent are implemented.

## Backend Source (Jobs)

- Primary jobs data source is a Python API hosted outside this repo.
- Typical endpoint pattern: POST to `http://$HETZNER_POSTGRES_HOST:8000/jobs`.
- Backend calls require bearer auth header using `HEADER_AUTHORIZATION`.
- Paid recruiter submissions are stored as pending backend drafts through `POST /pending_job_postings` and published after Stripe payment through `POST /pending_job_postings/{id}/publish`.
- Recruiter submissions without an uploaded company logo store the canonical Cloudflare R2 URL from `lib/jobLogo.ts`; presentation code also normalizes the legacy CDN and Vercel defaults without migrating existing rows.

## Job Alerts

- Settings uses `POST /api/create-alert` to create an alert and `GET/DELETE /api/alerts` to list/delete alerts. These server routes require an Auth0 session and send its subject to backend `POST/GET/DELETE /alerts`; the backend derives the login email from `users`. PostgreSQL is the sole alert store.
- Any signed-in user can create, list, and delete alerts. The account's Auth0 subject, rather than its subscription plan, determines alert access.
- The proxy returns backend failures instead of reporting success, and identical normalized alerts return `duplicate: true` without creating another record.
- Alert matching treats empty selections as unrestricted, multiple values within a filter as OR, and selected filters as AND. Separate alerts for one user are combined into one deduplicated digest. The scraper's `send_alerts.py` call is currently disabled in `run_scripts.sh` pending delivery work.

## Testimonials Integration

- Local route: `app/api/testimonials/route.ts`
- Backend path used by proxy: `http://$HETZNER_POSTGRES_HOST:8000/testimonials`
- Methods:
	- `GET`: fetch testimonials for frontend wall/marquee components
	- `POST`: create testimonial from public form submission
- `POST` frontend payload is validated/transformed before forwarding.
	- Required: `name`, `content`
	- Optional: `email`, `roleCompany`, `rating`
	- Spam honeypot: `website` must be empty
- Forwarded backend payload shape (matches current backend model):
	- `name`
	- `email`
	- `role`
	- `company`
	- `content`
	- `avatar_url`
	- `rating`

## API Response Strategy

- List endpoints return minimal fields by default.
- Minimal job list records include lightweight taxonomy fields (`sport_list`, `job_area`) so public listing pages can tag and filter jobs without requesting heavy descriptions.
- Heavy fields (`description`, `skills`) should be included only when explicitly requested (for example with `full=true`).
- Detail endpoints return complete records for a single job.

## Route and Fetch Conventions

- Keep external/backend calls inside Next API routes under `app/api/*`.
- Exception: server-only helpers may call the backend directly for server-rendered pages to avoid routing through the public Vercel API endpoint.
- Use `fetch` for HTTP calls.
- Preserve graceful fallback behavior (empty arrays/null + error logging where useful).

## Filtering and IDs

- Jobs endpoints support structured filters (country, seniority, industry, sport, etc.).
- Detail lookup may accept numeric IDs or slugs; current route logic decides filter type.
- Keep slug-first URL behavior when available.
- Detail lookups return the backend numeric `job_id` as `job.id` and include `job.slug` when available. Pages should redirect numeric legacy URLs to `/jobs/{slug}` for the canonical public URL.
- Missing detail records should return `404` from `app/api/get-job-details`, not `500`.
