# HTML Block Component

A Payload CMS block that allows editors to add custom HTML with inline styles and optional JavaScript execution.

## Files

- **config.ts** - Payload CMS block configuration with field definitions
- **Component.tsx** - Server component wrapper that handles layout
- **Component.client.tsx** - Client component that sanitizes and renders HTML

## Key Features

- ✅ XSS protection via DOMPurify
- ✅ Support for inline styles and `<style>` tags
- ✅ Optional JavaScript execution (disabled by default)
- ✅ Flexible container layout with `disableInnerContainer` option

## Props

### HTMLBlock Component

```typescript
type Props = {
  htmlContent: string          // Raw HTML to render
  enableScripts?: boolean      // Enable script execution (default: false)
  useContainer?: boolean       // Wrap in .container div (default: true)
  blockType: 'htmlBlock'       // Block type identifier
  className?: string           // Additional CSS classes
  disableInnerContainer?: boolean  // Legacy prop, use useContainer instead
}
```

## Usage Example

```tsx
import { HTMLBlock } from '@dtcms/blocks/HTMLBlock/Component'

// Basic usage
<HTMLBlock
  htmlContent="<div class='custom'>Hello</div>"
  blockType="htmlBlock"
/>

// With scripts enabled
<HTMLBlock
  htmlContent="<button onclick='alert(\"Hi\")'>Click</button>"
  blockType="htmlBlock"
  enableScripts={true}
/>

// Full-width without container
<HTMLBlock
  htmlContent="<section>Full width content</section>"
  blockType="htmlBlock"
  useContainer={false}
/>
```

## Security

HTML is sanitized using DOMPurify with the following configuration:

**Always Allowed:**

- All standard HTML tags
- `<style>` tags for CSS (extracted before sanitization, reinserted after)
- `<link>` and `<iframe>` tags
- `class`, `id`, `style` attributes
- Data attributes (`data-*`)
- Inline styles on elements

**Conditionally Allowed (when `enableScripts=true`):**

- `<script>` tags
- `src`, `async`, `defer`, `type` attributes

**Note on Style Tags:** Due to DOMPurify's security model with isomorphic-dompurify, `<style>` tags are extracted before sanitization using regex and reinserted after sanitization to preserve CSS while maintaining security for other content.

## Testing

Tests are in `__tests__/Component.test.tsx`:

```bash
npm test -- cms/blocks/HTMLBlock
```

## See Also

- [Full documentation](../../../docs/features/cms-blocks/html-block.md)
- [Other CMS blocks](../)
