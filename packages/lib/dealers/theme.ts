/**
 * Dealer Theme Utilities
 * 
 * Utilities for generating and applying dealer-specific themes
 */

import type { DealerInfoWithGroup } from '@dealertower/lib/api/dealer';

export interface ThemeVariables {
  '--dealer-primary': string;
  '--dealer-secondary': string;
  '--dealer-accent': string;
  '--dealer-primary-hover'?: string;
  '--dealer-primary-active'?: string;
}

/**
 * Generate CSS custom properties from dealer/website information
 */
export function generateThemeVariables(websiteInfo: DealerInfoWithGroup): ThemeVariables {
  const { theme } = websiteInfo;
  
  return {
    '--dealer-primary': theme.primaryColor,
    '--dealer-secondary': theme.secondaryColor || theme.primaryColor,
    '--dealer-accent': theme.accentColor || '#FFFFFF',
    '--dealer-primary-hover': adjustColorBrightness(theme.primaryColor, -10),
    '--dealer-primary-active': adjustColorBrightness(theme.primaryColor, -20),
  };
}

/**
 * Convert theme variables object to CSS style string
 */
export function themeToCSSString(variables: ThemeVariables): string {
  return Object.entries(variables)
    .map(([key, value]) => `${key}: ${value};`)
    .join('\n');
}

/**
 * Generate inline style object for React components
 */
export function themeToStyleObject(variables: ThemeVariables): Record<string, string> {
  return Object.entries(variables).reduce((acc, [key, value]) => {
    acc[key] = value;
    return acc;
  }, {} as Record<string, string>);
}

/**
 * Adjust color brightness for hover/active states
 * Supports hex colors only for now
 */
function adjustColorBrightness(hex: string, percent: number): string {
  // Remove # if present
  const color = hex.replace('#', '');
  
  // Parse RGB
  const num = parseInt(color, 16);
  const r = (num >> 16) + percent;
  const g = ((num >> 8) & 0x00FF) + percent;
  const b = (num & 0x0000FF) + percent;
  
  // Clamp values
  const clamp = (val: number) => Math.max(0, Math.min(255, val));
  
  // Convert back to hex
  const newColor = (clamp(r) << 16) | (clamp(g) << 8) | clamp(b);
  
  return `#${newColor.toString(16).padStart(6, '0')}`;
}

/**
 * Get contrasting text color (black or white) for a given background color
 */
export function getContrastTextColor(hexColor: string): '#000000' | '#FFFFFF' {
  const color = hexColor.replace('#', '');
  const num = parseInt(color, 16);
  
  const r = (num >> 16) & 0xFF;
  const g = (num >> 8) & 0xFF;
  const b = num & 0xFF;
  
  // Calculate relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
}

/**
 * Generate complete theme style tag content for injection into <head>
 */
export function generateThemeStyleTag(websiteInfo: DealerInfoWithGroup): string {
  const variables = generateThemeVariables(websiteInfo);
  const cssString = themeToCSSString(variables);
  
  return `
    :root {
      ${cssString}
    }
    
    /* Dealer-specific utility classes */
    .btn-dealer-primary {
      background-color: var(--dealer-primary);
      color: var(--dealer-accent);
    }
    
    .btn-dealer-primary:hover {
      background-color: var(--dealer-primary-hover, var(--dealer-primary));
    }
    
    .btn-dealer-primary:active {
      background-color: var(--dealer-primary-active, var(--dealer-primary));
    }
    
    .text-dealer-primary {
      color: var(--dealer-primary);
    }
    
    .text-dealer-secondary {
      color: var(--dealer-secondary);
    }
    
    .border-dealer-primary {
      border-color: var(--dealer-primary);
    }
    
    .bg-dealer-primary {
      background-color: var(--dealer-primary);
    }
    
    .bg-dealer-secondary {
      background-color: var(--dealer-secondary);
    }
  `;
}
