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

## Signup and Dashboard UX

- `/signup` is currently a pre-account onboarding funnel, not a direct Auth0 account creation page.
- Signup funnel answers and contact capture are stored in browser `localStorage` under `sportsjobs_signup_funnel`.
- Contact plus answers sync through `app/api/signup-funnel` into backend users table fields documented in `docs/backend-refactor-2026.md`.
- The paid-product explanation page must record `paid_product_acknowledged_at` through `PATCH /api/signup-funnel` when the user clicks `That's fair`.
- `/signup` uses a focused shell: hide the global header, footer, and newsletter popup, and show only the logo above the funnel.
- Funnel steps use URL query slugs such as `/signup?step=sports`; browser Back/Forward should move between steps and restore state from `localStorage`.
- Question options should be vertical lists, not multi-column grids.
- Funnel insight steps should use concise icon bullet rows instead of small explanatory cards.
- The country step should keep `Skip for now` visible as a secondary action and use the ordered country selector with United States and United Kingdom first.
- The signup progress bar should show only through the country step; job preview, contact capture, paid-product explanation, and pricing screens do not show the bar.
- Role/job-type onboarding is paused for now. Keep role fields as empty/default values in payloads for backend compatibility.
- The paid-product explanation screen should stay simple: value bullets, no coupon messaging, and the `That's fair` acknowledgement CTA.
- The pricing screen should feel like a focused conversion flow with before/after comparison, a limited-time 25% promo code, selected-plan checkout, testimonials, small FAQ, repeated CTA, and clear checkout actions.
- Promo messaging should not claim Stripe has auto-applied a discount unless `app/api/create-subscription` is also updated to pass a Stripe coupon/promotion code ID.
- Signup/onboarding accents should use the shared purple token constants in `lib/uiTokens.ts`; avoid reintroducing the pale green/teal treatment.
- Avoid visible `free` language in signup/onboarding CTAs or labels.
- Do not call backend `/users/ensure` from the funnel steps; account creation should be reconnected in a later backend-safe pass.
- Authenticated users should land on `/dashboard` after signup/login.
- Dashboard feature surfaces should work for free users and expose premium upgrade CTAs without blocking basic account access.
- Onboarding questions live in `components/OnboardingModal.tsx` and should save through `/api/me`; do not store onboarding answers only in local state/local storage.
- Onboarding fixed-choice answers should use stable option IDs in the payload, not display labels.
- Keep new dashboard UI token-based and avoid hard-coding a future brand palette so the planned logo/color refresh can happen mostly in theme/component styling.

## Subscription Cancellation UX

- `components/ConfirmCancelModal.tsx` collects optional cancellation feedback before calling the existing cancellation API.
- Keep cancellation feedback optional and never block cancellation because the reason field is empty.
- Use a loading state on the final cancellation button and disable duplicate submits while the request is running.
- Cancellation copy should explain that Stripe cancellation is scheduled while the free account remains active; premium access is controlled by subscription entitlement state.

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
- `/sports-analytics-salaries` targets the sports analytics salaries query with benchmark ranges, role/experience tables, location and employer-type comparisons, methodology, and FAQ.
- `/teamwork-online-sports-analytics-jobs` targets brand-comparison intent and should preserve the balanced TeamWork Online explainer, strengths/weaknesses sections, comparison table, inventory snapshot, FAQ, and newsletter CTA.
- Link search-intent pages from stable navigation surfaces. The internships and salaries pages are linked from the footer and the homepage `PopularSearches` module.
- `/resources/interview-questions/data-scientist` is a public interview-prep resource. Keep it in the existing Resources visual system: dark Chakra surfaces, teal/purple accents, concise prep cards, and expandable question sections.

## Testimonials UX (Current)

- Submission page is `app/testimonial/page.tsx`.
- Form keeps fields minimal: name, role/company, testimonial, optional LinkedIn, optional email, rating (1-5), plus honeypot field.
- Email prefill is supported through `?email=` query params.
- Any component using `useSearchParams` in app pages must be rendered behind a `Suspense` boundary (current implementation does this in testimonial page).
- DB-driven testimonial displays:
	- `components/TestimonialsWallFromDB.tsx` for wall layout.
	- `components/TestimonialsMarqueeFromDB.tsx` for marquee layout (used on signup page).
