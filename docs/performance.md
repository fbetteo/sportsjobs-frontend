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

## Auth and Request Stability

- Avoid repeated user-dependent API requests during auth state transitions.
- Use debouncing and identity checks (`user.sub`) where repeated updates are observed.

## Practical Rule

When modifying an endpoint, decide and document:
- response shape (minimal/full)
- cache policy
- expected volatility
