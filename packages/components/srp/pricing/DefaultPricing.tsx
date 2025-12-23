/**
 * Default Pricing Template
 * Line-item format with detailed breakdown of discounts and incentives
 */

"use client";

import type { SRPVehicle } from "@dealertower/types/api";
import { extractPriceData } from "./utils";

interface DefaultPricingProps {
	vehicle: SRPVehicle;
	primaryColor?: string;
}

export function DefaultPricing({ vehicle, primaryColor }: DefaultPricingProps) {
	const priceData = extractPriceData(vehicle);

	const {
		dealer_additional_details,
		dealer_additional_label,
		dealer_discount_details,
		dealer_discount_label,
		dealer_sale_price_formatted,
		dealer_sale_price_label,
		incentive_discount_details,
		incentive_discount_label,
		retail_price_formatted,
		retail_price_label,
		sale_price_formatted,
		sale_price_label,
	} = priceData;

	const basePriceItemClassName = "flex justify-between items-baseline py-2";
	const priceItemClassName = `${basePriceItemClassName} border-t border-zinc-200`;

	const hasAdditionalPriceDetails = Boolean(
		retail_price_label ||
		(dealer_discount_label && dealer_discount_details?.length) ||
		(dealer_additional_label && dealer_additional_details?.length) ||
		dealer_sale_price_label ||
		(incentive_discount_label && incentive_discount_details?.length)
	);

	const saleItemClassName = hasAdditionalPriceDetails
		? priceItemClassName
		: basePriceItemClassName;

	if (!sale_price_formatted) {
		return (
			<div className='mt-4 border-t border-zinc-200 pt-4'>
				<p className='text-lg font-semibold text-zinc-900'>Call for Price</p>
			</div>
		);
	}

	return (
		<div className='mt-4 border-zinc-200 text-[#111]'>
			{/* Retail Price */}
			{retail_price_label && (
				<div className='flex justify-between py-2'>
					<span className='text-sm font-semibold'>{retail_price_label}</span>

					<span className='text-sm font-semibold'>
						<span className='line-through'>{retail_price_formatted}</span>
					</span>
				</div>
			)}

			{/* Dealer Discounts */}
			{dealer_discount_label &&
				dealer_discount_details &&
				dealer_discount_details.map((el: { title: string; value: string }, index: number) => (
					<div
						className={priceItemClassName}
						key={`dealer-discount-${index}-${el.title}`}
					>
						<span className='text-sm'>{el.title}</span>

						<span className='text-sm'>{el.value}</span>
					</div>
				))}

			{/* Dealer Additional Fees */}
			{dealer_additional_label &&
				dealer_additional_details &&
				dealer_additional_details.map(
					(el: { title: string; value: string }, index: number) => (
						<div
							className={priceItemClassName}
							key={`dealer-additional-${index}-${el.title}`}
						>
							<span className='text-sm'>{el.title}</span>

							<span className='text-sm'>{el.value}</span>
						</div>
					)
				)}

			{/* Dealer Sale Price */}
			{dealer_sale_price_label && (
				<div className={priceItemClassName}>
					<span className='text-sm '>{dealer_sale_price_label}</span>

					<span className='text-sm '>{dealer_sale_price_formatted}</span>
				</div>
			)}

			{/* Incentive Discounts */}
			{incentive_discount_label &&
				incentive_discount_details &&
				incentive_discount_details.map(
					(el: { title: string; value: string }, index: number) => (
						<div
							className={priceItemClassName}
							key={`incentive-discount-${index}-${el.title}`}
						>
							<span className='text-sm'>{el.title}</span>

							<span className='text-sm'>{el.value}</span>
						</div>
					)
				)}

			{/* Final Sale Price (no retail) */}
			{sale_price_label && !retail_price_label && (
				<div className={saleItemClassName}>
					<span className='text-sm font-semibold'>{sale_price_label}</span>

					<span className='text-sm font-semibold'>{sale_price_formatted}</span>
				</div>
			)}

			{/* Final Sale Price (with retail) */}
			{sale_price_label && retail_price_label && (
				<div className={saleItemClassName}>
					<div className='uppercase text-sm font-semibold'>
						{sale_price_label}
					</div>
					<div
						className={`uppercase text-[22px] min-[140rem]:text-2xl font-bold ${
							primaryColor ? "" : "text-[var(--color-dealer-primary)]"
						}`}
						style={primaryColor ? { color: primaryColor } : undefined}
					>
						{sale_price_formatted}
					</div>
				</div>
			)}
		</div>
	);
}
