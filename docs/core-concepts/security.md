# Security: Tenant Isolation

## Overview

This document outlines the security measures implemented to ensure tenant isolation in the Dealer Tower multi-tenant application. The system is designed to prevent tenant injection attacks and ensure that users can only access data for the dealer specified in the environment configuration.

## Security Principles

### 1. Environment-Based Tenant Resolution

**CRITICAL**: Tenant identification is **never** derived from user input. All tenant resolution is based on:

- `NEXTJS_APP_DEALER_ID` - The dealer UUID (e.g., `494a1788-0619-4a53-99c1-1c9f9b2e8fcc`)
- `NEXTJS_APP_HOSTNAME` - The dealer's hostname (e.g., `www.nissanofportland.com`)

These environment variables are:
- Set at deployment time per dealer instance
- Read-only at runtime
- Never accepted from HTTP requests (query params, headers, body)

### 2. API Route Security

All Next.js API routes (`/api/*`) follow these security rules:

#### ✅ Correct Pattern

```typescript
export async function POST(request: NextRequest) {
  // Read from environment variables only
  const hostname = process.env.NEXTJS_APP_HOSTNAME;
  const dealerId = process.env.NEXTJS_APP_DEALER_ID;

  if (!hostname || !dealerId) {
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 }
    );
  }

  // Use these values for API calls
  const data = await fetchData(hostname, dealerId);
  return NextResponse.json(data);
}
```

#### ❌ NEVER Do This

```typescript
// SECURITY VULNERABILITY - DO NOT USE
export async function POST(request: NextRequest) {
  const body = await request.json();
  
  // ❌ Never accept tenant info from request
  const hostname = body.hostname; // VULNERABLE TO INJECTION
  const dealerId = request.headers.get('x-dealer-id'); // VULNERABLE TO INJECTION
  
  // This allows users to access other dealers' data
  const data = await fetchData(hostname, dealerId);
}
```

### 3. Server Component Security

Server Components access tenant context via `getTenantContext()`:

```typescript
import { getTenantContext } from '@dealertower/lib/tenant/server-context';

export default async function MyPage() {
  // Secure - reads from environment variables
  const { hostname, dealerIdentifier } = await getTenantContext();
  
  // Safe to use in data fetching
  const data = await fetchData(hostname);
  return <div>{data}</div>;
}
```

**Implementation**: The `getTenantContext()` function:
1. Reads `NEXTJS_APP_HOSTNAME` environment variable
2. Falls back to headers only if env var not set (for multi-domain deployments)
3. Caches result per request using React `cache()`

### 4. Client Component Security

Client Components access tenant context via `useTenant()` hook:

```typescript
'use client';
import { useTenant } from '@dealertower/lib/tenant/context';

export function MyComponent() {
  // Safe - context provided by server
  const { hostname, dealerIdentifier } = useTenant();
  
  // ✅ CORRECT: Don't send tenant info to API routes
  const handleSubmit = async (data) => {
    await fetch('/api/forms/submit/', {
      method: 'POST',
      body: JSON.stringify({ formData: data }), // Only send form data
    });
  };
  
  // Use tenant info for display purposes only
  return <div>Dealer: {dealerIdentifier}</div>;
}
```

**Security Note**: Tenant context in client components is for **display purposes only**. It must **never** be sent to API routes as they ignore client-provided values and read from environment variables.

### 5. CMS Admin Panel Security

The Payload CMS admin panel is locked to the tenant specified in `NEXTJS_APP_DEALER_ID`:

- **Tenant Selector**: Read-only dropdown showing current dealer
- **API Endpoint**: `/api/cms/tenant-config` returns locked tenant ID from environment
- **No Switching**: Users cannot select different tenants
- **Visual Indicator**: Lock icon (🔒) shows tenant is environment-locked

**Implementation**: `NonClearableTenantSelector` component:
1. Fetches locked tenant ID from `/api/cms/tenant-config`
2. Sets tenant selector to read-only mode
3. Prevents onChange events when locked
4. Displays lock status in UI

### 6. Request Flow Security

```
User Request
    ↓
Proxy (proxy.ts)
    ├─ Sets session cookie
    └─ NO tenant injection
    ↓
API Route (/api/*)
    ├─ Reads NEXTJS_APP_DEALER_ID from env ✅
    ├─ Reads NEXTJS_APP_HOSTNAME from env ✅
    ├─ Ignores client-provided values ✅
    └─ Validates required env vars ✅
    ↓
Backend API (api.dealertower.com)
    └─ Uses hostname from env for data fetching
```

## Attack Prevention

### Tenant Injection Attack (Prevented ✅)

**Attack Scenario**: Malicious user tries to access another dealer's data by modifying request:

```javascript
// Attacker tries to inject different dealer ID
fetch('/api/vehicles/', {
  method: 'POST',
  headers: { 'x-dealer-id': 'another-dealer-uuid' }, // Ignored
  body: JSON.stringify({ 
    dealerId: 'another-dealer-uuid', // Ignored
    filters: {}
  })
});
```

**Defense**: API route ignores all client-provided tenant identifiers:

```typescript
export async function POST(request: NextRequest) {
  // Client headers/body ignored
  const dealerId = process.env.NEXTJS_APP_DEALER_ID; // ✅ Always from env
  
  if (!dealerId) {
    return NextResponse.json({ error: "Configuration error" }, { status: 500 });
  }
  
  // Safe - uses server-configured dealer ID
  return fetchData(dealerId);
}
```

### CMS Admin Panel Bypass (Prevented ✅)

**Attack Scenario**: Admin user tries to access another dealer's CMS data by manipulating tenant selector:

**Defense**: 
1. Tenant selector locked to `NEXTJS_APP_DEALER_ID`
2. Frontend prevents onChange when locked
3. Backend validates tenant access via Payload's access control
4. Multi-tenant plugin enforces tenant filtering on all queries

### Cache Invalidation Attack (Prevented ✅)

**Attack Scenario**: Attacker with revalidation secret tries to invalidate another dealer's cache:

```bash
# Attempted attack
curl -X POST /api/revalidate/ \
  -H "x-revalidation-secret: secret" \
  -d '{"dealer_id": "another-dealer-id"}'
```

**Defense**: 
1. `/api/revalidate/` ignores `dealer_id` from request body
2. Always uses `NEXTJS_APP_DEALER_ID` from environment
3. Request body can only specify additional `tags` to invalidate
4. Cannot invalidate cache for other dealers

### Environment Variable Manipulation (OS-Level Security)

**Attack Scenario**: User tries to modify environment variables:

**Defense**: Environment variables are:
- Set at container/deployment level (Vercel, Docker, etc.)
- Not accessible to client-side code
- Not modifiable through HTTP requests
- Protected by OS-level process isolation

## Security Checklist

When adding new API routes or features:

- [ ] Read `NEXTJS_APP_DEALER_ID` from `process.env` only
- [ ] Read `NEXTJS_APP_HOSTNAME` from `process.env` only
- [ ] **Never** accept tenant info from request parameters
- [ ] **Never** accept tenant info from request headers (client-controlled)
- [ ] **Never** accept tenant info from request body
- [ ] Validate required environment variables exist
- [ ] Return 500 error if environment variables missing
- [ ] Use `getTenantContext()` in Server Components
- [ ] Use `useTenant()` for display in Client Components
- [ ] Cache tenant context using React `cache()` when appropriate
- [ ] Document security considerations in code comments

## Testing Security

### Manual Testing

1. **API Route Test**: Try to inject dealer ID via request
```bash
curl -X POST http://localhost:3000/api/vehicles/ \
  -H "Content-Type: application/json" \
  -H "x-dealer-id: malicious-id" \
  -d '{"dealerId": "malicious-id", "filters": {}}'
```
Expected: Request should use `NEXTJS_APP_DEALER_ID` from environment, ignore injected values.

2. **CMS Tenant Lock Test**:
- Open admin panel at `/admin`
- Verify tenant selector shows lock icon
- Verify selector is read-only
- Verify only environment-configured dealer data is shown

3. **Environment Variable Test**:
```bash
# Set environment variables
export NEXTJS_APP_DEALER_ID=494a1788-0619-4a53-99c1-1c9f9b2e8fcc
export NEXTJS_APP_HOSTNAME=www.nissanofportland.com

# Start server
npm run dev

# Verify all API calls use these values
```

## Security Updates

**Last Updated**: December 13, 2025

**Changes**:
- Added CMS tenant selector locking to `NEXTJS_APP_DEALER_ID`
- Created `/api/cms/tenant-config` endpoint for locked tenant ID
- Updated `NonClearableTenantSelector` to read-only mode when locked
- Documented security patterns and attack prevention

## Reporting Security Issues

If you discover a security vulnerability:
1. Do **NOT** open a public GitHub issue
2. Contact the security team directly
3. Include reproduction steps and potential impact
4. Allow reasonable time for fix before disclosure

## References

- [Multi-Tenancy Documentation](./multi-tenancy.md)
- [API Security Best Practices](../api-reference/security.md)
- [Environment Configuration](../deployment/environment-variables.md)
