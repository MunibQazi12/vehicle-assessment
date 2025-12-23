# Multi-Tenancy

## Overview

The platform supports multiple automotive dealerships from a single codebase using hostname-based tenant detection. Each dealer is identified by a unique UUID fetched from the API.

## How It Works

### 1. Request Arrives
```
User visits: www.nissanofportland.com
```

### 2. Proxy Detection (proxy.ts)
- Extracts hostname from request headers
- Priority order:
  1. `NEXTJS_APP_DEALER_ID` env (dev override)
  2. `NEXTJS_APP_HOSTNAME` env (dev override)
  3. `x-forwarded-host` header (production)
  4. `host` header (fallback)

### 3. Dealer Resolution
- If `NEXTJS_APP_DEALER_ID` is set → use it directly (UUID)
- Otherwise → API call to fetch dealer UUID from hostname
- API endpoint: `GET /api/dealer-info/?hostname={hostname}`

### 4. Server Context Resolution
Tenant context is resolved in `server-context.ts`:
- Hostname derived from request headers or env var
- Dealer identifier derived from hostname (lowercase)
- Website info fetched from API with caching

### 5. Application Uses Context
- Server Components: Use `getTenantContext()` from `@dealertower/lib/tenant/server-context`
- Client Components: Access via React Context (`useTenant()` hook)

## Architecture Diagram

```
┌────────────────────────────────────────────────────────┐
│         Multiple Dealer Hostnames                       │
│   www.dealer-a.com | www.dealer-b.com | www.dealer-c.com│
└────────────────────┬───────────────────────────────────┘
                     │
                     ▼
┌────────────────────────────────────────────────────────┐
│              PROXY (proxy.ts)                           │
│  • Session cookie management for CSRF protection        │
└────────────────────┬───────────────────────────────────┘
                     │
                     ▼
┌────────────────────────────────────────────────────────┐
│         SERVER CONTEXT (server-context.ts)              │
│  1. Check NEXTJS_APP_HOSTNAME env (priority)            │
│  2. Read x-forwarded-host or host header                │
│  3. Return lowercase hostname (= dealer identifier)     │
│  4. Fetch website info (cached per request)             │
└────────────────────┬───────────────────────────────────┘
                     │
          ┌──────────┴──────────┐
          ▼                     ▼
┌──────────────────┐  ┌──────────────────┐
│ Server Component │  │ Client Component │
│ getTenantContext │  │ Use React Context│
└──────────────────┘  └──────────────────┘
```

## Environment Variables

### Local Development

```bash
# .env.local
NEXTJS_APP_DEALER_ID=494a1788-0619-4a53-99c1-1c9f9b2e8fcc
NEXTJS_APP_HOSTNAME=www.nissanofportland.com
```

Benefits:
- Skip API lookup on every request
- Test specific dealer configurations
- Faster development

### Production

No environment overrides needed. The proxy:
1. Reads hostname from request headers
2. Calls API to fetch dealer UUID
3. Caches result

## Implementation

### Server Components

Access tenant via `getTenantContext()`:

```typescript
import { getTenantContext } from '@dealertower/lib/tenant/server-context';

export default async function MyPage() {
  const { hostname, websiteInfo } = await getTenantContext();
  
  // hostname is lowercase and used as dealer identifier for API calls
  const data = await fetchData(hostname);
  
  return <div>Dealer: {websiteInfo?.name || hostname}</div>;
}
```

### Client Components

Access tenant from context:

```typescript
'use client';
import { useTenant } from '@dealertower/lib/tenant/context';

export function MyComponent() {
  const { hostname } = useTenant();
  
  // Use for display purposes
  return <div>Hostname: {hostname}</div>;
}
```

**Security Note**: Never send hostname from client to Next.js API routes. API routes must read from environment variables to prevent tenant injection attacks.

## Proxy Implementation

Located in `proxy.ts` (Next.js 16+ proxy file):

```typescript
export async function fetchDealerInfo(hostname: string) {
  // Priority 1: NEXTJS_APP_DEALER_ID env
  if (process.env.NEXTJS_APP_DEALER_ID) {
    return process.env.NEXTJS_APP_DEALER_ID;
  }
  
  // Priority 2: API lookup
  const response = await fetch(
    `${process.env.DEALER_TOWER_API_URL}/${hostname}/dealer-info`
  );
  const data = await response.json();
  return data.id; // UUID like 494a1788-0619-4a53-99c1-1c9f9b2e8fcc
}
```

## Tenant Context Provider

Located in `packages/lib/tenant/context.tsx`:

```typescript
import { createContext, useContext } from 'react';

interface TenantContext {
  hostname: string;
  // Note: dealerIdentifier is kept for backwards compatibility but equals hostname
  dealerIdentifier: string;
}

const TenantContext = createContext<TenantContext | null>(null);

export function TenantProvider({ 
  children, 
  hostname,
}: { 
  children: React.ReactNode;
  hostname: string;
}) {
  return (
    <TenantContext.Provider value={{ hostname, dealerIdentifier: hostname }}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within TenantProvider');
  }
  return context;
}
```

## API Integration

All API calls must include dealer ID (not hostname):

```typescript
// lib/api/srp.ts
export async function fetchSRPRows(
  dealerId: string,  // UUID from proxy
  filters: FilterState,
  hostname: string   // For caching only
) {
  const url = `${API_BASE}/${hostname}/v2/inventory/vehicles/srp/rows`;
  
  return fetch(url, {
    method: 'POST',
    body: JSON.stringify(filters),
    next: {
      tags: generateCacheTags(hostname, dealerId, 'vehicles'),
      revalidate: 21600, // 6 hours
    },
  });
}
```

## Dealer-Specific Content

Content is organized by dealer UUID:

```
dealers/
└── {dealer-uuid}/                    # e.g., 494a1788-0619-4a53-99c1-1c9f9b2e8fcc
    ├── components/
    │   └── Header.tsx               # Custom header
    ├── pages/
    │   └── AboutPage.tsx            # Custom pages
    └── public/
        ├── logo.png                 # Dealer logo
        └── favicon.ico              # Favicon
```

Dynamic loading in `packages/lib/dealers/loader.ts`:

```typescript
export async function loadDealerComponent(
  componentName: string
): Promise<React.ComponentType | null> {
  const dealerId = process.env.NEXTJS_APP_DEALER_ID;
  if (!dealerId) return null;
  
  try {
    const component = await import(
      `@dealers/${dealerId}/components/${componentName}`
    );
    return component.default;
  } catch {
    return null; // Fallback to default
  }
}
```

## Testing Different Dealers

### Method 1: Environment Variables

```bash
# Test Nissan of Portland
NEXTJS_APP_DEALER_ID=494a1788-0619-4a53-99c1-1c9f9b2e8fcc \
NEXTJS_APP_HOSTNAME=www.nissanofportland.com \
npm run dev
```

### Method 2: Update .env.local

```bash
# Switch to different dealer
NEXTJS_APP_DEALER_ID=73d6c4fc-8ffb-471e-88c4-5e8eeddc1c63
NEXTJS_APP_HOSTNAME=www.toyotadealer.com
```

Restart dev server after changes.

## Data Isolation

### Cache Isolation

Cache keys include hostname:
```
{hostname}:{path}:{bodyHash}
```

Example:
```
www.nissanofportland.com:/api/vehicles:a1b2c3
```

Cache tags include both hostname and dealer ID:
```typescript
[
  'hostname:www.nissanofportland.com',
  'dealer:494a1788-0619-4a53-99c1-1c9f9b2e8fcc',
  'srp:vehicles'
]
```

### API Isolation

API naturally isolates data by hostname:
```
https://api.dealertower.com/public/{hostname}/v2/inventory/vehicles/srp/rows
```

Each hostname returns only that dealer's inventory.

## Security Considerations

### Environment Variable Security

✅ **Safe** (Development only):
- `NEXTJS_APP_DEALER_ID` - Direct UUID override
- `NEXTJS_APP_HOSTNAME` - Hostname override

❌ **Never** expose these in production or to clients.

### API Route Security

Next.js API routes must NOT accept hostname/dealerId from client requests:

```typescript
// ❌ WRONG - Vulnerable to injection
export async function POST(request: Request) {
  const { dealerId } = await request.json(); // NEVER DO THIS
  return fetchData(dealerId);
}

// ✅ CORRECT - Read from server environment
export async function POST(request: Request) {
  const dealerId = process.env.NEXTJS_APP_DEALER_ID!;
  const { filters } = await request.json();
  return fetchData(dealerId, filters);
}
```

### Validation

Always validate dealer UUID format:

```typescript
function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}
```

## Troubleshooting

### Dealer ID Not Detected

**Symptom**: Application shows wrong dealer or errors.

**Check**:
1. Verify `NEXTJS_APP_DEALER_ID` in `.env.local`
2. Restart dev server after env changes
3. Check API connectivity
4. Verify hostname exists in Dealer Tower API

### Custom Content Not Loading

**Symptom**: Dealer-specific header/pages not showing.

**Check**:
1. Verify folder name matches dealer UUID exactly
2. Check file names and exports
3. Review console for import errors
4. Ensure files are in correct locations

### Cache Showing Wrong Dealer Data

**Symptom**: Seeing another dealer's content.

**Solution**:
```bash
# Clear Next.js cache
rm -rf .next

# Restart dev server
npm run dev
```

## Related Documentation

- [Architecture](./architecture.md) - System overview
- [Caching](./caching.md) - Cache strategy
- [Dealer Customization](../dealer-customization/overview.md) - Per-dealer content
- [API Reference](../api-reference/overview.md) - API integration
