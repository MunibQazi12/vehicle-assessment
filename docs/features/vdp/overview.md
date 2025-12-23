# Vehicle Detail Page (VDP) Overview

## What is the VDP?

The Vehicle Detail Page (VDP) displays comprehensive information about a single vehicle: specs, pricing, media, and dealer contact options.

## Access

**URL Pattern**: `/vehicle/{vin}/`

**Example**: `/vehicle/1HGBH41JXMN109186/`

**From SRP**: Clicking a vehicle card navigates to VDP

## Key Sections

### Vehicle Header
- Vehicle name (Year Make Model Trim)
- Primary image
- Price (prominently displayed)
- Condition badge (New / Used / Certified)
- Status badges (Special, New Arrival, In Transit, Sale Pending)

### Image Gallery
- Multiple images with lightbox/carousel
- Thumbnail navigation
- Click to expand
- Previous/Next controls

### Specifications
- **Basic**: Year, Make, Model, Trim, VIN, Stock #
- **Engine**: Engine type, horsepower, torque
- **Transmission**: Type, speeds
- **Drive**: Drivetrain, traction control
- **Dimensions**: Length, width, height, weight
- **Features**: Available features and technologies
- **History**: CARFAX / AutoCheck (if available)

### Pricing
- Base price
- Monthly payment (if financing available)
- Trade-in value (if applicable)
- Extended warranty options

### Contact & CTA
- "Get Pre-Approved" button (forms)
- "Schedule Test Drive" button (forms)
- "Request More Info" button (forms)
- Dealer phone number
- Business hours

## Architecture

### Server Components

```typescript
// app/vehicle/[vin]/page.tsx

export default async function VehiclePage({ 
  params 
}: { 
  params: Promise<{ vin: string }> 
}) {
  const resolvedParams = await params;
  const vehicle = await fetchVehicleDetails(
    dealerId,
    resolvedParams.vin,
    hostname
  );
  
  if (!vehicle) {
    notFound(); // 404
  }
  
  return (
    <>
      <VehicleHeader vehicle={vehicle} />
      <VehicleGallery images={vehicle.images} />
      <VehicleSpecs vehicle={vehicle} />
      <VehicleActions vehicle={vehicle} />
    </>
  );
}
```

**Components**:
- `VehicleHeader.tsx` - Top section with image + price
- `VehicleGallery.tsx` - Full image carousel
- `VehicleSpecs.tsx` - Detailed specifications
- `VehicleActions.tsx` - CTA buttons and contact info

### Client Components

Interactive features:
- Image gallery lightbox
- Image zoom
- Contact form submission
- Favorite toggle

## Data Fetching

### Fetch Vehicle Details

```typescript
import { fetchVehicleDetails } from '@dealertower/lib/api/srp';

const vehicle = await fetchVehicleDetails(
  dealerId,
  vin,
  hostname
);

// Returns:
{
  vin: '1HGBH41JXMN109186',
  year: 2023,
  make: 'Honda',
  model: 'Accord',
  trim: 'EX',
  price: 28500,
  mileage: 15000,
  exterior_color: 'Black',
  interior_color: 'Gray',
  body_type: 'Sedan',
  fuel_type: 'Gasoline',
  transmission: 'Automatic',
  engine: '2.0L 4-Cylinder',
  drivetrain: 'FWD',
  images: [
    { url: 'https://...', alt: 'Front view' },
    // ...
  ],
  features: ['Sunroof', 'Leather Seats', ...],
  description: '...',
  stock_number: 'ABC123',
  status: 'new_arrival',
  is_special: false,
  // ... more fields
}
```

## Caching

VDP data is cached like SRP data:

**Cache Key**: `{hostname}:{path}:{vin}`

**Cache Tags**:
- `hostname:{hostname}`
- `dealer:{dealerId}`
- `vehicle:{vin}`

**TTL**: 6 hours (21,600 seconds)

## SEO Optimization

### Metadata

```typescript
export async function generateMetadata({ params }) {
  const vehicle = await fetchVehicleDetails(dealerId, params.vin, hostname);
  
  return {
    title: `${vehicle.year} ${vehicle.make} ${vehicle.model} - ${vehicle.price}`,
    description: `${vehicle.description} Stock: ${vehicle.stock_number}. Call for details.`,
    openGraph: {
      title: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
      description: vehicle.description,
      images: [vehicle.images[0].url],
      type: 'product',
    },
  };
}
```

### Structured Data

Add JSON-LD schema for search engines:

```typescript
function VehicleSchemaScript({ vehicle }) {
  const schema = {
    '@context': 'https://schema.org/',
    '@type': 'Car',
    name: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
    image: vehicle.images.map(img => img.url),
    description: vehicle.description,
    offers: {
      '@type': 'Offer',
      price: vehicle.price,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
    vehicleIdentificationNumber: vehicle.vin,
    mileageFromOdometer: vehicle.mileage,
  };
  
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
```

## Related Pages

### Back to Results
Link back to SRP with same filters:

```typescript
function BackToResults() {
  const searchParams = useSearchParams();
  const condition = searchParams.get('condition') || 'new';
  
  return (
    <Link href={`/${condition}-vehicles/?${searchParams}`}>
      ← Back to Results
    </Link>
  );
}
```

### Similar Vehicles
Show vehicles with similar specs:

```typescript
async function SimilarVehicles({ vehicle }) {
  const similar = await fetchSimilarVehicles(
    dealerId,
    {
      make: vehicle.make,
      model: vehicle.model,
      year_min: vehicle.year - 2,
      year_max: vehicle.year + 2,
      exclude_vin: vehicle.vin,
      limit: 5,
    },
    hostname
  );
  
  return (
    <section>
      <h2>Similar Vehicles</h2>
      <VehicleGrid vehicles={similar} />
    </section>
  );
}
```

## Responsive Design

- **Mobile**: Single column, stacked sections, enlarged touch targets
- **Tablet**: Two column (image + info side-by-side)
- **Desktop**: Full layout with image gallery on left, specs on right

## Performance

### Image Optimization
- Use Next.js `<Image>` component
- Lazy load below-fold images
- Serve appropriate sizes for responsive design

### Code Splitting
- Gallery component lazy-loaded
- Forms loaded on demand
- Lightbox script loaded on first image click

## Accessibility

- Alt text for all images
- Semantic HTML
- ARIA labels for interactive elements
- Keyboard navigation for gallery
- High contrast for prices and specs

## Common Customizations

### Custom Vehicle Card in Similar Section

Create `dealers/{uuid}/components/SimilarVehicleCard.tsx`:

```typescript
export function SimilarVehicleCard({ vehicle }) {
  return <div>{/* custom card */}</div>;
}
```

### Custom VDP Layout

Create `dealers/{uuid}/pages/VehicleDetailPage.tsx`:

```typescript
export async function VehicleDetailPage({ vehicle }) {
  return <div>{/* custom layout */}</div>;
}
```

## Troubleshooting

### Vehicle Not Found
- Verify VIN is correct
- Check dealer has this vehicle
- Ensure vehicle hasn't been sold
- Check API response

### Images Not Loading
- Verify image URLs are accessible
- Check CDN/image server status
- Ensure correct CORS headers
- Check browser console for errors

### Slow Page Load
- Check image sizes
- Verify cache is working
- Monitor API response times
- Optimize schema script size

## Analytics

Track VDP interactions:

```typescript
'use client';
import { useEffect } from 'react';

export function VDPAnalytics({ vin, vehicle }) {
  useEffect(() => {
    // Track page view
    gtag.pageview({
      page_path: `/vehicle/${vin}`,
      page_title: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
    });
  }, [vin, vehicle]);
  
  function trackFormClick(formType) {
    gtag.event('form_click', { form_type: formType, vin });
  }
  
  return <button onClick={() => trackFormClick('test_drive')}>
    Schedule Test Drive
  </button>;
}
```

## Related Documentation

- [SRP Overview](./srp/overview.md) - Back to search
- [Forms System](./forms/overview.md) - Contact forms
- [URL Routing](../core-concepts/url-routing.md) - URL structure
- [API Reference](../api-reference/endpoints.md) - API endpoints
