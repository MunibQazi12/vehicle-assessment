/**
 * SRP Layout
 * Wraps all SRP routes (new-vehicles and used-vehicles) to inject location-specific scripts
 */

import { fetchWebsiteScripts } from "@dealertower/lib/api/dealer";
import { HeadScripts } from "@dealertower/components/scripts/HeadScripts";
import { BodyScripts, GenericBodyScripts } from "@dealertower/components/scripts/BodyScripts";
import { getTenantHostname } from "@dealertower/lib/tenant/server-context";

export const dynamic = 'force-dynamic';

export default async function SRPLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get hostname from centralized resolver
  const hostname = await getTenantHostname();

  // Fetch website scripts
  const websiteScripts = await fetchWebsiteScripts(hostname);
  
  // SRP location includes both "srp" and "srp_vdp" scripts
  const location = "srp";

  return (
    <>
      {/* Inject SRP-specific head scripts */}
      <HeadScripts scripts={websiteScripts} location={location} />
      
      {/* Inject SRP-specific body scripts (before) */}
      <BodyScripts scripts={websiteScripts} location={location} position="before" />
      <GenericBodyScripts scripts={websiteScripts} location={location} />
      
      {/* Render SRP page content */}
      {children}
      
      {/* Inject SRP-specific body scripts (after) */}
      <BodyScripts scripts={websiteScripts} location={location} position="after" />
    </>
  );
}
