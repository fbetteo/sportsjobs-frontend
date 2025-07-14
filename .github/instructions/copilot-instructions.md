# Copilot Instructions for Sportsjobs Frontend

## Project Overview
This is a **Next.js 14 sports job board** built with Chakra UI and TypeScript. It connects sports professionals with opportunities in analytics, data science, software development, and betting. The app integrates with Auth0, Stripe, Airtable, and a Python backend API.

## Architecture Patterns

### Core Stack
- **Next.js 14 App Router** with TypeScript
- **Chakra UI** for components with dark theme (`theme.ts`)
- **Auth0** for authentication (`@auth0/nextjs-auth0`)
- **Stripe** for payments with subscription tiers (`pricingPlans.ts`)
- **PostHog** for analytics (configured in `providers.tsx`)

### Global Structure
- **Layout**: `app/layout.tsx` sets up global providers, metadata, and analytics
- **Providers**: `app/providers.tsx` wraps app with ChakraProvider, UserProvider, PostHogProvider
- **Components**: All components in `/components` use Chakra UI patterns
- **Theme**: Black background, white text theme in `theme.ts`

### Data Flow Patterns
1. **API Routes**: All backend calls through `/app/api/` endpoints
2. **Lib Functions**: Data fetching logic in `/lib/` (e.g., `fetchJobs.ts`)
3. **No Axios**: Use `fetch` API exclusively for HTTP requests
4. **Dynamic Routing**: Job details use encoded IDs (`utils/jobIdEncoder.ts`)

## Key Development Conventions

### Component Patterns
```tsx
// Use memo for performance-critical components (see Header.tsx)
const Component = memo(() => (
  <ChakraComponent colorScheme="purple" bg="black">
    Content
  </ChakraComponent>
));
Component.displayName = 'Component';
```

### Python Backend Integration
- **Primary Data Source**: Hetzner-hosted Python API server on port 8000
- **Authentication**: All Python API calls require `Authorization: Bearer ${HEADER_AUTHORIZATION}` header
- **API Pattern**: POST requests to `/jobs` endpoint with structured filter objects
- **Request Format**: 
  ```json
  {
    "limit": 10,
    "filters": { "country": "US", "seniority": "Senior" },
    "sort_by": "creation_date",
    "sort_direction": "desc"
  }
  ```
- **Migration Pattern**: Commented Airtable code shows legacy data source being phased out
- **Environment Variables**: `HETZNER_POSTGRES_HOST` and `HEADER_AUTHORIZATION` required

### API Integration
- **Base URL Logic**: Environment-aware URLs in lib functions (`baseUrl` pattern)
- **Hybrid Architecture**: Python backend for job data, Next.js APIs for auth/payments/webhooks
- **Local APIs**: Next.js API routes handle Stripe, Auth0, and data transformation
- **Error Handling**: Graceful fallbacks with empty arrays/objects, HTTP status validation

### Authentication Flow (Auth0)
- **User Provider**: `@auth0/nextjs-auth0/client` wraps app in `providers.tsx`
- **Auth Routes**: Built-in Auth0 routes at `/api/auth/[auth0]` (login, logout, callback)
- **User Access**: Use `useUser()` hook for client-side authentication state
- **Protected Routes**: Manual protection using `useUser()` checks, no automatic redirects
- **Management API**: Server-side Auth0 management via `utils/auth0.ts` with client credentials flow
- **User Creation**: `createAuth0User()` for programmatic user registration
- **Metadata Storage**: User subscription status stored in Auth0 user metadata
- **Environment Setup**: Requires `AUTH0_DOMAIN`, `AUTH0_CLIENT_ID`, `AUTH0_CLIENT_SECRET`, `AUTH0_BASE_URL`, `AUTH0_SECRET`

### Subscription System
- **Pricing Tiers**: Defined in `pricingPlans.ts` (lifetime, yearly, monthly)
- **Stripe Integration**: Payment flows through `/api/create-subscription`
- **Auth0 Metadata**: User subscription status stored in Auth0 user metadata

### Job Management
- **ID Encoding**: Numeric IDs encoded with random suffixes for URLs
- **Filtering**: Complex filter system with location, seniority, industry, sport
- **Featured Jobs**: Separate API endpoint and components for promoted listings

## Critical Commands

### Development
```bash
npm run dev          # Start development server
npm run build        # Production build
npm run lint         # ESLint check
```

### Environment Variables
Required for full functionality:
- `NEXT_PUBLIC_POSTHOG_KEY` - Analytics
- `AUTH0_SECRET`, `AUTH0_BASE_URL`, etc. - Authentication  
- `STRIPE_SECRET_KEY` - Payments
- `AIRTABLE_TOKEN` - Job data (legacy, being phased out)

## File Naming Conventions
- **Pages**: `page.tsx` in app router directories
- **Components**: PascalCase `.tsx` files in `/components`
- **Utilities**: camelCase `.ts` files in `/utils`
- **API Routes**: `route.ts` in `/app/api/[endpoint]`

## Common Patterns to Follow
- Use Chakra UI's responsive props: `display={{ base: 'none', md: 'block' }}`
- Implement proper TypeScript interfaces for API responses
- Handle loading states with Chakra's `Spinner` or skeleton components
- Use Next.js `Image` component for optimized images
- Implement proper SEO with metadata in page components
