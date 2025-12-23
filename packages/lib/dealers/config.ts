/**
 * Dealer Configuration Registry
 * 
 * Central configuration for dealer-specific branding, features, and settings.
 * Now uses API data from get-website-information endpoint.
 */

import { fetchWebsiteInformation, type DealerPhoneNumber, type DealerWorkHours } from '@dealertower/lib/api/dealer';
import { WebsiteScript } from '@dealertower/types/api';

export interface DealerTheme {
  primaryColor: string;
  secondaryColor?: string;
  accentColor?: string;
  logoUrl?: string;
  faviconUrl?: string;
}

export interface DealerFeatures {
  enableChatbot?: boolean;
  enableFinancing?: boolean;
  enableTradeIn?: boolean;
  enableServiceScheduling?: boolean;
  customComponents?: string[];
  customPages?: string[];
}

export interface DealerContact {
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
}

export interface websiteInfo {
  dealerId: string;
  hostname: string;
  dealershipName: string;
  brandName?: string;
  scripts?: WebsiteScript[];
  theme: DealerTheme;
  features?: DealerFeatures;
  contact?: DealerContact;
  seo?: {
    title?: string;
    description?: string;
  };
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  length_unit?: string;
  phone_numbers?: DealerPhoneNumber[];
  work_hours?: DealerWorkHours[];
  disclaimers?: {
    vdp?: {
      new?: string;
      used?: string;
      certified?: string;
    };
    srp?: {
      new?: string;
      used?: string;
      certified?: string;
    };
  };
}

/**
 * Get dealer configuration by hostname from API
 * Returns null if no configuration exists for the hostname
 */
export async function getwebsiteInfo(hostname: string): Promise<websiteInfo | null> {
  const dealerInfo = await fetchWebsiteInformation(hostname);
  
  // Return null if website not found (404) - this means website is not supported
  if (!dealerInfo) {
    console.warn(`[Dealer Config] No configuration found for ${hostname} - website not supported`);
    return null;
  }
  
  // Convert DealerInfo to websiteInfo with proper defaults
  const config: websiteInfo = {
    dealerId: dealerInfo.id,
    hostname: dealerInfo.site_url,
    dealershipName: dealerInfo.name,
    brandName: dealerInfo.name, // Can be customized from API later
    scripts: dealerInfo.website_scripts, // Scripts are now included in the same API call
    theme: {
      primaryColor: dealerInfo.main_colors?.[0] || '#0066CC',
      secondaryColor: dealerInfo.main_colors?.[1] || '#333333',
      accentColor: dealerInfo.main_colors?.[2] || '#FFFFFF',
      logoUrl: dealerInfo.logo_url || '/assets/logo.png',
      faviconUrl: dealerInfo.favicon_url || '/assets/favicon.ico',
    },
    features: {
      enableChatbot: false,
      enableFinancing: true,
      enableTradeIn: true,
      enableServiceScheduling: false,
      customPages: [],
    },
    contact: {
      phone: dealerInfo.phone_numbers?.[0]?.value,
      email: dealerInfo.email_addresses?.[0],
      address: dealerInfo.address ?? undefined,
      city: dealerInfo.city ?? undefined,
      state: dealerInfo.state ?? undefined,
      zip: dealerInfo.zip_code ?? undefined,
    },
    seo: {
      title: `${dealerInfo.name} - New & Used Vehicle Dealer`,
      description: `Browse new and used vehicles at ${dealerInfo.name}.`,
    },
    address: dealerInfo.address ?? undefined,
    city: dealerInfo.city ?? undefined,
    state: dealerInfo.state ?? undefined,
    zip_code: dealerInfo.zip_code ?? undefined,
    length_unit: dealerInfo.length_unit ?? undefined,
    phone_numbers: dealerInfo.phone_numbers,
    work_hours: dealerInfo.work_hours,
    disclaimers: dealerInfo.disclaimers,
  };
  
  return config;
}

/**
 * Check if a hostname has a dealer configuration
 */
export async function haswebsiteInfo(hostname: string): Promise<boolean> {
  const config = await getwebsiteInfo(hostname);
  return config !== null;
}

/**
 * Get all configured dealer hostnames
 * Note: This now requires API calls, so it's not recommended for bulk operations
 */
export function getAllDealerHostnames(): string[] {
  // Since we're using API, we can't list all dealers without a separate endpoint
  // Return empty array or implement a dealer list API endpoint
  console.warn('[Dealer Config] getAllDealerHostnames() is deprecated - use API to get dealer list');
  return [];
}


