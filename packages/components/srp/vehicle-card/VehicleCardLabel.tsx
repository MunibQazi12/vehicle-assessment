import { cn } from "@dealertower/lib/utils/cn";
import type { SRPVehicle, VehicleTag } from "@dealertower/types/api";

type VehicleCardLabelProps = {
	vehicle: Pick<
		SRPVehicle,
		"is_special" | "is_new_arrival" | "is_in_transit" | "tag"
	>;
	primaryColor?: string;
};

type LabelConfig = {
	key: "is_special" | "is_new_arrival" | "is_in_transit";
	text: string;
	className?: string;
};

const LABELS_CONFIG: LabelConfig[] = [
	{
		key: "is_special" as const,
		text: "Special",
	},
	{
		key: "is_new_arrival" as const,
		text: "New Arrival",
		className: "bg-blue-500",
	},
	{
		key: "is_in_transit" as const,
		text: "In Transit",
		className: "bg-yellow-500",
	},
];

function getTopLabel(tagList: VehicleTag[] | null | undefined) {
	if (!tagList?.length) {
		return null;
	}

	return tagList.find((tag) => {
		const tagType = (tag as VehicleTag & { tag_type?: string }).tag_type;
		return (tagType ?? tag.type) === "top_label";
	});
}

export function VehicleCardLabel({ vehicle, primaryColor }: VehicleCardLabelProps) {
	const labelsToRender = LABELS_CONFIG.filter((label) => vehicle[label.key]);
	const topLabelTag = getTopLabel(vehicle.tag);
	const hasBadges = labelsToRender.length > 0;
	const dealerPrimaryColor = primaryColor ?? primaryColor;

	const badgesTopStyle = topLabelTag ? "top-8" : "top-0";

	if (!hasBadges && !topLabelTag) {
		return null;
	}

	return (
		<div className='z-10 flex flex-col gap-2 px-2 pt-2'>
			{topLabelTag ? (
				<span
					className='absolute left-0 top-0 z-2 w-full rounded-t-lg py-1 text-center '
					style={{
						backgroundColor: topLabelTag.tag_background || undefined,
						color: topLabelTag.tag_color || undefined,
					}}
				>
					{topLabelTag.tag_content}
				</span>
			) : null}
			<div
				className={cn(
					badgesTopStyle,
					"absolute inset-x-0 left-1 z-10 flex flex-col gap-2 pt-2",
					hasBadges && "-translate-x-3"
				)}
			>
				{hasBadges ? (
					<div className='flex flex-wrap gap-2'>
						{labelsToRender.map((label) => (
							<span
								key={label.key}
								className={cn(
									"rounded-md px-3 py-1 text-xs font-semibold text-white",
									label.className
								)}
								style={
									label.key === "is_special"
										? { backgroundColor: dealerPrimaryColor }
										: undefined
								}
							>
								{label.text}
							</span>
						))}
					</div>
				) : null}
			</div>
		</div>
	);
}
