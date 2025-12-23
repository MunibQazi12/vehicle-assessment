# Dealer Tower Multi-Tenant Platform

## Overview

Enterprise-grade, multi-tenant vehicle inventory search platform designed for automotive dealerships. Built on Next.js 16 App Router with React 19, TypeScript, and Tailwind CSS 4, this solution delivers high-performance search experiences across multiple dealer websites from a unified codebase.

### Key Capabilities

- **Multi-Tenant Architecture**: Hostname-based tenant resolution supporting unlimited dealership configurations
- **Dynamic Inventory Integration**: Real-time vehicle data fetching from Dealer Tower's centralized API
- **Advanced Search & Filtering**: Comprehensive filtering system with sorting, infinite scroll, and SEO-friendly URL structure
- **Performance-Optimized**: Achieves Google PageSpeed scores of 90+ and GTMetrix A-grade ratings
- **Intelligent Caching**: Tag-based cache invalidation with webhook-driven updates for optimal data freshness

## Technical Architecture

### System Components

The platform consists of four primary layers:

1. **Client Layer**: Browser-based interface serving multiple dealer hostnames
2. **Application Layer**: Next.js 16 App Router with server and client components
3. **Caching Layer**: Intelligent data cache with tag-based invalidation
4. **API Layer**: Integration with Dealer Tower inventory microservices

### Request Flow

```
User Request → Proxy (Tenant Detection) → Page Component (RSC)
            → Cache Check → API Fetch (if needed) → Render
            → Client Hydration → Interactive Components
```

### Multi-Tenancy Implementation

Tenant resolution occurs via `getTenantContext()` from `@dealertower/lib/tenant/server-context`:

- Extract hostname from request headers (`x-forwarded-host` or `host`) or environment variable
- Hostname is always lowercase and used as the dealer identifier
- Fetch website information from API with caching
- Server Components access tenant via `getTenantContext()`, Client Components via React Context

For local development, set `NEXTJS_APP_HOSTNAME` environment variable to override hostname detection.

### Caching Strategy

**Cache Key Structure**: `{hostname}:{path}:{bodyHash}`

**Cache Tags**:
- `hostname:{normalized_hostname}` - Invalidate all data for specific hostname
- `dealer:{dealer_identifier}` - Invalidate by dealer identifier
- `srp:vehicles` - All vehicle inventory data
- `srp:filters` - All filter configuration data

**Time-to-Live**: 6 hours (21,600 seconds) as fallback mechanism

**Invalidation**: Webhook-driven via POST to `/api/revalidate/` with authenticated secret header

### API Integration

**Base URL**: `https://api.dealertower.com/public/{hostname}`

**Core Endpoints**:
- `/v2/inventory/vehicles/srp/rows` - Paginated vehicle listing
- `/v2/inventory/vehicles/srp/filters` - Available filters with selection state
- `/v2/inventory/vehicles/srp/filters/{filter_name}` - Filter-specific values

All API requests utilize Next.js `fetch()` with `next.revalidate` and `next.tags` for cache management. Comprehensive API documentation available in `docs/API.md`.

## Getting Started

### Prerequisites

- Node.js 18.0 or higher
- npm package manager
- Access to Dealer Tower API credentials

### Installation

```bash
# Clone repository
git clone <repository-url>
cd dt-nextjs

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env.local
# Edit .env.local with your API credentials and settings

# Start development server
npm run dev
```

### Development

Access the application at `http://localhost:3000`. The development server supports hot module replacement for rapid iteration.

### Production Deployment

```bash
# Build optimized production bundle
npm run build

# Start production server
npm run start
```

### Testing

```bash
# Run test suite
npm test

# Generate coverage report
npm test:coverage
```

## Project Structure

```plaintext
dt-nextjs/
├── app/                          # Next.js App Router
│   ├── (dealer)/                 # Dealer-specific page routes
│   │   └── [page]/               # Dynamic dealer pages
│   ├── (srp)/                    # Search Results Page routes
│   │   ├── new-vehicles/         # New vehicle inventory
│   │   │   └── [[...slug]]/      # SEO-friendly filter URLs
│   │   └── used-vehicles/        # Used vehicle inventory
│   │       └── [[...slug]]/      # SEO-friendly filter URLs
│   ├── api/                      # API endpoints
│   │   ├── assets/[...path]/     # Dealer asset serving
│   │   ├── revalidate/           # Cache invalidation webhook
│   │   └── vehicles/             # Vehicle data proxy
│   ├── layout.tsx                # Root layout with tenant provider
│   ├── error.tsx                 # Global error boundary
│   └── globals.css               # Global styles (Tailwind CSS 4)
│
├── dealers/                      # Dealer-specific content
│   └── {dealer-uuid}/            # UUID from API
│       ├── components/           # Custom React components
│       │   ├── Header.tsx        # Custom header (optional)
│       │   └── Footer.tsx        # Custom footer (optional)
│       ├── pages/                # Custom page components
│       │   └── errors/           # Custom error pages
│       └── public/               # Dealer-specific assets
│           ├── logo.png          # Logo (400x150px recommended)
│           └── favicon.ico       # Favicon (32x32px)
│
├── packages/                     # Shared code across dealers
│   ├── components/               # Reusable React components
│   │   ├── srp/                  # SRP-specific components
│   │   ├── layout/               # Layout components
│   │   └── skeletons/            # Loading states
│   ├── lib/                      # Core utilities
│   │   ├── api/                  # API client with caching
│   │   ├── cache/                # Cache key/tag utilities
│   │   ├── dealers/              # Dealer-specific utilities
│   │   ├── tenant/               # Multi-tenancy context
│   │   ├── url/                  # URL parsing/building
│   │   └── hooks/                # Custom React hooks
│   └── types/                    # TypeScript type definitions
│
├── docs/                         # Comprehensive documentation
│   ├── API.md                    # API integration guide
│   ├── CACHING.md                # Caching strategy details
│   ├── MULTI_TENANCY.md          # Multi-tenancy implementation
│   └── ...                       # Additional technical docs
│
├── public/                       # Static assets
├── proxy.ts                      # Next.js 16 proxy configuration
├── next.config.ts                # Next.js configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json                  # Project dependencies
```

## Core Features

### Multi-Tenant Architecture

- **Hostname-based tenant identification**: Automatic dealer resolution from request hostname
- **Environment override support**: Local development mode with `NEXTJS_APP_HOSTNAME` variable
- **Tenant context propagation**: Seamless context flow through server and client components
- **Scalable configuration**: Support for unlimited dealership instances

### Dealer Customization

- **Brand-specific theming**: Custom colors, logos, and visual identity per dealer
- **Component overrides**: Dealer-specific headers, footers, and page components
- **Asset management**: Dedicated asset serving with automatic dealer resolution
- **Feature toggles**: Configurable feature flags for dealer-specific functionality

### Performance Optimization

- **Server-first rendering**: Leverages React Server Components for optimal initial load
- **Smart caching**: Tag-based cache strategy with 6-hour TTL and webhook invalidation
- **Image optimization**: Next.js Image component with priority loading
- **Minimal client JavaScript**: Strategic hydration of interactive components only

### User Experience

- **Infinite scroll pagination**: Smooth, performant vehicle browsing
- **Real-time filtering**: Instant filter updates with URL synchronization
- **Skeleton loaders**: Progressive loading states during data fetches
- **Responsive design**: Mobile-first approach with adaptive grid layouts

## Dealer Configuration

### Adding a New Dealership

1. **Create dealer directory structure** in `dealers/{dealer-uuid}/`:

```bash
dealers/
└── {dealer-uuid}/
    ├── components/
    │   ├── Header.tsx       # Optional custom header
    │   └── Footer.tsx       # Optional custom footer
    ├── pages/
    │   └── errors/          # Optional custom error pages
    └── public/
        ├── logo.png         # Dealer logo (400x150px)
        └── favicon.ico      # Dealer favicon (32x32px)
```

2. **Add dealer assets** to the `public/` subdirectory

3. **Configure environment** for local testing in `.env.local`:

```bash
NEXTJS_APP_DEALER_ID={dealer-uuid}
NEXTJS_APP_HOSTNAME=newdealer.com
```

4. **Deploy** - The system automatically resolves the dealer based on hostname

## Local Development Testing

Test different dealer configurations by overriding the tenant resolution:

```bash
# Edit .env.local to test specific dealer
NEXTJS_APP_DEALER_ID=494a1788-0619-4a53-99c1-1c9f9b2e8fcc
NEXTJS_APP_HOSTNAME=nissanofportland.com

# Restart development server
npm run dev
```

The application will render using the specified dealer's branding, components, and configuration. Switch dealer UUIDs to test different instances.

## Documentation

### Architecture & Integration

| Document | Description |
|----------|-------------|
| [API Documentation](./docs/API.md) | Complete API reference with request/response schemas |
| [Caching Strategy](./docs/CACHING.md) | Tag-based cache implementation and webhook setup |
| [Multi-Tenancy](./docs/MULTI_TENANCY.md) | Hostname-based tenant resolution architecture |
| [URL Structure](./docs/URL_STRUCTURE.md) | SEO-friendly URL parsing and building |
| [Condition Filter Rules](./docs/CONDITION_FILTER_RULES.md) | Business logic for vehicle condition filtering |

### Dealer Customization

| Document | Description |
|----------|-------------|
| [Dealers Root Structure](./docs/DEALERS_ROOT_STRUCTURE.md) | Unified dealer directory organization |
| [Dealer Assets](./docs/DEALER_ASSETS.md) | Managing dealer-specific public assets |
| [Custom Components](./docs/DEALER_CUSTOM_COMPONENTS.md) | Creating dealer-specific React components |
| [Custom Headers](./docs/CUSTOM_HEADERS.md) | Dealer-specific header implementation |
| [Custom Error Pages](./docs/CUSTOM_ERROR_PAGES.md) | Dealer-specific error page customization |
| [Website Scripts](./docs/WEBSITE_SCRIPTS.md) | External script injection system |

### Development & Deployment

| Document | Description |
|----------|-------------|
| [Bundle Optimization](./docs/BUNDLE_OPTIMIZATION.md) | Code splitting and bundle size optimization |
| [Vercel Build Optimization](./docs/VERCEL_BUILD_OPTIMIZATION.md) | Smart build skipping for Vercel deployments |
| [Loading States](./docs/LOADING_STATES.md) | Skeleton loaders and Suspense boundaries |
| [Legacy Browser Handling](./docs/LEGACY_BROWSER_HANDLING.md) | Polyfills and browser compatibility |

## Environment Configuration

Required and optional environment variables for deployment and development:

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DEALER_TOWER_API_URL` | Yes | - | Base URL for Dealer Tower API endpoint |
| `REVALIDATION_SECRET` | Yes | - | Secret key for cache invalidation webhook authentication |
| `NEXTJS_APP_DEALER_ID` | No | - | Development override for dealer UUID |
| `NEXTJS_APP_HOSTNAME` | No | - | Development override for hostname-based tenant resolution |
| `NODE_ENV` | No | `development` | Node environment (`development`, `production`, `test`) |

### Example Configuration

```bash
# .env.local
DEALER_TOWER_API_URL=https://api.dealertower.com/public
REVALIDATION_SECRET=your-secure-secret-key
NEXTJS_APP_DEALER_ID=494a1788-0619-4a53-99c1-1c9f9b2e8fcc
NEXTJS_APP_HOSTNAME=www.nissanofportland.com
NODE_ENV=development
```

## Performance Benchmarks

Production performance targets and metrics:

| Metric | Target | Description |
|--------|--------|-------------|
| Google PageSpeed | 90+ | Overall performance score across desktop and mobile |
| GTMetrix Grade | A | Comprehensive performance and best practices grade |
| Time to First Byte (TTFB) | < 200ms | Server response time for cached requests |
| Largest Contentful Paint (LCP) | < 2.5s | Time until main content is visible |
| First Input Delay (FID) | < 100ms | Time until page becomes interactive |
| Cumulative Layout Shift (CLS) | < 0.1 | Visual stability during page load |
| First Contentful Paint (FCP) | < 1.8s | Time until first content renders |

### Optimization Strategies

- React Server Components for zero-JavaScript initial renders
- Intelligent caching with 6-hour TTL and tag-based invalidation
- Next.js Image optimization with automatic WebP conversion
- Code splitting and lazy loading for below-the-fold content
- Minimal client-side JavaScript bundle (~150KB gzipped)

## Technology Stack

- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS 4 (PostCSS plugin)
- **Runtime**: Node.js 18+
- **Deployment**: Vercel (optimized with smart build skipping)

## License

Proprietary software © 2025 Dealer Tower. All rights reserved.

## Support

For technical documentation, refer to the comprehensive guides in the `docs/` directory. For additional assistance, contact the Dealer Tower development team.

