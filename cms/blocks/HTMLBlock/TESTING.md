# Container Test Examples

Use these HTML examples to test that the container is working properly on your website.

## Style Tag Support

The HTMLBlock component now supports `<style>` tags! This was fixed by extracting style tags before DOMPurify sanitization and reinserting them after. This ensures CSS styles are preserved while maintaining security for other HTML content.

**Key Features:**
- ✅ `<style>` tags with CSS rules
- ✅ Inline `style=""` attributes on elements
- ✅ Complex CSS selectors and `!important` rules
- ✅ CSS with special characters and encoded data URIs
- ✅ Multiple style tags in one block

**Security Note:** Style tags are extracted using regex pattern `/<style[^>]*>[\s\S]*?<\/style>/gi` before sanitization, then reinserted as-is. All other HTML content is still sanitized by DOMPurify.

## Test 1: With Container (Default)

This should have padding on the sides and center the content with a max-width.

**HTML to paste in CMS:**
```html
<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 3rem; border-radius: 8px; color: white; text-align: center;">
  <h2 style="margin: 0 0 1rem 0; font-size: 2rem;">✅ Container Test</h2>
  <p style="margin: 0; font-size: 1.2rem;">
    This content should NOT touch the browser edges. 
    It should have padding on the sides and center with a max-width.
  </p>
  <p style="margin: 1rem 0 0 0; opacity: 0.9;">
    Try resizing your browser window - the content should stay centered and have consistent padding.
  </p>
</div>
```

**Settings:**
- ✅ Use Container: **Checked**
- ⬜ Enable JavaScript: Unchecked

**Expected Result:**
- Content has padding on left/right sides (16px on mobile, 24px on tablet, 32px on desktop)
- Content centers and has max-width (640px → 768px → 1024px → 1280px → 1536px)
- Content never touches the browser edges

---

## Test 2: Without Container (Full Width)

This should stretch edge-to-edge across the browser.

**HTML to paste in CMS:**
```html
<div style="background: linear-gradient(90deg, #f093fb 0%, #f5576c 100%); padding: 3rem; color: white; text-align: center;">
  <h2 style="margin: 0 0 1rem 0; font-size: 2rem;">🔲 Full Width Test</h2>
  <p style="margin: 0; font-size: 1.2rem;">
    This content should stretch from edge to edge of the browser window.
  </p>
  <p style="margin: 1rem 0 0 0; opacity: 0.9;">
    No side padding, no max-width constraints.
  </p>
</div>
```

**Settings:**
- ⬜ Use Container: **Unchecked**
- ⬜ Enable JavaScript: Unchecked

**Expected Result:**
- Content stretches full width of browser
- Background color reaches browser edges
- No automatic padding (only padding from inline styles)

---

## Test 3: Side-by-Side Comparison

Create two HTML blocks on the same page:
1. First block: Use Container ✅ Checked
2. Second block: Use Container ⬜ Unchecked

You'll clearly see the difference!

---

## Responsive Breakpoints

The container uses these responsive breakpoints:

| Screen Size | Max Width | Side Padding |
|------------|-----------|--------------|
| Mobile (<640px) | 100% | 16px |
| Small (≥640px) | 640px | 24px |
| Medium (≥768px) | 768px | 24px |
| Large (≥1024px) | 1024px | 32px |
| XL (≥1280px) | 1280px | 32px |
| 2XL (≥1536px) | 1536px | 32px |

---

## Troubleshooting

**If content is still touching the edges:**

1. Make sure "Use Container" checkbox is **checked** in the HTML Block settings
2. Clear your browser cache (Ctrl+Shift+R or Cmd+Shift+R)
3. Verify the build completed successfully (`npm run build`)
4. Check browser DevTools:
   - Inspect the HTML Block
   - Look for `<div class="container">` wrapping your content
   - Verify the `.container` class has padding and max-width styles applied

**To verify container is working:**

1. Right-click on your HTML content
2. Select "Inspect" or "Inspect Element"
3. Look for this HTML structure:
   ```html
   <div class="not-prose my-8">
     <div class="container">  <!-- This should have padding and max-width -->
       <div class="html-block-content">
         <!-- Your HTML here -->
       </div>
     </div>
   </div>
   ```
4. Check the Computed styles for `.container` - should show padding-left, padding-right, and max-width
