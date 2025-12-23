/**
 * Infinite scroll hook using Intersection Observer API
 * Triggers callback when sentinel element enters viewport
 * Standard implementation with debouncing to prevent duplicate triggers
 */

"use client";

import { useEffect, useRef, useCallback } from "react";

interface UseInfiniteScrollOptions {
  /**
   * Callback fired when sentinel enters viewport
   */
  onLoadMore: () => void;
  /**
   * Whether there are more items to load
   */
  hasMore: boolean;
  /**
   * Whether currently loading
   */
  isLoading: boolean;
  /**
   * Root margin for intersection observer (default: "100px")
   * Increase this value to trigger loading earlier (e.g., "400px" loads 400px before reaching sentinel)
   */
  rootMargin?: string;
  /**
   * Intersection threshold (default: 0)
   * 0 = as soon as 1px is visible
   * 1 = entire element must be visible
   */
  threshold?: number;
}

/**
 * Hook for implementing infinite scroll with Intersection Observer
 * 
 * Uses a single sentinel element that should always be rendered (not conditionally)
 * when hasMore is true. The observer automatically handles load triggering.
 * 
 * @example
 * ```tsx
 * const sentinelRef = useInfiniteScroll({
 *   onLoadMore: loadNextPage,
 *   hasMore: hasNext,
 *   isLoading: loading,
 *   rootMargin: "400px", // Start loading 400px before sentinel
 *   threshold: 0, // Trigger as soon as sentinel appears
 * });
 * 
 * return (
 *   <>
 *     {items.map(item => <Item key={item.id} {...item} />)}
 *     {hasMore && <div ref={sentinelRef} style={{ height: '1px' }} />}
 *   </>
 * );
 * ```
 */
export function useInfiniteScroll({
  onLoadMore,
  hasMore,
  isLoading,
  rootMargin = "100px",
  threshold = 0,
}: UseInfiniteScrollOptions) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const hasTriggeredRef = useRef(false);
  
  // Use refs to access latest values without recreating observer
  const hasMoreRef = useRef(hasMore);
  const isLoadingRef = useRef(isLoading);
  const onLoadMoreRef = useRef(onLoadMore);

  // Keep refs updated
  useEffect(() => {
    hasMoreRef.current = hasMore;
    isLoadingRef.current = isLoading;
    onLoadMoreRef.current = onLoadMore;
  });

  // Reset trigger flag when loading completes
  useEffect(() => {
    if (!isLoading) {
      hasTriggeredRef.current = false;
    }
  }, [isLoading]);

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      
      // Only trigger if:
      // 1. Sentinel is intersecting viewport
      // 2. Has more items to load
      // 3. Not currently loading
      // 4. Haven't already triggered (debounce)
      if (
        entry.isIntersecting &&
        hasMoreRef.current &&
        !isLoadingRef.current &&
        !hasTriggeredRef.current
      ) {
        hasTriggeredRef.current = true;
        onLoadMoreRef.current();
      }
    },
    [] // No dependencies - callback never recreated
  );

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    // Create intersection observer
    observerRef.current = new IntersectionObserver(handleIntersection, {
      rootMargin,
      threshold,
    });

    // Start observing
    observerRef.current.observe(sentinel);

    // Cleanup
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleIntersection, rootMargin, threshold]);

  return sentinelRef;
}
