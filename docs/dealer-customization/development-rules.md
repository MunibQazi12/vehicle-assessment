# Development Rules for AI Agents

This document provides guidelines for AI agents (v0.dev, Claude, GPT, etc.) generating dealer website components and pages. Follow these rules to ensure generated code integrates correctly with our system.

## Overview

We build multi-tenant dealership websites using Next.js 16, React 19, TypeScript, and Tailwind CSS 4. Each dealer has their own customized components, pages, and assets that are loaded dynamically based on their identity.

## Workspace Setup

Create a folder called `dealer-workspace/` in your Next.js environment. All generated files must be placed inside this folder. We will copy this entire folder into our system.

```text
dealer-workspace/
  components/
  hooks/
  pages/
  public/
  styles/
  registry.ts
```

**Important**: Use relative imports within this folder structure. All imports should be relative paths (e.g., `../components/Header`) so they work correctly when we copy the folder.

## Required Output Structure

Organize all files inside `dealer-workspace/`:

```text
dealer-workspace/
  components/
    Header.tsx              # Main navigation header (required)
    Footer.tsx              # Site footer (required)
    HeroSection.tsx         # Homepage hero section
    ui/                     # UI primitives (optional)
      button.tsx
      card.tsx
      dialog.tsx
      ...
  hooks/
    use-mobile.ts           # Mobile detection hook
    use-toast.ts            # Toast notifications
  pages/
    Home.tsx                # Homepage (required)
    ContactUs.tsx           # Contact page
    NotFound.tsx            # 404 page (required)
    ...
  public/
    assets/
      logo.png              # Main logo
      favicon.ico           # Favicon
      images/               # Additional images
  styles/
    globals.css             # CSS variables and theme (required)
  registry.ts               # Route registry (required)
```

## Import Rules

**Always use relative paths** for imports within the workspace:

```typescript
// ✅ Correct - relative imports
import Header from "../components/Header"
import Footer from "../components/Footer"
import { useIsMobile } from "../hooks/use-mobile"

// ❌ Avoid - absolute or aliased paths
import Header from "@/components/Header"
import Header from "~/components/Header"
```

## Technology Requirements

### Framework Versions

- **Next.js**: 16 (App Router)
- **React**: 19
- **TypeScript**: 5.x (strict mode)
- **Tailwind CSS**: 4 (PostCSS plugin)

### Key Dependencies Available

```json
{
  "clsx": "^2.x",
  "tailwind-merge": "^2.x",
  "next": "^16.x",
  "react": "^19.x",
  "lucide-react": "latest"
}
```

**Do not add external dependencies** - Only use the libraries listed above. If you need additional functionality, implement it with these available tools.

### Package Consistency Rules

**CRITICAL**: Do not introduce packages that duplicate existing functionality. Always use existing packages in the project before considering alternatives.

#### Why This Matters

- **Bundle Size**: Duplicate packages bloat the JavaScript bundle
- **Maintenance**: Multiple packages for the same purpose create technical debt
- **Consistency**: Unified APIs make code more maintainable and predictable

#### Existing Packages by Category

**UI Components (Radix UI)** - Use these for accessible, unstyled primitives:

| Package | Purpose |
|---------|---------|
| `@radix-ui/react-accordion` | Expandable content sections |
| `@radix-ui/react-alert-dialog` | Confirmation dialogs |
| `@radix-ui/react-avatar` | User avatars with fallback |
| `@radix-ui/react-checkbox` | Checkbox inputs |
| `@radix-ui/react-collapsible` | Collapsible content |
| `@radix-ui/react-dialog` | Modal dialogs |
| `@radix-ui/react-dropdown-menu` | Dropdown menus |
| `@radix-ui/react-hover-card` | Hover-triggered cards |
| `@radix-ui/react-label` | Form labels |
| `@radix-ui/react-menubar` | Menu bars |
| `@radix-ui/react-navigation-menu` | Navigation menus |
| `@radix-ui/react-popover` | Popovers |
| `@radix-ui/react-progress` | Progress indicators |
| `@radix-ui/react-radio-group` | Radio button groups |
| `@radix-ui/react-scroll-area` | Custom scrollbars |
| `@radix-ui/react-select` | Select dropdowns |
| `@radix-ui/react-separator` | Visual separators |
| `@radix-ui/react-slider` | Range sliders |
| `@radix-ui/react-slot` | Component composition |
| `@radix-ui/react-switch` | Toggle switches |
| `@radix-ui/react-tabs` | Tabbed interfaces |
| `@radix-ui/react-toast` | Toast notifications |
| `@radix-ui/react-toggle` | Toggle buttons |
| `@radix-ui/react-toggle-group` | Grouped toggles |
| `@radix-ui/react-tooltip` | Tooltips |
| `@radix-ui/react-aspect-ratio` | Aspect ratio containers |
| `@radix-ui/react-context-menu` | Right-click context menus |

**Forms** - Use these for form handling:

| Package | Purpose |
|---------|---------|
| `react-hook-form` | Form state management, validation |
| `@hookform/resolvers` | Validation schema resolvers (Zod, Yup, etc.) |

**Styling & Utilities**:

| Package | Purpose |
|---------|---------|
| `tailwind-merge` | Merge Tailwind classes without conflicts |
| `clsx` | Conditional class name construction |
| `class-variance-authority` | Component variant management |

**Icons**:

| Package | Purpose |
|---------|---------|
| `lucide-react` | Icon library (ONLY icon library allowed) |

**Carousels & Sliders**:

| Package | Purpose |
|---------|---------|
| `embla-carousel-react` | Carousel/slider functionality |

**Charts & Visualization**:

| Package | Purpose |
|---------|---------|
| `recharts` | Data visualization and charts |

**UI Patterns**:

| Package | Purpose |
|---------|---------|
| `cmdk` | Command palette / command menu |
| `sonner` | Toast notifications (alternative to Radix toast) |
| `vaul` | Drawer/sheet component |
| `react-resizable-panels` | Resizable panel layouts |
| `input-otp` | OTP/verification code inputs |
| `react-day-picker` | Date picker component |

**Theming**:

| Package | Purpose |
|---------|---------|
| `next-themes` | Dark/light mode theme switching |

#### ❌ Do NOT Use These Alternatives

| Instead of... | Use... |
|---------------|--------|
| Font Awesome, Heroicons, React Icons | `lucide-react` |
| Headless UI | Radix UI components |
| React Select, Downshift | `@radix-ui/react-select` |
| React Modal, React Aria Modal | `@radix-ui/react-dialog` |
| React Toastify, Notistack | `sonner` or `@radix-ui/react-toast` |
| Formik | `react-hook-form` |
| classnames | `clsx` |
| Swiper, React Slick | `embla-carousel-react` |
| Chart.js, Victory | `recharts` |
| date-fns date pickers, React Datepicker | `react-day-picker` |

```typescript
// ❌ WRONG - Adding duplicate functionality
import { FaPhone } from "react-icons/fa"  // Don't add new icon library
import Select from "react-select"          // Don't add when Radix exists

// ✅ CORRECT - Use existing packages
import { Phone } from "lucide-react"
import * as Select from "@radix-ui/react-select"
```

## Reserved Routes

The following routes are handled by our system and should **NOT** have custom pages:

- `/new-vehicles` and `/new-vehicles/*` - Vehicle inventory (SRP)
- `/used-vehicles` and `/used-vehicles/*` - Vehicle inventory (SRP)
- `/vehicle/*` - Vehicle detail pages (VDP)
- `/api/*` - API routes

You can link to these routes in navigation, but don't create pages for them.

## File Naming Conventions

- **Components**: PascalCase - `Header.tsx`, `HeroSection.tsx`, `ContactForm.tsx`
- **Hooks**: kebab-case with `use-` prefix - `use-mobile.ts`, `use-toast.ts`
- **Pages**: PascalCase - `Home.tsx`, `ContactUs.tsx`, `AboutUs.tsx`
- **Assets**: kebab-case - `hero-background.jpg`, `team-photo.jpg`

## Component Rules

### 1. Default Exports Only

All components must use `export default`:

```typescript
// ✅ Correct
export default function Header() {
  return <header>...</header>
}

// ❌ Avoid named exports for page/component files
export function Header() {
  return <header>...</header>
}
```

### 2. Server Components (Default)

Components are Server Components by default. Only add `"use client"` when necessary:

```typescript
// Server Component (default) - no directive needed
export default function ContentSection() {
  return <section>Static content</section>
}
```

### 2. Client Components

Add `"use client"` only for:

- State management (`useState`, `useReducer`)
- Effects (`useEffect`, `useLayoutEffect`)
- Event handlers (onClick, onChange, etc.)
- Browser APIs (window, localStorage)
- Custom hooks that use the above

```typescript
"use client"

import { useState } from "react"

export default function InteractiveComponent() {
  const [open, setOpen] = useState(false)
  return <button onClick={() => setOpen(!open)}>Toggle</button>
}
```

### 3. Image Handling

Always use Next.js `Image` component:

```typescript
import Image from "next/image"

<Image
  src="/assets/logo.png"       // Always use /assets/ prefix
  alt="Descriptive alt text"   // Required for accessibility
  width={200}
  height={60}
  priority                     // For above-fold images
/>
```

**Asset paths must start with `/assets/`** - this routes to the dealer's asset folder.

### 4. Navigation

Use Next.js `Link` for internal navigation:

```typescript
import Link from "next/link"

<Link href="/contact-us/">Contact Us</Link>
<Link href="/new-vehicles/">New Vehicles</Link>
<Link href="/used-vehicles/">Used Vehicles</Link>
```

**Internal link rules**: Always use relative paths (no domain) and include a trailing slash (e.g., `/about-us/`, `/inventory/suvs/`) to match the project's `trailingSlash: true` setting.

### 5. TypeScript Requirements

- All components must be TypeScript (`.tsx`)
- Define prop interfaces for all components
- No `any` types unless absolutely necessary
- Export types when needed by other files

```typescript
interface HeroProps {
  title: string
  subtitle?: string
  backgroundImage: string
}

export default function HeroSection({ title, subtitle, backgroundImage }: HeroProps) {
  // ...
}
```

### 6. Icon Library

Use `lucide-react` for icons:

```typescript
import { Menu, X, ChevronDown, Phone, Mail } from "lucide-react"

<button aria-label="Open menu">
  <Menu className="w-6 h-6" />
</button>
```

**Do not use** other icon libraries (Font Awesome, Heroicons, etc.).

### 7. No Data Fetching

Pages should **not** fetch data from external APIs. We handle all data fetching:

```typescript
// ✅ Correct - static content
export default function AboutPage() {
  return (
    <main>
      <h1>About Us</h1>
      <p>Static content here...</p>
    </main>
  )
}

// ❌ Avoid - no API calls or data fetching
export default async function AboutPage() {
  const data = await fetch('https://api.example.com/about')
  // ...
}
```

## Styling Rules

### 1. Tailwind CSS Only

Use Tailwind utility classes exclusively. No inline styles or CSS modules:

```typescript
// ✅ Correct
<div className="flex items-center justify-between p-4 bg-primary text-primary-foreground">

// ❌ Avoid
<div style={{ display: 'flex', padding: '1rem' }}>
```

### 2. CSS Variables for Theming

Use CSS variables for colors that should be themeable:

```typescript
// ✅ Use semantic color variables
<div className="bg-background text-foreground">
<button className="bg-primary text-primary-foreground">

// ❌ Avoid hardcoded colors
<div className="bg-white text-black">
<button className="bg-blue-500 text-white">
```

### 3. Required CSS Variables

Define these in `styles/globals.css`:

```css
:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --primary: oklch(0.4 0.15 250);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.97 0 0);
  --secondary-foreground: oklch(0.205 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --accent: oklch(0.97 0 0);
  --accent-foreground: oklch(0.205 0 0);
  --destructive: oklch(0.577 0.245 27.325);
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.708 0 0);
  --radius: 0.5rem;
}

.dark {
  /* Dark mode overrides */
}
```

### 4. Responsive Design

Mobile-first approach with Tailwind breakpoints:

```typescript
<div className="
  px-4              // Mobile
  md:px-6           // Tablet (768px+)
  lg:px-8           // Desktop (1024px+)
  
  flex flex-col     // Mobile: stack
  md:flex-row       // Tablet+: horizontal
">
```

## Page Structure

### Automatic Header and Footer

**IMPORTANT**: The system automatically wraps all page components with `Header` and `Footer`. Do **NOT** include Header or Footer in your page components - they will be added by our layout system.

```typescript
// ❌ WRONG - Do not include Header/Footer
import Header from "../components/Header"
import Footer from "../components/Footer"

export default function ExamplePage() {
  return (
    <>
      <Header />
      <main>Content</main>
      <Footer />
    </>
  )
}

// ✅ CORRECT - Only include page content
export default function ExamplePage() {
  return (
    <main className="min-h-screen">
      {/* Page content only */}
    </main>
  )
}
```

### Sticky Header Spacing

The `Header` component is **fixed/sticky** (`fixed top-0`) and must include a built-in spacer div that automatically pushes content down to account for the header height.

**Header Component Requirement**: When creating a custom `Header` component, you MUST include a spacer div after the `<header>` element:

```typescript
// components/Header.tsx
export default function Header() {
  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="h-16 lg:h-18">
          {/* Header content: logo, navigation, etc. */}
        </div>
      </header>
      {/* REQUIRED: Spacer div to push content below fixed header */}
      <div className="h-16 lg:h-18" aria-hidden="true" />
    </>
  )
}
```

**Key points:**

- The spacer div height (`h-16 lg:h-18`) must match the header height
- Use `aria-hidden="true"` on the spacer for accessibility
- Wrap both `<header>` and spacer in a React fragment (`<>...</>`)

**Do NOT add manual padding** like `pt-16` or `pt-18` to your page components - the Header component handles this automatically.

```typescript
// ❌ WRONG - Do not add padding for header
export default function ExamplePage() {
  return (
    <main className="pt-16 lg:pt-18">  {/* Redundant! */}
      <section>Content</section>
    </main>
  )
}

// ✅ CORRECT - Header spacer handles the offset
export default function ExamplePage() {
  return (
    <main>
      <section>Content</section>
    </main>
  )
}
```

**Why this matters:**

- The Header includes a spacer div (`<div className="h-16 lg:h-18" />`) after the fixed header
- This spacer pushes all page content down automatically
- Adding `pt-16` in pages would create double spacing
- All pages (including SRP, VDP, and custom dealer pages) benefit from this automatically

### Standard Page Template

Every page should follow this structure (without Header/Footer):

```typescript
// pages/ExamplePage.tsx
export default function ExamplePage() {
  return (
    <main className="pt-16 min-h-screen">  {/* pt-16 for fixed header */}
      {/* Page content */}
    </main>
  )
}
```

### Homepage Structure

```typescript
// pages/Home.tsx
import HeroSection from "../components/HeroSection"
// ... other section imports

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <HeroSection />
      {/* Additional sections */}
    </main>
  )
}
```

## Registry File

The `registry.ts` file maps URL paths to page components using **lazy loading** for optimal code splitting. Each page is only loaded when its route is accessed.

```typescript
// registry.ts
import { LazyDealerRegistry, LazyDealerRegistryModule } from '@dealertower/types/dealer-registry';

/**
 * Route registry using lazy loading
 * Components are dynamically imported only when their route is accessed
 */
export const routes: LazyDealerRegistry = {
  // Home page
  '': {
    loader: () => import('./pages/Home'),
  },
  
  // Contact page with metadata
  'contact-us': {
    loader: () => import('./pages/ContactUs'),
    metadata: {
      title: 'Contact Us | Dealer Name',
      description: 'Get in touch with our team.',
    },
  },
  
  // Additional pages...
  'about-us': {
    loader: () => import('./pages/AboutUs'),
    metadata: {
      title: 'About Us | Dealer Name',
      description: 'Learn about our dealership.',
    },
  },
};

/**
 * Not found component loader
 */
export const notFoundLoader = () => import('./pages/NotFound');

/**
 * Export as module for the registry map
 */
const registryModule: LazyDealerRegistryModule = {
  routes,
  notFoundLoader,
};

export default registryModule;
```

### Why Lazy Loading?

- **Smaller bundles**: Only the requested page is loaded, not all pages
- **Faster initial load**: Homepage doesn't load code for Contact, About, etc.
- **Better scalability**: Adding more pages doesn't increase initial bundle size

### Route Key Rules

- Empty string `''` = homepage (`/`)
- No leading/trailing slashes: `contact-us` not `/contact-us/`
- Nested paths: `about/team` for `/about/team`
- Each route uses `loader: () => import('./pages/PageName')` for lazy loading
- The `metadata` object is optional but recommended for SEO

## Accessibility Requirements

1. **Images**: Always provide meaningful `alt` text
2. **Buttons**: Use `aria-label` for icon-only buttons
3. **Headings**: One `<h1>` per page, proper hierarchy
4. **Links**: Descriptive link text (not "click here")
5. **Forms**: Associate labels with inputs

```typescript
// ✅ Correct
<button aria-label="Close menu">
  <XIcon />
</button>

<img alt="2024 Toyota Camry in silver" />

// ❌ Avoid
<button><XIcon /></button>
<img alt="car" />
```

## SEO Requirements

### Page Metadata

Every page in the registry should include metadata:

```typescript
export const routes = {
  'contact-us': {
    component: ContactUs,
    metadata: {
      title: 'Contact Us | Dealer Name',
      description: 'Get in touch with our sales team. Visit our showroom or call us today.',
    },
  },
  'about-us': {
    component: AboutUs,
    metadata: {
      title: 'About Us | Dealer Name',
      description: 'Learn about our dealership history, values, and commitment to customer service.',
    },
  },
};
```

### Metadata Best Practices

- **Title**: 50-60 characters, include dealer name
- **Description**: 150-160 characters, compelling and descriptive
- **One H1 per page**: The main heading should be unique and descriptive
- **Heading hierarchy**: Use H1 → H2 → H3 in order, don't skip levels

```typescript
// ✅ Correct heading structure
<main>
  <h1>Contact Us</h1>
  <section>
    <h2>Visit Our Showroom</h2>
    <h3>Hours of Operation</h3>
  </section>
  <section>
    <h2>Send Us a Message</h2>
  </section>
</main>

// ❌ Avoid skipping heading levels
<main>
  <h1>Contact Us</h1>
  <h4>Address</h4>  {/* Skipped h2, h3 */}
</main>
```

### Semantic HTML

Use semantic elements for better SEO and accessibility:

```typescript
<header>     // Site header
<nav>        // Navigation menus
<main>       // Main content (one per page)
<section>    // Thematic grouping
<article>    // Self-contained content
<aside>      // Sidebar content
<footer>     // Site footer
```

## Performance Requirements

Target: **Google PageSpeed 90+**, Core Web Vitals passing

### Image Optimization

1. **Always specify dimensions** - Prevents layout shift (CLS)
2. **Use `priority` for above-fold images** - Improves LCP
3. **Use WebP/AVIF formats** when possible
4. **Lazy load below-fold images** (default behavior)

```typescript
// Hero image - above fold
<Image
  src="/assets/images/hero.jpg"
  alt="Dealership showroom"
  width={1920}
  height={1080}
  priority                    // Load immediately
  className="object-cover"
/>

// Below-fold image - lazy loaded automatically
<Image
  src="/assets/images/team.jpg"
  alt="Our team"
  width={800}
  height={600}
/>
```

### Minimize Client-Side JavaScript

- Prefer Server Components (no `"use client"`)
- Only add interactivity where necessary
- Avoid large client-side libraries

```typescript
// ✅ Server Component - no JS sent to browser
export default function StaticSection() {
  return <section>Content renders on server</section>
}

// ⚠️ Client Component - adds JS bundle
"use client"
export default function InteractiveSection() {
  const [state, setState] = useState()
  // Only use when interactivity is required
}
```

### Avoid Layout Shift (CLS)

- Always set `width` and `height` on images
- Reserve space for dynamic content
- Use fixed header height

```typescript
// ✅ Fixed dimensions prevent layout shift
<Image src="/assets/logo.png" width={160} height={50} alt="Logo" />

// ✅ Reserve space for content
<div className="min-h-[400px]">
  {/* Content that may load dynamically */}
</div>

// ✅ Consistent header height
<header className="h-16 lg:h-20">
```

### Font Loading

You can use Google Fonts via `next/font/google`:

```typescript
import { Montserrat, Open_Sans } from 'next/font/google'

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
})

const openSans = Open_Sans({
  subsets: ['latin'],
  variable: '--font-open-sans',
})

// Apply in your component
<div className={`${montserrat.variable} ${openSans.variable}`}>
  <h1 className="font-montserrat">Heading</h1>
  <p className="font-open-sans">Body text</p>
</div>
```

Define font variables in `styles/globals.css`:

```css
@theme inline {
  --font-montserrat: var(--font-montserrat), ui-sans-serif, system-ui, sans-serif;
  --font-open-sans: var(--font-open-sans), ui-sans-serif, system-ui, sans-serif;
  --font-sans: var(--font-open-sans);
}
```

## What NOT to Include

1. **No `package.json`** - We handle dependencies
2. **No configuration files** - `tsconfig.json`, `next.config.ts`, etc.
3. **No test files** - We add tests separately
4. **No `.env` files** - Environment is managed by us
5. **No `node_modules`** - Obviously
6. **No build output** - `.next/`, `out/`, etc.

## Checklist Before Submission

### Structure

- [ ] All files inside `dealer-workspace/` folder
- [ ] All imports use relative paths
- [ ] File names follow conventions (PascalCase components, kebab-case hooks)

### Required Files

- [ ] `components/Header.tsx` - Navigation header
- [ ] `components/Footer.tsx` - Site footer
- [ ] `pages/Home.tsx` - Homepage
- [ ] `pages/NotFound.tsx` - 404 page
- [ ] `styles/globals.css` - CSS variables
- [ ] `registry.ts` - Lazy route mappings with metadata (uses `loader: () => import()` pattern)

### Code Quality

- [ ] All files use TypeScript (`.tsx`, `.ts`)
- [ ] All components use `export default`
- [ ] `"use client"` only where necessary
- [ ] No data fetching in pages
- [ ] Only `lucide-react` for icons

### Images & Assets

- [ ] All images use Next.js `Image` component
- [ ] Asset paths start with `/assets/`
- [ ] All images have `width` and `height` specified
- [ ] Above-fold images have `priority` prop
- [ ] All images have descriptive `alt` text

### Styling

- [ ] CSS uses Tailwind utilities only
- [ ] Colors use CSS variables, not hardcoded values
- [ ] Mobile-first responsive design
- [ ] No inline styles

### SEO & Performance

- [ ] Every route has `metadata` (title, description)
- [ ] One `<h1>` per page
- [ ] Proper heading hierarchy (H1 → H2 → H3)
- [ ] Semantic HTML elements used
- [ ] Minimal client-side JavaScript

### Accessibility

- [ ] All images have meaningful `alt` text
- [ ] Icon buttons have `aria-label`
- [ ] Proper heading structure
- [ ] Descriptive link text

## Example Complete Submission

```text
dealer-workspace/
  components/
    Header.tsx
    Footer.tsx
    HeroSection.tsx
    BrandsSection.tsx
    ReviewsSection.tsx
    ui/
      button.tsx
      card.tsx
  hooks/
    use-mobile.ts
  pages/
    Home.tsx
    ContactUs.tsx
    AboutUs.tsx
    NotFound.tsx
  public/
    assets/
      logo.png
      favicon.ico
      images/
        hero.jpg
        team.jpg
  styles/
    globals.css
  registry.ts
```
