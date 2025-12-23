/**
 * Offer Value Component
 * Displays the main offer value with appropriate formatting
 * - APR: Shows percentage (e.g., "0%") with duration
 * - Per Month: Shows dollar amount (e.g., "$359/mo") with lease terms
 */

import { cn } from "@dealertower/lib/utils/cn";
import type { OfferValueProps } from "@dealertower/types/specials";

/**
 * Format currency value for display
 */
function formatCurrency(value: number): string {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	}).format(value);
}

export function OfferValue({
	value,
	valueType,
	durationMonths,
	dueAtSigning,
	primaryColor = "#c8102e",
	className,
}: OfferValueProps) {
	const isAPR = valueType === "apr";

	return (
		<div className={cn("flex flex-col", className)}>
			{/* Main Value */}
			<div className="flex items-baseline">
				<span
					className="text-5xl font-bold tracking-tight"
					style={{ color: primaryColor }}
				>
					{isAPR ? `${value}%` : formatCurrency(value)}
				</span>
				{!isAPR && (
					<span className="ml-1 text-lg font-medium text-zinc-600">/mo</span>
				)}
			</div>

			{/* Duration / Terms */}
			<div className="mt-1 text-sm text-zinc-600">
				{isAPR && durationMonths && (
					<span>for {durationMonths} months</span>
				)}
				{!isAPR && durationMonths && (
					<span>
						For {durationMonths} mos
						{dueAtSigning !== undefined && (
							<> | due at signing {formatCurrency(dueAtSigning)}</>
						)}
					</span>
				)}
			</div>
		</div>
	);
}
