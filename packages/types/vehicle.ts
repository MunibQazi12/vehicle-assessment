/**
 * Vehicle-specific type definitions
 */

export type VehicleCondition = "new" | "used" | "certified";

export type VehicleBodyType =
  | "sedan"
  | "suv"
  | "truck"
  | "coupe"
  | "convertible"
  | "wagon"
  | "van"
  | "hatchback";

export type VehicleFuelType =
  | "gasoline"
  | "diesel"
  | "electric"
  | "hybrid"
  | "plug-in hybrid";

export type VehicleTransmissionType = "automatic" | "manual" | "cvt";

export type VehicleDrivetrainType = "fwd" | "rwd" | "awd" | "4wd";

export interface VehiclePriceRange {
  min?: number | null;
  max?: number | null;
  max_payment?: number | null;
}

export interface VehicleMileageRange {
  min?: number | null;
  max?: number | null;
}

export interface VehicleYearRange {
  min?: number | null;
  max?: number | null;
}
