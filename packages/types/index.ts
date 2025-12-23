/**
 * Central export point for all types
 */

// API types
export type {
	VehicleSortType,
	SRPRowsRequest,
	SRPRowsResponse,
	SRPVehicle,
	VehiclePricing,
	VDPVehicle,
	VDPResponse,
	VDPSimilarsResponse,
	CTAButton,
	CTADevice,
	CTAType,
	CTACondition,
	CTALocation,
	CTABtnAttribute,
	CTABtnClasses,
	CTABtnStyles,
	VehicleTag,
	OEMIncentive,
	FilterType,
	FiltersRequest,
	FiltersResponse,
	SelectedFilter,
	AvailableFilter,
	FilterValue,
	PaymentOption,
	SortingOption,
	FilterValuesRequest,
	FilterValuesResponse,
	FilterValueItem,
	TrimOption,
	APIError,
	APIResponse,
	VehicleCountsResponse,
	LineupVariant,
	LineupPhoneNumber,
	LineupDealer,
	LineupItem,
	LineupSection,
	LineupLocationEntry,
	LineupLocationGroup,
	LineupData,
	LineupResponse,
} from "./api";

// Vehicle types
export type {
	VehicleCondition,
	VehicleBodyType,
	VehicleFuelType,
	VehicleTransmissionType,
	VehicleDrivetrainType,
	VehiclePriceRange,
	VehicleMileageRange,
	VehicleYearRange,
} from "./vehicle";

// Filter types
export type {
	FilterState,
	FilterGroupConfig,
	SortOption,
} from "./filters";

// Tenant types
export type { TenantInfo, TenantContextValue } from "./tenant";

// Dealer/Website Info types
export type {
	DealerInfoWithGroup,
	DealerTheme,
	DealerPhoneNumber,
	DealerWorkHours,
	SocialNetwork,
	NavigationItem,
	FooterLink,
	WebsiteExternalLink
} from "../lib/api/dealer";

// Form types
export type {
	FormFieldType,
	FormFieldOption,
	FormFieldSettings,
	FormFieldValidation,
	FormFieldBase,
	FormFieldText,
	FormFieldEmail,
	FormFieldTel,
	FormFieldDate,
	FormFieldSelect,
	FormFieldTextarea,
	FormFieldSubmit,
	FormFieldHidden,
	FormFieldParagraph,
	FormFieldRadio,
	FormFieldCheckbox,
	FormFieldFile,
	FormField,
	DealerTowerForm,
	FormAPIResponse,
	FormsListItem,
	FormsListAPIResponse,
	FormSubmissionData,
	FormSubmissionResponse,
} from "./forms";

// Form type guards
export {
	fieldHasOptions,
	isTextInputField,
	isFileField,
} from "./forms";

// Dealer Registry types (lazy loading with dynamic imports)
export type {
	LazyComponentLoader,
	LazyDealerRouteEntry,
	LazyDealerRegistry,
	LazyDealerRegistryModule,
} from "./dealer-registry";

// Specials/Offers types
export type {
	OfferType,
	OfferValueType,
	SpecialOffer,
	VehicleSpecial,
	SpecialCTAButton,
	SpecialCardProps,
	SpecialsGridProps,
	OfferBadgeProps,
	OfferValueProps,
	// API types
	SpecialChannel,
	SpecialType,
	APISpecialCTA,
	APISpecialHeadline,
	APISpecialDiscount,
	APISpecialItem,
	SpecialsRequest,
	SpecialsResponse,
} from "./specials";

