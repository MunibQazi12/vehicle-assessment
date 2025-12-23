# Dealer Components

Dealer-specific React components allow complete customization of the UI for each dealership. Components are organized in the `components/` subdirectory of each dealer folder.

## Directory Structure

```text
dealers/{dealer-uuid}/components/
  Header.tsx              # Main navigation header
  Footer.tsx              # Site footer
  HeroSection.tsx         # Homepage hero
  theme-provider.tsx      # Theme context provider
  ui/                     # UI primitives
    button.tsx
    card.tsx
    dialog.tsx
    ...
  ...                     # Other custom components
```

## Component Types

### Layout Components

Layout components like `Header.tsx` and `Footer.tsx` provide site-wide navigation and branding:

```typescript
// dealers/{dealer-uuid}/components/Header.tsx
"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/">
            <Image
              src="/assets/images/logo.png"
              alt="Dealer Logo"
              width={160}
              height={50}
            />
          </Link>
          
          {/* Navigation */}
          <nav className="hidden lg:flex items-center gap-4">
            <Link href="/new-vehicles">New Vehicles</Link>
            <Link href="/used-vehicles">Used Vehicles</Link>
            <Link href="/contact-us">Contact</Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
```

### Section Components

Section components are reusable parts of pages:

```typescript
// dealers/{dealer-uuid}/components/HeroSection.tsx
import Image from "next/image"
import Link from "next/link"

export default function HeroSection() {
  return (
    <section className="relative h-[600px] flex items-center">
      <Image
        src="/assets/images/hero-background.jpg"
        alt="Hero"
        fill
        className="object-cover"
        priority
      />
      <div className="relative z-10 max-w-7xl mx-auto px-4">
        <h1 className="text-5xl font-bold text-white">
          Welcome to Our Dealership
        </h1>
        <Link href="/new-vehicles" className="btn-primary mt-6">
          Browse Inventory
        </Link>
      </div>
    </section>
  )
}
```

### UI Components

The `ui/` subdirectory contains primitive UI components for consistent design:

```typescript
// dealers/{dealer-uuid}/components/ui/button.tsx
import { ButtonHTMLAttributes, forwardRef } from "react"
import { cn } from "@dealers/{dealer-uuid}/lib/utils"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline"
  size?: "sm" | "md" | "lg"
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-md font-medium",
          {
            "bg-primary text-white": variant === "primary",
            "bg-secondary text-primary": variant === "secondary",
            "border-2 border-primary": variant === "outline",
            "px-3 py-1 text-sm": size === "sm",
            "px-4 py-2": size === "md",
            "px-6 py-3 text-lg": size === "lg",
          },
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"
```

## Server vs Client Components

### Server Components (Default)

Use server components for static content without interactivity:

```typescript
// No "use client" directive - renders on server
export default function ContentSection() {
  return (
    <section className="py-16">
      <h2>Our Services</h2>
      <p>Static content rendered on the server.</p>
    </section>
  )
}
```

### Client Components

Use `"use client"` directive for interactive components:

```typescript
"use client"

import { useState } from "react"

export default function AccordionSection() {
  const [openItem, setOpenItem] = useState<string | null>(null)

  return (
    <div>
      {/* Interactive accordion */}
    </div>
  )
}
```

## Component Loading

### Dynamic Loading

The loader utilities support dynamic component imports:

```typescript
// packages/lib/dealers/loader.ts

export async function loadDealerHeader<T>(
  hostname: string
): Promise<ComponentType<T> | null> {
  const dealerId = getDealerIdFromEnv(hostname);
  
  try {
    const module = await import(`@dealers/${dealerId}/components/Header`);
    return module.default || module.Header;
  } catch {
    return null; // Fallback to shared header
  }
}
```

### Static Registry (Recommended)

For Turbopack compatibility, prefer static imports in the registry:

```typescript
// dealers/{dealer-uuid}/registry.ts
import Header from './components/Header';
import Footer from './components/Footer';

// Components are pre-imported, not dynamically loaded
```

## Using Dealer Assets in Components

Reference dealer-specific assets with the `/assets/` prefix:

```typescript
import Image from "next/image"

export default function Logo() {
  return (
    <Image
      src="/assets/logo.png"           // Resolves to dealer's public/assets/logo.png
      alt="Logo"
      width={200}
      height={60}
    />
  )
}
```

Or use the `getDealerAssetUrl` helper:

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
```

## Component Best Practices

### 1. Keep Components Focused

Each component should have a single responsibility:

```typescript
// Good: Single purpose
export default function BrandsSection() { /* Brand logos */ }
export default function ReviewsSection() { /* Customer reviews */ }

// Avoid: Multiple purposes in one component
export default function BrandsAndReviewsSection() { /* Too much */ }
```

### 2. Use TypeScript Props

Define clear prop interfaces:

```typescript
interface HeroProps {
  title: string
  subtitle?: string
  backgroundImage: string
  ctaText: string
  ctaLink: string
}

export default function HeroSection({
  title,
  subtitle,
  backgroundImage,
  ctaText,
  ctaLink,
}: HeroProps) {
  // ...
}
```

### 3. Leverage Tailwind CSS

Use Tailwind utilities for styling, with dealer CSS variables for theming:

```typescript
export default function Card({ children }) {
  return (
    <div className="bg-card text-card-foreground rounded-lg p-6 shadow-md">
      {children}
    </div>
  )
}
```

### 4. Mobile-First Responsive Design

Build for mobile first, then add breakpoints:

```typescript
<div className="
  px-4                    {/* Mobile: small padding */}
  md:px-6                 {/* Tablet: medium padding */}
  lg:px-8                 {/* Desktop: larger padding */}
  
  flex flex-col           {/* Mobile: vertical stack */}
  md:flex-row             {/* Tablet+: horizontal */}
">
```

## Example: Complete Page Using Components

```typescript
// dealers/{dealer-uuid}/pages/Home.tsx
import Header from "../components/Header"
import Footer from "../components/Footer"
import HeroSection from "../components/HeroSection"
import BrandsSection from "../components/BrandsSection"
import ReviewsSection from "../components/ReviewsSection"

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <HeroSection />
        <BrandsSection />
        <ReviewsSection />
      </main>
      <Footer />
    </div>
  )
}
```
