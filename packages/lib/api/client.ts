/**
 * Base API client with caching support
 * Provides cached fetch functionality using Next.js cache
 */

import { CACHE_TTL } from "@dealertower/lib/cache/constants";
import {
	generateSRPRowsTags,
	generateSRPFiltersTags,
	generateLineupTags,
	generateDealerTags,
	generateDealerStaffTags,
	generateVDPSimilarsTags,
	generateSpecialsTags,
} from "@dealertower/lib/cache/tags";

const API_BASE_URL =
	process.env.DEALER_TOWER_API_URL ||
	"https://api.dealertower.com/public";

interface CachedFetchOptions {
	hostname: string; // Used for API URL construction only
	dealerIdentifier: string; // Used for API URL construction only (kept for backward compatibility)
	dataType: "vehicles" | "filters" | "forms" | "lineup" | "dealer" | "dealer-staff" | "vdp" | "vdp-similars" | "specials";
	method?: "GET" | "POST";
	cacheTags?: string[]; // For forms, should contain form:form_id tag; for VDP, should contain vdp slug
	domain?: string; // For logging (e.g., "SRP", "VDP", "Dealer") - defaults to dataType
	throwOn404?: boolean; // If true, throw error with status code on 404; if false, continue with standard error handling
	returnEmptyOnError?: boolean; // If true, return empty array/object on error instead of throwing
	timeout?: number; // Request timeout in milliseconds (default: 10000)
}

/**
 * Fetches data with Next.js caching enabled
 *
 * @param url - The full API URL
 * @param body - The request body
 * @param options - Cache options (hostname, dealerIdentifier, dataType)
 * @returns The API response data
 * @throws Error if the API request fails after retries
 */
export async function cachedFetch<T>(
	url: string,
	body: Record<string, unknown>,
	options: CachedFetchOptions & { revalidate?: number | false; retries?: number }
): Promise<T> {
	const {
		hostname,
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		dealerIdentifier: _dealerIdentifier,
		dataType,
		method = "POST",
		cacheTags = [],
		revalidate,
		retries = 3,
		domain,
		throwOn404 = false,
		returnEmptyOnError = false,
		timeout = 10000,
	} = options;

	// Note: hostname is still used for API URL construction in error messages
	// _dealerIdentifier is kept for backward compatibility but not used in new tag generation

	// Generate tags based on data type using specific tag generators
	let tags: string[];
	if (dataType === "vehicles") {
		tags = generateSRPRowsTags();
	} else if (dataType === "filters") {
		tags = generateSRPFiltersTags();
	} else if (dataType === "forms") {
		// Forms use cacheTags which should contain form:form_id
		tags = cacheTags.length > 0 ? cacheTags : [];
	} else if (dataType === "lineup") {
		tags = generateLineupTags();
	} else if (dataType === "dealer") {
		tags = generateDealerTags();
	} else if (dataType === "dealer-staff") {
		tags = generateDealerStaffTags();
	} else if (dataType === "vdp") {
		// VDP uses cacheTags which should contain vdp slug
		tags = cacheTags.length > 0 ? cacheTags : [];
	} else if (dataType === "vdp-similars") {
		tags = generateVDPSimilarsTags();
	} else if (dataType === "specials") {
		tags = generateSpecialsTags();
	} else {
		tags = [];
	}

	// Add any additional custom tags (except for forms and vdp, which use cacheTags as primary)
	if (cacheTags.length > 0 && dataType !== "forms" && dataType !== "vdp") {
		tags.push(...cacheTags);
	}

	const startTime = performance.now();
	const requestPath = url.replace(API_BASE_URL, '');
	const logDomain = domain || dataType.toUpperCase();

	let lastError: Error | undefined;

	// Retry logic for network failures and 5xx server errors
	for (let attempt = 0; attempt <= retries; attempt++) {
		try {
			if (attempt > 0) {
				console.log(`[API:${logDomain}] ${requestPath} - Retry ${attempt}/${retries}`);
				// Exponential backoff: 500ms, 1000ms, 2000ms
				await new Promise(resolve => setTimeout(resolve, 500 * Math.pow(2, attempt - 1)));
			} else {
				console.log(`[API:${logDomain}] ${requestPath} - ${hostname}`);
			}

			const response = await fetch(url, {
				method,
				headers: {
					"Content-Type": "application/json",
				},
				...(method === "POST" && { body: JSON.stringify(body) }),
				next: {
					// Use custom revalidate if provided, otherwise use CACHE_TTL
					// Set to false to cache indefinitely (rely on tag-based invalidation)
					revalidate: revalidate !== undefined ? revalidate : CACHE_TTL,
					tags,
				},
				// Add timeout and connection settings
				signal: AbortSignal.timeout(timeout),
			});

			const runtime = Math.round(performance.now() - startTime);

			if (!response.ok) {
				const statusCode = response.status;

				// Only log as error for server errors (5xx)
				if (statusCode >= 500) {
					console.error(`[API:${logDomain}] ${requestPath} - ${hostname}/${statusCode} (${runtime}ms)`);
				} else {
					// Log client errors (4xx) as info
					console.log(`[API:${logDomain}] ${requestPath} - ${hostname}/${statusCode} (${runtime}ms)`);
				}

				// Handle 404 specially if throwOn404 is enabled
				if (statusCode === 404 && throwOn404) {
					const error = new Error(`Not found: ${requestPath}`) as Error & { status: number };
					error.status = 404;
					throw error;
				}

				// Retry on 5xx server errors
				if (statusCode >= 500 && attempt < retries) {
					lastError = new Error(`Server error: ${statusCode} ${response.statusText}`);
					continue;
				}

				throw new Error(
					`API error: ${statusCode} ${response.statusText}`
				);
			}

			console.log(`[API:${logDomain}] ${requestPath} - ${hostname}/${response.status} (${runtime}ms)`);

			return response.json();

		} catch (error) {
			lastError = error instanceof Error ? error : new Error(String(error));

			// Rethrow 404 errors immediately if throwOn404 is enabled
			if (throwOn404 && (error as Error & { status?: number })?.status === 404) {
				throw error;
			}

			// Check if error should be retried
			const isServerError = lastError.message.includes('Server error:');
			const isNetworkError =
				lastError.message.includes('ECONNRESET') ||
				lastError.message.includes('ETIMEDOUT') ||
				lastError.message.includes('ENOTFOUND') ||
				lastError.message.includes('fetch failed') ||
				lastError.message.includes('timeout');

			// Don't retry on 4xx client errors
			if (lastError.message.startsWith('API error:') && !isServerError) {
				break;
			}

			// Don't retry if this was the last attempt
			if (attempt === retries) {
				break;
			}

			// Retry on 5xx errors or network errors
			if (!isServerError && !isNetworkError) {
				break;
			}
		}
	}

	const runtime = Math.round(performance.now() - startTime);
	console.error(`[API:${logDomain}] ${requestPath} - FAILED after ${retries + 1} attempts (${runtime}ms):`, lastError?.message);

	// Return empty value if returnEmptyOnError is enabled
	if (returnEmptyOnError) {
		return (Array.isArray(body) ? [] : {}) as T;
	}

	throw lastError || new Error('Unknown error');
}

/**
 * Gets the base API URL for a specific hostname
 *
 * @param hostname - The tenant hostname
 * @returns The configured API base URL with hostname
 */
export function getAPIBaseURL(hostname: string): string {
	return `${API_BASE_URL}/${hostname}`;
}
