"use client";

import Image from "next/image";
import {
	P4C_ALLOWED_HOSTS,
	MONRONEY_ALLOWED_HOSTS,
	MONRONEY_VENDOR_ID,
} from "@dealertower/lib/historyBadges";
import MonroneyBadge from "./MonroneyBadge";

type Props = {
	carfaxUrl?: string | null;
	carfaxIconUrl: string | null;
	certifiedLogo?: string | null;
	width?: number;
	height?: number;
	shouldPreloadImage?: boolean;
	className?: string; // allow extra classes on root
	vinNumber?: string | null;
	year?: string;
	make?: string;
	condition: string | null;
	host?: string | null;
};

function VehicleLogos(props: Props) {
	const {
		carfaxIconUrl,
		carfaxUrl,
		certifiedLogo,
		width,
		height,
		shouldPreloadImage,
		className,
		vinNumber,
		year,
		make,
		host,
		// condition is defined in Props but not currently used in this component
	} = props;

	const normalizeHost = (value?: string | null) =>
		value?.toLowerCase().replace(/^www\./, "") || "";

	const resolvedHost = normalizeHost(host || process.env.NEXT_PUBLIC_HOST || "");

	const isAllowedSitForP4c = P4C_ALLOWED_HOSTS.includes(resolvedHost);
	const isAllowedSitForMonroney =
		MONRONEY_ALLOWED_HOSTS.includes(resolvedHost);

	// Base container class varies by template
	const containerStyles =
		"vehicle-logos-container flex items-center flex-wrap min-[140rem]:flex-nowrap gap-4 mt-2 min-h-8 ";

	return (
		<div className={`${containerStyles} ${className || ""}`}>
			{/* CARFAX Logo */}
			{carfaxUrl && carfaxIconUrl && (
				<a
					href={carfaxUrl}
					target='_blank'
					rel='noopener noreferrer'
					aria-label='See more about vehicle on CARFAX'
					className='vehicle-logos-carfax-link'
				>
					<Image
						alt='CARFAX'
						src={carfaxIconUrl}
						onError={(e: React.SyntheticEvent<HTMLImageElement>) => (e.currentTarget.style.display = "none")}
						width={width}
						height={height}
						priority={shouldPreloadImage}
						className='vehicle-logos-carfax-img object-contain'
					/>
				</a>
			)}

			{/* Certified Logo */}
			{certifiedLogo && (
				<div className='mt-1 relative h-8 w-[100px] min-[140rem]:w-[120px]'>
					<Image
						src={certifiedLogo}
						alt={`${make} Certified`}
						fill
						className='object-contain'
					/>
				</div>
			)}

			{/* P4C Logo */}
			{isAllowedSitForP4c && (
				<div
					className='flex items-center justify-center min-h-8 min-w-[120px]'
					style={{ maxWidth: width }}
				>
					<div
						className='p4c_badge_container'
						data-badge-type='TEXT_SMALL_DATA_DELETED'
						data-company-id='PQLhpm-KiV69Y'
						data-vin={vinNumber}
						data-deletion-status='COMPLETED'
						data-redirect-to='CERTIFICATE'
					></div>
				</div>
			)}

			{/* Monroney badge */}
			{isAllowedSitForMonroney && vinNumber && year && make && (
				<div className='flex items-center justify-center min-h-8 min-w-[120px]'>
					<MonroneyBadge
						vin={vinNumber}
						year={year}
						make={make}
						vendorId={MONRONEY_VENDOR_ID}
					/>
				</div>
			)}
		</div>
	);
}

export default VehicleLogos;
