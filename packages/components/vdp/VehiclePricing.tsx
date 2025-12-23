"use client";

import { useMemo } from "react";
import { InfoIcon } from "@dealertower/svgs/icons/icons";
import { PricingDetailsModal } from "@dealertower/components/shared/PricingDetailsModal";
import { Button } from "@dealertower/components/ui/button";
import type { VDPVehicle } from "@dealertower/types/api";

interface VehiclePricingProps {
	vehicle: VDPVehicle;
}

export function VehiclePricing({ vehicle }: VehiclePricingProps) {
	const prices = vehicle.prices;

	const salePrice = useMemo(() => {
		if (prices?.sale_price_formatted) {
			return prices.sale_price_formatted;
		}

		return typeof vehicle.sale_price === "number"
			? `$${vehicle.sale_price.toLocaleString()}`
			: undefined;
	}, [prices?.sale_price_formatted, vehicle.sale_price]);

	const pricingBreakdown = useMemo(() => {
		const rows: { title: string; value: string }[] = [];

		if (prices?.dealer_discount_details?.length) {
			prices.dealer_discount_details.forEach((detail) => {
				if (detail.title && detail.value) {
					rows.push({ title: detail.title, value: detail.value });
				}
			});
		}

		if (prices?.incentive_discount_details?.length) {
			prices.incentive_discount_details.forEach((detail) => {
				if (detail.title && detail.value) {
					rows.push({ title: detail.title, value: detail.value });
				}
			});
		}

		if (prices?.dealer_additional_details?.length) {
			prices.dealer_additional_details.forEach((detail) => {
				if (detail.title && detail.value) {
					rows.push({ title: detail.title, value: detail.value });
				}
			});
		}

		if (
			prices?.dealer_sale_price_label &&
			prices?.dealer_sale_price_formatted
		) {
			rows.push({
				title: prices.dealer_sale_price_label,
				value: prices.dealer_sale_price_formatted,
			});
		}

		return rows;
	}, [prices]);

	const pricingDetailRows = useMemo(
		() =>
			pricingBreakdown.map((detail, index) => ({
				id: `${detail.title}-${index}`,
				title: detail.title,
				value: detail.value,
			})),
		[pricingBreakdown]
	);

	const hasPricingDetails = pricingDetailRows.length > 0;
	const primaryPricingDetail = pricingBreakdown[0];
	const pricingButtonLabel =
		primaryPricingDetail?.title || "View Pricing Details";
	const pricingButtonValue = primaryPricingDetail?.value || salePrice;

	return (
		<div className='space-y-4 p-2 '>
			<div className='flex flex-wrap items-start justify-between gap-4'>
				<div>
					<p className='text-[11px] text-gray-500'>
						{prices?.sale_price_label || "Sale Price"}
					</p>
					<p className='text-[34px] font-black leading-tight text-[#101828]'>
						{salePrice}
					</p>
				</div>
				{prices?.retail_price_formatted && (
					<div className='text-right'>
						<p className='text-[11px] text-gray-500'>
							{prices?.retail_price_label || "MSRP"}
						</p>
						<p className='text-[34px]  font-semibold text-gray-400 line-through'>
							{prices.retail_price_formatted}
						</p>
					</div>
				)}
			</div>

			{hasPricingDetails && (
				<PricingDetailsModal
					variant='side'
					salePrice={{
						label: prices?.sale_price_label || "Sale Price",
						value: salePrice || "",
					}}
					comparePrice={
						prices?.retail_price_formatted
							? {
									label: prices?.retail_price_label || "MSRP",
									value: prices.retail_price_formatted,
									strike: true,
								}
							: undefined
					}
					details={pricingDetailRows}
					renderTrigger={({ open }) => (
						<Button
							type='button'
							variant='ghost'
							onClick={open}
							className='flex w-full items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 py-4 text-left text-sm font-semibold text-[#0F172A] shadow-sm transition-all duration-200 hover:shadow-md cursor-pointer'
						>
							<span className='flex items-center text-base gap-2'>
								<InfoIcon className='h-5 w-5 text-[var(--color-dealer-primary)]' />
								{pricingButtonLabel}
							</span>
							<span className='flex items-center text-right text-lg text-[#101828]'>
								{pricingButtonValue}
							</span>
						</Button>
					)}
				/>
			)}
		</div>
	);
}
