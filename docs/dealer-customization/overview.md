# Dealer Customization System Overview

The dealer customization system allows each dealership to have fully customized components, pages, assets, and styles while sharing common infrastructure. Dealers are identified by their UUID from the Dealer Tower API.

## Architecture

```text
dealers/
  {dealer-uuid}/                   # UUID from API (e.g., 73d6c4fc-8ffb-471e-88c4-5e8eeddc1c63)
    registry.ts                    # Route registry with page mappings
    components/                    # Custom React components
      Header.tsx                   # Custom header (optional)
      Footer.tsx                   # Custom footer (optional)
      ui/                          # UI primitives (buttons, forms, etc.)
      ...                          # Other custom components
    hooks/                         # Custom React hooks
    lib/                           # Utility functions
    pages/                         # Custom page components
      Home.tsx                     # Homepage
      ContactUs.tsx                # Contact page
      ...                          # Other pages
    public/                        # Public assets
      assets/                      # Static assets served via /assets/* route
        logo.png                   # Dealer logo
        favicon.ico                # Favicon
        images/                    # Additional images
    styles/
      globals.css                  # Dealer-specific CSS variables and styles
```

## Key Concepts

### Dealer Identification

Dealers are identified by their **UUID** from the Dealer Tower API. This UUID is:

1. Retrieved via the proxy from the hostname → dealer API lookup
2. Stored in `NEXTJS_APP_DEALER_ID` environment variable
3. Used as the folder name in `dealers/{uuid}/`

Example UUID: `73d6c4fc-8ffb-471e-88c4-5e8eeddc1c63`

### Path Aliases

TypeScript path aliases simplify imports:

```typescript
// tsconfig.json
{
  "paths": {
    "@dealertower/*": ["./packages/*"],   // Shared code
    "@dealers/*": ["./dealers/*"]          // Dealer-specific code
  }
}
```

Usage:
```typescript
import Header from '@dealers/73d6c4fc-8ffb-471e-88c4-5e8eeddc1c63/components/Header';
import { getDealerRouteLazy } from '@dealertower/lib/dealers/loader';
```

### Resolution Flow

1. **Request arrives** → Proxy extracts hostname
2. **Hostname lookup** → API returns dealer UUID
3. **UUID stored** → Set in headers and environment
4. **Registry lookup** → `getDealerRouteLazy(uuid, path)` lazily loads dealer registry
5. **Component rendering** → Page component loaded on-demand via dynamic import

## Related Documentation

- [Route Registry](./route-registry.md) - How routes map to page components
- [Components](./components.md) - Creating dealer-specific components
- [Pages](./pages.md) - Creating custom dealer pages
- [Assets](./assets.md) - Managing dealer-specific static assets
- [Styles](./styles.md) - Custom CSS and theming
- [Hooks](./hooks.md) - Custom React hooks
- [Library Utilities](./lib-utilities.md) - Utility functions
- [Adding New Dealers](./adding-dealers.md) - Onboarding new dealerships
- [Development Rules](./development-rules.md) - Guidelines for AI agents generating dealer content

