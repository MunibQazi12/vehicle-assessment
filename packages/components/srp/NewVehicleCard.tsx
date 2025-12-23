import { useRef, useState } from "react";
import { Calendar, Calculator, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import type { SRPVehicle } from "@dealertower/types/api";
import { getBlurDataURL, getSecureVehicleImageUrl } from "@dealertower/lib/utils/image";
import Image from "next/image";
import Link from "next/link";
import { CTAButton } from "../shared/CTAButton";
import { useWebsiteInfo } from "@dealertower/lib/tenant/context";
import VehicleLogos from "./vehicle-card/VehicleLogos";
import { useIsMobile } from "@dealertower/lib/hooks/useMobile";
import { MONRONEY_ALLOWED_HOSTS, P4C_ALLOWED_HOSTS } from "@dealertower/lib/historyBadges";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@dealertower/components/ui";

interface NewVehicleCardProps {
	vehicle: SRPVehicle;
	priority?: boolean;
}

function formatCurrency(value?: number | null): string {
	if (value === undefined || value === null) return "";
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	}).format(value);
}

export default function NewVehicleCard({ vehicle, priority = false }: NewVehicleCardProps) {
	const websiteInfo = useWebsiteInfo();
	const chipsScrollRef = useRef<HTMLDivElement | null>(null);
	const image = getSecureVehicleImageUrl(vehicle.photo);
	const blurDataURL = getBlurDataURL(vehicle.photo_preview);
	const title =
		vehicle.title ||
		[vehicle.year, vehicle.make, vehicle.model].filter(Boolean).join(" ");
	const stockNumber = vehicle.stock_number || "Stock N/A";
	const type = vehicle.condition || "Vehicle";

	// Generate VDP URL from vdp_slug (same logic as VehicleCard)
	const vdpUrl = vehicle.vdp_slug ? `/vehicle/${vehicle.vdp_slug}` : "#";

	const salePriceNumber = vehicle.price ?? vehicle.sale_price ?? null;
	const msrpNumber = vehicle.retail_price ?? null;
	const fallbackSalePrice = formatCurrency(salePriceNumber);
	const msrp = formatCurrency(msrpNumber);
	const savingsNumber =
		msrpNumber !== null && salePriceNumber !== null
			? msrpNumber - salePriceNumber
			: null;
	const savings = savingsNumber && savingsNumber > 0 ? formatCurrency(savingsNumber) : "";

	const features: Array<{ icon: React.ReactNode; label: string }> = [];

	if (vehicle.year) {
		features.push({
			icon: <Calendar className="w-[18px] h-[18px]" strokeWidth={1.5} />,
			label: String(vehicle.year),
		});
	}

	if (vehicle.mileage) {
		features.push({
			icon: <span className="w-[18px] h-[18px] text-xs">mi</span>,
			label: `${vehicle.mileage.toLocaleString()} mi`,
		});
	}

	if (vehicle.ext_color_raw) {
		features.push({
			icon: <span className="w-[18px] h-[18px] rounded-full border border-gray-300" />,
			label: vehicle.ext_color_raw,
		});
	}

	// Get certified logo for certified vehicles (same logic as VehicleCard)
	const getCertifiedLogo = () => {
		if (vehicle.condition?.toLowerCase() !== "certified" || !vehicle.make) {
			return null;
		}

		const makeKey = vehicle.make.toLowerCase().replace(/\s+/g, "_");
		return websiteInfo?.certified_logos?.[makeKey] || null;
	};

	const certifiedLogoUrl = getCertifiedLogo();

	// Device detection to avoid rendering empty CTA containers (shared hook)
	const isMobile = useIsMobile();

	// Determine if any logos will actually render, to avoid showing an empty container
	const normalizeHost = (value?: string | null) =>
		value?.toLowerCase().replace(/^www\./, "") || "";

	const resolvedHost = normalizeHost(process.env.NEXT_PUBLIC_HOST || "");
	const hasCarfaxLogo = Boolean(vehicle.carfax_url && vehicle.carfax_icon_url);
	const hasCertifiedLogo = Boolean(certifiedLogoUrl);
	const isAllowedP4c = P4C_ALLOWED_HOSTS.includes(resolvedHost);
	const isAllowedMonroney = MONRONEY_ALLOWED_HOSTS.includes(resolvedHost);
	const hasP4cLogo = isAllowedP4c;
	const hasMonroneyLogo =
		isAllowedMonroney && Boolean(vehicle.vin_number && vehicle.year && vehicle.make);
	const hasAnyLogo = hasCarfaxLogo || hasCertifiedLogo || hasP4cLogo || hasMonroneyLogo;

	// Build price options from structured prices object (only non-null formatted values)
	const priceOptions =
		vehicle.prices
			? ([
				vehicle.prices.sale_price_label &&
				vehicle.prices.sale_price_formatted && {
					key: "sale_price",
					label: vehicle.prices.sale_price_label,
					value: vehicle.prices.sale_price_formatted,
				},
				vehicle.prices.retail_price_label &&
				vehicle.prices.retail_price_formatted && {
					key: "retail_price",
					label: vehicle.prices.retail_price_label,
					value: vehicle.prices.retail_price_formatted,
				},
				vehicle.prices.dealer_sale_price_label &&
				vehicle.prices.dealer_sale_price_formatted && {
					key: "dealer_sale_price",
					label: vehicle.prices.dealer_sale_price_label,
					value: vehicle.prices.dealer_sale_price_formatted,
				},
				vehicle.prices.total_discounts_label &&
				vehicle.prices.total_discounts_formatted && {
					key: "total_discounts",
					label: vehicle.prices.total_discounts_label,
					value: vehicle.prices.total_discounts_formatted,
				},
			].filter(Boolean) as Array<{ key: string; label: string; value: string }>)
			: [];

	const [selectedPriceKey, setSelectedPriceKey] = useState<string | null>(priceOptions[0]?.key ?? null);

	const selectedPrice =
		priceOptions.find((opt) => opt.key === selectedPriceKey) ?? priceOptions[0] ?? null;

	return (
		<div className="flex flex-col bg-white rounded-xl shadow-[0_2.644px_10.047px_0_rgba(99,99,99,0.25)] overflow-hidden max-w-[495px] w-full">
			{/* Image - Wrapped in Link */}
			<Link
				href={vdpUrl}
				className="relative 2xl:h-[362px] sm:h-[225px] h-[270px] w-full overflow-hidden rounded-t-xl bg-zinc-100"
				aria-label={`View ${vehicle.title || `${vehicle.year} ${vehicle.make} ${vehicle.model}`} details`}
			>
				{image ? (
					<Image
						src={image}
						alt={vehicle.title || "Vehicle"}
						fill
						className='object-cover transition-transform group-hover:scale-105'
						sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
						quality={priority ? 65 : 55}
						priority={priority}
						loading={priority ? "eager" : "lazy"}
						fetchPriority={priority ? "high" : "auto"}
						unoptimized={false}
						placeholder={blurDataURL ? "blur" : "empty"}
						blurDataURL={blurDataURL}
					// onError={() => setImageError(true)}
					/>
				) : (
					<div className='flex h-full items-center justify-center'>
						<span className='text-sm text-zinc-400'>No image available</span>
					</div>
				)}
			</Link>

			{/* Title - Wrapped in Link */}
			<Link href={vdpUrl}>
				<h3 className="text-[19px] p-[15px_7px_0_12px] font-bold text-[#020202] font-inter">
					{title}
				</h3>
			</Link>
			<div className="flex flex-col gap-6 p-[5px_7px_20px_12px] mt-auto">
				<div className="flex flex-col gap-6">

					{/* Stock number, type, and feature chips as a horizontally scrollable row with arrows */}
					<div className="relative flex items-center">
						<button
							type="button"
							className="hidden sm:flex items-center justify-center text-zinc-600 hover:bg-zinc-50 rounded-full p-1 mr-1 disabled:opacity-30"
							aria-label="Scroll chips left"
							onClick={() => {
								chipsScrollRef.current?.scrollBy({ left: -150, behavior: "smooth" });
							}}
						>
							<ChevronLeft className="h-4 w-4" />
						</button>
						<div
							ref={chipsScrollRef}
							className="flex items-center gap-2 overflow-x-auto scrollbar-hide pr-2 py-1"
						>
						
							<div className="flex items-center h-6 px-3 rounded-2xl bg-white shadow whitespace-nowrap">
								<span className="text-[15px] text-[#231F20] font-lato">
									{stockNumber}
								</span>
							</div>
							<div className="flex items-center h-6 px-3 rounded-2xl bg-white shadow whitespace-nowrap">
								<span className="text-[15px] text-[#231F20] font-lato">
									{type}
								</span>
							</div>
							{features.map((feature, idx) => (
								<div
									key={`feature-${idx}`}
									className="flex items-center gap-1.5 h-6 px-3 rounded-2xl bg-white shadow whitespace-nowrap"
								>
									{feature.icon}
									<span className="text-[15px] text-[#231F20] font-lato">
										{feature.label}
									</span>
								</div>
							))}
						</div>
						<button
							type="button"
							className="hidden sm:flex items-center justify-center text-zinc-600 hover:bg-zinc-50 rounded-full p-1 ml-1 disabled:opacity-30"
							aria-label="Scroll chips right"
							onClick={() => {
								chipsScrollRef.current?.scrollBy({ left: 150, behavior: "smooth" });
							}}
						>
							<ChevronRight className="h-4 w-4" />
						</button>
					</div>

					<div className="flex flex-wrap-reverse items-center justify-between gap-5 2xl:pt-4 pt-2">
						<div className="flex items-center gap-2">
							<div className="flex flex-col gap-0.5">
								<DropdownMenu>
									<DropdownMenuTrigger className="inline-flex items-center gap-2 cursor-pointer">
										<span className="[@media(min-width:1921px)]:text-[18px] text-[16px] font-bold text-[#020202] font-inter">
											{selectedPrice?.label || "Sale Price"}
										</span>
										<ChevronDown className="h-4 w-4 text-black" />
									</DropdownMenuTrigger>
									{priceOptions.length > 0 && (
										<DropdownMenuContent
											align="start"
											className="w-56 bg-white border border-zinc-200 shadow-xl rounded-lg"
										>
											{priceOptions.map((option) => {
												const isSelected = selectedPriceKey === option.key;
												return (
													<DropdownMenuItem
														key={option.key}
														className={`cursor-pointer px-3 py-2 text-left text-sm text-zinc-800 hover:bg-zinc-100 ${isSelected ? "bg-zinc-100" : ""
															}`}
														onClick={() => setSelectedPriceKey(option.key)}
													>
														{option.label}
													</DropdownMenuItem>
												);
											})}
										</DropdownMenuContent>
									)}
								</DropdownMenu>

								<span className="text-[26px] font-bold text-[#020202] font-inter">
									{selectedPrice?.value || fallbackSalePrice}
								</span>
							</div>

							{savings && (
								<div className="flex flex-col items-start gap-1">
									<span className="text-[16px] font-medium text-[#515151] font-inter">
										MSRP <span className="line-through">{msrp}</span>
									</span>
									<span className="bg-[#E7F1EA] pl-2 pr-1 py-0.5 text-[15px] font-extrabold text-[#0F882F] font-inter">
										{savings} Savings
									</span>
								</div>
							)}
						</div>

						<div className="flex items-center ml-auto">
							{/* Exterior color swatch */}
							{vehicle.ext_color && (
								<span
									className="inline-block h-1.5 w-8"
									style={{ backgroundColor: vehicle.ext_color || undefined }}
									title={vehicle.ext_color_raw || undefined}
								/>
							)}
							{/* Interior color swatch */}
							{vehicle.int_color && (
								<span
									className="inline-block h-1.5 w-8"
									style={{ backgroundColor: vehicle.int_color || undefined }}
									title={vehicle.int_color_raw || undefined}
								/>
							)}
						</div>
					</div>

					<div className="flex flex-col gap-3 pt-2">
						{vehicle?.cta && vehicle?.cta?.length > 0 ? (
							<>
								{/* First button - full width */}
								{vehicle.cta[0] && (() => {
									const firstCta = vehicle.cta[0];
									const labelLower = firstCta.cta_label?.toLowerCase();
									const icon = labelLower?.includes("scheduled") ? (
										<Calendar className="w-[18px] h-[18px]" strokeWidth={1.5} />
									) : labelLower?.includes("payment") ? (
										<Calculator className="w-[18px] h-[18px]" strokeWidth={1.5} />
									) : null;

									return (
										<CTAButton
											key={`${firstCta.cta_label}-0`}
											cta={firstCta}
											condition={vehicle.condition || undefined}
											location="srp"
											icon={icon}
											vehicleData={{
												vehicle_id: vehicle.vehicle_id || undefined,
												dealer_ids: vehicle.dealer_ids || undefined,
												vin_number: vehicle.vin_number || undefined,
												stock_number: vehicle.stock_number || undefined,
												title: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
												subtitle: vehicle.trim || undefined,
												photo: vehicle.photo || undefined,
												price: vehicle.price || undefined,
												retail_price: vehicle.retail_price || undefined,
												sale_price: vehicle.sale_price || undefined,
											}}
										/>
									);
								})()}

								{/* Rest of the buttons - side by side with equal width */}
								{(() => {
									const rest = vehicle?.cta?.slice(1) ?? [];

									// Filter by device so we don't render an empty row (desktop with only mobile CTAs, or vice versa)
									const visibleRest = rest.filter((ctaItem) => {
										if (ctaItem.device === "both") return true;
										return ctaItem.device === "mobile" ? isMobile : !isMobile;
									});

									if (visibleRest.length === 0) return null;

									return (
										<div className="flex gap-3">
											{visibleRest.map((ctaItem, index) => {
												const labelLower = ctaItem.cta_label?.toLowerCase();
												const icon = labelLower?.includes("scheduled") ? (
													<Calendar className="w-[18px] h-[18px]" strokeWidth={1.5} />
												) : labelLower.includes("payment") ? (
													<Calculator className="w-[18px] h-[18px]" strokeWidth={1.5} />
												) : null;

												return (
													<div key={`${ctaItem.cta_label}-${index + 1}`} className="flex-1">
														<CTAButton
															cta={ctaItem}
															condition={vehicle.condition || undefined}
															location="srp"
															icon={icon}
															vehicleData={{
																vehicle_id: vehicle.vehicle_id || undefined,
																dealer_ids: vehicle.dealer_ids || undefined,
																vin_number: vehicle.vin_number || undefined,
																stock_number: vehicle.stock_number || undefined,
																title: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
																subtitle: vehicle.trim || undefined,
																photo: vehicle.photo || undefined,
																price: vehicle.price || undefined,
																retail_price: vehicle.retail_price || undefined,
																sale_price: vehicle.sale_price || undefined,
															}}
														/>
													</div>
												);
											})}
										</div>
									);
								})()}
							</>
						) : (
							<button
								className={`w-full rounded-lg py-3 font-medium transition-colors ${websiteInfo
									? "btn-dealer-primary"
									: "bg-zinc-900 text-white hover:bg-zinc-800"
									}`}
							>
								View Details
							</button>
						)}


					</div>
				</div>

				{hasAnyLogo && (
					<div className="flex items-center justify-between gap-4">
						<VehicleLogos
							certifiedLogo={certifiedLogoUrl}
							carfaxUrl={vehicle.carfax_url}
							carfaxIconUrl={vehicle.carfax_icon_url}
							width={60}
							height={40}
							shouldPreloadImage={false}
							condition={vehicle.condition ?? null}
							vinNumber={vehicle.vin_number}
							year={vehicle.year ? String(vehicle.year) : undefined}
							make={vehicle.make ?? undefined}
						/>
					</div>
				)}
			</div>
		</div>
	);
}
