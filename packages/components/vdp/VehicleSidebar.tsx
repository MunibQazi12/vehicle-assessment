"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import { VDPVehicle } from "@dealertower/types/api";
import { CTAButton } from "@dealertower/components/shared/CTAButton";
import type { DealerInfoWithGroup } from "@dealertower/lib/api/dealer";
import { VehiclePricingCard } from "./VehiclePricingCard";

const FormInlineVDP = dynamic(
	() =>
		import("@dealertower/components/forms/FormInlineVDP").then((mod) => ({
			default: mod.FormInlineVDP,
		})),
	{
		ssr: false,
		loading: () => (
			<div
				className='rounded-4xl border border-gray-200 bg-white p-6 min-h-[420px] animate-pulse'
				aria-hidden='true'
			/>
		),
	}
);

const PRIMARY_INLINE_FORM_ID = "36273a31-316e-44eb-92fa-7377377eca15";

interface PricingCardProps {
	vehicle: VDPVehicle;
	dealerInfo?: DealerInfoWithGroup | null;
}

export function VehicleSidebar({
	vehicle,
}: PricingCardProps) {
	const { cta } = vehicle;

	const vdpCTAs = useMemo(
		() =>
			cta?.filter(
				(btn) => btn.cta_location === "vdp" || btn.cta_location === "both"
			) || [],
		[cta]
	);

	const inlineFormConfigs = useMemo(
		() =>
			(cta || [])
				.filter(
					(btn) =>
						btn.cta_type === "form" && typeof btn.btn_content === "string"
				)
				.map((btn) => ({
					formId: btn.btn_content,
					label: btn.cta_label,
					styles: btn.btn_styles,
				})),
		[cta]
	);

	const inlineFormDefaultId = useMemo(() => {
		if (!inlineFormConfigs.length) return undefined;

		return inlineFormConfigs.some(
			(form) => form.formId === PRIMARY_INLINE_FORM_ID
		)
			? PRIMARY_INLINE_FORM_ID
			: inlineFormConfigs[0]?.formId;
	}, [inlineFormConfigs]);

	const secondaryCTAs = useMemo(
		() => vdpCTAs.filter((btn) => btn.cta_type !== "form"),
		[vdpCTAs]
	);

	const formVehicleData = useMemo(
		() => ({
			vehicle_id: vehicle.vehicle_id || undefined,
			dealer_ids: vehicle.dealer_ids || undefined,
			vin_number: vehicle.vin_number || undefined,
			stock_number: vehicle.stock_number || undefined,
			title: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
		}),
		[vehicle]
	);

	return (
		<div className='flex flex-col gap-6 relative xl:h-full'>
			<div className='space-y-4'>
				<VehiclePricingCard
					vehicle={vehicle}
					showGallery={false}
				/>

				{secondaryCTAs.length > 0 && (
					<div className='space-y-3 transition-opacity duration-200 ease-out'>
						{secondaryCTAs.map((btn, index) => (
							<CTAButton
								key={index}
								cta={btn}
								condition={vehicle.condition || undefined}
								location='vdp'
								vehicleData={formVehicleData}
							/>
						))}
					</div>
				)}
			</div>

			{inlineFormConfigs.length > 0 && (
				<div className='sticky top-4 lg:sticky lg:top-2'>
					<FormInlineVDP
						forms={inlineFormConfigs}
						defaultOpenFormId={inlineFormDefaultId}
						vehicleData={formVehicleData}
						showHeaderTitle={false}
						showHeaderSubtitle={false}
						onSuccess={() => { }}
					/>
				</div>
			)}
		</div>
	);
}
