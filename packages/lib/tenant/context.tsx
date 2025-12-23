/**
 * Tenant Context Provider
 * Provides tenant information to client components via React Context
 */

"use client";

import { createContext, useContext, ReactNode } from "react";
import type { TenantContextValue } from "@dealertower/types/tenant";
import type { DealerInfoWithGroup } from "@dealertower/lib/api/dealer";

const TenantContext = createContext<TenantContextValue | null>(null);

interface TenantProviderProps {
  hostname: string;
  dealerIdentifier: string;
  websiteInfo: DealerInfoWithGroup | null;
  children: ReactNode;
}

/**
 * Provider component for tenant context.
 * Wraps the application to provide tenant information to all client components.
 *
 * @example
 * ```tsx
 * <TenantProvider hostname="dealer-abc.com" dealerIdentifier="dealer-abc">
 *   <App />
 * </TenantProvider>
 * ```
 */
export function TenantProvider({
  hostname,
  dealerIdentifier,
  websiteInfo,
  children,
}: TenantProviderProps) {
  return (
    <TenantContext.Provider value={{ hostname, dealerIdentifier, websiteInfo }}>
      {children}
    </TenantContext.Provider>
  );
}

/**
 * Hook to access tenant context in client components.
 *
 * @throws Error if used outside of TenantProvider
 * @returns Tenant context value with hostname and dealerIdentifier
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { hostname, dealerIdentifier } = useTenant();
 *   return <div>Dealer: {dealerIdentifier}</div>;
 * }
 * ```
 */
export function useTenant(): TenantContextValue {
  const context = useContext(TenantContext);

  if (!context) {
    throw new Error("useTenant must be used within a TenantProvider");
  }

  return context;
}

/**
 * Safe hook to access tenant context in client components.
 * Returns null if used outside of TenantProvider (useful for error boundaries).
 *
 * @returns Tenant context value or null
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const tenant = useTenantSafe();
 *   if (!tenant) return <div>Default Content</div>;
 *   return <div>Dealer: {tenant.dealerIdentifier}</div>;
 * }
 * ```
 */
export function useTenantSafe(): TenantContextValue | null {
  return useContext(TenantContext);
}

/**
 * Hook to access website information in client components.
 * Returns null if no website info exists for the current tenant.
 *
 * @returns Website information or null
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const websiteInfo = useWebsiteInfo();
 *   if (websiteInfo?.certified_logos) {
 *     return <img src={websiteInfo.certified_logos.nissan} alt="Certified" />;
 *   }
 *   return null;
 * }
 * ```
 */
export function useWebsiteInfo() {
  const { websiteInfo } = useTenant();
  return websiteInfo;
}

/**
 * Safe hook to access website information in client components.
 * Returns null if used outside of TenantProvider or if no website info exists.
 *
 * @returns Website information or null
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const websiteInfo = useWebsiteInfoSafe();
 *   if (websiteInfo?.certified_logos) {
 *     return <img src={websiteInfo.certified_logos.nissan} alt="Certified" />;
 *   }
 *   return null;
 * }
 * ```
 */
export function useWebsiteInfoSafe() {
  const tenant = useTenantSafe();
  return tenant?.websiteInfo ?? null;
}
