/**
 * SRP Scripts Wrapper
 * Injects location-specific scripts for SRP pages
 * This is a Server Component that should be used in SRP page layouts
 */

import { fetchWebsiteScripts } from "@dealertower/lib/api/dealer";
import { HeadScripts } from "@dealertower/components/scripts/HeadScripts";
import { BodyScripts, GenericBodyScripts } from "@dealertower/components/scripts/BodyScripts";

interface SRPScriptsWrapperProps {
  hostname: string;
  children: React.ReactNode;
}

/**
 * Wrapper component that fetches and injects SRP-specific scripts
 * Use this in SRP page layouts to include srp and srp_vdp scripts
 */
export async function SRPScriptsWrapper({ hostname, children }: SRPScriptsWrapperProps) {
  // Fetch scripts for this dealer
  const websiteScripts = await fetchWebsiteScripts(hostname);
  
  // SRP location includes both "srp" and "srp_vdp" scripts
  const location = "srp";

  return (
    <>
      {/* Head scripts specific to SRP */}
      <HeadScripts scripts={websiteScripts} location={location} />
      
      {/* Before body scripts for SRP */}
      <BodyScripts scripts={websiteScripts} location={location} position="before" />
      <GenericBodyScripts scripts={websiteScripts} location={location} />
      
      {children}
      
      {/* After body scripts for SRP */}
      <BodyScripts scripts={websiteScripts} location={location} position="after" />
    </>
  );
}

interface VDPScriptsWrapperProps {
  hostname: string;
  children: React.ReactNode;
}

/**
 * Wrapper component for VDP (Vehicle Detail Page) specific scripts
 * Use this in VDP page layouts when implemented
 */
export async function VDPScriptsWrapper({ hostname, children }: VDPScriptsWrapperProps) {
  const websiteScripts = await fetchWebsiteScripts(hostname);
  const location = "vdp";

  return (
    <>
      <HeadScripts scripts={websiteScripts} location={location} />
      <BodyScripts scripts={websiteScripts} location={location} position="before" />
      <GenericBodyScripts scripts={websiteScripts} location={location} />
      {children}
      <BodyScripts scripts={websiteScripts} location={location} position="after" />
    </>
  );
}

interface HomeScriptsWrapperProps {
  hostname: string;
  children: React.ReactNode;
}

/**
 * Wrapper component for home page specific scripts
 */
export async function HomeScriptsWrapper({ hostname, children }: HomeScriptsWrapperProps) {
  const websiteScripts = await fetchWebsiteScripts(hostname);
  const location = "home";

  return (
    <>
      <HeadScripts scripts={websiteScripts} location={location} />
      <BodyScripts scripts={websiteScripts} location={location} position="before" />
      <GenericBodyScripts scripts={websiteScripts} location={location} />
      {children}
      <BodyScripts scripts={websiteScripts} location={location} position="after" />
    </>
  );
}
