/**
 * Pricing Utility Functions
 * Shared data extraction and formatting logic for all pricing templates
 */

import type { SRPVehicle, VehiclePricing } from "@dealertower/types/api";

/**
 * @deprecated Use VehiclePricing from @dealertower/types/api instead
 * This type alias is maintained for backward compatibility
 */
export type PriceData = VehiclePricing;

/**
 * Format number as USD currency
 */
export function formatUSD(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Extract and format all pricing data from vehicle
 * Returns the pre-formatted prices object from the API
 */
export function extractPriceData(vehicle: SRPVehicle): PriceData {
  // Return the pre-formatted prices object from the vehicle
  // The API already provides all formatted price data
  return vehicle.prices || {};
}

/**
 * Calculate total savings (MSRP - Sale Price)
 */
export function calculateTotalSavings(vehicle: SRPVehicle): number {
  const msrp = vehicle.retail_price || vehicle.price;
  const salePrice = vehicle.sale_price || vehicle.price;

  if (!msrp || !salePrice || msrp <= salePrice) {
    return 0;
  }

  return msrp - salePrice;
}

/**
 * Calculate total incentives amount
 */
export function calculateTotalIncentives(vehicle: SRPVehicle): number {
  if (!vehicle.oem_incentives || vehicle.oem_incentives.length === 0) {
    return 0;
  }

  return vehicle.oem_incentives.reduce(
    (sum, incentive) => sum + (incentive.amount || 0),
    0
  );
}
