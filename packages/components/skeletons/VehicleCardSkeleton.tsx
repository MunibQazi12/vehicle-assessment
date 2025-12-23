/**
 * Vehicle Card Skeleton Loader
 * Displays placeholder for individual vehicle card matching NewVehicleCard.tsx structure
 */

export function VehicleCardSkeleton() {
	return (
		<div className="flex flex-col bg-white rounded-xl shadow-[0_2.644px_10.047px_0_rgba(99,99,99,0.25)] overflow-hidden w-full">
			{/* Image Skeleton - matches NewVehicleCard image dimensions */}
			<div className="relative h-[280px] sm:h-[320px] md:h-[362px] w-full overflow-hidden rounded-t-xl bg-zinc-200 animate-pulse" />

			{/* Content Skeleton */}
			<div className="flex flex-col gap-6 p-2 sm:p-4 md:p-5">
				<div className="flex flex-col gap-6">
					{/* Title Skeleton */}
					<div className="h-[19px] w-3/4 animate-pulse rounded bg-zinc-200" />

					{/* Swiper carousel chips skeleton */}
					<div className="flex items-center gap-2">
						<div className="h-6 w-20 animate-pulse rounded-2xl bg-zinc-200" />
						<div className="h-6 w-16 animate-pulse rounded-2xl bg-zinc-200" />
						<div className="h-6 w-24 animate-pulse rounded-2xl bg-zinc-200" />
						<div className="h-6 w-20 animate-pulse rounded-2xl bg-zinc-200" />
					</div>

					{/* Price section skeleton */}
					<div className="flex items-center justify-between gap-5 pt-4">
						<div className="flex items-center gap-2">
							<div className="flex flex-col gap-0.5">
								{/* Price label with dropdown skeleton */}
								<div className="flex items-center gap-4">
									<div className="h-[18px] w-24 animate-pulse rounded bg-zinc-200" />
									<div className="h-3 w-3 animate-pulse rounded bg-zinc-200" />
								</div>
								{/* Price value skeleton */}
								<div className="h-[26px] w-32 animate-pulse rounded bg-zinc-200" />
							</div>
						</div>

						{/* Color swatches skeleton */}
						<div className="flex items-center gap-1">
							<div className="h-1.5 w-8 animate-pulse rounded bg-zinc-200" />
							<div className="h-1.5 w-8 animate-pulse rounded bg-zinc-200" />
						</div>
					</div>

					{/* CTA buttons skeleton */}
					<div className="flex flex-col gap-3 pt-2">
						{/* First button - full width */}
						<div className="h-12 w-full animate-pulse rounded-lg bg-zinc-200" />
						{/* Second row buttons - side by side */}
						{/* <div className="flex gap-3">
							<div className="h-12 flex-1 animate-pulse rounded-lg bg-zinc-200" />
							<div className="h-12 flex-1 animate-pulse rounded-lg bg-zinc-200" />
						</div> */}
					</div>
				</div>

				{/* Vehicle logos skeleton */}
				<div className="flex items-center justify-between gap-4">
					<div className="h-10 w-20 animate-pulse rounded bg-zinc-200" />
				</div>
			</div>
		</div>
	);
}
