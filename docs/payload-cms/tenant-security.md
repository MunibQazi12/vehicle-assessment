# Payload CMS Tenant Security

## Overview

The Payload CMS integration is fully secured to ensure that all data operations are locked to the dealer ID specified in `NEXTJS_APP_DEALER_ID`. This prevents unauthorized access to other dealers' content through the CMS.

## Security Architecture

### 1. **Frontend Queries (Server Components)**

All page queries in Next.js Server Components use `getDealerId()` to fetch the tenant ID:

```typescript
// app/(site)/(page)/[[...slug]]/page.tsx
const dealerId = getDealerId(); // Reads from NEXTJS_APP_DEALER_ID

const page = await queryPageBySlug({
  slug: slugString,
  tenantId: dealerId, // Uses environment variable
});
```

**Security**: The `getDealerId()` function in [`packages/lib/dealers/loader.ts`](../../packages/lib/dealers/loader.ts) reads directly from `process.env.NEXTJS_APP_DEALER_ID`, ensuring tenant isolation at the query level.

### 2. **CMS Admin Panel Tenant Selector**

The tenant selector in the Payload CMS admin panel is locked when `NEXTJS_APP_DEALER_ID` is set:

- **Component**: [`cms/components/NonClearableTenantSelector/index.tsx`](../../cms/components/NonClearableTenantSelector/index.tsx)
- **Behavior**: 
  - Fetches locked tenant ID from `/api/cms/tenant-config`
  - Automatically selects the environment-configured tenant
  - Hides the selector UI (returns `null`) when locked
  - Prevents onChange events when tenant is locked
- **API Endpoint**: [`app/api/cms/tenant-config/route.ts`](../../app/api/cms/tenant-config/route.ts)

```typescript
// CMS tenant selector behavior
if (lockedTenantId) {
  return null; // Hide selector completely
}
```

### 3. **Multi-Tenant Plugin Configuration**

The `multiTenantPlugin` automatically filters collections by tenant:

```typescript
// cms/plugins/index.ts
multiTenantPlugin({
  collections: {
    pages: {},      // Tenant-filtered
    media: {},      // Tenant-filtered
    header: { isGlobal: true },  // One per tenant
    footer: { isGlobal: true },  // One per tenant
  },
  // Note: Users and Tenants are NOT included
  // They remain accessible across all tenants for admins
})
```

**Security Features**:
- Automatic tenant filtering on all configured collections
- Admin/Super-Admin role checks for cross-tenant access
- Tenant field access control prevents unauthorized updates

### 4. **Query-Level Tenant Isolation**

All Payload queries include tenant filtering:

```typescript
// Query pages by tenant
const result = await payload.find({
  collection: 'pages',
  where: {
    and: [
      { slug: { equals: slug } },
      { tenant: { equals: tenantId } } // ← Tenant isolation
    ]
  }
});
```

**Protection**: Even if a malicious query attempts to access another tenant's data, the `tenant` filter ensures only the configured dealer's content is returned.

## Data Flow Security

```
Frontend Request
    ↓
Server Component (Next.js)
    ├─ getDealerId() → reads NEXTJS_APP_DEALER_ID ✅
    └─ queryPageBySlug(tenantId) → tenant-filtered query ✅
    ↓
Payload CMS
    ├─ multiTenantPlugin applies automatic filtering ✅
    ├─ Access control checks user permissions ✅
    └─ Returns only tenant-specific data ✅
    ↓
Response to Client
```

## Admin Panel Security

### Tenant Selector Locking

When `NEXTJS_APP_DEALER_ID` is set (production deployments):

1. **Fetch Lock Status**: Admin panel calls `/api/cms/tenant-config` on mount
2. **Lock Tenant**: If `tenantId` returned, selector sets that tenant and hides UI
3. **Prevent Switching**: `onChange` handler returns early if tenant is locked
4. **Visual Feedback**: Selector component returns `null` (hidden) when locked

```typescript
// NonClearableTenantSelector logic
useEffect(() => {
  fetch('/api/cms/tenant-config')
    .then(res => res.json())
    .then(data => {
      if (data.tenantId) {
        setLockedTenantId(data.tenantId); // Lock to env tenant
      }
    });
}, []);

// Hide selector when locked
if (lockedTenantId) {
  return null;
}
```

### Role-Based Access Control

The multi-tenant plugin respects role permissions:

- **Super Admin**: Access to all tenants (for platform management)
- **Admin**: Access to all tenants (for multi-store groups)
- **Manager**: Access only to assigned tenants

**Security Note**: In single-dealer deployments (when `NEXTJS_APP_DEALER_ID` is set), the tenant selector is hidden regardless of role, enforcing single-tenant access.

## Environment Variables

### Required Configuration

```bash
# .env.local (production)
NEXTJS_APP_DEALER_ID=494a1788-0619-4a53-99c1-1c9f9b2e8fcc  # Locks CMS to this dealer
NEXTJS_APP_HOSTNAME=www.nissanofportland.com
```

### Security Implications

| Variable | Impact | Security |
|----------|--------|----------|
| `NEXTJS_APP_DEALER_ID` | Locks all CMS queries and admin panel | ✅ Environment-level protection |
| `NEXTJS_APP_HOSTNAME` | Determines tenant context in API routes | ✅ Environment-level protection |

**Critical**: Both variables are:
- Set at deployment/container level
- Read-only at runtime (process.env)
- Never accepted from HTTP requests
- Protected by OS-level process isolation

## Attack Prevention

### CMS Tenant Injection (Prevented ✅)

**Attack Scenario**: Admin user tries to manipulate tenant selector to access another dealer's CMS content.

**Defense**:
1. Tenant selector locked to `NEXTJS_APP_DEALER_ID`
2. UI hidden when tenant is locked
3. `onChange` handler ignores input when locked
4. Backend queries always use environment variable

### Cross-Tenant Data Access (Prevented ✅)

**Attack Scenario**: Malicious query attempts to fetch pages from another tenant.

**Defense**:
1. `getDealerId()` only reads from environment
2. All queries include `tenant: { equals: tenantId }` filter
3. Multi-tenant plugin enforces automatic filtering
4. Access control validates user permissions

### API Route Bypass (Prevented ✅)

**Attack Scenario**: Direct API call to Payload CMS with injected tenant ID.

**Defense**:
1. All Next.js API routes read tenant from environment only
2. Payload API routes protected by access control
3. GraphQL queries filtered by tenant automatically
4. REST API queries filtered by tenant automatically

## Testing Tenant Lock

### Manual Verification

1. **Check Environment**:
```bash
echo $NEXTJS_APP_DEALER_ID  # Should output dealer UUID
```

2. **Admin Panel**:
   - Navigate to `/admin`
   - Verify tenant selector is NOT visible
   - Check that only configured dealer's content appears

3. **API Endpoint**:
```bash
curl http://localhost:3000/api/cms/tenant-config
# Expected: {"tenantId":"<uuid>","locked":true,"message":"Tenant locked to environment configuration"}
```

### Automated Tests

See [`packages/lib/tenant/__tests__/security.test.ts`](../../packages/lib/tenant/__tests__/security.test.ts) for comprehensive tenant security tests.

## Best Practices

### For Developers

- ✅ **Always** use `getDealerId()` when querying CMS data
- ✅ Include tenant filter in all Payload queries
- ✅ Never accept tenant ID from request parameters
- ✅ Test with `NEXTJS_APP_DEALER_ID` set in development
- ❌ **Never** hardcode dealer IDs
- ❌ **Never** read tenant from request headers/body
- ❌ **Never** bypass tenant filtering

### For Deployment

- ✅ Set `NEXTJS_APP_DEALER_ID` in production environment
- ✅ Verify tenant lock via `/api/cms/tenant-config`
- ✅ Test admin panel shows correct dealer content only
- ✅ Monitor logs for unauthorized access attempts
- ❌ **Never** deploy without `NEXTJS_APP_DEALER_ID` set
- ❌ **Never** share tenant IDs across deployments

## Related Documentation

- [Main Security Documentation](./security.md) - Complete tenant security overview
- [Multi-Tenancy Architecture](./multi-tenancy.md) - Hostname-based tenant resolution
- [Payload CMS Configuration](../payload-cms/configuration/overview.mdx) - CMS setup and config
- [Deployment Guide](../deployment/vercel.md) - Production deployment with environment variables

## Security Updates

**Last Updated**: December 13, 2025

**Changes**:
- Added CMS tenant selector locking to `NEXTJS_APP_DEALER_ID`
- Created `/api/cms/tenant-config` endpoint for locked tenant ID
- Hidden tenant selector UI when locked to environment variable
- Documented CMS query-level tenant isolation
- Added testing procedures for CMS tenant lock

## Reporting Issues

If you discover a CMS-related security vulnerability:
1. Do **NOT** open a public GitHub issue
2. Contact the security team directly
3. Include reproduction steps specific to CMS access
4. Provide tenant IDs involved (if safe to share)
5. Allow reasonable time for fix before disclosure
