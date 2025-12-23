"use client";

import { useMemo } from "react";
import { VDPVehicle, VehicleTag } from "@dealertower/types/api";
import { VehiclePricing } from "./VehiclePricing";

interface VehiclePricingCardProps {
	vehicle: VDPVehicle;
	showGallery: boolean;
}

function getTopLabel(tagList: VehicleTag[] | null | undefined) {
	if (!tagList?.length) {
		return null;
	}

	return tagList.find((tag) => {
		const tagType = (tag as VehicleTag & { tag_type?: string }).tag_type;
		return (tagType ?? tag.type) === "top_label";
	});
}

export function VehiclePricingCard({
	vehicle,
}: VehiclePricingCardProps) {
	const topLabelTag = useMemo(() => getTopLabel(vehicle.tag), [vehicle.tag]);

	return (
		<div className='relative space-y-2 rounded-4xl border border-gray-100 p-6 xl:shadow-sm '>
			{topLabelTag && (
				<span
					className='block w-full rounded-full px-4 py-1.5 text-center text-[13px] font-semibold uppercase tracking-[0.08em]'
					style={{
						backgroundColor:
							topLabelTag.tag_background || "var(--color-dealer-primary)",
						color: topLabelTag.tag_color || "#fff",
					}}
				>
					{topLabelTag.tag_content || topLabelTag.label}
				</span>
			)}
			<div className='flex flex-col items-center space-y-1 text-center '>
				<h1 className='text-2xl xl:text-xl 2xl:text-2xl font-semibold text-[#101828]'>
					{vehicle.title}
				</h1>
				{vehicle.subtitle && (
					<p className='text-sm text-[#0A2237]'>{vehicle.subtitle}</p>
				)}
				{vehicle.mileage && (
					<p className='text-sm text-[#5C5C5C]'>{vehicle.mileage} miles</p>
				)}
			</div>

			<VehiclePricing vehicle={vehicle} />
		</div>
	);
}
