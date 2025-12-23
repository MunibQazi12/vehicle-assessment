# Environment Variables Reference

## Overview

Complete reference for all environment variables used in dt-nextjs. Variables control API connectivity, security, caching, and feature toggles.

## Variable Categories

### 1. API Configuration

#### DEALER_TOWER_API_URL

**Type**: URL  
**Required**: Yes  
**Example**: `https://api.dealertower.com/public`

Dealer Tower API base URL. All vehicle inventory, filter, and dealer info requests use this URL.

```bash
DEALER_TOWER_API_URL=https://api.dealertower.com/public
```

**Usage**:
```typescript
const apiUrl = process.env.DEALER_TOWER_API_URL;
const endpoint = `${apiUrl}/{hostname}/v2/inventory/vehicles/srp/rows`;
```

### 2. Tenant Configuration

#### NEXTJS_APP_HOSTNAME

**Type**: String  
**Required**: For local development  
**Default**: Uses `x-forwarded-host` or `host` header in production  
**Example**: `www.nissanofportland.com`

Override hostname detection. Useful for local development and testing different dealers.

```bash
NEXTJS_APP_HOSTNAME=www.nissanofportland.com
```

**Usage**:
```typescript
const hostname = process.env.NEXTJS_APP_HOSTNAME || 
                 headers.get('x-forwarded-host') || 
                 headers.get('host');
```

**Testing Multiple Dealers**:
```bash
# Dealer 1
NEXTJS_APP_HOSTNAME=www.nissanofportland.com
NEXTJS_APP_DEALER_ID=494a1788-0619-4a53-99c1-1c9f9b2e8fcc

# Dealer 2
NEXTJS_APP_HOSTNAME=www.dealer2.com
NEXTJS_APP_DEALER_ID=73d6c4fc-8ffb-471e-88c4-5e8eeddc1c63
```

#### NEXTJS_APP_DEALER_ID

**Type**: UUID  
**Required**: For local development  
**Default**: Resolved via API from hostname  
**Example**: `494a1788-0619-4a53-99c1-1c9f9b2e8fcc`

Dealer UUID. Used to load custom components, assets, and pages from `dealers/{uuid}/` directory.

```bash
NEXTJS_APP_DEALER_ID=494a1788-0619-4a53-99c1-1c9f9b2e8fcc
```

**Usage**:
```typescript
const dealerId = process.env.NEXTJS_APP_DEALER_ID ||
                 (await getDealerIdFromHostname(hostname));
```

### 3. Security

#### REVALIDATION_SECRET

**Type**: String (random, 32+ characters)  
**Required**: Yes  
**Example**: `super-secret-key-12345`

HMAC secret for cache invalidation webhook authentication. Prevents unauthorized cache revalidation.

```bash
REVALIDATION_SECRET=your-super-secret-key-of-minimum-32-characters
```

**Generate Random Secret**:
```bash
# macOS/Linux
openssl rand -base64 32

# PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object {[byte](Get-Random -Max 256)}))

# Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Usage in Webhook**:
```typescript
// app/api/revalidate/route.ts
const secret = process.env.REVALIDATION_SECRET;
const headerSecret = request.headers.get('x-revalidation-secret');

if (headerSecret !== secret) {
  return Response.json({ error: 'Unauthorized' }, { status: 401 });
}
```

**Usage in Client**:
```bash
curl -X POST http://localhost:3000/api/revalidate/ \
  -H "x-revalidation-secret: your-super-secret-key-of-minimum-32-characters" \
  -d '{"tags":["srp:vehicles"]}'
```

#### REDIS_URL

**Type**: URL  
**Required**: Only if using Redis for CSRF tokens (production)  
**Default**: In-memory storage (dev)  
**Example**: `redis://user:password@localhost:6379`

Redis connection string for CSRF token storage. Production should use Redis for persistence.

```bash
# Local Redis
REDIS_URL=redis://localhost:6379

# Remote Redis (AWS ElastiCache, Vercel KV, etc.)
REDIS_URL=redis://user:password@redis.example.com:6379

# With authentication
REDIS_URL=redis://:password@redis.example.com:6379
```

**Usage**:
```typescript
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();  // Uses REDIS_URL
```

### 4. Node Environment

#### NODE_ENV

**Type**: `development` | `production` | `test`  
**Required**: No  
**Default**: Auto-detected  
**Example**: `production`

Controls optimization level, logging verbosity, and feature flags.

```bash
# Production (optimized, minimal logging)
NODE_ENV=production

# Development (debugging, verbose logging)
NODE_ENV=development

# Testing
NODE_ENV=test
```

**Usage**:
```typescript
if (process.env.NODE_ENV === 'production') {
  // Production-only logic
}

if (process.env.NODE_ENV === 'development') {
  // Dev-only logging
  console.log('Debug info');
}
```

### 5. Feature Flags

#### DISABLE_WEBSITE_SCRIPTS

**Type**: Boolean  
**Required**: No  
**Default**: `false` (scripts enabled)  
**Example**: `true`

Disable injection of third-party website scripts (GTM, chat widgets, pixels).

```bash
# Enable scripts (default)
DISABLE_WEBSITE_SCRIPTS=false

# Disable scripts (for testing/staging)
DISABLE_WEBSITE_SCRIPTS=true
```

**Usage**:
```typescript
if (process.env.DISABLE_WEBSITE_SCRIPTS === 'true') {
  // Skip script injection
  return null;
}
```

### 6. Analytics & Monitoring

#### NEXT_PUBLIC_SEGMENT_KEY

**Type**: String  
**Required**: No  
**Example**: `write_key_12345`

Segment analytics key. Prefix with `NEXT_PUBLIC_` to expose to client-side code.

```bash
NEXT_PUBLIC_SEGMENT_KEY=write_key_12345
```

**Usage**:
```typescript
// Accessible in browser
const key = process.env.NEXT_PUBLIC_SEGMENT_KEY;

// Send events
analytics.track('vehicle_viewed', { vehicleId: '123' });
```

#### NEXT_PUBLIC_GTAG_ID

**Type**: String  
**Required**: No  
**Example**: `G-XXXXXX`

Google Analytics tag ID (if not provided via Website Information API).

```bash
NEXT_PUBLIC_GTAG_ID=G-XXXXXX
```

### 7. Database & Caching

#### DATABASE_URL

**Type**: URL  
**Required**: No (not currently used)  
**Example**: `postgresql://user:password@localhost:5432/dtdb`

Reserved for future database connection.

```bash
DATABASE_URL=postgresql://user:password@db.example.com:5432/dtdb
```

#### CACHE_TTL

**Type**: Number (seconds)  
**Required**: No  
**Default**: `21600` (6 hours)  
**Example**: `86400`

Default cache TTL for API responses.

```bash
# 6 hours (default)
CACHE_TTL=21600

# 24 hours
CACHE_TTL=86400

# 1 hour
CACHE_TTL=3600
```

**Usage**:
```typescript
const ttl = parseInt(process.env.CACHE_TTL || '21600');
// Use in fetch options: next: { revalidate: ttl }
```

## Environment Files

### .env.local (Development)

Local development overrides. Never commit to Git.

```bash
# .env.local
DEALER_TOWER_API_URL=https://api.dealertower.com/public
NEXTJS_APP_HOSTNAME=www.nissanofportland.com
NEXTJS_APP_DEALER_ID=494a1788-0619-4a53-99c1-1c9f9b2e8fcc
REVALIDATION_SECRET=dev-secret-key-12345
NODE_ENV=development
REDIS_URL=redis://localhost:6379
```

### .env.production

Production settings. Added to Vercel dashboard.

```bash
DEALER_TOWER_API_URL=https://api.dealertower.com/public
REVALIDATION_SECRET=production-secret-key-min-32-chars
NODE_ENV=production
REDIS_URL=redis://prod-redis:6379
```

### .env.staging

Staging environment variables. For pre-production testing.

```bash
DEALER_TOWER_API_URL=https://api.dealertower.com/public
NEXTJS_APP_HOSTNAME=staging.nissanofportland.com
REVALIDATION_SECRET=staging-secret-key-min-32-chars
NODE_ENV=production
```

## Variable Validation

### Validation Function

```typescript
// lib/env.ts
export function validateEnv() {
  const required = [
    'DEALER_TOWER_API_URL',
    'REVALIDATION_SECRET',
  ];

  const missing = required.filter(
    (key) => !process.env[key]
  );

  if (missing.length > 0) {
    throw new Error(
      `Missing environment variables: ${missing.join(', ')}`
    );
  }
}
```

### In Next.js Config

```typescript
// next.config.ts
import { validateEnv } from './lib/env';

validateEnv();

export default {
  // config
};
```

## Per-Environment Configuration

### Development

```bash
# .env.local
DEALER_TOWER_API_URL=https://api.dealertower.com/public
NEXTJS_APP_HOSTNAME=localhost:3000
NEXTJS_APP_DEALER_ID=494a1788-0619-4a53-99c1-1c9f9b2e8fcc
REVALIDATION_SECRET=dev-secret-123
NODE_ENV=development
REDIS_URL=redis://localhost:6379
DISABLE_WEBSITE_SCRIPTS=false
```

### Staging

```bash
# .env.staging (in Vercel Preview env)
DEALER_TOWER_API_URL=https://api.dealertower.com/public
NEXTJS_APP_HOSTNAME=staging.nissanofportland.com
NEXTJS_APP_DEALER_ID=494a1788-0619-4a53-99c1-1c9f9b2e8fcc
REVALIDATION_SECRET=staging-secret-32-chars-minimum
NODE_ENV=production
REDIS_URL=redis://staging-redis:6379
```

### Production

```bash
# In Vercel Dashboard → Project Settings → Environment Variables
DEALER_TOWER_API_URL=https://api.dealertower.com/public
NEXTJS_APP_DEALER_ID=494a1788-0619-4a53-99c1-1c9f9b2e8fcc
REVALIDATION_SECRET=prod-secret-32-chars-minimum
NODE_ENV=production
REDIS_URL=redis://prod-redis:6379
```

## Secrets Management

### Best Practices

✅ DO:
- Use strong random secrets (32+ characters)
- Store secrets in password manager
- Rotate secrets regularly
- Use different secrets per environment
- Never commit `.env.local` to Git

❌ DON'T:
- Commit secrets to repository
- Share secrets in Slack/email
- Use predictable values
- Reuse secrets across environments
- Log secrets in console

### Vercel Secrets

Store in Vercel dashboard:
1. Project Settings → Environment Variables
2. Add variable name and value
3. Select environments
4. Click Save
5. Redeploy

### GitHub Secrets

For CI/CD (if using GitHub Actions):
1. Repo Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Name: `REVALIDATION_SECRET`
4. Value: Your secret key
5. Add

## Troubleshooting

### Variables Not Loading

**Problem**: `process.env.VARIABLE_NAME` is undefined

**Solutions**:
1. Verify variable added to `.env.local` (dev) or Vercel dashboard (prod)
2. Restart dev server after changing `.env.local`
3. Prefix with `NEXT_PUBLIC_` for client-side access
4. Use `vercel env pull` to sync from Vercel

### Exposed Secrets

**Problem**: Secret committed to Git

**Solutions**:
1. Rotate the secret immediately
2. Use BFG to remove from history: `bfg --delete-files id_{your_secret}.rsa`
3. Force push: `git push --force-with-lease`

### Environment-Specific Issues

**Problem**: Works in dev, fails in production

**Solutions**:
1. Verify variables added to Vercel dashboard
2. Redeploy after adding variables
3. Check variable values match (no typos)
4. Use `vercel env pull` to verify locally

## Related Documentation

- [Vercel Deployment](./vercel.md) - Setting up on Vercel
- [Configuration](../getting-started/configuration.md) - Initial setup
- [Security](../features/forms/security.md) - Security best practices
