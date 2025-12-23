/**
 * Tenant-specific type definitions
 */

import type { DealerInfoWithGroup } from '@dealertower/lib/api/dealer';

export interface TenantInfo {
  hostname: string;
  dealerIdentifier: string;
  isOverridden: boolean;
}

export interface TenantContextValue {
  hostname: string;
  dealerIdentifier: string;
  websiteInfo: DealerInfoWithGroup | null;
}
