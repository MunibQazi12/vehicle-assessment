# Performance Optimization Guide

## Overview

Comprehensive guide to achieving and maintaining Google PageSpeed 90+, GTMetrix A, and Core Web Vitals passing scores.

## Core Web Vitals

### Largest Contentful Paint (LCP)

**Target**: ≤ 2.5 seconds  
**Measures**: Loading performance

**Optimization**:

#### 1. Image Optimization

Use Next.js `<Image>` component:

```tsx
import Image from 'next/image';

export function HeroImage() {
  return (
    <Image
      src="/hero.jpg"
      alt="Hero"
      width={1920}
      height={600}
      priority  // Load immediately for above-fold
      sizes="100vw"
      className="w-full h-auto"
    />
  );
}
```

#### 2. Critical CSS

Load critical styles inline:

```tsx
// app/layout.tsx
<head>
  <style>{criticalStyles}</style>
  <link rel="preload" href="/styles.css" as="style" />
</head>
```

#### 3. Preload Fonts

```tsx
<link
  rel="preload"
  href="/fonts/inter.woff2"
  as="font"
  type="font/woff2"
  crossOrigin="anonymous"
/>
```

#### 4. Server-Side Rendering

Always render above-fold content server-side:

```tsx
// ✅ GOOD: Server Component
async function HeroSection() {
  const data = await fetchHeroContent();
  return <Hero content={data} />;
}

// ❌ BAD: Client-side fetch
'use client';
function HeroSection() {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetchHeroContent().then(setData);
  }, []);
  return <Hero content={data} />;
}
```

#### 5. Cache Aggressively

```typescript
// Vercel Edge Cache for assets
headers: [
  {
    source: '/_next/static/(.*)',
    headers: [
      {
        key: 'Cache-Control',
        value: 'public, max-age=31536000, immutable',
      },
    ],
  },
]
```

### Interaction to Next Paint (INP)

**Target**: ≤ 200 milliseconds  
**Measures**: Responsiveness

**Optimization**:

#### 1. Minimize JavaScript

Use dynamic imports for below-fold content:

```tsx
import dynamic from 'next/dynamic';

const FiltersSidebar = dynamic(
  () => import('@dealertower/components/FiltersSidebar'),
  { loading: () => <FilterSkeletons /> }
);

export default function SRPPage() {
  return (
    <>
      <VehicleGrid vehicles={vehicles} />
      <Suspense fallback={<FilterSkeletons />}>
        <FiltersSidebar />
      </Suspense>
    </>
  );
}
```

#### 2. Use React.memo for Expensive Components

```tsx
// Before: Re-renders on every parent update
function VehicleCard({ vehicle, onSelect }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  // Expensive calculations...
  return <div>{vehicle.title}</div>;
}

// After: Only re-renders if props change
export const VehicleCard = React.memo(function VehicleCard({
  vehicle,
  onSelect,
}) {
  const [imageLoaded, setImageLoaded] = useState(false);
  return <div>{vehicle.title}</div>;
});
```

#### 3. Debounce Filter Changes

```tsx
'use client';

import { useDebouncedCallback } from 'use-debounce';

export function FilterControl() {
  const handleFilterChange = useDebouncedCallback((filter) => {
    fetchVehicles(filter);
  }, 300);  // Wait 300ms after user stops typing

  return (
    <input
      onChange={(e) => handleFilterChange(e.target.value)}
    />
  );
}
```

#### 4. Optimize Event Handlers

Use event delegation:

```tsx
// ❌ Bad: Event listener on every item
<div>
  {vehicles.map(v => (
    <div key={v.id} onClick={() => selectVehicle(v.id)}>
      {v.title}
    </div>
  ))}
</div>

// ✅ Good: Single event listener on parent
<div onClick={(e) => {
  const vehicleId = e.currentTarget.dataset.vehicleId;
  selectVehicle(vehicleId);
}}>
  {vehicles.map(v => (
    <div key={v.id} data-vehicle-id={v.id}>
      {v.title}
    </div>
  ))}
</div>
```

### Cumulative Layout Shift (CLS)

**Target**: ≤ 0.1  
**Measures**: Visual stability

**Optimization**:

#### 1. Reserve Space for Images

Always specify width and height:

```tsx
<Image
  src="/vehicle.jpg"
  alt="Vehicle"
  width={400}
  height={300}
  responsive
/>
```

Or use aspect ratio CSS:

```tsx
<div className="aspect-video">
  <Image
    src="/video-thumbnail.jpg"
    alt="Thumbnail"
    fill
    className="object-cover"
  />
</div>
```

#### 2. Avoid Inserting Content Above Existing Content

```tsx
// ❌ Bad: Chat widget inserted above content
<ChatWidget />
<main>{content}</main>

// ✅ Good: Fixed position
<main>{content}</main>
<div className="fixed bottom-4 right-4">
  <ChatWidget />
</div>
```

#### 3. Use Skeleton Loaders

```tsx
function VehicleCard({ vehicle, isLoading }) {
  if (isLoading) {
    return (
      <div className="w-64 h-80">
        <Skeleton className="w-full h-40" />
        <Skeleton className="w-3/4 h-6 mt-4" />
      </div>
    );
  }

  return (
    <div className="w-64">
      <Image src={vehicle.image} alt="" width={256} height={160} />
      <h3>{vehicle.title}</h3>
    </div>
  );
}
```

#### 4. Avoid Web Fonts Causing Layout Shift

```tsx
// Use font-display: swap to show fallback immediately
@font-face {
  font-family: 'CustomFont';
  src: url('/font.woff2') format('woff2');
  font-display: swap;  // Show fallback while loading
}
```

## Bundle Analysis

### Analyze Bundle Size

```bash
npm run build
npm run analyze  # If configured with @next/bundle-analyzer
```

### Identify Large Dependencies

```bash
npm list --long
```

### Code Splitting Tips

✅ DO:
- Use dynamic imports for non-critical routes
- Split large components lazily
- Use external CDN for large libraries

❌ DON'T:
- Import entire libraries when you need one function
- Ignore unused dependencies
- Load all fonts at once

### Example: Dynamic Imports

```tsx
// Load heavy components only when needed
const VehicleComparison = dynamic(
  () => import('./VehicleComparison'),
  {
    loading: () => <p>Loading comparison...</p>,
    ssr: false,  // Don't render on server
  }
);

export function VehicleDetail() {
  const [showComparison, setShowComparison] = useState(false);

  return (
    <>
      <button onClick={() => setShowComparison(true)}>
        Compare
      </button>
      {showComparison && <VehicleComparison />}
    </>
  );
}
```

## API Response Caching

### Cache Headers

```typescript
fetch(url, {
  method: 'POST',
  body: JSON.stringify(requestBody),
  next: {
    revalidate: 21600,  // 6 hours
    tags: [
      'hostname:dealer.com',
      'dealer:dealer-id',
      'srp:vehicles'
    ]
  }
})
```

### Cache Keys

Include request body in cache key:

```typescript
import { createHash } from 'crypto';

function generateCacheKey(hostname, path, body) {
  const bodyHash = createHash('sha256')
    .update(JSON.stringify(body))
    .digest('hex')
    .slice(0, 12);

  return `${hostname}:${path}:${bodyHash}`;
}

// Result: www.dealer.com:/v2/inventory/vehicles:a1b2c3d4e5f6
```

### Webhook Invalidation

Trigger cache revalidation:

```bash
curl -X POST https://your-site.com/api/revalidate/ \
  -H "x-revalidation-secret: secret-key" \
  -d '{"tags":["srp:vehicles"]}'
```

## Page-Level Performance

### Static vs Dynamic Rendering

**Static (Fastest)**:
- Rendered at build time
- Cached globally
- No database queries

```typescript
export const revalidate = 3600;  // ISR: revalidate every 1 hour

export default async function CatalogPage() {
  const vehicles = await fetchVehicles();
  return <VehicleGrid vehicles={vehicles} />;
}
```

**Dynamic (Slower)**:
- Rendered on request
- Personalized content
- User-specific data

```typescript
export const revalidate = 0;  // Always dynamic

export default async function PersonalizedPage() {
  const userVehicles = await fetchUserLikes();
  return <UserLikes vehicles={userVehicles} />;
}
```

### Streaming with Suspense

```tsx
export default function SRPPage() {
  return (
    <>
      {/* Critical content renders immediately */}
      <SRPHeader />

      {/* Non-critical content streams in */}
      <Suspense fallback={<FilterSkeleton />}>
        <FiltersSidebar />
      </Suspense>

      <Suspense fallback={<VehicleGridSkeleton />}>
        <VehicleGrid />
      </Suspense>
    </>
  );
}
```

## Client-Side Optimization

### Code Splitting Routes

Next.js automatically code-splits per route, but optimize with:

```typescript
// lib/loader.ts
export const VehicleDetail = dynamic(
  () => import('./routes/vehicle-detail'),
  { loading: () => <LoadingPage /> }
);
```

### Lazy Load Images

```tsx
<Image
  src="/vehicle.jpg"
  alt="Vehicle"
  width={400}
  height={300}
  loading="lazy"  // Only load when near viewport
/>
```

### Intersection Observer for Analytics

```typescript
'use client';

import { useEffect, useRef } from 'react';

export function VehicleCard({ vehicle }) {
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        // Vehicle came into view
        analytics.track('vehicle_viewed', {
          vehicleId: vehicle.id,
          title: vehicle.title,
        });
      }
    });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [vehicle.id, vehicle.title]);

  return <div ref={ref}>{vehicle.title}</div>;
}
```

## Monitoring Performance

### Lighthouse CI

```bash
# Install
npm install -g @lhci/cli@latest

# Configure lighthouse.json
{
  "upload": {
    "target": "temporary-public-storage"
  },
  "assert": {
    "preset": "lighthouse:recommended",
    "assertions": {
      "categories:performance": ["error", { "minScore": 0.9 }],
      "categories:accessibility": ["error", { "minScore": 0.9 }]
    }
  }
}

# Run
lhci autorun
```

### Web Vitals Collection

```typescript
// lib/analytics.ts
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

export function reportWebVitals(metric) {
  // Send to analytics service
  fetch('/api/analytics/web-vitals', {
    method: 'POST',
    body: JSON.stringify(metric),
  });
}

// app/layout.tsx
import { reportWebVitals } from '@dealertower/lib/analytics';

export function RootLayout() {
  useEffect(() => {
    getCLS(reportWebVitals);
    getFID(reportWebVitals);
    getLCP(reportWebVitals);
    getTTFB(reportWebVitals);
  }, []);
}
```

### Vercel Analytics

1. Go to Vercel dashboard
2. Analytics tab
3. View Real Experience Score (RES)
4. Monitor Core Web Vitals trends

## Performance Checklist

### Before Launch

- [ ] Lighthouse score ≥ 90 for all pages
- [ ] Core Web Vitals all passing
- [ ] Images optimized and responsive
- [ ] No unused dependencies
- [ ] API responses cached
- [ ] Database queries optimized
- [ ] Third-party scripts async/deferred
- [ ] Fonts subset and optimized

### Ongoing Monitoring

- [ ] Weekly Lighthouse audits
- [ ] Monitor Web Vitals from Vercel
- [ ] Check bundle size trends
- [ ] Analyze slow endpoints
- [ ] Review error logs
- [ ] Monitor API response times

## Common Performance Issues

### Slow LCP

**Problem**: Largest element takes > 2.5s

**Solutions**:
1. Preload hero image: `priority` attribute
2. Move heavy JavaScript below fold
3. Cache API responses
4. Use CDN for images

### Layout Shift

**Problem**: CLS > 0.1

**Solutions**:
1. Reserve space for images (width/height)
2. Avoid dynamic font loading
3. Use skeleton loaders
4. Fix positioned elements

### High INP

**Problem**: Interactions sluggish

**Solutions**:
1. Reduce JavaScript bundle
2. Debounce heavy operations
3. Use React.memo for expensive components
4. Avoid blocking main thread

## Related Documentation

- [Caching Strategy](../core-concepts/caching.md) - Cache optimization
- [Architecture](../core-concepts/architecture.md) - Component patterns
- [Vercel Deployment](./vercel.md) - Vercel optimization
