"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { parseSlug } from "@dealertower/lib/url/parser";
import type { AvailableFilter, SelectedFilter } from "@dealertower/types/api";

export function useSelectedFilters(initialAvailableFilters: AvailableFilter[]): SelectedFilter[] {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  return useMemo(() => {
    const filters: SelectedFilter[] = [];

    // Track which values we've already added to avoid duplicates
    const addedValues = new Set<string>();

    // Parse slug from pathname to get slug-based filters (condition, make, model)
    const slugParts = pathname.split('/').filter(part => part.length > 0);
    const { filters: slugFilters } = parseSlug(slugParts);

    // Add slug-based filters first (condition, make, model from path)
    if (slugFilters.condition) {
      const conditionFilter = initialAvailableFilters.find(f => f.name === 'condition');
      if (conditionFilter && conditionFilter.type === 'select') {
        slugFilters.condition.forEach(val => {
          const key = `condition-${val}`;
          if (!addedValues.has(key)) {
            const option = Array.isArray(conditionFilter.value)
              ? conditionFilter.value.find(opt => typeof opt === 'object' && opt.value === val)
              : null;
            // Only add filter if we found a valid label
            if (option && typeof option === 'object' && option.label) {
              addedValues.add(key);
              filters.push({
                name: 'condition',
                label: option.label,
                value: val,
                type: 'select',
              });
            }
          }
        });
      }
    }

    if (slugFilters.make) {
      const makeFilter = initialAvailableFilters.find(f => f.name === 'make');
      if (makeFilter && makeFilter.type === 'select') {
        slugFilters.make.forEach(val => {
          const key = `make-${val}`;
          if (!addedValues.has(key)) {
            const option = Array.isArray(makeFilter.value)
              ? makeFilter.value.find(opt => typeof opt === 'object' && opt.value === val)
              : null;
            // Only add filter if we found a valid label
            if (option && typeof option === 'object' && option.label) {
              addedValues.add(key);
              filters.push({
                name: 'make',
                label: option.label,
                value: val,
                type: 'select',
              });
            }
          }
        });
      }
    }

    if (slugFilters.model) {
      const modelFilter = initialAvailableFilters.find(f => f.name === 'model');
      if (modelFilter && modelFilter.type === 'select') {
        slugFilters.model.forEach(val => {
          const key = `model-${val}`;
          if (!addedValues.has(key)) {
            const option = Array.isArray(modelFilter.value)
              ? modelFilter.value.find(opt => typeof opt === 'object' && opt.value === val)
              : null;
            // Only add filter if we found a valid label
            if (option && typeof option === 'object' && option.label) {
              addedValues.add(key);
              filters.push({
                name: 'model',
                label: option.label,
                value: val,
                type: 'select',
              });
            }
          }
        });
      }
    }

    // Parse all search params to build selected filters
    searchParams.forEach((value, key) => {
      if (key === 'page' || key === 'sort_by' || key === 'order') {
        // Skip pagination and sorting params
        return;
      }

      if (key.endsWith('_min') || key.endsWith('_max')) {
        // Skip range components, we'll handle them separately
        return;
      }

      if (key.startsWith('is_')) {
        // Boolean filter
        if (value === 'true') {
          const filter = initialAvailableFilters.find(f => f.name === key);
          if (filter) {
            filters.push({
              name: key,
              label: filter.label,
              value: true,
              type: 'switch',
            });
          }
        }
        return;
      }

      // Handle range filters (price, mileage)
      const minKey = `${key}_min`;
      const maxKey = `${key}_max`;
      const hasMin = searchParams.has(minKey);
      const hasMax = searchParams.has(maxKey);

      if (hasMin || hasMax) {
        const filter = initialAvailableFilters.find(f => f.name === key);
        if (filter && filter.type === 'number') {
          filters.push({
            name: key,
            label: filter.label,
            value: {
              ...(hasMin && { min: Number(searchParams.get(minKey)) }),
              ...(hasMax && { max: Number(searchParams.get(maxKey)) }),
            },
            type: 'number',
          });
        }
        return;
      }

      // Handle select filters (arrays)
      const values = value.split(',');
      const filter = initialAvailableFilters.find(f => f.name === key);

      if (filter && filter.type === 'select') {
        values.forEach(val => {
          // Check if we already added this value from slug
          const trackingKey = `${key}-${val}`;
          if (!addedValues.has(trackingKey)) {
            // Find the label for this value from available filters
            const option = Array.isArray(filter.value)
              ? filter.value.find(opt => typeof opt === 'object' && opt.value === val)
              : null;

            // Only add filter if we found a valid label
            if (option && typeof option === 'object' && option.label) {
              addedValues.add(trackingKey);
              filters.push({
                name: key,
                label: option.label,
                value: val,
                type: 'select',
              });
            }
          }
        });
      }
    });

    // Sort filters according to requirements:
    // 1. Condition filters first (new, used, certified in that order)
    // 2. Make filters second (alphabetically)
    // 3. All other filters
    const sortedFilters = filters.sort((a, b) => {
      // Priority order for filter names
      const filterPriority: Record<string, number> = {
        condition: 1,
        make: 2,
        // All other filters get priority 3
      };

      const aPriority = filterPriority[a.name] || 3;
      const bPriority = filterPriority[b.name] || 3;

      // Different filter types - sort by priority
      if (aPriority !== bPriority) {
        return aPriority - bPriority;
      }

      // Same filter type
      if (a.name === 'condition' && b.name === 'condition') {
        // Condition values: new -> used -> certified
        const conditionOrder: Record<string, number> = {
          new: 1,
          used: 2,
          certified: 3,
        };
        const aOrder = conditionOrder[String(a.value)] || 999;
        const bOrder = conditionOrder[String(b.value)] || 999;
        return aOrder - bOrder;
      }

      if (a.name === 'make' && b.name === 'make') {
        // Make values: sort alphabetically
        return String(a.label).localeCompare(String(b.label));
      }

      if (a.name === 'year' && b.name === 'year') {
        // Year values: sort Z-A (descending, newest first)
        return String(b.label).localeCompare(String(a.label));
      }

      // For all other filters of the same type, sort A-Z
      if (a.name === b.name) {
        return String(a.label).localeCompare(String(b.label));
      }

      // Different filter types within same priority - maintain order
      return 0;
    });

    return sortedFilters;
  }, [searchParams, pathname, initialAvailableFilters]);
}
