# Route Registry System

The route registry system enables dealer-specific routing with lazy-loaded page components for optimal bundle size and performance.

## Overview

Each dealer can define custom routes that map URL paths to dealer-specific page components. The system uses **lazy loading** to ensure that:

1. **Dealer registries** are only loaded when needed (not all dealers at startup)
2. **Page components** are only loaded when their route is accessed

This two-level lazy loading prevents bundle bloat where all dealers' code would be included in the main bundle.

## Architecture

```
Registry Map (packages/lib/dealers/registry-map.ts)
    └── Lazy loads dealer registries on-demand
        └── dealers/{dealer-id}/registry.ts
            └── Each route has a loader function
                └── () => import('./pages/PageName')
```

## Creating a Route Registry

Each dealer's registry is defined in `dealers/{dealer-id}/registry.ts`:

```typescript
import type { LazyDealerRegistry } from '@dealertower/types';

const routes: LazyDealerRegistry = {
  // Home page at root path
  '/': {
    loader: () => import('./pages/Home'),
    metadata: {
      title: 'Welcome',
      description: 'Dealership home page',
    },
  },

  // About page
  '/about': {
    loader: () => import('./pages/About'),
    metadata: {
      title: 'About Us',
      description: 'Learn about our dealership',
    },
  },

  // Contact page
  '/contact': {
    loader: () => import('./pages/Contact'),
    metadata: {
      title: 'Contact Us',
      description: 'Get in touch with us',
    },
  },
};

// 404 page loader (optional)
const notFoundLoader = () => import('./pages/NotFound');

export default { routes, notFoundLoader };
```

## Route Entry Structure

Each route entry in the registry has the following structure:

```typescript
interface LazyDealerRouteEntry {
  // Lazy loader function - returns a Promise that resolves to the component module
  loader: LazyComponentLoader;

  // Optional metadata for the page
  metadata?: {
    title?: string;
    description?: string;
    keywords?: string[];
    openGraph?: {
      title?: string;
      description?: string;
      images?: string[];
    };
  };
}

// The loader type - must return a module with a default export
type LazyComponentLoader = () => Promise<{ default: React.ComponentType<any> }>;
```

## Page Component Structure

Page components must be the default export of their module:

```typescript
// dealers/{dealer-id}/pages/About.tsx
export default function About() {
  return (
    <div className="about-page">
      <h1>About Our Dealership</h1>
      <p>We've been serving customers since 1985...</p>
    </div>
  );
}
```

## Registry Map

The registry map in `packages/lib/dealers/registry-map.ts` defines which dealer IDs have registries:

```typescript
import type { LazyDealerRegistryModule } from '@dealertower/types';

type DealerRegistryLoader = () => Promise<LazyDealerRegistryModule>;

// Map of dealer IDs to their registry loaders
export const dealerRegistryLoaders: Record<string, DealerRegistryLoader> = {
  '73d6c4fc-8ffb-471e-88c4-5e8eeddc1c63': () =>
    import('@dealers/73d6c4fc-8ffb-471e-88c4-5e8eeddc1c63/registry').then(
      (m) => m.default
    ),
  // Add more dealers as needed
};
```

When adding a new dealer with custom routes, add their entry to this map.

## Using the Loader Functions

The loader module (`packages/lib/dealers/loader.ts`) provides functions to load dealer routes and components:

### getDealerRouteLazy

Get a route entry for a specific dealer and path:

```typescript
import { getDealerRouteLazy } from '@dealertower/lib/dealers';

const route = await getDealerRouteLazy(dealerId, '/about');
if (route) {
  // Route exists for this dealer
  const Component = (await route.loader()).default;
  return <Component />;
}
```

### loadDealerPageComponent

Load just the page component for a route:

```typescript
import { loadDealerPageComponent } from '@dealertower/lib/dealers';

const PageComponent = await loadDealerPageComponent(dealerId, '/contact');
if (PageComponent) {
  return <PageComponent />;
}
```

### getDealerPageMetadataLazy

Get metadata for a route (for Next.js generateMetadata):

```typescript
import { getDealerPageMetadataLazy } from '@dealertower/lib/dealers';

export async function generateMetadata({ params }) {
  const metadata = await getDealerPageMetadataLazy(dealerId, path);
  return metadata || { title: 'Default Title' };
}
```

### loadDealerNotFoundPage

Load the dealer's custom 404 page:

```typescript
import { loadDealerNotFoundPage } from '@dealertower/lib/dealers';

const NotFoundPage = await loadDealerNotFoundPage(dealerId);
if (NotFoundPage) {
  return <NotFoundPage />;
}
// Fall back to default 404
```

## Complete Page Implementation

Here's how the dealer page route uses the registry:

```typescript
// app/(dealer)/[[...slug]]/page.tsx
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import {
  loadDealerPageComponent,
  loadDealerNotFoundPage,
  getDealerPageMetadataLazy,
} from '@dealertower/lib/dealers';
import { getTenantContext, getTenantDealerId } from '@dealertower/lib/tenant/server-context';

interface PageProps {
  params: Promise<{ slug?: string[] }>;
}

export async function generateMetadata({ params }: PageProps) {
  const dealerId = await getTenantDealerId();
  const { slug } = await params;
  const path = slug ? `/${slug.join('/')}` : '/';

  if (!dealerId) return { title: 'Not Found' };

  const metadata = await getDealerPageMetadataLazy(dealerId, path);
  return metadata || { title: 'Page' };
}

export default async function DealerPage({ params }: PageProps) {
  const { hostname } = await getTenantContext();
  const { slug } = await params;
  const path = slug ? `/${slug.join('/')}` : '/';

  if (!hostname) {
    notFound();
  }

  // Try to load the page component
  const PageComponent = await loadDealerPageComponent(hostname, path);

  if (PageComponent) {
    return <PageComponent />;
  }

  // Try dealer's custom 404 page
  const NotFoundPage = await loadDealerNotFoundPage(dealerId);
  if (NotFoundPage) {
    return <NotFoundPage />;
  }

  // Fall back to Next.js notFound
  notFound();
}
```

## TypeScript Types

All types are exported from `@dealertower/types`:

```typescript
import type {
  LazyComponentLoader,
  LazyDealerRouteEntry,
  LazyDealerRegistry,
  LazyDealerRegistryModule,
} from '@dealertower/types';
```

### Type Definitions

```typescript
// Function that lazily loads a component module
type LazyComponentLoader = () => Promise<{ default: React.ComponentType<any> }>;

// A single route entry with loader and optional metadata
interface LazyDealerRouteEntry {
  loader: LazyComponentLoader;
  metadata?: {
    title?: string;
    description?: string;
    keywords?: string[];
    openGraph?: {
      title?: string;
      description?: string;
      images?: string[];
    };
  };
}

// Map of paths to route entries
type LazyDealerRegistry = Record<string, LazyDealerRouteEntry>;

// The full registry module exported from each dealer's registry.ts
interface LazyDealerRegistryModule {
  routes: LazyDealerRegistry;
  notFoundLoader?: LazyComponentLoader;
}
```

## Adding a New Dealer with Routes

1. **Create the registry file** at `dealers/{dealer-id}/registry.ts`:

```typescript
import type { LazyDealerRegistry } from '@dealertower/types';

const routes: LazyDealerRegistry = {
  '/': {
    loader: () => import('./pages/Home'),
    metadata: { title: 'Home' },
  },
};

export default { routes };
```

2. **Create page components** in `dealers/{dealer-id}/pages/`:

```typescript
// dealers/{dealer-id}/pages/Home.tsx
export default function Home() {
  return <div>Welcome!</div>;
}
```

3. **Register in the registry map** (`packages/lib/dealers/registry-map.ts`):

```typescript
export const dealerRegistryLoaders: Record<string, DealerRegistryLoader> = {
  // ... existing dealers
  'new-dealer-uuid': () =>
    import('@dealers/new-dealer-uuid/registry').then((m) => m.default),
};
```

## Performance Benefits

The lazy loading architecture provides significant performance benefits:

### Before (Static Imports)
```
Main Bundle
├── Dealer A Registry
│   ├── Home Page (+ all imports)
│   ├── About Page (+ all imports)
│   └── Contact Page (+ all imports)
├── Dealer B Registry
│   ├── Home Page (+ all imports)
│   └── Services Page (+ all imports)
└── ... all other dealers
```

All code bundled together, loaded on every page load.

### After (Lazy Loading)
```
Main Bundle (minimal)

On Dealer A home page visit:
├── Load Dealer A Registry (small)
└── Load Home Page Component

On Dealer A about page visit:
└── Load About Page Component (registry already cached)
```

Only the code needed for the current dealer and page is loaded.

## Best Practices

1. **Keep page components focused** - Each page should be a single component file
2. **Use relative imports in loaders** - Always use `() => import('./pages/X')` format
3. **Add metadata for all routes** - Helps with SEO and page titles
4. **Create a custom 404** - Provide a `notFoundLoader` for better UX
5. **Don't import page components directly** - Always use the loader pattern
6. **Cache-friendly** - Registry modules are cached after first load

## Troubleshooting

### Route not found
- Verify the path in registry matches the URL (include leading `/`)
- Check that dealer ID is in the registry map
- Ensure the page component file exists

### Component not loading
- Verify the component is the default export
- Check for syntax errors in the component file
- Ensure the import path in the loader is correct

### TypeScript errors
- Import types from `@dealertower/types`
- Ensure `loader` function returns correct type
- Use `LazyDealerRegistry` type for the routes object
