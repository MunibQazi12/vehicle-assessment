/**
 * Shared Title Generation Utility
 * 
 * Provides consistent title generation for both SSR (metadata) and CSR (dynamic updates).
 * Only uses make and model values that appear in URL path params.
 */

/**
 * Generate SRP page title based on condition, make, and model
 * 
 * @param conditionPrefix - Route condition prefix (new-vehicles or used-vehicles)
 * @param make - Make value from URL path (single value)
 * @param model - Model value from URL path (single value)
 * @param dealerName - Optional dealer name for branding
 * @param conditions - Actual conditions from filters (path + query params)
 * @returns Formatted page title
 */
export function generateSRPTitle(
  conditionPrefix: "new-vehicles" | "used-vehicles",
  make?: string,
  model?: string,
  dealerName?: string,
  conditions?: string[]
): string {
  // Determine condition text based on actual conditions
  let conditionText: string;
  
  if (conditions && conditions.length > 0) {
    // Check for mixed conditions
    const hasNew = conditions.includes('new');
    const hasUsed = conditions.includes('used');
    const hasCertified = conditions.includes('certified');
    
    if (hasNew && hasUsed && hasCertified) {
      // All conditions present - no condition prefix needed
      conditionText = "";
    } else if (hasNew && hasCertified && !hasUsed) {
      // Special case: new + certified = "New & Certified Pre-Owned"
      conditionText = "New & Certified Pre-Owned";
    } else if (hasNew && (hasUsed || hasCertified)) {
      // Mixed: new + used (or new + used + certified)
      conditionText = "New & Used";
    } else if (hasCertified && !hasUsed) {
      // Certified only
      conditionText = "Certified Pre-Owned";
    } else if (hasNew) {
      conditionText = "New";
    } else if (hasUsed) {
      conditionText = "Used";
    } else {
      // Fallback
      conditionText = conditionPrefix === "new-vehicles" ? "New" : "Used";
    }
  } else {
    // No conditions array provided, use prefix
    conditionText = conditionPrefix === "new-vehicles" ? "New" : "Used";
  }
  
  let title = conditionText ? `${conditionText} Vehicles` : "Vehicles";

  // Apply same logic as generateSRPMetadata
  if (make && model) {
    const makeText = capitalizeFirstLetter(make);
    const modelText = capitalizeFirstLetter(model);
    title = `${conditionText} ${makeText} ${modelText} Vehicles`;
  } else if (make) {
    const makeText = capitalizeFirstLetter(make);
    title = `${conditionText} ${makeText} Vehicles`;
  }

  // Add dealer name or default branding
  const suffix = dealerName || "Dealer Tower";
  return `${title} | ${suffix}`;
}

/**
 * Capitalize first letter of a string
 * Matches the SSR metadata generation logic
 */
function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
