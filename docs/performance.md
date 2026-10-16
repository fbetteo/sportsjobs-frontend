# Performance and Caching

## Core Principle

Minimize payload size and origin calls first; optimize interaction patterns second.

## API Payload Strategy

- Keep list payloads small.
- Avoid returning heavy fields unless explicitly needed.
- Fetch full job details in detail endpoints/pages only.

## Caching Strategy

- Set cache headers in API routes (`Cache-Control` and related CDN headers when needed).
- Use longer edge cache windows for low-volatility data (for example dropdowns or featured lists).
- Use shorter windows for highly dynamic endpoints.
- Cache detail lookup misses briefly so repeated crawls of removed or invalid job URLs do not repeatedly hit origin.
- Disable automatic Next.js prefetch for high-cardinality job detail links (`/jobs/[id]`). Job cards can render many unique URLs per page, and prefetching them can create unused ISR reads, edge requests, and detail API calls.
- Shared navigation (header, popular searches, landing cross-links) also uses `prefetch={false}`: those links render on every page view and each prefetch is a CDN request.
- Job list pages and fetches revalidate hourly (`3600`); the scraper adds jobs about once a day. Paid job publishing calls `revalidateTag('job-lists')` so new paid posts appear immediately.
- Vercel ISR cache is per deployment: every production deploy re-renders each of the ~8K job pages on its next request. Batch frontend deploys.
- Keep per-page identifiers out of CDN-cached API URLs (for example, similar jobs omit the current job ID and filter it client-side) so one cached response serves many pages.
- Put simple redirects in `next.config.mjs` `redirects()` and keep the middleware matcher narrow; both avoid function and middleware invocations.
- `app/robots.txt/route.ts` blocks crawlers that send no job seekers. Search engines and AI assistants stay allowed (the site publishes `llms.txt`).
- Avoid server-to-public-site self-fetches for hot paths. Job detail pages should use the shared server-only backend helper instead of calling `/api/get-job-details` through the deployed domain.

## Auth and Request Stability

- Avoid repeated user-dependent API requests during auth state transitions.
- Use debouncing and identity checks (`user.sub`) where repeated updates are observed.

## Practical Rule

When modifying an endpoint, decide and document:
- response shape (minimal/full)
- cache policy
- expected volatility
