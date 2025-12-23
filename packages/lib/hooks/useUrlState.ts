/**
 * URL State Management Hook
 * Synchronizes filter state with URL search parameters and slug-based paths
 * 
 * When ClientSideFilteringContext is available, uses context-based updates
 * for instant filtering without page reloads. Otherwise falls back to
 * Next.js router navigation.
 */

"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";
import { buildUrl, buildUrlAndNormalizeFilters } from "@dealertower/lib/url/builder";
import { parseSlug } from "@dealertower/lib/url/parser";
import type { FilterState } from "@dealertower/types/filters";
import { useClientSideFilteringContext } from "@dealertower/lib/context/ClientSideFilteringContext";

export function useUrlState() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const context = useClientSideFilteringContext();
  
  // Check if we should use client-side filtering
  const shouldUseClientFiltering = context?.isClientMode ?? false;

  /**
   * Get current filters from both slug and query params
   */
  const getCurrentFilters = useCallback((): FilterState => {
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
        // Handle array filters (including key_features, dealer, state, city, etc.)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        queryFilters[key as keyof FilterState] = value.split(',') as any;
      }
    });

    // Merge: combine conditions from both slug and query params
    const mergedFilters: FilterState = { ...queryFilters };
    
    // Merge conditions from slug and query params
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

  /**
   * Navigate with new filter state
	 * URL is always the source of truth - always updates URL first, then triggers data fetch
   */
  const navigateWithFilters = useCallback(
    (newFilters: FilterState, resetPage = true) => {
      const sortBy = searchParams.get('sort_by') || undefined;
      const order = searchParams.get('order') as 'asc' | 'desc' | undefined;
      
			// Normalize filters and build URL (single source of truth)
			const { filters: normalizedFilters, path, queryParams } = buildUrlAndNormalizeFilters(
				newFilters,
          sortBy,
				order
			);
      
      // Add page param if not resetting
      if (!resetPage) {
        const currentPage = searchParams.get('page');
        if (currentPage) {
          queryParams.page = currentPage;
        }
      }
      
      const queryString = Object.keys(queryParams).length > 0
        ? '?' + new URLSearchParams(queryParams).toString()
        : '';
      
      const fullUrl = `/${path}/${queryString}`;
		
		// Update context first for instant UI feedback, then update URL
		if (shouldUseClientFiltering && context?.updateFiltersClientSide) {
			context.updateFiltersClientSide(normalizedFilters, {
				resetPage,
				sortBy,
				order,
			});
		}
		
		// Update URL after context (URL is still source of truth for SSR/back button)
      router.push(fullUrl, { scroll: false });
    },
    [router, searchParams, shouldUseClientFiltering, context]
  );

  /**
   * Updates a filter parameter
   */
  const updateFilter = useCallback(
    (filterName: string, value: string | string[] | null) => {
      const currentFilters = getCurrentFilters();
      
      // Create a new object to avoid mutation
      const newFilters = { ...currentFilters };
      
      if (value === null || (Array.isArray(value) && value.length === 0)) {
        // Remove filter
        delete newFilters[filterName as keyof FilterState];
      } else if (Array.isArray(value)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        newFilters[filterName as keyof FilterState] = value as any;
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        newFilters[filterName as keyof FilterState] = [value] as any;
      }
      
      navigateWithFilters(newFilters, true);
    },
    [getCurrentFilters, navigateWithFilters]
  );

  /**
   * Toggles a value in an array filter (like checkboxes)
	 * All normalization is handled by buildUrlAndNormalizeFilters
   */
  const toggleArrayFilter = useCallback(
    (filterName: string, value: string) => {
      const currentFilters = getCurrentFilters();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const currentValues = (currentFilters[filterName as keyof FilterState] as any[]) || [];

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let newValues: any[];
      
      // For boolean filters (is_*), convert string "true" to boolean
      const isBooleanFilter = filterName.startsWith('is_');
      const compareValue = isBooleanFilter ? (value === 'true') : value;
      
      if (currentValues.includes(compareValue)) {
        // Removing the value
        newValues = currentValues.filter((v) => v !== compareValue);
      } else {
        // Adding the value
        newValues = [...currentValues, compareValue];
      }

      // Create new filter object to avoid mutation
      const newFilters = { ...currentFilters };
      
      // Update the filter state with the new values
      if (newValues.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        newFilters[filterName as keyof FilterState] = newValues as any;
      } else {
        delete newFilters[filterName as keyof FilterState];
      }

			// Navigate with the modified filters - normalization happens in navigateWithFilters
      navigateWithFilters(newFilters, true);
    },
    [getCurrentFilters, navigateWithFilters]
  );

  /**
   * Updates range filter (min/max)
   */
  const updateRangeFilter = useCallback(
    (filterName: string, min?: number, max?: number) => {
      const currentFilters = getCurrentFilters();
      
      // Create new filter object to avoid mutation
      const newFilters = { ...currentFilters };
      
      if (min !== undefined || max !== undefined) {
        newFilters[filterName as keyof FilterState] = {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ...(currentFilters[filterName as keyof FilterState] as any || {}),
          ...(min !== undefined && { min }),
          ...(max !== undefined && { max }),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any;
      } else {
        delete newFilters[filterName as keyof FilterState];
      }

      navigateWithFilters(newFilters, true);
    },
    [getCurrentFilters, navigateWithFilters]
  );

  /**
   * Clears all filters - returns to base path with all conditions selected
	 * Normalization is handled by buildUrlAndNormalizeFilters
   */
  const clearAllFilters = useCallback(() => {
		// Clear all filters - normalization will handle condition defaults
		const clearedFilters: FilterState = {};
		navigateWithFilters(clearedFilters, true);
  }, [navigateWithFilters]);

  /**
   * Gets current filter values
   */
  const getFilterValue = useCallback(
    (filterName: string): string[] => {
      const filters = getCurrentFilters();
      const value = filters[filterName as keyof FilterState];
      if (Array.isArray(value)) {
        return value.map(v => String(v));
      }
      return [];
    },
    [getCurrentFilters]
  );

  /**
   * Gets current range filter values
   */
  const getRangeFilterValue = useCallback(
    (filterName: string): { min?: number; max?: number } => {
      const filters = getCurrentFilters();
      const value = filters[filterName as keyof FilterState];
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        return value as { min?: number; max?: number };
      }
      return {};
    },
    [getCurrentFilters]
  );

  /**
   * Checks if a specific value is selected for a filter
   */
  const isFilterValueSelected = useCallback(
    (filterName: string, value: string): boolean => {
      const values = getFilterValue(filterName);
      return values.includes(value);
    },
    [getFilterValue]
  );

  /**
   * Updates sorting parameters
   */
  const updateSorting = useCallback(
    (sortValue: string | null) => {
      const currentFilters = getCurrentFilters();
      // Parse sort value to extract field and order
      // Format can be: "price_asc", "price_desc", or just "price" (defaults to asc)
      let sortBy: string | undefined;
      let order: 'asc' | 'desc' | undefined;
      
      if (sortValue) {
        // Check if value ends with _asc or _desc
        if (sortValue.endsWith('_asc')) {
          sortBy = sortValue.slice(0, -4);
          order = 'asc';
        } else if (sortValue.endsWith('_desc')) {
          sortBy = sortValue.slice(0, -5);
          order = 'desc';
        } else {
          // No suffix, use value as-is with default asc order
          sortBy = sortValue;
          order = 'asc';
        }
      }
      
			// Normalize filters and build URL with new sorting
			const { filters: normalizedFilters, path, queryParams } = buildUrlAndNormalizeFilters(
				currentFilters,
				sortBy,
				order
			);
      
			// When changing sort, always reset page to 1 (no page param)
      const queryString = Object.keys(queryParams).length > 0
        ? '?' + new URLSearchParams(queryParams).toString()
        : '';
      
      const fullUrl = `/${path}/${queryString}`;
			
			// Update URL first (URL is source of truth)
      router.push(fullUrl, { scroll: false });
			
			// Trigger client-side fetch if available
			if (shouldUseClientFiltering && context?.updateFiltersClientSide) {
				context.updateFiltersClientSide(normalizedFilters, {
						resetPage: true,
						sortBy,
						order,
					});
				}
    },
		[router, getCurrentFilters, shouldUseClientFiltering, context]
  );

  /**
   * Gets current sorting value
   */
  const getCurrentSorting = useCallback((): string => {
    const sortBy = searchParams.get('sort_by');
    const order = searchParams.get('order');
    
    // If no sortBy, return empty (Best Match)
    if (!sortBy) {
      return '';
    }
		
    
    // If there's an explicit order, use it; otherwise default to 'asc'
    const finalOrder = order || 'asc';
    return `${sortBy}_${finalOrder}`;
  }, [searchParams]);
	

  return {
    updateFilter,
    toggleArrayFilter,
    updateRangeFilter,
    updateSorting,
    clearAllFilters,
    getFilterValue,
    getRangeFilterValue,
    isFilterValueSelected,
    getCurrentFilters,
    getCurrentSorting,
    navigateWithFilters,
  };
}
