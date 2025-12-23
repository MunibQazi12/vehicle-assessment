/**
 * Filters Sidebar Skeleton Loader
 * Displays placeholder for filters while data is loading
 * Matches the structure of FiltersSidebar component
 */

interface FiltersSkeletonProps {
  count?: number;
}

export function FiltersSkeleton({ count = 8 }: FiltersSkeletonProps) {
  return (
		<div className="space-y-6 pt-4 pb-2">
			{/* Header - matches FiltersSidebar header structure */}
			<div className="flex items-center justify-between px-4">
				<div className="h-7 w-16 animate-pulse rounded bg-zinc-200" />
				{/* Conditional "Clear All" button skeleton - may or may not show */}
				<div className="h-5 w-16 animate-pulse rounded bg-zinc-200" />
			</div>

			{/* ActiveFilters skeleton - matches ActiveFilters component */}
			<div className="px-4 pb-8 shadow-[0_2px_4px_-2px_rgba(0,0,0,0.1)]">
          <div className="h-5 w-32 animate-pulse rounded bg-zinc-200" />
				<div className="flex flex-wrap gap-2 items-center mt-4">
					{/* Filter chips skeleton */}
					{Array.from({ length: 3 }).map((_, i) => (
						<div key={i} className="h-8 w-24 animate-pulse rounded-full bg-zinc-200" />
					))}
          </div>
			</div>

			{/* Filter Groups - matches FilterGroup component structure */}
			<div className="space-y-6">
				{Array.from({ length: count }).map((_, index) => (
					<div key={index} className="space-y-3 border-b border-zinc-200 mb-0 last:border-0">
						{/* Some filters are switch type, some are expandable - mix them */}
						{index % 4 === 0 ? (
							// Switch filter skeleton
							<label className="flex items-center justify-between px-4 py-3.5 animate-pulse">
								<div className="h-5 w-32 rounded bg-zinc-200" />
								<div className="h-6 w-11 rounded-full bg-zinc-200" />
							</label>
						) : (
							// Expandable filter skeleton
							<>
								{/* Filter Header - expandable button with chevron and badge */}
								<button
									type="button"
									className="flex w-full items-center justify-between gap-3 px-4 py-3.5 m-0 animate-pulse"
									disabled
								>
									<span className="flex items-center gap-2">
										{/* Chevron icon skeleton */}
										<div className="h-5 w-5 rounded bg-zinc-200" />
										{/* Filter label */}
										<div className="h-5 w-32 rounded bg-zinc-200" />
									</span>
									{/* Selected count badge skeleton - may or may not show */}
									{index % 3 === 0 && (
										<div className="h-6 min-w-6 rounded-full bg-zinc-200" />
									)}
								</button>
								{/* Filter Options - collapsed by default (max-h-0 opacity-0) */}
								{/* Skeleton shows collapsed state, so we don't render expanded content */}
							</>
						)}
        </div>
      ))}
			</div>
    </div>
  );
}
