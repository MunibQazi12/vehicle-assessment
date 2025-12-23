/**
 * Filter Group Component (Client Component)
 * Renders individual filter controls based on filter type
 *
 * Updated to use client-side filtering hooks for instant filter updates
 */

"use client";

import type { AvailableFilter } from "@dealertower/types/api";
import { useState, memo, useMemo, useEffect } from "react";
import {
	useFilterValues,
} from "@dealertower/lib/hooks/useClientSideFilters";
import { useUrlState } from "@dealertower/lib/hooks/useUrlState";
import { NestedFilterOption } from "./NestedFilterOption";
import { BODY_STYLE_ICONS } from "./constants/cars";
import { RangeFilter } from "./RangeFilter";

function getBodyStyleIcon(value: string | number | boolean) {
	const normalized = String(value).toLowerCase();

	const key = normalized as keyof typeof BODY_STYLE_ICONS;
	return BODY_STYLE_ICONS[key] ?? BODY_STYLE_ICONS["sedan"];
}

interface FilterGroupProps {
	filter: AvailableFilter;
}

export const FilterGroup = memo(function FilterGroup({
	filter,
}: FilterGroupProps) {
	const EXPANSION_KEY = "srp_filter_expansion";

	// Initialize to false for consistent SSR, then sync with localStorage after hydration
	const [isExpanded, setIsExpanded] = useState<boolean>(false);
	const [isHydrated, setIsHydrated] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
	const [showAll, setShowAll] = useState(false);

	// Hydrate expansion state from localStorage after initial render
	useEffect(() => {
		if (typeof window === "undefined") return;
		const raw = window.localStorage.getItem(EXPANSION_KEY);
		try {
			const stored = raw ? (JSON.parse(raw) as Record<string, boolean>) : {};
			const savedState = stored[filter.name] ?? false;
			setIsExpanded(savedState);
		} catch {
			// Keep default false state
		}
		setIsHydrated(true);
	}, [EXPANSION_KEY, filter.name]);

	const { toggleArrayFilter, getRangeFilterValue } = useUrlState();

	// Use client-side filter hooks for reading filter state
	const conditionValues = useFilterValues("condition");
	const currentFilterValues = useFilterValues(
		filter.name as keyof import("@dealertower/types/filters").FilterState
	);

	// Debounce search query with 200ms delay
	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedSearchQuery(searchQuery);
		}, 200);

		return () => clearTimeout(timer);
	}, [searchQuery]);

	// For condition filter, check if 'used' is selected (which means certified should be disabled)
	const isConditionFilter = filter.name === "condition";
	const hasUsedSelected = isConditionFilter && conditionValues.includes("used");

	// Persist expansion state so it survives data refreshes/navigation
	useEffect(() => {
		// Skip if not yet hydrated or during SSR
		if (!isHydrated || typeof window === "undefined") return;

		const raw = window.localStorage.getItem(EXPANSION_KEY);
		let stored: Record<string, boolean> = {};
		try {
			stored = raw ? JSON.parse(raw) : {};
		} catch {
			stored = {};
		}
		if (stored[filter.name] === isExpanded) return;
		window.localStorage.setItem(
			EXPANSION_KEY,
			JSON.stringify({ ...stored, [filter.name]: isExpanded })
		);
	}, [EXPANSION_KEY, filter.name, isExpanded, isHydrated]);


	// For switch filters, memoize the checked state
	const isSwitchChecked = useMemo(() => {
		if (filter.type === "switch") {
			return currentFilterValues.length > 0 && currentFilterValues[0] === true;
		}
		return false;
	}, [filter.type, currentFilterValues]);

	const selectedCount = useMemo(() => {
		if (filter.type === "select") {
			return currentFilterValues.length;
		}
		if (filter.type === "number") {
			const { min, max } = getRangeFilterValue(filter.name);
			return (min ? 1 : 0) + (max ? 1 : 0);
		}
		return 0;
	}, [filter.type, currentFilterValues, getRangeFilterValue, filter.name]);

	const isColorFilter =
		filter.name === "ext_color" || filter.name === "int_color";
	const isBodyFilter = filter.name === "body";

	return (
		<div className="space-y-3 border-b border-zinc-200 mb-0 last:border-0">
			{filter.type === "switch" ? (
				// Switch filter: no expand/collapse, just toggle with label
				<label className="flex cursor-pointer items-center justify-between px-4 py-3.5">
					<span className="text-base font-normal text-zinc-900">
						{filter.label}
					</span>
					<button
						type="button"
						role="switch"
						aria-checked={isSwitchChecked}
						onClick={() => toggleArrayFilter(filter.name, "true")}
						className={`relative inline-flex h-6 w-11 items-center rounded-full border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-zinc-900/50 focus:ring-offset-1 cursor-pointer ${isSwitchChecked
							? "border-zinc-800 bg-white"
							: "border-zinc-300 bg-zinc-100"
							}`}
					>
						<span
							className={`pointer-events-none inline-block h-5 w-5 transform rounded-full shadow ring-0 transition duration-200 ease-in-out ${isSwitchChecked
								? "translate-x-5 bg-zinc-900"
								: "translate-x-0 bg-white"
								}`}
						/>
					</button>
				</label>
			) : (
				<>
					{/* Filter Header */}
					<button
						aria-expanded={isExpanded}
						onClick={() => setIsExpanded(!isExpanded)}
						className="flex w-full cursor-pointer items-center justify-between gap-3 px-4 py-3.5 m-0 transition-colors duration-150 ease-in-out hover:bg-zinc-50"
					>
						<span className="flex items-center gap-2">
							<svg
								className={`h-5 w-5 text-zinc-700 transition-transform ${isExpanded ? "rotate-180" : ""
									}`}
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M19 9l-7 7-7-7"
								/>
							</svg>
							<span className="text-base font-normal text-zinc-900">
								{filter.label}
							</span>
						</span>
						{selectedCount > 0 && (
							<span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-zinc-900 px-2 text-xs font-semibold text-white">
								{selectedCount}
							</span>
						)}
					</button>

					<div
						aria-hidden={!isExpanded}
						className={`overflow-hidden transition-all duration-200 ease-in-out ${isExpanded
							? "max-h-[2000px] opacity-100"
							: "max-h-0 opacity-0 pointer-events-none"
							}`}
					>
						<div className="space-y-2">{renderFilterContent()}</div>
					</div>
				</>
			)}
		</div>
	);

	function renderFilterContent() {
		if (filter.type === "select" && Array.isArray(filter.value)) {
			const shouldShowSearch = filter.value.length > 10;
			const threshold = 7;

			return (
				<div className="space-y-3">
					{shouldShowSearch && (
						<div className="relative px-4">
							<input
								type="text"
								placeholder="Search Items"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								tabIndex={isExpanded ? 0 : -1}
								className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 pr-10 text-sm font-semibold text-zinc-700 placeholder:font-semibold placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-0"
							/>
							<svg
								className="pointer-events-none absolute right-5 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
								/>
							</svg>
						</div>
					)}
					<div className="space-y-2 px-4 pb-1">
						{renderSelectOptions()}
						{filter.value.length >= threshold &&
							!debouncedSearchQuery &&
							(showAll ? (
								<button
									onClick={() => setShowAll(false)}
									tabIndex={isExpanded ? 0 : -1}
									className="flex w-full items-center gap-2 py-2 text-sm font-normal cursor-pointer text-red-600 hover:text-red-700"
								>
									<span className="text-lg leading-none ps-2">−</span>
									<span>Show Less</span>
								</button>
							) : (
								<button
									onClick={() => setShowAll(true)}
									tabIndex={isExpanded ? 0 : -1}
									className="flex w-full items-center gap-2 py-2 text-sm font-normal cursor-pointer text-red-600 hover:text-red-700"
								>
									<span className="text-lg leading-none ps-2">+</span>
									<span>See More</span>
								</button>
							))}
					</div>
				</div>
			);
		}

		if (
			filter.type === "number" &&
			Array.isArray(filter.value) &&
			filter.value.length === 2
		) {
			return renderRangeInputs();
		}

		return null;
	}

	function renderSelectOptions() {
		if (!Array.isArray(filter.value)) return null;
		const threshold = 7;

		// Check if this is the model filter with nested trims
		const isModelFilter = filter.name === "model";
		const hasAnyTrims =
			isModelFilter &&
			filter.value.some(
				(opt) => typeof opt !== "number" && opt.trims && opt.trims.length > 0
			);

		// Normalize search query: lowercase and remove special characters/spaces for flexible matching
		const normalizeString = (str: string) =>
			str.toLowerCase().replace(/[^a-z0-9]/g, "");

		// Filter options based on debounced search query
		const filteredOptions = debouncedSearchQuery
			? filter.value.filter((option) => {
				if (typeof option === "number") return false;
				const normalizedLabel = normalizeString(option.label);
				const normalizedQuery = normalizeString(debouncedSearchQuery);
				return normalizedLabel.includes(normalizedQuery);
			})
			: filter.value;

		// Limit to first items if filter has >= threshold and showAll is false and no search active
		const hasMoreThanThreshold = filter.value.length >= threshold;
		const displayOptions =
			hasMoreThanThreshold && !showAll && !debouncedSearchQuery
				? filteredOptions.slice(0, threshold - 1)
				: filteredOptions;

		// Show "no results" message if search is active and no options match
		if (debouncedSearchQuery && filteredOptions.length === 0) {
			return (
				<div className="py-2 text-center text-sm text-zinc-500">
					No results found
				</div>
			);
		}

		return displayOptions.map((option) => {
			if (typeof option === "number") return null;
			// Check if this option value is selected
			const isChecked = currentFilterValues.includes(String(option.value));
			const swatchColor =
				typeof option.value === "string"
					? option.value
					: typeof option.label === "string"
						? option.label
						: undefined;

			// Disable certified checkbox if used is selected (used always includes certified)
			const isCertifiedOption =
				isConditionFilter && String(option.value) === "certified";
			const isDisabled = isCertifiedOption && hasUsedSelected;

			if (isBodyFilter) {
				const BodyIcon = getBodyStyleIcon(option.value);

				const iconColor = isDisabled ? "black" : isChecked ? "white" : "black";

				const countColorClass = isDisabled
					? "text-zinc-400"
					: isChecked
						? "text-zinc-50"
						: "text-zinc-500";

				return (
					<button
						type="button"
						key={String(option.value)}
						onClick={() => toggleArrayFilter(filter.name, String(option.value))}
						tabIndex={isExpanded ? 0 : -1}
						className={`flex w-full items-center h-14 gap-3 rounded-md border-2 px-1 mb-1 text-left text-sm transition cursor-pointer ${isDisabled
							? "cursor-not-allowed border-zinc-200 bg-zinc-50 text-zinc-400"
							: isChecked
								? "border-zinc-900 bg-zinc-900 text-zinc-50"
								: "border-transparent text-zinc-800 hover:border-zinc-900 hover:bg-zinc-50"
							}`}
						aria-pressed={isChecked}
						disabled={isDisabled}
					>
						<div className="scale-75">
							<span className="flex items-center justify-center rounded-md">
								<BodyIcon fill={iconColor} />
							</span>
						</div>
						<span className="flex-1 text-[15px]">{option.label}</span>
						<span className={`text-xs font-medium ${countColorClass}`}>
							{option.count}
						</span>
					</button>
				);
			}

			if (isColorFilter) {
				return (
					<button
						type="button"
						key={String(option.value)}
						onClick={() => toggleArrayFilter(filter.name, String(option.value))}
						tabIndex={isExpanded ? 0 : -1}
						className={`flex w-full items-center gap-3 rounded-md px-2 py-2 text-left transition ${isDisabled
							? "cursor-not-allowed bg-white text-zinc-400"
							: "cursor-pointer hover:bg-zinc-100"
							} ${isChecked ? "bg-zinc-100 border border-zinc-200" : ""}`}
						disabled={isDisabled}
					>
						<span
							className="relative flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 shadow-sm"
							style={{ backgroundColor: swatchColor }}
						>
							{isChecked && (
								<span className="flex h-6 w-6 items-center justify-center rounded-full bg-black/70">
									<svg
										className="h-3.5 w-3.5 text-white"
										viewBox="0 0 20 20"
										fill="none"
										stroke="currentColor"
										strokeWidth={2}
									>
										<path
											d="M6 10l2 2 6-6"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
									</svg>
								</span>
							)}
						</span>
						<span className={"flex-1 text-[15px]"}>{option.label}</span>
						<span className="text-xs font-normal text-zinc-400">
							{option.count}
						</span>
					</button>
				);
			}

			// Use nested component if this option has trims
			if (hasAnyTrims && option.trims && option.trims.length > 0) {
				return (
					<NestedFilterOption
						key={String(option.value)}
						filterName={filter.name}
						option={option}
						isChecked={isChecked}
						isDisabled={isDisabled}
						isParentExpanded={isExpanded}
					/>
				);
			}

			// Regular checkbox for options without trims
			return (
				<label
					key={String(option.value)}
					className={`flex items-center gap-3 rounded-md py-[7px] px-2 mb-0 text-sm ${isDisabled
						? "cursor-not-allowed bg-zinc-50 text-zinc-400"
						: "cursor-pointer text-zinc-800 hover:text-zinc-900 hover:bg-zinc-50"
						}`}
				>
					<input
						type="checkbox"
						checked={isChecked}
						disabled={isDisabled}
						onChange={() =>
							toggleArrayFilter(filter.name, String(option.value))
						}
						tabIndex={isExpanded ? 0 : -1}
						className={`h-4 w-4 cursor-pointer rounded border bg-white text-white accent-zinc-900 focus:ring-0 focus:ring-offset-0 disabled:cursor-not-allowed disabled:border-zinc-200 disabled:bg-zinc-100 disabled:accent-zinc-300 ${isChecked
							? "border-zinc-900 bg-zinc-900 text-white"
							: "border-zinc-400"
							}`}
					/>
					<span className={"flex-1 text-[15px] "}>{option.label}</span>
					<span className="text-xs font-medium text-zinc-400">
						{option.count}
					</span>
				</label>
			);
		});
	}

	function renderRangeInputs() {
		if (!Array.isArray(filter.value) || filter.value.length !== 2) return null;

		const minValue = typeof filter.value[0] === "number" ? filter.value[0] : 0;
		const maxValue = typeof filter.value[1] === "number" ? filter.value[1] : 100000;
		const isPriceRange = filter.name === "price";
		const isMileageRange = filter.name === "mileage";

		return (
			<RangeFilter
				filterName={filter.name}
				minValue={minValue}
				maxValue={maxValue}
				isExpanded={isExpanded}
				isPrice={isPriceRange}
				isMileage={isMileageRange}
			/>
		);
	}
});
