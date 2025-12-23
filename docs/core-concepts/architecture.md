# Architecture Overview

## System Design

The Dealer Tower platform is a multi-tenant Next.js application that serves vehicle inventory search pages for multiple automotive dealerships from a single codebase.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      CLIENT LAYER                                │
│         (Multiple Dealer Hostnames)                              │
│   www.dealer-a.com  |  www.dealer-b.com  |  www.dealer-c.com     │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                   PROXY LAYER (proxy.ts)                         │
│   • Session Cookie Management                                    │
│   • CSRF Protection                                              │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│              APPLICATION LAYER (Next.js 16 App Router)           │
│                                                                  │
│   ┌──────────────────┐  ┌──────────────────┐                    │
│   │ Server Components│  │ Client Components│                    │
│   │  • Data Fetching │  │  • Interactivity │                    │
│   │  • API Calls     │  │  • User Input    │                    │
│   │  • Cache Tags    │  │  • State Mgmt    │                    │
│   └──────────────────┘  └──────────────────┘                    │
│                                                                  │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                    CACHING LAYER                                 │
│   • Tag-Based Invalidation                                       │
│   • 6-Hour TTL Fallback                                          │
│   • Per-Hostname Keys                                            │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                   API LAYER (Dealer Tower)                       │
│   • Vehicle Inventory                                            │
│   • Filter Configuration                                         │
│   • Dealer Information                                           │
└─────────────────────────────────────────────────────────────────┘
```

## Request Flow

### 1. Incoming Request
```
User → www.nissanofportland.com/new-vehicles/toyota/
```

### 2. Proxy Layer
- Manages session cookies for CSRF protection

### 3. Page Rendering
- Server Component receives request
- Calls `getTenantContext()` to resolve hostname and dealer identifier
- Parses URL for filters (make, model, etc.)
- Fetches data from cache or API

### 4. Data Fetching
- Checks cache with key: `{hostname}:{path}:{bodyHash}`
- If miss, calls Dealer Tower API
- Stores response with tags: `hostname:*`, `dealer:*`, `srp:vehicles`
- Returns data to component

### 5. Response
- Server Component renders with data
- Client Components hydrate
- Interactive features activate

## Core Technologies

### Framework
- **Next.js 16** - App Router with React Server Components
- **React 19** - Latest React features
- **TypeScript** - Type safety

### Styling
- **Tailwind CSS 4** - Utility-first CSS framework
- **PostCSS** - CSS processing

### Performance
- **Server Components** - Zero JavaScript for static content
- **Streaming SSR** - Progressive page rendering
- **Smart Caching** - Reduced API calls

## Directory Structure

```
dt-nextjs/
├── app/                      # Next.js App Router
│   ├── (dealer)/            # Dynamic dealer pages
│   ├── (srp)/               # Search Results Pages
│   │   ├── new-vehicles/
│   │   └── used-vehicles/
│   ├── api/                 # API routes
│   └── vehicle/[vin]/       # Vehicle Detail Page
│
├── packages/                # Shared code (monorepo style)
│   ├── components/          # React components
│   │   ├── srp/            # Search page components
│   │   ├── vdp/            # Vehicle detail components
│   │   ├── forms/          # Form components
│   │   └── layout/         # Header, Footer
│   ├── lib/                # Utilities & business logic
│   │   ├── api/            # API client
│   │   ├── cache/          # Caching utilities
│   │   ├── tenant/         # Multi-tenancy
│   │   ├── url/            # URL parsing/building
│   │   └── hooks/          # React hooks
│   └── types/              # TypeScript definitions
│
├── dealers/                 # Dealer-specific content
│   └── {dealer-uuid}/      # Per-dealer directory
│       ├── components/     # Custom components
│       ├── pages/          # Custom pages
│       └── public/         # Assets (logo, favicon)
│
├── docs/                    # Documentation
└── public/                  # Global static assets
```

## Component Architecture

### Server Components (Default)
Used for data fetching and static content:
- Page layouts
- Data containers
- SEO metadata
- Initial data loading

### Client Components ("use client")
Used for interactivity:
- Form inputs
- Filter controls
- Infinite scroll
- Modal dialogs

### Composition Pattern
```tsx
// Server Component (default)
export default async function NewVehiclesPage() {
  const data = await fetchVehicles();
  
  return (
    <>
      <VehicleGrid vehicles={data.vehicles} /> {/* Server */}
      <FiltersSidebar filters={data.filters} /> {/* Client inside */}
    </>
  );
}
```

## Data Flow

### Server-Side
```
Request → Proxy → Headers → Server Component
  → API Client → Cache Check → Dealer Tower API
  → Cache Store → Render → Response
```

### Client-Side
```
User Action → Client Component → State Update
  → Next.js API Route → API Client → Cache Check
  → Dealer Tower API → Response → UI Update
```

## Key Design Patterns

### 1. Multi-Tenancy
- Hostname-based tenant detection
- UUID-based dealer identification
- Context propagation via headers and React Context

### 2. Caching
- Cache keys: `{hostname}:{path}:{bodyHash}`
- Cache tags: `hostname:*`, `dealer:*`, `srp:vehicles`, `srp:filters`
- Webhook invalidation for instant updates

### 3. URL Routing
- SEO-friendly paths: `/new-vehicles/toyota/camry/`
- Query params for complex filters: `?colors=red,blue&minPrice=20000`
- Server-side parsing for SSR

### 4. Dealer Customization
- Dynamic component loading
- Per-dealer asset serving
- Custom page routing

## Performance Optimizations

### Build Time
- Static page generation where possible
- Route pre-rendering
- Asset optimization

### Runtime
- Server Component caching
- API response caching
- Smart cache invalidation

### User Experience
- Instant page transitions
- Progressive enhancement
- Skeleton loaders
- Optimistic updates

## Security

### Multi-Tenancy Security
- Dealer ID validated against API
- No client-side tenant selection
- Environment variable overrides for dev only

### API Security
- CSRF protection on forms
- Rate limiting (optional)
- Origin validation (optional)

### Data Isolation
- Hostname-based data separation
- Cache key includes tenant identifier
- No cross-tenant data leakage

## Deployment Architecture

### Vercel (Recommended)
- Edge Network for global distribution
- Automatic HTTPS
- Zero-config deployments
- Environment variable management

### Build Process
```
git push → Vercel → Build → Deploy → Edge Network
```

### Environment Handling
- Production: Real hostnames, full caching
- Preview: Branch deploys, test data
- Development: Local override, cache disabled

## Scalability

### Horizontal Scaling
- Stateless application design
- Cache shared across instances
- API calls minimized

### Vertical Scaling
- Server Components reduce client load
- Edge caching reduces origin requests
- CDN for static assets

## Monitoring & Observability

### Performance Metrics
- Core Web Vitals (LCP, FID, CLS)
- API response times
- Cache hit rates
- Build times

### Error Tracking
- Next.js error boundaries
- API error logging
- Client-side error capture

## Next Steps

- [Multi-Tenancy](./multi-tenancy.md) - Tenant detection details
- [Caching](./caching.md) - Caching implementation
- [URL Routing](./url-routing.md) - URL structure
- [SRP Overview](../features/srp/overview.md) - Search functionality
