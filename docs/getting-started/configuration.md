# Configuration

## Environment Variables

Configuration is managed through environment variables. Create different files for different environments:

- `.env.local` - Local development (gitignored)
- `.env.production` - Production deployment
- `.env` - Defaults (committed to repo)

## Required Variables

### API Configuration

```bash
# Dealer Tower API base URL
DEALER_TOWER_API_URL=https://api.dealertower.com/public
```

**Required**: Always needed for API integration.

### Cache Invalidation

```bash
# Secret key for webhook-based cache invalidation
REVALIDATION_SECRET=your-secure-random-string-here
```

**Required**: Needed for cache invalidation endpoint security.

Generate a secure secret:
```bash
openssl rand -base64 32
```

## Development Variables

### Local Hostname Override

```bash
# Override hostname detection for local development
NEXTJS_APP_HOSTNAME=www.nissanofportland.com

# Corresponding dealer UUID (fetched from API)
NEXTJS_APP_DEALER_ID=494a1788-0619-4a53-99c1-1c9f9b2e8fcc
```

**Purpose**: In production, hostname is extracted from request headers. In local dev, use these variables to simulate a specific dealer.

### Node Environment

```bash
# Current environment
NODE_ENV=development  # or production
```

## Optional Features

### Form Security

```bash
# Redis connection for CSRF token storage (production recommended)
REDIS_URL=redis://localhost:6379
```

**Default**: In-memory storage if not set (dev only).

### Rate Limiting

```bash
# Maximum requests per minute (optional)
RATE_LIMIT_MAX_REQUESTS=60
```

**Default**: No rate limiting if not set.

### Origin Validation

```bash
# Enable origin header validation (production recommended)
VALIDATE_ORIGIN=1
```

**Default**: Origin validation disabled if not set.

### Script Loading

```bash
# Disable third-party scripts (useful for development)
DISABLE_WEBSITE_SCRIPTS=1
```

**Default**: Scripts enabled if not set.

### Bundle Analysis

```bash
# Enable webpack bundle analyzer
ANALYZE=true
```

**Usage**: 
```bash
ANALYZE=true npm run build
```

## Environment Examples

### Local Development (.env.local)

```bash
# API
DEALER_TOWER_API_URL=https://api.dealertower.com/public

# Local Development
NEXTJS_APP_HOSTNAME=www.nissanofportland.com
NEXTJS_APP_DEALER_ID=494a1788-0619-4a53-99c1-1c9f9b2e8fcc

# Security (relaxed for dev)
REVALIDATION_SECRET=dev-secret-key
# RATE_LIMIT_MAX_REQUESTS=          # Disabled
# VALIDATE_ORIGIN=                   # Disabled

# Optional
DISABLE_WEBSITE_SCRIPTS=1           # No 3rd party scripts in dev

# Environment
NODE_ENV=development
```

### Production (.env.production)

```bash
# API
DEALER_TOWER_API_URL=https://api.dealertower.com/public

# Security (full protection)
REVALIDATION_SECRET=${REVALIDATION_SECRET}  # From Vercel env
RATE_LIMIT_MAX_REQUESTS=60
VALIDATE_ORIGIN=1
REDIS_URL=${REDIS_URL}              # From Vercel/Redis provider

# Scripts
# DISABLE_WEBSITE_SCRIPTS=           # Enabled (not set)

# Environment
NODE_ENV=production
```

## Vercel Configuration

When deploying to Vercel:

1. **Add environment variables** in Project Settings → Environment Variables
2. **Mark sensitive variables** (like `REVALIDATION_SECRET`) as sensitive
3. **Set per-environment** if needed (Production/Preview/Development)

Example Vercel variables:
- `DEALER_TOWER_API_URL` → Production
- `REVALIDATION_SECRET` → Production (sensitive)
- `REDIS_URL` → Production (sensitive)
- `VALIDATE_ORIGIN` → Production only
- `RATE_LIMIT_MAX_REQUESTS` → Production only

## Security Best Practices

### Secrets

- ✅ Use strong, randomly generated secrets
- ✅ Never commit secrets to git
- ✅ Rotate secrets periodically
- ✅ Use different secrets per environment

### Production

- ✅ Enable `VALIDATE_ORIGIN=1`
- ✅ Set `RATE_LIMIT_MAX_REQUESTS`
- ✅ Use Redis for CSRF storage
- ✅ Use environment-specific secrets

### Development

- ✅ Use `.env.local` for local overrides
- ✅ Disable rate limiting for easier testing
- ✅ Disable origin validation for flexibility
- ⚠️ Use simple secrets (but never commit them)

## Validation

Verify your configuration:

```bash
# Check environment variables are loaded
npm run dev

# Look for startup logs showing:
# - API URL
# - Hostname override (if set)
# - Security features enabled
```

## Troubleshooting

### Variables Not Loading

- Ensure `.env.local` is in the project root
- Restart the dev server after changes
- Check for syntax errors in `.env` files

### Hostname Override Not Working

- Verify `NEXTJS_APP_HOSTNAME` is set correctly
- Check `NEXTJS_APP_DEALER_ID` matches the hostname
- Clear Next.js cache: `rm -rf .next`

### API Calls Failing

- Verify `DEALER_TOWER_API_URL` is correct
- Check network connectivity
- Verify dealer hostname exists in API

## Next Steps

- [Local Development](./local-development.md) - Development workflow
- [Multi-Tenancy](../core-concepts/multi-tenancy.md) - How tenant detection works
- [Deployment](../deployment/vercel.md) - Deploy to production
