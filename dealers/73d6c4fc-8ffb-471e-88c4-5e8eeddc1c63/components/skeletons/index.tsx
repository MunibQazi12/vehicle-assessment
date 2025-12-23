/**
 * Skeleton loader for brand cards
 * Displays while brand data is being fetched
 */

export function BrandCardSkeleton() {
  return (
    <div className="flex items-center justify-center p-4 animate-pulse">
      <div className="h-12 lg:h-16 w-full bg-gray-200 rounded"></div>
    </div>
  );
}

/**
 * Skeleton loader for BrandsSection grid
 */
export function BrandsSectionSkeleton() {
  return (
    <section className="py-12 md:py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Title Skeleton */}
        <div className="flex justify-center mb-8 lg:mb-12">
          <div className="h-8 w-64 bg-gray-200 rounded animate-pulse"></div>
        </div>

        {/* Grid Skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 lg:gap-6">
          {Array.from({ length: 15 }).map((_, i) => (
            <BrandCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Skeleton loader for dealer cards
 */
export function DealerCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
      <div className="h-48 bg-gray-200 rounded mb-4"></div>
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
    </div>
  );
}

/**
 * Skeleton loader for stats bar
 */
export function StatsBarSkeleton() {
  return (
    <div className="bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="text-center animate-pulse">
              <div className="h-10 w-24 bg-gray-200 rounded mx-auto mb-2"></div>
              <div className="h-4 w-32 bg-gray-200 rounded mx-auto"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
