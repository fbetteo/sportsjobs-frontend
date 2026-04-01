# Analytics and Attribution

## Purpose

This document describes the analytics and attribution behavior currently implemented in the repository.
It also documents what can be answered today, what is missing, and what should be implemented next.

## Current Stack

- Google Analytics 4 via gtag.js (Measurement ID: `G-YEWMS73Q97`)
- Google Ads conversion tracking via gtag.js (Conversion ID: `AW-11429228767`)
- PostHog (`posthog-js`) for product analytics pageview capture
- Promotekit script for affiliate referral capture (`window.promotekit_referral`)
- GA4 standard E-commerce and Lead generation events for monetization tracking

## Where Tracking Is Initialized

### Global scripts

- `app/layout.tsx`
  - Loads `https://www.googletagmanager.com/gtag/js?id=G-YEWMS73Q97`
  - Runs:
    - `gtag('config', 'G-YEWMS73Q97')`
    - `gtag('config', 'AW-11429228767')`
  - Loads `PromotekitScript`

### PostHog

- `app/providers.tsx`
  - `posthog.init(...)` with:
    - `person_profiles: 'identified_only'`
    - `capture_pageview: false`
  - Captures and persists attribution from URL/referrer on route changes
  - Manual pageview event capture on route/search-param changes:
    - `posthog.capture('$pageview', { '$current_url': url })`

### Shared analytics utility

- `lib/analyticsClient.ts`
  - Sends events to both GA4 (`gtag`) and PostHog
  - Keeps events cleanly formatted without custom UTM overriding (relies on GA4 native attribution)

## Event Inventory (Verified)

### 1) Newsletter conversion events

- `components/NewsletterSignupForm.tsx` & `NewsletterSignupPopup.tsx`
  - On submit:
    - Calls `/api/add-newsletter-signup`
    - Fires Google Ads conversion event
    - Fires standard GA4 event: `generate_lead` with `{ value: 0, currency: 'USD' }`

### 2) Payment conversion events

- `app/signup/success/page.tsx` & `app/post-job/success/page.tsx`
  - On page load:
    - Fires Google Ads conversion
    - Fires standard GA4 E-commerce event: `purchase` with `transaction_id` (Stripe session), `value`, and `currency`

### 3) Checkout started events

- `app/signup/page.tsx` & `app/post-job/page.tsx`
  - Before Stripe redirect:
    - Fires standard GA4 E-commerce event: `begin_checkout` with `value`, `currency`, and `items` array

### 4) Engagement events

- `components/FeaturedCompanies.tsx`
  - On card click:
    - `gtag('event', 'company_click', { ... })`
  - Properties include:
    - `company_name`, `company_slug`, `section`, `position`, `click_type`, `value`

- `components/JobFilter.tsx`
  - Emits `filters_changed` after the initial render on filter updates

- `components/JobCard.tsx`
  - Emits `job_card_click` with list type and position

- `components/HomeContent.tsx`
  - Emits `job_list_viewed` when jobs are rendered/refreshed

- `components/JobAnalyticsEvents.tsx` + `app/jobs/[id]/page.tsx`
  - Emits `job_detail_view` when job page loads
  - Emits `apply_click` for top and bottom apply buttons

### 5) Pageview event

- `app/providers.tsx`
  - On pathname/search params change:
    - `posthog.capture('$pageview', { '$current_url': url })`

## Attribution Flow (Current)

### Affiliate referral

1. Promotekit script loads and exposes `window.promotekit_referral`.
2. Checkout client sends this to backend session creation.
3. It's stored in Stripe metadata (`promotekit_referral`).

### GA4 Native Attribution

1. GA4's script natively parses UTM strings (`utm_source`, etc.) and Referrer URL on page load.
2. GA4 assigns a session to that traffic source automatically.
3. Conversion events (`generate_lead`, `begin_checkout`, `purchase`) are tied to the acquisition channel natively in GA4 dashboards.

## Data Destinations

- GA4 / Google Ads via gtag events (Conversion tracking, E-commerce, user acquisition)
- PostHog via `$pageview` and custom events from the shared client tracker
- Stripe metadata for affiliate tracking and fallback logging

## Known Limitations

1. Because conversions rely on client-side tracking (firing events on the `/success` page), ad-blockers can cause a slight discrepancy/drop-off compared to raw Stripe revenue.
2. Job funnel instrumentation exists, but event governance (naming ownership, required properties, QA checklist) is still pending.
4. PostHog now receives custom events via shared tracking utility, but dashboarding and event governance are still pending.
5. Substack flow includes `email` in query parameters (privacy and URL logging concern).
6. No explicit consent gating for analytics scripts in current implementation.

## Reporting Capability Matrix

### Question 1: How are people finding the site?

- Status: **Mostly Yes**
- Why:
  - GA4 can provide source/medium/referrer and landing behavior.
  - PostHog stores full page URL in `$current_url`.
  - Attribution is now captured and persisted to Stripe metadata, but backend reporting joins still need hardening.

### Question 2: What is the best channel in the last X days?

- Status: **Mostly Yes**
- Why:
  - Top-of-funnel channel trends are available in GA4.
  - Some conversions are tracked (newsletter, signup success, post-job success).
  - Channel-to-revenue attribution is enabled fully via native GA4 `purchase` and `begin_checkout` tracking.
  - Final confidence depends on Stripe-to-database reporting joins.

### Question 3: What are landing pages, and where do visitors come from?

- Status: **Mostly Yes**
- Why:
  - GA4 supports landing-page and acquisition views.
  - PostHog pageviews include query params.
  - Still limited by lack of standardized attribution model and event schema.

### Question 4: Where did paying users or checkout visitors come from?

- Status: **Yes**
- Why: Standard E-commerce GA4 events (`begin_checkout`, `purchase`) are implemented with value data. You can trace purchase events back to acquisition sources in the GA4 Monetization dashboards natively.

## Missing and Should Do (Prioritized)

### Must have

1. Validate attribution quality with test traffic (UTM, referrer, direct, affiliate).
2. For 100% precision regardless of ad-blockers, eventually consider moving GA4 standard E-commerce `purchase` dispatch to backend Stripe Webhook using Google Measurement Protocol (Advanced).

### High value behavior instrumentation

1. Add explicit event naming conventions and required event properties.
2. Add QA checks for events in staging (payload validation + destination validation).
3. Decide one primary analytics destination for decision reporting (GA4 for acquisition/conversions, PostHog for product behavior).

### Governance and privacy

1. Add consent management and gate analytics scripts until consent (where legally required).
2. Remove raw email from URL query parameters in outbound Substack URL; use safer handoff patterns.
3. Review console logs in client/server analytics paths and remove non-essential production logs.

## Minimal Dashboard Set To Add

1. Acquisition dashboard: sessions/users by source-medium-campaign + landing page.
2. Channel quality dashboard: channel -> job detail views -> apply clicks -> checkout started -> purchase.
3. Conversion attribution dashboard: payment count/revenue by source-medium-campaign and referral provider.
4. Newsletter dashboard: form vs popup performance and downstream conversion influence.

## File References For Current Behavior

- `app/layout.tsx`
- `app/providers.tsx`
- `lib/analyticsClient.ts`
- `components/PromotekitScript.tsx`
- `app/signup/page.tsx`
- `app/api/create-subscription/route.ts`
- `app/post-job/page.tsx`
- `app/api/create-job-posting/route.ts`
- `components/NewsletterSignupForm.tsx`
- `components/NewsletterSignupPopup.tsx`
- `app/signup/success/page.tsx`
- `app/post-job/success/page.tsx`
- `components/FeaturedCompanies.tsx`
- `components/JobFilter.tsx`
- `components/JobCard.tsx`
- `components/HomeContent.tsx`
- `components/JobAnalyticsEvents.tsx`
- `app/jobs/[id]/page.tsx`
- `app/api/add-newsletter-signup/route.ts`
- `app/api/job-webhook/route.ts`
- `app/api/subscribe-newsletter/route.ts`