# Search Results Page (SRP) Overview

## What is the SRP?

The Search Results Page (SRP) is the main vehicle inventory browsing interface. Users filter and sort vehicles, with results updating dynamically.

## Key Features

### Filter System
- **Condition**: New / Used / Certified
- **Make/Model**: Vehicle make and model selection
- **Year**: Model year range
- **Price**: Price range filtering
- **Colors**: Exterior and interior colors
- **Specs**: Body type, transmission, fuel type, engine, drivetrain
- **Status**: Special pricing, new arrivals, in transit, sale pending
- **Custom**: Additional dealer-specific filters

### Sorting & Pagination
- Sort by: Price, Mileage, Year, Name
- Sort order: Ascending / Descending
- Pagination: Load more or page numbers
- Infinite scroll support

### Search
- Full-text search across vehicle names and descriptions
- Real-time search suggestions
- Combined with filters

## URL Structure

```
/{condition}/{make}/{model}/?filters=values
```

Examples:
- `/new-vehicles/` - All new vehicles
- `/used-vehicles/toyota/camry/` - Used Toyota Camry
- `/used-vehicles/certified/?color=red,blue` - Certified with colors

See [URL Routing](../../core-concepts/url-routing.md) for complete details.

## Architecture

### Server Components

**Page Component** (`app/(srp)/new-vehicles/[[...slug]]/page.tsx`)
- Parse URL slug for primary filters
- Fetch initial data from API
- Pass to client components

```typescript
export default async function NewVehiclesPage({ params, searchParams }) {
  const { filters, make, model } = parseSlug(params.slug);
  const data = await fetchSRPRows(dealerId, filters, hostname);
  
  return (
    <>
      <FiltersSidebar initialFilters={filters} />
      <VehicleGrid vehicles={data.vehicles} />
    </>
  );
}
```

**Components**:
- `SRPSharedPage.tsx` - Shared logic for new/used routes
- `VehicleGrid.tsx` - Server wrapper for vehicle list
- `VehicleCard.tsx` - Individual vehicle card (client)
- `FiltersSidebar.tsx` - Filter controls (server + client)

### Client Components

Interactive components that handle user input:
- Filter selection
- Sorting
- Pagination/infinite scroll
- Search input

```typescript
'use client';

export function FiltersSidebar({ initialFilters }) {
  const [filters, setFilters] = useState(initialFilters);
  
  function handleFilterChange(newFilters) {
    const url = buildUrl(newFilters);
    router.push(url);
  }
  
  return <div>{/* filter UI */}</div>;
}
```

## Data Flow

### Initial Load
```
URL → Parse Slug → Fetch API → Render Page with Data
```

### Filter Changes
```
User Action → Update Filters → Build URL → Router Push → API Call → Update UI
```

### Infinite Scroll
```
User Scrolls → Detect Bottom → Fetch Next Page → Append Results
```

## API Integration

### Fetch Vehicles

```typescript
import { fetchSRPRows } from '@dealertower/lib/api/srp';

const response = await fetchSRPRows(
  dealerId,
  {
    page: 1,
    conditions: ['new'],
    make: 'toyota',
    model: 'camry',
    year_min: 2020,
    year_max: 2024,
  },
  hostname
);

// Returns:
{
  vehicles: [{ vin, name, price, image, ... }],
  total: 245,
  page: 1,
  per_page: 20,
  pages: 13
}
```

### Fetch Filters

```typescript
import { fetchSRPFilters } from '@dealertower/lib/api/srp';

const filters = await fetchSRPFilters(dealerId, hostname);

// Returns:
{
  conditions: [
    { value: 'new', label: 'New', count: 125 },
    { value: 'used', label: 'Used', count: 340 },
  ],
  makes: [
    { value: 'toyota', label: 'Toyota', count: 89 },
    { value: 'honda', label: 'Honda', count: 76 },
  ],
  // ... more filters
}
```

### Fetch Filter Values

```typescript
const colorOptions = await fetchSRPFilterValues(
  dealerId,
  'ext_color',
  hostname
);

// Returns:
[
  { value: 'black', label: 'Black', count: 34 },
  { value: 'red', label: 'Red', count: 28 },
  // ...
]
```

## Caching

All SRP data is cached:

**Cache Key**: `{hostname}:{path}:{bodyHash}`

**Cache Tags**:
- `hostname:{hostname}`
- `dealer:{dealerId}`
- `srp:vehicles`
- `srp:filters`

**TTL**: 6 hours (21,600 seconds)

**Invalidation**: Webhook to `/api/revalidate/` with tag

Example:
```bash
curl -X POST https://site.com/api/revalidate/ \
  -H "x-revalidation-secret: SECRET" \
  -d '{"tags": ["srp:vehicles"]}'
```

## Performance Optimization

### Server-Side Rendering
- Initial load renders with data
- SEO-friendly HTML
- No layout shift

### Lazy Loading
- Images use Next.js `<Image>` with lazy loading
- Below-fold content loads on demand
- Suspense boundaries for skeleton loaders

### Code Splitting
- Filter components lazy-loaded
- Modal dialogs code-split
- Infinite scroll loader bundled separately

### Caching Strategy
- API responses cached per filter combination
- Browser caching for images
- CDN caching for static assets

## Responsive Design

- **Mobile**: Single column, stacked filters
- **Tablet**: Two column layout
- **Desktop**: Sidebar + grid layout

Breakpoints:
- `sm:` (640px) - Mobile
- `md:` (768px) - Tablet
- `lg:` (1024px) - Desktop

## Accessibility

- Semantic HTML (`<nav>`, `<section>`, `<button>`)
- ARIA labels for filters
- Keyboard navigation
- Color contrast compliance
- Screen reader support

## Testing

Manual testing checklist:
- [ ] Filter selection works
- [ ] URL updates correctly
- [ ] Back/forward browser buttons work
- [ ] Pagination works
- [ ] Search functions
- [ ] Responsive layout on mobile
- [ ] Images load correctly
- [ ] Empty states handled
- [ ] Error boundaries catch failures

## Common Customizations

### Custom Filter
Add new filter type to `packages/lib/api/srp.ts`:

```typescript
export async function fetchCustomFilter(dealerId, hostname) {
  // API call
}
```

### Custom Vehicle Card
Create `dealers/{uuid}/components/VehicleCard.tsx`:

```typescript
export function VehicleCard({ vehicle }) {
  return <div>{/* custom card */}</div>;
}
```

### Custom Sorting
Add to `packages/lib/url/builder.ts`:

```typescript
const sortOptions = [
  { value: 'price', label: 'Price' },
  { value: 'mileage', label: 'Mileage' },
  { value: 'custom_field', label: 'Custom' }, // New
];
```

## Troubleshooting

### Filters Not Updating
- Check URL is being built correctly
- Verify API endpoint works
- Check browser console for errors
- Verify cache isn't stale

### Vehicles Not Appearing
- Verify dealer has inventory
- Check API response
- Ensure filters are valid
- Check for errors in console

### Page Too Slow
- Check image sizes
- Verify cache is working
- Monitor API response times
- Check browser DevTools Performance tab

## Related Documentation

- [URL Routing](../../core-concepts/url-routing.md) - URL structure
- [Filtering System](./filtering.md) - Advanced filtering
- [Condition Rules](./condition-rules.md) - New/Used/Certified logic
- [Caching](../../core-concepts/caching.md) - Cache strategy
- [API Reference](../../api-reference/endpoints.md) - API endpoints
