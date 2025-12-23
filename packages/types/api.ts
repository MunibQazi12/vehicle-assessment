/**
 * API Type Definitions
 * Complete type definitions for the Dealer Tower Inventory API
 */

// ============================================================================
// SRP Rows Request & Response
// ============================================================================

export type VehicleSortType =
  | "order"
  | "price"
  | "mileage"
  | "year"
  | "mpg_highway"
  | "mpg_city"
  | "make"
  | "model";

export interface SRPRowsRequest {
  // URL-based filtering
  url_filtering?: string | null;
  srp_shortcode?: string | null;

  // Direct filters
  vin_number?: string[] | null;
  stock_number?: string[] | null;
  search?: string | null;

  // Vehicle attributes
  condition?: string[] | null;
  year?: string[] | null;
  make?: string[] | null;
  model?: string[] | null;
  trim?: string[] | null;
  body?: string[] | null;

  // Location filters
  dealer?: string[] | null;
  state?: string[] | null;
  city?: string[] | null;

  // Technical specifications
  fuel_type?: string[] | null;
  transmission?: string[] | null;
  engine?: string[] | null;
  drive_train?: string[] | null;
  doors?: (string | number)[] | null;

  // Colors
  ext_color?: string[] | null;
  ext_color_raw?: string[] | null;
  int_color?: string[] | null;

  // Features
  key_features?: string[] | null;
  keywords?: string[] | null;
  package_ids?: string[] | null;

  // Status flags
  is_special?: boolean[] | null;
  is_commercial?: boolean[] | null;
  is_in_transit?: boolean[] | null;
  is_sale_pending?: boolean[] | null;
  is_new_arrival?: boolean[] | null;
  is_sold?: boolean[] | null;

  // Range filters
  mileage?: {
    min?: number | null;
    max?: number | null;
  } | null;

  price?: {
    min?: number | null;
    max?: number | null;
    max_payment?: number | null;
  } | null;

  // Pagination & sorting
  page?: number;
  items_per_page?: number | null;
  sort_by?: VehicleSortType | null;
  order?: "asc" | "desc" | null;
}

export interface SRPRowsResponse {
  success: boolean;
  data: {
    page: number;
    has_next: boolean;
    last_page: number;
    sort_by: VehicleSortType | null;
    order: "asc" | "desc" | null;
    current_srp_url: string | null;
    counts: number;
    vehicles: SRPVehicle[];
  };
}

// ============================================================================
// Vehicle Counts Response
// ============================================================================

export interface VehicleCountsResponse {
  success: boolean;
  data: {
    new: number;
    used: number;
    certified: number;
    total: number;
  };
}

export interface SRPVehicle {
  // Status flags
  is_special: boolean | null;
  is_in_transit: boolean | null;
  is_commercial: boolean | null;
  is_sale_pending: boolean | null;
  is_new_arrival: boolean | null;
  is_sold: boolean | null;

  // Identifiers
  vehicle_id: string | null;
  dealer_ids: string[] | null;
  stock_number: string | null;
  vin_number: string | null;

  // Display info
  title: string | null;
  subtitle: string | null;

  // Vehicle details
  condition: string | null;
  year: string | null;
  make: string | null;
  model: string | null;
  trim: string | null;
  doors: number | null;
  body: string | null;
  drive_train: string | null;
  fuel_type: string | null;

  // Colors
  ext_color: string | null;
  ext_color_raw: string | null;
  int_color: string | null;
  int_color_raw: string | null;

  // Specifications
  mileage: number | null;
  mpg_highway: number | null;
  mpg_city: number | null;
  transmission: string | null;
  engine: string | null;

  // Inventory info
  days_in_stock: number | null;
  description: string | null;
  keywords: string[] | null;
  key_features: string[] | null;
  package_ids: string[] | null;
  presets_package_ids: string[] | null;

  // Interactive elements
  cta: CTAButton[] | null;
  tag: VehicleTag[] | null;
  oem_incentives: OEMIncentive[] | null;

  // CarFax
  is_carfax_one_owner: boolean | null;
  carfax_icon_url: string | null;
  carfax_url: string | null;

  // Pricing
  price: number | null;
  sale_price: number | null;
  retail_price: number | null;
  prices: VehiclePricing | null;

  // Media
  vdp_slug: string | null;
  photo: string | null;
  photo_preview: string | null;
  video: string | null;
  video_subtitle: string | null;

  // Dealer info
  dealer: string[] | null;
  city: string[] | null;
  state: string[] | null;
  address: string[] | null;
  website: string[] | null;
  zipcode: string[] | null;
}

// ============================================================================
// Pricing Structures (Shared between SRP and VDP)
// ============================================================================

/**
 * Pricing structure used in both SRP and VDP
 * Contains formatted price strings, discount/additional cost breakdowns, and totals
 */
export interface VehiclePricing {
  // Base prices
  retail_price_formatted?: string | null;
  retail_price_label?: string | null;
  sale_price_formatted?: string | null;
  sale_price_label?: string | null;
  dealer_sale_price_formatted?: string | null;
  dealer_sale_price_label?: string | null;
  
  // Discount information
  total_discounts?: number | null;
  total_discounts_formatted?: string | null;
  total_discounts_label?: string | null;
  dealer_discount_total?: number | null;
  dealer_discount_label?: string | null;
  dealer_discount_details?: Array<{
    title: string;
    value: string;
    disclaimer?: string | null;
  }> | null;
  incentive_discount_total?: number | null;
  incentive_discount_label?: string | null;
  incentive_discount_details?: Array<{
    title: string;
    value: string;
    disclaimer?: string | null;
  }> | null;
  
  // Additional costs
  total_additional?: number | null;
  total_additional_formatted?: string | null;
  total_additional_label?: string | null;
  dealer_additional_total?: number | null;
  dealer_additional_label?: string | null;
  dealer_additional_details?: Array<{
    title: string;
    value: string;
    disclaimer?: string | null;
  }> | null;
  incentive_additional_total?: number | null;
  incentive_additional_label?: string | null;
  incentive_additional_details?: Array<{
    title: string;
    value: string;
    disclaimer?: string | null;
  }> | null;
}

export type CTADevice = "both" | "desktop" | "mobile";
export type CTAType = "form" | "html" | "link";
export type CTACondition = "new" | "used" | "certified";
export type CTALocation = "srp" | "vdp" | "both";

export interface CTABtnAttribute {
  /** HTML attribute name (e.g., 'data-track', 'aria-label', 'id') */
  name: string;
  /** HTML attribute value */
  value: string;
}

export interface CTABtnClasses {
  /** Descriptive label for the CSS class assignment */
  label: string;
  /** CSS class name(s) to apply, space-separated if multiple */
  value: string;
}

export interface CTABtnStyles {
  /** Button text color in hex format (default state) */
  text_color: string;
  /** Button text color on hover in hex format */
  text_hover_color: string;
  /** Button background color in hex format (default state) */
  bg: string;
  /** Button background color on hover in hex format */
  bg_hover: string;
}

export interface CTAButton {
  /** Internal descriptive label (e.g., 'Confirm Availability', 'Schedule Test Drive') */
  cta_label: string;
  /** Type of CTA action: 'form' (modal), 'html' (custom HTML), 'link' (URL) */
  cta_type: CTAType;
  /** Target device visibility: 'both', 'desktop', 'mobile' */
  device: CTADevice;
  /** Vehicle condition filters (empty array = all conditions) */
  cta_conditions: CTACondition[];
  /** Page location: 'srp', 'vdp', 'both' */
  cta_location: CTALocation;
  /** Custom HTML attributes for button element (can be array or empty object from API) */
  btn_attributes: CTABtnAttribute[] | Record<string, never>;
  /** CSS class configurations for button styling */
  btn_classes: CTABtnClasses[];
  /** Inline style configuration (null if using classes only) */
  btn_styles: CTABtnStyles | null;
  /** Button content: form UUID, HTML markup, or link text */
  btn_content: string;
  /** Open links in new tab (relevant for link-type CTAs) */
  open_newtab: boolean;
}

export interface VehicleTag {
  label: string;
  color: string;
  type: string;
  /** Optional background color used for top label tags */
  tag_background?: string | null;
  /** Optional text color used for top label tags */
  tag_color?: string | null;
  /** Optional content for displayable tag text */
  tag_content?: string | null;
  /** Optional legal copy for tag content */
  tag_disclaimer?: string | null;
  /** Optional override for the legacy `type` value */
  tag_type?: string;
}

export interface OEMIncentive {
  title: string;
  description: string;
  amount: number;
  type: string;
}

// ============================================================================
// Filters Request & Response
// ============================================================================

export type FilterType = "select" | "switch" | "number" | "search";

export type FiltersRequest = Omit<SRPRowsRequest, "page" | "items_per_page">;

export interface FiltersResponse {
  success: boolean;
  data: {
    selected_filters: SelectedFilter[];
    available_filters: AvailableFilter[];
    available_sorting: SortingOption[];
  };
}

export interface SelectedFilter {
  label: string;
  name: string;
  value: string | number | boolean | { min?: number; max?: number };
  type: FilterType;
}

export interface AvailableFilter {
  name: string;
  label: string;
  type: FilterType;
  value: FilterValue[] | [number, number];
  payment?: PaymentOption[] | null;
}

export interface TrimOption {
  label: string;
  value: string;
  count: number;
}

export interface FilterValue {
  label: string;
  value: string | number | boolean;
  count: number;
  trims?: TrimOption[] | null;
}

export interface PaymentOption {
  label: string;
  value: number;
}

export interface SortingOption {
  label: string;
  value: string;
}

// ============================================================================
// Filter Values Request & Response
// ============================================================================

export type FilterValuesRequest = FiltersRequest;

export interface FilterValuesResponse {
  success: boolean;
  data: FilterValueItem[] | [number, number];
}

export interface FilterValueItem {
  label: string | null;
  count: number | null;
  value: string | number | boolean | (string | number | boolean)[];
  trims?: TrimOption[] | null;
}

// ============================================================================
// VDP (Vehicle Detail Page)
// ============================================================================

export interface VDPResponse {
  success: boolean;
  data: VDPVehicle;
}

export interface VDPVehicle extends SRPVehicle {
  // Additional fields specific to VDP
  photos: string[];
  photos_preview: string[];
  videos: string[];
  
  // Detailed pricing breakdown (uses VehiclePricing)
  prices: VehiclePricing | null;
}

// Similar vehicles endpoint response
export interface VDPSimilarsResponse {
  success: boolean;
  data: SRPVehicle[];
}

// VDP slugs endpoint response (for sitemap generation)
export interface VDPSlugsResponse {
  success: boolean;
  data: {
    slugs: string[];
  };
}

// ============================================================================
// Lineup (Dealer Line-Up / Brands)
// ============================================================================

/**
 * Lineup variant returned by API
 * - "new": model categories with min/max prices (new dealerships)
 * - "used": filter-style groupings (used dealerships)
 * - "dealer_group": brand + dealer locations (dealer groups)
 * - "unknown": fallback when structure is not recognized
 */
export type LineupVariant = "new" | "used" | "dealer_group" | "unknown";

export interface LineupPhoneNumber {
  label: string;
  value: string;
}

export interface LineupDealer {
  name: string;
  city?: string | null;
  address?: string | null;
  phone_numbers?: LineupPhoneNumber[] | null;
  dealer_info_url?: string | null;
  map_url?: string | null;
  website?: string | null;
}

export interface LineupItem {
  label: string;
  url?: string | null;
  image_url?: string | null;
  counts?: number | null;
  minimum_price?: number | null;
  maximum_price?: number | null;
  minimum_value?: number | null;
  maximum_value?: number | null;
  dealers?: LineupDealer[];
}

export interface LineupSection {
  /** Stable identifier derived from title/name */
  id: string;
  /** Human readable section title (e.g., "SUVs", "By Make", "Brands") */
  title: string;
  /** Optional API-provided name (used for filters) */
  name?: string | null;
  /** Optional link target for the section */
  url?: string | null;
  /** Section category for UI handling */
  type: "models" | "filters" | "brands" | "unknown";
  /** Items within the section */
  items: LineupItem[];
}

export interface LineupLocationEntry {
  city?: string | null;
  name?: string | null;
  website?: string | null;
}

export interface LineupLocationGroup {
  /** Region label (e.g., "Oregon") */
  label?: string | null;
  /** Short region code (e.g., "OR") */
  name?: string | null;
  locations: LineupLocationEntry[];
}

export interface LineupData {
  /** What shape the upstream API returned */
  variant: LineupVariant;
  /** Normalized sections that cover new, used, and dealer group shapes */
  sections: LineupSection[];
  /** Optional location groupings (dealer groups only) */
  locations?: LineupLocationGroup[];
}

export interface LineupResponse {
  success: boolean;
  data: LineupData;
}

// ============================================================================
// Staff Information
// ============================================================================

export interface SocialNetwork {
  label: string;
  value: string;
}

export interface StaffMember {
  name: string;
  role: string;
  email: string;
  avatar: string | null;
  avatar_url: string | null;
  languages: string;
  description: string;
  phone_number: string;
  social_networks: SocialNetwork[];
}

export interface StaffGroup {
  group: string;
  members: StaffMember[];
}

export interface StaffInformation {
  dealer: {
    name: string;
    staff: StaffGroup[];
  };
}

export interface StaffInformationResponse {
  success: boolean;
  data: StaffInformation;
}

// ============================================================================
// Website Scripts
// ============================================================================

export type ScriptPlace = "head" | "before_body" | "after_body" | "body";
export type ScriptLocation = "everywhere" | "srp" | "vdp" | "srp_vdp" | "home";

export interface WebsiteScript {
  name: string;
  place: ScriptPlace;
  content: string;
  location: ScriptLocation;
}

// ============================================================================
// Error Response
// ============================================================================

export interface APIError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

export type APIResponse<T> = T | APIError;
