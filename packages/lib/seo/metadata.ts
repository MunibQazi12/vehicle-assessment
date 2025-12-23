import type { Metadata } from "next";

type SearchParams =
  | Record<string, string | string[] | undefined>
  | URLSearchParams
  | undefined;

interface TenantMetadataOptions {
  hostname: string;
  pathname: string;
  searchParams?: SearchParams;
  includeParams?: string[];
}

const toURL = (hostname: string): URL => {
  const hasProtocol =
    hostname.startsWith("http://") || hostname.startsWith("https://");
  return new URL(hasProtocol ? hostname : `https://${hostname}`);
};

const normalizePathname = (pathname: string): string => {
  if (!pathname || pathname === "/") {
    return "/";
  }

  // Guarantee leading slash
  let normalized = pathname.startsWith("/") ? pathname : `/${pathname}`;

  // For non-root paths:
  // 1) add trailing slash if missing
  // 2) ensure only a single trailing slash
  normalized = `${normalized}/`.replace(/\/+/g, "/");

  return normalized;
};

export const __test__normalizePathname = normalizePathname; // for testing purposes

const buildQueryString = (
  searchParams: SearchParams,
  includeParams: string[] | undefined
): string => {
  if (!searchParams || !includeParams || includeParams.length === 0) {
    return "";
  }

  const includeSet = new Set(includeParams);
  const entries: Array<[string, string]> = [];

  if (searchParams instanceof URLSearchParams) {
    searchParams.forEach((value, key) => {
      if (includeSet.has(key)) {
        entries.push([key, value]);
      }
    });
  } else {
    for (const [key, value] of Object.entries(searchParams)) {
      if (value === undefined || !includeSet.has(key)) {
        continue;
      }

      if (Array.isArray(value)) {
        for (const item of value) {
          entries.push([key, String(item)]);
        }
      } else {
        entries.push([key, String(value)]);
      }
    }
  }

  entries.sort((a, b) => {
    if (a[0] === b[0]) {
      return a[1].localeCompare(b[1]);
    }
    return a[0].localeCompare(b[0]);
  });

  const params = new URLSearchParams();
  for (const [key, value] of entries) {
    params.append(key, value);
  }

  const queryString = params.toString();
  return queryString ? `?${queryString}` : "";
};

export const __test__buildQueryString = buildQueryString; // for testing purposes

/**
 * Build canonical metadata (metadataBase + alternates.canonical) for a tenant-aware page.
 */
export const buildTenantMetadata = ({
  hostname,
  pathname,
  searchParams,
  includeParams,
}: TenantMetadataOptions): Pick<Metadata, "metadataBase" | "alternates"> => {
  const metadataBase = toURL(hostname);
  const path = normalizePathname(pathname);
  const query = buildQueryString(searchParams, includeParams);

  const canonical = new URL(`${path}${query}`, metadataBase);
  canonical.hash = "";

  return {
    metadataBase,
    alternates: {
      canonical: canonical.toString(),
    },
  };
};
