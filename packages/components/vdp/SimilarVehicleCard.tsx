"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { CarFront, CircleGauge, Cog, Hash } from "lucide-react";
import { SRPVehicle } from "@dealertower/types/api";
import { SimilarVehiclePricing } from "./SimilarVehiclePricing";
import {
	getSecureVehicleImageUrl,
	getBlurDataURL,
} from "@dealertower/lib/utils/image";

interface SimilarVehicleCardProps {
	vehicle: SRPVehicle;
}

export function SimilarVehicleCard({ vehicle }: SimilarVehicleCardProps) {
	const [imageError, setImageError] = useState(false);
	const vdpUrl = vehicle.vdp_slug ? `/vehicle/${vehicle.vdp_slug}` : "#";

	const displayTitle =
		vehicle.title || `${vehicle.year} ${vehicle.make} ${vehicle.model}`;
	const secondaryLine =
		vehicle.drive_train || vehicle.condition || vehicle.body || null;

	// Build key tags shown in the UI
	const detailTags = useMemo(() => {
		const tags: Array<{ label: string; icon: LucideIcon }> = [];

		if (vehicle.stock_number) {
			tags.push({
				label: vehicle.stock_number,
				icon: Hash,
			});
		}

		if (vehicle.body) {
			tags.push({
				label: vehicle.body,
				icon: CarFront,
			});
		}

		if (vehicle.drive_train) {
			tags.push({
				label: vehicle.drive_train,
				icon: CircleGauge,
			});
		}

		if (vehicle.transmission) {
			tags.push({
				label: vehicle.transmission,
				icon: Cog,
			});
		}

		return tags.slice(0, 4);
	}, [vehicle]);

	// Get primary image and ensure HTTPS
	const imageUrl =
		getSecureVehicleImageUrl(vehicle.photo || vehicle.photo_preview) ||
		"/placeholder-vehicle.jpg";

	// Get blur data URL for loading placeholder
	const blurDataURL = getBlurDataURL(vehicle.photo_preview);

	return (
		<div className='group flex w-full flex-shrink-0 flex-col overflow-hidden rounded-[24px] border border-zinc-200 bg-white transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_32px_65px_rgba(15,23,42,0.12)] md:w-[260px] md:flex-shrink-0 lg:w-[310px]'>
			<Link
				href={vdpUrl}
				className='relative aspect-[4/3] w-full overflow-hidden bg-zinc-100'
			>
				{imageUrl && !imageError ? (
					<Image
						src={imageUrl}
						alt={displayTitle || "Vehicle"}
						fill
						className='object-cover transition-transform duration-500'
						sizes='(max-width: 640px) 80vw, (max-width: 1024px) 40vw, 320px'
						quality={75}
						placeholder={blurDataURL ? "blur" : "empty"}
						blurDataURL={blurDataURL}
						onError={() => setImageError(true)}
					/>
				) : (
					<div className='flex h-full items-center justify-center'>
						<span className='text-sm text-zinc-400'>No image available</span>
					</div>
				)}
			</Link>

			<div className='flex flex-1 flex-col gap-2 p-4'>
				<Link href={vdpUrl}>
					<h2 className='text-lg font-semibold text-[#0A0A0A]'>
						{displayTitle}
					</h2>
				</Link>

				{secondaryLine && (
					<p className='text-sm font-medium uppercase text-[#8D939F]'>
						{secondaryLine}
					</p>
				)}

				{detailTags.length > 0 && (
					<div className='flex flex-wrap gap-2'>
						{detailTags.map(({ label, icon: Icon }) => (
							<span
								key={label}
								className='inline-flex items-center gap-1.5 rounded-full border border-[#E7E8EC] bg-white px-3 py-1 text-xs font-medium text-[#1F2129] shadow-[0_1px_3px_rgba(15,23,42,0.12)]'
							>
								<Icon className='h-3.5 w-3.5 text-[#747C8B]' />
								{label}
							</span>
						))}
					</div>
				)}

				<div className='mt-auto pt-4'>
					<SimilarVehiclePricing vehicle={vehicle} />
				</div>
			</div>
		</div>
	);
}
