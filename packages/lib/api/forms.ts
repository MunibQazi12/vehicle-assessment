/**
 * Forms API functions
 * Handles form fetching with caching
 */

import { cachedFetch, getAPIBaseURL } from "./client";
import type { FormAPIResponse, FormsListAPIResponse } from "@dealertower/types";

/**
 * Fetches all available forms for a dealer
 *
 * @param hostname - The tenant hostname (e.g., www.nissanofportland.com)
 * @returns The forms list API response
 *
 * @example
 * ```ts
 * const response = await fetchFormsList('www.nissanofportland.com');
 * if (response.success && response.data) {
 *   response.data.forEach(form => {
 *     console.log(form.id, form.label);
 *   });
 * }
 * ```
 */
export async function fetchFormsList(
	hostname: string
): Promise<FormsListAPIResponse> {
	const url = `${getAPIBaseURL(hostname)}/v1/form`;

	return cachedFetch<FormsListAPIResponse>(url, {}, {
		hostname,
		dealerIdentifier: hostname.replace(/^www\./, ''),
		dataType: "forms",
		method: "GET",
		cacheTags: [`forms:list`],
		domain: "Forms",
	});
}

/**
 * Fetches a form by ID with caching
 *
 * @param hostname - The tenant hostname (e.g., www.nissanofportland.com)
 * @param formId - The UUID of the form to fetch
 * @returns The form API response with form data
 *
 * @example
 * ```ts
 * const response = await fetchForm(
 *   'www.nissanofportland.com',
 *   'e1e07452-c86b-4bb6-a7b6-755368834d00'
 * );
 * if (response.success && response.data) {
 *   console.log(response.data.title);
 * }
 * ```
 */
export async function fetchForm(
	hostname: string,
	formId: string
): Promise<FormAPIResponse> {
	const url = `${getAPIBaseURL(hostname)}/v1/form/${formId}`;

	return cachedFetch<FormAPIResponse>(url, {}, {
		hostname,
		dealerIdentifier: hostname.replace(/^www\./, ''),
		dataType: "forms",
		method: "GET",
		cacheTags: [`form:${formId}`], // Tag format: form:form_id
		domain: "Forms",
	});
}
