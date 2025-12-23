import { VehicleGridSkeleton } from "@dealertower/components/skeletons/VehicleGridSkeleton";
import { FiltersSkeleton } from "@dealertower/components/skeletons/FiltersSkeleton";

export default function SRPLoading() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="w-full py-8">
				<div className="flex flex-col gap-6 lg:flex-row">
					<main className="flex-1 lg:order-2 pr-18">
						{/* Mobile filters drawer button area - only visible on mobile */}
						<div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between lg:hidden">
							<div className="flex w-full items-center gap-3 sm:w-auto sm:flex-shrink-0 sm:justify-end justify-end">
								<div className="h-10 w-32 animate-pulse rounded bg-zinc-200" />
							</div>
            </div>
            
						{/* VehicleResultsHeading skeleton */}
						<div className="mb-3">
              <div className="h-8 w-64 animate-pulse rounded bg-zinc-200" />
            </div>
            
						{/* SRPIconsCarousel skeleton */}
						<div
							className="mb-3 max-w-[1440px] overflow-hidden rounded-[24px] px-8 py-3 animate-pulse"
							style={{
								background:
									"linear-gradient(0deg, #EEEEEE, #EEEEEE), linear-gradient(0deg, #D8E3EA, #D8E3EA)",
							}}
						>
							<div className="flex items-center justify-between">
								<div className="h-6 w-48 animate-pulse rounded bg-zinc-300/50" />
								<div className="flex items-center gap-1">
									<div className="h-6 w-6 animate-pulse rounded-full bg-zinc-300/50" />
									<div className="h-6 w-6 animate-pulse rounded-full bg-zinc-300/50" />
								</div>
							</div>
							<div className="mt-2 flex items-center gap-3">
								{Array.from({ length: 6 }).map((_, i) => (
									<div key={i} className="h-[100px] w-[150px] animate-pulse rounded-full bg-zinc-300/50" />
								))}
							</div>
						</div>

						{/* TrendingNow skeleton */}
						<div className="ml-10 mt-10 flex items-center gap-6">
							<div className="h-7 w-32 animate-pulse rounded bg-zinc-200" />
							<div className="flex items-center gap-2">
								{Array.from({ length: 3 }).map((_, i) => (
									<div key={i} className="h-8 w-20 animate-pulse rounded-full bg-zinc-200" />
								))}
							</div>
						</div>

						{/* ClientVehicleGrid container skeleton */}
						<div className="mt-4 space-y-6">
							<div className="relative min-h-[400px] bg-white rounded-[30px] p-[30px]">
								{/* Search bar, Sort, Compare skeleton */}
								<div className="w-full max-w-[1663px] mx-auto mb-8 md:mb-12">
									<div className="flex items-center justify-between gap-6">
										{/* Search bar skeleton */}
										<div className="h-[54px] flex-1 animate-pulse rounded-[37px] bg-zinc-200" />
										{/* Sort by skeleton */}
										<div className="h-10 w-32 animate-pulse rounded bg-zinc-200" />
										{/* Compare toggle skeleton */}
										<div className="flex items-center gap-3 whitespace-nowrap">
											<div className="h-5 w-16 animate-pulse rounded bg-zinc-200" />
											<div className="h-4 w-10 animate-pulse rounded-full bg-zinc-200" />
										</div>
									</div>
								</div>

								{/* Vehicle grid skeleton */}
            <VehicleGridSkeleton count={30} />
							</div>
						</div>
          </main>

					{/* Sidebar skeleton */}
					<aside className="hidden w-full lg:order-1 lg:block lg:w-74 lg:flex-shrink-0">
						<FiltersSkeleton count={8} />
          </aside>
        </div>
      </div>
    </div>
  );
}
