"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Heart, Share2 } from "lucide-react";
import { useVehicleSave } from "./hooks/useVehicleSave";
import { useVehicleShare } from "./hooks/useVehicleShare";

interface VehicleActionBarProps {
	vin?: string | null;
	title?: string | null;
	year?: number | null;
	make?: string | null;
	model?: string | null;
	fallbackHref?: string;
}

export function VehicleActionBar({
	vin,
	title,
	year,
	make,
	model,
	fallbackHref = "/",
}: VehicleActionBarProps) {
	const router = useRouter();
	const { isSaved, toggleSave, canSave } = useVehicleSave(vin);
	const { shareStatus, handleShare } = useVehicleShare({
		title,
		year,
		make,
		model,
	});
	const shareLabel = shareStatus === "copied" ? "Link Copied" : "Share";

	const handleBack = useCallback(() => {
		if (typeof window !== "undefined" && window.history.length > 1) {
			router.back();
			return;
		}

		router.push(fallbackHref || "/");
	}, [fallbackHref, router]);

	return (
		<div className='container mx-auto flex flex-nowrap items-center justify-start gap-3 overflow-x-auto px-4 py-2 text-[#0F172A] sm:flex-wrap sm:justify-between sm:overflow-visible'>
			<button
				type='button'
				onClick={handleBack}
				className='inline-flex shrink-0 items-center gap-2 rounded-full border border-black/10 bg-white px-6 py-3 text-base font-semibold shadow-[0_20px_60px_rgba(15,23,42,0.15)] transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F172A]'
			>
				<ArrowLeft className='h-4 w-4' />
				Back
			</button>

			<div className='flex flex-nowrap items-center gap-3 sm:flex-wrap'>
				<button
					type='button'
					onClick={toggleSave}
					disabled={!canSave}
					className={`inline-flex shrink-0 items-center gap-2 rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-semibold shadow-[0_20px_60px_rgba(15,23,42,0.15)] transition-all duration-200 cursor-pointer ${
						canSave
							? "hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F172A]"
							: "cursor-not-allowed opacity-60"
					}`}
				>
					<Heart
						className='h-4 w-4'
						fill={isSaved ? "currentColor" : "none"}
					/>
					{isSaved ? "Favorited" : "Favorite"}
				</button>

				<button
					type='button'
					onClick={handleShare}
					className='inline-flex shrink-0 items-center gap-2 rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-semibold shadow-[0_20px_60px_rgba(15,23,42,0.15)] transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F172A] cursor-pointer '
				>
					<Share2 className='h-4 w-4' />
					{shareLabel}
				</button>
			</div>
		</div>
	);
}
