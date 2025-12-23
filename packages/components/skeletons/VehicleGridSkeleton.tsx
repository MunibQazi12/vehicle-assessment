/**
 * Vehicle Grid Skeleton Loader
 * Displays placeholder cards while vehicle data is loading
 * 
 * Grid layout: 1 col (mobile) → 2 cols (sm/md) → 3 cols (lg/xl) → 5 cols (2xl)
 * Default count: 30 items (LCM of 1, 2, 3, 5) ensures complete rows at all breakpoints
 */

import { VehicleCardSkeleton } from "./VehicleCardSkeleton";

interface VehicleGridSkeletonProps {
  count?: number;
}

export function VehicleGridSkeleton({ count = 30 }: VehicleGridSkeletonProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 min-[120rem]:grid-cols-4 min-[140rem]:grid-cols-5">
      {Array.from({ length: count }).map((_, index) => (
        <VehicleCardSkeleton key={index} />
      ))}
    </div>
  );
}
