/**
 * Filters Wrapper Component (Client Component)
 * Maintains filter state on client side to prevent unnecessary re-renders
 * Only the selected filter values update, not the entire filter structure
 */

"use client";

import type { AvailableFilter, SortingOption } from "@dealertower/types/api";
import { FiltersSidebar } from "./FiltersSidebar";
import { useSelectedFilters } from "@dealertower/lib/hooks/useSelectedFilters";

interface FiltersWrapperProps {
  initialAvailableFilters: AvailableFilter[];
  availableSorting: SortingOption[];
}

/**
 * This wrapper maintains filter state on the client side
 * It updates selected filters based on URL params without requiring
 * a full server-side refetch, preventing the blinking/skeleton effect
 */
export function FiltersWrapper({
  initialAvailableFilters,
  availableSorting,
}: FiltersWrapperProps) {
  const selectedFilters = useSelectedFilters(initialAvailableFilters);

  return (
    <FiltersSidebar
      availableFilters={initialAvailableFilters}
      selectedFilters={selectedFilters}
      availableSorting={availableSorting}
    />
  );
}
