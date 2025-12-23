# API Reference Overview

## Introduction

The dt-nextjs platform integrates with Dealer Tower API to fetch vehicle inventory, dealer information, and manage forms/submissions.

## API Fundamentals

### Base URL

All API calls use the Dealer Tower public API:

```
https://api.dealertower.com/public/{hostname}
```

Example:
```
https://api.dealertower.com/public/www.nissanofportland.com
```

### Authentication

API calls use HTTP POST with JSON request bodies. No API keys required for public endpoints.

### Request Format

All requests must include:
- **Method**: POST
- **Headers**: `Content-Type: application/json`
- **Body**: JSON object with request parameters

```typescript
const response = await fetch(
  'https://api.dealertower.com/public/www.nissanofportland.com/v2/inventory/vehicles/srp/rows',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      page: 1,
      per_page: 20,
      filters: {
        condition: ['new'],
        make: ['Toyota'],
      },
    }),
  }
);
```

### Response Format

All responses return JSON with status and data:

```typescript
// Success response
{
  "status": "success",
  "data": { /* response data */ },
  "meta": {
    "total": 150,
    "page": 1,
    "per_page": 20,
    "total_pages": 8
  }
}

// Error response
{
  "status": "error",
  "message": "Invalid hostname",
  "error_code": "INVALID_HOSTNAME"
}
```

### Error Handling

Handle errors by checking response status:

```typescript
try {
  const response = await fetch(apiUrl, {
    method: 'POST',
    body: JSON.stringify(requestBody),
  });

  const json = await response.json();

  if (!response.ok) {
    console.error('API Error:', json.message);
    throw new Error(json.message);
  }

  return json.data;
} catch (error) {
  console.error('Request failed:', error);
  throw error;
}
```

### Rate Limiting

- **Limit**: 1000 requests per minute per hostname
- **Headers**: Response includes `X-RateLimit-Remaining`

```typescript
const remaining = response.headers.get('X-RateLimit-Remaining');
if (remaining === '0') {
  console.warn('Rate limit approaching');
}
```

## Caching Strategy

All API calls use Next.js fetch caching with:

```typescript
fetch(url, {
  method: 'POST',
  next: {
    revalidate: 21600,  // 6 hours TTL
    tags: [
      'hostname:dealer.com',
      'dealer:dealer-id',
      'srp:vehicles'
    ]
  }
})
```

### Cache Keys

Cache keys use:
- Hostname
- Endpoint path
- SHA-256 hash of request body (first 12 chars)

```
www.nissanofportland.com:/v2/inventory/vehicles/srp/rows:a1b2c3d4e5f6
```

### Cache Invalidation

Invalidate via webhook:

```bash
curl -X POST https://your-site.com/api/revalidate/ \
  -H "x-revalidation-secret: your-secret" \
  -H "Content-Type: application/json" \
  -d '{
    "hostname": "www.nissanofportland.com",
    "tags": ["srp:vehicles"]
  }'
```

## API Endpoints

### SRP (Search Results Page) Endpoints

#### Fetch Vehicle Rows

Get paginated list of vehicles.

**Endpoint**: `/v2/inventory/vehicles/srp/rows`

**Request**:
```typescript
{
  "page": 1,
  "per_page": 20,
  "sort_by": "price",
  "sort_order": "asc",
  "filters": {
    "condition": ["new", "used"],
    "make": ["Toyota", "Honda"],
    "model": ["Camry"],
    "body_type": ["sedan"],
    "price_min": 20000,
    "price_max": 50000,
    "mileage_max": 100000,
    "year_min": 2020
  }
}
```

**Response**:
```typescript
{
  "vehicles": [
    {
      "id": "12345",
      "vin": "1HGCV1F32LA123456",
      "year": 2022,
      "make": "Honda",
      "model": "Civic",
      "trim": "EX",
      "condition": "used",
      "mileage": 45000,
      "price": 28500,
      "imageUrl": "https://...",
      "isCertified": true,
      "inventory_id": "inv_123"
    }
  ],
  "total": 150,
  "page": 1,
  "per_page": 20
}
```

#### Fetch Available Filters

Get all available filter options.

**Endpoint**: `/v2/inventory/vehicles/srp/filters`

**Request**:
```typescript
{
  "current_filters": {
    "condition": ["used"]
  }
}
```

**Response**:
```typescript
{
  "filters": [
    {
      "id": "condition",
      "label": "Condition",
      "type": "multi-select",
      "options": [
        {
          "value": "new",
          "label": "New",
          "count": 45,
          "selected": false
        },
        {
          "value": "used",
          "label": "Used",
          "count": 105,
          "selected": true
        },
        {
          "value": "certified",
          "label": "Certified Pre-Owned",
          "count": 85,
          "selected": false
        }
      ]
    },
    {
      "id": "make",
      "label": "Make",
      "type": "multi-select",
      "options": [
        {
          "value": "Toyota",
          "label": "Toyota",
          "count": 34,
          "selected": false
        }
      ]
    }
  ]
}
```

#### Fetch Filter Values

Get values for a specific filter.

**Endpoint**: `/v2/inventory/vehicles/srp/filters/{filter_name}`

**Request**:
```typescript
{
  "current_filters": {
    "condition": ["used"]
  }
}
```

**Response**:
```typescript
{
  "filter_name": "make",
  "options": [
    {
      "value": "Toyota",
      "label": "Toyota",
      "count": 34
    },
    {
      "value": "Honda",
      "label": "Honda",
      "count": 28
    }
  ]
}
```

### Vehicle Detail Endpoints

#### Fetch Single Vehicle

Get detailed information for a specific vehicle.

**Endpoint**: `/v2/inventory/vehicles/{vehicle_id}`

**Request**: None (parameters in URL)

**Response**:
```typescript
{
  "id": "12345",
  "vin": "1HGCV1F32LA123456",
  "year": 2022,
  "make": "Honda",
  "model": "Civic",
  "trim": "EX",
  "condition": "used",
  "mileage": 45000,
  "price": 28500,
  "originalPrice": 32000,
  "description": "Well-maintained vehicle...",
  "images": [
    "https://...",
    "https://..."
  ],
  "features": [
    "Backup Camera",
    "Blind Spot Monitor",
    "Bluetooth"
  ],
  "specs": {
    "transmission": "Automatic",
    "engine": "1.8L 4-Cyl",
    "mpg": "33/42",
    "exterior_color": "Pearl Blue",
    "interior_color": "Black",
    "doors": 4,
    "seating": 5
  },
  "pricing": {
    "base_price": 25000,
    "fees": 800,
    "discount": -2000,
    "total": 28500
  },
  "inventory": {
    "stock_number": "INV-2024-001",
    "location": "Main Lot"
  }
}
```

## Dealer Information Endpoints

### Website Information API

Get dealer metadata and configuration.

**Endpoint**: `/v2/dealers/website-information`

**Request**:
```typescript
{
  "hostname": "www.nissanofportland.com"
}
```

**Response**:
```typescript
{
  "dealer_id": "494a1788-0619-4a53-99c1-1c9f9b2e8fcc",
  "name": "Nissan of Portland",
  "address": "123 Auto Street, Portland, OR 97201",
  "phone": "(503) 555-0123",
  "email": "sales@nissanofportland.com",
  "website": "https://www.nissanofportland.com",
  "hours": {
    "monday": "9:00 AM - 8:00 PM",
    "tuesday": "9:00 AM - 8:00 PM",
    "wednesday": "9:00 AM - 8:00 PM",
    "thursday": "9:00 AM - 8:00 PM",
    "friday": "9:00 AM - 8:00 PM",
    "saturday": "9:00 AM - 6:00 PM",
    "sunday": "11:00 AM - 5:00 PM"
  },
  "scripts": {
    "head": [
      {
        "type": "script",
        "content": "<script async src='...'></script>"
      }
    ],
    "before_body_close": [
      {
        "type": "script",
        "content": "<script>...</script>"
      }
    ]
  },
  "branding": {
    "primary_color": "#1e40af",
    "secondary_color": "#0891b2",
    "logo_url": "/api/assets/logo.png"
  }
}
```

## Form Submission Endpoints

### Submit Form

Generic form submission endpoint.

**Endpoint**: `/v2/forms/submit`

**Request**:
```typescript
{
  "form_type": "test_drive",
  "data": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "(503) 555-0123",
    "vehicleId": "12345",
    "message": "Optional message"
  }
}
```

**Response**:
```typescript
{
  "success": true,
  "submission_id": "sub_12345",
  "message": "Thank you for your submission"
}
```

## Implementation Examples

### Fetch SRP Vehicles in Server Component

```typescript
// app/(srp)/new-vehicles/[[...slug]]/page.tsx
import { fetchSRPRows } from '@dealertower/lib/api/srp';
import { getTenantContext } from '@dealertower/lib/tenant/server-context';

export default async function NewVehiclesPage() {
  const { hostname } = await getTenantContext();

  const vehicles = await fetchSRPRows(
    { 
      page: 1, 
      filters: { condition: ['new'] } 
    },
    hostname
  );

  return <VehicleGrid vehicles={vehicles} />;
}
```

### Fetch Single Vehicle (VDP)

```typescript
// app/vehicle/[id]/page.tsx
import { fetchVehicle } from '@dealertower/lib/api/vehicles';
import { getTenantContext } from '@dealertower/lib/tenant/server-context';

export default async function VehicleDetailPage({ params }) {
  const { hostname } = await getTenantContext();

  const vehicle = await fetchVehicle(params.id, hostname);

  return <VehicleDetail vehicle={vehicle} />;
}
```

### Fetch Dealer Info

```typescript
import { fetchWebsiteInformation } from '@dealertower/lib/api/dealer';

const dealerInfo = await fetchWebsiteInformation(dealerId);
console.log(dealerInfo.name);
console.log(dealerInfo.hours);
```

## Rate Limits & Quotas

| Endpoint | Limit | Window |
|----------|-------|--------|
| `/v2/inventory/vehicles/srp/rows` | 500 | 1 minute |
| `/v2/inventory/vehicles/srp/filters` | 500 | 1 minute |
| `/v2/dealers/website-information` | 1000 | 1 minute |
| `/v2/forms/submit` | 100 | 1 minute |

## Troubleshooting

### 404 Hostname Not Found

**Problem**: API returns "Hostname not found"

**Solutions**:
1. Verify hostname in database
2. Check URL is correctly formatted
3. Ensure hostname matches dealer config

### 429 Too Many Requests

**Problem**: Rate limited

**Solutions**:
1. Implement request queuing
2. Cache responses aggressively
3. Contact support for higher limits

### Empty Results

**Problem**: API returns empty vehicle list

**Solutions**:
1. Check filter values are valid
2. Verify dealer has inventory
3. Check API response in Network tab

## Related Documentation

- [API Optimization](../api-reference/endpoints.md) - Detailed endpoint documentation
- [Website Information API](../api-reference/website-information.md) - Dealer metadata
- [Caching](../core-concepts/caching.md) - Cache strategies
- [Multi-Tenancy](../core-concepts/multi-tenancy.md) - Hostname resolution
