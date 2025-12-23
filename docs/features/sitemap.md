# Sitemap Feature

## Overview

The application provides two sitemap endpoints to help users and search engines navigate the website:

1. **XML Sitemap** (`/sitemap.xml`) - Machine-readable format for search engines
2. **HTML Sitemap** (`/sitemap/`) - Human-friendly page with header and footer

Both sitemaps dynamically generate content based on:

- Static core pages (homepage, new vehicles, used vehicles)
- Dealer-specific custom pages from registry
- Vehicle Detail Pages (VDP) from inventory

## Routes

### XML Sitemap - `/sitemap.xml`

**Location**: `app/sitemap.xml/route.ts`

**Purpose**: Provides a standard XML sitemap for search engine crawlers (Google, Bing, etc.)

**Features**:

- Generates valid XML sitemap following sitemaps.org protocol
- Includes URL, last modified date, change frequency, and priority
- Cached for 1 hour (`Cache-Control: public, max-age=3600`)
- Dynamic content from tenant context and inventory API

**Example Output**:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.example.com/</loc>
    <lastmod>2025-12-10T20:00:00.000Z</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <!-- ... more URLs ... -->
</urlset>
```

### HTML Sitemap - `/sitemap/`

**Location**: `app/sitemap/page.tsx`

**Purpose**: User-friendly sitemap page with site-wide navigation, integrated with header and footer

**Features**:

- Organized by categories (Main Pages, Dealer Pages, Vehicles)
- Links to all pages with human-readable labels
- Responsive grid layout (1-3 columns based on screen size)
- Shows page counts per category
- Limits vehicle display to 50 items with link to full inventory
- Link to XML sitemap for developers/SEO tools
- Full Next.js layout integration (header, footer, theme, scripts)

**Categories**:

1. **Main Pages** (Priority 0.9-1.0)
   - Homepage
   - New Vehicles
   - Used Vehicles

2. **Dealer Pages** (Priority 0.7)
   - Custom pages from dealer registry
   - Examples: About Us, Service, Contact, etc.

3. **Vehicles** (Priority 0.8)
   - Individual vehicle detail pages (VDPs)
   - Limited to first 50 for performance
   - Link to full inventory for complete list

## Implementation Details

### Multi-Tenancy Support

Both sitemaps are tenant-aware:
- Use `getTenantHostname()` to get current dealer hostname
- Use `getDealerId()` to load dealer-specific registry
- Build URLs with proper protocol (http/https) based on environment

### Data Sources

1. **Static Pages**: Hardcoded core routes
2. **Custom Pages**: Loaded from `getLazyDealerRegistry(dealerId)`
3. **Vehicle Pages**: Fetched from `fetchVDPSlugs(hostname)` API

### Caching

**XML Sitemap**:
- HTTP Cache-Control: 1 hour
- Next.js cache: 6 hours (from API fetch configuration)

**HTML Sitemap**:
- Dynamic rendering (`force-dynamic`)
- Server-side data fetching with API-level caching

### Error Handling

Both sitemaps gracefully handle failures:
- Missing dealer registry: Skip custom pages
- API errors: Continue without vehicle pages
- Console logging for debugging

## Usage

### For Users

Visit `/sitemap/` in your browser to:
- Discover all available pages on the website
- Navigate to specific sections quickly
- View total page count
- Access XML sitemap link at the bottom

### For Search Engines

Submit `/sitemap.xml` to:
- Google Search Console
- Bing Webmaster Tools
- Other search engine indexing services

### For Developers

**Testing locally**:
```bash
# Start dev server
npm run dev

# Visit HTML sitemap
http://localhost:3000/sitemap/

# Visit XML sitemap
http://localhost:3000/sitemap.xml
```

**Adding new static pages**:

Edit both files to include new routes:

1. `app/sitemap.xml/route.ts`:
```typescript
sitemapEntries.push({
  url: `${baseUrl}/new-page/`,
  lastModified: now,
  changeFrequency: "weekly",
  priority: 0.7,
});
```

2. `app/sitemap/page.tsx`:
```typescript
sitemapEntries.push({
  url: "/new-page/",
  label: "New Page",
  category: "Main Pages",
  priority: 0.7,
});
```

## SEO Considerations

### Priority Values

- **1.0**: Homepage only
- **0.9**: Primary inventory pages (New/Used Vehicles)
- **0.8**: Individual vehicle pages
- **0.7**: Dealer-specific pages

### Change Frequency

- **hourly**: Inventory pages (new/used vehicles)
- **daily**: Homepage, vehicle detail pages
- **weekly**: Dealer custom pages

### Best Practices

1. Submit XML sitemap to search engines via webmaster tools
2. Include sitemap URL in `robots.txt`:
   ```
   Sitemap: https://www.example.com/sitemap.xml
   ```
3. Monitor crawl stats in search console
4. Update priority/frequency as content changes

## Troubleshooting

### Sitemap not updating

1. Check cache headers - wait for TTL to expire
2. Manually trigger revalidation via webhook
3. Verify API endpoints are accessible
4. Check console logs for errors

### Missing pages

1. **Custom pages not showing**: Verify dealer registry configuration
2. **Vehicles not showing**: Check `fetchVDPSlugs` API response
3. **Wrong hostname**: Check `NEXTJS_APP_HOSTNAME` environment variable

### XML validation errors

Test your sitemap at:
- https://www.xml-sitemaps.com/validate-xml-sitemap.html
- Google Search Console > Sitemaps

## Related Documentation

- [Multi-Tenancy](../core-concepts/multi-tenancy.md)
- [Caching Strategy](../core-concepts/caching.md)
- [Dealer Customization](../dealer-customization/overview.md)
- [API Reference](../api-reference/overview.md)

