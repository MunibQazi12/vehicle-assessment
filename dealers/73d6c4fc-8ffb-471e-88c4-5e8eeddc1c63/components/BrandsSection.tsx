import Image from "next/image";

import { fetchLineup } from "@dealertower/lib/api/lineup";
import { getTenantContext } from "@dealertower/lib/tenant/server-context";
import { addBaseIfRelative } from "@dealertower/lib/utils/url";
import { SmartLink } from "@dealertower/components/ui";

type BrandCard = {
	name: string;
	image?: string | null;
	url?: string | null;
};

async function loadLineupBrands(): Promise<BrandCard[]> {
	const { hostname, dealerIdentifier } = await getTenantContext();

	if (!hostname || !dealerIdentifier) {
		return [];
	}

	try {
		const lineup = await fetchLineup(hostname);
		const brandSection = lineup.data.sections.find((section) => section.type === "brands");

		const normalized = brandSection?.items
			.map<BrandCard>((item) => ({
				name: item.label?.trim() || "",
				image: item.image_url ?? null,
				url: item.url ?? null,
			}))
			.filter((item) => item.name.length > 0);

		if (normalized && normalized.length > 0) {
			return normalized;
		}
	} catch (error) {
		console.error("[BrandsSection] Failed to load lineup brands", error);
	}

	return [];
}

async function loadPremiumBrands(): Promise<BrandCard[]> {
	const targetHostname = "www.geeautomotive.com";
	const baseUrl = `https://${targetHostname}`;

	try {
		const lineup = await fetchLineup(targetHostname);
		const brandSection = lineup.data.sections.find((section) => section.type === "brands");

		const normalized = brandSection?.items
			.map<BrandCard>((item) => ({
				name: item.label?.trim() || "",
				image: item.image_url ?? null,
				url: addBaseIfRelative(item.url, baseUrl),
			}))
			.filter((item) => item.name.length > 0);

		return normalized ?? [];
	} catch (error) {
		console.error("[BrandsSection] Failed to load premium brands from Gee Automotive", error);
		return [];
	}
}

/**
 * Reusable brand card component to reduce code duplication
 */
function BrandCardItem({ brand }: { brand: BrandCard }) {
	const hasImage = Boolean(brand.image);

	const content = (
		<div className="flex items-center justify-center p-3 sm:p-4 hover:scale-110 transition-all duration-300 cursor-pointer group">
			{hasImage ? (
				<div className="relative h-10 w-[60px] sm:h-12 sm:w-[100px] lg:h-[100px] lg:w-[175px]">
					<Image
						src={brand.image!}
						alt={`${brand.name} logo`}
						fill
						sizes="(max-width: 640px) 60px, (max-width: 768px) 100px, 175px"
						className="object-contain transition-all duration-300"
						loading="lazy"
					/>
				</div>
			) : (
				<span className="font-sans text-sm sm:text-base lg:text-lg text-gray-800">
					{brand.name}
				</span>
			)}
		</div>
	);

	if (brand.url) {
		return (
			<SmartLink href={brand.url} className="block">
				{content}
			</SmartLink>
		);
	}

	return <div className="h-full">{content}</div>;
}

/**
 * Filter premium brands to exclude any that already appear in the main brands list
 */
function filterPremiumBrands(premiumBrands: BrandCard[], mainBrands: BrandCard[]): BrandCard[] {
	const excludedSet = new Set(mainBrands.map((b) => b.name.toLowerCase()));
	return premiumBrands.filter((item) => !excludedSet.has(item.name.toLowerCase()));
}

export default async function BrandsSection() {
	// Parallel data fetching - both requests start simultaneously
	const [brandsResult, premiumBrandsResult] = await Promise.allSettled([
		loadLineupBrands(),
		loadPremiumBrands(),
	]);

	// Extract results with fallback to empty arrays on failure
	const brands = brandsResult.status === "fulfilled" ? brandsResult.value : [];
	const allPremiumBrands = premiumBrandsResult.status === "fulfilled" ? premiumBrandsResult.value : [];

	// Filter premium brands to exclude duplicates from main brands
	const premiumBrands = filterPremiumBrands(allPremiumBrands, brands);

	return (
		<section className="py-12 md:py-16 lg:py-24 pb-0 lg:pb-0 bg-white">
			<div className="max-w-7xl mx-auto px-4 pb-8 lg:pb-12">
				{/* Section Title */}
				<h2 className="font-sans font-bold text-[42px] text-center mb-8 lg:mb-12">
					Search <span className="text-[#72c6f5]">Tonkin</span> Brands
				</h2>

				{/* Main Brands Grid */}
				{brands.length > 0 && (
					<div className="grid grid-cols-3 md:grid-cols-5 gap-4 sm:gap-6 lg:gap-6">
						{brands.map((brand) => (
							<BrandCardItem key={brand.name} brand={brand} />
						))}
					</div>
				)}
			</div>

			{/* Ribbon Banner Announcement - Full Width */}
			<div className="w-full">
				<div className="bg-[#72c6f5] py-3 px-4">
					<div className="max-w-7xl mx-auto text-center">
						<p className="font-sans text-white text-base lg:text-lg font-normal whitespace-nowrap overflow-hidden text-ellipsis">
							Can&apos;t find what you&apos;re looking for?{" "}
							<a
								href="https://www.geeautomotive.com/"
								target="_blank"
								rel="noopener noreferrer"
								className="font-semibold hover:underline cursor-pointer"
							>
								Gee Automotive
							</a>{" "}
							features even more brands outside the Portland market.
						</p>
					</div>
				</div>
			</div>

			{/* Premium Brands Grid */}
			{premiumBrands.length > 0 && (
				<div className="bg-[#f8f8f8] py-12 lg:py-16">
					<div className="max-w-7xl mx-auto px-4">
						<div className="grid grid-cols-3 md:grid-cols-5 gap-4 sm:gap-6 lg:gap-6">
							{premiumBrands.map((brand) => (
								<BrandCardItem key={brand.name} brand={brand} />
							))}
						</div>
					</div>
				</div>
			)}
		</section>
	);
}
