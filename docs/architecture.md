# Architecture

## What This App Is

Sportsjobs frontend is a Next.js 14 job board focused on sports analytics, data science, software, and betting roles.

## Core Stack

- Next.js 14 (App Router)
- React 18
- Chakra UI for UI components and theming
- TypeScript across app, API routes, and libs
- Auth0 for authentication
- Stripe for checkout and subscriptions
- PostHog for analytics

## High-Level Structure

- `app/layout.tsx`: app shell, metadata, scripts, provider wrapper
- `app/providers.tsx`: Chakra, Auth0 user provider, PostHog provider
- `components/*`: reusable UI blocks
- `app/api/*`: server routes for data, auth/webhooks, subscriptions, utilities
- `lib/*`: frontend/server fetch helpers and app-level utilities
- `app/utils/*`: server-side helper modules (Auth0/Airtable integrations)

## Testimonials Surfaces

- Public submit page: `app/testimonial/page.tsx` (client page, query-param prefill via `useSearchParams` inside a `Suspense` boundary)
- API proxy: `app/api/testimonials/route.ts` (`GET` and `POST` proxy to backend `/testimonials`)
- Homepage wall: `components/TestimonialsPagedWallFromDB.tsx` (DB-backed paged wall with three larger cards per view; `TestimonialsWallFromDB.tsx` remains available as the older masonry layout)
- Signup marquee: `components/TestimonialsMarqueeFromDB.tsx` (DB-backed two-row scrolling marquee)

## Integration Style

- Job and listing data comes from a Python backend (Hetzner-hosted API).
- Next.js API routes shape and cache data for client/SSR consumption.
- Auth and payments stay in Next.js API routes integrated with Auth0 and Stripe.
- Free signup now leads to an authenticated `/dashboard` surface. Dashboard profile and onboarding calls go through `app/api/me` before reaching the backend.

## Design Direction (Current)

- Chakra-based component system
- Dark visual theme configured in `theme.ts`
- Responsive behavior through Chakra props

## Dashboard and Onboarding

- `/signup` is currently a pre-account onboarding funnel. It collects answers, shows contextual product education, previews matching jobs, stores answers/contact in browser `localStorage`, and syncs contact/funnel state through `app/api/signup-funnel`.
- After contact capture, `/signup` explains that SportsJobs is a paid product, records `paid_product_acknowledged_at`, and then shows Stripe checkout plan cards.
- The signup funnel hides the global app chrome through `app/providers.tsx`, shows only the logo, and syncs the active step to URL query slugs for browser Back/Forward behavior.
- Auth0 account creation is intentionally not triggered from the `/signup` funnel while backend `/users/ensure` stability is being revisited.
- `/dashboard` is the first logged-in product surface for free and premium users.
- `components/OnboardingModal.tsx` collects sports interests, job-search duration, hardest search problem, optional country, and target role interests.
- `POST /api/auth/signup`, the Auth0 callback, and `app/api/me` all ensure the Auth0 user exists in the backend, then `app/api/me` fetches profile state and persists onboarding answers.
- Premium upsell cards live inside the dashboard so future logo/color changes can be handled through Chakra/theme tokens instead of route logic changes.
