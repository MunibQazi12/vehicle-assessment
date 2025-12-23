/**
 * SRP-specific API functions
 * Handles vehicle inventory and filter API calls with caching
 */

import { cachedFetch, getAPIBaseURL } from "./client";
import type {
	SRPRowsRequest,
	SRPRowsResponse,
	FiltersRequest,
	FiltersResponse,
	FilterValuesRequest,
	FilterValuesResponse,
	VDPSlugsResponse,
	VehicleCountsResponse,
} from "@dealertower/types/api";

/**
 * Fetches SRP rows (vehicle inventory) with caching
 *
 * @param hostname - The tenant hostname (e.g., www.nissanofportland.com)
 * @param params - The request body with filters and pagination
 * @returns The SRP rows response with vehicles
 *
 * @example
 * ```ts
 * const data = await fetchSRPRows('www.nissanofportland.com', {
 *   condition: ['new'],
 *   page: 1,
 *   items_per_page: 24
 * });
 * ```
 */
export async function fetchSRPRows(
	hostname: string,
	params: SRPRowsRequest
): Promise<SRPRowsResponse> {
	const url = `${getAPIBaseURL(hostname)}/v2/inventory/vehicles/srp/rows`;

	return cachedFetch<SRPRowsResponse>(url, params as Record<string, unknown>, {
		hostname,
		dealerIdentifier: hostname.replace(/^www\./, ''),
		dataType: "vehicles",
		domain: "SRP",
	});
}

/**
 * Fetches available filters with caching
 *
 * @param hostname - The tenant hostname (e.g., www.nissanofportland.com)
 * @param params - The request body with current filter state
 * @returns The filters response with available and selected filters
 *
 * @example
 * ```ts
 * const data = await fetchFilters('www.nissanofportland.com', {
 *   condition: ['new']
 * });
 * ```
 */
export async function fetchFilters(
	hostname: string,
	params: FiltersRequest
): Promise<FiltersResponse> {
	const url = `${getAPIBaseURL(hostname)}/v2/inventory/vehicles/srp/filters`;

	return cachedFetch<FiltersResponse>(url, params as Record<string, unknown>, {
		hostname,
		dealerIdentifier: hostname.replace(/^www\./, ''),
		dataType: "filters",
		domain: "SRP",
	});
}

/**
 * Fetches values for a specific filter with caching
 *
 * @param hostname - The tenant hostname (e.g., www.nissanofportland.com)
 * @param filterName - The name of the filter to get values for
 * @param params - The request body with current filter state
 * @returns The filter values response
 *
 * @example
 * ```ts
 * const data = await fetchFilterValues('www.nissanofportland.com', 'make', {
 *   condition: ['new']
 * });
 * ```
 */
export async function fetchFilterValues(
	hostname: string,
	filterName: string,
	params: FilterValuesRequest
): Promise<FilterValuesResponse> {
	const url = `${getAPIBaseURL(hostname)}/v2/inventory/vehicles/srp/filters/${filterName}`;

	return cachedFetch<FilterValuesResponse>(url, params as Record<string, unknown>, {
		hostname,
		dealerIdentifier: hostname.replace(/^www\./, ''),
		dataType: "filters",
		domain: "SRP",
	});
}

/**
 * Fetches all VDP slugs for sitemap generation
 *
 * @param hostname - The tenant hostname
 * @returns The VDP slugs response with all vehicle slugs
 *
 * @example
 * ```ts
 * const data = await fetchVDPSlugs('www.tonkin.com');
 * // data.data.slugs = ['new-2024-Toyota-Camry-...', ...]
 * ```
 */
export async function fetchVDPSlugs(
	hostname: string
): Promise<VDPSlugsResponse> {
	const url = `${getAPIBaseURL(hostname)}/v2/inventory/vehicles/vdp-slugs`;

	return cachedFetch<VDPSlugsResponse>(url, {}, {
		hostname,
		dealerIdentifier: hostname,
		dataType: "vehicles",
		method: "GET",
	});
}

/**
 * Fetches vehicle counts (new, used, certified, total) with caching
 *
 * @param hostname - The tenant hostname (e.g., www.nissanofportland.com)
 * @returns Vehicle counts response
 * 
 * @example
 * ```ts
 * const counts = await fetchVehicleCounts('www.nissanofportland.com');
 * console.log(`New: ${counts.data.new}, Used: ${counts.data.used}`);
 * ```
 */
export async function fetchVehicleCounts(
	hostname: string
): Promise<VehicleCountsResponse> {
	const url = `${getAPIBaseURL(hostname)}/v2/inventory/vehicles/count`;

	return cachedFetch<VehicleCountsResponse>(url, {}, {
		hostname,
		dealerIdentifier: hostname.replace(/^www\./, ''),
		dataType: "vehicles",
		domain: "SRP",
		method: "GET",
	});
}
