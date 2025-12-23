"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { BODY_STYLE_ICONS } from "./constants/cars";
import { CarIcon } from "@dealertower/svgs/icons";
import { useUrlState } from "@dealertower/lib/hooks/useUrlState";
import { useFilterValues } from "@dealertower/lib/hooks/useClientSideFilters";

/**
 * SRP Icons Carousel
 * Gradient bar with SVG icons in a Swiper and custom navigation arrows.
 * Intended to be rendered above VehicleResultsHeading.
 */
export function SRPIconsCarousel() {
	const prevRef = useRef<HTMLButtonElement | null>(null);
	const nextRef = useRef<HTMLButtonElement | null>(null);

	// Use the same body style icons as the Body Style filter dropdown
	const bodyStyleEntries = Object.entries(BODY_STYLE_ICONS);

	// Get filter state hooks
	const { toggleArrayFilter } = useUrlState();
	const currentBodyValues = useFilterValues("body");

	return (
		<div
			className="mb-3 overflow-hidden rounded-[24px] pl-8 py-3 mx-4 xl:mx-0"
			style={{
				background:
					"linear-gradient(0deg, #EEEEEE, #EEEEEE), linear-gradient(0deg, #D8E3EA, #D8E3EA)",
			}}
		>
			{/* Custom navigation buttons in top-right corner */}
			<div className="top-2 right-3 flex items-center justify-between gap-[2px]">
				<div className="flex items-center gap-1">
					<span>
						<CarIcon />
					</span>
					<p>What <span className="font-semibold">kind</span> of car do you want?</p>
				</div>
				<div className="flex items-center gap-1">
					<button
						type="button"
						ref={prevRef}
						className="flex h-6 w-6 items-center justify-center rounded-full bg-white shadow border border-zinc-200 text-zinc-600 hover:bg-zinc-50 cursor-pointer"
						aria-label="Previous"
					>
						<ChevronLeft className="h-5 w-5" />
					</button>
					<button
						type="button"
						ref={nextRef}
						className="flex h-6 w-6 items-center justify-center rounded-full bg-white shadow border border-zinc-200 text-zinc-600 hover:bg-zinc-50 cursor-pointer"
						aria-label="Next"
					>
						<ChevronRight className="h-5 w-5" />
					</button>
				</div>
			</div>

			<Swiper
				slidesPerView="auto"
				spaceBetween={12}
				modules={[Navigation]}
				onBeforeInit={(swiper) => {
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					const nav = swiper.params.navigation as any;
					if (prevRef.current && nextRef.current) {
						nav.prevEl = prevRef.current;
						nav.nextEl = nextRef.current;
					}
				}}
				navigation={{
					prevEl: prevRef.current,
					nextEl: nextRef.current,
				}}
				className="mt-2 w-full"
			>
				{bodyStyleEntries.map(([bodyStyleKey, BodyIcon]) => {
					// Convert "bare chassis" -> "Bare Chassis", then add "s" -> "Bare Chassiss"
					// (per requirement: first letter capital, rest lowercase, and add "s" at the end of every name)
					const titleCase = bodyStyleKey
						.split(" ")
						.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
						.join(" ");
					const label = `${titleCase}s`;

					// Check if this body style is currently selected
					const isChecked = currentBodyValues.includes(bodyStyleKey);

					// Icon color changes based on selection state (same as FilterGroup)
					const iconColor = isChecked ? "white" : "black";

					return (
						<SwiperSlide key={bodyStyleKey} className="!w-auto">
							<button
								type="button"
								onClick={() => toggleArrayFilter("body", bodyStyleKey)}
								className={`flex h-[100px] w-[150px] flex-col items-center justify-center gap-1 rounded-full shadow-sm border-2 px-2 transition cursor-pointer ${isChecked
										? "border-zinc-900 bg-zinc-900"
										: "border-zinc-200 bg-white/80 hover:border-zinc-900 hover:bg-zinc-50"
									}`}
								aria-pressed={isChecked}
							>
								<span className="flex items-center justify-center">
									<BodyIcon fill={iconColor} />
								</span>
								<span className={`font-medium tracking-wide text-center leading-snug ${isChecked ? "text-zinc-50" : "text-zinc-800"
									}`}>
									{label}
								</span>
							</button>
						</SwiperSlide>
					);
				})}
			</Swiper>
		</div>
	);
}


