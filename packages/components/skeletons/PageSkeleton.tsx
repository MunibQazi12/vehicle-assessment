/**
 * Generic page skeleton loader
 * Used for dealer-specific pages while content is loading
 */

export function PageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page title skeleton */}
      <div className="mb-8">
        <div className="h-10 bg-gray-200 rounded-lg w-1/3 animate-pulse mb-4" />
        <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
      </div>

      {/* Content blocks skeleton */}
      <div className="space-y-6">
        <div className="h-32 bg-gray-200 rounded-lg animate-pulse" />
        <div className="h-48 bg-gray-200 rounded-lg animate-pulse" />
        <div className="h-40 bg-gray-200 rounded-lg animate-pulse" />
      </div>

      {/* Additional content skeleton */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-64 bg-gray-200 rounded-lg animate-pulse" />
        <div className="h-64 bg-gray-200 rounded-lg animate-pulse" />
      </div>
    </div>
  );
}
