"use client";

import type { AvailableFilter, SelectedFilter } from "@dealertower/types/api";
import { useSelectedFilters } from "@dealertower/lib/hooks/useSelectedFilters";
import { useUrlState } from "@dealertower/lib/hooks/useUrlState";
import { CircleX } from "lucide-react";

interface ActiveFiltersProps {
  availableFilters: AvailableFilter[];
}

export function ActiveFilters({ availableFilters }: ActiveFiltersProps) {
  const selectedFilters = useSelectedFilters(availableFilters);
  const { toggleArrayFilter, updateFilter } = useUrlState();

  const handleRemoveFilter = (filter: SelectedFilter) => {
    if (filter.type === "select") {
      toggleArrayFilter(filter.name, String(filter.value));
    } else {
      updateFilter(filter.name, null);
    }
  };

  if (selectedFilters.length === 0) {
    return null;
  }

  return (
		<div className="px-4 pb-8 shadow-[0_2px_4px_-2px_rgba(0,0,0,0.1)]">
			<div className="text-sm font-bold text-zinc-700">
				Applied Filters ({selectedFilters.length})
			</div>
			<div className="flex flex-wrap gap-2 items-center mt-4">
        {selectedFilters.map((filter) => {
					const isCertifiedFilter = filter.name === "condition" && filter.value === "certified";
          const hasUsedSelected = selectedFilters.some(
            (f) => f.name === "condition" && f.value === "used"
          );
          const shouldHideRemoveButton = isCertifiedFilter && hasUsedSelected;

          return (
            <span
              key={`${filter.name}-${filter.value}`}
							className="inline-flex items-center gap-[10px] rounded-full bg-[#001333] px-[12px] py-[6px] text-sm font-semibold text-white"
            >
              {filter.label}
              {!shouldHideRemoveButton && (
                <button
                  onClick={() => handleRemoveFilter(filter)}
									className="ml-0 cursor-pointer"
                  aria-label={`Remove ${filter.label}`}
                >
									<span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#B3B9C2]">
										<CircleX className="h-5 w-5 text-[#001333]" />
									</span>
                </button>
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
}

