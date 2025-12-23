/**
 * Used Vehicles SRP Page
 * Dedicated route for /used-vehicles that ensures SRP takes precedence over dealer pages
 */

import { SRPSharedPage, generateSRPMetadata } from "@dealertower/components/srp/SRPSharedPage";

/**
 * Force dynamic rendering since SRPSharedPage uses headers() for tenant detection
 */
export const dynamic = 'force-dynamic';

interface UsedVehiclesPageProps {
  params: Promise<{
    slug?: string[];
  }>;
  searchParams: Promise<{
    page?: string;
    sort?: string;
    [key: string]: string | string[] | undefined;
  }>;
}

export default async function UsedVehiclesPage({ params, searchParams }: UsedVehiclesPageProps) {
  return <SRPSharedPage params={params} searchParams={searchParams} conditionPrefix="used-vehicles" />;
}

export async function generateMetadata({ params, searchParams }: UsedVehiclesPageProps) {
  return generateSRPMetadata(params, searchParams, 'used-vehicles');
}

