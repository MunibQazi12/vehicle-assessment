# Responsive Text Alignment in EditorField

The EditorField component now supports **responsive text alignment**, allowing content editors to set different text alignments for mobile, tablet, and desktop screens.

## Quick Start

### Using Responsive Alignment in CMS Blocks

To enable responsive alignment in your editor, add `'responsiveAlignment'` to the features:

```tsx
import { CoreEditor } from '@dtcms/components/EditorField'

<CoreEditor
  preset="custom"
  features={['bold', 'italic', 'responsiveAlignment']}
  value={content}
  onChange={handleChange}
/>
```

Or use the `alignment` feature group which includes responsive alignment:

```tsx
<CoreEditor
  preset="custom"
  features={['textFormatting', 'alignment']}  // includes responsiveAlignment
  value={content}
  onChange={handleChange}
/>
```

## Features

### Breakpoints

The responsive alignment uses Tailwind CSS breakpoints:

- **Mobile** (default): `text-{align}` - Applies below 768px
- **Tablet**: `md:text-{align}` - Applies at 768px and above
- **Desktop**: `lg:text-{align}` - Applies at 1024px and above

### Available Alignments

Each breakpoint supports four alignment options:
- `left` - Align text to the left
- `center` - Center text
- `right` - Align text to the right
- `justify` - Justify text (equal spacing)

## How It Works

### Editor UI

When using `responsiveAlignment`, the toolbar displays a special alignment control with:

1. **Breakpoint tabs** - Switch between Mobile, Tablet, and Desktop views
2. **Alignment buttons** - Set alignment for the selected breakpoint
3. **Current alignment summary** - Shows the alignment set for each breakpoint

### Output

The extension generates responsive Tailwind classes:

```html
<!-- Mobile center, Desktop left -->
<p class="text-center lg:text-left">This text is centered on mobile, left-aligned on desktop</p>

<!-- Mobile center, Tablet left, Desktop right -->
<p class="text-center md:text-left lg:text-right">Different alignment per breakpoint</p>
```

## Usage Examples

### Example 1: Center on Mobile, Left on Desktop

Common pattern for hero text or headings:

```tsx
// In the editor, set:
// Mobile: center
// Desktop: left

// Output HTML:
<h1 class="text-center lg:text-left">Welcome to Our Dealership</h1>
```

### Example 2: All Different Alignments

```tsx
// Mobile: center
// Tablet: right
// Desktop: left

// Output HTML:
<p class="text-center md:text-right lg:text-left">Responsive text</p>
```

### Example 3: Only Mobile and Desktop

```tsx
// Mobile: center
// Tablet: (not set, inherits mobile)
// Desktop: left

// Output HTML:
<p class="text-center lg:text-left">Text</p>
```

## TypeScript Types

### ResponsiveAlignment Type

```typescript
export type ResponsiveAlignment = {
  mobile?: 'left' | 'center' | 'right' | 'justify'
  tablet?: 'left' | 'center' | 'right' | 'justify'
  desktop?: 'left' | 'center' | 'right' | 'justify'
}
```

### Using Programmatically

```typescript
import type { ResponsiveAlignment } from '@dtcms/components/EditorField'

const alignment: ResponsiveAlignment = {
  mobile: 'center',
  tablet: 'left',
  desktop: 'right'
}

// Apply to editor
editor.commands.setResponsiveTextAlign(alignment)
```

## Integration with Presets

### Standard Preset

The `standard` preset includes responsive alignment by default:

```tsx
<CoreEditor preset="standard" />
// Includes: responsiveAlignment + all other features
```

### Header Preset

The `header` preset also includes responsive alignment:

```tsx
<CoreEditor preset="header" />
// Includes: responsiveAlignment, colors, fontSize, basic formatting
```

### Custom Configuration

Mix responsive alignment with other features:

```tsx
<CoreEditor
  preset="custom"
  features={[
    'textFormatting',        // bold, italic, underline, strikethrough
    'responsiveAlignment',   // responsive alignment control
    'colors',                // text and background colors
    'fontSize'               // font size control
  ]}
/>
```

## Backward Compatibility

### Legacy Alignment

Individual alignment buttons still work:

```tsx
<CoreEditor
  preset="custom"
  features={['alignLeft', 'alignCenter', 'alignRight']}
/>
```

This provides simple (non-responsive) alignment buttons.

### Mixed Mode

You can use both responsive and individual buttons:

```tsx
<CoreEditor
  preset="custom"
  features={[
    'responsiveAlignment',  // Full responsive control
    'alignLeft',            // Quick left button
    'alignCenter'           // Quick center button
  ]}
/>
```

### Parsing Legacy Content

The extension automatically handles both:

```html
<!-- New responsive format -->
<p class="text-center md:text-left">...</p>

<!-- Legacy format (still works) -->
<p class="text-center">...</p>
```

## Customization

### Using Without Breakpoints

To use the responsive alignment control as simple alignment buttons:

```tsx
import { ResponsiveAlignmentControl } from '@dtcms/components/EditorField'

<ResponsiveAlignmentControl 
  editor={editor} 
  showBreakpoints={false}  // Hides breakpoint tabs
/>
```

### Building Custom Toolbars

Include the responsive alignment control in custom toolbars:

```tsx
import { ResponsiveAlignmentControl, ToolbarButton } from '@dtcms/components/EditorField'

export const CustomToolbar = ({ editor }) => (
  <div className="toolbar">
    <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()}>
      Bold
    </ToolbarButton>
    <ResponsiveAlignmentControl editor={editor} />
  </div>
)
```

## Testing

Run tests for responsive alignment:

```bash
npm test -- responsive-alignment
```

## Common Use Cases

### 1. Hero Sections
```
Mobile: center (prominent on small screens)
Desktop: left (aligns with content)
```

### 2. Call-to-Action Text
```
Mobile: center (attention-grabbing)
Tablet: center (still prominent)
Desktop: right (alongside images)
```

### 3. Body Content
```
Mobile: left (readable)
Desktop: justify (professional look)
```

### 4. Testimonials
```
Mobile: center (emphasize quotes)
Desktop: left (readable blocks)
```

## Browser Support

Works with all browsers that support Tailwind CSS responsive utilities:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance

- ✅ Zero JavaScript on the frontend (pure CSS)
- ✅ Minimal CSS output (only classes used)
- ✅ No inline styles (SEO-friendly)
- ✅ Progressive enhancement (falls back to mobile if breakpoints not supported)

## Related Documentation

- [EditorField Overview](./editor-field.md)
- [Custom Tailwind Classes](./custom-colors.md)
- [Block Components](./blocks/)
