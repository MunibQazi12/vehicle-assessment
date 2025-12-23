import { describe, it, expect } from "vitest";
import {
  __test__normalizePathname as normalizePathname,
  __test__buildQueryString as buildQueryString,
  buildTenantMetadata,
} from "../metadata";

describe("normalizePathname", () => {
  it("returns '/' for empty string", () => {
    expect(normalizePathname("")).toBe("/");
  });

  it("returns '/' for root path '/'", () => {
    expect(normalizePathname("/")).toBe("/");
  });

  it("adds leading slash when missing and appends trailing slash", () => {
    expect(normalizePathname("contact-us")).toBe("/contact-us/");
  });

  it("keeps leading slash and appends trailing slash", () => {
    expect(normalizePathname("/contact-us")).toBe("/contact-us/");
  });

  it("ensures single trailing slash for path with extra slashes", () => {
    expect(normalizePathname("/contact-us//")).toBe("/contact-us/");
  });

  it("normalizes multi-segment path", () => {
    expect(normalizePathname("/foo/bar")).toBe("/foo/bar/");
  });

  it("normalizes multi-segment path with duplicated slashes", () => {
    expect(normalizePathname("/foo//bar///")).toBe("/foo/bar/");
  });
});

describe("buildQueryString", () => {
  it("returns empty string when searchParams is undefined", () => {
    expect(buildQueryString(undefined, ["a"])).toBe("");
  });

  it("returns empty string when includeParams is undefined", () => {
    const params = new URLSearchParams({ a: "1" });
    expect(buildQueryString(params, undefined)).toBe("");
  });

  it("builds query string from URLSearchParams using allowlist", () => {
    const params = new URLSearchParams({
      a: "1",
      b: "2",
      utm_source: "google",
    });

    const result = buildQueryString(params, ["a", "b"]);

    expect(result).toBe("?a=1&b=2");
  });

  it("handles plain object with string values", () => {
    const searchParams = {
      a: "1",
      b: "2",
    };

    const result = buildQueryString(searchParams, ["a", "b"]);

    // keys: sorted as a, b
    expect(result).toBe("?a=1&b=2");
  });

  it("handles plain object with array values and sorts by key and value", () => {
    const searchParams = {
      b: "2",
      a: ["1", "3"],
    };

    const result = buildQueryString(searchParams, ["a", "b"]);

    // entries: [ ['b','2'], ['a','1'], ['a','3'] ]
    // after sort: a=1, a=3, b=2
    expect(result).toBe("?a=1&a=3&b=2");
  });

  it("skips undefined values and non-allowed keys for plain object", () => {
    const searchParams = {
      a: "1",
      b: undefined,
      c: "3",
      utm_source: "google",
    };

    const result = buildQueryString(searchParams, ["a", "c"]);

    expect(result).toBe("?a=1&c=3");
  });

  it("encodes special characters correctly", () => {
    const searchParams = {
      q: "a b", // space → "+"
      tag: "c&d", // & → "%26"
    };

    const result = buildQueryString(searchParams, ["q", "tag"]);

    // keys: q, tag → 'q' < 'tag'
    expect(result).toBe("?q=a+b&tag=c%26d");
  });
});

describe("buildTenantMetadata", () => {
  it("builds metadataBase from bare hostname and normalizes root path", () => {
    const result = buildTenantMetadata({
      hostname: "example.com",
      pathname: "/",
    });

    expect(result.metadataBase!.toString()).toBe("https://example.com/");
    expect(result.alternates?.canonical).toBe("https://example.com/");
  });

  it("normalizes pathname and builds canonical URL with trailing slash", () => {
    const result = buildTenantMetadata({
      hostname: "example.com",
      pathname: "contact-us",
    });

    expect(result.metadataBase!.toString()).toBe("https://example.com/");
    expect(result.alternates?.canonical).toBe(
      "https://example.com/contact-us/"
    );
  });

  it("preserves protocol when hostname already includes https", () => {
    const result = buildTenantMetadata({
      hostname: "https://dealer.example.com",
      pathname: "/contact-us/",
    });

    expect(result.metadataBase!.toString()).toBe("https://dealer.example.com/");
    expect(result.alternates?.canonical).toBe(
      "https://dealer.example.com/contact-us/"
    );
  });

  it("includes query params from plain object and excludes default tracking params", () => {
    const result = buildTenantMetadata({
      hostname: "example.com",
      pathname: "/inventory",
      searchParams: {
        page: "2",
        utm_source: "google",
      },
      includeParams: ["page"],
    });

    expect(result.alternates?.canonical).toBe(
      "https://example.com/inventory/?page=2"
    );
  });

  it("includes query params from URLSearchParams", () => {
    const params = new URLSearchParams({
      a: "1",
      b: "2",
    });

    const result = buildTenantMetadata({
      hostname: "example.com",
      pathname: "/search",
      searchParams: params,
      includeParams: ["a", "b"],
    });

    expect(result.alternates?.canonical).toBe(
      "https://example.com/search/?a=1&b=2"
    );
  });

  it("does not include any query params when includeParams is omitted", () => {
    const result = buildTenantMetadata({
      hostname: "example.com",
      pathname: "/inventory",
      searchParams: {
        page: "3",
        utm_source: "google",
      },
    });

    expect(result.alternates?.canonical).toBe(
      "https://example.com/inventory/"
    );
  });

  it("strips hash fragment from canonical URL", () => {
    const result = buildTenantMetadata({
      hostname: "example.com",
      pathname: "/contact-us/#section",
    });

    // hash-fragment deleted
    expect(result.alternates?.canonical).toBe(
      "https://example.com/contact-us/"
    );
  });
});
