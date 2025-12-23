/**
 * Dynamic Title Hook
 * 
 * Updates document title based on URL pathname (path-based filters only).
 * Only uses make/model from URL path to match SSR behavior.
 * This ensures consistent title generation on both server and client side.
 */

"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { parseSlug } from "@dealertower/lib/url/parser";
import { generateSRPTitle } from "@dealertower/lib/utils";

interface UseDynamicTitleOptions {
  conditionPrefix: "new-vehicles" | "used-vehicles";
  dealerName?: string;
}

/**
 * Hook to dynamically update document title based on URL path
 * Only reacts to pathname changes (make/model in path) to match SSR behavior
 */
export function useDynamicTitle({
  conditionPrefix,
  dealerName,
}: UseDynamicTitleOptions) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Only update on client side
    if (typeof window === "undefined") return;

    // Parse current URL path to extract make/model/condition
    const pathSegments = pathname.split('/').filter(Boolean);
    const { filters } = parseSlug(pathSegments);
    
    const makeValue = (filters.make as string[] | undefined)?.[0];
    const modelValue = (filters.model as string[] | undefined)?.[0];
    
    // Get conditions from path
    const pathConditions = (filters.condition as string[] | undefined) || [];
    
    // Get conditions from query params
    const queryCondition = searchParams.get('condition');
    let queryConditions: string[] = [];
    if (queryCondition) {
      queryConditions = queryCondition.includes(',') 
        ? queryCondition.split(',') 
        : [queryCondition];
    }
    
    // Combine and deduplicate conditions
    const allConditions = [...new Set([...pathConditions, ...queryConditions])];
    
    const newTitle = generateSRPTitle(
      conditionPrefix,
      makeValue,
      modelValue,
      dealerName,
      allConditions.length > 0 ? allConditions : undefined
    );
    document.title = newTitle;

    // Clean up: restore to default on unmount
    return () => {
      const defaultTitle = generateSRPTitle(
        conditionPrefix,
        undefined,
        undefined,
        dealerName
      );
      document.title = defaultTitle;
    };
  }, [pathname, searchParams, conditionPrefix, dealerName]);
}
