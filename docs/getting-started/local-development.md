# Local Development

## Development Workflow

### Running the Dev Server

```bash
npm run dev
```

The development server runs on `http://localhost:3000` with:
- **Hot Module Replacement (HMR)** - Changes reflect instantly
- **Fast Refresh** - React components update without losing state
- **Error Overlay** - Detailed error messages in the browser

### Testing Different Dealers

Use environment variables to simulate different dealer hostnames:

```bash
# .env.local
NEXTJS_APP_HOSTNAME=www.nissanofportland.com
NEXTJS_APP_DEALER_ID=494a1788-0619-4a53-99c1-1c9f9b2e8fcc
```

To test another dealer, update these values and restart the dev server.

### Available Dealer IDs

Common test dealers (see [Dealer Mapping](../dealer-customization/dealer-mapping.md)):
- Nissan of Portland: `494a1788-0619-4a53-99c1-1c9f9b2e8fcc`
- Toyota Dealership: `73d6c4fc-8ffb-471e-88c4-5e8eeddc1c63`

## Project Structure

### Key Directories

```
app/
├── (dealer)/              # Dynamic dealer pages
│   └── [page]/page.tsx   # Custom dealer pages
├── (srp)/                # Search Results Pages
│   ├── new-vehicles/     # New vehicle inventory
│   └── used-vehicles/    # Used vehicle inventory
├── api/                  # API routes
│   ├── assets/          # Dealer asset serving
│   └── revalidate/      # Cache invalidation
├── vehicle/             # Vehicle Detail Pages
│   └── [vin]/          # VDP by VIN
└── layout.tsx           # Root layout with tenant provider

packages/
├── components/          # Shared React components
│   ├── srp/            # SRP components
│   ├── vdp/            # VDP components
│   ├── forms/          # Form components
│   ├── layout/         # Header/Footer
│   └── ui/             # UI primitives
├── lib/                # Utility functions
│   ├── api/            # API client
│   ├── cache/          # Caching utilities
│   ├── tenant/         # Multi-tenancy
│   └── url/            # URL parsing/building
└── types/              # TypeScript types

dealers/
└── {dealer-uuid}/      # Dealer-specific content
    ├── components/     # Custom components
    ├── pages/         # Custom pages
    └── public/        # Assets (logo, favicon)
```

## Common Development Tasks

### Adding a New Feature

1. **Create component** in `packages/components/`
2. **Add types** in `packages/types/`
3. **Create utility functions** in `packages/lib/` if needed
4. **Update documentation** in `docs/`

### Testing API Changes

```bash
# Check API response
curl https://api.dealertower.com/public/www.nissanofportland.com/v2/inventory/vehicles/srp/filters

# Test with local hostname
curl http://localhost:3000/api/srp/filters/
```

### Working with Dealer Customizations

Create dealer-specific content in `dealers/{dealer-uuid}/`:

```bash
# Create custom header
dealers/494a1788-0619-4a53-99c1-1c9f9b2e8fcc/
└── components/
    └── Header.tsx

# Add custom assets
dealers/494a1788-0619-4a53-99c1-1c9f9b2e8fcc/
└── public/
    ├── logo.png
    └── favicon.ico
```

See [Dealer Customization](../dealer-customization/overview.md) for details.

### Clearing Cache

During development, you may need to clear caches:

```bash
# Clear Next.js build cache
rm -rf .next

# Clear node_modules (if needed)
rm -rf node_modules package-lock.json
npm install
```

## Debugging

### VS Code Launch Configuration

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug server-side",
      "type": "node-terminal",
      "request": "launch",
      "command": "npm run dev"
    },
    {
      "name": "Next.js: debug client-side",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3000"
    }
  ]
}
```

### Console Logging

API client automatically logs requests:
```
[API] /v2/inventory/vehicles/srp/rows - www.nissanofportland.com (245ms)
```

Add custom logging:
```typescript
console.log('[DEBUG]', data);
```

### React DevTools

Install browser extensions:
- React Developer Tools
- Redux DevTools (if using Redux)

### Network Inspection

1. Open browser DevTools (F12)
2. Network tab → Filter by Fetch/XHR
3. Check API requests and responses
4. Verify cache headers

## Code Quality

### Linting

```bash
# Check for errors
npm run lint

# Auto-fix issues
npm run lint:fix
```

### Type Checking

TypeScript checks run automatically during development. To manually check:

```bash
npx tsc --noEmit
```

### Code Style

- Use functional components with hooks
- Prefer Server Components (default)
- Mark Client Components with `"use client"`
- Follow existing naming conventions
- Add JSDoc comments for complex functions

## Testing

Testing framework not currently configured. When adding tests:

1. Install Vitest: `npm install -D vitest @vitest/ui`
2. Create test files: `*.test.ts` or `*.test.tsx`
3. Run tests: `npm test`

Example test location: `lib/url/__tests__/url.test.ts`

## Performance Monitoring

### Build Analysis

```bash
# Generate bundle size report
ANALYZE=true npm run build
```

### Lighthouse

```bash
# Run Lighthouse audit
npx lighthouse http://localhost:3000 --view
```

### Next.js Build Output

Check build output for:
- Static pages (○)
- Server-side rendered pages (λ)
- Page sizes and load times

## Environment-Specific Behavior

### Development
- Hot reload enabled
- Source maps included
- Detailed error messages
- No minification
- Cache disabled by default

### Production
- Optimized build
- Minified code
- Cache enabled
- Error boundaries active
- Source maps optional

## Common Issues

### Port 3000 Busy

```bash
# Kill process
npx kill-port 3000

# Use different port
PORT=3001 npm run dev
```

### Changes Not Reflecting

1. Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
2. Clear browser cache
3. Restart dev server
4. Delete `.next` folder

### TypeScript Errors

```bash
# Regenerate type definitions
rm -rf .next
npm run dev
```

### Module Resolution Issues

Verify `tsconfig.json` path aliases:
```json
{
  "compilerOptions": {
    "paths": {
      "@dealertower/*": ["./packages/*"],
      "@dealers/*": ["./dealers/*"]
    }
  }
}
```

## Git Workflow

### Branch Strategy

- `master` - Production-ready code
- `development` - Active development
- `feature/*` - New features
- `fix/*` - Bug fixes

### Commit Messages

Follow conventional commits:
```
feat: add vehicle comparison feature
fix: resolve caching issue on SRP
docs: update API documentation
chore: upgrade dependencies
```

### Pull Requests

1. Create feature branch from `development`
2. Make changes and commit
3. Push and create PR to `development`
4. Wait for review and CI checks
5. Merge after approval

## Next Steps

- [Architecture](../core-concepts/architecture.md) - System overview
- [Multi-Tenancy](../core-concepts/multi-tenancy.md) - Tenant detection
- [SRP Overview](../features/srp/overview.md) - Search functionality
- [Dealer Customization](../dealer-customization/overview.md) - Per-dealer content
