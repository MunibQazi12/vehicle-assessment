/**
 * URL slug parser
 * 
 * Extracts filter values from URL path segments following the structure:
 * /{condition}/{make}/{model}/
 * 
 * Examples:
 * - /new-vehicles/ → { condition: ['new'] }
 * - /used-vehicles/toyota/ → { condition: ['used'], make: ['toyota'] }
 * - /new-vehicles/honda/accord/ → { condition: ['new'], make: ['honda'], model: ['accord'] }
 * - /used-vehicles/certified/ → { condition: ['used', 'certified'] }
 */

import type { VehicleCondition } from '@dealertower/types/vehicle';
import type { FilterState } from '@dealertower/types/filters';
import { SLUG_TO_CONDITION, VALID_CONDITION_SLUGS } from './constants';

export interface ParsedSlug {
  filters: FilterState;
  isValid: boolean;
  canonicalPath?: string;
}

/**
 * Parse URL slug array into filter state
 * 
 * @param slug - Array of path segments from Next.js catch-all route
 * @returns Parsed filter state and validation info
 */
export function parseSlug(slug?: string[]): ParsedSlug {
  if (!slug || slug.length === 0) {
    return { filters: {}, isValid: true };
  }

  const filters: FilterState = {};
  const conditions: VehicleCondition[] = [];
  let currentIndex = 0;

  // Phase 1: Parse condition slug(s)
  // Special rule: /used-vehicles/certified means certified ONLY (not used+certified)
  // The 'certified' slug extends the used-vehicles path but represents only certified vehicles
  while (currentIndex < slug.length && VALID_CONDITION_SLUGS.includes(slug[currentIndex])) {
    const conditionSlug = slug[currentIndex];
    const condition = SLUG_TO_CONDITION[conditionSlug];
    
    // Special handling for certified after used-vehicles
    if (condition === 'certified' && conditions.includes('used') && currentIndex === 1) {
      // /used-vehicles/certified/ → replace 'used' with 'certified'
      conditions.length = 0;
      conditions.push('certified');
      currentIndex++;
      break;
    }
    
    if (condition && !conditions.includes(condition)) {
      conditions.push(condition);
    }
    
    currentIndex++;
  }

  // If conditions found, set them
  if (conditions.length > 0) {
    // Business rule: if 'used' is present, ensure 'certified' is also included
    if (conditions.includes('used') && !conditions.includes('certified')) {
      conditions.push('certified');
    }
    filters.condition = conditions;
  } else {
    // No valid condition found at start - invalid slug
    return { filters: {}, isValid: false };
  }

  // Phase 2: Parse make (if present and not a condition slug)
  if (currentIndex < slug.length && !VALID_CONDITION_SLUGS.includes(slug[currentIndex])) {
    const makeSlug = slug[currentIndex];
    filters.make = [normalizeSlugValue(makeSlug)];
    currentIndex++;
  }

  // Phase 3: Parse model (only if make exists and more segments available)
  if (filters.make && currentIndex < slug.length && !VALID_CONDITION_SLUGS.includes(slug[currentIndex])) {
    const modelSlug = slug[currentIndex];
    filters.model = [normalizeSlugValue(modelSlug)];
    currentIndex++;
  }

  // If there are remaining segments that weren't parsed, mark as invalid
  const isValid = currentIndex >= slug.length;

  return { filters, isValid };
}

/**
 * Normalize a slug value back to display form
 * Handles basic conversion from URL-safe slug to readable text
 * 
 * @param slug - URL slug segment
 * @returns Normalized value
 */
function normalizeSlugValue(slug: string): string {
  // For make/model, we keep as lowercase since API likely expects lowercase
  // The API will handle case sensitivity
  return slug.toLowerCase();
}

/**
 * Extract conditions from slug array
 * Helper for condition-only parsing
 * 
 * @param slug - Array of path segments
 * @returns Array of conditions found
 */
export function extractConditions(slug?: string[]): VehicleCondition[] {
  if (!slug || slug.length === 0) return [];

  const conditions: VehicleCondition[] = [];
  
  for (const segment of slug) {
    if (VALID_CONDITION_SLUGS.includes(segment)) {
      const condition = SLUG_TO_CONDITION[segment];
      if (condition && !conditions.includes(condition)) {
        conditions.push(condition);
      }
    } else {
      // Stop at first non-condition segment
      break;
    }
  }

  return conditions;
}

/**
 * Validate if a slug array represents a valid SRP URL structure
 * 
 * @param slug - Array of path segments
 * @returns true if valid structure
 */
export function isValidSlugStructure(slug?: string[]): boolean {
  const parsed = parseSlug(slug);
  return parsed.isValid;
}
