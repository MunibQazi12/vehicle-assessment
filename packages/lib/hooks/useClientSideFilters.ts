/**
 * Client-Side Filter State Hooks
 * 
 * Provides hooks for accessing filter state during client-side filtering.
 * These hooks serve as the single source of truth for filter state in UI components.
 * 
 * When to use these hooks:
 * - In filter components (checkboxes, dropdowns, etc.)
 * - In active filters displays
 * - In any component that needs to know current filter state
 * 
 * How it works:
 * - During client-side filtering: reads from ClientSideFilteringContext
 * - During SSR/initial load: falls back to parsing URL with usePathname/useSearchParams
 * 
 * This dual-state approach ensures:
 * - Instant UI feedback during filter changes (no waiting for URL)
 * - SSR compatibility (URL is source of truth on server)
 * - Back/forward button support (URL changes update context)
 */

"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { useClientSideFilteringContext } from "@dealertower/lib/context/ClientSideFilteringContext";
import { parseSlug } from "@dealertower/lib/url/parser";
import type { FilterState } from "@dealertower/types/filters";

/**
 * Get current filter state
 * 
 * This is the PRIMARY hook for accessing filter state in components.
 * 
 * Priority:
 * 1. If in client mode with active filtering → return context.currentFilters
 * 2. Otherwise → parse and return filters from URL
 * 
 * @returns Current filter state object
 * 
 * @example
 * ```tsx
 * function MyFilterComponent() {
 *   const filters = useClientSideFilters();
 *   const selectedMakes = filters.make || [];
 *   // ...
 * }
 * ```
 */
export function useClientSideFilters(): FilterState {
	const context = useClientSideFilteringContext();
	const pathname = usePathname();
	const searchParams = useSearchParams();
  
  	// Memoize URL-based filters (fallback)
  	const urlFilters = useMemo(() => {
		// Parse slug from pathname
		const slugParts = pathname.split('/').filter(part => part.length > 0);
		const { filters: slugFilters } = parseSlug(slugParts);

		// Parse query params
		const queryFilters: FilterState = {};
	
		searchParams.forEach((value, key) => {
			if (key.endsWith('_min') || key.endsWith('_max')) {
				// Handle range filters
				const filterName = key.replace(/_min|_max$/, '') as keyof FilterState;
				if (!queryFilters[filterName]) {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				queryFilters[filterName] = {} as any;
				}
				const rangeKey = key.endsWith('_min') ? 'min' : 'max';
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				(queryFilters[filterName] as any)[rangeKey] = Number(value);
			} else if (key.startsWith('is_')) {
				// Handle boolean filters
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				queryFilters[key as keyof FilterState] = [value === 'true'] as any;
			} else if (key === 'search') {
				// Handle search
				queryFilters.search = value;
			} else if (key !== 'page' && key !== 'sort_by' && key !== 'order') {
				// Handle array filters
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				queryFilters[key as keyof FilterState] = value.split(',') as any;
			}
		});
    
		// Merge filters
		const mergedFilters: FilterState = { ...queryFilters };
		
		// Merge conditions
		if (slugFilters.condition || queryFilters.condition) {
		const slugConditions = slugFilters.condition || [];
		const queryConditions = (queryFilters.condition || []) as string[];
		const allConditions = [...new Set([...slugConditions, ...queryConditions])];
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		mergedFilters.condition = allConditions as any;
		}
    
    	// Merge makes
		if (slugFilters.make) {
			mergedFilters.make = [
				...slugFilters.make,
				...(queryFilters.make || []).filter(m => !slugFilters.make?.includes(m))
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
			] as any;
		}
    
    	// Merge models
		if (slugFilters.model) {
			mergedFilters.model = [
				...slugFilters.model,
				...(queryFilters.model || []).filter(m => !slugFilters.model?.includes(m))
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
			] as any;
		}
    
    	return mergedFilters;
  	}, [pathname, searchParams]);
  
	// Always return URL filters - URL is the single source of truth
	// Context is only used for data caching, not filter state
	return urlFilters;
}

/**
 * Check if a specific filter value is selected
 * 
 * Convenience hook for checking individual filter selections.
 * Commonly used in checkbox/radio components.
 * 
 * @param filterKey - The filter name (e.g., 'make', 'condition')
 * @param value - The value to check (e.g., 'toyota', 'new')
 * @returns True if the value is selected for this filter
 * 
 * @example
 * ```tsx
 * function MakeCheckbox({ make }: { make: string }) {
 *   const isSelected = useIsFilterSelected('make', make);
 *   return <input type="checkbox" checked={isSelected} />;
 * }
 * ```
 */
export function useIsFilterSelected(
	filterKey: keyof FilterState,
	value: string | number | boolean
): boolean {
	const filters = useClientSideFilters();

	return useMemo(() => {
		const filterValue = filters[filterKey];

		// Handle undefined/null
		if (filterValue === undefined || filterValue === null) {
			return false;
		}

		// Handle array filters (most common case)
		if (Array.isArray(filterValue)) {
			return filterValue.includes(value as never);
		}

		// Handle range filters
		if (typeof filterValue === 'object' && !Array.isArray(filterValue)) {
			// For range filters, we'd need to check if value is within range
			// This is a simplified check - adjust based on your needs
			return false;
		}

		// Handle direct value comparison
		return filterValue === value;
	}, [filters, filterKey, value]);
}

/**
 * Get all selected values for a specific filter
 * 
 * Returns an array of selected values for array-based filters.
 * Always returns an array (empty if nothing selected).
 * 
 * @param filterKey - The filter name (e.g., 'make', 'condition')
 * @returns Array of selected values
 * 
 * @example
 * ```tsx
 * function SelectedMakes() {
 *   const makes = useFilterValues('make');
 *   return <div>Selected: {makes.join(', ')}</div>;
 * }
 * ```
 */
export function useFilterValues(
	filterKey: keyof FilterState
): (string | number | boolean)[] {
	const filters = useClientSideFilters();

	return useMemo(() => {
		const filterValue = filters[filterKey];

		// Return empty array if undefined/null
		if (filterValue === undefined || filterValue === null) {
			return [];
		}

		// Return as-is if already an array
		if (Array.isArray(filterValue)) {
			return filterValue;
		}

		// For range or object filters, return empty array
		// (these aren't typically used with useFilterValues)
		if (typeof filterValue === 'object') {
			return [];
		}

		// Wrap single value in array
		return [filterValue];
	}, [filters, filterKey]);
}
