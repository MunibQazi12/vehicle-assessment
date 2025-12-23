import type { DealerInfoWithGroup } from "@dealertower/lib/api/dealer";
import type { SRPVehicle, VDPVehicle } from "@dealertower/types/api";

type BreadcrumbItem = {
	name: string;
	url: string;
};

function toOrigin(hostname: string): string {
	const hasProtocol =
		hostname.startsWith("http://") || hostname.startsWith("https://");
	const url = new URL(hasProtocol ? hostname : `https://${hostname}`);
	return url.origin;
}

function toAbsoluteUrl(
	origin: string,
	maybeUrl: string | null | undefined
): string | null {
	if (!maybeUrl) return null;
	if (maybeUrl.startsWith("http://") || maybeUrl.startsWith("https://")) {
		return maybeUrl;
	}
	if (maybeUrl.startsWith("/")) {
		return `${origin}${maybeUrl}`;
	}
	return null;
}

function compactObject<T extends Record<string, unknown>>(obj: T): T {
	return Object.fromEntries(
		Object.entries(obj).filter(
			([, value]) => value !== undefined && value !== null
		)
	) as T;
}

type OpeningHoursSpecification = {
	"@type": "OpeningHoursSpecification";
	dayOfWeek: string[];
	opens: string;
	closes: string;
};

export function getSchemaIds(hostname: string): {
	origin: string;
	websiteId: string;
	organizationId: string;
} {
	const origin = toOrigin(hostname);
	return {
		origin,
		websiteId: `${origin}#website`,
		organizationId: `${origin}#organization`,
	};
}

function inferCurrency(websiteInfo: DealerInfoWithGroup | null): "USD" | "CAD" {
	const countryRaw = websiteInfo?.country?.trim().toUpperCase();
	if (!countryRaw) return "USD";
	if (countryRaw === "CA" || countryRaw === "CANADA") return "CAD";
	return "USD";
}

function buildOpeningHoursSpecification(
	websiteInfo: DealerInfoWithGroup
): OpeningHoursSpecification[] | undefined {
	const firstWorkHoursEntry = websiteInfo.work_hours?.[0];
	const openDays =
		firstWorkHoursEntry?.value?.filter((day) => day.is_open) ?? [];

	if (openDays.length === 0) {
		return undefined;
	}

	const grouped: Record<string, OpeningHoursSpecification> = {};

	for (const { label: dayOfWeek, from: opens, to: closes } of openDays) {
		if (!opens || !closes || !dayOfWeek) continue;
		const key = `${opens}-${closes}`;
		if (!grouped[key]) {
			grouped[key] = {
				"@type": "OpeningHoursSpecification",
				dayOfWeek: [],
				opens,
				closes,
			};
		}
		grouped[key].dayOfWeek.push(dayOfWeek);
	}

	const specs = Object.values(grouped).filter(
		(spec) => spec.dayOfWeek.length > 0
	);
	return specs.length > 0 ? specs : undefined;
}

export function buildBaseSchemaGraph({
	hostname,
	websiteInfo,
}: {
	hostname: string;
	websiteInfo: DealerInfoWithGroup | null;
}): Record<string, unknown> | null {
	if (!websiteInfo) {
		return null;
	}

	const { origin, websiteId, organizationId } = getSchemaIds(hostname);
	const url = `${origin}/`;

	const image =
		toAbsoluteUrl(origin, websiteInfo.logo_url) ??
		toAbsoluteUrl(origin, "/assets/logo.png");
	const sameAs =
		websiteInfo.social_networks
			?.map((s) => s.value)
			.filter((value): value is string => Boolean(value)) ?? [];

	const address =
		websiteInfo.address ||
			websiteInfo.city ||
			websiteInfo.state ||
			websiteInfo.zip_code
			? compactObject({
				"@type": "PostalAddress",
				streetAddress: websiteInfo.address ?? undefined,
				addressLocality: websiteInfo.city ?? undefined,
				addressRegion: websiteInfo.state ?? undefined,
				postalCode: websiteInfo.zip_code ?? undefined,
				addressCountry: websiteInfo.country ?? undefined,
			})
			: undefined;

	const telephone = websiteInfo.phone_numbers?.[0]?.value ?? undefined;

	const geo =
		websiteInfo.latitude !== null &&
			websiteInfo.latitude !== undefined &&
			websiteInfo.longitude !== null &&
			websiteInfo.longitude !== undefined
			? {
				"@type": "GeoCoordinates",
				latitude: websiteInfo.latitude,
				longitude: websiteInfo.longitude,
			}
			: undefined;

	const openingHoursSpecification = buildOpeningHoursSpecification(websiteInfo);

	const organization = compactObject({
		"@type": "AutoDealer",
		"@id": organizationId,
		name: websiteInfo.name,
		url: url,
		image: image ?? undefined,
		telephone,
		areaServed: websiteInfo.city ? [websiteInfo.city] : undefined,
		address,
		geo,
		openingHoursSpecification,
		sameAs: sameAs.length > 0 ? sameAs : undefined,
	});

	const website = compactObject({
		"@type": "WebSite",
		"@id": websiteId,
		url,
		name: websiteInfo.name,
		publisher: { "@id": organizationId },
		inLanguage: "en",
	});

	return {
		"@context": "https://schema.org",
		"@graph": [organization, website],
	};
}

export function buildWebPageSchemaGraph({
	hostname,
	canonicalUrl,
	name,
}: {
	hostname: string;
	canonicalUrl: string;
	name?: string;
}): Record<string, unknown> {
	const { websiteId, organizationId } = getSchemaIds(hostname);
	const webPageId = `${canonicalUrl}#webpage`;

	const webPage = compactObject({
		"@type": "WebPage",
		"@id": webPageId,
		url: canonicalUrl,
		name,
		isPartOf: { "@id": websiteId },
		about: { "@id": organizationId },
	});

	return {
		"@context": "https://schema.org",
		"@graph": [webPage],
	};
}

export function buildBreadcrumbListSchema({
	hostname,
	canonicalUrl,
	items,
}: {
	hostname: string;
	canonicalUrl: string;
	items: BreadcrumbItem[];
}): Record<string, unknown> {
	const { origin } = getSchemaIds(hostname);

	const normalizedItems = items
		.map((item) =>
			compactObject({
				name: item.name,
				url: item.url.startsWith("http") ? item.url : `${origin}${item.url}`,
			})
		)
		.filter((item) => item.name && item.url);

	const breadcrumb = {
		"@type": "BreadcrumbList",
		"@id": `${canonicalUrl}#breadcrumb`,
		itemListElement: normalizedItems.map((item, index) => ({
			"@type": "ListItem",
			position: index + 1,
			name: item.name,
			item: item.url,
		})),
	};

	return {
		"@context": "https://schema.org",
		"@graph": [breadcrumb],
	};
}

export function buildSRPSchemaGraph({
	hostname,
	websiteInfo,
	canonicalUrl,
	pageName,
	breadcrumbItems,
	vehicles,
}: {
	hostname: string;
	websiteInfo: DealerInfoWithGroup | null;
	canonicalUrl: string;
	pageName: string;
	breadcrumbItems: BreadcrumbItem[];
	vehicles: SRPVehicle[];
}): Record<string, unknown> {
	const { origin, websiteId, organizationId } = getSchemaIds(hostname);

	const webPage = compactObject({
		"@type": "WebPage",
		"@id": `${canonicalUrl}#webpage`,
		url: canonicalUrl,
		name: pageName,
		isPartOf: { "@id": websiteId },
		about: { "@id": organizationId },
	});

	const breadcrumbGraph = buildBreadcrumbListSchema({
		hostname,
		canonicalUrl,
		items: breadcrumbItems,
	})["@graph"] as unknown[];

	const listVehicles = vehicles.slice(0, 24).map((vehicle) => {
		const path = vehicle.vdp_slug ? `/vehicle/${vehicle.vdp_slug}/` : null;
		const url = path ? `${origin}${path}` : null;
		const image = toAbsoluteUrl(origin, vehicle.photo) ?? undefined;
		const name =
			vehicle.title ||
			[vehicle.year, vehicle.make, vehicle.model, vehicle.trim]
				.filter(Boolean)
				.join(" ");

		return compactObject({
			"@type": "Vehicle",
			name: name || undefined,
			url: url ?? undefined,
			image,
		});
	});

	const itemList = compactObject({
		"@type": "ItemList",
		"@id": `${canonicalUrl}#itemlist`,
		url: canonicalUrl,
		name: `${pageName} Inventory`,
		numberOfItems: vehicles.length,
		itemListOrder: "https://schema.org/ItemListOrderAscending",
		itemListElement: listVehicles
			.map((item, index) =>
				item.url
					? {
						"@type": "ListItem",
						position: index + 1,
						url: item.url,
						item,
					}
					: null
			)
			.filter(Boolean),
	});

	const publisher =
		websiteInfo?.name
			? compactObject({
				"@type": "Organization",
				name: websiteInfo.name,
			})
			: undefined;

	return {
		"@context": "https://schema.org",
		"@graph": [webPage, ...breadcrumbGraph, itemList, ...(publisher ? [publisher] : [])],
	};
}

export function buildVDPSchemaGraph({
	hostname,
	websiteInfo,
	canonicalUrl,
	pageName,
	breadcrumbItems,
	vehicle,
}: {
	hostname: string;
	websiteInfo: DealerInfoWithGroup | null;
	canonicalUrl: string;
	pageName: string;
	breadcrumbItems: BreadcrumbItem[];
	vehicle: VDPVehicle;
}): Record<string, unknown> {
	const { websiteId, organizationId } = getSchemaIds(hostname);
	const currency = inferCurrency(websiteInfo);

	const webPage = compactObject({
		"@type": "WebPage",
		"@id": `${canonicalUrl}#webpage`,
		url: canonicalUrl,
		name: pageName,
		isPartOf: { "@id": websiteId },
		about: { "@id": organizationId },
		mainEntity: { "@id": `${canonicalUrl}#vehicle` },
	});

	const breadcrumbGraph = buildBreadcrumbListSchema({
		hostname,
		canonicalUrl,
		items: breadcrumbItems,
	})["@graph"] as unknown[];

	const unitCode = websiteInfo?.length_unit === "km" ? "KMT" : "SMI";
	const mileageFromOdometer =
		vehicle.mileage !== null && vehicle.mileage !== undefined
			? {
				"@type": "QuantitativeValue",
				value: vehicle.mileage,
				unitCode,
			}
			: undefined;

	const name =
		vehicle.title ||
		[vehicle.year, vehicle.make, vehicle.model, vehicle.trim]
			.filter(Boolean)
			.join(" ");

	const images = vehicle.photos?.length ? vehicle.photos : undefined;

	const vehicleNode = compactObject({
		"@type": "Vehicle",
		"@id": `${canonicalUrl}#vehicle`,
		name: name || undefined,
		url: canonicalUrl,
		image: images,
		vehicleIdentificationNumber: vehicle.vin_number ?? undefined,
		manufacturer: vehicle.make
			? { "@type": "Organization", name: vehicle.make }
			: undefined,
		model: vehicle.model ?? undefined,
		vehicleModelDate: vehicle.year ?? undefined,
		bodyType: vehicle.body ?? undefined,
		fuelType: vehicle.fuel_type ?? undefined,
		vehicleTransmission: vehicle.transmission ?? undefined,
		driveWheelConfiguration: vehicle.drive_train ?? undefined,
		mileageFromOdometer,
		offers: { "@id": `${canonicalUrl}#offer` },
	});

	const price = vehicle.sale_price ?? vehicle.price ?? vehicle.retail_price ?? undefined;
	const availability =
		vehicle.is_sold || vehicle.is_sale_pending
			? "https://schema.org/SoldOut"
			: "https://schema.org/InStock";

	const offer = compactObject({
		"@type": "Offer",
		"@id": `${canonicalUrl}#offer`,
		url: canonicalUrl,
		price,
		priceCurrency: price !== undefined ? currency : undefined,
		availability,
		seller: { "@id": organizationId },
		itemOffered: { "@id": `${canonicalUrl}#vehicle` },
	});

	return {
		"@context": "https://schema.org",
		"@graph": [webPage, ...breadcrumbGraph, vehicleNode, offer],
	};
}
