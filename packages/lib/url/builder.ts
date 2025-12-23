/**
 * URL slug builder
 * 
 * Generates SEO-friendly URL paths from filter state following the structure:
 * /{condition}/{make}/{model}/?[query_params]
 * 
 * Rules:
 * 1. Condition always comes first (new-vehicles, used-vehicles, certified)
 * 2. Make comes second (only first make if multiple)
 * 3. Model comes third (only if make exists, only first model if multiple)
 * 4. All other filters become query parameters
 * 5. Certified extends used-vehicles path
 * 6. Multiple conditions follow specific combination rules
 */

import type { FilterState } from '@dealertower/types/filters';
import { normalizeForUrl } from '@dealertower/lib/utils/text';
import {
	QUERY_PARAM_SORT_ORDER,
	DEFAULT_SORT_DIRECTION,
} from './constants';

export interface BuiltUrl {
  /** Path segments (without leading/trailing slashes) */
  path: string;
  /** Query parameter object */
  queryParams: Record<string, string>;
  /** Full URL string (path + query) */
  fullUrl: string;
  /** Normalized filter state that matches the URL */
  normalizedFilters: FilterState;
}

/**
 * Normalize filter state according to business rules
 * This ensures filters are in a consistent state before URL building
 */
function normalizeFilters(filters: FilterState): FilterState {
  const normalized: FilterState = { ...filters };
  
  // Normalize condition filter according to business rules
  if (normalized.condition) {
    const conditions = normalized.condition;
    const hasNew = conditions.includes('new');
    const hasUsed = conditions.includes('used');
    const hasCertified = conditions.includes('certified');
    
    // Business rule: used always includes certified
    if (hasUsed && !hasCertified) {
      normalized.condition = [...conditions, 'certified'];
    }
  } else {
    // No condition specified - default to all conditions
    // This matches the URL rule: no condition = /used-vehicles?condition=new
    normalized.condition = ['new', 'used', 'certified'];
  }
  
  return normalized;
}

/**
 * Build URL structure from filter state
 * Automatically normalizes filters before building URL
 * 
 * @param filters - Current filter state (will be normalized)
 * @param sortBy - Optional sort field
 * @param order - Optional sort order
 * @returns Complete URL structure and normalized filters
 */
export function buildUrl(
  filters: FilterState,
  sortBy?: string,
  order?: 'asc' | 'desc'
): BuiltUrl & { normalizedFilters: FilterState } {
  // Normalize filters first
  const normalizedFilters = normalizeFilters(filters);
  
  const pathResult = buildPathSegments(normalizedFilters);
  const queryParams = buildQueryParams(normalizedFilters, sortBy, order, pathResult.queryConditions);
  
  const path = pathResult.segments.join('/');
  const queryString = Object.keys(queryParams).length > 0
    ? '?' + new URLSearchParams(queryParams).toString()
    : '';
  
  const fullUrl = `/${path}/${queryString}`;

  return {
    path,
    queryParams,
    fullUrl,
    normalizedFilters,
  };
}

/**
 * Build path segments from filter state
 * Returns array of slug segments in correct order
 */
function buildPathSegments(filters: FilterState): { segments: string[]; queryConditions?: string[] } {
	const segments: string[] = [];

	// Step 1: Build condition path
	const conditionResult = buildConditionPath(filters.condition);
	segments.push(...conditionResult.segments);

	// Step 2: Add make (only first one, alphabetically sorted)
	if (filters.make && filters.make.length > 0) {
		const sortedMakes = [...filters.make].sort();
		const primaryMake = sortedMakes[0];
		segments.push(normalizeForUrl(primaryMake));
	}

	// Step 3: Add model (only if make exists, only first one alphabetically)
	if (filters.make && filters.model && filters.model.length > 0) {
		const sortedModels = [...filters.model].sort();
		const primaryModel = sortedModels[0];
		segments.push(normalizeForUrl(primaryModel));
	}

	return { segments, queryConditions: conditionResult.queryConditions };
}

/**
 * Build condition path segments based on specification rules
 * 
 * Rules per docs:
 * - Single new → ["new-vehicles"]
 * - Single used → ["used-vehicles"]
 * - Single certified → ["used-vehicles", "certified"] (certified ONLY, not used+certified)
 * - used + certified → ["used-vehicles"] (both used and certified)
 * - new + certified → ["used-vehicles", "certified"] with new in query params
 * - new + used → ["used-vehicles"] with new in query params
 * - new + used + certified → ["used-vehicles"] with new in query params
 * 
 * Key rules:
 * 1. /used-vehicles/certified = certified ONLY
 * 2. /used-vehicles = used (which includes certified per business rule)
 * 3. If used-vehicles is in path, new always goes to query params
 * 
 * @returns Object with path segments and conditions to add to query params
 */
function buildConditionPath(conditions?: string[]): { segments: string[]; queryConditions?: string[] } {
	if (!conditions || conditions.length === 0) {
		return { segments: ['used-vehicles'], queryConditions: ['new'] };
	}

	const hasNew = conditions.includes('new');
	const hasUsed = conditions.includes('used');
	const hasCertified = conditions.includes('certified');

	// If used is present, path is always used-vehicles (new goes to query params)
	if (hasUsed) {
		if (hasNew) {
			// new + used (+ optionally certified) → used-vehicles with new in query params
			return { segments: ['used-vehicles'], queryConditions: ['new'] };
		}
		// used only or used + certified → just used-vehicles
		// (business rule: used always includes certified)
		return { segments: ['used-vehicles'] };
	}

	// No used - check for certified
	if (hasCertified) {
		if (hasNew) {
			// new + certified (no used) → used-vehicles/certified with new in query params
			return { segments: ['used-vehicles', 'certified'], queryConditions: ['new'] };
		}
		// certified only → used-vehicles/certified
		return { segments: ['used-vehicles', 'certified'] };
	}

	// Only new
	if (hasNew) {
		return { segments: ['new-vehicles'] };
	}

	// Fallback
	return { segments: ['used-vehicles'] };
}

/**
 * Build query parameters from remaining filters
 */
function buildQueryParams(
	filters: FilterState,
	sortBy?: string,
	order?: 'asc' | 'desc',
	queryConditions?: string[]
): Record<string, string> {
	const params: Record<string, string> = {};

	// Add condition query params if needed (e.g., new+used+certified case)
	if (queryConditions && queryConditions.length > 0) {
		params.condition = queryConditions.join(',');
	}

	// Add remaining make values (beyond first)
	if (filters.make && filters.make.length > 1) {
		const sortedMakes = [...filters.make].sort();
		const additionalMakes = sortedMakes.slice(1); // Skip first (in path)
		if (additionalMakes.length > 0) {
			params.make = additionalMakes.join(',');
		}
	}

	// Add remaining model values (beyond first, or all if no make in path)
	if (filters.model && filters.model.length > 0) {
		if (!filters.make) {
			// No make in path, all models go to query
			const sortedModels = sortSortableArray(filters.model, 'model');
			params.model = sortedModels.join(',');
		} else if (filters.model.length > 1) {
			// Make in path, additional models to query
			const sortedModels = [...filters.model].sort();
			const additionalModels = sortedModels.slice(1);
			if (additionalModels.length > 0) {
				params.model = additionalModels.join(',');
			}
		}
	}

	// Add all other array filters
	const arrayFilters: (keyof FilterState)[] = [
		'year',
		'trim',
		'body',
		'fuel_type',
		'transmission',
		'engine',
		'drive_train',
		'doors',
		'ext_color',
		'int_color',
		'dealer',
		'state',
		'city',
		'key_features',
	];

	for (const key of arrayFilters) {
		const value = filters[key];
		if (Array.isArray(value) && value.length > 0) {
			const sorted = sortSortableArray(value as string[], key);
			params[key] = sorted.join(',');
		}
	}

	// Add range filters
	if (filters.price) {
		if (filters.price.min !== undefined && filters.price.min !== null) {
			params.price_min = String(filters.price.min);
		}
		if (filters.price.max !== undefined && filters.price.max !== null) {
			params.price_max = String(filters.price.max);
		}
		if (filters.price.max_payment !== undefined && filters.price.max_payment !== null) {
			params.monthly_payment = String(filters.price.max_payment);
		}
	}

	if (filters.mileage) {
		if (filters.mileage.min !== undefined && filters.mileage.min !== null) {
			params.mileage_min = String(filters.mileage.min);
		}
		if (filters.mileage.max !== undefined && filters.mileage.max !== null) {
			params.mileage_max = String(filters.mileage.max);
		}
	}

	// Add boolean flags
	if (filters.is_special && filters.is_special.includes(true)) {
		params.is_special = 'true';
	}
	if (filters.is_new_arrival && filters.is_new_arrival.includes(true)) {
		params.is_new_arrival = 'true';
	}
	if (filters.is_in_transit && filters.is_in_transit.includes(true)) {
		params.is_in_transit = 'true';
	}
	if (filters.is_sale_pending && filters.is_sale_pending.includes(true)) {
		params.is_sale_pending = 'true';
	}
	if (filters.is_commercial && filters.is_commercial.includes(true)) {
		params.is_commercial = 'true';
	}

	// Add search
	if (filters.search) {
		params.search = filters.search;
	}

	// Add sorting (only if not default)
	if (sortBy) {
		params.sort_by = sortBy;
	}
	if (order && order !== 'asc') {
		// Only include order if not default ascending
		params.order = order;
	}

	return params;
}



/**
 * Sort array values according to query parameter rules
 * - years: descending
 * - all others: ascending
 */
function sortSortableArray(values: string[], key: string): string[] {
	const sorted = [...values].sort();

	const sortOrder = QUERY_PARAM_SORT_ORDER[key] || DEFAULT_SORT_DIRECTION;

	if (sortOrder === 'desc') {
		return sorted.reverse();
	}

	return sorted;
}

/**
 * Build path string from filters (convenience wrapper)
 */
export function buildPathFromFilters(filters: FilterState): string {
	const { path } = buildUrl(filters);
	return `/${path}/`;
}

/**
 * Get normalized filters without building URL
 * Useful when you just need to normalize filters for state management
 */
export function normalizeFilterState(filters: FilterState): FilterState {
  return normalizeFilters(filters);
}

/**
 * Extract path parameters from filters
 * Returns only condition, make, model
 */
export function extractPathFilters(filters: FilterState): Partial<FilterState> {
	return {
		condition: filters.condition,
		make: filters.make,
		model: filters.model,
	};
}

/**
 * Extract query parameters from filters
 * Returns everything except condition, make, model (primary values)
 */
export function extractQueryFilters(filters: FilterState): Partial<FilterState> {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { condition, make, model, ...rest } = filters;

	// Handle additional make/model values
	const queryFilters: Partial<FilterState> = { ...rest };

	if (make && make.length > 1) {
		queryFilters.make = make.slice(1);
	}

	if (model && model.length > 0 && (!make || model.length > 1)) {
		queryFilters.model = !make ? model : model.slice(1);
	}

	return queryFilters;
}

/**
 * Build URL and get normalized filters
 * Convenience wrapper that returns normalized filters along with URL
 * 
 * @param rawFilters - Raw filter state from UI
 * @param sortBy - Optional sort field
 * @param order - Optional sort order
 * @returns Normalized filters that match the URL, plus the URL structure
 */
export function buildUrlAndNormalizeFilters(
  rawFilters: FilterState,
  sortBy?: string,
  order?: 'asc' | 'desc'
): { filters: FilterState; path: string; queryParams: Record<string, string> } {
  const result = buildUrl(rawFilters, sortBy, order);
  return {
    filters: result.normalizedFilters,
    path: result.path,
    queryParams: result.queryParams,
  };
}
