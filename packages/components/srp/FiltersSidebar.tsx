/**
 * Filters Sidebar Component (Client Component)
 * Displays available filters with client-side interactivity
 */

"use client";

import type {
	AvailableFilter,
	SelectedFilter,
	SortingOption,
} from "@dealertower/types/api";
import { FilterGroup } from "./FilterGroup";
import { useUrlState } from "@dealertower/lib/hooks/useUrlState";
import { useClientSideFilters } from "@dealertower/lib/hooks/useClientSideFilters";
import { ActiveFilters } from "@dealertower/components/srp/ActiveFilters";
import { memo, useMemo } from "react";

interface FiltersSidebarProps {
	availableFilters: AvailableFilter[];
	selectedFilters: SelectedFilter[];
	availableSorting: SortingOption[];
}

export const FiltersSidebar = memo(function FiltersSidebar({
	availableFilters,
}: FiltersSidebarProps) {
	const { clearAllFilters } = useUrlState();
	const filters = useClientSideFilters();

	// Check if any filters are currently active
	const hasActiveFilters = useMemo(() => {
		return Object.entries(filters).some(([key, value]) => {
			// Skip condition filter as it's always set by the route
			if (key === "condition") return false;
			if (Array.isArray(value)) return value.length > 0;
			if (typeof value === "object" && value !== null) {
				return Object.values(value).some(
					(v) => v !== null && v !== undefined && v !== ""
				);
			}
			return false;
		});
	}, [filters]);

	return (
		<div className="space-y-6 pt-4 pb-2">
			{/* Header */}
			<div className="flex items-center justify-between px-4">
				<h2 className="text-lg font-semibold text-zinc-900">Filters</h2>
				{hasActiveFilters && (
					<button
						onClick={clearAllFilters}
						className="text-sm text-blue-600 hover:text-blue-700 cursor-pointer"
					>
						Clear All
					</button>
				)}
			</div>

			{/* Active Filters */}
			<ActiveFilters availableFilters={availableFilters} />

			{/* Filter Groups */}
			<div className="space-y-6">
				{availableFilters.map((filter) => (
					<FilterGroup key={filter.name} filter={filter} />
				))}
			</div>
		</div>
	);
});
