# Dealer Assets

Each dealer can have their own static assets like logos, favicons, and images. These are served dynamically based on the current dealer context.

## Directory Structure

```text
dealers/{dealer-uuid}/public/
  assets/
    logo.png                      # Main logo (400x150px recommended)
    logo-dark.png                 # Dark mode logo variant
    favicon.ico                   # Favicon (32x32px)
    favicon.svg                   # SVG favicon
    apple-icon.png                # Apple touch icon (180x180px)
    og-image.png                  # Open Graph image (1200x630px)
    icon-dark-32x32.png           # Dark icon variant
    icon-light-32x32.png          # Light icon variant
    images/
      hero-background.jpg         # Hero section backgrounds
      team-placeholder.jpg        # Placeholder images
      logo-variations/            # Brand logo variations
      ...
```

## Asset URL Resolution

All dealer assets are served through the `/assets/` API route:

```text
Request: /assets/logo.png
Resolves to: dealers/{dealer-uuid}/public/assets/logo.png
```

### Fallback Behavior

If a dealer-specific asset doesn't exist, the system falls back to the shared `public/` directory:

1. First checks: `dealers/{dealer-uuid}/public/assets/{path}`
2. Falls back to: `public/{path}`

## Using Assets in Components

### Direct Path Reference

Use the `/assets/` prefix in image sources:

```typescript
import Image from "next/image"

export default function Logo() {
  return (
    <Image
      src="/assets/logo.png"
      alt="Dealer Logo"
      width={200}
      height={60}
      priority
    />
  )
}
```

### Using the Helper Function

The `getDealerAssetUrl` helper ensures consistent asset paths:

```typescript
import { getDealerAssetUrl } from '@dealertower/lib/dealers/assets'

export default function Logo() {
  return (
    <img
      src={getDealerAssetUrl('logo.png')}
      alt="Logo"
    />
  )
}

// For nested paths
const heroImage = getDealerAssetUrl('images/hero-background.jpg')
```

### Common Asset Constants

Pre-defined constants for standard assets:

```typescript
import { DEALER_ASSETS, getDealerAssets } from '@dealertower/lib/dealers/assets'

// Individual constants
DEALER_ASSETS.LOGO          // 'logo.png'
DEALER_ASSETS.LOGO_DARK     // 'logo-dark.png'
DEALER_ASSETS.FAVICON       // 'favicon.ico'
DEALER_ASSETS.FAVICON_SVG   // 'favicon.svg'
DEALER_ASSETS.APPLE_TOUCH_ICON // 'apple-touch-icon.png'
DEALER_ASSETS.OG_IMAGE      // 'og-image.png'

// Get all URLs at once
const assets = getDealerAssets()
assets.logo        // '/assets/logo.png'
assets.logoDark    // '/assets/logo-dark.png'
assets.favicon     // '/assets/favicon.ico'
assets.faviconSvg  // '/assets/favicon.svg'
```

## Asset API Route

The `app/assets/[...path]/route.ts` handles asset serving:

```typescript
// Simplified version of the asset route handler

export async function GET(request: NextRequest, context) {
  const { path } = await context.params;
  const assetPath = path.join('/');
  
  // Security: Get dealer ID from environment (not request)
  const dealerId = process.env.NEXTJS_APP_DEALER_ID || 'default';
  
  // Security: Prevent directory traversal
  if (assetPath.includes('..') || assetPath.includes('~')) {
    return new NextResponse('Invalid path', { status: 400 });
  }
  
  // Try dealer-specific asset first
  const dealerPath = join('dealers', dealerId, 'public', 'assets', assetPath);
  if (await fileExists(dealerPath)) {
    return serveFile(dealerPath, {
      'Cache-Control': 'public, max-age=31536000, immutable',
      'X-Dealer-Asset': 'true',
    });
  }
  
  // Fallback to shared public directory
  const sharedPath = join('public', assetPath);
  if (await fileExists(sharedPath)) {
    return serveFile(sharedPath, {
      'Cache-Control': 'public, max-age=31536000, immutable',
      'X-Dealer-Asset': 'false',
    });
  }
  
  return new NextResponse('Asset not found', { status: 404 });
}
```

## Favicons and Icons

Favicons are automatically linked in the root layout using `getDealerIconLinks`:

```typescript
// packages/lib/dealers/assets.ts

export function getDealerIconLinks() {
  return [
    {
      rel: 'icon',
      url: getDealerAssetUrl(DEALER_ASSETS.FAVICON),
    },
    {
      rel: 'icon',
      url: getDealerAssetUrl(DEALER_ASSETS.FAVICON_SVG),
      type: 'image/svg+xml',
    },
    {
      rel: 'apple-touch-icon',
      url: getDealerAssetUrl(DEALER_ASSETS.APPLE_TOUCH_ICON),
    },
  ];
}
```

Used in `app/layout.tsx`:

```typescript
const iconLinks = getDealerIconLinks();

return (
  <html>
    <head>
      {iconLinks.map((link, index) => (
        <link key={index} {...link} />
      ))}
    </head>
    <body>{children}</body>
  </html>
);
```

## Supported File Types

The asset route supports these MIME types:

| Extension | MIME Type |
|-----------|-----------|
| `.png` | `image/png` |
| `.jpg`, `.jpeg` | `image/jpeg` |
| `.gif` | `image/gif` |
| `.svg` | `image/svg+xml` |
| `.ico` | `image/x-icon` |
| `.webp` | `image/webp` |
| `.txt` | `text/plain` |
| `.xml` | `application/xml` |
| `.json` | `application/json` |
| `.pdf` | `application/pdf` |

## Caching

Assets are served with aggressive caching headers:

```text
Cache-Control: public, max-age=31536000, immutable
```

This means assets are cached for 1 year. To bust the cache:

1. Change the filename: `logo-v2.png`
2. Add a query parameter: `logo.png?v=2`
3. Use content hash in build process

## Image Optimization

### Using Next.js Image

For automatic optimization, use the Next.js `<Image>` component:

```typescript
import Image from "next/image"

<Image
  src="/assets/hero.jpg"
  alt="Hero"
  width={1920}
  height={1080}
  priority        // For above-fold images
  quality={85}    // Compression quality
/>
```

### Image Specifications

Recommended image specifications:

| Asset Type | Dimensions | Format | Notes |
|------------|------------|--------|-------|
| Logo | 400x150px | PNG/SVG | Transparent background |
| Logo (dark) | 400x150px | PNG/SVG | For dark mode |
| Favicon | 32x32px | ICO | Multi-size ICO preferred |
| Favicon SVG | Any | SVG | Scalable alternative |
| Apple Touch Icon | 180x180px | PNG | Solid background |
| OG Image | 1200x630px | PNG/JPG | Social media preview |
| Hero Images | 1920x1080px | WebP/JPG | Compress for web |

## Security Considerations

1. **Environment-based resolution**: Dealer ID comes from `NEXTJS_APP_DEALER_ID`, not request parameters
2. **Path traversal protection**: `..` and `~` characters are rejected
3. **No user input**: Asset paths are validated server-side
4. **Immutable caching**: Assets can't be modified once cached

## Example: Complete Asset Setup

```text
dealers/73d6c4fc-8ffb-471e-88c4-5e8eeddc1c63/public/assets/
├── logo.png
├── logo-dark.png
├── favicon.ico
├── favicon.svg
├── apple-icon.png
├── og-image.png
├── icon-dark-32x32.png
├── icon-light-32x32.png
└── images/
    ├── hero-desktop.webp
    ├── hero-mobile.webp
    ├── team/
    │   ├── ceo.jpg
    │   ├── sales-manager.jpg
    │   └── service-manager.jpg
    ├── locations/
    │   ├── main-showroom.jpg
    │   └── service-center.jpg
    └── brands/
        ├── toyota.png
        ├── honda.png
        └── nissan.png
```
