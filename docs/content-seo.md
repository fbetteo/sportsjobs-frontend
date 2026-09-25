# Content and SEO

## Purpose

Use this guide for metadata, blog/resources content, indexing behavior, and machine-readable discovery pages.

## Current SEO Surfaces

- Global metadata in app shell (`app/layout.tsx`)
- Route/page metadata via Next.js metadata APIs
- Dynamic sitemap route (`app/sitemap/route.ts`)
- Dynamic robots route (`app/robots.txt/route.ts`)
- LLM discovery text route (`app/llms.txt/route.ts`)

## Content Areas

- Blog listing and detail pages
- Resources pages
- Company and job detail pages
- Search-intent landing pages, including the editorial pages below and the job-category collection pages listed in `lib/jobLandingPages.ts`

## Conventions

- Keep metadata aligned with page intent and search intent.
- Keep homepage/global title metadata query-first, with the brand at the end.
- Keep canonical URL/domain usage consistent (`https://www.sportsjobs.online`).
- Escape unsafe XML characters when generating sitemap payloads.
- Keep robots and sitemap cache headers explicit and conservative.

## Indexing Strategy

- Include high-value static pages plus dynamic job/company/blog URLs in sitemap.
- Include job URLs in the sitemap only during their two-calendar-month `JobPosting` lifetime; expired archive pages remain indexable but leave the job sitemap and are submitted to the Indexing API as `URL_UPDATED`.
- Include index-worthy search-intent landing pages in the static sitemap list.
- Exclude/internal-limit crawl for non-indexable API surfaces.
- Use robots directives intentionally for known aggressive crawlers.

## Search-Intent Landing Pages

- `/sports-analytics-internships` uses page-level metadata, FAQ structured data, and canonical URL `https://www.sportsjobs.online/sports-analytics-internships`.
- The page should keep the latest 10 live or curated openings before editorial guidance so it matches job-board search intent.
- `/sports-analytics-salaries` uses page-level metadata, Article structured data, FAQ structured data, and canonical URL `https://www.sportsjobs.online/sports-analytics-salaries`.
- Salary pages should include a methodology/source section because compensation claims need higher trust than generic editorial content.
- `/teamwork-online-sports-analytics-jobs` targets brand-comparison intent around TeamWork Online and should keep a balanced explainer, a direct comparison block, FAQ structured data, and a live analytics-jobs module tied to SportsJobs inventory.
- `/resources/interview-questions/data-scientist` targets sports data scientist interview-prep intent with Article structured data, FAQ structured data, and canonical URL `https://www.sportsjobs.online/resources/interview-questions/data-scientist`.
- `/job-searches` is the internal-link hub for durable job-category collections. Category pages use the shared `JobLandingPage` implementation and their individual content/filter configuration from `lib/jobLandingPages.ts`.
- Job-category pages must keep live matching jobs ahead of the editorial guidance, provide a useful empty state, use canonical metadata plus CollectionPage/FAQ structured data, and link to related searches. Avoid adding a category when there is no distinct search intent or useful content beyond a keyword variation.
- Give public search-intent pages at least one sitewide internal link and one contextual homepage link when the page is strategically important.

## Practical Rule

When adding a new public page type, update:
1. metadata strategy for that page type
2. sitemap inclusion logic (if index-worthy)
3. robots rules only if crawl behavior requires changes
