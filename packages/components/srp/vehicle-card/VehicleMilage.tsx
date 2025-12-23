import { cn } from "@dealertower/lib/utils/cn";
import { formatMilage } from "@dealertower/lib/utils/formatMileage";

type Props = {
	condition: string | null;
	length_unit?: string;
	className?: string;
	mileage: number | null;
};

function VehicleMilage(props: Props) {
	const { condition, mileage, length_unit, className } = props;

	if (condition === "new" || !mileage) return null;

	// Determine correct unit with proper plural form
	const unit = length_unit === "km" 
		? "km" 
		: mileage === 1 
			? "mile" 
			: "miles";

	// Common wrapper classes
	const baseClasses = cn("vehicle-mileage-root", className);

	return (
		<p
			className={cn(
				"vehicle-mileage-default text-sm text-neutral-700",
				baseClasses
			)}
		>
			{formatMilage(mileage)} {unit}
		</p>
	);
}

export default VehicleMilage;
