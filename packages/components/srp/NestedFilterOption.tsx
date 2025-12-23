/**
 * Nested Filter Option Component
 * Handles model filters with nested trim options
 */

"use client";

import type { FilterValue } from "@dealertower/types/api";
import { useState, memo } from "react";
import { useUrlState } from "@dealertower/lib/hooks/useUrlState";

interface NestedFilterOptionProps {
  filterName: string;
  option: FilterValue;
  isChecked: boolean;
  isDisabled?: boolean;
  isParentExpanded?: boolean;
}

export const NestedFilterOption = memo(function NestedFilterOption({
  filterName,
  option,
  isChecked,
  isDisabled = false,
  isParentExpanded = true,
}: NestedFilterOptionProps) {
  const { toggleArrayFilter, isFilterValueSelected } = useUrlState();
  const [isExpanded, setIsExpanded] = useState(isChecked);

  // Check if this option has nested trims
  const hasTrims = option.trims && option.trims.length > 0;

  // When parent is checked, expand to show trims
  const handleParentToggle = () => {
    toggleArrayFilter(filterName, String(option.value));
    if (!isChecked && hasTrims) {
      setIsExpanded(true);
    }
  };

  const handleExpandToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="space-y-1 mb-0">
      {/* Parent option (e.g., Model) */}
      <div className="flex items-center gap-2 hover:bg-zinc-50">
        <label
          className={`flex items-center gap-3 rounded-md py-[7px] px-2 mb-0 text-sm w-full ${
            isDisabled
              ? "cursor-not-allowed bg-zinc-50 text-zinc-400"
              : "cursor-pointer text-zinc-800 hover:text-zinc-900 "
          }`}
        >
          <input
            type="checkbox"
            checked={isChecked}
            disabled={isDisabled}
            onChange={handleParentToggle}
            tabIndex={isParentExpanded ? 0 : -1}
            className={`h-4 w-4 cursor-pointer rounded border bg-white text-white accent-zinc-900 focus:ring-0 focus:ring-offset-0 disabled:cursor-not-allowed disabled:border-zinc-200 disabled:bg-zinc-100 disabled:accent-zinc-300 ${
              isChecked
                ? "border-zinc-900 bg-zinc-900 text-white"
                : "border-zinc-400"
            }`}
          />
          <span className="flex-1 text-[15px]">{option.label}</span>
          <span className="text-xs text-zinc-500">{option.count}</span>
        </label>

        {/* Expand/Collapse button for nested trims - only show when model is checked */}
        {hasTrims && isChecked && (
          <button
            onClick={handleExpandToggle}
            tabIndex={isParentExpanded ? 0 : -1}
            className="flex h-5 w-5 items-center justify-center rounded hover:bg-zinc-100"
            aria-label={isExpanded ? "Collapse trims" : "Expand trims"}
          >
            <svg
              className={`h-4 w-4 text-zinc-500 transition-transform ${
                isExpanded ? "rotate-90" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Nested trim options - only show when model is checked */}
      {hasTrims && isChecked && isExpanded && (
        <div className="ml-2 space-y-1 pl-2">
          {option.trims!.map((trim) => {
            const isTrimChecked = isFilterValueSelected(
              "trim",
              String(trim.value)
            );

            return (
              <label
                key={String(trim.value)}
                className={`flex items-center gap-3 rounded-md py-[7px] px-2 mb-0 text-sm w-full ${
                  isDisabled
                    ? "cursor-not-allowed bg-zinc-50 text-zinc-400"
                    : "cursor-pointer text-zinc-800 hover:text-zinc-900 hover:bg-zinc-50"
                }`}
              >
                <input
                  type="checkbox"
                  checked={isTrimChecked}
                  onChange={() => toggleArrayFilter("trim", String(trim.value))}
                  tabIndex={isParentExpanded ? 0 : -1}
                  className={`h-4 w-4 cursor-pointer rounded border bg-white text-white accent-zinc-900 focus:ring-0 focus:ring-offset-0 disabled:cursor-not-allowed disabled:border-zinc-200 disabled:bg-zinc-100 disabled:accent-zinc-300 ${
                    isTrimChecked
                      ? "border-zinc-900 bg-zinc-900 text-white"
                      : "border-zinc-400"
                  }`}
                />
                <span className="flex-1 text-[15px]">{trim.label}</span>
                <span className="text-xs text-zinc-400">{trim.count}</span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
});
