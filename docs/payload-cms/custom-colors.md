# Custom Colors in EditorField

The EditorField component supports custom color palettes for text color selection. You can define custom colors at different levels:

## Configuration Structure

Colors are configured in `cms/components/EditorField/config/colors.ts`:

```typescript
export interface ColorOption {
  value: string    // Hex color value
  label?: string   // Optional label/name
}
```

## Usage Options

### 1. Global Default Colors

Modify `defaultColors` in `config/colors.ts`:

```typescript
export const defaultColors: ColorOption[] = [
  { value: '#72c6f5', label: 'Brand Blue' },
  { value: '#151B49', label: 'Brand Navy' },
  { value: '#FF6B35', label: 'Brand Orange' },
  // ... more colors
]
```

### 2. Context-Based Colors

Use the `getEditorColors(context?)` function to return different colors based on context (e.g., dealer ID, theme):

```typescript
export function getEditorColors(context?: string): ColorOption[] {
  if (context === 'dealer-abc') {
    return brandColors
  }
  if (context === 'dealer-xyz') {
    return customColors
  }
  return defaultColors
}
```

### 3. Component-Level Custom Colors

Pass custom colors directly to CoreEditor or variants:

```typescript
// In a block config
{
  name: 'title',
  type: 'json',
  admin: {
    components: {
      Field: {
        path: '@dtcms/components/EditorField/variants/HeaderEditor',
        clientProps: {
          colors: [
            { value: '#72c6f5', label: 'Primary' },
            { value: '#151B49', label: 'Secondary' },
          ],
        },
      },
    },
  },
}
```

## Implementation Details

The `ColorPicker` toolbar component accepts:

- `colors?: ColorOption[]` - Custom color palette (overrides default)
- `context?: string` - Context string for `getEditorColors()`

If neither is provided, it uses `getEditorColors()` without context.

## Examples

### Example 1: Dealer-Specific Colors

```typescript
// In colors.ts
const dealerColorMap: Record<string, ColorOption[]> = {
  '494a1788-0619-4a53-99c1-1c9f9b2e8fcc': [
    { value: '#72c6f5', label: 'Nissan Blue' },
    { value: '#151B49', label: 'Nissan Navy' },
  ],
  // ... more dealers
}

export function getEditorColors(context?: string): ColorOption[] {
  if (context && dealerColorMap[context]) {
    return dealerColorMap[context]
  }
  return defaultColors
}

// In field usage
clientProps: {
  context: process.env.NEXTJS_APP_DEALER_ID,
}
```

### Example 2: Limited Color Palette for Headers

```typescript
// In HeaderEditor or block config
const headerColors: ColorOption[] = [
  { value: '#151B49', label: 'Dark Navy' },
  { value: '#72c6f5', label: 'Light Blue' },
  { value: '#000000', label: 'Black' },
  { value: '#FFFFFF', label: 'White' },
]

clientProps: {
  colors: headerColors,
}
```

### Example 3: Brand Colors with Shades

```typescript
export const brandColorsWithShades: ColorOption[] = [
  // Primary
  { value: '#1e3a8a', label: 'Primary 900' },
  { value: '#2563eb', label: 'Primary 600' },
  { value: '#3b82f6', label: 'Primary 500' },
  { value: '#60a5fa', label: 'Primary 400' },
  { value: '#93c5fd', label: 'Primary 300' },
  
  // Secondary
  { value: '#7c3aed', label: 'Secondary 600' },
  { value: '#8b5cf6', label: 'Secondary 500' },
  { value: '#a78bfa', label: 'Secondary 400' },
  
  // Neutrals
  { value: '#1f2937', label: 'Gray 800' },
  { value: '#6b7280', label: 'Gray 500' },
  { value: '#d1d5db', label: 'Gray 300' },
  { value: '#f9fafb', label: 'Gray 50' },
]
```

## Best Practices

1. **Consistent Naming**: Use clear, descriptive labels
2. **Brand Guidelines**: Align colors with brand style guide
3. **Accessibility**: Ensure sufficient contrast ratios
4. **Limited Palette**: Don't overwhelm with too many options (recommended: 12-36 colors)
5. **Organization**: Group related colors (primary, secondary, neutrals)
6. **Context-Aware**: Use dealer/theme context when colors vary by tenant

## Testing

After modifying colors, test in:

1. CMS admin panel (title/subtitle fields)
2. Content preview
3. Frontend rendering

Ensure colors:

- Display correctly in picker
- Apply to text properly
- Render correctly in generated HTML
