"use client";

import { useRef, useState } from "react";
import { SRPVehicle } from "@dealertower/types/api";
import { SimilarVehicleCard } from "./SimilarVehicleCard";
import { Button } from "@dealertower/components/ui/button";

interface SimilarVehiclesProps {
	vehicles: SRPVehicle[];
}

export function SimilarVehicles({ vehicles }: SimilarVehiclesProps) {
	const scrollContainerRef = useRef<HTMLDivElement>(null);
	const [isDragging, setIsDragging] = useState(false);
	const [startX, setStartX] = useState(0);
	const [scrollLeft, setScrollLeft] = useState(0);

	if (!vehicles || vehicles.length === 0) {
		return null;
	}

	const scroll = (direction: "left" | "right") => {
		if (scrollContainerRef.current) {
			const scrollAmount = 300;
			const newScrollPosition =
				scrollContainerRef.current.scrollLeft +
				(direction === "left" ? -scrollAmount : scrollAmount);

			scrollContainerRef.current.scrollTo({
				left: newScrollPosition,
				behavior: "smooth",
			});
		}
	};

	const handleMouseDown = (e: React.MouseEvent) => {
		if (!scrollContainerRef.current) return;
		setIsDragging(true);
		setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
		setScrollLeft(scrollContainerRef.current.scrollLeft);
	};

	const handleMouseMove = (e: React.MouseEvent) => {
		if (!isDragging || !scrollContainerRef.current) return;
		e.preventDefault();
		const x = e.pageX - scrollContainerRef.current.offsetLeft;
		const walk = (x - startX) * 2;
		scrollContainerRef.current.scrollLeft = scrollLeft - walk;
	};

	const handleMouseUp = () => {
		setIsDragging(false);
	};

	const handleMouseLeave = () => {
		setIsDragging(false);
	};

	return (
		<div className='py-12'>
			<div className='container mx-auto px-4'>
				<div className='flex items-center justify-between mb-8'>
					<div>
						<h2 className='text-2xl font-bold text-[#101828] mb-1'>
							You May Also Like
						</h2>
						<p className='text-[#99A1AF] text-sm '>
							Similar vehicles in our inventory
						</p>
					</div>

					{/* Navigation Buttons */}
					{vehicles.length > 4 && (
						<div className='hidden md:flex gap-2'>
							<Button
								type='button'
								variant='outline'
								onClick={() => scroll("left")}
								className='p-2 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors'
								aria-label='Scroll left'
							>
								<svg
									className='h-6 w-6 text-gray-600'
									fill='none'
									viewBox='0 0 24 24'
									stroke='currentColor'
								>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M15 19l-7-7 7-7'
									/>
								</svg>
							</Button>
							<Button
								type='button'
								variant='outline'
								onClick={() => scroll("right")}
								className='p-2 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors'
								aria-label='Scroll right'
							>
								<svg
									className='h-6 w-6 text-gray-600'
									fill='none'
									viewBox='0 0 24 24'
									stroke='currentColor'
								>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M9 5l7 7-7 7'
									/>
								</svg>
							</Button>
						</div>
					)}
				</div>

				{/* Static list for mobile */}
				<div className='flex flex-col gap-6 md:hidden'>
					{vehicles.map((vehicle) => (
						<SimilarVehicleCard key={vehicle.vin_number} vehicle={vehicle} />
					))}
				</div>

				{/* Horizontal Scrollable Container for md+ */}
				<div
					ref={scrollContainerRef}
					className={`hidden md:flex gap-6 overflow-x-auto pb-6 select-none scrollbar-hide ${
						isDragging ? "cursor-grabbing" : "cursor-grab"
					}`}
					style={{
						scrollbarWidth: "none",
						msOverflowStyle: "none",
					}}
					onMouseDown={handleMouseDown}
					onMouseMove={handleMouseMove}
					onMouseUp={handleMouseUp}
					onMouseLeave={handleMouseLeave}
				>
					{vehicles.map((vehicle) => (
						<SimilarVehicleCard key={vehicle.vin_number} vehicle={vehicle} />
					))}
				</div>
			</div>
		</div>
	);
}
