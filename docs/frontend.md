# Frontend Rules

## Purpose

Use this guide for pages/components and UX changes.

## Defaults

- Build with Next.js App Router conventions.
- Use Chakra UI components and tokens first.
- Keep components reusable and separated by concern.
- Prefer simple, readable implementations.
- Use TypeScript where it helps correctness without adding unnecessary complexity.

## UI and Copy

- Keep colors and visual hierarchy consistent with the existing dark theme.
- Use responsive Chakra props for mobile/desktop behavior.
- Keep copy clear and outcome-focused (job seeker and recruiter clarity first).

## Component Patterns

- Reuse existing components in `components/` before adding new ones.
- Use memoization only when it solves a measured/render issue.
- Preserve useful comments that explain non-obvious logic.

## Data Fetching in Frontend Code

- Prefer calling local Next.js API routes from `lib/*` helpers.
- Use `fetch`; do not introduce axios for new frontend/API code.
- Keep list pages minimal and fetch heavy details only when needed.
- Public SEO listing pages may server-fetch initial jobs through `lib/fetchJobsServer` and pass them into a client component for presentation.

## Routing and IDs

- Job pages may use slug-first IDs with fallback numeric handling.
- Use existing helpers (for example `utils/jobIdEncoder.ts`) when touching ID formats.

## SEO Listing Pages

- `/sports-analytics-internships` targets the sports analytics internships query with the latest 10 server-rendered internship listings.
- Keep this page focused on analytics-relevant student roles and preserve the live openings module, role taxonomy, requirements, FAQ, and newsletter CTA.
- Link search-intent pages from stable navigation surfaces. The internships page is linked from the footer and the homepage `PopularSearches` module.

## Testimonials UX (Current)

- Submission page is `app/testimonial/page.tsx`.
- Form keeps fields minimal: name, role/company, testimonial, optional LinkedIn, optional email, rating (1-5), plus honeypot field.
- Email prefill is supported through `?email=` query params.
- Any component using `useSearchParams` in app pages must be rendered behind a `Suspense` boundary (current implementation does this in testimonial page).
- DB-driven testimonial displays:
	- `components/TestimonialsWallFromDB.tsx` for wall layout.
	- `components/TestimonialsMarqueeFromDB.tsx` for marquee layout (used on signup page).
