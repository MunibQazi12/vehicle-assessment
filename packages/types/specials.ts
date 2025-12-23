/**
 * Specials/Offers Type Definitions
 * Types for vehicle special offers, incentives, and promotions
 */

/**
 * Type of offer - Finance or Lease
 */
export type OfferType = "finance" | "lease";

/**
 * Offer value type - APR percentage or monthly payment
 */
export type OfferValueType = "apr" | "per_month";

/**
 * Individual special offer configuration
 */
export interface SpecialOffer {
	/** Unique identifier for the offer */
	id: string;

	/** Offer type: finance or lease */
	type: OfferType;

	/** Value type: APR percentage or monthly payment */
	valueType: OfferValueType;

	/** Main offer value (e.g., 0 for 0% APR, 359 for $359/mo) */
	value: number;

	/** Duration in months (e.g., 60 for "60 months") */
	durationMonths?: number;

	/** Due at signing amount for lease offers */
	dueAtSigning?: number;

	/** Offer expiration date */
	expiresAt?: string | Date;

	/** Detailed terms and conditions */
	details?: string;
}

/**
 * Special vehicle promotion/deal
 */
export interface VehicleSpecial {
	/** Unique identifier */
	id: string;

	/** Vehicle condition: new, used, certified */
	condition: "new" | "used" | "certified";

	/** Model year */
	year: number | string;

	/** Vehicle make (e.g., "Nissan") */
	make: string;

	/** Vehicle model (e.g., "Murano") */
	model: string;

	/** Vehicle trim level (optional) */
	trim?: string;

	/** Vehicle image URL */
	imageUrl: string;

	/** Blurred placeholder image for loading */
	imageBlurUrl?: string;

	/** The primary special offer */
	offer: SpecialOffer;

	/** URL to shop/view vehicles matching this special */
	shopUrl?: string;

	/** URL to reserve this vehicle */
	reserveUrl?: string;

	/** Custom CTA buttons */
	ctaButtons?: SpecialCTAButton[];
}

/**
 * CTA button for special offers
 */
export interface SpecialCTAButton {
	/** Button label */
	label: string;

	/** Button URL */
	url: string;

	/** Button variant */
	variant: "primary" | "secondary" | "outline";

	/** Optional form ID to open instead of navigating */
	formId?: string;
}

/**
 * Props for the SpecialCard component
 */
export interface SpecialCardProps {
	/** The special offer data */
	special: VehicleSpecial;

	/** Primary brand color for styling */
	primaryColor?: string;

	/** Whether to prioritize image loading (for above-fold cards) */
	priority?: boolean;

	/** Custom class name for additional styling */
	className?: string;
}

/**
 * Props for the SpecialsGrid component
 */
export interface SpecialsGridProps {
	/** Array of specials to display */
	specials: VehicleSpecial[];

	/** Primary brand color for styling */
	primaryColor?: string;

	/** Grid columns configuration */
	columns?: {
		default?: number;
		sm?: number;
		md?: number;
		lg?: number;
		xl?: number;
	};

	/** Custom class name */
	className?: string;
}

/**
 * Props for the OfferBadge component
 */
export interface OfferBadgeProps {
	/** Offer type: finance or lease */
	type: OfferType;

	/** Value type label: APR or Per Month */
	valueTypeLabel: string;

	/** Custom class name */
	className?: string;
}

/**
 * Props for the OfferValue component
 */
export interface OfferValueProps {
	/** Main offer value */
	value: number;

	/** Value type: apr or per_month */
	valueType: OfferValueType;

	/** Duration in months */
	durationMonths?: number;

	/** Due at signing (for lease) */
	dueAtSigning?: number;

	/** Primary color for styling */
	primaryColor?: string;

	/** Custom class name */
	className?: string;
}

// ============================================================================
// API Response Types
// ============================================================================

/**
 * Special channel types
 */
export type SpecialChannel = "homepage" | "coupon_page" | "srp_banner" | "vdp" | string;

/**
 * Special type categories
 */
export type SpecialType = "image" | "coupon" | "finance" | "lease" | string;

/**
 * CTA button from API
 */
export interface APISpecialCTA {
	device: "both" | "mobile" | "desktop";
	cta_type: "link" | "form";
	cta_label: string;
	btn_styles: {
		bg?: string | null;
		bg_hover?: string | null;
		text_color?: string | null;
		text_hover_color?: string | null;
	};
	btn_classes: string[];
	btn_content: string;
	open_newtab?: boolean | null;
	cta_location?: string | null;
	btn_attributes: string[];
	cta_conditions: string[];
}

/**
 * Headline item from API
 */
export interface APISpecialHeadline {
	text: string;
	pinned_at?: string | null;
}

/**
 * Discount item from API
 */
export interface APISpecialDiscount {
	label: string;
	value: string;
}

/**
 * Raw special item from API response
 */
export interface APISpecialItem {
	id: string;
	title: string;
	subtitle?: string | null;
	source: "dealer" | "oem" | string;

	// Types and channels
	special_types: SpecialType[];
	channels: SpecialChannel[];
	channels_exclusion?: string[] | null;

	// Images
	image_url?: string | null;
	mobile_image_url?: string | null;
	background_image?: string | null;
	background_image_mobile?: string | null;
	image_description?: string | null;
	image_is_vertical?: boolean | null;
	image_is_dynamic?: boolean | null;

	// Finance offers
	finance_apr?: number | null;
	finance_apr_month?: number | null;
	finance_monthly_payment?: number | null;
	finance_details?: string | null;

	// Lease offers
	lease_months?: number | null;
	lease_monthly_payment?: number | null;
	lease_due_at_signing?: number | null;
	lease_details?: string | null;

	// Pricing
	msrp_price?: number | null;
	sale_price?: number | null;
	cashback_price?: number | null;
	cashback_description?: string | null;
	discounts?: APISpecialDiscount[] | null;

	// Content
	disclaimer?: string | null;
	coupon_description?: string | null;
	headlines?: APISpecialHeadline[] | null;
	is_headlines_locked?: boolean;

	// CTAs
	cta: APISpecialCTA[];

	// Dates
	start_at?: string | null;
	expire_at?: string | null;

	// Settings
	settings?: {
		srp_banner_location?: string | null;
	} | null;

	// Additional fields
	additional_fields?: Record<string, unknown> | null;
	source_properties?: Record<string, unknown> | null;
	triggers?: string[] | null;
	autopilot_mode?: boolean;
	inventory_count?: number | null;

	// Special elements
	special_element?: string | null;
	special_element_mobile?: string | null;
	homepage_special_element?: string | null;
	homepage_special_element_mobile?: string | null;
}

/**
 * API request body for fetching specials
 */
export interface SpecialsRequest {
	special_types?: SpecialType[];
	channels?: SpecialChannel[];
	filters?: Record<string, unknown>;
}

/**
 * API response for specials endpoint
 */
export interface SpecialsResponse {
	success: boolean;
	data: APISpecialItem[][];
}

