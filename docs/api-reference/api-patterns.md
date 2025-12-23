# API Request Patterns & Standards

**Version:** 1.0.0  
**Last Updated:** December 18, 2025

This document defines the unified patterns and standards for all API requests in the Dealer Tower Next.js application. **All new API functions MUST follow these patterns.**

---

## Table of Contents

1. [Core Principles](#core-principles)
2. [File Organization](#file-organization)
3. [Function Signature Standard](#function-signature-standard)
4. [Using cachedFetch](#using-cachedfetch)
5. [React Cache Wrapper](#react-cache-wrapper)
6. [Error Handling Strategies](#error-handling-strategies)
7. [Logging Standards](#logging-standards)
8. [Data Transformation Pattern](#data-transformation-pattern)
9. [Complete Examples](#complete-examples)
10. [Testing Requirements](#testing-requirements)
11. [Migration Checklist](#migration-checklist)

---

## Core Principles

### 1. **Use `cachedFetch` for All API Calls**

The `cachedFetch` helper in `packages/lib/api/client.ts` provides:
- ✅ Automatic Next.js cache configuration
- ✅ Centralized retry logic with exponential backoff
- ✅ Consistent timeout handling (10 seconds default)
- ✅ Unified logging format
- ✅ Tag-based cache invalidation
- ✅ Error handling strategies (throw, return empty, etc.)

**Never use raw `fetch()` for Dealer Tower API calls.** Use `cachedFetch` instead.

### 2. **Hostname-First Parameter Order**

All API functions follow this signature pattern:

```typescript
export async function fetchX(
  hostname: string,           // Always first - tenant context
  params: RequestType,        // Request-specific parameters
  options?: FetchOptions      // Optional configuration (rarely needed)
): Promise<ResponseType>
```

**Why?** Hostname identifies the tenant and is the most critical context for multi-tenancy.

### 3. **Type Safety First**

- Import request/response types from `@dealertower/types/*`
- Use generic type parameters: `cachedFetch<ResponseType>`
- Define interfaces for complex nested types
- Never use `any` types

---

## File Organization

### Directory Structure

```
packages/lib/api/
├── client.ts          # Base cachedFetch function
├── dealer.ts          # Dealer info, scripts, staff
├── srp.ts             # Vehicle inventory, filters
├── vdp.ts             # Vehicle details, similars
├── lineup.ts          # Lineup/brands data
├── forms.ts           # Form definitions
└── specials.ts        # Special offers
```

### File Header Template

Every API file must start with:

```typescript
/**
 * [Domain] API Functions
 * [Brief description of what this file handles]
 */

import { cachedFetch, getAPIBaseURL } from "./client";
import type { /* Import types from @dealertower/types */ } from "@dealertower/types/api";
```

---

## Function Signature Standard

### Template

```typescript
/**
 * [Action description]
 * 
 * @param hostname - The dealer hostname (e.g., www.nissanofportland.com)
 * @param params - [Description of parameters]
 * @returns [Description of return value]
 * 
 * @example
 * ```ts
 * const result = await fetchExample('www.nissanofportland.com', {
 *   filter: 'value'
 * });
 * console.log(result.data);
 * ```
 */
export async function fetchExample(
  hostname: string,
  params: RequestType
): Promise<ResponseType> {
  const url = `${getAPIBaseURL(hostname)}/v2/endpoint`;

  return cachedFetch<ResponseType>(url, params, {
    hostname,
    dealerIdentifier: hostname.replace(/^www\./, ''),
    dataType: "vehicles",
    domain: "SRP",
  });
}
```

### JSDoc Requirements

**Required tags:**
- `@param` for each parameter with clear description
- `@returns` describing the return value
- `@example` showing typical usage

**Optional tags:**
- `@throws` if function throws specific errors
- `@deprecated` if function is being phased out

---

## Using cachedFetch

### Available dataTypes

```typescript
type DataType = 
  | "vehicles"       // SRP vehicle rows
  | "filters"        // SRP filters
  | "forms"          // Form definitions
  | "lineup"         // Lineup/brands
  | "dealer"         // Dealer information
  | "dealer-staff"   // Staff information
  | "vdp"            // Vehicle detail page
  | "vdp-similars"   // Similar vehicles
  | "specials";      // Special offers
```

Each `dataType` automatically generates appropriate cache tags using tag generator functions from `packages/lib/cache/tags.ts`.

### Basic Usage

```typescript
export async function fetchSRPRows(
  hostname: string,
  params: SRPRowsRequest
): Promise<SRPRowsResponse> {
  const url = `${getAPIBaseURL(hostname)}/v2/inventory/vehicles/srp/rows`;

  return cachedFetch<SRPRowsResponse>(url, params as Record<string, unknown>, {
    hostname,
    dealerIdentifier: hostname.replace(/^www\./, ''),
    dataType: "vehicles",
    domain: "SRP",
  });
}
```

### Advanced Options

```typescript
// Custom cache tags (in addition to auto-generated ones)
cachedFetch<FormAPIResponse>(url, {}, {
  hostname,
  dealerIdentifier,
  dataType: "forms",
  cacheTags: [`form:${formId}`], // Additional specific tag
  domain: "Forms",
});

// Throw 404 errors with status code (for not-found page)
cachedFetch<VDPResponse>(url, {}, {
  hostname,
  dealerIdentifier,
  dataType: "vdp",
  throwOn404: true, // Will throw error with .status = 404
  domain: "VDP",
});

// Return empty value on error instead of throwing
cachedFetch<VDPSimilarsResponse>(url, {}, {
  hostname,
  dealerIdentifier,
  dataType: "vdp-similars",
  returnEmptyOnError: true, // Returns [] or {} on error
  domain: "VDP",
});

// Custom timeout (default is 10000ms)
cachedFetch<SlowResponse>(url, {}, {
  hostname,
  dealerIdentifier,
  dataType: "vehicles",
  timeout: 30000, // 30 seconds
  domain: "SRP",
});

// Custom revalidation period
cachedFetch<Response>(url, {}, {
  hostname,
  dealerIdentifier,
  dataType: "vehicles",
  revalidate: 3600, // 1 hour
  domain: "SRP",
});
```

### Cache Tag Strategy

**Automatic tags by dataType:**
- `vehicles` → `{dealer_id}:srp-rows`
- `filters` → `{dealer_id}:srp-filters`
- `lineup` → `{dealer_id}:lineup`
- `dealer` → `{dealer_id}:dealer`
- `dealer-staff` → `{dealer_id}:dealer-staff`
- `vdp-similars` → `{dealer_id}:vdp-similars`
- `specials` → `{dealer_id}:specials`
- `forms` → uses `cacheTags` parameter (e.g., `form:form_id`)
- `vdp` → uses `cacheTags` parameter (e.g., `{dealer_id}:vdp:{slug}`)

**Custom tags** can be added via `cacheTags` option and will be merged with automatic tags.

---

## React Cache Wrapper

### When to Use `cache()`

Wrap functions with React's `cache()` when:
- ✅ Function is called multiple times in same render (e.g., `generateMetadata()` + page component)
- ✅ Data should be deduplicated within a single render tree
- ✅ Function is called from multiple components in the same page

**Do NOT use `cache()` when:**
- ❌ Function is only called once per page
- ❌ Data contains user-specific or request-specific information that should NOT be shared
- ❌ Function already has sufficient caching via Next.js fetch cache

### Pattern

```typescript
import { cache } from 'react';

export const fetchDealerInfo = cache(
  async (hostname: string): Promise<DealerInfo | null> => {
    const url = `${getAPIBaseURL(hostname)}/v1/get-website-information`;

    try {
      return await cachedFetch<DealerInfo>(url, {}, {
        hostname,
        dealerIdentifier: hostname.replace(/^www\./, ''),
        dataType: "dealer",
        domain: "Dealer",
      });
    } catch (error) {
      console.error(`[API:Dealer] Error:`, error);
      return null;
    }
  }
);
```

### Examples in Codebase

- ✅ `fetchWebsiteInformation` - Used in layout + metadata
- ✅ `fetchVDPDetails` - Used in `generateMetadata()` + page
- ✅ `fetchStaffInformation` - May be used multiple times
- ❌ `fetchSRPRows` - Only called once per page with user-specific filters

---

## Error Handling Strategies

Choose the appropriate error handling strategy based on the data type:

### Strategy 1: Throw Errors (Critical Data)

**Use for:** VDP details, page content, required data

```typescript
export async function fetchVDPDetails(
  hostname: string,
  vdpSlug: string
): Promise<VDPResponse> {
  const url = `${getAPIBaseURL(hostname)}/v2/inventory/vehicles/vdp/${vdpSlug}`;

  try {
    return await cachedFetch<VDPResponse>(url, {}, {
      hostname,
      dealerIdentifier: hostname.replace(/^www\./, ''),
      dataType: "vdp",
      throwOn404: true, // Throws error with .status = 404
      domain: "VDP",
    });
  } catch (error) {
    // Don't log 404 errors (expected for sold vehicles)
    const is404 = (error as Error & { status?: number })?.status === 404;
    if (!is404) {
      console.error(`[API:VDP] Error fetching details:`, error);
    }
    throw error; // Re-throw for page to handle
  }
}
```

**Page usage:**
```typescript
try {
  const vehicle = await fetchVDPDetails(hostname, slug);
} catch (error) {
  if ((error as any)?.status === 404) {
    notFound(); // Trigger Next.js 404 page
  }
  throw error;
}
```

### Strategy 2: Return Null (Optional Data)

**Use for:** Dealer info, optional features, supplementary data

```typescript
export async function fetchWebsiteInformation(
  hostname: string
): Promise<DealerInfo | null> {
  try {
    const response = await cachedFetch<APIResponse>(url, {}, {
      hostname,
      dealerIdentifier: hostname.replace(/^www\./, ''),
      dataType: "dealer",
      domain: "Dealer",
    });

    if (!response.data) {
      console.warn(`[API:Dealer] No data found`);
      return null;
    }

    return response.data;
  } catch (error) {
    console.error(`[API:Dealer] Error:`, error);
    return null; // Graceful fallback
  }
}
```

### Strategy 3: Return Empty Array/Object (Collections)

**Use for:** Similar vehicles, staff lists, optional collections

```typescript
export async function fetchVDPSimilars(
  hostname: string,
  vdpSlug: string
): Promise<VDPSimilarsResponse> {
  try {
    return await cachedFetch<VDPSimilarsResponse>(url, {}, {
      hostname,
      dealerIdentifier: hostname.replace(/^www\./, ''),
      dataType: "vdp-similars",
      domain: "VDP",
    });
  } catch (error) {
    console.error(`[API:VDP] Error fetching similars:`, error);
    return { success: false, data: [] }; // Empty array fallback
  }
}
```

**Or use `returnEmptyOnError` option:**
```typescript
return await cachedFetch<VDPSimilarsResponse>(url, {}, {
  hostname,
  dealerIdentifier: hostname.replace(/^www\./, ''),
  dataType: "vdp-similars",
  returnEmptyOnError: true, // Automatically returns [] or {}
  domain: "VDP",
});
```

---

## Logging Standards

### Format

All logs follow the format: `[API:{domain}] {path} - {hostname}/{status} ({duration}ms)`

```
[API:SRP] /v2/inventory/vehicles/srp/rows - www.nissanofportland.com/200 (150ms)
[API:Dealer] /v1/get-website-information - www.nissanofportland.com/200 (200ms)
[API:VDP] /v2/inventory/vehicles/vdp/slug - www.nissanofportland.com/404 (120ms)
```

### Domain Values

Specify `domain` in `cachedFetch` options to customize the log prefix:

```typescript
cachedFetch<Response>(url, body, {
  hostname,
  dealerIdentifier,
  dataType: "vehicles",
  domain: "SRP", // Shows as [API:SRP] in logs
});
```

**Standard domains:**
- `SRP` - Search Results Page
- `VDP` - Vehicle Detail Page
- `Dealer` - Dealer information
- `Forms` - Form definitions
- `Lineup` - Lineup/brands
- `Specials` - Special offers

If `domain` is not specified, logs use `dataType.toUpperCase()`.

### Log Levels

- **Info:** Successful requests, 4xx client errors
- **Error:** 5xx server errors, network failures, unexpected errors

**Examples:**
```typescript
// Success
console.log(`[API:SRP] /v2/inventory/vehicles/srp/rows - www.dealer.com/200 (150ms)`);

// Client error (logged as info)
console.log(`[API:VDP] /v2/inventory/vehicles/vdp/slug - www.dealer.com/404 (120ms)`);

// Server error
console.error(`[API:SRP] /v2/inventory/vehicles/srp/rows - www.dealer.com/500 (200ms)`);

// Retry
console.log(`[API:SRP] /v2/inventory/vehicles/srp/rows - Retry 1/3`);
```

---

## Data Transformation Pattern

When API response format differs from application needs, use transformation pattern:

### 1. Define Raw API Types

Prefix with `API` or `Raw`:

```typescript
interface APISpecialItem {
  id: string;
  title: string;
  image_url: string | null;
  finance_apr: number | null;
  // ... raw API fields
}
```

### 2. Define Application Types

Clean, idiomatic types for application use:

```typescript
interface VehicleSpecial {
  id: string;
  condition: 'new' | 'used' | 'certified';
  year: number | string;
  make: string;
  model: string;
  imageUrl: string;
  offer: {
    type: 'finance' | 'lease';
    value: number;
    // ... clean application fields
  };
}
```

### 3. Create Transformation Function

```typescript
/**
 * Transform API special item to application format
 * Returns null if item should be filtered out
 */
function transformSpecial(item: APISpecialItem): VehicleSpecial | null {
  // Skip items without required fields
  if (!item.image_url) {
    return null;
  }

  // Parse and enrich data
  const yearMatch = item.title.match(/(\d{2,4})/);
  const year = yearMatch ? parseInt(yearMatch[1]) : new Date().getFullYear();

  return {
    id: item.id,
    condition: 'new',
    year,
    make: 'Nissan', // Default or parse from title
    model: item.title.replace(/\d+/, '').trim(),
    imageUrl: item.image_url,
    offer: {
      type: item.finance_apr !== null ? 'finance' : 'lease',
      value: item.finance_apr ?? item.lease_monthly_payment ?? 0,
    },
  };
}
```

### 4. Main Fetch Function with Transform

```typescript
export async function fetchSpecials(
  hostname: string,
  channels?: SpecialChannel[]
): Promise<VehicleSpecial[]> {
  const rawData = await fetchSpecialsRaw(hostname, { channels });

  if (!rawData.success || !rawData.data) {
    return [];
  }

  // Transform and filter
  const specials: VehicleSpecial[] = [];
  for (const group of rawData.data) {
    for (const item of group) {
      const transformed = transformSpecial(item);
      if (transformed) {
        specials.push(transformed);
      }
    }
  }

  return specials;
}
```

### 5. Export Both Versions

```typescript
// Transformed version (primary)
export async function fetchSpecials(
  hostname: string,
  channels?: SpecialChannel[]
): Promise<VehicleSpecial[]> {
  // ... transform logic
}

// Raw version (for consumers who need original format)
export async function fetchSpecialsRaw(
  hostname: string,
  request: SpecialsRequest = {}
): Promise<SpecialsResponse> {
  // ... raw API call
}
```

**Examples in codebase:**
- `packages/lib/api/specials.ts` - Transforms special offers
- `packages/lib/api/lineup.ts` - Normalizes lineup data across dealer types

---

## Complete Examples

### Example 1: Simple GET Request

```typescript
/**
 * Fetch dealer lineup (brands/models)
 * 
 * @param hostname - The dealer hostname (e.g., www.nissanofportland.com)
 * @returns Normalized lineup response with sections
 * 
 * @example
 * ```ts
 * const lineup = await fetchLineup('www.nissanofportland.com');
 * lineup.data.sections.forEach(section => {
 *   console.log(section.title, section.items.length);
 * });
 * ```
 */
export async function fetchLineup(
  hostname: string
): Promise<LineupResponse> {
  const url = `${getAPIBaseURL(hostname)}/v1/line-up`;

  const rawResponse = await cachedFetch<LineupRawResponse>(url, {}, {
    hostname,
    dealerIdentifier: hostname.replace(/^www\./, ''),
    dataType: "lineup",
    method: "GET",
    domain: "Lineup",
  });

  // Normalize data
  const normalizedData = normalizeLineupData(rawResponse.data);

  return {
    success: rawResponse.success,
    data: normalizedData,
  };
}
```

### Example 2: POST Request with Parameters

```typescript
/**
 * Fetches SRP rows (vehicle inventory) with caching
 *
 * @param hostname - The tenant hostname (e.g., www.nissanofportland.com)
 * @param params - Filter and pagination parameters
 * @returns Vehicle inventory response with pagination metadata
 *
 * @example
 * ```ts
 * const data = await fetchSRPRows('www.nissanofportland.com', {
 *   condition: ['new'],
 *   make: ['Nissan'],
 *   page: 1,
 *   items_per_page: 24
 * });
 * console.log(`Found ${data.pagination.total_count} vehicles`);
 * ```
 */
export async function fetchSRPRows(
  hostname: string,
  params: SRPRowsRequest
): Promise<SRPRowsResponse> {
  const url = `${getAPIBaseURL(hostname)}/v2/inventory/vehicles/srp/rows`;

  return cachedFetch<SRPRowsResponse>(url, params as Record<string, unknown>, {
    hostname,
    dealerIdentifier: hostname.replace(/^www\./, ''),
    dataType: "vehicles",
    domain: "SRP",
  });
}
```

### Example 3: React Cache Wrapper with Error Handling

```typescript
/**
 * Fetch website information including dealer ID
 * Wrapped with React cache to deduplicate requests within a single render
 * 
 * @param hostname - The dealer hostname (e.g., www.nissanofportland.com)
 * @returns Dealer information or null if not found
 * 
 * @example
 * ```ts
 * const dealerInfo = await fetchWebsiteInformation('www.nissanofportland.com');
 * if (dealerInfo) {
 *   console.log(dealerInfo.id, dealerInfo.name);
 * }
 * ```
 */
export const fetchWebsiteInformation = cache(async function (
  hostname: string
): Promise<DealerInfo | null> {
  const url = `${getAPIBaseURL(hostname)}/v1/get-website-information`;

  try {
    const apiResponse = await cachedFetch<APIResponse>(url, {}, {
      hostname,
      dealerIdentifier: hostname.replace(/^www\./, ''),
      dataType: "dealer",
      method: "GET",
      domain: "Dealer",
    });

    if (!apiResponse.data || !apiResponse.data.id) {
      console.warn(`[API:Dealer] No dealer data found for ${hostname}`);
      return null;
    }

    console.log(`[API:Dealer] Got dealer ID: ${apiResponse.data.id}`);

    return apiResponse.data;
  } catch (error) {
    console.error(`[API:Dealer] Error:`, error);
    return null;
  }
});
```

### Example 4: With Custom Tags and 404 Handling

```typescript
/**
 * Fetch vehicle details for VDP
 * Wrapped with React cache() to deduplicate requests across generateMetadata() and page component
 *
 * @param hostname - Full hostname (e.g., www.nissanofportland.com)
 * @param vdpSlug - VDP slug from URL
 * @returns Vehicle details with photos and specs
 * @throws Error with status=404 if vehicle not found
 * 
 * @example
 * ```ts
 * try {
 *   const vehicle = await fetchVDPDetails('www.nissanofportland.com', slug);
 *   console.log(vehicle.data.vin, vehicle.data.price);
 * } catch (error) {
 *   if (error.status === 404) notFound();
 * }
 * ```
 */
export const fetchVDPDetails = cache(
  async (hostname: string, vdpSlug: string): Promise<VDPResponse> => {
    const url = `${getAPIBaseURL(hostname)}/v2/inventory/vehicles/vdp/${vdpSlug}`;
    const tags = generateVDPTags(vdpSlug);

    try {
      return await cachedFetch<VDPResponse>(url, {}, {
        hostname,
        dealerIdentifier: hostname.replace(/^www\./, ''),
        dataType: "vdp",
        method: "GET",
        cacheTags: tags,
        domain: "VDP",
        throwOn404: true, // Throws error with .status = 404
      });
    } catch (error) {
      // Don't log 404 errors as they're expected for invalid/sold vehicles
      const is404 = (error as Error & { status?: number })?.status === 404;
      if (!is404) {
        console.error(`[API:VDP] Error:`, error);
      }
      throw error;
    }
  }
);
```

---

## Testing Requirements

**All API functions must have unit tests.** See [Testing Documentation](../testing.md) for complete guidelines.

### Test File Location

Create `__tests__/` directory alongside API file:

```
packages/lib/api/
├── srp.ts
├── __tests__/
│   └── srp.test.ts
```

### Test Template

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchSRPRows } from '../srp';

// Mock cachedFetch
vi.mock('../client', () => ({
  cachedFetch: vi.fn(),
  getAPIBaseURL: vi.fn((hostname) => `https://api.dealertower.com/public/${hostname}`),
}));

describe('fetchSRPRows', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch vehicle inventory successfully', async () => {
    const mockResponse = {
      success: true,
      data: {
        vehicles: [
          { id: '1', make: 'Nissan', model: 'Altima' },
        ],
        pagination: { total_count: 1, page: 1 },
      },
    };

    const { cachedFetch } = await import('../client');
    vi.mocked(cachedFetch).mockResolvedValue(mockResponse);

    const result = await fetchSRPRows('www.nissanofportland.com', {
      condition: ['new'],
      page: 1,
    });

    expect(result.success).toBe(true);
    expect(result.data.vehicles).toHaveLength(1);
    expect(cachedFetch).toHaveBeenCalledWith(
      expect.stringContaining('/v2/inventory/vehicles/srp/rows'),
      expect.objectContaining({ condition: ['new'], page: 1 }),
      expect.objectContaining({
        hostname: 'www.nissanofportland.com',
        dataType: 'vehicles',
        domain: 'SRP',
      })
    );
  });

  it('should handle errors gracefully', async () => {
    const { cachedFetch } = await import('../client');
    vi.mocked(cachedFetch).mockRejectedValue(new Error('Network error'));

    await expect(
      fetchSRPRows('www.nissanofportland.com', { condition: ['new'], page: 1 })
    ).rejects.toThrow('Network error');
  });
});
```

### Required Test Cases

Each API function should test:
- ✅ Successful response
- ✅ Error handling
- ✅ Correct parameters passed to `cachedFetch`
- ✅ Data transformation (if applicable)
- ✅ Edge cases (null, empty arrays, etc.)

---

## Migration Checklist

When creating a new API function or updating an existing one, verify:

### Structure
- [ ] File placed in `packages/lib/api/`
- [ ] Imports `cachedFetch` and `getAPIBaseURL` from `./client`
- [ ] Types imported from `@dealertower/types/*`
- [ ] File has JSDoc header comment

### Function Signature
- [ ] `hostname` is first parameter
- [ ] Parameters renamed from `dealerIdentifier`, `body` to `hostname`, `params`
- [ ] Complete JSDoc with `@param`, `@returns`, `@example`
- [ ] Strong TypeScript types (no `any`)

### Implementation
- [ ] Uses `cachedFetch` (not raw `fetch`)
- [ ] Correct `dataType` specified
- [ ] `domain` parameter set for logging
- [ ] `dealerIdentifier` derived from hostname: `hostname.replace(/^www\./, '')`
- [ ] Appropriate error handling strategy
- [ ] React `cache()` wrapper if needed

### Cache Configuration
- [ ] Correct cache tags (automatic + custom if needed)
- [ ] `cacheTags` provided for forms and VDP
- [ ] `throwOn404` set for critical data
- [ ] `returnEmptyOnError` set for optional collections

### Testing
- [ ] Unit tests created in `__tests__/` directory
- [ ] Tests cover success, error, and edge cases
- [ ] Tests verify correct `cachedFetch` parameters

### Documentation
- [ ] Function has example usage
- [ ] Complex logic has inline comments
- [ ] Transformation functions documented

---

## Quick Reference

### cachedFetch Options

```typescript
interface CachedFetchOptions {
  hostname: string;              // Required: Dealer hostname
  dealerIdentifier: string;      // Required: hostname.replace(/^www\./, '')
  dataType: DataType;            // Required: vehicles, filters, forms, etc.
  method?: "GET" | "POST";       // Optional: default "POST"
  cacheTags?: string[];          // Optional: additional tags
  domain?: string;               // Optional: for logging (default: dataType)
  throwOn404?: boolean;          // Optional: throw on 404 (default: false)
  returnEmptyOnError?: boolean;  // Optional: return [] or {} on error (default: false)
  timeout?: number;              // Optional: request timeout ms (default: 10000)
  revalidate?: number | false;   // Optional: cache TTL (default: CACHE_TTL)
  retries?: number;              // Optional: retry attempts (default: 3)
}
```

### Standard Function Template

```typescript
/**
 * [Description]
 * 
 * @param hostname - The dealer hostname (e.g., www.nissanofportland.com)
 * @param params - [Parameter description]
 * @returns [Return value description]
 * 
 * @example
 * ```ts
 * const result = await fetchExample('www.nissanofportland.com', { filter: 'value' });
 * ```
 */
export async function fetchExample(
  hostname: string,
  params: RequestType
): Promise<ResponseType> {
  const url = `${getAPIBaseURL(hostname)}/v2/endpoint`;

  return cachedFetch<ResponseType>(url, params as Record<string, unknown>, {
    hostname,
    dealerIdentifier: hostname.replace(/^www\./, ''),
    dataType: "vehicles",
    domain: "SRP",
  });
}
```

### Error Handling Decision Tree

```
Is data critical for page to function?
├─ YES → Throw error, let page handle
│         Use throwOn404: true for 404s
│         Example: VDP details
│
└─ NO → Return safe default
    ├─ Single object → Return null
    │                  Example: Dealer info
    │
    └─ Collection → Return empty array/object
                    Use returnEmptyOnError: true
                    Example: Similar vehicles
```

---

## Summary

**Golden Rules:**
1. Always use `cachedFetch` for API calls
2. Hostname is always the first parameter
3. Use appropriate `dataType` for automatic cache tags
4. Add `domain` parameter for clear logging
5. Choose error handling strategy based on data criticality
6. Wrap with React `cache()` if called multiple times per render
7. Write unit tests for all API functions
8. Include JSDoc with examples

**When in doubt, refer to existing implementations:**
- Simple GET: `fetchLineup` in `lineup.ts`
- POST with params: `fetchSRPRows` in `srp.ts`
- React cache wrapper: `fetchWebsiteInformation` in `dealer.ts`
- 404 handling: `fetchVDPDetails` in `vdp.ts`
- Transformation: `fetchSpecials` in `specials.ts`

---

**Questions?** See examples in `packages/lib/api/` or refer to this document.
