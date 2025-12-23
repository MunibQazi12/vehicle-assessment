/**
 * Tenant Module Exports
 * Provides both client-side (React Context) and server-side (React cache) tenant utilities
 */

// Client-side context hooks (for use in client components)
export {
  TenantProvider,
  useTenant,
  useTenantSafe,
  useWebsiteInfo,
  useWebsiteInfoSafe,
} from './context';

// Server-side cached utilities (for use in server components)
export {
  getTenantContext,
  getTenantWebsiteInfo,
  getTenantHostname,
  getTenantDealerId,
} from './server-context';
