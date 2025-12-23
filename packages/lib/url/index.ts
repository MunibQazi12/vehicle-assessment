/**
 * URL utilities for SRP routing
 * 
 * Central export for URL parsing, building, and manipulation
 */

export { parseSlug, extractConditions, isValidSlugStructure } from './parser';
export type { ParsedSlug } from './parser';

export {
  buildUrl,
  buildPathFromFilters,
  extractPathFilters,
  extractQueryFilters,
} from './builder';
export type { BuiltUrl } from './builder';

export {
  CONDITION_SLUGS,
  SLUG_TO_CONDITION,
  VALID_CONDITION_SLUGS,
  PATH_PARAMETERS,
  SLUG_SPECIAL_CHARS_REGEX,
  NON_ASCII_REGEX,
  QUERY_PARAM_SORT_ORDER,
  DEFAULT_SORT_DIRECTION,
} from './constants';
