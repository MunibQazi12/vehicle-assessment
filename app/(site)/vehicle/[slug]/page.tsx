import { notFound } from "next/navigation";
import { fetchVDPDetails, fetchVDPSimilars } from "@dealertower/lib/api/vdp";
import { getTenantContext } from "@dealertower/lib/tenant/server-context";
import { VehicleGallery } from "@dealertower/components/vdp/VehicleGallery";
import { VehicleDetailsTable } from "@dealertower/components/vdp/VehicleDetailsTable";
import { VehicleDescription } from "@dealertower/components/vdp/VehicleDescription";
import { VehicleDisclaimer } from "@dealertower/components/vdp/VehicleDisclaimer";
import { VehicleSidebar } from "@dealertower/components/vdp/VehicleSidebar";
import { SimilarVehicles } from "@dealertower/components/vdp/SimilarVehicles";
import { DealerInformationCard } from "@dealertower/components/vdp/DealerInformationCard";
import { VehicleActionBar } from "@dealertower/components/vdp/VehicleActionBar";
import { normalizeForUrl } from "@dealertower/lib/utils/text";
import { formatMilage } from "@dealertower/lib/utils/formatMileage";
import { Metadata } from "next";
import { ensureHttps } from "@dealertower/lib/utils/image";
import {
	P4C_ALLOWED_HOSTS,
	MONRONEY_ALLOWED_HOSTS,
} from "@dealertower/lib/historyBadges";
import { VehicleLogosAndPhoneBlock } from "@dealertower/components/vdp/VehicleLogosAndPhoneBlock";

import { buildTenantMetadata } from "@dealertower/lib/seo/metadata";
import { JsonLd } from "@dealertower/lib/seo/jsonld";
import { buildVDPSchemaGraph } from "@dealertower/lib/seo/schema";

interface VDPPageProps {
	params: Promise<{ slug: string }>;
}

type BreadcrumbLink = {
	label: string;
	href: string;
};

function hasStatusCode(error: unknown): error is { status: number } {
	return (
		typeof error === "object" &&
		error !== null &&
		"status" in error &&
		typeof (error as Record<string, unknown>).status === "number"
	);
}

export async function generateMetadata({
	params,
}: VDPPageProps): Promise<Metadata> {
	const { slug } = await params;
	const canonicalPath = `/vehicle/${slug}/`;

	// Get tenant context for metadata generation
	const { hostname } = await getTenantContext();

	try {
		const response = await fetchVDPDetails(hostname, slug);

		if (!response.success || !response.data) {
			return {
				title: "Vehicle Not Found",
			};
		}

		const vehicle = response.data;
		const title = vehicle.title || "Vehicle Details";
		const description = vehicle.description
			? vehicle.description.substring(0, 155) + "..."
			: `${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.trim || ""
			} - ${vehicle.condition} ${vehicle.body} located in ${vehicle.city?.[0]
			}, ${vehicle.state?.[0]}`;

		return {
			title: `${title} | ${vehicle.dealer?.[0] || "Dealer"}`,
			description,
			openGraph: {
				title,
				description,
				images: vehicle.photos?.[0] ? [vehicle.photos[0]] : [],
			},
			...buildTenantMetadata({
				hostname,
				pathname: canonicalPath,
			}),
		};
	} catch (error) {
		// Don't log 404 errors - they're expected for invalid vehicle URLs
		const is404 = (error as Error & { status?: number })?.status === 404;
		if (!is404) {
			console.error("Error generating metadata:", error);
		}
		return {
			title: "Vehicle Not Found",
			...buildTenantMetadata({
				hostname,
				pathname: canonicalPath,
			}),
		};
	}
}

export default async function VDPPage({ params }: VDPPageProps) {
	const { slug } = await params;
	const canonicalPath = `/vehicle/${slug}/`;

	// Get tenant context (cached - shared with layout and other components)
	const { hostname, websiteInfo } = await getTenantContext();
	const normalizedHostname =
		hostname?.toLowerCase().replace(/^www\./, "") || "";
	const isP4CHost = P4C_ALLOWED_HOSTS.includes(normalizedHostname);
	const isMonroneyHost = MONRONEY_ALLOWED_HOSTS.includes(normalizedHostname);

	// Fetch vehicle details and similar vehicles in parallel
	const [response, similarsResponse] = await Promise.all([
		fetchVDPDetails(hostname, slug).catch(
			(error: unknown) => {
				// If it's a 404, trigger Next.js notFound immediately (don't log)
				if (hasStatusCode(error) && error.status === 404) {
					notFound();
				}
				// Log other errors
				console.error("Error fetching VDP data:", error);
				return null;
			}
		),
		fetchVDPSimilars(hostname, slug).catch(() => {
			// Silently fail for similars - not critical
			return { success: false, data: [] };
		}),
	]);

	// If no website info found (404), this website is not supported
	if (!websiteInfo) {
		console.error(`[VDP] Website not supported: ${hostname}`);
		notFound();
	}

	// If response is null or unsuccessful, show 404
	if (!response || !response.success || !response.data) {
		notFound();
	}

	const vehicle = response.data;
	const carfaxIconUrl = ensureHttps(vehicle.carfax_icon_url);
	const carfaxReportUrl = vehicle.carfax_url || null;
	const shouldShowCarfaxBadge = Boolean(carfaxIconUrl && carfaxReportUrl);
	const shouldShowP4CBadge = Boolean(isP4CHost && vehicle.vin_number);
	const certifiedLogoUrl =
		vehicle.condition?.toLowerCase() === "certified" && vehicle.make
			? websiteInfo?.certified_logos?.[
			vehicle.make.toLowerCase().replace(/\s+/g, "_")
			] || null
			: null;
	const shouldShowCertifiedLogo = Boolean(certifiedLogoUrl);
	const shouldShowMonroneyBadge = Boolean(
		isMonroneyHost && vehicle.vin_number && vehicle.year && vehicle.make
	);
	const shouldShowHistoryBadges =
		shouldShowCarfaxBadge ||
		shouldShowP4CBadge ||
		shouldShowCertifiedLogo ||
		shouldShowMonroneyBadge;
	const similarVehicles = similarsResponse?.data || [];
	const formatConditionLabel = (condition?: string | null) => {
		if (!condition) {
			return null;
		}
		const normalized = condition.toLowerCase();
		if (normalized === "used") {
			return "Pre-Owned";
		}
		if (normalized === "certified") {
			return "Certified Pre-Owned";
		}
		return normalized.charAt(0).toUpperCase() + normalized.slice(1);
	};
	const conditionDisplay = formatConditionLabel(vehicle.condition);
	const isKilometers = websiteInfo?.length_unit === "km";
	const mileageUnitSingular = isKilometers ? "km" : "mile";
	const mileageUnitPlural = isKilometers ? "km" : "miles";
	const formattedMileage = vehicle.mileage
		? `${formatMilage(vehicle.mileage)} ${vehicle.mileage === 1 ? mileageUnitSingular : mileageUnitPlural
		}`
		: null;
	const mpgDisplay =
		vehicle.mpg_city && vehicle.mpg_highway
			? `${vehicle.mpg_city} City / ${vehicle.mpg_highway} Highway`
			: vehicle.mpg_city
				? `${vehicle.mpg_city} City`
				: vehicle.mpg_highway
					? `${vehicle.mpg_highway} Highway`
					: null;

	const canonicalUrl = buildTenantMetadata({
		hostname,
		pathname: canonicalPath,
	}).alternates?.canonical as string | undefined;

	const pageName =
		vehicle.title ||
		[vehicle.year, vehicle.make, vehicle.model, vehicle.trim]
			.filter(Boolean)
			.join(" ");

	// Prepare images for gallery with preview images for blur placeholder
	const images =
		vehicle.photos?.map((url, index) => ({
			url,
			alt: `${vehicle.title} - Image ${index + 1}`,
			preview: vehicle.photos_preview?.[index] || undefined,
		})) || [];

	// Prepare details for table
	const details = [
		{ label: "Body Type", value: vehicle.body },
		{ label: "Fuel Type", value: vehicle.fuel_type },
		{
			label: "Condition",
			value: conditionDisplay,
		},
		{
			label: "City MPG",
			value: vehicle.mpg_city ? `${vehicle.mpg_city}` : null,
		},
		{
			label: "Mileage",
			value: vehicle.mileage ? formattedMileage : null,
		},
		{
			label: "Highway MPG",
			value: vehicle.mpg_highway ? ` ${vehicle.mpg_highway} ` : null,
		},
		{ label: "Engine", value: vehicle.engine },
		{ label: "Transmission", value: vehicle.transmission },
		{ label: "Drivetrain", value: vehicle.drive_train },
		{
			label: "Exterior Color",
			value: vehicle.ext_color_raw || vehicle.ext_color,
		},
		{
			label: "Interior Color",
			value: vehicle.int_color_raw || vehicle.int_color,
		},
		{ label: "Doors", value: vehicle.doors },
	];
	const specificationDetails = [
		{ label: "Stock Number", value: vehicle.stock_number },
		{ label: "VIN", value: vehicle.vin_number },
		{ label: "Type", value: vehicle.year },
		{ label: "Make", value: vehicle.make },
		{ label: "Model", value: vehicle.model },
		{ label: "Trim", value: vehicle.trim },
		{ label: "Body Type", value: vehicle.body },
		{ label: "Engine", value: vehicle.engine },
		{ label: "Transmission", value: vehicle.transmission },
		{ label: "Drivetrain", value: vehicle.drive_train },
		{
			label: "Exterior Color",
			value: vehicle.ext_color_raw || vehicle.ext_color,
		},
		{
			label: "Interior Color",
			value: vehicle.int_color_raw || vehicle.int_color,
		},
		{ label: "Mileage", value: formattedMileage },

		{ label: "Fuel Type", value: vehicle.fuel_type },
		{ label: "MPG", value: mpgDisplay },
		{ label: "Condition", value: conditionDisplay },
	];

	const dealerAddress = vehicle.address?.[0] || websiteInfo.address || null;
	const dealerCity = vehicle.city?.[0] || websiteInfo.city || null;
	const dealerState = vehicle.state?.[0] || websiteInfo.state || null;
	const dealerZip = vehicle.zipcode?.[0] || websiteInfo.zip_code || null;
	const dealerLocation =
		dealerAddress && dealerCity && dealerState && dealerZip
			? `${dealerAddress}, ${dealerCity}, ${dealerState} ${dealerZip}`
			: null;
	const directionsUrl = dealerLocation
		? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
			dealerLocation
		)}`
		: null;
	const primaryPhone =
		websiteInfo.phone_numbers?.find((phone) => {
			const label = phone.label?.toLowerCase() || "";
			return label.includes("sales");
		}) ||
		websiteInfo.phone_numbers?.[0] ||
		null;
	const primaryPhoneNumber = primaryPhone?.value || null;
	const salesPhoneNumber = primaryPhoneNumber;

	const primaryWorkHours =
		websiteInfo.work_hours?.find((section) => {
			const label = section.label?.toLowerCase() || "";
			return label.includes("sales");
		}) || websiteInfo.work_hours?.[0];

	// Get the appropriate disclaimer based on vehicle condition
	const getDisclaimer = () => {
		if (!websiteInfo?.disclaimers?.vdp) {
			return null;
		}

		const condition = vehicle.condition?.toLowerCase();

		if (condition === "certified") {
			return websiteInfo.disclaimers.vdp.certified;
		} else if (condition === "new") {
			return websiteInfo.disclaimers.vdp.new;
		} else {
			// Default to used for any other condition
			return websiteInfo.disclaimers.vdp.used;
		}
	};

	const disclaimerHtml = getDisclaimer();

	// Generate breadcrumb with proper URLs
	// Breadcrumb order: Home => Condition => Make => Body => Model => Title
	// URL structure: /{condition}/{make}/{model}/?body={body}
	// Body type goes in query params, not path

	// Determine condition label and base URL
	const conditionLower = vehicle.condition?.toLowerCase();
	const isNew = conditionLower === "new";
	const isCertified = conditionLower === "certified";
	const conditionLabel = isNew
		? "New"
		: isCertified
			? "Certified Pre-Owned"
			: "Pre-Owned";
	const conditionPath = isNew
		? "/new-vehicles/"
		: isCertified
			? "/used-vehicles/certified/"
			: "/used-vehicles/";

	const breadcrumbItems: BreadcrumbLink[] = [{ label: "Home", href: "/" }];
	if (vehicle.condition) {
		breadcrumbItems.push({ label: conditionLabel, href: conditionPath });
	}
	if (vehicle.make) {
		breadcrumbItems.push({
			label: vehicle.make,
			href: `${conditionPath}${normalizeForUrl(vehicle.make)}/`,
		});
	}
	if (vehicle.body) {
		breadcrumbItems.push({
			label: vehicle.body,
			href: `${conditionPath}${normalizeForUrl(
				vehicle.make || ""
			)}/?body=${normalizeForUrl(vehicle.body)}`,
		});
	}
	if (vehicle.model) {
		breadcrumbItems.push({
			label: vehicle.model,
			href: `${conditionPath}${normalizeForUrl(
				vehicle.make || ""
			)}/${normalizeForUrl(vehicle.model)}/${vehicle.body ? `?body=${normalizeForUrl(vehicle.body)}` : ""
				}`,
		});
		const fallbackHref =
			breadcrumbItems.length > 1
				? breadcrumbItems[breadcrumbItems.length - 2]?.href || "/"
				: "/";

		if (vehicle.title) {
			breadcrumbItems.push({ label: vehicle.title, href: canonicalPath });
		}

		const vdpSchema =
			canonicalUrl && pageName
				? buildVDPSchemaGraph({
					hostname,
					websiteInfo,
					canonicalUrl,
					pageName,
					breadcrumbItems: breadcrumbItems.map((item) => ({
						name: item.label,
						url: item.href,
					})),
					vehicle,
				})
				: null;

		return (
			<main className='min-h-screen bg-white'>
				{vdpSchema && (
					<JsonLd
						data={vdpSchema}
						id='dt-schema-vdp'
					/>
				)}

				{/* <VehicleBreadcrumbs items={breadcrumbItems} /> */}

				<section className='bg-[#FFD700]'>
					<VehicleActionBar
						vin={vehicle.vin_number}
						title={vehicle.title}
						year={Number(vehicle.year)}
						make={vehicle.make}
						model={vehicle.model}
						fallbackHref={fallbackHref}
					/>
				</section>
				<div className='grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_416px] 2xl:grid-cols-[minmax(0,1fr)_520px] relative'>

				</div>
				<section className='container mx-auto space-y-6 px-4 pb-10 pt-6'>
					<div className='grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_416px] 2xl:grid-cols-[minmax(0,1fr)_520px] relative xl:h-full'>
						<div className='rounded-[36px] p-2'>
							<VehicleGallery
								images={images}
								title={vehicle.title || ""}
							/>
						</div>

						<div className='lg:row-span-2 xl:h-full'>
							<VehicleSidebar
								vehicle={vehicle}
								dealerInfo={websiteInfo}
							/>
						</div>

						<div className='space-y-6'>
							<VehicleLogosAndPhoneBlock
								salesPhoneNumber={salesPhoneNumber}
								shouldShowHistoryBadges={shouldShowHistoryBadges}
								carfaxReportUrl={carfaxReportUrl}
								carfaxIconUrl={carfaxIconUrl}
								certifiedLogoUrl={certifiedLogoUrl}
								normalizedHostname={normalizedHostname}
								vehicle={vehicle}
								directionsUrl={directionsUrl}
								primaryPhoneNumber={primaryPhoneNumber}
							/>

							<div className='space-y-8'>
								<VehicleDetailsTable
									details={details}
									stockNumber={vehicle.stock_number}
									vinNumber={vehicle.vin_number}
								/>

								<VehicleDescription
									description={vehicle.description}
									keyFeatures={vehicle.key_features}
									specifications={specificationDetails}
								/>
							</div>

							<div className='rounded-4xl'>
								<DealerInformationCard workHoursSection={primaryWorkHours} />
							</div>

							<div className='bg-white'>
								<SimilarVehicles vehicles={similarVehicles} />
							</div>
						</div>
					</div>
				</section>

				<VehicleDisclaimer disclaimerHtml={disclaimerHtml} />
			</main>
		);
	}
}
