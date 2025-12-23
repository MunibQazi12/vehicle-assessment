# ContentSection Block

The ContentSection block is a flexible content section component that combines text content with an optional image and call-to-action button. It's ideal for creating engaging content sections with a professional layout.

## Features

- **Flexible Layout**: Content can be positioned on either side of an optional image
- **Rich Text Support**: Description field supports full rich text formatting via Lexical editor
- **Optional Components**: All elements (subtitle, image, CTA) are optional
- **Multiple Background Styles**: Choose from white, navy, or light background gradients
- **CTA Positioning**: Place the call-to-action button below content or below image
- **Priority Image Loading**: Option to enable priority loading for above-the-fold images
- **Responsive Design**: Automatically adapts to mobile, tablet, and desktop screens

## Configuration Fields

### Content Fields

- **Title** (required): Main heading text (smaller, appears first)
- **Subtitle** (optional): Large heading text (appears below title)
- **Highlight Subtitle** (optional): Apply blue highlight color to subtitle
- **Description** (required): Main content text with rich text formatting support

### Image Fields

- **Image** (optional): Upload an image (recommended: 500x400px or similar aspect ratio)
- **Image Position** (optional): Choose left or right side placement (default: right)
- **Priority Image Loading** (optional): Enable for above-the-fold images to improve LCP

### Styling

- **Background Color**: Choose from:
  - **White**: Gradient from gray-50 to white
  - **Navy**: Solid navy background (#151B49) with light text
  - **Light**: Gradient from white to gray-50

### Call to Action

- **Enable CTA**: Toggle to enable the call-to-action button
- **CTA Text**: Button text (required when enabled)
- **CTA Link**: Internal page reference or custom URL (required when enabled)
- **CTA Position**: Choose to place button below content or below image

## Usage Examples

### Basic Content Section

```
Title: "Welcome to Our Dealership"
Description: "We've been serving the community for over 30 years..."
Background: White
```

### With Image and CTA

```
Title: "Explore Our Inventory"
Subtitle: "Find Your Perfect Vehicle"
Highlight: Yes
Description: "Browse our extensive selection of new and certified pre-owned vehicles..."
Image: [Upload vehicle showroom image]
Image Position: Right
CTA Enabled: Yes
CTA Text: "View Inventory"
CTA Link: /new-vehicles
CTA Position: Content
```

### Navy Background Hero

```
Title: "Premium Service Experience"
Subtitle: "Excellence in Every Detail"
Description: "Our certified technicians provide top-tier service..."
Background: Navy
Image: [Upload service center image]
Image Position: Left
Priority Loading: Yes (if above-the-fold)
```

## Technical Implementation

### Component Location

- **Shared Component**: `packages/components/shared/ContentSection.tsx`
- **CMS Block Config**: `cms/blocks/ContentSection/config.ts`
- **CMS Block Component**: `cms/blocks/ContentSection/Component.tsx`

### Server Component

The ContentSection is implemented as a React Server Component with no client-side interactivity, providing optimal performance.

### Image Optimization

Images are automatically optimized using Next.js Image component with:
- Responsive sizing based on viewport
- Automatic format selection (WebP when supported)
- Lazy loading by default (unless priority is enabled)

## Nested Usage

The ContentSection block can be used:
- ✅ In page layouts
- ✅ Inside column blocks
- ❌ Does not support nested blocks itself

## SEO Considerations

- Use clear, descriptive titles for better SEO
- Enable priority loading for above-the-fold images
- Provide meaningful image alt text (uses title as fallback)
- Navy background sections provide good contrast for accessibility
