# API Endpoints Reference

## Complete API Endpoint Documentation

All endpoints are POST requests to: `https://api.dealertower.com/public/{hostname}`

## SRP (Search Results Page) Endpoints

### POST /v2/inventory/vehicles/srp/rows

Fetch paginated vehicle inventory with advanced filtering.

**Request Parameters**:

```typescript
interface SRPRowsRequest {
  page?: number;              // Page number (1-indexed), default: 1
  per_page?: number;          // Items per page, default: 20, max: 100
  sort_by?: string;           // "price" | "mileage" | "year" | "name" | "newest"
  sort_order?: string;        // "asc" | "desc"
  search?: string;            // Free text search (VIN, make, model)
  filters?: {
    condition?: string[];     // "new" | "used" | "certified"
    make?: string[];          // Manufacturer (e.g., "Toyota", "Honda")
    model?: string[];         // Model name (e.g., "Camry", "Civic")
    body_type?: string[];     // "sedan" | "suv" | "truck" | "coupe" | "van"
    year_min?: number;        // Minimum year
    year_max?: number;        // Maximum year
    price_min?: number;       // Minimum price
    price_max?: number;       // Maximum price
    mileage_max?: number;     // Maximum mileage
    transmission?: string[];  // "automatic" | "manual" | "cvt"
    engine_type?: string[];   // "electric" | "hybrid" | "gas" | "diesel"
    exterior_color?: string[];
    interior_color?: string[];
    features?: string[];      // Feature IDs
    trim?: string[];          // Trim levels
  };
}
```

**Response**:

```typescript
interface SRPRowsResponse {
  vehicles: Array<{
    id: string;
    vin: string;
    year: number;
    make: string;
    model: string;
    trim: string;
    condition: "new" | "used" | "certified";
    mileage: number;
    price: number;
    originalPrice?: number;
    discount?: number;
    imageUrl: string;
    badge?: string;           // "Featured" | "Just Arrived" | etc.
    isCertified: boolean;
    inventoryId: string;
  }>;
  meta: {
    total: number;
    page: number;
    per_page: number;
    total_pages: number;
  };
}
```

**Example Request**:

```typescript
const response = await fetch(
  'https://api.dealertower.com/public/www.nissanofportland.com/v2/inventory/vehicles/srp/rows',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      page: 1,
      per_page: 20,
      sort_by: 'price',
      sort_order: 'asc',
      filters: {
        condition: ['used'],
        make: ['Toyota'],
        price_min: 15000,
        price_max: 35000,
      }
    })
  }
);

const data = await response.json();
```

**Caching**:

```typescript
fetch(url, {
  method: 'POST',
  body: JSON.stringify(body),
  next: {
    revalidate: 21600,  // 6 hours
    tags: [
      'hostname:www.nissanofportland.com',
      'dealer:nissanofportland.com',
      'srp:vehicles'
    ]
  }
})
```

---

### POST /v2/inventory/vehicles/srp/filters

Fetch available filter options with counts.

**Request Parameters**:

```typescript
interface SRPFiltersRequest {
  current_filters?: {
    condition?: string[];
    make?: string[];
    model?: string[];
    [key: string]: any;
  };
  search?: string;  // Optional search term
}
```

**Response**:

```typescript
interface SRPFiltersResponse {
  filters: Array<{
    id: string;              // "condition" | "make" | "model" | etc.
    label: string;           // Display name
    type: "multi-select" | "range" | "boolean";
    options: Array<{
      value: string | number;
      label: string;
      count: number;        // Available vehicles with this filter
      selected: boolean;    // Currently selected
      disabled?: boolean;   // Cannot be selected
    }>;
  }>;
}
```

**Example Request**:

```typescript
const response = await fetch(
  'https://api.dealertower.com/public/www.nissanofportland.com/v2/inventory/vehicles/srp/filters',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      current_filters: {
        condition: ['used']
      }
    })
  }
);

const data = await response.json();
// Returns available makes, models, prices, etc. for used vehicles
```

---

### POST /v2/inventory/vehicles/srp/filters/{filter_name}

Fetch values for a specific filter.

**URL Parameters**:

| Parameter | Description |
|-----------|-------------|
| `filter_name` | Filter ID (e.g., "make", "model", "body_type") |

**Request Parameters**:

```typescript
interface FilterValuesRequest {
  current_filters?: {
    [key: string]: any;
  };
  search?: string;
  limit?: number;  // Max 1000
  offset?: number; // Pagination
}
```

**Response**:

```typescript
interface FilterValuesResponse {
  filter_name: string;
  options: Array<{
    value: string;
    label: string;
    count: number;
  }>;
  meta: {
    total: number;
  };
}
```

**Example Request**:

```typescript
// Get all makes for used vehicles
const response = await fetch(
  'https://api.dealertower.com/public/www.nissanofportland.com/v2/inventory/vehicles/srp/filters/make',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      current_filters: {
        condition: ['used']
      }
    })
  }
);

const { options } = await response.json();
// Returns: [
//   { value: "Toyota", label: "Toyota", count: 34 },
//   { value: "Honda", label: "Honda", count: 28 },
//   ...
// ]
```

---

## Vehicle Detail Endpoints

### POST /v2/inventory/vehicles/{vehicle_id}

Get detailed information for a single vehicle.

**URL Parameters**:

| Parameter | Description |
|-----------|-------------|
| `vehicle_id` | Vehicle ID or VIN |

**Request Parameters**: None

**Response**:

```typescript
interface VehicleDetailResponse {
  id: string;
  vin: string;
  year: number;
  make: string;
  model: string;
  trim: string;
  condition: "new" | "used" | "certified";
  
  // Pricing
  pricing: {
    base_price: number;
    msrp?: number;
    original_price?: number;
    selling_price: number;
    discount?: number;
    fees?: number;
    trade_in_value?: number;
    total: number;
  };
  
  // Inventory
  stock_number: string;
  mileage: number;
  location: string;
  listed_date: string;
  
  // Images
  images: string[];
  thumbnail: string;
  
  // Specifications
  specs: {
    transmission: string;
    engine: string;
    mpg_city: number;
    mpg_highway: number;
    mpg_combined: number;
    exterior_color: string;
    interior_color: string;
    doors: number;
    seating: number;
    fuel_type: string;
    body_type: string;
    drive_type: string;
  };
  
  // Description & Features
  description: string;
  features: string[];
  warranty?: {
    type: string;
    duration: string;
  };
  
  // History
  carfax_report?: {
    url: string;
    owned_count: number;
    accident_count: number;
  };
  
  // Contact
  contact: {
    dealer_id: string;
    dealer_name: string;
    phone: string;
    email: string;
  };
}
```

**Example Request**:

```typescript
const vehicleId = '12345';
const response = await fetch(
  `https://api.dealertower.com/public/www.nissanofportland.com/v2/inventory/vehicles/${vehicleId}`,
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }
);

const vehicle = await response.json();
```

---

## Dealer Information Endpoints

### POST /v2/dealers/website-information

Get dealership metadata and configuration.

**Request Parameters**:

```typescript
interface WebsiteInformationRequest {
  hostname: string;  // Required: e.g., "www.nissanofportland.com"
}
```

**Response**:

```typescript
interface WebsiteInformationResponse {
  dealer_id: string;
  name: string;
  brand: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  email: string;
  website: string;
  logo_url: string;
  
  // Hours of operation
  hours: {
    monday: string;      // e.g., "9:00 AM - 8:00 PM"
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
    holidays?: Record<string, string>;
  };
  
  // Business information
  established: number;  // Year
  service_available: boolean;
  financing_available: boolean;
  trade_in_available: boolean;
  
  // Website scripts (GTM, chat, etc.)
  scripts: {
    head: Array<{
      type: "script" | "link" | "meta";
      content: string;
      attributes?: Record<string, string>;
    }>;
    before_body_close: Array<any>;
    after_body_open?: Array<any>;
  };
  
  // Branding
  colors: {
    primary: string;    // Hex color
    secondary: string;
    accent?: string;
  };
  
  // Certified logos (OEM badges)
  certifications: Array<{
    name: string;
    logo_url: string;
    type: "manufacturer" | "program";
  }>;
}
```

**Example Request**:

```typescript
const response = await fetch(
  'https://api.dealertower.com/public/www.nissanofportland.com/v2/dealers/website-information',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      hostname: 'www.nissanofportland.com'
    })
  }
);

const dealerInfo = await response.json();
console.log(dealerInfo.hours);  // Get hours of operation
console.log(dealerInfo.scripts); // Get GTM, chat scripts, etc.
```

---

## Form Submission Endpoints

### POST /v2/forms/test-drive

Submit a test drive request.

**Request Parameters**:

```typescript
interface TestDriveRequest {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  preferred_date: string;      // ISO date format: YYYY-MM-DD
  preferred_time?: string;     // HH:MM format
  vehicle_id: string;
  message?: string;
}
```

**Response**:

```typescript
interface FormSubmissionResponse {
  success: boolean;
  submission_id: string;
  message: string;
  confirmation_number?: string;
}
```

---

### POST /v2/forms/pre-approved

Submit a financing pre-approval request.

**Request Parameters**:

```typescript
interface PreApprovedRequest {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  desired_loan_amount: number;
  credit_score: "excellent" | "good" | "fair" | "poor";
  employment_status: "employed" | "self-employed" | "retired";
  zip_code: string;
  trade_in_value?: number;
}
```

---

### POST /v2/forms/contact

Submit a general contact form.

**Request Parameters**:

```typescript
interface ContactRequest {
  name: string;
  email: string;
  phone: string;
  inquiry_type: string;
  message: string;
  vehicle_id?: string;
}
```

---

## Search & Lookup

### POST /v2/inventory/search

Search vehicles by VIN or keywords.

**Request Parameters**:

```typescript
interface SearchRequest {
  query: string;        // VIN or keywords
  limit?: number;       // Default: 10
}
```

**Response**:

```typescript
interface SearchResponse {
  results: Array<{
    id: string;
    vin: string;
    title: string;      // "2022 Honda Civic EX"
    price: number;
    image: string;
    match_score: number; // 0-100
  }>;
}
```

---

## Error Responses

All endpoints return error responses in this format:

```typescript
interface ErrorResponse {
  status: "error";
  message: string;
  error_code: string;
  details?: any;
}
```

**Common Error Codes**:

| Code | Message | Solution |
|------|---------|----------|
| `INVALID_HOSTNAME` | Hostname not found | Verify hostname is registered |
| `RATE_LIMITED` | Too many requests | Implement backoff/caching |
| `INVALID_FILTER` | Unknown filter parameter | Check filter names |
| `VEHICLE_NOT_FOUND` | Vehicle ID doesn't exist | Verify vehicle ID |
| `INVALID_REQUEST` | Malformed request | Check JSON syntax |

---

## Response Headers

All responses include:

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 995
X-RateLimit-Reset: 1234567890
X-Request-Id: req_12345
```

---

## Related Documentation

- [API Overview](./overview.md) - Fundamentals and authentication
- [Website Information API](./website-information.md) - Dealer configuration
- [SRP Reference](../features/srp/overview.md) - Using SRP API in pages
- [Caching](../core-concepts/caching.md) - Cache optimization
