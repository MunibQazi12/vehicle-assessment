# Documentation Index

Welcome to the Dealer Tower Multi-Tenant Platform documentation.

## Quick Start

New to the project? Start here:

1. **[Installation](./getting-started/installation.md)** - Set up your development environment
2. **[Configuration](./getting-started/configuration.md)** - Configure environment variables
3. **[Local Development](./getting-started/local-development.md)** - Development workflow and best practices

## Core Concepts

Understand the foundational architecture:

- **[Architecture Overview](./core-concepts/architecture.md)** - System design and data flow
- **[Multi-Tenancy](./core-concepts/multi-tenancy.md)** - Hostname-based tenant resolution (see MULTI_TENANCY.md)
- **[Security](./core-concepts/security.md)** - Tenant isolation and attack prevention 🔒
- **[Caching Strategy](./core-concepts/caching.md)** - Intelligent caching (see CACHING.md)
- **[URL Routing](./core-concepts/url-routing.md)** - SEO-friendly URL structure (see URL_STRUCTURE.md)
- **[Turbopack Configuration](./core-concepts/turbopack.md)** - Build optimization and polyfill management

## Features

### Search Results Page (SRP)
- **[SRP Overview](./features/srp/overview.md)** - Search functionality and components
- **[Filtering System](./features/srp/filtering.md)** - Advanced filtering (see CLIENT_SIDE_FILTERING.md, NESTED_FILTERING.md)
- **[Condition Rules](./features/srp/condition-rules.md)** - Complex logic (see CONDITION_FILTER_RULES.md)

### Vehicle Detail Page (VDP)
- **[VDP Overview](./features/vdp/overview.md)** - Vehicle detail pages (see VDP.md)

### Forms System
- **[Forms Overview](./features/forms/overview.md)** - Form components (see FORMS.md, CTA_FORMS_INTEGRATION.md)
- **[Form Security](./features/forms/security.md)** - CSRF protection (see SECURITY_IMPLEMENTATION.md)
- **[Form Examples](./features/forms/examples.md)** - Common implementations (see FORMS_EXAMPLES.tsx)

### Website Scripts

- **[Scripts Overview](./features/scripts/overview.md)** - Third-party scripts (see WEBSITE_SCRIPTS.md)

### Sitemap

- **[Sitemap](./features/sitemap.md)** - XML and HTML sitemaps for SEO and navigation

## Dealer Customization

Per-dealer content and branding:

- **[Customization Overview](./dealer-customization/overview.md)** - Dealer-specific features (see DEALERS_ROOT_STRUCTURE.md)
- **[Assets Management](./dealer-customization/assets.md)** - Logos, favicons (see DEALER_ASSETS.md)
- **[Custom Components](./dealer-customization/custom-components.md)** - Per-dealer components (see DEALER_CUSTOM_COMPONENTS.md)
- **[Custom Pages](./dealer-customization/custom-pages.md)** - Unique pages (see DEALER_SPECIFIC_PAGES.md)
- **[Dealer ID Mapping](./dealer-customization/dealer-mapping.md)** - Hostname to UUID (see DEALER_ID_MAPPING.md)

## API Reference

Integration with Dealer Tower backend:

- **[API Patterns & Standards](./api-reference/api-patterns.md)** - **🔥 REQUIRED READING** - Unified API request patterns (see this FIRST when creating new APIs)
- **[API Overview](./api-reference/overview.md)** - API architecture (see API.md)
- **[Endpoints](./api-reference/endpoints.md)** - SRP and vehicle endpoints (see API.md)
- **[Website Information API](./api-reference/website-information.md)** - Dealer metadata (see WEBSITE_INFORMATION_API.md)

## Deployment

Production deployment and operations:

- **[Vercel Deployment](./deployment/vercel.md)** - Deploy to Vercel (see VERCEL_BUILD_OPTIMIZATION.md)
- **[Environment Variables](./deployment/environment-variables.md)** - Production config
- **[Performance Optimization](./deployment/performance.md)** - PageSpeed and Core Web Vitals

## Payload CMS

Content management system integration:

- **[Payload CMS Overview](./payload-cms/README.md)** - Documentation structure and topic index
- **[Getting Started](./payload-cms/getting-started/)** - Introduction to Payload CMS
- **[Configuration](./payload-cms/configuration/)** - Core configuration settings
- **[Fields](./payload-cms/fields/)** - Field types and definitions
- **[Hooks](./payload-cms/hooks/)** - Collection and Global hooks
- **[Access Control](./payload-cms/access-control/)** - Permissions and roles
- **[Custom Components](./payload-cms/custom-components/)** - Admin UI customization
- **[Live Preview](./payload-cms/live-preview/)** - Real-time preview with Next.js
- **[REST API](./payload-cms/rest-api/)** - Auto-generated REST endpoints
- **[GraphQL](./payload-cms/graphql/)** - Auto-generated GraphQL API

---

**Note**: This is a reorganized structure. Original documentation files are referenced in parentheses and will remain available during transition. New documentation is being created in categorized subdirectories.

## Current Structure

```plaintext
dealers/
  {dealer-uuid}/
    components/        # Custom React components
    pages/            # Custom full-page components
    public/           # Assets (logo.png, favicon.ico, etc.)
    README.md
```

All dealer-specific files consolidated in one location for better organization.
