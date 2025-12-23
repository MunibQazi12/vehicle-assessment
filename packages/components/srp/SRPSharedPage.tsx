/**
 * Shared SRP Page Component
 * Handles both new-vehicles and used-vehicles with minimal duplication
 * Wraps content with ClientSideFilteringProvider for instant filtering
 */

import { notFound } from "next/navigation";
import { fetchSRPRows, fetchFilters } from "@dealertower/lib/api/srp";
import { getTenantContext } from "@dealertower/lib/tenant/server-context";
import { parseSlug } from "@dealertower/lib/url/parser";
import type { Metadata } from "next";
import { buildTenantMetadata } from "@dealertower/lib/seo/metadata";
import { JsonLd } from "@dealertower/lib/seo/jsonld";
import { buildSRPSchemaGraph } from "@dealertower/lib/seo/schema";
import { SRPPageWrapper } from "@dealertower/components/srp/SRPPageWrapper";
import { generateSRPTitle } from "@dealertower/lib/utils";
import { VehicleResultsHeading } from "@dealertower/components/srp/VehicleResultsHeading";
import { SRPIconsCarousel } from "@dealertower/components/srp/SRPIconsCarousel";
import { MobileFiltersDrawer } from "@dealertower/components/srp/MobileFiltersDrawer";
import { ClientVehicleGrid } from "@dealertower/components/srp/ClientVehicleGrid";
import { ClientFiltersWrapper } from "@dealertower/components/srp/ClientFiltersWrapper";
import TrendingNow from "./TrendingNow";

const ARRAY_FILTERS = [
	"condition",
	"year",
	"make",
	"model",
	"trim",
	"body",
	"fuel_type",
	"transmission",
	"engine",
	"drive_train",
	"ext_color",
	"int_color",
	"dealer",
	"state",
	"city",
	"key_features",
];

const BOOLEAN_FILTERS = [
	"is_special",
	"is_new_arrival",
	"is_in_transit",
	"is_sale_pending",
	"is_commercial",
];

const RANGE_PARAMS = [
	"price_min",
	"price_max",
	"mileage_min",
	"mileage_max",
];

const SORT_PAGINATION_PARAMS = ["page", "sort_by", "order"];

interface SRPSharedPageProps {
	params: Promise<{
		slug?: string[];
	}>;
	searchParams: Promise<{
		page?: string;
		sort?: string;
		[key: string]: string | string[] | undefined;
	}>;
	conditionPrefix: "new-vehicles" | "used-vehicles";
}

/**
 * Shared SRP page component
 */
export async function SRPSharedPage({
	params,
	searchParams,
	conditionPrefix,
}: SRPSharedPageProps) {
	// Get tenant context (cached - shared with layout and other components)
	const { hostname, dealerIdentifier, websiteInfo } = await getTenantContext();

	// If no website info found (404), this website is not supported
	if (!websiteInfo) {
		notFound();
	}

	const dealershipName = websiteInfo?.name
	const dealerCity = websiteInfo?.city;
	const dealerState = websiteInfo?.state;

	// Parse slug to extract path-based filters
	const resolvedParams = await params;

	// Build full slug with condition prefix
	const fullSlug = [conditionPrefix, ...(resolvedParams.slug || [])];
	const { filters: slugFilters, isValid } = parseSlug(fullSlug);

	if (!isValid) {
		notFound();
	}

	// Parse search params
	const resolvedSearchParams = await searchParams;
	const queryFilters = buildFilterRequestFromParams(resolvedSearchParams);
	// Merge filters: combine array filters from slug and query params
	const mergedFilters: Record<string, unknown> = {
		...queryFilters,
	};

	// Combine makes from both slug and query params
	if (slugFilters.make || queryFilters.make) {
		const slugMakes = slugFilters.make || [];
		const queryMakes = Array.isArray(queryFilters.make)
			? queryFilters.make
			: queryFilters.make
				? [queryFilters.make as string]
				: [];

		const allMakes = [...new Set([...slugMakes, ...queryMakes])];
		mergedFilters.make = allMakes;
	}

	// Combine models from both slug and query params
	if (slugFilters.model || queryFilters.model) {
		const slugModels = slugFilters.model || [];
		const queryModels = Array.isArray(queryFilters.model)
			? queryFilters.model
			: queryFilters.model
				? [queryFilters.model as string]
				: [];

		const allModels = [...new Set([...slugModels, ...queryModels])];
		mergedFilters.model = allModels;
	}

	// Combine conditions from both slug and query params
	if (slugFilters.condition || queryFilters.condition) {
		const slugConditions = slugFilters.condition || [];
		const queryConditions = Array.isArray(queryFilters.condition)
			? queryFilters.condition
			: queryFilters.condition
				? [queryFilters.condition as string]
				: [];

		const allConditions = [...new Set([...slugConditions, ...queryConditions])];
		mergedFilters.condition = allConditions;
	}

	// Extract sort_by and order from search params
	const sortBy = resolvedSearchParams.sort_by as string | undefined;
	const order = resolvedSearchParams.order as "asc" | "desc" | undefined;
	const search = resolvedSearchParams.search as string | undefined;

	const displayTitle =
		conditionPrefix === "new-vehicles" ? "New Vehicles" : "Used Vehicles";

	// Fetch vehicle and filter data in parallel to reduce blocking time
	const [initialVehicleData, filtersData] = await Promise.all([
		fetchVehicleData(
			mergedFilters,
			resolvedSearchParams,
			sortBy,
			order,
			hostname
		),
		fetchFilters(hostname, mergedFilters),
	]);

	const canonicalPath = `/${fullSlug.filter(Boolean).join("/")}/`;
	const canonicalUrl = buildTenantMetadata({
		hostname,
		pathname: canonicalPath,
		searchParams: resolvedSearchParams,
		includeParams: [
			...SORT_PAGINATION_PARAMS,
			...ARRAY_FILTERS,
			...RANGE_PARAMS,
			...BOOLEAN_FILTERS,
		],
	}).alternates?.canonical as string | undefined;

	const srpSchema =
		canonicalUrl && initialVehicleData?.success
			? buildSRPSchemaGraph({
				hostname,
				websiteInfo,
				canonicalUrl,
				pageName: `${displayTitle} - ${dealershipName}`,
				breadcrumbItems: [
					{ name: "Home", url: "/" },
					{
						name: displayTitle,
						url: `/${conditionPrefix}/`,
					},
					{ name: displayTitle, url: canonicalUrl },
				],
				vehicles: initialVehicleData.data.vehicles,
			})
			: null;

	return (
		<>
			{srpSchema && <JsonLd data={srpSchema} id="dt-schema-srp" />}
			<SRPPageWrapper
				initialFilters={mergedFilters}
				dealerId={dealerIdentifier}
				hostname={hostname}
				initialSortBy={sortBy}
				initialOrder={order}
				initialSearch={search}
				initialVehicleData={initialVehicleData}
				initialFilterData={filtersData}
				conditionPrefix={conditionPrefix}
				dealershipName={dealershipName}
			>
				<div className="min-h-screen w-full bg-zinc-50">
					<div className="w-full py-8 [@media(min-width:1921px)]:pr-30 xl:pr-6">
						{/* <h1 className="sr-only">{displayTitle}</h1> */}
						<div className="flex flex-col gap-6 lg:flex-row w-full">
                            <main className="flex-1 lg:order-2 xl:w-[calc(100%_-_320px)] lg:w-[calc(100%_-_327px)] w-full">
								{/* <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
									<div className="flex w-full items-center gap-3 sm:w-auto sm:flex-shrink-0 sm:justify-end justify-end">
										<MobileFiltersDrawer
											availableFilters={filtersData.data.available_filters}
											availableSorting={filtersData.data.available_sorting}
										/>
									</div>
								</div> */}

								<VehicleResultsHeading
									initialTotalCount={initialVehicleData.data.counts}
									displayTitle={displayTitle}
									make={mergedFilters.make as string[] | undefined}
									model={mergedFilters.model as string[] | undefined}
									bodyStyle={mergedFilters.body as string[] | undefined}
									city={dealerCity}
									state={dealerState}
									dealerName={dealershipName}
								/>

								<SRPIconsCarousel />

								<TrendingNow />

								<ClientVehicleGrid
									initialVehicles={initialVehicleData.data.vehicles}
									initialTotalCount={initialVehicleData.data.counts}
									initialPage={initialVehicleData.data.page}
									initialHasNext={initialVehicleData.data.has_next}
									displayTitle={displayTitle}
									availableSorting={filtersData.data.available_sorting}
									filtersData={filtersData}
								/>
							</main>

							<aside className="hidden w-full lg:order-1 lg:block xl:w-74 lg:w-[303px] lg:flex-shrink-0">
								<ClientFiltersWrapper
									initialAvailableFilters={filtersData.data.available_filters}
									initialSelectedFilters={filtersData.data.selected_filters}
								/>
							</aside>
						</div>
					</div>
				</div>
			</SRPPageWrapper>
		</>
	);
}

function fetchVehicleData(
	filters: Record<string, unknown>,
	searchParams: Record<string, string | string[] | undefined>,
	sortBy: string | undefined,
	order: "asc" | "desc" | undefined,
	hostname: string
) {
	const currentPage = parseInt((searchParams.page as string) || "1", 10);

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { sort_by, order: _order, ...filtersWithoutSort } = filters as Record<string, unknown>;

	return fetchSRPRows(
		hostname,
		{
			...filtersWithoutSort,
			page: currentPage,
			items_per_page: 24,
			...(sortBy && {
				sort_by: sortBy as
					| "order"
					| "price"
					| "mileage"
					| "year"
					| "mpg_highway"
					| "mpg_city"
					| "make"
					| "model",
			}),
			...(order && { order }),
		}
	);
}

function buildFilterRequestFromParams(
	searchParams: Record<string, string | string[] | undefined>
) {
	const filterRequest: Record<string, unknown> = {};

	for (const filter of ARRAY_FILTERS) {
		const value = searchParams[filter];
		if (value) {
			if (Array.isArray(value)) {
				filterRequest[filter] = value;
			} else if (typeof value === "string") {
				filterRequest[filter] = value.includes(",")
					? value.split(",")
					: [value];
			}
		}
	}

	if (searchParams.search && typeof searchParams.search === "string") {
		filterRequest.search = searchParams.search;
	}

	if (searchParams.price_min || searchParams.price_max) {
		filterRequest.price = {
			min: searchParams.price_min
				? parseFloat(searchParams.price_min as string)
				: undefined,
			max: searchParams.price_max
				? parseFloat(searchParams.price_max as string)
				: undefined,
		};
	}

	if (searchParams.mileage_min || searchParams.mileage_max) {
		filterRequest.mileage = {
			min: searchParams.mileage_min
				? parseFloat(searchParams.mileage_min as string)
				: undefined,
			max: searchParams.mileage_max
				? parseFloat(searchParams.mileage_max as string)
				: undefined,
		};
	}

	for (const filter of BOOLEAN_FILTERS) {
		const value = searchParams[filter];
		if (value === "true" || value === "1") {
			filterRequest[filter] = [true];
		}
	}

	if (searchParams.sort_by && typeof searchParams.sort_by === "string") {
		filterRequest.sort_by = searchParams.sort_by;
	}
	if (searchParams.order && typeof searchParams.order === "string") {
		filterRequest.order = searchParams.order;
	}

	return filterRequest;
}

/**
 * Generate metadata helper
 * Uses make/model from URL path (slug) and combines conditions from both path and query params
 */
export async function generateSRPMetadata(
	params: Promise<{ slug?: string[] }>,
	searchParams: Promise<Record<string, string | string[] | undefined>>,
	conditionPrefix: "new-vehicles" | "used-vehicles"
): Promise<Metadata> {
	const resolvedParams = await params;
	const resolvedSearchParams = await searchParams;

	const fullSlug = [conditionPrefix, ...(resolvedParams.slug || [])];
	const { filters: slugFilters } = parseSlug(fullSlug);
	const canonicalPath = `/${fullSlug.filter(Boolean).join("/")}/`;

	// Only use make/model from URL path (slug)
	const make = slugFilters.make?.[0];
	const model = slugFilters.model?.[0];

	// Get conditions from path
	const pathConditions = (slugFilters.condition as string[] | undefined) || [];

	// Get conditions from query params
	const queryCondition = resolvedSearchParams.condition;
	let queryConditions: string[] = [];
	if (queryCondition) {
		if (Array.isArray(queryCondition)) {
			queryConditions = queryCondition;
		} else if (typeof queryCondition === "string") {
			queryConditions = queryCondition.includes(",")
				? queryCondition.split(",")
				: [queryCondition];
		}
	}

	// Combine and deduplicate conditions
	const allConditions = [...new Set([...pathConditions, ...queryConditions])];

	// Use shared title generation function
	const title = generateSRPTitle(
		conditionPrefix,
		make,
		model,
		undefined, // dealerName not available in metadata generation
		allConditions.length > 0 ? allConditions : undefined
	);

	const { hostname } = await getTenantContext();

	return {
		title,
		description: `Browse our complete inventory of ${title
			.split(" | ")[0]
			.toLowerCase()}.`,
		...buildTenantMetadata({
			hostname,
			pathname: canonicalPath,
			searchParams: resolvedSearchParams,
			includeParams: [
				...SORT_PAGINATION_PARAMS,
				...ARRAY_FILTERS,
				...RANGE_PARAMS,
				...BOOLEAN_FILTERS,
			],
		}),
	};
}
