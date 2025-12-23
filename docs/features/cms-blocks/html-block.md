# HTML Block

The HTML Block allows content editors to add custom HTML code with inline styles and optional JavaScript to any page through the Payload CMS.

## Features

- **Custom HTML**: Paste any HTML markup directly into the CMS
- **Inline Styles**: Full support for inline styles and `<style>` tags
- **Optional JavaScript**: Toggle to enable/disable script execution
- **XSS Protection**: Automatic HTML sanitization using DOMPurify
- **Safe by Default**: Scripts are disabled by default for security

## Usage in CMS

1. Navigate to any page in the Payload CMS admin panel
2. In the Content tab, click "Add Block"
3. Select "HTML Block" from the dropdown
4. Paste your HTML code in the **HTML Code** textarea
5. **Use Container** - Keep checked (default) to wrap content in a container for consistent page width, or uncheck for full-width content
6. Optionally enable "Enable JavaScript" if your code contains scripts
7. Save the page

## Example HTML Code

### Simple Styled Content

```html
<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 2rem; border-radius: 8px; color: white;">
  <h2 style="margin: 0 0 1rem 0;">Custom Styled Section</h2>
  <p style="margin: 0; line-height: 1.6;">
    This is custom HTML with inline styles that will render exactly as designed.
  </p>
</div>
```

### With Embedded Styles

```html
<style>
  .custom-card {
    background: #f8f9fa;
    border: 2px solid #dee2e6;
    border-radius: 12px;
    padding: 2rem;
    margin: 1rem 0;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }
  .custom-card h3 {
    color: #495057;
    margin-top: 0;
  }
</style>

<div class="custom-card">
  <h3>Custom Component</h3>
  <p>This card uses embedded CSS styles.</p>
</div>
```

### With JavaScript (Enable Scripts Required)

```html
<div id="counter">
  <button id="increment">Count: <span id="count">0</span></button>
</div>

<script>
  let count = 0;
  document.getElementById('increment').addEventListener('click', () => {
    count++;
    document.getElementById('count').textContent = count;
  });
</script>

<style>
  #increment {
    background: #007bff;
    color: white;
    border: none;
    padding: 1rem 2rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1.1rem;
  }
  #increment:hover {
    background: #0056b3;
  }
</style>
```

## Security

### XSS Protection

The HTML Block uses [DOMPurify](https://github.com/cure53/DOMPurify) to sanitize all HTML input, preventing XSS (Cross-Site Scripting) attacks. The following tags and attributes are allowed by default:

**Allowed Tags:**
- All standard HTML tags
- `<style>` - For embedded CSS
- `<link>` - For external stylesheets
- `<script>` - Only when "Enable JavaScript" is checked

**Allowed Attributes:**
- `class`, `id`, `style` - Styling
- `href`, `target`, `rel` - Links
- `data-*` - Data attributes
- `src`, `async`, `defer`, `type` - Scripts (when enabled)

### JavaScript Execution

By default, JavaScript is **disabled** for security. To enable:

1. Check the "Enable JavaScript" checkbox in the block settings
2. Scripts will be sanitized and executed only in the browser
3. Use with caution - only enable for trusted HTML sources

**Security Best Practices:**
- Only enable JavaScript for HTML from trusted sources
- Review all HTML code before enabling scripts
- Prefer using built-in CMS blocks when possible
- Test thoroughly in a staging environment first

## Technical Details

### Component Architecture

- **Server Component**: `HTMLBlock/Component.tsx` - Handles layout and container
- **Client Component**: `HTMLBlock/Component.client.tsx` - Renders sanitized HTML with browser APIs
- **Config**: `HTMLBlock/config.ts` - Payload CMS field definitions

### Rendering Process

1. HTML is sanitized on the client using DOMPurify
2. Safe HTML is rendered using `dangerouslySetInnerHTML`
3. If scripts are enabled, they are extracted and re-executed
4. Styles are applied immediately as part of the HTML

### Server vs Client Rendering

The HTML Block uses a **client component** for rendering because:
- DOMPurify requires browser APIs for proper sanitization
- Script execution requires access to the DOM
- Dynamic HTML manipulation is inherently interactive

The server component wrapper handles:
- Layout and container styling
- `disableInnerContainer` prop for full-width content

## Use Cases

### Embed Third-Party Widgets

Ideal for embedding external services that provide HTML embed codes:

- Social media feeds
- Calendar widgets
- Booking forms
- Analytics dashboards
- Interactive maps

### Custom Design Elements

Create unique design elements that don't fit standard blocks:

- Animated banners
- Custom card layouts
- Interactive infographics
- Custom navigation elements

### Legacy Content Migration

Useful when migrating from another CMS:

- Preserve custom HTML from old system
- Gradually migrate to standard blocks
- Maintain existing design elements

## Limitations

- **SEO**: Content in HTML blocks is less structured than semantic blocks
- **Responsive Design**: HTML must include own responsive styles
- **Maintenance**: Custom HTML is harder to update than structured blocks
- **Performance**: Large HTML blocks may impact page load time

## Alternatives

Consider using standard CMS blocks when possible:

- **Content Block** - Rich text with structured content
- **Code Block** - Syntax-highlighted code samples
- **Media Block** - Images and videos with captions
- **Columns Block** - Multi-column layouts

Use HTML Block only when standard blocks cannot achieve the desired result.
