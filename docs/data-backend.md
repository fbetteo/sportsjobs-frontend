# Data and Backend Integration

## Data Flow

1. UI/components call `lib/*` fetch helpers.
2. Helpers call local `app/api/*` routes.
3. API routes call backend services (mainly Python jobs API).
4. API routes transform, trim, and cache responses.

## Backend Source (Jobs)

- Primary jobs data source is a Python API hosted outside this repo.
- Typical endpoint pattern: POST to `http://$HETZNER_POSTGRES_HOST:8000/jobs`.
- Backend calls require bearer auth header using `HEADER_AUTHORIZATION`.

## API Response Strategy

- List endpoints return minimal fields by default.
- Heavy fields (`description`, `skills`) should be included only when explicitly requested (for example with `full=true`).
- Detail endpoints return complete records for a single job.

## Route and Fetch Conventions

- Keep external/backend calls inside Next API routes under `app/api/*`.
- Use `fetch` for HTTP calls.
- Preserve graceful fallback behavior (empty arrays/null + error logging where useful).

## Filtering and IDs

- Jobs endpoints support structured filters (country, seniority, industry, sport, etc.).
- Detail lookup may accept numeric IDs or slugs; current route logic decides filter type.
- Keep slug-first URL behavior when available.
