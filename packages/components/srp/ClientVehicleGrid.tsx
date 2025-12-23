/**
 * Client-Side Vehicle Grid Wrapper with Infinite Scroll
 *
 * Wraps the vehicle grid and updates it when vehicleData changes
 * in the ClientSideFilteringContext (during client-side filtering).
 * Includes infinite scroll functionality for loading more vehicles.
 */

"use client";

import {
	useEffect,
	useState,
	useTransition,
	useCallback,
	useMemo,
} from "react";
import { useClientSideFilteringContext } from "@dealertower/lib/context/ClientSideFilteringContext";
import { useInfiniteScroll } from "@dealertower/lib/hooks/useInfiniteScroll";
import type { SortingOption, SRPVehicle } from "@dealertower/types/api";
import NewVehicleCard from "./NewVehicleCard";
import { VehicleGridSkeleton } from "../skeletons/VehicleGridSkeleton";
import { useTenant } from "@dealertower/lib/tenant/context";
import { SearchBar } from "./SearchBar";
import { DesktopSortBy } from "./SortBy";
import { MobileFiltersDrawer } from "./MobileFiltersDrawer";
// import { fetchFilters } from "@dealertower/lib/api/srp";

interface ClientVehicleGridProps {
	initialVehicles: SRPVehicle[];
	initialTotalCount: number;
	initialPage: number;
	initialHasNext: boolean;
	displayTitle: string;
	availableSorting: SortingOption[];
	filtersData: any;
}

export function ClientVehicleGrid({
	initialVehicles,
	initialTotalCount,
	initialPage,
	initialHasNext,
	availableSorting,
	filtersData
}: ClientVehicleGridProps) {
	const context = useClientSideFilteringContext();
	const { dealerIdentifier } = useTenant();

	// Get current sorting and search from context (source of truth for client-side operations)
	const sortBy = context?.currentSortBy;
	const order = context?.currentOrder;
	const search = context?.currentSearch;

	// Get loading states from context for overlay
	const isContextLoading = context?.isLoading || context?.isPending || false;

	// Local state for vehicle data
	const [vehicles, setVehicles] = useState(initialVehicles);
	const [totalCount, setTotalCount] = useState(initialTotalCount);
	const [currentPage, setCurrentPage] = useState(initialPage);
	const [hasNext, setHasNext] = useState(initialHasNext);
	const [isSwitchChecked, setIsSwitchChecked] = useState(false);

	// Infinite scroll state
	const [isPending, startTransition] = useTransition();
	const [loadError, setLoadError] = useState<string | null>(null);

	// Hide server-rendered grid after hydration
	useEffect(() => {
		const serverGrid = document.getElementById('server-grid');
		if (serverGrid) {
			serverGrid.style.display = 'none';
		}
	}, []);

	// Track filter, sort, AND search changes for resetting infinite scroll
	const filtersAndSortKey = useMemo(
		() =>
			JSON.stringify({
				filters: context?.currentFilters || {},
				sortBy,
				order,
				search,
			}),
		[context?.currentFilters, sortBy, order, search]
	);
	const [lastFiltersAndSortKey, setLastFiltersAndSortKey] =
		useState(filtersAndSortKey);

	// Update vehicles when context data changes (from filter updates)
	// This replaces the vehicle list (not appends)
	// Note: setState in effect is intentional here - we need to sync local state with external context
	/* eslint-disable react-hooks/set-state-in-effect -- Intentionally syncing local state with external context */
	useEffect(() => {
		if (context?.vehicleData) {
			setVehicles(context.vehicleData.data.vehicles);
			setTotalCount(context.vehicleData.data.counts);
			setCurrentPage(context.vehicleData.data.page);
			setHasNext(context.vehicleData.data.has_next);
		}
	}, [context?.vehicleData]);
	/* eslint-enable react-hooks/set-state-in-effect */

	// Reset infinite scroll state when filters or sort changes
	if (filtersAndSortKey !== lastFiltersAndSortKey) {
		setLastFiltersAndSortKey(filtersAndSortKey);
		setLoadError(null);
	}

	// Load more vehicles for infinite scroll
	// eslint-disable-next-line react-hooks/preserve-manual-memoization -- Memoization deps are intentionally specific
	const loadMore = useCallback(() => {
		if (!hasNext || isPending) {
			return;
		}

		setLoadError(null);

		startTransition(async () => {
			try {
				const nextPage = currentPage + 1;
				const apiUrl = `/api/vehicles/?page=${nextPage}&dealer=${dealerIdentifier}`;

				const response = await fetch(apiUrl, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						...(context?.currentFilters || {}),
						page: nextPage,
						items_per_page: 24,
						...(sortBy && { sort_by: sortBy }),
						...(order && { order }),
						...(search && { search }),
					}),
				});

				if (!response.ok) {
					const errorData = await response.json().catch(() => ({}));
					console.error("Failed to load more vehicles:", {
						url: apiUrl,
						status: response.status,
						statusText: response.statusText,
						error: errorData,
					});
					setLoadError("Failed to load more vehicles. Please try again.");
					return;
				}

				const data = await response.json();

				if (!data?.data?.vehicles) {
					console.error("Invalid API response structure:", data);
					setLoadError("Received invalid data from server.");
					setHasNext(false);
					return;
				}

				if (data.data.vehicles.length === 0) {
					setHasNext(false);
					return;
				}

				// Append new vehicles with deduplication
				setVehicles((prev) => {
					const existingKeys = new Set(
						prev.map((v) => v.vin_number || v.stock_number)
					);
					const newVehicles = data.data.vehicles.filter(
						(v: SRPVehicle) => !existingKeys.has(v.vin_number || v.stock_number)
					);

					if (newVehicles.length === 0 && data.data.vehicles.length > 0) {
						console.warn("All fetched vehicles were duplicates");
					}

					return [...prev, ...newVehicles];
				});
				setCurrentPage(data.data.page);
				setHasNext(data.data.has_next);
			} catch (error) {
				console.error("Error loading more vehicles:", error);
				setLoadError("An error occurred while loading. Please try again.");
			}
		});
	}, [
		hasNext,
		isPending,
		currentPage,
		dealerIdentifier,
		context?.currentFilters,
		sortBy,
		order,
		search,
	]);

	// Intersection observer sentinel for infinite scroll
	const sentinelRef = useInfiniteScroll({
		onLoadMore: loadMore,
		hasMore: hasNext,
		isLoading: isPending,
		rootMargin: "400px",
		threshold: 0,
	});

	// if (vehicles.length === 0) {
	// 	return (
	// 		<div className="mt-4 rounded-lg border border-zinc-200 bg-white p-12 text-center">
	// 			<svg
	// 				className="mx-auto h-12 w-12 text-zinc-400"
	// 				fill="none"
	// 				viewBox="0 0 24 24"
	// 				stroke="currentColor"
	// 			>
	// 				<path
	// 					strokeLinecap="round"
	// 					strokeLinejoin="round"
	// 					strokeWidth={2}
	// 					d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
	// 				/>
	// 			</svg>
	// 			<h3 className="mt-4 text-lg font-semibold text-zinc-900">
	// 				No vehicles found
	// 			</h3>
	// 			<p className="mt-2 text-sm text-zinc-500">
	// 				Try adjusting your filters to see more results.
	// 			</p>
	// 		</div>
	// 	);
	// }

	return (
		<div className="mt-4 space-y-6">

			{/* Vehicle grid container */}
			<div className="relative min-h-[400px] bg-white rounded-[30px] lg:p-[31px_34px_31px_30px] p-[17px_14px_15px_15px]">
				<div className="w-full mx-auto mb-8 md:mb-12">
					<div className="flex lg:flex-row flex-col lg:items-center justify-between gap-6">
						{/* Search bar */}
						<SearchBar />

						<div className=" flex items-center gap-6 flex-wrap-reverse  justify-between">

							<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
								<div className="flex w-full items-center gap-3 sm:w-auto sm:flex-shrink-0 sm:justify-end justify-end">
									<MobileFiltersDrawer
										availableFilters={filtersData.data.available_filters}
										availableSorting={filtersData.data.available_sorting}/>
								</div>
							</div>
							
							<div className="flex gap-4 items-center ">

								{/* Desktop sort by dropdown extracted to its own component */}
								<DesktopSortBy availableSorting={availableSorting} />

								{/* Compare toggle */}
								<div className="flex items-center gap-3 whitespace-nowrap">
									<span className="font-medium text-zinc-700">Compare</span>
									<button
										type="button"
										role="switch"
										aria-checked={isSwitchChecked}
										onClick={() => setIsSwitchChecked(!isSwitchChecked)}
										className={`relative inline-flex h-4 w-10 items-center rounded-full transition-all duration-200 cursor-pointer ${isSwitchChecked
											? "bg-[lightgray]"
											: "bg-[gray]"
											}`}
									>
										<span
											className={`pointer-events-none inline-block h-5 w-5 transform rounded-full shadow ring-0 transition duration-200 ease-in-out ${isSwitchChecked
												? "translate-x-5 bg-[blue]/50"
												: "translate-x-0 bg-white"
												}`}
										/>
									</button>
								</div>
							</div>
							
							
						</div>
					</div>
				</div>

				{/* Vehicle grid content */}
				{isContextLoading ? (
					// When filters / search / sort-by are updating, show full grid skeleton
					<VehicleGridSkeleton />
				) : vehicles.length === 0 ? (
					<div className="mt-4 rounded-lg border border-zinc-200 bg-white p-12 text-center">
						<svg
							className="mx-auto h-12 w-12 text-zinc-400"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
						<h3 className="mt-4 text-lg font-semibold text-zinc-900">
							No vehicles found
						</h3>
						<p className="mt-2 text-sm text-zinc-500">
							Try adjusting your filters to see more results.
						</p>
					</div>
				) : (
					// Vehicle grid - Responsive columns using CSS media queries
					<div className="grid gap-[18px] [@media(min-width:1921px)]:grid-cols-4 2xl:grid-cols-3 sm:grid-cols-2 grid-cols-1 sm:justify-normal justify-items-center">
						{vehicles.map((vehicle, index) => (
							<NewVehicleCard
								key={vehicle.vin_number || vehicle.stock_number}
								vehicle={vehicle}
								priority={index < 2}
							/>
						))}
					</div>
				)}
			</div>

			{/* Loading State */}
			{isPending && (
				<div className="mt-8">
					<VehicleGridSkeleton />
				</div>
			)}

			{/* Intersection Observer Sentinel */}
			{hasNext && (
				<div
					ref={sentinelRef}
					className="pointer-events-none h-px w-full"
					style={{ marginTop: "2rem" }}
					aria-hidden="true"
				/>
			)}

			{/* Error Message */}
			{loadError && (
				<div className="mt-8 rounded-lg border border-red-200 bg-red-50 p-4 text-center">
					<p className="text-sm text-red-600">{loadError}</p>
					<button
						onClick={() => {
							setLoadError(null);
							loadMore();
						}}
						className="mt-2 text-sm text-red-700 underline hover:text-red-800"
					>
						Try again
					</button>
				</div>
			)}

			{/* End of Results Message */}
			{!hasNext && vehicles.length > 0 && (
				<div className="mt-8 border-t border-zinc-200 pt-8 text-center">
					<p className="text-sm text-zinc-500">
						You&apos;ve reached the end of the results ({vehicles.length} of{" "}
						{totalCount} vehicles)
					</p>
				</div>
			)}
		</div>
	);
}