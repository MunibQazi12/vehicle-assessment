/**
 * Lineup API client
 * Normalizes the different line-up payloads (new, used, dealer groups)
 */

import { cachedFetch, getAPIBaseURL } from "./client";
import {
	LineupData,
	LineupDealer,
	LineupItem,
	LineupLocationGroup,
	LineupResponse,
	LineupSection,
	LineupVariant,
} from "@dealertower/types/api";

interface LineupRawNewCategory {
	title?: string;
	url?: string;
	models?: Array<{
		model?: string;
		minimum_price?: number;
		maximum_price?: number;
		counts?: number;
		image_url?: string | null;
		url?: string | null;
	}>;
}

interface LineupRawUsedGroup {
	label?: string;
	name?: string;
	url?: string;
	items?: Array<{
		label?: string;
		image_url?: string | null;
		counts?: number | null;
		url?: string | null;
		minimum_value?: number | null;
		maximum_value?: number | null;
	}>;
}

interface LineupRawDealerGroup {
	brand?: Array<{
		title?: string;
		image_url?: string | null;
		url?: string | null;
		dealers?: Array<{
			name?: string;
			city?: string | null;
			address?: string | null;
			phone_numbers?: Array<{ label?: string; value?: string }>;
			dealer_info_url?: string | null;
			map_url?: string | null;
		}>;
	}>;
	location?: Array<{
		label?: string | null;
		name?: string | null;
		locations?: Array<{
			city?: string | null;
			name?: string | null;
			website?: string | null;
		}>;
	}>;
}

interface LineupRawResponse {
	success: boolean;
	data: unknown;
}

const slugifyId = (value: string | null | undefined, fallback: string) => {
	if (!value) return fallback;
	return value
		.toString()
		.trim()
		.toLowerCase()
		.replace(/[^a-z0-9]+/gi, "-")
		.replace(/^-+|-+$/g, "")
		.replace(/-{2,}/g, "-")
		|| fallback;
};

const normalizeNewLineup = (data: LineupRawNewCategory[]): LineupData => {
	const sections: LineupSection[] = (data || []).map((section, index) => ({
		id: slugifyId(section.title, `models-${index}`),
		title: section.title ?? "Models",
		name: null,
		url: section.url ?? null,
		type: "models" as const,
		items: (section.models || []).map<LineupItem>((model, modelIndex) => ({
			label: model.model ?? `Model ${modelIndex + 1}`,
			url: model.url ?? null,
			image_url: model.image_url ?? null,
			counts: model.counts ?? null,
			minimum_price: model.minimum_price ?? null,
			maximum_price: model.maximum_price ?? null,
		})),
	}));

	return {
		variant: "new",
		sections,
	} satisfies LineupData;
};

const normalizeUsedLineup = (data: LineupRawUsedGroup[]): LineupData => {
	const sections: LineupSection[] = (data || []).map((group, index) => ({
		id: slugifyId(group.name || group.label, `filters-${index}`),
		title: group.label ?? "Filters",
		name: group.name ?? null,
		url: group.url ?? null,
		type: "filters" as const,
		items: (group.items || []).map<LineupItem>((item, itemIndex) => ({
			label: item.label ?? `Item ${itemIndex + 1}`,
			url: item.url ?? null,
			image_url: item.image_url ?? null,
			counts: item.counts ?? null,
			minimum_value: item.minimum_value ?? null,
			maximum_value: item.maximum_value ?? null,
		})),
	}));

	return {
		variant: "used",
		sections,
	} satisfies LineupData;
};

const normalizeDealerGroupLineup = (data: LineupRawDealerGroup): LineupData => {
	const brandItems: LineupItem[] = (data.brand || []).map((brand, brandIndex) => {
		const dealers: LineupDealer[] = (brand.dealers || []).map((dealer) => ({
			name: dealer.name ?? "",
			city: dealer.city ?? null,
			address: dealer.address ?? null,
			phone_numbers: (dealer.phone_numbers || [])
				.filter((phone) => phone.label || phone.value)
				.map((phone) => ({
					label: phone.label ?? "",
					value: phone.value ?? "",
				})),
			dealer_info_url: dealer.dealer_info_url ?? null,
			map_url: dealer.map_url ?? null,
		}));

		return {
			label: brand.title ?? `Brand ${brandIndex + 1}`,
			url: brand.url ?? null,
			image_url: brand.image_url ?? null,
			dealers,
		} satisfies LineupItem;
	});

	const sections: LineupSection[] = [
		{
			id: "brands",
			title: "Brands",
			name: null,
			url: null,
			type: "brands",
			items: brandItems,
		},
	];

	const locations: LineupLocationGroup[] | undefined = (data.location || []).map((group) => ({
		label: group.label ?? null,
		name: group.name ?? null,
		locations: (group.locations || []).map((location) => ({
			city: location.city ?? null,
			name: location.name ?? null,
			website: location.website ?? null,
		})),
	}));

	return {
		variant: "dealer_group",
		sections,
		locations,
	} satisfies LineupData;
};

const normalizeLineupData = (rawData: unknown): LineupData => {
	if (Array.isArray(rawData)) {
		const hasModels = rawData.some((item) => item && typeof item === "object" && "models" in (item as Record<string, unknown>));
		if (hasModels) {
			return normalizeNewLineup(rawData as LineupRawNewCategory[]);
		}

		const hasItems = rawData.some((item) => item && typeof item === "object" && "items" in (item as Record<string, unknown>));
		if (hasItems) {
			return normalizeUsedLineup(rawData as LineupRawUsedGroup[]);
		}
	}

	if (rawData && typeof rawData === "object" && !Array.isArray(rawData)) {
		const record = rawData as Record<string, unknown>;
		if ("brand" in record || "location" in record) {
			return normalizeDealerGroupLineup(rawData as LineupRawDealerGroup);
		}
	}

	return {
		variant: "unknown" as LineupVariant,
		sections: [],
	};
};

/**
 * Fetch dealer lineup (brands/models) and normalize the response across tenant types.
 * 
 * @param hostname - The dealer hostname (e.g., www.nissanofportland.com)
 * @returns Normalized lineup response with sections
 * 
 * @example
 * ```ts
 * const lineup = await fetchLineup('www.nissanofportland.com');
 * lineup.data.sections.forEach(section => {
 *   console.log(section.title, section.items.length);
 * });
 * ```
 */
export async function fetchLineup(
	hostname: string
): Promise<LineupResponse> {
	const url = `${getAPIBaseURL(hostname)}/v1/line-up`;

	const rawResponse = await cachedFetch<LineupRawResponse>(url, {}, {
		hostname,
		dealerIdentifier: hostname.replace(/^www\./, ''),
		dataType: "lineup",
		method: "GET",
		domain: "Lineup",
	});

	const normalizedData = normalizeLineupData(rawResponse.data);

	return {
		success: rawResponse.success,
		data: normalizedData,
	} satisfies LineupResponse;
}

/**
 * Expose normalization separately for testing/consumers if needed.
 */
export { normalizeLineupData };
