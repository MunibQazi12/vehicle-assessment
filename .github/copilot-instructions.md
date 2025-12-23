# Dealer Tower SRP - AI Coding Agent Instructions

## Project Overview

Multi-tenant Search Results Page (SRP) for automotive dealership vehicle inventory using Next.js 16 App Router, React 19, TypeScript, and Tailwind CSS 4. Serves multiple dealerships via hostname-based tenant resolution with intelligent caching and tag-based invalidation.

**Current State**: Production-ready architecture with proxy-based tenant detection, API integration with Dealer Tower backend, SEO-friendly URL routing (`/new-vehicles/`, `/used-vehicles/`), and dealer-specific customization system (components, pages, assets). Caching layer operational with webhook invalidation.

## Architecture Principles

### Multi-Tenancy (Hostname-Based)

- Each dealership identified by hostname (e.g., `www.nissanofportland.com`)
- Proxy file (`proxy.ts`) extracts hostname from headers and resolves dealer UUID via API
- Environment variable `NEXTJS_APP_HOSTNAME` overrides hostname detection for local dev
- **Dealer UUID from API** used as folder identifier in `dealers/{uuid}/` structure
- Tenant context flows: Proxy → Headers (`x-tenant-hostname`, `x-tenant-dealer-id`) → Server/Client Components

**Security**: Next.js API routes (`/api/*`) MUST read hostname and dealer ID from environment variables (`NEXTJS_APP_HOSTNAME`, `NEXTJS_APP_DEALER_ID`) only. Never accept these values from request parameters (query, body, or headers from client) to prevent tenant injection attacks. The CMS admin panel tenant selector is locked to `NEXTJS_APP_DEALER_ID` and cannot be changed by users. See [Security Documentation](docs/core-concepts/security.md) for complete security patterns and attack prevention.

### Caching Strategy

Cache keys: `{hostname}:{path}:{bodyHash}` where bodyHash is first 12 chars of SHA-256 hash of sorted request body JSON.

Cache tags (apply all):

- `hostname:{normalized_hostname}` - invalidate all for a hostname
- `dealer:{dealer_identifier}` - invalidate by dealer ID
- `srp:vehicles` - all vehicle data
- `srp:filters` - all filter data

TTL: 6 hours (21600s) as fallback. Primary invalidation via webhook POST to `/api/revalidate/` with `x-revalidation-secret` header.

**Important**: All API routes require trailing slashes due to `trailingSlash: true` in `next.config.ts`. Internal API calls must use `/api/vehicles/`, `/api/revalidate/`, etc.

### API Integration

Base URL: `https://api.dealertower.com/public/{hostname}`

Key endpoints (all POST):

- `/v2/inventory/vehicles/srp/rows` - paginated vehicle inventory
- `/v2/inventory/vehicles/srp/filters` - available filters + selected state
- `/v2/inventory/vehicles/srp/filters/{filter_name}` - values for specific filter

**CRITICAL**: All API calls MUST use the `cachedFetch` helper from `packages/lib/api/client.ts`. Never use raw `fetch()` for Dealer Tower API calls. See `docs/api-reference/api-patterns.md` for complete API request standards and patterns.

All API requests follow unified patterns with proper caching, retry logic, error handling, and logging. See complete request/response schemas in `docs/api-reference/overview.md`.

## Project Structure & Conventions

```
app/
  (dealer)/[page]/page.tsx       # Dynamic dealer-specific pages
  (srp)/
    new-vehicles/[[...slug]]/page.tsx   # New vehicles SRP
    used-vehicles/[[...slug]]/page.tsx  # Used vehicles SRP
  api/
    assets/[...path]/route.ts    # Dealer asset serving
    revalidate/route.ts          # Cache invalidation webhook
  layout.tsx                     # Root layout with tenant provider
dealers/                         # Dealer-specific content
  {dealer-id}/                   # UUID from API (e.g., 494a1788-0619-4a53-99c1-1c9f9b2e8fcc)
    components/                  # Custom React components
      Header.tsx                 # Custom header (optional)
    pages/                       # Custom page components
      AboutPage.tsx              # Custom pages (optional)
    public/                      # Public assets
      logo.png                   # Logo (400x150px)
      favicon.ico                # Favicon (32x32px)
packages/                        # Common code shared across all dealers
  components/                    # Shared React components
    srp/
      SRPSharedPage.tsx          # Shared SRP logic for new/used routes
      VehicleGrid.tsx            # Server Component wrapper
      VehicleCard.tsx            # Client Component, hydrated
      FiltersSidebar.tsx         # Server Component with client controls
      InfiniteScroll.tsx         # Client Component (Intersection Observer)
    layout/
      Header.tsx                 # Default header component
      Footer.tsx                 # Default footer component
  lib/                           # Shared utility functions
    api/
      client.ts                  # Base fetch with cache logic
      dealer.ts                  # Dealer info API (fetchWebsiteInformation returns both info + scripts)
      srp.ts                     # SRP-specific API functions
    cache/
      keys.ts                    # generateCacheKey(), generateSRPCacheKey()
      tags.ts                    # generateCacheTags(), getInvalidationTags()
    dealers/
      loader.ts                  # Dynamic component/page loader (uses NEXTJS_APP_DEALER_ID env)
      assets.ts                  # getDealerAssetUrl() helper
    tenant/
      context.tsx                # TenantProvider, useTenant() hook
      server-context.ts          # getTenantContext(), getTenantHostname(), getTenantDealerId()
    url/
      parser.ts                  # parseSlug() - URL to filters
      builder.ts                 # buildUrl() - filters to URL
  types/                         # Shared TypeScript types
    api.ts                       # API request/response types
    vehicle.ts                   # Vehicle data types
    filters.ts                   # Filter state types
    tenant.ts                    # Tenant context types
```

**Path aliases**:

- `@dealertower/*` for shared code (maps to `./packages/*`)
- `@dealers/*` for dealer-specific content (maps to `./dealers/*`)

**Documentation**: All `.md` documentation files must be placed in the `docs/` directory. Do not create README or documentation files in feature directories (like `dealers/`, `components/`, etc.).

## Next.js 16 Documentation Reference (CRITICAL)

**ALWAYS consult `docs/next-js/` documentation before implementing any feature.** These files contain authoritative Next.js 16 patterns and conventions that MUST be followed. The documentation is organized sequentially - read earlier files first to understand foundational concepts.

### Documentation Categories & When to Read

#### 🏗️ **Setup & Structure** (Read First for New Features)

- **`01-installation.mdx`** - Project initialization, dependencies, folder structure
  - When: Starting new projects, understanding project organization
- **`02-project-structure.mdx`** - App Router architecture, file conventions, route groups
  - When: Creating new routes, organizing app structure, understanding special files
- **`03-layouts-and-pages.mdx`** - Layout nesting, page components, route parameters
  - When: Building page hierarchies, shared layouts, nested routing

#### 🧩 **Component Architecture** (Read Before Building Components)

- **`05-server-and-client-components.mdx`** - Server vs Client Components, "use client" directive, composition patterns
  - When: **EVERY TIME you create a component** - determines rendering strategy
  - Critical: Default is Server Component, only use Client when needed (interactivity, hooks, browser APIs)
- **`04-linking-and-navigating.mdx`** - `<Link>`, `useRouter()`, programmatic navigation, prefetching
  - When: Implementing navigation, transitions between routes

#### 💾 **Data & Caching** (Read Before Any API/Data Work)

- **`07-fetching-data.mdx`** - Server-side data fetching, `fetch()` API, request memoization, parallel/sequential patterns
  - When: **REQUIRED reading before fetching any data** - covers patterns, caching, error handling
- **`09-caching-and-revalidating.mdx`** - Cache strategies, revalidation, `revalidateTag()`, `revalidatePath()`, opt-out patterns
  - When: Implementing cache invalidation, webhooks, dynamic data requirements
- **`06-cache-components.mdx`** - Component-level caching with React `cache()`
  - When: Deduplicating requests within render tree, optimizing repeated calls
- **`08-updating-data.mdx`** - Server Actions, mutations, form handling, optimistic updates
  - When: Building forms, POST/PUT/DELETE operations, user interactions

#### 🎨 **Styling & Assets** (Read When Working on UI)

- **`11-css.mdx`** - CSS modules, Tailwind CSS, global styles, CSS-in-JS
  - When: Adding styles, configuring Tailwind, organizing CSS
- **`12-images.mdx`** - `<Image>` component, optimization, responsive images, `priority` prop
  - When: Adding images, optimizing performance, handling dealer assets
- **`13-fonts.mdx`** - `next/font`, font optimization, custom fonts, font loading strategies
  - When: Adding custom fonts, optimizing typography

#### 🔧 **Advanced Features** (Reference as Needed)

- **`15-route-handlers.mdx`** - API routes, request/response handling, streaming, cookies, headers
  - When: Creating `/api/*` endpoints, webhooks, external integrations
- **`16-proxy.mdx`** - Proxy configuration (replaces middleware in Next.js 16), hostname resolution, header injection
  - When: **CRITICAL for multi-tenancy** - modifying tenant detection, proxy logic
- **`14-metadata-and-og-images.mdx`** - SEO metadata, Open Graph, dynamic metadata generation
  - When: Implementing SEO, social sharing, meta tags
- **`10-error-handling.mdx`** - Error boundaries, `error.tsx`, `global-error.tsx`, `not-found.tsx`
  - When: Handling errors, 404 pages, error recovery

#### 🚀 **Deployment** (Read Before Production)

- **`17-deploying.mdx`** - Vercel deployment, environment variables, build optimization
  - When: Preparing for deployment, configuring production environment
- **`18-upgrading.mdx`** - Migration guides, breaking changes, upgrade strategies
  - When: Upgrading Next.js versions, addressing deprecations

### Reading Priority by Task Type

**Creating a new page:**

1. `02-project-structure.mdx` (route conventions)
2. `03-layouts-and-pages.mdx` (page patterns)
3. `05-server-and-client-components.mdx` (component strategy)
4. `07-fetching-data.mdx` (data loading)

**Building interactive components:**

1. `05-server-and-client-components.mdx` (composition patterns)
2. `04-linking-and-navigating.mdx` (if navigation involved)
3. `08-updating-data.mdx` (if forms/mutations involved)

**Implementing API/data fetching:**

1. `07-fetching-data.mdx` (MANDATORY - covers all patterns)
2. `09-caching-and-revalidating.mdx` (cache strategy)
3. `15-route-handlers.mdx` (if creating API routes)

**Working on multi-tenancy/proxy:**

1. `16-proxy.mdx` (CRITICAL - proxy configuration)
2. `15-route-handlers.mdx` (API security patterns)

**Performance optimization:**

1. `09-caching-and-revalidating.mdx` (caching)
2. `12-images.mdx` (image optimization)
3. `06-cache-components.mdx` (request deduplication)

### Documentation Hierarchy

```
docs/
  next-js/              ← Next.js 16 framework patterns (READ FIRST)
  core-concepts/        ← Project architecture (multi-tenancy, caching)
  api-reference/        ← Dealer Tower API schemas
  features/             ← Feature-specific implementation guides
  dealer-customization/ ← Dealer customization system
  deployment/           ← Production deployment
  payload-cms/          ← Payload CMS integration and configuration
```

**Rule**: When Next.js framework behavior is unclear, consult `docs/next-js/` BEFORE implementing. When project-specific patterns (multi-tenancy, dealer customization) are needed, consult other `docs/` categories.

## Implementation Patterns

### Server Components (Default)

- Fetch data directly in Server Components using `lib/api` functions
- Access tenant context via `getTenantContext()` from `@dealertower/lib/tenant/server-context`
- Example:

```tsx
// app/(srp)/new-vehicles/[[...slug]]/page.tsx
import { getTenantContext } from "@dealertower/lib/tenant/server-context";
import { fetchSRPRows } from "@dealertower/lib/api/srp";

export default async function NewVehiclesPage() {
  const { hostname } = await getTenantContext();

  const data = await fetchSRPRows(hostname, { page: 1 }, hostname);
  return <VehicleGrid vehicles={data.vehicles} />;
}
```

### Client Components (Mark with "use client")

- Access tenant via `useTenant()` hook from `lib/tenant/context.tsx`
- Use for interactive features: filters, sorting, infinite scroll
- **NEVER** send hostname to Next.js API routes - these are read from environment variables on the server
- Client-side fetches to Next.js API routes (`/api/*`) should only send filter/data parameters
- Example:

```tsx
"use client";
import { useTenant } from "@dealertower/lib/tenant/context";

export function FiltersSidebar() {
  const { hostname } = useTenant();
  // Use tenant info for display purposes only
  // Never include in API calls to /api/* routes

  // Correct: Only send filter data
  await fetch("/api/srp/vehicles/", {
    method: "POST",
    body: JSON.stringify({ filters, page, sortBy }),
  });
}
```

### Proxy Configuration (Next.js 16+)

Implemented in `proxy.ts` (replaces `middleware.ts`):

- Handles session cookie management for CSRF protection
- Matcher: `/((?!api|_next/static|_next/image|favicon.ico).*)` - runs on all routes except static assets and API routes

**Note**: Tenant resolution is NOT handled in the proxy. Use `getTenantContext()` from `@dealertower/lib/tenant/server-context` instead.

### Caching Implementation

Use `fetch()` with Next.js cache options (see `lib/api/client.ts`):

```tsx
fetch(url, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
  next: {
    revalidate: 21600, // 6 hours (CACHE_TTL from lib/cache/constants.ts)
    tags: ["hostname:dealer-abc.com", "dealer:dealer-abc", "srp:vehicles"],
  },
});
```

Webhook endpoint in `app/api/revalidate/route.ts`:

- Validates `x-revalidation-secret` header against `process.env.REVALIDATION_SECRET`
- Accepts `{ hostname?, dealer_identifier?, tags? }`
- Uses `getInvalidationTagsFromBody()` from `lib/cache/tags.ts` to generate tags
- Calls `revalidateTag(tag, '/')` for each tag (note: second param required for Next.js 16)

**Cache logging**: API client logs request path, hostname, status, and timing to console in format `[API] {path} - {hostname/status} ({ms}ms)`

## TypeScript Conventions

- Strict mode enabled
- Define API types in `types/api.ts`, vehicle types in `types/vehicle.ts`, filter types in `types/filters.ts`
- Use interface types from docs (e.g., `SRPRowsRequest`, `SRPRowsResponse`, `SRPVehicle`)
- Export types from `types/index.ts` for centralized imports
- Import types using `@dealertower/types/*` path alias

## URL Architecture (Critical Business Logic)

**SEO-friendly URL structure**: `/{condition}/{make}/{model}/?query_params`

### Condition Filter Business Rules

These are **complex and non-obvious** - review `docs/features/srp/condition-rules.md` carefully:

- Used vehicles dataset **always includes** certified vehicles (backend constraint)
- Selecting "Pre-Owned (used)" auto-checks and **disables** "Certified" checkbox
- URL `/used-vehicles` → filters: `['used', 'certified']` (both)
- URL `/used-vehicles/certified` → filters: `['certified']` (certified-only, special case)
- Deselecting "Pre-Owned" keeps "Certified" checked but **enables** toggle

### URL Parsing and Building

- Parser: `lib/url/parser.ts` → `parseSlug(slug: string[]): ParsedSlug`
- Builder: `lib/url/builder.ts` → `buildUrl(filters, sortBy?, order?): BuiltUrl`
- Special handling for certified-after-used path segment (means certified-only, not used+certified)
- Test suite in `lib/url/__tests__/url.test.ts` - run with `npm test`
- See `docs/core-concepts/url-routing.md` for complete rules and examples

## Styling with Tailwind CSS 4

- Use Tailwind utility classes (v4 PostCSS plugin configured)
- Define custom colors/tokens in `app/globals.css` using CSS variables
- Responsive: mobile-first breakpoints (`sm:`, `md:`, `lg:`)
- Dark mode support via `dark:` variant

## Performance Requirements

- **Target**: Google PageSpeed 90+, GTMetrix A, Core Web Vitals passing
- Use Next.js `<Image>` component with `priority` for above-fold images
- Implement skeleton loaders during Suspense boundaries (see `components/skeletons/`)
- Minimize client-side JavaScript: prefer Server Components
- Lazy load below-fold content with `dynamic()` or Suspense

## Development Workflow

### Commands (using npm, not pnpm)

```bash
npm run dev        # Development server on localhost:3000
npm run build      # Production build
npm run start      # Production server
npm run lint       # ESLint check
npm test           # Run tests in watch mode
npm run test:ui    # Open Vitest UI in browser
npm run test:coverage  # Run tests with coverage
```

### Environment Variables

Required in `.env.local`:

```bash
DEALER_TOWER_API_URL=https://api.dealertower.com/public
NEXTJS_APP_DEALER_ID=494a1788-0619-4a53-99c1-1c9f9b2e8fcc
NEXTJS_APP_HOSTNAME=www.nissanofportland.com
REVALIDATION_SECRET=your-secret-here
NODE_ENV=development
```

### Testing Requirements

**IMPORTANT**: When adding any algorithm, utility function, or testable logic, you MUST include corresponding unit tests.

**What requires tests:**

- ✅ Utility functions in `packages/lib/utils/`
- ✅ URL building/parsing logic in `packages/lib/url/`
- ✅ Data transformation functions
- ✅ Business logic with conditional branches
- ✅ Functions with multiple input combinations
- ✅ Edge case handling code

**Test file location:**

- Create `__tests__/` directory alongside the code being tested
- Use `.test.ts` or `.test.tsx` suffix
- Example: `packages/lib/utils/__tests__/text.test.ts` for `packages/lib/utils/text.ts`

**Test structure:**

```typescript
import { describe, it, expect } from "vitest";
import { myFunction } from "../myModule";

describe("myFunction", () => {
  it("should handle basic case", () => {
    expect(myFunction("input")).toBe("expected");
  });

  it("should handle edge case", () => {
    expect(myFunction(null)).toBeNull();
  });
});
```

**Before submitting code:**

1. Run `npm test -- --run` to ensure all tests pass
2. Add tests for any new testable functions
3. Update existing tests if function behavior changes

See `docs/testing.md` for complete testing documentation.

## Common Tasks

### Adding a New Filter Type

1. Update `types/filters.ts` with new filter interface
2. Add filter UI component in `components/srp/FilterGroup.tsx`
3. Update `lib/hooks/useFilters.ts` to handle new filter state
4. Sync with URL params in `lib/hooks/useUrlState.ts`

### Adding a New API Endpoint

**CRITICAL**: Follow the unified API patterns documented in `docs/api-reference/api-patterns.md`

1. Define types in `types/api.ts`
2. Create function in `lib/api/` following the standard pattern:
   - Use `cachedFetch` helper (never raw `fetch()`)
   - Hostname as first parameter
   - Add `domain` for logging
   - Proper error handling strategy
   - JSDoc with `@example`
3. Add unit tests in `__tests__/` directory
4. Use in Server Component or expose via API route if needed for client

**Template:**

```typescript
export async function fetchX(
  hostname: string,
  params: RequestType
): Promise<ResponseType> {
  const url = `${getAPIBaseURL(hostname)}/v2/endpoint`;
  return cachedFetch<ResponseType>(url, params, {
    hostname,
    dealerIdentifier: hostname.replace(/^www\./, ""),
    dataType: "vehicles",
    domain: "SRP",
  });
}
```

See `docs/api-reference/api-patterns.md` for complete guidelines.

### Adding Dealer-Specific Assets

1. Create directory structure: `dealers/{dealer-id}/` with `components/`, `pages/`, `public/` subdirectories (use UUID from API, see `docs/dealer-customization/dealer-mapping.md`)
2. Add assets to `dealers/{dealer-id}/public/`: `logo.png` (400x150px), `favicon.ico` (32x32px), etc.
3. Assets automatically served via `/api/assets/[...path]` based on dealer ID from hostname
4. Use in code: `import { getDealerAssetUrl } from '@dealertower/lib/dealers/assets'`
5. Add custom components in `dealers/{dealer-id}/components/`
6. Add custom pages in `dealers/{dealer-id}/pages/`

### Debugging Cache Issues

- In dev: add `x-cache-status`, `x-cache-key`, `x-cache-tags` headers in middleware
- Check Next.js build output for cache tags
- Test webhook: `curl -X POST http://localhost:3000/api/revalidate -H "x-revalidation-secret: secret" -d '{"hostname":"dealer-abc.com"}'`

## Key Files to Reference

- `docs/core-concepts/multi-tenancy.md` - Complete multi-tenancy implementation guide
- `docs/core-concepts/caching.md` - Caching architecture and webhook setup
- `docs/api-reference/overview.md` - Full API reference with request/response schemas
- `docs/dealer-customization/overview.md` - Dealer customization system overview
- `docs/dealer-customization/assets.md` - Dealer-specific public assets system
- `docs/payload-cms/README.md` - Payload CMS documentation index and topic guide
- `docs/testing.md` - Testing setup, patterns, and requirements
- `docs/deployment/vercel.md` - Vercel deployment and optimization
- `docs/README.md` - Documentation index and feature overview

## Anti-Patterns to Avoid

- ❌ Fetching data in Client Components when Server Components can do it
- ❌ Forgetting to include all cache tags (hostname, dealer, data type)
- ❌ Hardcoding dealer identifiers - always derive from hostname
- ❌ Using `localStorage` for tenant context - use React Context or headers
- ❌ Blocking rendering on non-critical data - use Suspense boundaries
- ❌ Cache keys without request body hash - leads to stale data with different params
- ❌ Creating .md documentation files outside the `docs/` directory - all documentation must be in `docs/`
- ❌ Adding utility functions or algorithms without corresponding unit tests - always add tests for testable code
