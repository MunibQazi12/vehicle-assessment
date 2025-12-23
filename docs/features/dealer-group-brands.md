# DealerGroup Brands Block

A dynamic CMS block for displaying automotive dealer group brands with flexible configuration options.

## Features

- **Main Brands Section**: Display current dealer's brand lineup
- **Premium Brands Section**: Show brands from partner dealerships
- **Promotional Banner**: Configurable ribbon banner between sections
- **Fully Dynamic**: All content, styling, and behavior configurable via CMS
- **Responsive Design**: Mobile-first with configurable grid columns
- **Smart Filtering**: Automatically removes duplicate brands between sections

## Configuration Options

### Section Title
- **Field**: `sectionTitle`
- **Type**: Text
- **Default**: "Search {Tonkin} Brands"
- **Usage**: Use `{brandName}` syntax to apply highlight color to specific text

### Colors
- **Highlight Color**: Hex color for highlighted text in title
- **Background Color**: Section background color
- **Banner Gradient**: Start and end colors for banner gradient

### Main Brands
- **Enable/Disable**: Toggle main brands display
- **Grid Columns**: Configure mobile/tablet/desktop column counts
- **Data Source**: Fetched from current dealer's lineup API

### Banner
- **Enable/Disable**: Toggle promotional banner
- **Banner Content**: Rich text editor with full formatting support including links, bold, italic, etc.
- **Gradient Colors**: Customize banner appearance with start and end colors

### Premium Brands
- **Enable/Disable**: Toggle premium brands section
- **Premium Brands Hostname**: Text input box to specify which dealer hostname to fetch brands from (e.g., www.geeautomotive.com)
- **Grid Columns**: Configure mobile/tablet/desktop column counts
- **Smart Filtering**: Automatically excludes brands already shown in main section

### Spacing & Effects
- **Padding Top/Bottom**: Choose from small (48px), medium (64px), or large (96px)
- **Hover Scale**: Enable/disable scale-up effect on hover

## Usage in CMS

1. Navigate to Pages → Edit Page
2. In the "Content" tab, click "+ Add Block"
3. Select "DealerGroup Brands"
4. Configure options as needed
5. Save and publish

## Technical Details

### Data Fetching
- Uses parallel `Promise.allSettled()` for optimal performance
- Main brands: Fetched from current tenant's lineup API
- Premium brands: Fetched from specified hostname's lineup API
- Automatic error handling with fallback to empty arrays

### Caching
- Inherits dealer-specific caching from `fetchLineup()` API
- Cache keys include dealer identifier for proper multi-tenancy
- Follows project's 6-hour TTL and tag-based invalidation

### Brand Card Rendering
- Displays brand logo image when available (lazy-loaded, optimized via Next.js Image)
- Falls back to text-only display for brands without images
- Optional hover scale animation
- Smart links (internal/external detection)

### Grid System
- Uses Tailwind CSS responsive grid classes
- Dynamically generates classes based on configuration
- Responsive breakpoints: mobile (default), md (tablet), lg (desktop)

## Example Configurations

### Default (Tonkin Auto Group)
```
Section Title: "Search {Tonkin} Brands"
Highlight Color: #72c6f5
Main Brands: Enabled (current dealer)
Banner: Enabled
Banner Content: "Can't find what you're looking for? [Gee Automotive](https://www.geeautomotive.com/) features even more brands."
Premium Brands Hostname: www.geeautomotive.com
```

### Custom Dealer Group
```
Section Title: "Explore {Our} Brands"
Highlight Color: #ff0000
Main Brands: Enabled
Banner Content: "Looking for **luxury vehicles**? Visit [Premium Dealers](https://www.premiumdealers.com/)."
Premium Brands Hostname: www.premiumdealers.com
```

### Single Section Only
```
Main Brands: Enabled
Banner: Disabled
Premium Brands: Disabled
```

## Files

- `config.ts` - Payload CMS block configuration with field definitions
- `Component.tsx` - React Server Component with rendering logic
- `index.ts` - Public exports

## Dependencies

- `@dealertower/lib/api/lineup` - Lineup data fetching
- `@dealertower/lib/tenant/server-context` - Tenant information
- `@dealertower/lib/utils/url` - URL utilities
- `@dealertower/components/ui` - SmartLink component
- Next.js Image - Image optimization

## Migration from Static Component

This block was converted from `dealers/73d6c4fc-8ffb-471e-88c4-5e8eeddc1c63/components/BrandsSection.tsx`. 

The original hardcoded values are now configurable:
- "Tonkin" brand name → `sectionTitle` field with `{highlight}` syntax
- Gee Automotive hostname → `premiumBrandsHostname` field
- Colors and spacing → Individual fields
- Grid layouts → Responsive column configuration
