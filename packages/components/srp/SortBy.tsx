"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { useUrlState } from "@dealertower/lib/hooks/useUrlState";
import type { SortingOption } from "@dealertower/types/api";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
} from "@dealertower/components/ui";

interface DesktopSortByProps {
	availableSorting: SortingOption[];
}

/**
 * Desktop Sort By component for SRP
 * Mirrors the logic of SortBy.tsx but uses a Shadcn dropdown trigger.
 */
export function DesktopSortBy({ availableSorting }: DesktopSortByProps) {
	const { updateSorting } = useUrlState();
	const searchParams = useSearchParams();

	// Get current sorting from URL
	const sortByParam = searchParams.get("sort_by");
	const orderParam = searchParams.get("order") || "asc";

	// Same expansion logic as SortBy.tsx
	const { options: expandedSortingOptions, titleMap } = useMemo(() => {
		const options: SortingOption[] = [];
		const titleMap = new Map<string, string>();

		availableSorting.forEach((option) => {
			const fieldLabels: Record<
				string,
				{ title: string; asc: string; desc: string }
			> = {
				price: {
					title: "Price",
					asc: "Price (Low to High)",
					desc: "Price (High to Low)",
				},
				mileage: {
					title: "Mileage",
					asc: "Mileage (Low to High)",
					desc: "Mileage (High to Low)",
				},
				year: {
					title: "Year",
					asc: "Year (Low to High)",
					desc: "Year (High to Low)",
				},
				mpg_highway: {
					title: "MPG Highway",
					asc: "MPG Highway (Low to High)",
					desc: "MPG Highway (High to Low)",
				},
				mpg_city: {
					title: "MPG City",
					asc: "MPG City (Low to High)",
					desc: "MPG City (High to Low)",
				},
				make: { title: "Make", asc: "Make (A to Z)", desc: "Make (Z to A)" },
				model: {
					title: "Model",
					asc: "Model (A to Z)",
					desc: "Model (Z to A)",
				},
			};

			const labels = fieldLabels[option.value] || {
				title: option.label,
				asc: `${option.label} (Ascending)`,
				desc: `${option.label} (Descending)`,
			};

			const ascValue = `${option.value}_asc`;
			const descValue = `${option.value}_desc`;

			options.push(
				{ label: labels.asc, value: ascValue },
				{ label: labels.desc, value: descValue }
			);
			titleMap.set(ascValue, labels.title);
			titleMap.set(descValue, labels.title);
		});

		// Add a default "Recommended" option when no explicit sort is selected
		// This acts as an actual selectable option that clears sorting.
		const recommendedOption: SortingOption = {
			label: "Recommended",
			value: "",
		};
		options.unshift(recommendedOption);
		titleMap.set(recommendedOption.value, "Recommended");

		return { options, titleMap };
	}, [availableSorting]);

	const currentSort = sortByParam ? `${sortByParam}_${orderParam}` : "";
	const selectedOption = expandedSortingOptions.find(
		(option) => option.value === currentSort
	);
	const buttonLabel = selectedOption
		? titleMap.get(selectedOption.value) ?? "Recommended"
		: "Recommended";

	const handleSelectSort = (value: string) => {
		updateSorting(value || null);
	};

	if (expandedSortingOptions.length === 0) {
		return null;
	}

	return (
		<div className="flex items-center gap-1 whitespace-nowrap">
			<span className="font-medium text-zinc-700">Sort by</span>
			<DropdownMenu>
				<DropdownMenuTrigger className="inline-flex items-center gap-2 bg-white py-2 font-medium cursor-pointer text-[blue]/90">
					<span className="text-[blue]/90 font-semibold">{buttonLabel}</span>
					<ChevronDown className="h-5 w-5 text-[blue]/90" />
				</DropdownMenuTrigger>
				<DropdownMenuContent
					align="end"
					className="w-60 bg-white border border-zinc-200 shadow-xl rounded-lg"
				>
					{expandedSortingOptions.map((option) => {
						const isActive = currentSort === option.value;
						return (
							<DropdownMenuItem
								key={option.value}
								className={`text-[14px] px-4 py-2 cursor-pointer ${isActive
									? "bg-zinc-100 font-semibold text-zinc-900"
									: "text-zinc-800 hover:bg-zinc-100"
									}`}
								onClick={() => handleSelectSort(option.value)}
							>
								{option.label}
							</DropdownMenuItem>
						);
					})}
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}