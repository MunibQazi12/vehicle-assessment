/**
 * Specials API Functions
 * Fetch and transform special offers from the Dealer Tower API
 */

import { cachedFetch, getAPIBaseURL } from "./client";
import type {
	SpecialsRequest,
	SpecialsResponse,
	APISpecialItem,
	VehicleSpecial,
	SpecialCTAButton,
	SpecialChannel,
} from "@dealertower/types/specials";

/**
 * Fetch raw specials from the API
 * 
 * @param hostname - The dealer hostname (e.g., www.nissanofportland.com)
 * @param request - Optional filters for special types and channels
 * @returns Raw specials response from API
 * 
 * @example
 * ```ts
 * const specials = await fetchSpecialsRaw('www.nissanofportland.com', {
 *   channels: ['homepage'],
 *   special_types: ['lease', 'finance']
 * });
 * ```
 */
export async function fetchSpecialsRaw(
	hostname: string,
	request: SpecialsRequest = {}
): Promise<SpecialsResponse> {
	const url = `${getAPIBaseURL(hostname)}/v1/get-specials`;

	const body = {
		special_types: request.special_types || [],
		channels: request.channels || [],
		filters: request.filters || {},
	};

	return cachedFetch<SpecialsResponse>(url, body, {
		hostname,
		dealerIdentifier: hostname.replace(/^www\./, ''),
		dataType: "specials",
		method: "POST",
		domain: "Specials",
	});
}

/**
 * Transform API special item to VehicleSpecial format
 */
function transformSpecialToVehicleSpecial(
	item: APISpecialItem
): VehicleSpecial | null {
	// Skip items without images
	if (!item.image_url) {
		return null;
	}

	// Parse title to extract vehicle info (e.g., "25 Versa Finance" -> year: 2025, model: "Versa")
	const titleMatch = item.title.match(/(\d{2,4})?\s*(.+)/);
	let year: number | string = new Date().getFullYear();
	let model = item.title;

	if (titleMatch) {
		if (titleMatch[1]) {
			// Convert 2-digit year to 4-digit (25 -> 2025)
			const yearNum = parseInt(titleMatch[1]);
			year = yearNum < 100 ? 2000 + yearNum : yearNum;
		}
		model = titleMatch[2]?.trim() || item.title;
	}

	// Determine offer type and values
	const hasFinance =
		item.finance_apr !== null ||
		item.finance_monthly_payment !== null ||
		item.finance_apr_month !== null;
	const hasLease =
		item.lease_months !== null ||
		item.lease_monthly_payment !== null ||
		item.lease_due_at_signing !== null;

	// Default to "image" type special if no specific offer
	let offerType: "finance" | "lease" = "finance";
	let valueType: "apr" | "per_month" = "apr";
	let value = 0;
	let durationMonths: number | undefined;
	let dueAtSigning: number | undefined;

	if (hasLease && item.lease_monthly_payment !== null && item.lease_monthly_payment !== undefined) {
		offerType = "lease";
		valueType = "per_month";
		value = item.lease_monthly_payment;
		durationMonths = item.lease_months ?? undefined;
		dueAtSigning = item.lease_due_at_signing ?? undefined;
	} else if (hasFinance) {
		offerType = "finance";
		if (item.finance_apr !== null && item.finance_apr !== undefined) {
			valueType = "apr";
			value = item.finance_apr;
			durationMonths = item.finance_apr_month ?? undefined;
		} else if (item.finance_monthly_payment !== null && item.finance_monthly_payment !== undefined) {
			valueType = "per_month";
			value = item.finance_monthly_payment;
		}
	}

	// Transform CTAs
	const ctaButtons: SpecialCTAButton[] = item.cta
		.filter((cta) => cta.device === "both" || cta.device === "desktop")
		.map((cta, index) => ({
			label: cta.cta_label,
			url: cta.btn_content,
			variant: index === 0 ? ("primary" as const) : ("outline" as const),
		}));

	return {
		id: item.id,
		condition: "new",
		year,
		make: "Nissan", // Default make - could be parsed from title in future
		model,
		trim: item.subtitle ?? undefined,
		imageUrl: item.image_url,
		imageBlurUrl: item.mobile_image_url ?? undefined,
		offer: {
			id: `offer-${item.id}`,
			type: offerType,
			valueType,
			value,
			durationMonths,
			dueAtSigning,
			expiresAt: item.expire_at ?? undefined,
			details: item.disclaimer ?? undefined,
		},
		shopUrl: ctaButtons[0]?.url,
		ctaButtons: ctaButtons.length > 0 ? ctaButtons : undefined,
	};
}

/**
 * Fetch and transform specials for a specific channel
 * Note: Channel filtering is done on the backend
 */
export async function fetchSpecials(
	hostname: string,
	channels?: SpecialChannel[]
): Promise<VehicleSpecial[]> {
	const response = await fetchSpecialsRaw(hostname, {
		channels: channels || [],
	});

	if (!response.success || !response.data) {
		return [];
	}

	// Flatten nested arrays and transform
	const specials: VehicleSpecial[] = [];

	for (const group of response.data) {
		for (const item of group) {
			const transformed = transformSpecialToVehicleSpecial(item);
			if (transformed) {
				specials.push(transformed);
			}
		}
	}

	return specials;
}

/**
 * Fetch homepage specials
 */
export async function fetchHomepageSpecials(
	hostname: string
): Promise<VehicleSpecial[]> {
	return fetchSpecials(hostname, ["homepage"]);
}

/**
 * Fetch all raw specials (for custom rendering)
 */
export async function fetchAllSpecialsRaw(
	hostname: string
): Promise<APISpecialItem[]> {
	const response = await fetchSpecialsRaw(hostname);

	if (!response.success || !response.data) {
		return [];
	}

	// Flatten nested arrays
	return response.data.flat();
}
