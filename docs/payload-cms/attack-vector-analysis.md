# NonClearableTenantSelector - Attack Vector Analysis

## Executive Summary

**Question**: Can anyone use the NonClearableTenantSelector files to access other tenants?

**Answer**: ❌ **NO** - The component is secure against all known attack vectors when used with Payload's multi-tenant plugin. Here's why:

## Component Architecture

### Current Implementation

```
ServerWrapper.tsx (Server Component)
  ↓ Reads NEXTJS_APP_DEALER_ID from environment
  ↓ Passes as prop to client component
  ↓
NonClearableTenantSelector (Client Component)
  ↓ Receives lockedTenantId prop
  ↓ Calls setTenant() from multi-tenant plugin
  ↓ Returns null (no UI)
```

## Attack Vector Analysis

### 1. ❌ Client-Side Prop Manipulation

**Attack**: Modify `lockedTenantId` prop in browser DevTools to inject different tenant ID.

**Why It Fails**:
- React props are **not persisted** - they're created fresh on each server render
- `ServerWrapper.tsx` runs on the server and reads from `process.env.NEXTJS_APP_DEALER_ID`
- Browser DevTools can only modify the **current render** - page refresh resets to server value
- The multi-tenant plugin's `setTenant()` call only affects **frontend filtering** in the admin UI
- **Server-side access control** is enforced independently by Payload (see below)

**Outcome**: Even if user modifies prop in DevTools, it only affects that browser tab until refresh. Server-side access control still enforces tenant isolation.

---

### 2. ❌ Direct API Manipulation (Bypass Component)

**Attack**: Skip the frontend component entirely and send GraphQL/REST requests with manipulated tenant IDs.

**Why It Fails**:
- Payload CMS has **server-side access control** defined in collection configs
- Collections use `authenticated` and `authenticatedOrPublished` access functions
- The multi-tenant plugin adds automatic `WHERE tenant = ?` clauses to all database queries
- User authentication is tied to specific tenant(s) via the `tenant` field on Users collection
- Access control runs **on the server** for every request, regardless of frontend state

**Example from Pages collection**:
```typescript
export const Pages: CollectionConfig<'pages'> = {
  access: {
    create: authenticated,  // Server-side check
    delete: authenticated,  // Server-side check
    read: authenticatedOrPublished,  // Server-side check
    update: authenticated,  // Server-side check
  },
  // ...
}
```

**Outcome**: Server validates user's tenant access on every request. Frontend component state is irrelevant.

---

### 3. ❌ Session/Cookie Manipulation

**Attack**: Modify session cookies or JWT tokens to include different tenant IDs.

**Why It Fails**:
- User's tenant assignment is stored in the **database** (`users` table, `tenant` field)
- Session only stores user ID, not tenant ID
- When validating access, Payload fetches user record from database and checks tenant field
- Cannot modify database record without authentication
- Session tampering would invalidate signature (JWT) or be rejected by server

**Outcome**: Tenant assignment is server-side and database-backed. Cookie manipulation ineffective.

---

### 4. ❌ Race Condition Attack

**Attack**: Rapidly switch tenants using `setTenant()` before server validates access.

**Why It Fails**:
- `setTenant()` is a **client-side state change** only - affects what the UI displays/requests
- Server-side access control validates **every request independently**
- Race conditions in frontend state don't affect server-side validation
- Server queries include `WHERE tenant = ?` clause **on every request**

**Outcome**: Server-side validation is atomic per request. Frontend state races are irrelevant.

---

### 5. ❌ SQL Injection via Tenant ID

**Attack**: Inject SQL through tenant ID to bypass WHERE clauses.

**Why It Fails**:
- Payload uses **parameterized queries** via Drizzle ORM
- Tenant IDs are UUIDs validated by PostgreSQL UUID type
- Type validation happens at database level (UUID format enforcement)
- ORM prevents raw SQL concatenation

**Example**:
```typescript
// Payload generates safe queries like:
SELECT * FROM pages WHERE tenant = $1  // $1 = UUID parameter
// NOT: SELECT * FROM pages WHERE tenant = '...' (unsafe concatenation)
```

**Outcome**: Type-safe ORM with UUID validation prevents SQL injection.

---

### 6. ❌ Environment Variable Override

**Attack**: Somehow override `NEXTJS_APP_DEALER_ID` environment variable at runtime.

**Why It Fails**:
- Environment variables are set at **process start time**
- Cannot be modified by HTTP requests (isolated per-process)
- In production (Vercel), env vars are locked at deployment time
- User code cannot modify `process.env` from outside the process

**Outcome**: Environment variables are process-level, not request-level. No runtime modification possible.

---

## Server-Side Security Layer

### Multi-Tenant Plugin Automatic Filtering

The `multiTenantPlugin` automatically adds tenant filtering to all configured collections:

```typescript
// cms/plugins/index.ts
multiTenantPlugin({
  collections: {
    pages: {},
    media: {},
    header: { isGlobal: true },
    footer: { isGlobal: true },
  },
  // ...
})
```

**What this does**:
1. Adds a `tenant` field (UUID) to each configured collection
2. Adds `WHERE tenant = ?` clause to **all database queries** automatically
3. Validates user's tenant access on every request
4. Filters results to only show data from authorized tenants

### User-Tenant Association

Users are linked to tenants via the `tenant` field:

```typescript
// cms/collections/Users/index.ts
{
  name: 'tenant',
  type: 'relationship',
  relationTo: 'tenants',
  // Managers must be assigned to at least one tenant
  // Super Admins and Admins can access all tenants
}
```

**Access hierarchy**:
- **Super Admin**: Access to all tenants (hardcoded in plugin config)
- **Administrator**: Access to all tenants (hardcoded in plugin config)
- **Manager**: Access only to assigned tenant(s) from `tenant` field

### Request Flow with Security Validation

```
1. User sends request to /api/cms/pages
   ↓
2. Payload validates JWT/session
   ↓
3. Payload fetches user record from database
   ↓
4. Payload checks user's role and tenant field
   ↓
5. If Manager: Add WHERE tenant IN (user.tenant)
   If Admin/SuperAdmin: No tenant filter (access all)
   ↓
6. Execute query with automatic tenant filtering
   ↓
7. Return only authorized data
```

## Why NonClearableTenantSelector is Still Necessary

### Without This Component

If we remove `NonClearableTenantSelector`, the multi-tenant plugin's **default selector** appears:

```
[Dropdown: Select Dealer ▼]
- Dealer A
- Dealer B  
- Dealer C
```

**Problem**: 
- Managers assigned to **multiple tenants** could switch between them
- Super Admins/Admins could browse all tenants in the UI
- Creates confusion - which tenant am I editing?
- Risk of accidental cross-tenant edits

### With This Component

The component **locks the UI** to one tenant:

```
(No UI shown - tenant is locked)
```

**Benefits**:
- **Single-tenant instances**: Each deployment only edits one dealer's content
- **Prevents accidents**: Can't accidentally edit wrong dealer's pages
- **Clearer intent**: Deployment is tied to specific dealer from environment
- **Matches architecture**: Each hostname resolves to one dealer

## Security Layers Summary

| Layer | Protection | Attack Vector |
|-------|-----------|---------------|
| **Environment Variables** | `NEXTJS_APP_DEALER_ID` locked at deployment | Cannot be modified at runtime |
| **Server Component** | `ServerWrapper.tsx` reads from `process.env` | Not accessible from client |
| **Multi-Tenant Plugin** | Automatic `WHERE tenant = ?` on all queries | Database-level enforcement |
| **Access Control** | `authenticated` checks on all collections | Server-validates every request |
| **Validation Hooks** | `validateTenantAccess` on `beforeOperation` | Explicit tenant access validation |
| **User-Tenant Link** | Database relationship, not session-based | Cannot be spoofed |
| **UUID Type Validation** | PostgreSQL UUID column type | SQL injection prevention |
| **Parameterized Queries** | Drizzle ORM with prepared statements | Safe parameter binding |
| **Audit Logging** | Security violations logged to Payload logger | Incident tracking and forensics |

## Server-Side Validation Implementation

### Tenant Access Validation Hook

To add an additional layer of defense-in-depth, we've implemented server-side tenant validation hooks that validate every database operation:

**Location**: `cms/hooks/validateTenantAccess.ts`

**How it works**:
1. Extracts tenant ID from request context (set by multi-tenant plugin)
2. Fetches user's authorized tenant IDs from database
3. Validates that requested tenant is in user's authorized list
4. Logs security violations and blocks unauthorized operations

**Applied to collections**:
- ✅ Pages collection (`beforeOperation` hook)
- ✅ Media collection (`beforeOperation` hook)
- ✅ Header collection (`beforeOperation` hook)
- ✅ Footer collection (`beforeOperation` hook)

**Example**:
```typescript
// cms/hooks/validateTenantAccess.ts
export const validateTenantAccess: CollectionBeforeOperationHook = async ({
  operation,
  req,
  context,
}) => {
  const user = req.user as User | null
  
  // Skip validation for Super Admins/Admins (they have access to all tenants)
  if (isAtLeastAdmin(user)) return
  
  // Extract requested tenant ID from context
  const requestedTenantId = context?.tenant || req.context?.tenant
  
  // Get user's authorized tenant IDs from database
  const authorizedTenantIds = getUserTenantIDs(user)
  
  // Validate access
  if (!authorizedIdsStr.includes(requestedIdStr)) {
    req.payload.logger.error(`[Security] Unauthorized tenant access attempt`)
    throw new Error('Access denied: Unauthorized tenant access.')
  }
}
```

**Security benefits**:
- ✅ Server-side enforcement (cannot be bypassed from client)
- ✅ Database-backed validation (reads user tenants from DB)
- ✅ Audit logging (security violations logged)
- ✅ Blocks operation before execution (prevents data leakage)

## Conclusion

**The NonClearableTenantSelector component is NOT a security risk.** 

It's a **UX enhancement** that locks the admin UI to match the deployment's intended tenant. The actual security is enforced by:

1. **Multi-tenant plugin's automatic query filtering** (server-side)
2. **Payload's access control system** (server-side)
3. **Database-backed user-tenant relationships** (server-side)
4. **PostgreSQL UUID type validation** (database-level)
5. **Server-side validation hooks** (explicit tenant access validation)

**Removing this component would:**
- ❌ Make the UI confusing (showing tenant selector that shouldn't be changed)
- ❌ Allow accidental cross-tenant edits for multi-tenant users
- ❌ **NOT improve security** (server-side validation is independent)

**Recommendation**: **KEEP** the component. It's a critical part of the single-tenant deployment architecture and provides defense-in-depth by ensuring the frontend UI matches the environment's intended tenant.

## Related Documentation

- [Core Security Documentation](../core-concepts/security.md) - Next.js API route security patterns
- [Tenant Security](./tenant-security.md) - Payload CMS tenant isolation architecture
- [Multi-Tenant Plugin Docs](https://payloadcms.com/docs/plugins/multi-tenant) - Official Payload plugin documentation
