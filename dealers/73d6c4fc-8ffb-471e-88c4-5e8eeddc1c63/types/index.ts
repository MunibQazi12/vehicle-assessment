/**
 * Dealer-specific TypeScript type definitions for Tonkin Automotive Group
 * @module types
 */

import type { DepartmentHours } from '../lib/hours';

/**
 * Dealer information for display in dealer cards and lists
 */
export interface DealerInfo {
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  salesHours: DepartmentHours;
  serviceHours: DepartmentHours;
  partsHours: DepartmentHours;
  image: string;
  serviceUrl: string;
  partsUrl: string;
  mapUrl: string;
  brand?: string;
}

/**
 * Brand card data structure
 */
export interface BrandCard {
  name: string;
  image?: string | null;
  url?: string | null;
}

/**
 * Hero section CTA (Call-to-Action) button
 */
export interface HeroCTA {
  label: string;
  href: string;
  variant?: 'primary' | 'secondary';
}

/**
 * Page hero configuration
 */
export interface PageHeroConfig {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
}

/**
 * Content section configuration
 */
export interface ContentSectionConfig {
  title?: string;
  subtitle?: string;
  content: string | React.ReactNode;
  imageUrl?: string;
  imageAlt?: string;
  imagePosition?: 'left' | 'right';
  backgroundColor?: string;
}

/**
 * Iframe section configuration
 */
export interface IframeSectionConfig {
  title?: string;
  iframeUrl: string;
  minHeight?: string;
  aspectRatio?: string;
}
