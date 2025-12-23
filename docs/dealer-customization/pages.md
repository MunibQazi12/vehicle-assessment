# Dealer Pages

Dealer pages are custom page components that render for specific routes. Each page is a React component stored in the `pages/` subdirectory.

## Directory Structure

```text
dealers/{dealer-uuid}/pages/
  Home.tsx                 # Homepage (route: '')
  ContactUs.tsx            # Contact page (route: 'contact-us')
  PrivacyPolicy.tsx        # Privacy policy (route: 'privacy-policy')
  Team.tsx                 # Team page (route: 'team')
  NotFound.tsx             # Custom 404 page
  ...
```

## Page Structure

Pages are standard React components that compose dealer-specific components:

```typescript
// dealers/{dealer-uuid}/pages/Home.tsx
import Header from "../components/Header"
import Footer from "../components/Footer"
import HeroSection from "../components/HeroSection"
import StatsBar from "../components/StatsBar"
import BrandsSection from "../components/BrandsSection"
import ServingSection from "../components/ServingSection"
import ReviewsSection from "../components/ReviewsSection"

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <HeroSection />
        <StatsBar />
        <BrandsSection />
        <ServingSection />
        <ReviewsSection />
      </main>
      <Footer />
    </div>
  )
}
```

## Registering Pages

Pages must be registered in the dealer's `registry.ts` using **lazy loaders** for optimal bundle size:

```typescript
// dealers/{dealer-uuid}/registry.ts
import type { LazyDealerRegistry } from '@dealertower/types';

// Use lazy loaders instead of static imports
const routes: LazyDealerRegistry = {
  // Root path for homepage
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
  '/team': {
    loader: () => import('./pages/Team'),
    metadata: {
      title: 'Our Team | Dealer Name',
      description: 'Meet our experienced team members.',
    },
  },
};

export default { routes };
```

> **Important**: Always use `loader: () => import()` pattern instead of static imports. This ensures each page is only loaded when accessed, not bundled with the main application.

## Page Types

### Basic Page

A simple page with header, content, and footer:

```typescript
// dealers/{dealer-uuid}/pages/PrivacyPolicy.tsx
import Header from "../components/Header"
import Footer from "../components/Footer"

export default function PrivacyPolicy() {
  return (
    <>
      <Header />
      <main className="pt-20 max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        <div className="prose">
          <p>Last updated: January 2024</p>
          {/* Privacy policy content */}
        </div>
      </main>
      <Footer />
    </>
  )
}
```

### Page with Hero

A page featuring a hero section:

```typescript
// dealers/{dealer-uuid}/pages/Specials.tsx
import Header from "../components/Header"
import Footer from "../components/Footer"
import PageHero from "../components/PageHero"
import SpecialsList from "../components/SpecialsList"

export default function Specials() {
  return (
    <>
      <Header />
      <main>
        <PageHero
          title="Current Specials"
          subtitle="Exclusive offers for our customers"
          backgroundImage="/assets/images/specials-hero.jpg"
        />
        <SpecialsList />
      </main>
      <Footer />
    </>
  )
}
```

### Page with Data

For pages requiring data, use async server components:

```typescript
// dealers/{dealer-uuid}/pages/Dealers.tsx
import Header from "../components/Header"
import Footer from "../components/Footer"
import DealerCard from "../components/DealerCard"

// Mock data - in production, fetch from API
const dealerLocations = [
  {
    id: 1,
    name: "Main Location",
    address: "123 Auto Drive",
    phone: "(555) 123-4567",
    image: "/assets/images/location-1.jpg",
  },
  // ... more locations
];

export default function Dealers() {
  return (
    <>
      <Header />
      <main className="pt-20">
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4">
            <h1 className="text-4xl font-bold text-center mb-12">
              Our Dealerships
            </h1>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {dealerLocations.map((dealer) => (
                <DealerCard key={dealer.id} {...dealer} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
```

### Interactive Page (Client Component)

For pages with client-side interactivity:

```typescript
// dealers/{dealer-uuid}/pages/ContactUs.tsx
"use client"

import { useState } from "react"
import Header from "../components/Header"
import Footer from "../components/Footer"
import DynamicForm from "../components/DynamicForm"

export default function ContactUs() {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (data: FormData) => {
    // Handle form submission
    setSubmitted(true)
  }

  return (
    <>
      <Header />
      <main className="pt-20 py-16">
        <div className="max-w-2xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Contact Us</h1>
          {submitted ? (
            <div className="p-6 bg-green-100 rounded-lg">
              Thank you! We&apos;ll be in touch soon.
            </div>
          ) : (
            <DynamicForm onSubmit={handleSubmit} />
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
```

## Nested Routes

For nested URL structures, use nested path keys in the registry:

```typescript
// Registry with nested routes
const routes: LazyDealerRegistry = {
  '/tonkin-gee': {
    loader: () => import('./pages/TonkinGee'),
  },
  '/tonkin-gee/careers': {
    loader: () => import('./pages/TonkinGeeCareers'),
    metadata: {
      title: 'Careers | Tonkin GEE',
    },
  },
  '/tonkin-gee/gee-grant': {
    loader: () => import('./pages/TonkinGeeGrant'),
    metadata: {
      title: 'GEE Grant | Tonkin GEE',
    },
  },
};
```

## Custom 404 Page

Each dealer can have a custom 404 page:

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
          <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
          <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
          <p className="text-gray-600 mb-8">
            The page you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-primary text-white rounded-lg"
          >
            Return Home
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}
```

Register the 404 loader in the registry:

```typescript
// dealers/{dealer-uuid}/registry.ts
import type { LazyDealerRegistry } from '@dealertower/types';

const routes: LazyDealerRegistry = {
  // ... routes
};

// Custom 404 page loader
const notFoundLoader = () => import('./pages/NotFound');

export default { routes, notFoundLoader };
```

## Metadata

Page metadata is defined in the registry and used by Next.js for SEO:

```typescript
const routes: LazyDealerRegistry = {
  '/contact-us': {
    loader: () => import('./pages/ContactUs'),
    metadata: {
      title: 'Contact Us | Tonkin Automotive Group',
      description: 'Reach out to our team for sales, service, or general inquiries.',
      openGraph: {
        title: 'Contact Us',
        description: 'Get in touch with Tonkin Automotive.',
        images: ['/assets/og-contact.jpg'],
      },
      keywords: ['contact', 'dealership', 'automotive'],
    },
  },
};
```

## Page Best Practices

### 1. Consistent Layout

Use the same Header/Footer pattern across all pages:

```typescript
export default function AnyPage() {
  return (
    <>
      <Header />
      <main>{/* Page content */}</main>
      <Footer />
    </>
  )
}
```

### 2. Semantic HTML

Use appropriate HTML elements:

```typescript
<main>              {/* Main content */}
  <section>         {/* Logical sections */}
    <article>       {/* Self-contained content */}
      <header>      {/* Section header */}
      <footer>      {/* Section footer */}
    </article>
  </section>
</main>
```

### 3. Accessibility

Ensure pages are accessible:

```typescript
<main>
  <h1>Page Title</h1>           {/* One h1 per page */}
  <nav aria-label="Breadcrumb"> {/* Labeled navigation */}
  <img alt="Descriptive text">  {/* Alt text for images */}
  <button aria-label="Close">   {/* Accessible buttons */}
</main>
```

### 4. Performance

Optimize page loading:

```typescript
import Image from "next/image"

// Use Next.js Image for optimization
<Image
  src="/assets/hero.jpg"
  alt="Hero"
  priority  // Load above-fold images immediately
  fill
/>

// Lazy load below-fold content
import dynamic from "next/dynamic"
const ReviewsSection = dynamic(() => import("../components/ReviewsSection"))
```
