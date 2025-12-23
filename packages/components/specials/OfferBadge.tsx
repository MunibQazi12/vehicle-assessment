/**
 * Offer Badge Component
 * Displays the offer type (Finance/Lease) and value type label (APR/Per Month)
 */

import { cn } from "@dealertower/lib/utils/cn";
import type { OfferBadgeProps } from "@dealertower/types/specials";

export function OfferBadge({ type, valueTypeLabel, className }: OfferBadgeProps) {
	const typeLabel = type === "finance" ? "Finance" : "Lease";

	return (
		<div className={cn("flex items-center gap-2", className)}>
			{/* Type Badge */}
			<span className="inline-flex items-center rounded bg-zinc-800 px-2 py-0.5 text-xs font-medium text-white">
				{typeLabel}
			</span>

			{/* Value Type Label */}
			<span className="text-sm font-semibold text-zinc-900">
				{valueTypeLabel}
			</span>
		</div>
	);
}
