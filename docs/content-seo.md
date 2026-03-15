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

## Conventions

- Keep metadata aligned with page intent and search intent.
- Keep canonical URL/domain usage consistent (`https://www.sportsjobs.online`).
- Escape unsafe XML characters when generating sitemap payloads.
- Keep robots and sitemap cache headers explicit and conservative.

## Indexing Strategy

- Include high-value static pages plus dynamic job/company/blog URLs in sitemap.
- Exclude/internal-limit crawl for non-indexable API surfaces.
- Use robots directives intentionally for known aggressive crawlers.

## Practical Rule

When adding a new public page type, update:
1. metadata strategy for that page type
2. sitemap inclusion logic (if index-worthy)
3. robots rules only if crawl behavior requires changes
