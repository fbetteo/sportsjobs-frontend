---
applyTo: "**"
---

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
- **State Optimization**: Use `useRef` to track `user.sub` changes and prevent unnecessary API calls during Auth0 state updates

### Subscription System
- **Pricing Tiers**: Defined in `pricingPlans.ts` (lifetime, yearly, monthly)
- **Stripe Integration**: Payment flows through `/api/create-subscription`
- **Auth0 Metadata**: User subscription status stored in Auth0 user metadata

### Job Management
- **ID Encoding**: Numeric IDs encoded with random suffixes for URLs
- **Filtering**: Complex filter system with location, seniority, industry, sport
- **Featured Jobs**: Separate API endpoint and components for promoted listings

### Data Transfer Optimization (Vercel Edge Network)
- **Problem**: Heavy API responses (300+ jobs with descriptions) caused Vercel limits
- **Solution Pattern**: Dual API modes - minimal for lists, full for details
- **API Parameter**: Use `?full=true` to get complete job objects with descriptions/skills
- **Default Behavior**: List APIs return minimal job data without heavy fields
- **Implementation**: 
  ```typescript
  // Fetch functions accept includeFullDetails parameter (defaults to false)
  fetchJobs(limit, filters, includeFullDetails = false)
  fetchJobsFeatured(limit, includeFullDetails = false)
  ```
- **Data Reduction**: 75%+ reduction by excluding `description` and `skills` from list views
- **User State Optimization**: Track `user.sub` changes to prevent unnecessary Auth0 refetches
- **Debouncing**: 300ms timeouts prevent rapid-fire API calls during Auth0 state updates
- **Cache Strategy**: SessionStorage with 3-hour expiration, invalidates only on real user changes

### Performance Patterns
- **Auth0 State Management**: Use `useRef` to track previous user state and prevent redundant API calls
- **Request Debouncing**: Implement timeouts for user-dependent effects to handle Auth0's multiple state updates
- **Data Fetching Strategy**: 
  - Landing page: Minimal data (no descriptions)
  - Job details page: Full data via `/api/get-job-details`
  - Featured vs regular jobs: Separate endpoints with same optimization pattern
- **Vercel Limits**: Monitor Fast Data Transfer (outgoing > incoming due to user multiplier effect)

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

## Data Transfer Best Practices
- **Minimal List Views**: Never include heavy fields (`description`, `skills`) in list APIs
- **Progressive Enhancement**: Load minimal data first, full details on demand
- **Auth0 Optimization**: Check `user.sub` changes rather than relying on object equality
- **Request Patterns**: 
  - Debounce user-dependent API calls by 300ms
  - Use cleanup functions in useEffect to cancel pending timeouts
  - Track in-flight requests to prevent duplicates
- **API Design**: Default to minimal data, require explicit `?full=true` for complete objects
- **Caching Strategy**: Use sessionStorage for temporary data, localStorage for dropdown options

## Implemented Optimizations

### User State Stability Pattern
```tsx
// Track previous user to prevent unnecessary refetches
const prevUserRef = useRef<typeof user>(undefined);
const userChanged = user?.sub !== prevUserRef.current?.sub;

// Only fetch when user actually changes
if (userChanged || !prevUserRef.current) {
    fetchData();
    prevUserRef.current = user;
}
```

### Request Debouncing Pattern
```tsx
// Debounce timeout refs
const timeoutRef = useRef<NodeJS.Timeout>();

useEffect(() => {
    // Clear existing timeout
    if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
    }
    
    // Debounce API calls by 300ms
    timeoutRef.current = setTimeout(() => {
        if (userChanged) {
            fetchData();
        }
    }, 300);
    
    // Cleanup timeout on unmount
    return () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    };
}, [user, userChanged]);
```

### Minimal Data API Pattern
```tsx
// API routes check for full details parameter
const includeFullDetails = searchParams.get('full') === 'true';

const jobs = records.map((record: any) => {
    const baseJob = { /* minimal fields */ };
    
    // Only include heavy fields if specifically requested
    if (includeFullDetails) {
        return { ...baseJob, description: record.description, skills: record.skills };
    }
    return baseJob;
});
```

## Troubleshooting Vercel Limits
- **Fast Data Transfer**: Outgoing traffic (Vercel → users) is usually the bottleneck
- **Root Causes**: Large API responses × multiple users = exponential data transfer
- **Monitoring**: Check response sizes in Network tab, multiply by user count
- **Outgoing vs Incoming**: 
  - Outgoing (Vercel → Users): Job data, static assets, API responses (biggest concern)
  - Incoming (External → Vercel): Python backend calls, Auth0 API calls, webhooks
  - Ratio: Often 20:1 outgoing vs incoming due to user multiplication effect
- **Quick Fixes**: 
  1. Remove unused fields from API responses (75% reduction possible)
  2. Add user state stability checks (60-80% fewer redundant requests)
  3. Implement request debouncing (prevents rapid-fire API calls)
  4. Reduce job limits for authenticated users if needed
  5. Use minimal data for list views, full data for detail views

## Key Learnings
- **Auth0 State Updates**: Can trigger multiple useEffect calls during authentication flow
- **JobCard Description**: Heavy field that's passed but never displayed in list views
- **Data Multiplication**: 1 backend call = N user responses (where N = number of users)
- **Session Storage**: Better than localStorage for temporary data with TTL
- **Component Optimization**: Make heavy fields optional in TypeScript interfaces
- **API Flexibility**: Design APIs to serve both minimal and full data modes
