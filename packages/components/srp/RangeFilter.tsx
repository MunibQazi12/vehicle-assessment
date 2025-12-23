"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { ChevronDown } from "lucide-react";
import { useUrlState } from "@dealertower/lib/hooks/useUrlState";

interface RangeFilterProps {
	filterName: string;
	minValue: number;
	maxValue: number;
	isExpanded: boolean;
	isPrice?: boolean;
	isMileage?: boolean;
}

export function RangeFilter({
	filterName,
	minValue,
	maxValue,
	isExpanded,
	isPrice = false,
	isMileage = false,
}: RangeFilterProps) {
	const [rangeMin, setRangeMin] = useState<string>("");
	const [rangeMax, setRangeMax] = useState<string>("");
	const rangeDebounceTimerRef = useRef<NodeJS.Timeout | null>(null);
	const { updateRangeFilter, getRangeFilterValue } = useUrlState();

	// Initialize range values from URL state on mount
	useEffect(() => {
		const currentRange = getRangeFilterValue(filterName);
		setRangeMin(currentRange.min?.toString() || "");
		setRangeMax(currentRange.max?.toString() || "");
	}, [filterName, getRangeFilterValue]);
	console.log("rangeMin", maxValue);
	// Debounced update function for range filters (250ms)
	const debouncedUpdateRange = useCallback(
		(min: string, max: string) => {
			// Clear existing timer
			if (rangeDebounceTimerRef.current) {
				clearTimeout(rangeDebounceTimerRef.current);
			}

			// Set new timer
			rangeDebounceTimerRef.current = setTimeout(() => {
				const minValue = min ? Number(min) : undefined;
				const maxValue = max ? Number(max) : undefined;
				updateRangeFilter(filterName, minValue, maxValue);
			}, 250);
		},
		[filterName, updateRangeFilter]
	);

	// Cleanup timer on unmount
	useEffect(() => {
		return () => {
			if (rangeDebounceTimerRef.current) {
				clearTimeout(rangeDebounceTimerRef.current);
			}
		};
	}, []);

	// Price and Mileage filters with special design (histogram + slider)
	if (isPrice || isMileage) {
		const priceFormatter = isPrice
			? new Intl.NumberFormat("en-US", {
				style: "currency",
				currency: "USD",
				minimumFractionDigits: 0,
				maximumFractionDigits: 0,
			})
			: null;

		// Slider config:
		// - Slider step uses 2 so the native grid can include the exact max value
		// - minGap controls how close the handles can get (business rule), independent of slider step
		const sliderStep = isPrice || isMileage ? 2 : 1;
		const minGap = isPrice || isMileage ? 5000 : 1000;

		// Generate options for dropdowns (5k buckets for price/mileage)
		const generateOptions = () => {
			const options: number[] = [];
			const dropdownStep = isPrice || isMileage ? 5000 : 1000;

			for (let value = minValue; value <= maxValue; value += dropdownStep) {
				options.push(value);
			}
			// Add max value if it's not already included
			if (options[options.length - 1] < maxValue) {
				options.push(maxValue);
			}
			return options;
		};

		const dropdownOptions = generateOptions();
		const currentMin = rangeMin ? Number(rangeMin) : minValue;
		const currentMax = rangeMax ? Number(rangeMax) : maxValue;

		// Helper: snap any value to the nearest dropdown bucket so slider and select stay in sync
		const snapToDropdown = (value: number) => {
			const step = isPrice || isMileage ? 5000 : 1000;
			// Work in offset from minValue so buckets align with dropdown options
			const offset = value - minValue;
			if (offset <= 0) return minValue;

			const steps = Math.round(offset / step);
			const snapped = minValue + steps * step;
			// Clamp to [minValue, maxValue]
			return Math.min(Math.max(snapped, minValue), maxValue);
		};

		// Format value for display
		const formatValue = (value: number) => {
			if (isPrice && priceFormatter) {
				return priceFormatter.format(value);
			}
			if (isMileage) {
				return `${value.toLocaleString("en-US")} mi`;
			}
			return value.toLocaleString("en-US");
		};

		// Generate histogram data (mock data for now - can be replaced with real data from API)
		// Histogram always shows the full range from minValue to maxValue (constant)
		// Use useMemo to ensure histogram data is only generated once and remains constant
		const histogramData = useMemo(() => {
			const buckets = 20;
			const data: number[] = [];

			// Generate mock distribution (higher values on left, decreasing to right)
			// Use a deterministic pattern instead of Math.random() to ensure consistency
			for (let i = 0; i < buckets; i++) {
				// Simulate distribution: higher on left, lower on right
				// Using a deterministic formula based on index to ensure constant heights
				const baseHeight = 100 - (i * 4);
				const variation = (i * 7) % 20; // Deterministic variation based on index
				const height = Math.max(10, baseHeight + variation);
				data.push(height);
			}
			return data;
		}, [minValue, maxValue]); // Only regenerate if min/max values change

		const maxHistogramHeight = useMemo(
			() => Math.max(...histogramData),
			[histogramData]
		);

		// Calculate slider positions based on full range (minValue to maxValue)
		const minPercentage = ((currentMin - minValue) / (maxValue - minValue)) * 100;
		const maxPercentage = ((currentMax - minValue) / (maxValue - minValue)) * 100;

		// Handle slider changes (snap to dropdown buckets so slider & select share the same values)
		const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
			const raw = Number(e.target.value);
			// First snap to dropdown bucket
			let snapped = snapToDropdown(raw);
			// Enforce minGap vs currentMax
			const maxAllowed = currentMax - minGap;
			if (snapped > maxAllowed) {
				snapped = snapToDropdown(maxAllowed);
			}

			setRangeMin(snapped.toString());
			// debouncedUpdateRange(next.toString(), rangeMax);
		};

		const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
			const raw = Number(e.target.value);
			// First snap to dropdown bucket
			let snapped = snapToDropdown(raw);
			// Enforce minGap vs currentMin
			const minAllowed = currentMin + minGap;
			if (snapped < minAllowed) {
				snapped = snapToDropdown(minAllowed);
			}

			setRangeMax(snapped.toString());
			// debouncedUpdateRange(rangeMin, next.toString());
		};

		const labelPrefix = isPrice ? "price" : isMileage ? "mileage" : "range";
		const infoText = isPrice
			? "Price range reflects current inventory"
			: isMileage
				? "Mileage range reflects current inventory"
				: "Range reflects current inventory";

		return (
			<div className="space-y-4 px-4 pb-4">
				{/* Dropdown inputs */}
				<div className="space-y-3">
					<div>
						<label className="block text-sm font-medium text-zinc-700 mb-1.5">
							Min {labelPrefix}
						</label>
						<div className="relative">
							<select
								value={rangeMin || minValue}
								onChange={(e) => {
									const newMin = e.target.value;
									setRangeMin(newMin);
									// debouncedUpdateRange(newMin, rangeMax);
								}}
								tabIndex={isExpanded ? 0 : -1}
								className="w-full appearance-none rounded-lg border border-zinc-300 bg-white px-3 py-2.5 pr-8 text-sm text-zinc-900 focus:border-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400"
							>
								{dropdownOptions.map((value) => (
									<option key={value} value={value}>
										{formatValue(value)}
									</option>
								))}
							</select>
							<ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" />
						</div>
					</div>
					<div>
						<label className="block text-sm font-medium text-zinc-700 mb-1.5">
							Max {labelPrefix}
						</label>
						<div className="relative">
							<select
								value={rangeMax || maxValue}
								onChange={(e) => {
									const newMax = e.target.value;
									setRangeMax(newMax);
									// debouncedUpdateRange(rangeMin, newMax);
								}}
								tabIndex={isExpanded ? 0 : -1}
								className="w-full appearance-none rounded-lg border border-zinc-300 bg-white px-3 py-2.5 pr-8 text-sm text-zinc-900 focus:border-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400"
							>
								{dropdownOptions.map((value) => (
									<option key={value} value={value}>
										{value >= maxValue
											? `${formatValue(value)}+`
											: formatValue(value)}
									</option>
								))}
							</select>
							<ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" />
						</div>
					</div>
				</div>

				{/* Informational text */}
				<p className="text-xs text-center text-zinc-500">
					{infoText}
				</p>

				{/* Histogram - always shows full range (minValue to maxValue), constant */}
				<div className="relative h-24 w-full">
					<div className="absolute inset-0 flex items-end justify-between gap-0.5">
						{histogramData.map((height, index) => {
							const barHeight = (height / maxHistogramHeight) * 100;
							// Calculate which bars are in the selected range
							// Histogram always represents full range (minValue to maxValue)
							// Each bar represents a portion of the full range
							const barStartPercentage = (index / histogramData.length) * 100;
							const barEndPercentage = ((index + 1) / histogramData.length) * 100;
							const isInRange =
								(barStartPercentage >= minPercentage && barStartPercentage <= maxPercentage) ||
								(barEndPercentage >= minPercentage && barEndPercentage <= maxPercentage) ||
								(barStartPercentage <= minPercentage && barEndPercentage >= maxPercentage);

							return (
								<div
									key={index}
									className="flex-1 bg-purple-500"
									style={{
										height: `${barHeight}%`,
										opacity: isInRange ? 1 : 0.3,
									}}
								/>
							);
						})}
					</div>
				</div>

				{/* Dual Range Slider Component - EXACT STRUCTURE FROM PROVIDED CODE */}
				<div className="relative w-full h-10 flex items-center">
					{/* Progress Bar Background */}
					<div className="absolute w-full h-1.5 bg-zinc-200 rounded-full" />

					{/* Active Progress Bar Range */}
					<div
						className="absolute h-1.5 bg-purple-500 rounded-full transition-all duration-75"
						style={{
							left: `${((currentMin - minValue) / (maxValue - minValue)) * 100}%`,
							right: `${100 - (((currentMax - minValue) / (maxValue - minValue)) * 100)}%`,
						}}
					/>

					{/* Range Inputs - sliderStep controls granularity, JS clamps to exact maxValue */}
					<input
						type="range"
						min={minValue}
						max={maxValue}
						step={sliderStep}
						value={currentMin}
						onChange={handleMinChange}
						tabIndex={isExpanded ? 0 : -1}
						className="absolute w-full h-2 bg-transparent appearance-none cursor-pointer
						[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-purple-500 [&::-webkit-slider-thumb]:shadow-md 
						[&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-purple-500 [&::-moz-range-thumb]:shadow-md"
					/>
					<input
						type="range"
						min={minValue}
						max={maxValue}
						step={sliderStep}
						value={currentMax}
						onChange={handleMaxChange}
						tabIndex={isExpanded ? 0 : -1}
						className="absolute w-full h-2 bg-transparent appearance-none cursor-pointer
						[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-purple-500 [&::-webkit-slider-thumb]:shadow-md 
						[&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-purple-500 [&::-moz-range-thumb]:shadow-md"
					/>
				</div>
			</div>
		);
	}

	// Default range filter for mileage and other range filters
	const getStepValue = () => {
		if (isMileage) return 500;
		return 1;
	};

	const step = getStepValue();
	const formatPlaceholder = (bound: "min" | "max") => {
		const label = bound === "min" ? "Min" : "Max";
		if (isMileage) return `${label} mi`;
		return label;
	};

	const formatRangeValue = (value: number) => {
		if (isMileage) return `${value.toLocaleString("en-US")} mi`;
		return value.toLocaleString("en-US");
	};

	return (
		<div className="space-y-3 px-4">
			<div className="flex gap-3">
				<input
					type="number"
					placeholder={formatPlaceholder("min")}
					value={rangeMin}
					min={minValue}
					max={maxValue}
					step={step}
					onChange={(e) => {
						const newMin = e.target.value;
						setRangeMin(newMin);
						// debouncedUpdateRange(newMin, rangeMax);
					}}
					tabIndex={isExpanded ? 0 : -1}
					className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400"
				/>
				<input
					type="number"
					placeholder={formatPlaceholder("max")}
					value={rangeMax}
					min={minValue}
					max={maxValue}
					step={step}
					onChange={(e) => {
						const newMax = e.target.value;
						setRangeMax(newMax);
						// debouncedUpdateRange(rangeMin, newMax);
					}}
					tabIndex={isExpanded ? 0 : -1}
					className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400"
				/>
			</div>
			<div className="text-xs text-zinc-500 pb-2">
				Range: {formatRangeValue(minValue)} - {formatRangeValue(maxValue)}
			</div>
		</div>
	);
}

