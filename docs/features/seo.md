# SEO Canonical Metadata

## Why Canonical URLs Matter

- Prevent duplicate content across SRP/VDP/static pages and per-dealer hosts by pointing crawlers to a single authoritative URL.
- Trailing slashes are normalized so that `/inventory` and `/inventory/` do not compete as separate pages in search results.
- Hash fragments are stripped because they represent client-side anchors, not distinct content, and should never change the canonical.

## `buildTenantMetadata` Overview

| Parameter       | Type                                                                 | Purpose                                                                                            |
| --------------- | -------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `hostname`      | `string`                                                             | Dealer host; may include protocol. If protocol is omitted, `https://` is added.                    |
| `pathname`      | `string`                                                             | Page path to canonicalize. Leading slash is guaranteed and a single trailing slash is enforced.    |
| `searchParams`  | `Record<string, string \| string[] \| undefined> \| URLSearchParams` | Optional query params to include after filtering. Sorted for deterministic output.                 |
| `includeParams` | `string[]`                                                           | Allowlist of query params to include in the canonical URL.                                         |

| Output                 | Type     | Details                                                                                    |
| ---------------------- | -------- | ------------------------------------------------------------------------------------------ |
| `metadataBase`         | `URL`    | Normalized host used by Next.js to resolve relative metadata URLs.                         |
| `alternates.canonical` | `string` | Fully-qualified canonical URL with normalized path, filtered query string, and empty hash. |

`normalizePathname` guarantees a single leading slash and single trailing slash for non-root paths, collapsing duplicates. `buildQueryString` sorts keys/values, keeps only allowed keys, and returns `""` when no params remain. The canonical URL is assembled from `metadataBase + pathname + query` and the hash fragment is cleared.

## Query Parameter Allowlist

- **Opt-in only**: only keys listed in `includeParams` appear in canonical URLs.
- **Example (UTM ignored)**: `searchParams: { page: "2", utm_source: "google" }` + `includeParams: ["page"]` → canonical `...?page=2`.

## Multi-Tenant Behavior

- Hostname-driven: each dealer passes its own host so canonical links stay tenant-specific.
- Protocol handling: if `hostname` already includes `http://` or `https://`, it is preserved; otherwise `https://` is prefixed to avoid mixed-protocol issues.

## Examples

### SRP Canonical (with query params)

```ts
const metadata = buildTenantMetadata({
  hostname: "dealer.example.com",
  pathname: "/inventory",
  searchParams: {
    condition: "used",
    body: ["suv", "truck"],
    page: "2",
    utm_source: "google", // ignored (not in includeParams)
  },
  includeParams: ["condition", "body", "page"],
});
// metadata.alternates.canonical → https://dealer.example.com/inventory/?body=suv&body=truck&condition=used&page=2
```

### SRP (Search Results Page) with path-based filters

On SRP we use path-based filters for make/model and query params for the rest of filters:

- URL: `/new-vehicles/chevrolet/?make=chevrolet&year=2022`
- Path segment (`pathname`): `/new-vehicles/chevrolet/`
- Query (`searchParams`): `{ make: "chevrolet", year: "2022" }`

```ts
export async function generateSRPMetadata(
  params: Promise<{ slug?: string[] }>,
  searchParams: Promise<Record<string, string | string[] | undefined>>
): Promise<Metadata> {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const fullSlug = ["new-vehicles", ...(resolvedParams.slug || [])];
  const canonicalPath = `/${fullSlug.filter(Boolean).join("/")}/`;
  const { hostname } = await getTenantContext();

  return {
    title: "New Vehicles | Inventory",
    ...buildTenantMetadata({
      hostname,
      pathname: canonicalPath,
      searchParams: resolvedSearchParams,
    }),
  };
}
```

### VDP Canonical

```ts
const metadata = buildTenantMetadata({
  hostname: "https://dealer.example.com",
  pathname: "/vehicle/abc123",
});
// → https://dealer.example.com/vehicle/abc123/
```

### Static Page Canonical

```ts
const metadata = buildTenantMetadata({
  hostname: "dealer.example.com",
  pathname: "contact-us", // leading slash added, trailing slash enforced
});
// → https://dealer.example.com/contact-us/
```

### Using `URLSearchParams`

```ts
const params = new URLSearchParams({ q: "hybrid suv", sort: "price" });
const metadata = buildTenantMetadata({
  hostname: "dealer.example.com",
  pathname: "/search",
  searchParams: params,
  includeParams: ["q", "sort"],
});
// → https://dealer.example.com/search/?q=hybrid+suv&sort=price
```

### Using Plain Object `searchParams`

```ts
const metadata = buildTenantMetadata({
  hostname: "dealer.example.com",
  pathname: "/inventory",
  searchParams: { body: "sedan", page: "3" },
  includeParams: ["body", "page"],
});
// → https://dealer.example.com/inventory/?body=sedan&page=3
```

## Next.js App Router Notes

- Use inside `generateMetadata()` to return both `metadataBase` and `alternates.canonical` together with titles/descriptions.
- Ideal for SRP/VDP/static routes where the tenant host comes from server context.

```ts
// app/inventory/page.tsx
import type { Metadata } from "next";
import { getTenantContext } from "@dealertower/lib/tenant/server-context";
import { buildTenantMetadata } from "@dealertower/lib/seo/metadata";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { page?: string; body?: string };
}): Promise<Metadata> {
  const { hostname } = await getTenantContext();

  return {
    title: "Search Results",
    description: "Browse inventory across trims and body styles.",
    ...buildTenantMetadata({
      hostname,
      pathname: "/inventory",
      searchParams,
    }),
  };
}
```

The function works for any App Router page where you can read `hostname` (from tenant context, headers, or props) and optionally pass query params for canonical normalization.
