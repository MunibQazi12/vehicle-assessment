# EditorField Component Architecture

The `EditorField` is a custom PayloadCMS field component that provides a rich text editor using TipTap. It generates **Tailwind-friendly HTML output** instead of inline styles.

## Folder Structure

```plaintext
cms/components/EditorField/
├── index.tsx              # Main component entry point
├── editor.scss            # Editor-specific styles
│
├── config/                # Static configuration & mappings
│   ├── index.ts           # Re-exports all config
│   ├── font-sizes.ts      # Font size options for dropdown
│   └── tailwind-maps.ts   # CSS property → Tailwind class mappings
│
├── extensions/            # TipTap editor extensions
│   ├── index.ts           # getEditorExtensions() + re-exports
│   ├── font-size.ts       # FontSize extension (text-xs, text-sm, etc.)
│   ├── text-color.ts      # TextColor extension (text-[#hex])
│   ├── background-color.ts# BackgroundColor extension (bg-[#hex])
│   ├── highlight.ts       # TailwindHighlight extension
│   ├── link.ts            # TailwindLink extension
│   └── text-align.ts      # TailwindTextAlign extension
│
├── utils/                 # Utility functions
│   ├── index.ts           # Re-exports all utils
│   ├── colors.ts          # Color conversion (rgb, hsl, hex)
│   ├── converters.ts      # Value converters (spacing, radius, shadow)
│   ├── styles-to-tailwind.ts # Main style-to-Tailwind converter
│   ├── merge-classes.ts   # HTML class attribute merging
│   └── labels.ts          # PayloadCMS label helper
│
├── toolbar/               # Editor toolbar UI components
│   ├── index.ts           # Re-exports all toolbar components
│   ├── EditorToolbar.tsx  # Main toolbar with all controls
│   ├── ToolbarButton.tsx  # Button & divider primitives
│   ├── FontSizeDropdown.tsx # Font size selector
│   ├── FormatDropdown.tsx # Heading/paragraph selector
│   └── ColorPicker.tsx    # Text color picker
│
└── __tests__/             # Unit tests
    └── utils.test.ts      # Tests for conversion utilities
```

## Module Responsibilities

### `config/` - Configuration & Mappings

Static data that doesn't change at runtime.

| File | Purpose |
|------|---------|
| `font-sizes.ts` | Font size dropdown options and Tailwind class mappings |
| `tailwind-maps.ts` | 25+ CSS property to Tailwind class mapping objects |

**When to add here:**

- New CSS property mappings for the converter
- New dropdown options or static configuration
- Named color definitions

### `extensions/` - TipTap Extensions

Custom TipTap extensions that render Tailwind classes instead of inline styles.

| File | TipTap Extension | Output |
|------|------------------|--------|
| `font-size.ts` | `FontSize` | `class="text-lg"` |
| `text-color.ts` | `TextColor` | `class="text-[#ff0000]"` |
| `background-color.ts` | `BackgroundColor` | `class="bg-[#ffff00]"` |
| `highlight.ts` | `TailwindHighlight` | `<mark class="bg-[#fef08a] rounded-sm px-0.5">` |
| `link.ts` | `TailwindLink` | `<a class="text-blue-600 underline ...">` |
| `text-align.ts` | `TailwindTextAlign` | `class="text-center"` |

**When to add here:**

- New text formatting features (e.g., text-shadow, outline)
- Custom marks or nodes that need Tailwind output
- Extensions for new editor capabilities

### `utils/` - Utility Functions

Pure functions for data transformation.

| File | Functions | Purpose |
|------|-----------|---------|
| `colors.ts` | `rgbToHex`, `hslToHex`, `normalizeColor` | Convert any color format to hex |
| `converters.ts` | `convertSpacing`, `convertBorderRadius`, `convertBoxShadow` | Convert CSS values to Tailwind |
| `styles-to-tailwind.ts` | `convertStylesToTailwind` | Main converter for inline styles |
| `merge-classes.ts` | `mergeClasses` | Merge duplicate class attributes |
| `labels.ts` | `getLabel` | Extract label from PayloadCMS field config |

**When to add here:**

- New CSS property converters
- Helper functions for HTML/style manipulation
- Validation or normalization utilities

### `toolbar/` - UI Components

React components for the editor toolbar.

| File | Component | Purpose |
|------|-----------|---------|
| `EditorToolbar.tsx` | `EditorToolbar` | Main toolbar with all controls |
| `ToolbarButton.tsx` | `ToolbarButton`, `ToolbarDivider` | Reusable button primitives |
| `FontSizeDropdown.tsx` | `FontSizeDropdown` | Font size selector dropdown |
| `FormatDropdown.tsx` | `FormatDropdown` | Heading/paragraph selector |
| `ColorPicker.tsx` | `ColorPicker` | Color palette picker |

**When to add here:**

- New toolbar controls (e.g., table picker, emoji picker)
- UI improvements to existing controls
- New dropdown or modal components

## Import Patterns

### From within EditorField

```tsx
// Import from submodule index files
import { getEditorExtensions } from './extensions'
import { convertStylesToTailwind, mergeClasses } from './utils'
import { EditorToolbar } from './toolbar'
import { fontSizeOptions } from './config'
```

### From other CMS components

```tsx
// Import from the main index
import EditorField from '@/cms/components/EditorField'

// Or import specific utilities if needed
import { convertStylesToTailwind } from '@/cms/components/EditorField/utils'
```

## Adding New Features

### Adding a New CSS Property Conversion

1. Add the mapping to `config/tailwind-maps.ts`:

   ```ts
   export const newPropertyMap: Record<string, string> = {
     'value1': 'tailwind-class-1',
     'value2': 'tailwind-class-2',
   }
   ```

2. Export from `config/index.ts`

3. Add conversion logic to `utils/styles-to-tailwind.ts`:

   ```ts
   import { newPropertyMap } from '../config/tailwind-maps'
   
   // In convertStylesToTailwind:
   if (prop === 'new-property') {
     const twClass = newPropertyMap[value.toLowerCase()]
     if (twClass) {
       classes.push(twClass)
       return
     }
   }
   ```

4. Add tests to `__tests__/utils.test.ts`

### Adding a New TipTap Extension

1. Create `extensions/new-feature.ts`:

   ```ts
   import { Extension } from '@tiptap/core'
   
   export const NewFeature = Extension.create({
     name: 'newFeature',
     // ... extension config
   })
   ```

2. Add to `extensions/index.ts`:

   ```ts
   import { NewFeature } from './new-feature'
   
   export const getEditorExtensions = () => [
     // ... existing extensions
     NewFeature,
   ]
   
   export { NewFeature } from './new-feature'
   ```

### Adding a New Toolbar Control

1. Create `toolbar/NewControl.tsx`:

   ```tsx
   import React from 'react'
   import type { Editor } from '@tiptap/react'
   
   export const NewControl: React.FC<{ editor: Editor }> = ({ editor }) => {
     // ... component implementation
   }
   ```

2. Export from `toolbar/index.ts`

3. Add to `toolbar/EditorToolbar.tsx`:

   ```tsx
   import { NewControl } from './NewControl'
   
   // In the toolbar JSX:
   <NewControl editor={editor} />
   ```

## Testing

Run tests for EditorField:

```bash
npm test -- --run cms/components/EditorField
```

All conversion utilities should have corresponding tests in `__tests__/utils.test.ts`.

## Key Design Decisions

1. **Tailwind-first output**: All HTML output uses Tailwind classes, not inline styles
2. **Arbitrary values**: When no standard Tailwind class exists, use `[arbitrary-value]` syntax
3. **Data attributes**: Extensions store metadata in `data-*` attributes for parsing
4. **Debounced updates**: Field updates are debounced (1s) to prevent re-renders during typing
5. **Dual output**: Component outputs both JSON (for editing) and HTML (for rendering)
