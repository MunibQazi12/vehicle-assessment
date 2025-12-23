/**
 * Dealer API Client
 * Handles fetching dealer information from the API
 */

import { cache } from 'react';
import { cachedFetch, getAPIBaseURL } from "./client";
import { WebsiteScript, StaffInformationResponse, StaffGroup } from "@dealertower/types/api";

export interface DealerWorkHour {
	label: string; // e.g., "Monday"
	from: string; // e.g., "09:00"
	to: string; // e.g., "20:00"
	is_open: boolean;
}

export interface DealerWorkHours {
	label: string; // e.g., "Sales", "Service", "Parts", "Collision Center"
	value: DealerWorkHour[];
}

export interface DealerPhoneNumber {
	label: string; // e.g., "Sales", "Service", "Parts"
	value: string; // e.g., "503-251-3349"
}

export interface WebsiteExternalLink {
	label: string;
	value: string;
	is_opened_in_newtab: boolean;
}

export interface SocialNetwork {
	label: string; // e.g., "Facebook", "Twitter", "Instagram"
	value: string; // URL
}

export interface NavigationItem {
	guid: string | null;
	link: string;
	label: string;
	children: NavigationItem[];
	template: string | null;
	custom_id: string;
	custom_class: string;
	open_new_tab: boolean;
}

export interface FooterLink {
	guid: string;
	link: string;
	label: string;
	children: FooterLinkChild[];
	custom_id: string;
	custom_class: string;
	open_new_tab: boolean;
}

export interface FooterLinkChild {
	guid: string;
	link: string;
	label: string;
	custom_id: string;
	custom_class: string;
	open_new_tab: boolean;
}

export type WebsiteHeroType = "image" | "video";
export type WebsiteHeroVideoType = "upload" | "youtube" | null;

export interface WebsiteHeroCTA {
	link: string;
	label: string;
}

export interface HeaderConfig {
	theme?: string;
}

export interface DealerInfo {
	id: string;
	is_dealer_group: boolean;
	name: string;
	slug: string;
	site_url: string;
	zip_code: string | null;
	address: string | null;
	city: string | null;
	state: string | null;
	timezone: string | null;
	country: string | null;
	demo_mode: boolean | null;
	latitude: number | null;
	longitude: number | null;
	logo_url: string | null;
	icon_url: string | null;
	main_photo_url: string | null;
	background_image: string | null;
	special_element: string | null;
	homepage_special_element: string | null;
	background_image_mobile: string | null;
	special_element_mobile: string | null;
	homepage_special_element_mobile: string | null;
	phone_numbers: DealerPhoneNumber[];
	email_addresses: string[];
	social_networks: SocialNetwork[];
	vdp_template: string | null;
	work_hours: DealerWorkHours[];
	website_scripts: WebsiteScript[];
	website_hero_type: WebsiteHeroType | null;
	website_hero_title: string | null;
	website_hero_subtitle: string | null;
	website_hero_image_url: string | null;
	website_hero_ctas: WebsiteHeroCTA[];
	website_hero_video_type: WebsiteHeroVideoType;
	website_hero_video_url: string | null;
	website_hero_youtube_embed: string | null;
	search_placeholder_hints: string[] | null;
	website_external_links: WebsiteExternalLink[];
	main_colors: string[] | null;
	saved_colors: string[] | null;
	header: HeaderConfig | null;
	navigation: NavigationItem[] | null;
	footer: unknown | null; // Can be customized based on actual structure
	footer_links: FooterLink[] | null;
	search_theme: string | null;
	dealership_condition: string | null;
	dealership_type: string;
	favicon_url: string | null;
	website_hero_type_mobile: WebsiteHeroType | null;
	website_hero_video_type_mobile: WebsiteHeroVideoType;
	website_hero_image_url_mobile: string | null;
	website_hero_youtube_embed_mobile: string | null;
	website_hero_video_url_mobile: string | null;
	google_site_verification_token: string | string[] | null;
	google_tag_manager_id: string | string[] | null;
	is_captcha_enabled: boolean | null;
	captcha_site_key: string | null;
	manufactures: string[];
	certified_logos: Record<string, string> | null;
	length_unit: string | null;
	disclaimers: {
		vdp: {
			new?: string;
			used?: string;
			certified?: string;
		};
		srp: {
			new?: string;
			used?: string;
			certified?: string;
		};
	};
}

export interface DealerTheme {
	primaryColor: string;
	secondaryColor?: string;
	accentColor?: string;
}

export interface DealerInfoWithGroup extends DealerInfo {
	dealers?: DealerInfo[];
	// Add theme property for backwards compatibility
	theme: DealerTheme;
}

/**
 * Convert DealerInfo to DealerInfoWithGroup by adding computed theme property
 */
export function toDealerInfoWithGroup(info: DealerInfo | null): DealerInfoWithGroup | null {
	if (!info) return null;

	return {
		...info,
		theme: {
			primaryColor: info.main_colors?.[0] || '#0066CC',
			secondaryColor: info.main_colors?.[1] || '#333333',
			accentColor: info.main_colors?.[2] || '#FFFFFF',
		},
	};
}

interface APIResponse {
	success: boolean;
	data: DealerInfoWithGroup;
}

/**
 * Fetch website information including dealer ID
 * Wrapped with React cache to deduplicate requests within a single render
 * 
 * @param hostname - The dealer hostname (e.g., www.tonkin.com)
 * @returns Dealer information from API
 * 
 * @example
 * ```ts
 * const dealerInfo = await fetchWebsiteInformation('www.nissanofportland.com');
 * if (dealerInfo) {
 *   console.log(dealerInfo.id, dealerInfo.name);
 * }
 * ```
 */
export const fetchWebsiteInformation = cache(async function (
	hostname: string
): Promise<DealerInfoWithGroup | null> {
	const url = `${getAPIBaseURL(hostname)}/v1/get-website-information`;

	try {
		const apiResponse = await cachedFetch<APIResponse>(url, {}, {
			hostname,
			dealerIdentifier: hostname.replace(/^www\./, ''),
			dataType: "dealer",
			method: "GET",
			domain: "Dealer",
			returnEmptyOnError: false,
		});

		const dealerData = apiResponse.data;

		if (!dealerData || !dealerData.id) {
			console.warn(`[API:Dealer] No dealer data found in response for ${hostname}`);
			return null;
		}

		console.log(`[API:Dealer] Got dealer ID: ${dealerData.id} (${dealerData.name}) with ${dealerData.website_scripts.length} scripts`);

		// Convert to DealerInfoWithGroup with computed theme property
		return toDealerInfoWithGroup(dealerData);
	} catch (error) {
		console.error(
			`[API:Dealer] Error fetching website info for ${hostname}:`,
			error instanceof Error ? error.message : error
		);
		return null;
	}
});

/**
 * Get dealer ID from hostname via API
 * Returns normalized hostname as fallback if API fails
 * 
 * @param hostname - The dealer hostname
 * @returns Dealer ID from API or normalized hostname as fallback
 */
export async function getDealerIdFromHostname(
	hostname: string
): Promise<string> {
	const dealerInfo = await fetchWebsiteInformation(hostname);

	if (dealerInfo?.id) {
		return dealerInfo.id;
	}

	// Fallback: use normalized hostname (strip www.)
	const fallbackDealerId = hostname.replace(/^www\./, '').toLowerCase();
	console.warn(
		`[Dealer API] Using fallback dealer ID: ${fallbackDealerId} for ${hostname}`
	);

	return fallbackDealerId;
}

/**
 * Fetch website scripts for a specific hostname
 * Uses fetchWebsiteInformation internally to avoid duplicate API calls
 * 
 * @param hostname - The dealer hostname (e.g., www.tonkin.com)
 * @returns Array of website scripts
 */
export async function fetchWebsiteScripts(
	hostname: string
): Promise<WebsiteScript[]> {
	const dealerInfo = await fetchWebsiteInformation(hostname);
	return dealerInfo?.website_scripts || [];
}

/**
 * Fetch staff information for a specific hostname
 * Returns staff grouped by category (e.g., "Dealership Leaders", "Corporate Leaders")
 * 
 * @param hostname - The dealer hostname (e.g., www.tonkin.com)
 * @returns Staff groups array
 * 
 * @example
 * ```ts
 * const staffGroups = await fetchStaffInformation('www.nissanofportland.com');
 * staffGroups.forEach(group => {
 *   console.log(group.label, group.staff.length);
 * });
 * ```
 */
export const fetchStaffInformation = cache(async function (
	hostname: string
): Promise<StaffGroup[]> {
	const url = `${getAPIBaseURL(hostname)}/v1/get-staff-information`;

	try {
		const apiResponse = await cachedFetch<StaffInformationResponse>(url, {}, {
			hostname,
			dealerIdentifier: hostname.replace(/^www\./, ''),
			dataType: "dealer-staff",
			method: "GET",
			domain: "Dealer",
			returnEmptyOnError: true,
		});

		if (!apiResponse.success || !apiResponse.data?.dealer?.staff) {
			console.warn(`[API:Dealer] No staff data found in response for ${hostname}`);
			return [];
		}

		console.log(`[API:Dealer] Got ${apiResponse.data.dealer.staff.length} staff groups`);

		return apiResponse.data.dealer.staff;
	} catch (error) {
		console.error(`[API:Dealer] Error fetching staff info for ${hostname}:`, error);
		return [];
	}
});
