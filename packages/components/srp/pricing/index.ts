/**
 * Pricing Templates
 * Export all available pricing templates and utilities
 */

import { DefaultPricing } from './DefaultPricing';
import { CompactPricing } from './CompactPricing';
import { CardPricing } from './CardPricing';
import { SplitPricing } from './SplitPricing';

export { DefaultPricing } from './DefaultPricing';
export { CompactPricing } from './CompactPricing';
export { CardPricing } from './CardPricing';
export { SplitPricing } from './SplitPricing';

export { 
  extractPriceData, 
  formatUSD, 
  calculateTotalSavings, 
  calculateTotalIncentives 
} from './utils';

export type { PriceData } from './utils';

/**
 * Available pricing template types
 */
export type PricingTemplate = 
  | 'default'
  | 'compact'
  | 'card'
  | 'split';

/**
 * Pricing template components map
 */
export const PRICING_TEMPLATES = {
  default: DefaultPricing,
  compact: CompactPricing,
  card: CardPricing,
  split: SplitPricing,
} as const;
