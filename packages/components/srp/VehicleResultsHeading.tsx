/**
 * Vehicle Results Heading
 * Displays dynamic title: [number] [make] [model] [body style] in [city] [state] at [dealer name]
 * Pulls live counts from ClientSideFilteringContext when available.
 */

"use client";

import { useClientSideFilteringContext } from "@dealertower/lib/context/ClientSideFilteringContext";
import { useClientSideFilters } from "@dealertower/lib/hooks/useClientSideFilters";

interface VehicleResultsHeadingProps {
	initialTotalCount: number;
	displayTitle: string;
	make?: string[];
	model?: string[];
	bodyStyle?: string[];
	city?: string | null;
	state?: string | null;
	dealerName?: string | null;
}

export function VehicleResultsHeading({
	initialTotalCount,
	displayTitle,
	make,
	model,
	bodyStyle,
	city,
	state,
	dealerName,
}: VehicleResultsHeadingProps) {
	const context = useClientSideFilteringContext();
	const totalCount = context?.vehicleData?.data?.counts ?? initialTotalCount;

	// Get current filters from context (may have changed client-side)
	const filters = useClientSideFilters();
	const currentMake = (filters?.make as string[] | undefined) || make || [];
	const currentModel = (filters?.model as string[] | undefined) || model || [];
	const currentBodyStyle = (filters?.body as string[] | undefined) || bodyStyle || [];

	// Helper to capitalize first letter
	const capitalize = (str: string) => {
		return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
	};

	// Build title parts
	const parts: string[] = [totalCount.toString()];

	// Check if we have make, model, or body style
	const hasMake = currentMake.length > 0 && currentMake[0];
	const hasModel = currentModel.length > 0 && currentModel[0];
	const hasBodyStyle = currentBodyStyle.length > 0 && currentBodyStyle[0];

	// Extract "New" or "Used" from displayTitle
	const conditionWord = displayTitle.includes("New") ? "New" : displayTitle.includes("Used") ? "Used" : "";

	// If no make, model, or body style, use full displayTitle (e.g., "New Vehicles")
	if (!hasMake && !hasModel && !hasBodyStyle) {
		parts.push(displayTitle);
	} else {
		// If any filter exists, use only the condition word (e.g., "New") with the filters
		if (conditionWord) {
			parts.push(conditionWord);
		}

		// Add all makes (comma-separated)
		if (hasMake) {
			const makes = currentMake.filter(Boolean).map(m => capitalize(m));
			parts.push(makes.join(", "));
		}

		// Add all models (comma-separated)
		if (hasModel) {
			const models = currentModel.filter(Boolean).map(m => capitalize(m));
			parts.push(models.join(", "));
		}

		// Add all body styles (comma-separated)
		if (hasBodyStyle) {
			const bodyStyles = currentBodyStyle.filter(Boolean).map(b => capitalize(b));
			parts.push(bodyStyles.join(", "));
		}
	}

	// Add location: "in [city] [state]"
	if (city || state) {
		const locationParts: string[] = [];
		if (city) locationParts.push(city);
		if (state) locationParts.push(state);
		if (locationParts.length > 0) {
			parts.push("in", ...locationParts);
		}
	}

	// Add dealer name: "at [dealer name]"
	if (dealerName) {
		parts.push("at", dealerName);
	}

	return (
		<div className="mb-3 ml-4 sm:ml-0">
			<h1 className="ml-4 xl:ml-0 text-2xl font-bold text-zinc-900">
				{parts.join(" ")}
			</h1>
		</div>
	);
}
