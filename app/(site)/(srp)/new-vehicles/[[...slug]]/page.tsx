/**
 * New Vehicles SRP Page
 * Dedicated route for /new-vehicles that ensures SRP takes precedence over dealer pages
 */

import { SRPSharedPage, generateSRPMetadata } from "@dealertower/components/srp/SRPSharedPage";

/**
 * Force dynamic rendering since SRPSharedPage uses headers() for tenant detection
 */
export const dynamic = 'force-dynamic';

interface NewVehiclesPageProps {
  params: Promise<{
    slug?: string[];
  }>;
  searchParams: Promise<{
    page?: string;
    sort?: string;
    [key: string]: string | string[] | undefined;
  }>;
}

export default async function NewVehiclesPage({ params, searchParams }: NewVehiclesPageProps) {
  return <SRPSharedPage params={params} searchParams={searchParams} conditionPrefix="new-vehicles" />;
}

export async function generateMetadata({ params, searchParams }: NewVehiclesPageProps) {
  return generateSRPMetadata(params, searchParams, 'new-vehicles');
}

