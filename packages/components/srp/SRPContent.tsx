/**
 * SRP Content Wrapper (Client Component)
 * Handles loading states during filter changes
 */

"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { VehicleGridSkeleton } from "../skeletons/VehicleGridSkeleton";
import type { ReactNode } from "react";

interface SRPContentProps {
  children: ReactNode;
}

export function SRPContent({ children }: SRPContentProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isNavigating, setIsNavigating] = useState(false);
  
  // Track previous URL for comparison
  const prevUrlRef = useRef<string | null>(null);
  const currentUrl = `${pathname}?${searchParams.toString()}`;

  // Reset navigation state when URL changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Intentionally syncing navigation state with URL
    setIsNavigating(false);
    prevUrlRef.current = currentUrl;
  }, [currentUrl]);

  // Show loading skeleton during navigation
  if (isNavigating) {
    return (
      <div>
        <div className="mb-6 flex items-center justify-between">
          <div className="h-8 w-64 animate-pulse rounded bg-zinc-200" />
        </div>
        <VehicleGridSkeleton />
      </div>
    );
  }

  return <>{children}</>;
}
