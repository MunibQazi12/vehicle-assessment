/**
 * SRP Page Wrapper Component
 * 
 * Wraps SRP content with ClientSideFilteringProvider to enable
 * client-side filtering without page reloads.
 */

"use client";

import type { ReactNode } from "react";
import { ClientSideFilteringProvider } from "@dealertower/lib/context/ClientSideFilteringContext";
import { useDynamicTitle } from "@dealertower/lib/hooks/useDynamicTitle";
import type { FilterState } from "@dealertower/types/filters";
import type { SRPRowsResponse, FiltersResponse } from "@dealertower/types/api";

interface SRPPageWrapperProps {
  children: ReactNode;
  initialFilters: FilterState;
  dealerId: string;
  hostname: string;
  initialSortBy?: string;
  initialOrder?: "asc" | "desc";
  initialSearch?: string;
  initialVehicleData?: SRPRowsResponse;
  initialFilterData?: FiltersResponse;
  conditionPrefix: "new-vehicles" | "used-vehicles";
  dealershipName?: string;
}

export function SRPPageWrapper({
  children,
  initialFilters,
  dealerId,
  hostname,
  initialSortBy,
  initialOrder,
  initialSearch,
  initialVehicleData,
  initialFilterData,
  conditionPrefix,
  dealershipName,
}: SRPPageWrapperProps) {
  return (
    <ClientSideFilteringProvider
      initialFilters={initialFilters}
      dealerId={dealerId}
      hostname={hostname}
      initialSortBy={initialSortBy}
      initialOrder={initialOrder}
      initialSearch={initialSearch}
      initialVehicleData={initialVehicleData}
      initialFilterData={initialFilterData}
    >
      <TitleUpdater conditionPrefix={conditionPrefix} dealershipName={dealershipName} />
      {children}
    </ClientSideFilteringProvider>
  );
}

/**
 * Internal component that listens to URL changes and updates the page title
 */
function TitleUpdater({
  conditionPrefix,
  dealershipName,
}: {
  conditionPrefix: "new-vehicles" | "used-vehicles";
  dealershipName?: string;
}) {
  // Hook reads pathname directly, no need to pass filters
  useDynamicTitle({
    conditionPrefix,
    dealerName: dealershipName,
  });
  
  return null;
}
