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

## Integration Style

- Job and listing data comes from a Python backend (Hetzner-hosted API).
- Next.js API routes shape and cache data for client/SSR consumption.
- Auth and payments stay in Next.js API routes integrated with Auth0 and Stripe.

## Design Direction (Current)

- Chakra-based component system
- Dark visual theme configured in `theme.ts`
- Responsive behavior through Chakra props
