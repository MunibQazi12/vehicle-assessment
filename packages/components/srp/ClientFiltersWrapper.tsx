/**
 * Client-Side Filters Wrapper
 * 
 * Wraps the filters sidebar and updates it when filterData changes
 * in the ClientSideFilteringContext (during client-side filtering)
 */

"use client";

import { useMemo } from "react";
import { useClientSideFilteringContext } from "@dealertower/lib/context/ClientSideFilteringContext";
import type { AvailableFilter, SelectedFilter } from "@dealertower/types/api";
import { FiltersSidebar } from "./FiltersSidebar";

interface ClientFiltersWrapperProps {
  initialAvailableFilters: AvailableFilter[];
  initialSelectedFilters: SelectedFilter[];
}

export function ClientFiltersWrapper({
  initialAvailableFilters,
  initialSelectedFilters,
}: ClientFiltersWrapperProps) {
  const context = useClientSideFilteringContext();
  
  // Derive filter data from context or fall back to initial values
  const availableFilters = useMemo(() => 
    context?.filterData?.data.available_filters ?? initialAvailableFilters,
    [context?.filterData, initialAvailableFilters]
  );
  
  const selectedFilters = useMemo(() =>
    context?.filterData?.data.selected_filters ?? initialSelectedFilters,
    [context?.filterData, initialSelectedFilters]
  );
  
  return (
    <FiltersSidebar
      availableFilters={availableFilters}
      selectedFilters={selectedFilters}
      availableSorting={[]} // Pass empty array or get from context if needed
    />
  );
}
