# Adding New Dealers

This guide covers the complete process of onboarding a new dealer to the system.

## Prerequisites

Before adding a new dealer, ensure you have:

1. **Dealer UUID** - Obtained from Dealer Tower API
2. **Brand assets** - Logo, favicon, and images from the dealer
3. **Page content** - Information for all custom pages
4. **Route requirements** - List of pages and URL structure

## Step 1: Create Directory Structure

Create the dealer directory using their UUID:

```text
dealers/{dealer-uuid}/
  registry.ts
  components/
  hooks/
  lib/
  pages/
  public/
    assets/
      images/
  styles/
```

Example command:

```powershell
$dealerId = "abc12345-6789-def0-1234-567890abcdef"
mkdir -p "dealers/$dealerId/components/ui"
mkdir -p "dealers/$dealerId/hooks"
mkdir -p "dealers/$dealerId/lib"
mkdir -p "dealers/$dealerId/pages"
mkdir -p "dealers/$dealerId/public/assets/images"
mkdir -p "dealers/$dealerId/styles"
```

## Step 2: Add Assets

Copy dealer brand assets to the public directory:

```text
dealers/{dealer-uuid}/public/assets/
  logo.png                 # Main logo (400x150px)
  logo-dark.png            # Dark mode logo
  favicon.ico              # Favicon (32x32px)
  favicon.svg              # SVG favicon
  apple-icon.png           # Apple touch icon (180x180px)
  og-image.png             # Social media image (1200x630px)
  images/
    hero.jpg               # Homepage hero
    ...
```

See [Assets Documentation](./assets.md) for specifications.

## Step 3: Create Utility Files

### lib/utils.ts

```typescript
// dealers/{dealer-uuid}/lib/utils.ts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

### hooks/use-mobile.ts

```typescript
// dealers/{dealer-uuid}/hooks/use-mobile.ts
import { useState, useEffect } from 'react';

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    mql.addEventListener('change', onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  return !!isMobile;
}
```

## Step 4: Create Styles

### styles/globals.css

```css
/* dealers/{dealer-uuid}/styles/globals.css */
@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --primary: oklch(0.4 0.15 250);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.97 0 0);
  --secondary-foreground: oklch(0.205 0 0);
  /* Add more variables as needed */
  --radius: 0.5rem;
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  /* Dark mode overrides */
}

@theme inline {
  --font-sans: "Inter", system-ui, sans-serif;
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
}
```

See [Styles Documentation](./styles.md) for customization options.

## Step 5: Create Components

### Header Component

```typescript
// dealers/{dealer-uuid}/components/Header.tsx
"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/">
            <Image
              src="/assets/logo.png"
              alt="Dealer Logo"
              width={160}
              height={50}
            />
          </Link>
          
          <nav className="hidden lg:flex items-center gap-6">
            <Link href="/new-vehicles">New</Link>
            <Link href="/used-vehicles">Used</Link>
            <Link href="/service">Service</Link>
            <Link href="/contact-us">Contact</Link>
          </nav>
          
          {/* Mobile menu button */}
          <button
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            Menu
          </button>
        </div>
      </div>
    </header>
  )
}
```

### Footer Component

```typescript
// dealers/{dealer-uuid}/components/Footer.tsx
import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-foreground text-background py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold mb-4">Quick Links</h3>
            <nav className="space-y-2">
              <Link href="/new-vehicles" className="block">New Vehicles</Link>
              <Link href="/used-vehicles" className="block">Used Vehicles</Link>
            </nav>
          </div>
          {/* More columns */}
        </div>
        <div className="mt-8 pt-8 border-t border-background/20 text-center">
          © {new Date().getFullYear()} Dealer Name. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
```

See [Components Documentation](./components.md) for more examples.

## Step 6: Create Pages

### Home Page

```typescript
// dealers/{dealer-uuid}/pages/Home.tsx
import Header from "../components/Header"
import Footer from "../components/Footer"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="pt-20 py-24 bg-primary text-primary-foreground">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold mb-6">
              Welcome to Our Dealership
            </h1>
            <p className="text-xl mb-8">
              Find your perfect vehicle today.
            </p>
          </div>
        </section>
        
        {/* More sections */}
      </main>
      <Footer />
    </div>
  )
}
```

### Not Found Page

```typescript
// dealers/{dealer-uuid}/pages/NotFound.tsx
import Header from "../components/Header"
import Footer from "../components/Footer"
import Link from "next/link"

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="pt-20 min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-muted mb-4">404</h1>
          <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
          <Link href="/" className="text-primary hover:underline">
            Return Home
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}
```

See [Pages Documentation](./pages.md) for more examples.

## Step 7: Create Route Registry

```typescript
// dealers/{dealer-uuid}/registry.ts
import type { LazyDealerRegistry } from '@dealertower/types';

// Use lazy loaders for optimal bundle size
const routes: LazyDealerRegistry = {
  '/': {
    loader: () => import('./pages/Home'),
  },
  '/contact-us': {
    loader: () => import('./pages/ContactUs'),
    metadata: {
      title: 'Contact Us | Dealer Name',
      description: 'Get in touch with our team.',
    },
  },
  '/privacy-policy': {
    loader: () => import('./pages/PrivacyPolicy'),
    metadata: {
      title: 'Privacy Policy | Dealer Name',
    },
  },
};

// Optional custom 404 page
const notFoundLoader = () => import('./pages/NotFound');

export default { routes, notFoundLoader };
```

See [Route Registry Documentation](./route-registry.md) for details.

## Step 8: Register in Registry Map

**Critical step**: Add the dealer to the registry map for lazy loading:

```typescript
// packages/lib/dealers/registry-map.ts
import type { LazyDealerRegistryModule } from '@dealertower/types';

type DealerRegistryLoader = () => Promise<LazyDealerRegistryModule>;

export const dealerRegistryLoaders: Record<string, DealerRegistryLoader> = {
  '73d6c4fc-8ffb-471e-88c4-5e8eeddc1c63': () =>
    import('@dealers/73d6c4fc-8ffb-471e-88c4-5e8eeddc1c63/registry').then(
      (m) => m.default
    ),
  // Add new dealer with lazy loader
  'abc12345-6789-def0-1234-567890abcdef': () =>
    import('@dealers/abc12345-6789-def0-1234-567890abcdef/registry').then(
      (m) => m.default
    ),
};
```

> **Note**: The registry map uses dynamic `import()` to ensure each dealer's code is only loaded when needed.

## Step 9: Configure Environment

For local development, add to `.env.local`:

```bash
NEXTJS_APP_DEALER_ID=abc12345-6789-def0-1234-567890abcdef
NEXTJS_APP_HOSTNAME=www.newdealer.com
```

## Step 10: Test Locally

1. Start the development server:

   ```bash
   npm run dev
   ```

2. Verify all pages load correctly
3. Check mobile responsiveness
4. Test all navigation links
5. Verify assets load correctly

## Step 11: Deploy

1. Commit all dealer files
2. Push to your branch
3. Create a pull request
4. After merge, deploy to Vercel

The proxy will automatically detect the hostname and load the correct dealer.

## Checklist

- [ ] Directory structure created
- [ ] Assets added (logo, favicon, images)
- [ ] `lib/utils.ts` created
- [ ] `hooks/use-mobile.ts` created
- [ ] `styles/globals.css` created
- [ ] Header component created
- [ ] Footer component created
- [ ] All page components created
- [ ] Not found page created
- [ ] `registry.ts` created with all routes
- [ ] Added to `registry-map.ts`
- [ ] Environment variables configured
- [ ] Local testing completed
- [ ] Mobile responsiveness verified
- [ ] All links working
- [ ] Assets loading correctly

## Troubleshooting

### Dealer not loading

1. Check `NEXTJS_APP_DEALER_ID` matches folder name
2. Verify dealer is registered in `registry-map.ts`
3. Check for import errors in console

### Assets not loading

1. Verify path: `dealers/{uuid}/public/assets/`
2. Check file permissions
3. Test URL directly: `/assets/logo.png`

### Styles not applying

1. Check `globals.css` syntax
2. Verify CSS variables are defined
3. Check browser dev tools for errors

### Routes returning 404

1. Verify route key matches URL path (include leading `/`)
2. Check the loader function path is correct
3. Ensure dealer is registered in `registry-map.ts`
4. Verify the page component is the default export
