# Dealer Styles

Each dealer can have custom CSS styles for theming and branding. Styles are defined in the `styles/` subdirectory and automatically loaded by the application.

## Directory Structure

```text
dealers/{dealer-uuid}/styles/
  globals.css              # Global CSS variables and custom styles
```

## CSS Variables

The primary way to customize styling is through CSS custom properties (variables):

```css
/* dealers/{dealer-uuid}/styles/globals.css */
@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

:root {
  /* Colors */
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
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
  
  /* Radius */
  --radius: 0.625rem;
  
  /* Sidebar */
  --sidebar: oklch(0.985 0 0);
  --sidebar-foreground: oklch(0.145 0 0);
  --sidebar-primary: oklch(0.205 0 0);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.97 0 0);
  --sidebar-accent-foreground: oklch(0.205 0 0);
  --sidebar-border: oklch(0.922 0 0);
  --sidebar-ring: oklch(0.708 0 0);
}

/* Dark mode overrides */
.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --card: oklch(0.145 0 0);
  --card-foreground: oklch(0.985 0 0);
  --primary: oklch(0.985 0 0);
  --primary-foreground: oklch(0.205 0 0);
  /* ... more dark mode variables */
}
```

## Custom Fonts

Define dealer-specific fonts in the `@theme` block:

```css
@theme inline {
  /* Custom font families */
  --font-montserrat: "Montserrat", ui-sans-serif, system-ui, sans-serif;
  --font-open-sans: "Open Sans", ui-sans-serif, system-ui, sans-serif;
  --font-sans: var(--font-open-sans);
  --font-serif: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  --font-mono: "Geist Mono", "Geist Mono Fallback";
  
  /* Map CSS variables to Tailwind */
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  /* ... more color mappings */
}
```

## Loading Dealer Styles

Styles are loaded automatically by the `loadDealerCSSVariables` function:

```typescript
// packages/lib/dealers/styles.ts

export function loadDealerCSSVariables(): string | null {
  const dealerId = getDealerId();
  if (!dealerId) return null;
  
  const stylesPath = join(
    process.cwd(),
    'dealers',
    dealerId,
    'styles',
    'globals.css'
  );
  
  try {
    if (existsSync(stylesPath)) {
      return readFileSync(stylesPath, 'utf-8');
    }
  } catch (error) {
    console.error(`Failed to load styles for dealer ${dealerId}:`, error);
  }
  
  return null;
}
```

Used in `app/layout.tsx`:

```typescript
const dealerCSSVariables = loadDealerCSSVariables();

return (
  <html>
    <head>
      {dealerCSSVariables && (
        <style dangerouslySetInnerHTML={{ __html: dealerCSSVariables }} />
      )}
    </head>
    <body>{children}</body>
  </html>
);
```

## Utility Functions

### Check if Dealer Has Styles

```typescript
import { hasDealerStyles } from '@dealertower/lib/dealers/styles';

if (hasDealerStyles()) {
  // Dealer has custom globals.css
}
```

### Get Styles Path

```typescript
import { getDealerStylesPath } from '@dealertower/lib/dealers/styles';

const path = getDealerStylesPath('73d6c4fc-...');
// Returns: /path/to/project/dealers/73d6c4fc-.../styles
```

## Using CSS Variables in Components

Reference the variables in Tailwind or inline styles:

```typescript
// Using Tailwind classes that reference variables
<div className="bg-background text-foreground">
  <button className="bg-primary text-primary-foreground">
    Click me
  </button>
</div>

// Using inline styles
<div style={{ backgroundColor: 'var(--background)' }}>
  Content
</div>
```

## Chart Colors

For data visualizations, use the chart color variables:

```css
:root {
  --chart-1: oklch(0.646 0.222 41.116);
  --chart-2: oklch(0.6 0.118 184.704);
  --chart-3: oklch(0.398 0.07 227.392);
  --chart-4: oklch(0.828 0.189 84.429);
  --chart-5: oklch(0.769 0.188 70.08);
}
```

## Caching

Styles are cached in memory to avoid repeated file reads:

```typescript
const stylesCache = new Map<string, string | null>();

export function loadDealerStyles(dealerId?: string): string | null {
  const id = dealerId || getDealerId();
  if (!id) return null;
  
  // Check cache first
  if (stylesCache.has(id)) {
    return stylesCache.get(id) || null;
  }
  
  // Load and cache
  const content = readStylesFile(id);
  stylesCache.set(id, content);
  return content;
}
```

## Best Practices

### 1. Use OKLCH Colors

OKLCH provides better color consistency across light and dark modes:

```css
/* Instead of hex or RGB */
--primary: #1a1a2e;          /* Old way */
--primary: oklch(0.205 0 0); /* OKLCH way */
```

### 2. Define Both Light and Dark

Always provide dark mode variants:

```css
:root {
  --background: oklch(1 0 0);        /* White */
}

.dark {
  --background: oklch(0.145 0 0);    /* Dark gray */
}
```

### 3. Semantic Naming

Use semantic names for flexibility:

```css
/* Good: Semantic */
--primary: ...;
--destructive: ...;
--muted: ...;

/* Avoid: Specific colors */
--blue: ...;
--red: ...;
--gray: ...;
```

### 4. Consistent Spacing

Use the radius variable for consistent corners:

```css
:root {
  --radius: 0.625rem;
}
```

Then in components:

```typescript
<div className="rounded-[var(--radius)]">
  {/* Consistent border radius */}
</div>
```

## Example: Complete Dealer Theme

```css
/* dealers/{dealer-uuid}/styles/globals.css */

@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

:root {
  /* Brand colors - Automotive blue theme */
  --background: oklch(0.98 0 0);
  --foreground: oklch(0.1 0.02 250);
  --primary: oklch(0.4 0.15 250);
  --primary-foreground: oklch(1 0 0);
  --secondary: oklch(0.95 0.01 250);
  --secondary-foreground: oklch(0.2 0.02 250);
  --accent: oklch(0.7 0.15 200);
  --accent-foreground: oklch(0.1 0 0);
  --muted: oklch(0.92 0.005 250);
  --muted-foreground: oklch(0.5 0.01 250);
  --destructive: oklch(0.55 0.2 25);
  --destructive-foreground: oklch(1 0 0);
  --border: oklch(0.88 0.01 250);
  --input: oklch(0.88 0.01 250);
  --ring: oklch(0.4 0.15 250);
  --radius: 0.5rem;
  
  /* Sidebar */
  --sidebar: oklch(0.15 0.02 250);
  --sidebar-foreground: oklch(0.95 0 0);
}

.dark {
  --background: oklch(0.12 0.02 250);
  --foreground: oklch(0.95 0 0);
  --primary: oklch(0.6 0.15 250);
  --primary-foreground: oklch(0.1 0 0);
  /* ... */
}

@theme inline {
  --font-sans: "Inter", system-ui, sans-serif;
  --font-heading: "Poppins", system-ui, sans-serif;
  
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--primary);
  /* ... */
}

/* Custom component styles */
.dealer-hero {
  background: linear-gradient(
    135deg,
    oklch(0.4 0.15 250) 0%,
    oklch(0.3 0.12 260) 100%
  );
}

.dealer-cta {
  @apply bg-accent text-accent-foreground;
  @apply hover:bg-accent/90 transition-colors;
}
```
