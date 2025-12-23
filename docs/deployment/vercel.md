# Vercel Deployment

## Overview

dt-nextjs is optimized for Vercel deployment with zero-configuration setup, automatic building, edge caching, and environment management.

## Prerequisites

- Vercel account (free or paid)
- GitHub repository connected
- Domain name (optional, can use vercel.app)
- Environment variables prepared

## Initial Deployment

### Step 1: Import Repository

1. Go to [vercel.com/import](https://vercel.com/import)
2. Select GitHub
3. Find and click "Import" on the `dt-nextjs` repository
4. Grant permissions if prompted

### Step 2: Configure Project

**Project Name**: `dt-nextjs` (or custom name)

**Framework Preset**: Next.js (auto-detected)

**Root Directory**: `./` (default)

### Step 3: Set Environment Variables

In the "Environment Variables" section, add:

```
DEALER_TOWER_API_URL=https://api.dealertower.com/public
NEXTJS_APP_DEALER_ID=494a1788-0619-4a53-99c1-1c9f9b2e8fcc
NEXTJS_APP_HOSTNAME=www.nissanofportland.com
REVALIDATION_SECRET=your-super-secret-key-here
NODE_ENV=production
REDIS_URL=your-redis-connection-string (if using Redis for CSRF)
```

### Step 4: Deploy

Click "Deploy" and wait for build to complete.

## Environment Variables

### Production Settings

```bash
# API Configuration (Required)
DEALER_TOWER_API_URL=https://api.dealertower.com/public
NEXTJS_APP_DEALER_ID=494a1788-0619-4a53-99c1-1c9f9b2e8fcc
NEXTJS_APP_HOSTNAME=www.nissanofportland.com

# Security (Required)
REVALIDATION_SECRET=generate-a-long-random-string-here

# Optional
NODE_ENV=production
REDIS_URL=redis://user:password@host:port  # For CSRF token storage
DISABLE_WEBSITE_SCRIPTS=false

# Analytics (Optional)
NEXT_PUBLIC_SEGMENT_KEY=your-segment-key
```

### Preview Environment

```bash
DEALER_TOWER_API_URL=https://api.dealertower.com/public
NEXTJS_APP_DEALER_ID=494a1788-0619-4a53-99c1-1c9f9b2e8fcc
NEXTJS_APP_HOSTNAME=www.nissanofportland.com
NODE_ENV=production
```

### Setting Variables in Vercel Dashboard

1. Go to Project Settings → Environment Variables
2. Add variable name and value
3. Select environments: Production, Preview, Development
4. Click "Save"
5. Redeploy for changes to take effect

## Domain Configuration

### Custom Domain

1. Go to Project Settings → Domains
2. Click "Add Domain"
3. Enter your domain (e.g., `www.nissanofportland.com`)
4. Follow DNS configuration steps:
   - CNAME: `cname.vercel-dns.com`
   - Or update DNS at domain registrar

### Vercel Domain

Automatic: `project-name.vercel.app`

### Environment-Specific Domains

Different domains per environment:

```
Production: www.nissanofportland.com  (Points to main deployment)
Preview: pr-123.nissanofportland.com  (Auto-generated for PRs)
Development: localhost:3000           (Local dev)
```

## CI/CD Pipeline

### Automatic Deployments

**Main Branch** → Production deployment
**PR Branches** → Preview deployments
**Other Branches** → Development environment (optional)

### Build Settings

The build process:
1. Installs dependencies: `npm install`
2. Runs build: `npm run build`
3. Analyzes bundle (optional)
4. Deploys to edge network

**Build Command**: `npm run build` (default)
**Output Directory**: `.next` (auto-detected)

### Skipping Builds

Set "Ignored Build Step" in Vercel settings to skip unnecessary builds:

```bash
# Don't rebuild on docs changes
npm list-files | grep -E '^\.(next|vercel|venv)/' && exit 0 || exit 1
```

Or use `vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "ignoreCommand": "git diff --quiet HEAD^ HEAD -- docs ."
}
```

## Performance Optimization

### Edge Caching

Vercel automatically caches:
- Static assets (images, fonts, CSS)
- API responses with `next.revalidate`
- ISR (Incremental Static Regeneration) pages

### Headers Configuration

Configured in `next.config.ts`:

```typescript
// Cache static assets
headers: async () => [
  {
    source: '/_next/static/(.*)',
    headers: [
      {
        key: 'Cache-Control',
        value: 'public, max-age=31536000, immutable',
      },
    ],
  },
]
```

### Image Optimization

Uses Vercel Image Optimization:
- Automatic WebP conversion
- Responsive image serving
- CDN distribution

## Monitoring & Analytics

### Vercel Analytics

Track performance in Vercel dashboard:
1. Go to Analytics tab
2. View Real Experience Score (RES)
3. Monitor Core Web Vitals

### Web Vitals

Monitor in code:

```typescript
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

export function reportWebVitals(metric) {
  console.log(metric);
  // Send to analytics service
}
```

### Error Tracking

Errors automatically logged in Vercel:
1. Go to Deployments
2. View Functions and Edge logs
3. Check error messages

## Database & Redis

### Redis Configuration

For CSRF token storage:

```bash
# In Vercel dashboard, add:
REDIS_URL=redis://user:pass@host:port
```

Or use Vercel KV:
1. Install: `vercel env pull` → Select KV database
2. Uses: `process.env.KV_REST_API_URL`, `process.env.KV_REST_API_TOKEN`

## Rollback & Deployments

### View Deployment History

1. Go to Deployments tab
2. See all deployments with timestamps
3. Click to view build logs

### Rollback to Previous Version

1. Click deployment
2. Click "Promote to Production"
3. Or use CLI: `vercel rollback`

### Deployment Aliases

```bash
# Create alias for rollback
vercel alias set project-name.vercel.app alias-name.vercel.app
```

## Troubleshooting

### Build Fails

Check build logs:
1. Go to Deployments → Failed deployment
2. Expand "Build" step
3. Look for error messages

Common issues:
- Missing env vars: Add to Environment Variables
- Package issues: Run `npm install` locally
- TypeScript errors: Fix with `npm run lint`

### Slow Deployments

Optimization tips:
1. Reduce bundle size (check `npm run analyze`)
2. Enable edge functions for API routes
3. Use static generation where possible

### 404 Errors

**Problem**: Route returns 404

**Solutions**:
1. Verify route exists in `app/` directory
2. Check trailing slashes in `next.config.ts`
3. Verify dynamic routes use correct syntax

### Environment Variable Issues

**Problem**: Env vars not loading

**Solutions**:
1. Verify variable added to dashboard
2. Redeploy after adding variables
3. Check variable names match code
4. Use `vercel env pull` to sync local

## Local Development (Vercel CLI)

### Install CLI

```bash
npm i -g vercel
```

### Login

```bash
vercel login
```

### Link Project

```bash
vercel link
```

### Pull Environment Variables

```bash
vercel env pull
```

Creates `.env.local` with production variables.

### Run Production Build

```bash
vercel build
vercel start
```

Tests production build locally.

## Advanced Configuration

### vercel.json

Project configuration file:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "env": {
    "DEALER_TOWER_API_URL": "@dealer_tower_api_url",
    "REVALIDATION_SECRET": "@revalidation_secret"
  },
  "regions": ["sfo1", "pdx1"],
  "functions": {
    "api/**/*.ts": {
      "memory": 3008,
      "maxDuration": 60
    }
  },
  "headers": [
    {
      "source": "/api/revalidate/",
      "headers": [
        {
          "key": "X-Robots-Tag",
          "value": "noindex"
        }
      ]
    }
  ]
}
```

### Custom Domains per Dealer

```json
{
  "rewrites": [
    {
      "source": "/",
      "destination": "/"
    }
  ]
}
```

Or use Vercel edge middleware:

```typescript
// middleware.ts
export function middleware(request) {
  const hostname = request.headers.get('host');
  // Route based on hostname
  return rewriteResponse(request);
}
```

## Multi-Tenancy Deployment

### Separate Deployments per Dealer

Option 1: Single deployment, multiple domains
```
www.nissanofportland.com → project.vercel.app
www.dealer2.com → project.vercel.app
```

Option 2: Separate deployments
```
vercel deploy --prod --env NEXTJS_APP_DEALER_ID=uuid-1
vercel deploy --prod --env NEXTJS_APP_DEALER_ID=uuid-2
```

## Cost Optimization

### Vercel Pricing

- **Hobby**: Free tier, 100GB bandwidth/month
- **Pro**: $20/month, unlimited deployments
- **Enterprise**: Custom pricing

### Reduce Costs

1. Use edge caching (automatic)
2. Optimize images (use `<Image>` component)
3. Minimize function duration (API routes)
4. Monitor bandwidth usage

## Related Documentation

- [Environment Variables](./environment-variables.md) - Complete variable reference
- [Performance](./performance.md) - Web Vitals, optimization
- [Architecture](../core-concepts/architecture.md) - System design
- [Caching](../core-concepts/caching.md) - Cache strategy
