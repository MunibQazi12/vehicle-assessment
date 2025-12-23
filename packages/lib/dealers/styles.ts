/**
 * Dealer Styles Utilities
 * 
 * Utilities for loading and applying dealer-specific CSS styles
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { getDealerId } from './loader';

/**
 * Cache for dealer styles to avoid repeated file reads
 */
const stylesCache = new Map<string, string | null>();

/**
 * Get the path to a dealer's styles directory
 * 
 * @param dealerId - The dealer UUID
 * @returns The absolute path to the dealer's styles directory
 */
export function getDealerStylesPath(dealerId: string): string {
  return join(process.cwd(), 'dealers', dealerId, 'styles');
}

/**
 * Check if a dealer has custom global styles
 * 
 * @param dealerId - The dealer UUID (optional, uses env if not provided)
 * @returns True if the dealer has a globals.css file
 */
export function hasDealerStyles(dealerId?: string): boolean {
  const id = dealerId || getDealerId();
  if (!id) return false;
  
  const stylesPath = join(getDealerStylesPath(id), 'globals.css');
  return existsSync(stylesPath);
}

/**
 * Load dealer-specific global CSS content
 * Results are cached in memory to avoid repeated file reads
 * 
 * @param dealerId - The dealer UUID (optional, uses env if not provided)
 * @returns The CSS content as a string, or null if not found
 */
export function loadDealerStyles(dealerId?: string): string | null {
  const id = dealerId || getDealerId();
  if (!id) return null;
  
  // Check cache first
  if (stylesCache.has(id)) {
    return stylesCache.get(id) || null;
  }
  
  const stylesPath = join(getDealerStylesPath(id), 'globals.css');
  
  try {
    if (existsSync(stylesPath)) {
      const content = readFileSync(stylesPath, 'utf-8');
      stylesCache.set(id, content);
      return content;
    }
  } catch (error) {
    console.error(`[DealerStyles] Failed to load styles for dealer ${id}:`, error);
  }
  
  stylesCache.set(id, null);
  return null;
}

/**
 * Extract only CSS custom properties (variables) from dealer styles
 * This is useful when you want to override theme variables without
 * loading the full Tailwind config
 * 
 * @param dealerId - The dealer UUID (optional, uses env if not provided)
 * @returns CSS string containing only :root and .dark variable definitions
 */
export function loadDealerCSSVariables(dealerId?: string): string | null {
  const css = loadDealerStyles(dealerId);
  if (!css) return null;
  
  // Extract :root and .dark blocks containing CSS variables
  const variableBlocks: string[] = [];
  
  // Match :root { ... } block
  const rootMatch = css.match(/:root\s*\{[^}]+\}/g);
  if (rootMatch) {
    variableBlocks.push(...rootMatch);
  }
  
  // Match .dark { ... } block
  const darkMatch = css.match(/\.dark\s*\{[^}]+\}/g);
  if (darkMatch) {
    variableBlocks.push(...darkMatch);
  }
  
  return variableBlocks.length > 0 ? variableBlocks.join('\n') : null;
}

/**
 * Clear the styles cache (useful for development/testing)
 */
export function clearDealerStylesCache(): void {
  stylesCache.clear();
}
