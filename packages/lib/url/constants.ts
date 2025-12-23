/**
 * URL structure constants for SRP routing
 * 
 * Defines condition slugs, path parameter order, and URL formatting rules
 */

import type { VehicleCondition } from '@dealertower/types/vehicle';

/**
 * Condition slug mappings
 * Maps VehicleCondition enum values to their URL slugs
 */
export const CONDITION_SLUGS: Record<VehicleCondition, string> = {
  new: 'new-vehicles',
  used: 'used-vehicles',
  certified: 'certified',
} as const;

/**
 * Reverse mapping: slug to condition
 */
export const SLUG_TO_CONDITION: Record<string, VehicleCondition> = {
  'new-vehicles': 'new',
  'used-vehicles': 'used',
  'certified': 'certified',
} as const;

/**
 * Valid condition slugs for validation
 */
export const VALID_CONDITION_SLUGS = Object.values(CONDITION_SLUGS);

/**
 * Path parameters in fixed order
 * Only these filters appear in URL path, all others become query params
 */
export const PATH_PARAMETERS = ['condition', 'make', 'model'] as const;

/**
 * Special characters to replace in URL slugs
 * Replaces with hyphen for clean URLs
 */
export const SLUG_SPECIAL_CHARS_REGEX = /[\/\s\(\)]+/g;

/**
 * Non-ASCII character pattern for removal
 */
export const NON_ASCII_REGEX = /[^\x00-\x7F]+/g;

/**
 * Query parameter sort order
 */
export const QUERY_PARAM_SORT_ORDER: Record<string, 'asc' | 'desc'> = {
  year: 'desc', // Years descending (newest first)
  // All others default to ascending
};

/**
 * Default sort direction for unlisted params
 */
export const DEFAULT_SORT_DIRECTION = 'asc';
