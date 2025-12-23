# URL Routing

## Overview

The platform uses SEO-friendly URLs with path segments for primary filters (condition, make, model) and query parameters for additional filters.

## URL Structure

```
/{condition}/{make}/{model}/?[query_parameters]
```

**Examples**:
- `/new-vehicles/`
- `/used-vehicles/toyota/`
- `/new-vehicles/honda/civic/?year=2024&color=red`

## Path Segments (Fixed Order)

### 1. Condition (Required, Always First)

| Condition | Path | Description |
|-----------|------|-------------|
| New | `/new-vehicles/` | New vehicles only |
| Used | `/used-vehicles/` | Used + Certified vehicles |
| Certified | `/used-vehicles/certified/` | Certified-only vehicles |

### 2. Make (Optional, Second Position)

- Only first make (alphabetically) appears in path
- Additional makes become query parameters
- Example: `/new-vehicles/toyota/`

### 3. Model (Optional, Third Position)

- Only appears if make exists in path
- Only first model (alphabetically) appears in path
- Additional models become query parameters
- Example: `/new-vehicles/toyota/camry/`

## Condition Filter Rules (IMPORTANT)

These rules are **complex and non-obvious**:

### Rule 1: Used Always Includes Certified

When user selects "Pre-Owned (used)":
- Certified checkbox auto-checks
- Certified checkbox becomes disabled
- URL: `/used-vehicles/`
- Filters sent to API: `['used', 'certified']`

**Reason**: Backend constraint - used vehicle dataset always includes certified vehicles.

### Rule 2: Certified Can Be Selected Alone

When user deselects "Pre-Owned":
- Certified checkbox remains checked
- Certified checkbox becomes enabled
- URL: `/used-vehicles/certified/`
- Filters sent to API: `['certified']`

### Rule 3: URL Parsing Special Case

- `/used-vehicles/` → Parses as `['used', 'certified']` (both)
- `/used-vehicles/certified/` → Parses as `['certified']` (certified-only)
- `/new-vehicles/` → Parses as `['new']`

### Rule 4: Multiple Conditions

- New + Certified → `/used-vehicles/certified/?condition=new`
- New + Used → `/used-vehicles/?condition=new`
- New + Used + Certified → `/used-vehicles/?condition=new`

**Never use**: `/new-vehicles/used-vehicles/...` format

## Slug Cleaning

Path segments are automatically cleaned:

| Input | Output |
|-------|--------|
| `Land Rover` | `land-rover` |
| `Range Rover (Sport)` | `range-rover-sport` |
| `Citroën` | `citroen` |

**Rules**:
- Non-ASCII removed
- Special chars (`/`, spaces, `()`) → `-`
- Lowercase
- Trim leading/trailing hyphens

## Query Parameters

### Array Filters (Comma-Separated)

**Sorted Descending** (newest first):
- `year=2024,2023,2022`

**Sorted Ascending** (alphabetical):
- `trim=le,se,xle`
- `body=sedan,suv,truck`
- `fuel_type=gas,hybrid,electric`
- `transmission=automatic,manual`
- `engine=v6,v8,4-cylinder`
- `drive_train=awd,fwd,rwd`
- `ext_color=black,blue,red`
- `int_color=beige,black,gray`
- `doors=2,4`

### Range Filters

- `price_min=20000&price_max=50000`
- `mileage_min=0&mileage_max=50000`
- `monthly_payment=500` (max payment)

### Boolean Filters

- `is_special=true`
- `is_new_arrival=true`
- `is_in_transit=true`
- `is_sale_pending=true`

### Sorting

- `sort_by=price` (default: ascending)
- `order=desc` (only if descending)

### Search

- `search=civic+hybrid`

### Pagination

- `page=2` (default: 1)

## URL Examples

### Path Only

```
/new-vehicles/
/used-vehicles/
/used-vehicles/certified/
/new-vehicles/toyota/
/new-vehicles/toyota/camry/
/used-vehicles/honda/accord/
```

### Path + Query Parameters

```
/new-vehicles/toyota/?year=2024,2023&trim=le,se
/used-vehicles/ford/f-150/?price_min=30000&price_max=50000
/used-vehicles/certified/?make=bmw,audi&body=sedan
/new-vehicles/honda/civic/?sort_by=price&order=desc
/used-vehicles/?year=2023&is_special=true&page=2
```

### Multiple Conditions

```
/used-vehicles/certified/?condition=new
# Shows: New AND Certified vehicles

/used-vehicles/?condition=new  
# Shows: New, Used, AND Certified vehicles
```

## Implementation

### Parsing URLs (Server Components)

```typescript
import { parseSlug } from '@dealertower/lib/url/parser';

export default async function SRPPage({ 
  params, 
  searchParams 
}: {
  params: Promise<{ slug?: string[] }>;
  searchParams: Promise<Record<string, string | string[]>>;
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  
  // Parse slug from path
  const { filters, make, model } = parseSlug(
    resolvedParams.slug || []
  );
  
  // Merge with query parameters
  const allFilters = {
    ...filters,
    ...resolvedSearchParams,
  };
  
  // Fetch data
  const data = await fetchSRPRows(dealerId, allFilters, hostname);
  
  return <VehicleGrid vehicles={data.vehicles} />;
}
```

### Building URLs (Client Components)

```typescript
'use client';
import { buildUrl } from '@dealertower/lib/url/builder';
import { useRouter } from 'next/navigation';

export function FilterControls() {
  const router = useRouter();
  
  function handleFilterChange(newFilters: FilterState) {
    const { pathname, search } = buildUrl(newFilters);
    router.push(pathname + search);
  }
  
  return <div>{/* filter UI */}</div>;
}
```

### URL Parser API

```typescript
// packages/lib/url/parser.ts

export interface ParsedSlug {
  condition: string; // 'new' | 'used' | 'certified'
  make?: string;
  model?: string;
  filters: FilterState;
}

export function parseSlug(slug: string[]): ParsedSlug {
  // Parses path segments into filter state
  // Handles special certified-after-used case
  // Returns structured filter object
}
```

### URL Builder API

```typescript
// packages/lib/url/builder.ts

export interface BuiltUrl {
  pathname: string;
  search: string; // includes leading '?'
}

export function buildUrl(
  filters: FilterState,
  sortBy?: string,
  order?: 'asc' | 'desc'
): BuiltUrl {
  // Builds pathname from primary filters
  // Builds query string from remaining filters
  // Returns complete URL parts
}
```

## SEO Metadata

Generate dynamic metadata from URL:

```typescript
// app/(srp)/new-vehicles/[[...slug]]/page.tsx

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug?: string[] }> 
}): Promise<Metadata> {
  const resolvedParams = await params;
  const { make, model, condition } = parseSlug(resolvedParams.slug || []);
  
  let title = 'New Vehicles';
  if (make && model) {
    title = `New ${make} ${model} for Sale`;
  } else if (make) {
    title = `New ${make} Vehicles for Sale`;
  }
  
  return {
    title,
    description: `Browse our inventory of ${title.toLowerCase()}.`,
  };
}
```

## Route Validation

### Valid Routes

✅ `/new-vehicles/`  
✅ `/used-vehicles/toyota/`  
✅ `/used-vehicles/certified/`  
✅ `/new-vehicles/honda/civic/?year=2024`

### Invalid Routes

❌ `/new-vehicles/used-vehicles/` (mixed conditions in path)  
❌ `/vehicles/` (missing condition)  
❌ `/new-vehicles/civic/` (model without make)  
❌ `/toyota/` (make without condition)

## URL Migration

If migrating from query-only URLs:

```
Old: /vehicles?condition=new&make=toyota&model=camry
New: /new-vehicles/toyota/camry/
```

**Benefits**:
- Better SEO
- Cleaner URLs
- Improved user experience
- Breadcrumb navigation

## Architecture Files

```
packages/lib/url/
├── constants.ts    # Condition slugs, patterns
├── parser.ts       # parseSlug(), extractConditions()
├── builder.ts      # buildUrl(), buildPathFromFilters()
└── index.ts        # Central exports
```

## Testing URLs

Example test cases (framework not configured yet):

```typescript
// packages/lib/url/__tests__/url.test.ts

describe('parseSlug', () => {
  it('parses new vehicles', () => {
    const result = parseSlug(['new-vehicles']);
    expect(result.condition).toBe('new');
    expect(result.filters.condition).toEqual(['new']);
  });
  
  it('parses used vehicles with make', () => {
    const result = parseSlug(['used-vehicles', 'toyota']);
    expect(result.condition).toBe('used');
    expect(result.make).toBe('toyota');
  });
  
  it('parses certified-only (special case)', () => {
    const result = parseSlug(['used-vehicles', 'certified']);
    expect(result.condition).toBe('certified');
    expect(result.filters.condition).toEqual(['certified']);
  });
});
```

## Performance Considerations

### Server-Side Parsing

- Parsing happens during SSR
- Enables proper SEO metadata
- Allows cache keys based on URL

### Client-Side Building

- URL updates don't require page reload
- Smooth filter transitions
- Browser back/forward support

### Caching

URLs with different filters create different cache entries:

```
Cache Key: {hostname}:{path}:{bodyHash}

/new-vehicles/toyota/ → nissanofportland.com:/new-vehicles/toyota/:abc123
/new-vehicles/honda/  → nissanofportland.com:/new-vehicles/honda/:def456
```

## Troubleshooting

### URLs Not Parsing Correctly

**Check**:
1. Slug array order (condition, make, model)
2. Special certified case handling
3. Slug cleaning/normalization

### Filters Not Updating URL

**Check**:
1. `buildUrl()` includes all filters
2. Router navigation called
3. Query params properly formatted

### SEO Metadata Wrong

**Check**:
1. `generateMetadata()` implemented
2. Parsing logic matches URL structure
3. Fallback titles for empty states

## Related Documentation

- [SRP Overview](../features/srp/overview.md) - Search functionality
- [Condition Rules](../features/srp/condition-rules.md) - Detailed condition logic
- [API Reference](../api-reference/endpoints.md) - Filter API structure
