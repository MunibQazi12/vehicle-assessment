# Dealer Library Utilities

The `lib/` subdirectory contains utility functions and helpers specific to each dealer.

## Directory Structure

```text
dealers/{dealer-uuid}/lib/
  utils.ts                 # General utility functions
```

## Core Utilities

### utils.ts

The primary utility file contains common helpers:

```typescript
// dealers/{dealer-uuid}/lib/utils.ts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Merge Tailwind CSS classes with proper precedence handling
 * 
 * @param inputs - Class values to merge
 * @returns Merged class string
 * 
 * @example
 * cn("px-4 py-2", "px-6") // "px-6 py-2"
 * cn("text-red-500", conditional && "text-blue-500")
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

## Usage

Import utilities in components:

```typescript
import { cn } from '@dealers/{dealer-uuid}/lib/utils';

export function Button({ className, variant, ...props }) {
  return (
    <button
      className={cn(
        "px-4 py-2 rounded-md font-medium",
        variant === "primary" && "bg-primary text-primary-foreground",
        variant === "secondary" && "bg-secondary text-secondary-foreground",
        className
      )}
      {...props}
    />
  );
}
```

## The `cn` Function

The `cn` function is essential for conditional class merging in Tailwind:

### How It Works

1. **clsx** - Handles conditional classes and arrays
2. **twMerge** - Resolves Tailwind class conflicts

### Examples

```typescript
// Basic usage
cn("px-4", "py-2")
// Output: "px-4 py-2"

// Conditional classes
cn("text-base", isLarge && "text-lg")
// Output: "text-base" or "text-base text-lg"

// Override classes
cn("px-4", "px-6")
// Output: "px-6" (later class wins)

// With arrays
cn(["flex", "items-center"], isColumn && "flex-col")
// Output: "flex items-center" or "flex items-center flex-col"

// Objects
cn({
  "bg-primary": isPrimary,
  "bg-secondary": !isPrimary,
})
// Output: "bg-primary" or "bg-secondary"
```

### Why Not Just Template Literals?

Without `twMerge`, Tailwind conflicts aren't resolved:

```typescript
// Without cn
`px-4 ${className}`  // If className has "px-6", result is "px-4 px-6"

// With cn
cn("px-4", className) // If className has "px-6", result is "px-6"
```

## Adding Custom Utilities

Add dealer-specific utilities as needed:

```typescript
// dealers/{dealer-uuid}/lib/utils.ts

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format price for display
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Format phone number for display
 */
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phone;
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
}

/**
 * Generate initials from a name
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Slugify a string for URLs
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}
```

## Dependencies

The `cn` function requires these packages (already in project):

```json
{
  "dependencies": {
    "clsx": "^2.x",
    "tailwind-merge": "^2.x"
  }
}
```

## Best Practices

### 1. Keep Utils Pure

Utilities should be pure functions without side effects:

```typescript
// Good: Pure function
export function formatPrice(price: number): string {
  return `$${price.toLocaleString()}`;
}

// Avoid: Side effects
export function formatPrice(price: number): string {
  console.log(price); // Side effect
  return `$${price.toLocaleString()}`;
}
```

### 2. Type Everything

Use TypeScript for all utilities:

```typescript
export function truncate(text: string, length: number): string {
  // Return type enforced
}
```

### 3. Document Complex Functions

Add JSDoc for non-obvious utilities:

```typescript
/**
 * Calculate the distance between two coordinates
 * 
 * @param lat1 - Latitude of first point
 * @param lon1 - Longitude of first point
 * @param lat2 - Latitude of second point
 * @param lon2 - Longitude of second point
 * @returns Distance in miles
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  // Haversine formula implementation
}
```

### 4. Export Individually

Export each utility separately for tree-shaking:

```typescript
// Good: Individual exports
export function cn(...) {}
export function formatPrice(...) {}

// Avoid: Default export object
export default {
  cn,
  formatPrice,
};
```
