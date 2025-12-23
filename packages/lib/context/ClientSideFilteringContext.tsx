/**
 * Client-Side Filtering Context
 * 
 * Manages filter state for client-side filtering without page reloads.
 * Provides:
 * - Current filter state (source of truth during client-side filtering)
 * - Loading states (isLoading, isPending)
 * - Data (vehicleData, filterData)
 * - Update function (updateFiltersClientSide)
 * 
 * This context allows filter changes to update the UI instantly without
 * triggering Next.js navigation and Server Component refreshes.
 */

"use client";

import {
	createContext,
	useContext,
	useState,
	useTransition,
	useEffect,
	useRef,
	useCallback,
	type ReactNode,
} from "react";
import type { FilterState } from "@dealertower/types/filters";
import type { SRPRowsResponse, FiltersResponse } from "@dealertower/types/api";
import { buildUrl, buildUrlAndNormalizeFilters } from "@dealertower/lib/url/builder";
import { getFilterCache } from "@dealertower/lib/cache/client-filter-cache";

interface ClientSideFilteringContextValue {
	// State flags
	isClientMode: boolean;
	isLoading: boolean;
	isPending: boolean;

	// Filter state (source of truth for UI during client-side filtering)
	currentFilters: FilterState | null;

	// Sort state
	currentSortBy: string | null;
	currentOrder: "asc" | "desc" | null;

	// Search state
	currentSearch: string | null;

	// Fetched data
	vehicleData: SRPRowsResponse | null;
	filterData: FiltersResponse | null;

	// Error state
	error: string | null;

	// Update function
	updateFiltersClientSide: (
		newFilters: FilterState,
		options?: {
			resetPage?: boolean;
			sortBy?: string;
			order?: "asc" | "desc";
			search?: string;
		}
	) => Promise<void>;
}

const ClientSideFilteringContext = createContext<
	ClientSideFilteringContextValue | undefined
>(undefined);

interface ClientSideFilteringProviderProps {
	children: ReactNode;
	initialFilters: FilterState;
	dealerId: string;
	hostname: string;
	initialSortBy?: string;
	initialOrder?: "asc" | "desc";
	initialSearch?: string;
	initialVehicleData?: SRPRowsResponse;
	initialFilterData?: FiltersResponse;
}

export function ClientSideFilteringProvider({
	children,
	initialFilters,
	// Note: dealerId and hostname are required in props for caller context, 
	// but not used here as API routes read from env vars
	initialSortBy,
	initialOrder,
	initialSearch,
	initialVehicleData,
	initialFilterData,
}: ClientSideFilteringProviderProps) {
	// Client mode flag (starts false for SSR compatibility)
	const [isClientMode, setIsClientMode] = useState(false);

	// Loading states
	const [isLoading, setIsLoading] = useState(false);
	const [isPending, startTransition] = useTransition();

	// Filter state
	const [currentFilters, setCurrentFilters] = useState<FilterState | null>(
		initialFilters
	);

	// Sort state (initialized from server-side values)
	const [currentSortBy, setCurrentSortBy] = useState<string | null>(initialSortBy || null);
	const [currentOrder, setCurrentOrder] = useState<"asc" | "desc" | null>(initialOrder || null);

	// Search state (initialized from server-side value)
	const [currentSearch, setCurrentSearch] = useState<string | null>(initialSearch || null);

	// Fetched data
	const [vehicleData, setVehicleData] = useState<SRPRowsResponse | null>(null);
	const [filterData, setFilterData] = useState<FiltersResponse | null>(null);

	// Error state
	const [error, setError] = useState<string | null>(null);

	// Abort controller for canceling previous requests
	const abortControllerRef = useRef<AbortController | null>(null);

	// Seed cache with initial server-rendered data on mount
	useEffect(() => {
		if (initialVehicleData && initialFilterData) {
			const cache = getFilterCache();
			cache.set(
				initialFilters,
				initialVehicleData,
				initialFilterData,
				initialSortBy || null,
				initialOrder || null,
				initialSearch || null,
				1
			);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []); // Run once on mount

	// Enable client mode after mount
	useEffect(() => {
		setIsClientMode(true);
	}, []);

	/**
	 * Update filters and fetch new data without page reload
	 */
	const updateFiltersClientSide = useCallback(
		async (
			newFilters: FilterState,
			options?: {
				resetPage?: boolean;
				sortBy?: string;
				order?: "asc" | "desc";
				search?: string;
			}
		) => {
			const { resetPage = true, sortBy, order, search } = options || {};

			// Cancel previous request if still pending
			if (abortControllerRef.current) {
				abortControllerRef.current.abort();
			}

			// Create new abort controller
			const abortController = new AbortController();
			abortControllerRef.current = abortController;

			// Immediately update filter, sort, and search state for instant UI feedback
			setCurrentFilters(newFilters);
			setCurrentSortBy(sortBy !== undefined ? sortBy || null : currentSortBy);
			setCurrentOrder(order !== undefined ? order || null : currentOrder);
			setCurrentSearch(search !== undefined ? search || null : currentSearch);
			setIsLoading(true);
			setError(null);

			// Get cache instance
			const cache = getFilterCache();

			// Determine the page number for cache key
			const pageNumber = resetPage ? 1 : 1; // Always use page 1 for filter changes

			// Get current search value (handle undefined vs null)
			const searchValue = search !== undefined ? search || null : currentSearch;
			const finalSortBy = sortBy !== undefined ? sortBy || null : currentSortBy;
			const finalOrder = order !== undefined ? order || null : currentOrder;

			// Check cache first
			const cachedEntry = cache.get(
				newFilters,
				finalSortBy,
				finalOrder,
				searchValue,
				pageNumber
			);

			if (cachedEntry) {
				// Use cached data immediately
				setVehicleData(cachedEntry.vehicleData);
				setFilterData(cachedEntry.filterData);
				setIsLoading(false);

				// URL should already be updated by navigateWithFilters
				// Just ensure it's in sync (this is a safety check)
				const filtersForUrl = searchValue
					? { ...newFilters, search: searchValue }
					: newFilters;
				const { path, queryParams } = buildUrlAndNormalizeFilters(
					filtersForUrl,
					finalSortBy || undefined,
					finalOrder || undefined
				);
				const queryString = Object.keys(queryParams).length > 0
					? '?' + new URLSearchParams(queryParams).toString()
					: '';
				const fullUrl = `/${path}/${queryString}`;
				// Only update if different (navigateWithFilters should have already done this)
				if (window.location.pathname + window.location.search !== fullUrl) {
					window.history.replaceState(null, '', fullUrl);
				}
				return;
			}

			// Wrap data fetching in transition for non-blocking updates
			startTransition(async () => {
				try {
					// Build API request payloads
					// Merge search into filters for API compatibility
					const filtersWithSearch = search !== undefined
						? { ...newFilters, search }
						: newFilters;

					const vehicleRequestBody = {
						filters: filtersWithSearch,
						page: resetPage ? 1 : undefined,
						...(sortBy && { sortBy }),
						...(order && { order }),
					};

					const filterRequestBody = {
						filters: filtersWithSearch,
					};

					// Fetch both vehicles and filters in parallel
					const [vehicleResponse, filterResponse] = await Promise.all([
						fetch("/api/srp/vehicles/", {
							method: "POST",
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify(vehicleRequestBody),
							signal: abortController.signal,
						}),
						fetch("/api/srp/filters/", {
							method: "POST",
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify(filterRequestBody),
							signal: abortController.signal,
						}),
					]);

					// Check for errors
					if (!vehicleResponse.ok) {
						throw new Error(`Vehicle fetch failed: ${vehicleResponse.statusText}`);
					}
					if (!filterResponse.ok) {
						throw new Error(`Filter fetch failed: ${filterResponse.statusText}`);
					}

					// Parse responses
					const vehicleJson = (await vehicleResponse.json()) as SRPRowsResponse;
					const filterJson = (await filterResponse.json()) as FiltersResponse;

					// Cache the response
					cache.set(
						newFilters,
						vehicleJson,
						filterJson,
						finalSortBy,
						finalOrder,
						searchValue,
						pageNumber
					);

					// Update state with fetched data
					setVehicleData(vehicleJson);
					setFilterData(filterJson);

					// URL should already be updated by navigateWithFilters
					// Just ensure it's in sync (this is a safety check)
					const filtersForUrl = search !== undefined
						? { ...newFilters, search }
						: newFilters;
					const { path, queryParams } = buildUrlAndNormalizeFilters(filtersForUrl, sortBy, order);
					const queryString = Object.keys(queryParams).length > 0
						? '?' + new URLSearchParams(queryParams).toString()
						: '';
					const fullUrl = `/${path}/${queryString}`;

					// Only update if different (navigateWithFilters should have already done this)
					if (typeof window !== "undefined") {
						if (window.location.pathname + window.location.search !== fullUrl) {
							window.history.replaceState(null, "", fullUrl);
						}
					}
				} catch (err) {
					// Ignore abort errors
					if (err instanceof Error && err.name === "AbortError") {
						return;
					}

					console.error("[ClientSideFiltering] Error fetching data:", err);
					setError(err instanceof Error ? err.message : "Failed to fetch data");

					// Revert to previous filter state on error
					setCurrentFilters(initialFilters);
				} finally {
					setIsLoading(false);
				}
			});
		},
		[initialFilters, currentSortBy, currentOrder, currentSearch]
	);

	const value: ClientSideFilteringContextValue = {
		isClientMode,
		isLoading,
		isPending,
		currentFilters,
		currentSortBy,
		currentOrder,
		currentSearch,
		vehicleData,
		filterData,
		error,
		updateFiltersClientSide,
	};

	return (
		<ClientSideFilteringContext.Provider value={value}>
			{children}
		</ClientSideFilteringContext.Provider>
	);
}

/**
 * Hook to access client-side filtering context
 * 
 * Returns undefined if used outside of provider (for graceful fallback)
 */
export function useClientSideFilteringContext() {
	return useContext(ClientSideFilteringContext);
}
