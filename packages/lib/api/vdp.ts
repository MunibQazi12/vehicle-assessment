/**
 * VDP (Vehicle Detail Page) API Functions
 * Handles fetching vehicle details and similar vehicles
 */

import { cache } from "react";
import { VDPResponse, VDPSimilarsResponse } from "@dealertower/types/api";
import { cachedFetch, getAPIBaseURL } from "./client";
import { generateVDPTags } from "@dealertower/lib/cache/tags";

/**
 * Fetch vehicle details for VDP
 * Wrapped with React cache() to deduplicate requests across generateMetadata() and page component
 *
 * @param hostname - Full hostname (e.g., www.nissanofportland.com)
 * @param vdpSlug - VDP slug from URL (e.g., "new-2025-Genesis-G90-35TeSC-Sedan-Portland-OR-KMTFC4SD9SU049901")
 * @returns Vehicle details with photos and specs
 * 
 * @example
 * ```ts
 * const vehicle = await fetchVDPDetails('www.nissanofportland.com', 'new-2025-Nissan-Altima-...');
 * console.log(vehicle.data.vin, vehicle.data.price);
 * ```
 */
export const fetchVDPDetails = cache(
	async (
		hostname: string,
		vdpSlug: string
	): Promise<VDPResponse> => {
		const dealerIdentifier = hostname.replace(/^www\./, '');
		const url = `${getAPIBaseURL(hostname)}/v2/inventory/vehicles/vdp/${vdpSlug}`;

		const tags = generateVDPTags(vdpSlug);

		try {
			return await cachedFetch<VDPResponse>(url, {}, {
				hostname,
				dealerIdentifier,
				dataType: "vdp",
				method: "GET",
				cacheTags: tags,
				domain: "VDP",
				throwOn404: true,
			});
		} catch (error) {
			// Don't log 404 errors as they're expected for invalid/sold vehicles
			const is404 = (error as Error & { status?: number })?.status === 404;
			if (!is404) {
				console.error(
					`[API:VDP] Error fetching VDP details for ${vdpSlug}:`,
					error
				);
			}
			throw error;
		}
	}
);

/**
 * Fetch similar vehicles for a VDP
 * Wrapped with React cache() to deduplicate requests if called multiple times
 *
 * @param hostname - Full hostname (e.g., www.nissanofportland.com)
 * @param vdpSlug - VDP slug from URL
 * @returns Array of similar vehicles
 * 
 * @example
 * ```ts
 * const similars = await fetchVDPSimilars('www.nissanofportland.com', 'new-2025-Nissan-Altima-...');
 * console.log(`Found ${similars.data.length} similar vehicles`);
 * ```
 */
export const fetchVDPSimilars = cache(
	async (
		hostname: string,
		vdpSlug: string
	): Promise<VDPSimilarsResponse> => {
		const dealerIdentifier = hostname.replace(/^www\./, '');
		const url = `${getAPIBaseURL(hostname)}/v2/inventory/vehicles/vdp/${vdpSlug}/similars`;

		try {
			return await cachedFetch<VDPSimilarsResponse>(url, {}, {
				hostname,
				dealerIdentifier,
				dataType: "vdp-similars",
				method: "GET",
				domain: "VDP",
				returnEmptyOnError: false,
			});
		} catch (error) {
			console.error(
				`[API:VDP] Error fetching similar vehicles for ${vdpSlug}:`,
				error
			);
			// Return empty array on error instead of throwing
			return { success: false, data: [] };
		}
	}
);

