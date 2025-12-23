import type { SRPVehicle } from "@dealertower/types/api";

interface SimilarVehiclePricingProps {
	vehicle: SRPVehicle;
}

export function SimilarVehiclePricing({ vehicle }: SimilarVehiclePricingProps) {
	const prices = vehicle.prices;

	const formatCurrency = (value?: number | null) =>
		typeof value === "number" ? `$${value.toLocaleString("en-US")}` : null;

	const msrpPrice =
		prices?.retail_price_formatted ||
		formatCurrency(vehicle.retail_price) ||
		formatCurrency(vehicle.price);

	const priceLabel =
		(prices?.sale_price_formatted && prices.sale_price_label) ||
		(prices?.dealer_sale_price_formatted && prices.dealer_sale_price_label) ||
		(prices?.retail_price_formatted && prices.retail_price_label) ||
		(vehicle.price || vehicle.sale_price || vehicle.retail_price ? "MSRP" : "");

	const formattedPrice =
		prices?.sale_price_formatted ||
		prices?.dealer_sale_price_formatted ||
		prices?.retail_price_formatted ||
		formatCurrency(vehicle.price) ||
		formatCurrency(vehicle.sale_price) ||
		formatCurrency(vehicle.retail_price);

	const showMsrp = Boolean(
		msrpPrice &&
		formattedPrice &&
		msrpPrice !== formattedPrice &&
		priceLabel?.toLowerCase() !== "msrp"
	);

	if (!formattedPrice) {
		return (
			<div className='text-sm font-semibold text-[#0A0A0A]'>Call for Price</div>
		);
	}

	return (
		<div className='flex flex-row gap-1 justify-between items-baseline'>
			<div className='flex flex-col'>
				{priceLabel && (
					<span
						className='text-[11px] font-semibold uppercase 
					 text-[#99A1AF]'
					>
						{priceLabel}
					</span>
				)}
				<span className='text-2xl font-semibold text-[#0A0A0A]'>
					{formattedPrice}
				</span>
			</div>

			<div className='flex flex-col text-xs font-semibold uppercase text-[#C0C5D0] line-through text-right'>
				{showMsrp && (
					<>
						<span>MSRP</span>
						<span className='text-2xl font-semibold'>{msrpPrice}</span>
					</>
				)}
			</div>
		</div>
	);
}
