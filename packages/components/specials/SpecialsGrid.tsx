/**
 * Specials Grid Component
 * Displays a responsive grid of vehicle special offer cards
 */

import { cn } from "@dealertower/lib/utils/cn";
import type { SpecialsGridProps } from "@dealertower/types/specials";
import { SpecialCard } from "./SpecialCard";

export function SpecialsGrid({
	specials,
	primaryColor,
	columns = { default: 1, sm: 2, lg: 3, xl: 4 },
	className,
}: SpecialsGridProps) {
	if (!specials || specials.length === 0) {
		return (
			<div className="flex items-center justify-center py-12">
				<p className="text-zinc-500">No special offers available at this time.</p>
			</div>
		);
	}

	// Build responsive grid classes
	const gridClasses = cn(
		"grid gap-4 md:gap-6",
		columns.default === 1 && "grid-cols-1",
		columns.default === 2 && "grid-cols-2",
		columns.default === 3 && "grid-cols-3",
		columns.default === 4 && "grid-cols-4",
		columns.sm && `sm:grid-cols-${columns.sm}`,
		columns.md && `md:grid-cols-${columns.md}`,
		columns.lg && `lg:grid-cols-${columns.lg}`,
		columns.xl && `xl:grid-cols-${columns.xl}`,
		className
	);

	return (
		<div className={gridClasses}>
			{specials.map((special, index) => (
				<SpecialCard
					key={special.id}
					special={special}
					primaryColor={primaryColor}
					priority={index < 4} // Prioritize first 4 images for LCP
				/>
			))}
		</div>
	);
}
