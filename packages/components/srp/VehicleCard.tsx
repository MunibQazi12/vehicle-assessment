/**
 * Vehicle Card Component (Client Component)
 * Displays individual vehicle information in a card format
 */

"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useWebsiteInfo } from "@dealertower/lib/tenant/context";
import type { SRPVehicle } from "@dealertower/types/api";
import { CTAButton } from "@dealertower/components/shared/CTAButton";
import { DefaultPricing } from "./pricing";
import { VehicleCondition } from "./vehicle-card/VehicleCondition";
import VehicleCardColor from "./vehicle-card/VehicleCardColor";
import VehicleLogos from "./vehicle-card/VehicleLogos";
import VehicleMilage from "./vehicle-card/VehicleMilage";
import { VehicleCardLabel } from "./vehicle-card/VehicleCardLabel";
import { getSecureVehicleImageUrl, getBlurDataURL } from "@dealertower/lib/utils/image";

interface VehicleCardProps {
  vehicle: SRPVehicle;
  /** Mark image as high priority for LCP optimization (first 3-6 cards) */
  priority?: boolean;
}

export function VehicleCard({ vehicle, priority = false }: VehicleCardProps) {
	const websiteInfo = useWebsiteInfo();
	const [imageError, setImageError] = useState(false);

	// Ensure vehicle photo uses HTTPS for security and PageSpeed score
	const securePhotoUrl = getSecureVehicleImageUrl(vehicle.photo);

	// Convert base64 photo_preview to data URL format for Next.js Image
	const blurDataURL = getBlurDataURL(vehicle.photo_preview);

	// Generate VDP URL from vdp_slug
	const vdpUrl = vehicle.vdp_slug ? `/vehicle/${vehicle.vdp_slug}` : "#";

	// Get certified logo for certified vehicles
	const getCertifiedLogo = () => {
		if (vehicle.condition?.toLowerCase() !== "certified" || !vehicle.make) {
			return null;
		}

		// Normalize make name to match certified_logos key format (lowercase, underscores)
		const makeKey = vehicle.make.toLowerCase().replace(/\s+/g, "_");
		return websiteInfo?.certified_logos?.[makeKey] || null;
	};

	const certifiedLogoUrl = getCertifiedLogo();

	return (
		<div className='group flex flex-col rounded-xl border border-zinc-200 bg-white transition-shadow hover:shadow-lg'>
			{/* Image - Wrapped in Link */}
			<Link
				href={vdpUrl}
				className='relative aspect-3/2 w-full rounded-t-xl bg-zinc-100'
				aria-label={`View ${vehicle.title || `${vehicle.year} ${vehicle.make} ${vehicle.model}`} details`}
			>
				<div className='relative h-full w-full overflow-hidden rounded-t-xl bg-zinc-100'>
					{securePhotoUrl && !imageError ? (
						<Image
							src={securePhotoUrl}
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
							onError={() => setImageError(true)}
						/>
					) : (
						<div className='flex h-full items-center justify-center'>
							<span className='text-sm text-zinc-400'>No image available</span>
						</div>
					)}
				</div>

				{/* Badges */}
				<VehicleCardLabel
					vehicle={vehicle}
					primaryColor={websiteInfo?.main_colors?.[0]}
				/>
			</Link>
			{/* Content */}
			<div className='flex flex-col flex-1 px-2'>
				{/* Title - Wrapped in Link */}

				{/* Content */}
				<div className='flex flex-col flex-1 p-2 min-[140rem]:p-4 '>
					<div className='vehicle-theme1__top-row flex justify-between items-center'>
						<VehicleCondition vehicle={vehicle} />

				<div className='vehicle-theme1__color-actions flex justify-between align-baseline gap-2'>
					<VehicleCardColor
						extColor={vehicle.ext_color ?? "other"}
						intColor={vehicle.int_color ?? "other"}
						extColorRaw={vehicle.ext_color_raw}
						intColorRaw={vehicle.int_color_raw}
					/>
					{/* Temporarily commented out save vehicle button */}
					{/* {vehicle.vin_number && (
						<CardSaveVehicleButton
							vin={vehicle.vin_number}
							primaryColor={websiteInfo?.theme?.primaryColor}
						/>
					)} */}
            </div>
          </div>{" "}
          {/* Title */}
          <Link href={vdpUrl}>
            <h2 className="text-base font-semibold text-[#111111] mt-2">
              {vehicle.title ||
                `${vehicle.year} ${vehicle.make} ${vehicle.model}`}
            </h2>
          </Link>
          {/* Subtitle */}
          {vehicle.subtitle && (
            <p className="mt-1 text-xs text-[#111111]">{vehicle.subtitle}</p>
          )}
          {/* Pricing */}
          <DefaultPricing
            vehicle={vehicle}
            primaryColor={websiteInfo?.main_colors?.[0]}
          />
          <div className="vehicle-logos-mileage flex  items-start">
            <VehicleLogos
              certifiedLogo={certifiedLogoUrl}
              carfaxUrl={vehicle.carfax_url}
              carfaxIconUrl={vehicle.carfax_icon_url}
              width={60}
              height={40}
              shouldPreloadImage={false}
              condition={vehicle.condition}
              vinNumber={vehicle.vin_number}
            />

            <VehicleMilage
              condition={vehicle.condition}
              mileage={vehicle.mileage}
              length_unit={websiteInfo?.length_unit ?? undefined}
              className="ml-auto mt-3"
            />
          </div>{" "}
          {/* CTA Buttons - Always at bottom */}
          <div className="mt-auto pt-4 space-y-2">
            {vehicle.cta && vehicle.cta.length > 0 ? (
              vehicle.cta.map((ctaItem, index) => (
                <CTAButton
                  key={`${ctaItem.cta_label}-${index}`}
                  cta={ctaItem}
                  condition={vehicle.condition || undefined}
                  location="srp"
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
              ))
            ) : (
              // Fallback button if no CTAs configured
              <button
                className={`w-full rounded-lg py-3 font-medium transition-colors ${
                  websiteInfo
                    ? "btn-dealer-primary"
                    : "bg-zinc-900 text-white hover:bg-zinc-800"
                }`}
              >
                View Details
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
