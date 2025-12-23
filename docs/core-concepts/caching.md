# Caching Strategy

## Overview

The platform uses intelligent caching to minimize API calls while ensuring data freshness. The strategy combines:

- **Tag-based invalidation** - Instant cache clearing via webhooks
- **Time-based expiration** - 6-hour TTL as fallback
- **Hostname isolation** - Separate cache per dealer

## Cache Architecture

```text
Request → Cache Check
   ↓
[HIT] → Return Cached Data (fast)
   ↓
[MISS] → API Call → Store with Tags → Return Data
```

## Cache Key Structure

**Format**: `{hostname}:{path}:{bodyHash}`

**Components**:

- `hostname` - Dealer hostname (e.g., `www.nissanofportland.com`)
- `path` - API endpoint path (e.g., `/v2/inventory/vehicles/srp/rows`)
- `bodyHash` - First 12 chars of SHA-256 hash of sorted request body JSON

**Example**:

```text
www.nissanofportland.com:/v2/inventory/vehicles/srp/rows:a1b2c3d4e5f6
```

**Why body hash?**
Different filter combinations need separate cache entries. Without the hash, changing filters would return stale cached data.

## Cache Tags

Each cached entry is tagged for targeted invalidation:

### Tag Types

1. **Hostname Tag**: `hostname:{normalized_hostname}`
   - Example: `hostname:nissanofportland.com`
   - Invalidates: All cache for this dealer
   - Use: When dealer settings change

2. **Dealer Tag**: `dealer:{dealer_uuid}`
   - Example: `dealer:494a1788-0619-4a53-99c1-1c9f9b2e8fcc`
   - Invalidates: All cache by dealer ID
   - Use: Dealer-wide updates

3. **Data Type Tags**:
   - `srp:vehicles` - All vehicle inventory
   - `srp:filters` - All filter configurations
   - Use: Invalidate specific data types

### Tag Application

Every cache entry gets ALL applicable tags:

```typescript
const tags = [
  'hostname:nissanofportland.com',
  'dealer:494a1788-0619-4a53-99c1-1c9f9b2e8fcc',
  'srp:vehicles',
];
```

## Time-To-Live (TTL)

**Default**: 6 hours (21,600 seconds)

**Purpose**:

- Fallback if webhook invalidation fails
- Prevents indefinitely stale data
- Balances freshness vs. performance

**Rationale**:

- Inventory doesn't change every minute
- 6 hours is acceptable staleness
- Webhook provides instant updates when available

## Implementation

### Generating Cache Keys

```typescript
// packages/lib/cache/keys.ts
import { createHash } from 'crypto';

export function generateCacheKey(
  hostname: string,
  path: string,
  body: Record<string, unknown>
): string {
  // Sort body keys for consistent hashing
  const sortedBody = JSON.stringify(
    body,
    Object.keys(body).sort()
  );
  
  // Hash the body
  const bodyHash = createHash('sha256')
    .update(sortedBody)
    .digest('hex')
    .slice(0, 12);
  
  // Normalize hostname (remove www)
  const normalized = hostname.toLowerCase().replace(/^www\./, '');
  
  return `${normalized}:${path}:${bodyHash}`;
}
```

### Generating Cache Tags

```typescript
// packages/lib/cache/tags.ts

export function generateCacheTags(
  hostname: string,
  dealerId: string,
  dataType: 'vehicles' | 'filters'
): string[] {
  const normalized = hostname.toLowerCase().replace(/^www\./, '');
  
  return [
    `hostname:${normalized}`,
    `dealer:${dealerId}`,
    `srp:${dataType}`,
  ];
}
```

### Using Cache in API Calls

```typescript
// packages/lib/api/srp.ts

export async function fetchSRPRows(
  dealerId: string,
  filters: FilterState,
  hostname: string
) {
  const url = `${API_BASE}/${hostname}/v2/inventory/vehicles/srp/rows`;
  
  const tags = generateCacheTags(hostname, dealerId, 'vehicles');
  
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(filters),
    next: {
      revalidate: 21600, // 6 hours
      tags: tags,
    },
  });
  
  return response.json();
}
```

## Cache Invalidation

### Webhook Endpoint

**URL**: `/api/revalidate/`  
**Method**: POST  
**Auth**: `x-revalidation-secret` header

### Webhook Payload

```json
{
  "hostname": "www.nissanofportland.com",
  "dealer_identifier": "494a1788-0619-4a53-99c1-1c9f9b2e8fcc",
  "tags": ["srp:vehicles"]
}
```

**Options**:

- Send `hostname` - Invalidates all cache for hostname
- Send `dealer_identifier` - Invalidates all cache for dealer
- Send `tags` array - Invalidates specific tags
- Send all three - Most targeted invalidation

### Webhook Implementation

```typescript
// app/api/revalidate/route.ts

import { revalidateTag } from 'next/cache';
import { headers } from 'next/headers';

export async function POST(request: Request) {
  // Verify secret
  const headersList = await headers();
  const secret = headersList.get('x-revalidation-secret');
  
  if (secret !== process.env.REVALIDATION_SECRET) {
    return new Response('Unauthorized', { status: 401 });
  }
  
  const body = await request.json();
  const { hostname, dealer_identifier, tags } = body;
  
  const invalidationTags: string[] = [];
  
  // Add hostname tags
  if (hostname) {
    const normalized = hostname.toLowerCase().replace(/^www\./, '');
    invalidationTags.push(`hostname:${normalized}`);
  }
  
  // Add dealer tags
  if (dealer_identifier) {
    invalidationTags.push(`dealer:${dealer_identifier}`);
  }
  
  // Add custom tags
  if (tags && Array.isArray(tags)) {
    invalidationTags.push(...tags);
  }
  
  // Invalidate all tags
  for (const tag of invalidationTags) {
    revalidateTag(tag, '/'); // Note: second param required in Next.js 16
  }
  
  return Response.json({
    revalidated: true,
    tags: invalidationTags,
    timestamp: new Date().toISOString(),
  });
}
```

### Calling the Webhook

```bash
# Invalidate all cache for a hostname
curl -X POST https://your-site.com/api/revalidate/ \
  -H "x-revalidation-secret: YOUR_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"hostname": "www.nissanofportland.com"}'

# Invalidate specific data type
curl -X POST https://your-site.com/api/revalidate/ \
  -H "x-revalidation-secret: YOUR_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"hostname": "www.nissanofportland.com", "tags": ["srp:vehicles"]}'

# Invalidate by dealer ID
curl -X POST https://your-site.com/api/revalidate/ \
  -H "x-revalidation-secret: YOUR_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"dealer_identifier": "494a1788-0619-4a53-99c1-1c9f9b2e8fcc"}'
```

## Cache Flow Diagram

```text
┌─────────────────────────────────────────────────────────┐
│                   USER REQUEST                           │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│            GENERATE CACHE KEY                            │
│  hostname:path:bodyHash                                  │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
              ┌──────────────┐
              │ Cache Lookup │
              └──────┬───────┘
                     │
         ┌───────────┴───────────┐
         │                       │
         ▼                       ▼
    ┌────────┐            ┌──────────┐
    │  HIT   │            │   MISS   │
    └───┬────┘            └────┬─────┘
        │                      │
        │                      ▼
        │              ┌──────────────────┐
        │              │   API CALL       │
        │              └────┬─────────────┘
        │                   │
        │                   ▼
        │              ┌──────────────────┐
        │              │  STORE IN CACHE  │
        │              │  with tags + TTL │
        │              └────┬─────────────┘
        │                   │
        └───────────┬───────┘
                    │
                    ▼
           ┌─────────────────┐
           │  RETURN DATA    │
           └─────────────────┘
```

## Monitoring Cache Performance

### In Development

Add debug headers in middleware:

```typescript
// middleware.ts (if enabled)
response.headers.set('x-cache-status', cacheHit ? 'HIT' : 'MISS');
response.headers.set('x-cache-key', cacheKey);
response.headers.set('x-cache-tags', tags.join(', '));
```

### API Client Logging

Located in `packages/lib/api/client.ts`:

```typescript
console.log(`[API] ${path} - ${hostname} (${duration}ms)`);
```

Format: `[API] /v2/inventory/vehicles/srp/rows - www.nissanofportland.com (245ms)`

### Next.js Build Output

Check build output for cache tags:

```text
Route (app)                                Size     First Load JS
┌ ○ /new-vehicles/[[...slug]]            1.2 kB     85.3 kB
│   Cache tags: hostname:*, dealer:*, srp:vehicles
```

## Cache Invalidation Strategies

### Scenario 1: New Vehicle Added

**Action**: Dealer adds new vehicle to inventory

**Invalidation**:

```json
{
  "hostname": "www.nissanofportland.com",
  "tags": ["srp:vehicles"]
}
```

**Result**: All vehicle list pages refresh, filters remain cached

### Scenario 2: Dealer Settings Changed

**Action**: Dealer updates logo, business hours, etc.

**Invalidation**:

```json
{
  "hostname": "www.nissanofportland.com"
}
```

**Result**: All cache for this dealer invalidated

### Scenario 3: Filter Configuration Changed

**Action**: New make/model added to filter options

**Invalidation**:

```json
{
  "hostname": "www.nissanofportland.com",
  "tags": ["srp:filters"]
}
```

**Result**: Filter data refreshes, vehicle lists remain cached

### Scenario 4: Global Inventory Update

**Action**: Batch import of multiple vehicles across dealers

**Invalidation**:

```json
{
  "tags": ["srp:vehicles"]
}
```

**Result**: All vehicle data across all dealers invalidated

## Best Practices

### DO

✅ Always include all relevant tags  
✅ Use consistent hostname normalization  
✅ Include request body in cache key  
✅ Set appropriate TTL  
✅ Test webhook invalidation

### DON'T

❌ Cache user-specific data  
❌ Forget to normalize hostnames  
❌ Use overly aggressive invalidation  
❌ Expose cache keys to clients  
❌ Skip body hash in cache keys

## Troubleshooting

### Cache Not Invalidating

**Check**:

1. Verify webhook URL is correct
2. Check `x-revalidation-secret` header
3. Confirm tags match exactly
4. Review API route logs

**Debug**:

```bash
# Test webhook locally
curl -X POST http://localhost:3000/api/revalidate/ \
  -H "x-revalidation-secret: dev-secret-key" \
  -H "Content-Type: application/json" \
  -d '{"hostname": "www.nissanofportland.com"}' \
  -v
```

### Stale Data Persisting

**Causes**:

- TTL not expired yet (wait up to 6 hours)
- Wrong cache tags used
- Webhook not called
- Browser caching (clear browser cache)

**Solution**:

```bash
# Manual invalidation
curl -X POST https://your-site.com/api/revalidate/ \
  -H "x-revalidation-secret: YOUR_SECRET" \
  -d '{"hostname": "www.dealer.com"}'
```

### Cache Key Collisions

**Symptom**: Different requests return same cached data

**Cause**: Body hash not unique enough

**Solution**: Ensure request body includes all relevant parameters

## Related Documentation

- [Architecture](./architecture.md) - System overview
- [Multi-Tenancy](./multi-tenancy.md) - Tenant detection
- [API Reference](../api-reference/overview.md) - API integration
