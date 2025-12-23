/**
 * Cache tag generation utilities
 * Generates cache tags for tag-based invalidation
 */

/**
 * Cache tag types for type safety
 */
export type CacheTagType = "hostname" | "dealer" | "srp-rows" | "srp-filters" | "vdp" | "vdp-similars" | "dealer-config" | "forms" | "form" | "lineup" | "dealer-staff";

/**
 * Get dealer ID from environment variable
 * @returns Dealer ID from NEXTJS_APP_DEALER_ID environment variable
 */
function getDealerId(): string {
	const dealerId = process.env.NEXTJS_APP_DEALER_ID;
	if (!dealerId) {
		console.warn('[Cache Tags] NEXTJS_APP_DEALER_ID not set, using fallback');
		return 'unknown-dealer';
	}
	return dealerId;
}

/**
 * Generates cache tags for SRP rows
 * @returns Tag in format: dealer_id:srp-rows
 */
export function generateSRPRowsTags(): string[] {
	const dealerId = getDealerId();
	return [`${dealerId}:srp-rows`];
}

/**
 * Generates cache tags for SRP filters
 * @returns Tag in format: dealer_id:srp-filters
 */
export function generateSRPFiltersTags(): string[] {
	const dealerId = getDealerId();
	return [`${dealerId}:srp-filters`];
}

/**
 * Generates cache tags for VDP details
 * @param vdpSlug - The VDP slug
 * @returns Tag in format: dealer_id:vdp:vdp_slug
 */
export function generateVDPTags(vdpSlug: string): string[] {
	const dealerId = getDealerId();
	return [`${dealerId}:vdp:${vdpSlug}`];
}

/**
 * Generates cache tags for VDP similars
 * @returns Tag in format: dealer_id:vdp-similars
 */
export function generateVDPSimilarsTags(): string[] {
	const dealerId = getDealerId();
	return [`${dealerId}:vdp-similars`];
}

/**
 * Generates cache tags for forms
 * @param formId - The form ID
 * @returns Tag in format: form:form_id
 */
export function generateFormTags(formId: string): string[] {
	return [`form:${formId}`];
}

/**
 * Generates cache tags for lineup
 * @returns Tag in format: dealer_id:lineup
 */
export function generateLineupTags(): string[] {
	const dealerId = getDealerId();
	return [`${dealerId}:lineup`];
}

/**
 * Generates cache tags for dealer information
 * @returns Tag in format: dealer_id:dealer
 */
export function generateDealerTags(): string[] {
	const dealerId = getDealerId();
	return [`${dealerId}:dealer`];
}

/**
 * Generates cache tags for dealer staff
 * @returns Tag in format: dealer_id:dealer-staff
 */
export function generateDealerStaffTags(): string[] {
	const dealerId = getDealerId();
	return [`${dealerId}:dealer-staff`];
}

/**
 * Generates cache tags for specials
 * @returns Tag in format: dealer_id:specials
 */
export function generateSpecialsTags(): string[] {
	const dealerId = getDealerId();
	return [`${dealerId}:specials`];
}

/**
 * Legacy function for backward compatibility - deprecated, use specific tag generators instead
 * @deprecated Use generateSRPRowsTags, generateSRPFiltersTags, etc. instead
 */
export function generateCacheTags(
	hostname: string,
	dealerIdentifier: string,
	dataType: "vehicles" | "filters" | "forms" | "lineup",
	additionalTags: string[] = []
): string[] {
	console.warn('[Cache Tags] generateCacheTags is deprecated. Use specific tag generators instead.');
	const dealerId = getDealerId();
	const baseTags: string[] = [];

	// Map old dataType to new tag format
	if (dataType === "vehicles") {
		baseTags.push(`${dealerId}:srp-rows`);
	} else if (dataType === "filters") {
		baseTags.push(`${dealerId}:srp-filters`);
	} else if (dataType === "forms") {
		baseTags.push(...additionalTags); // Forms use form:form_id format
	} else if (dataType === "lineup") {
		baseTags.push(`${dealerId}:lineup`);
	}

	// Add any additional custom tags
	if (additionalTags.length > 0 && dataType !== "forms") {
		baseTags.push(...additionalTags);
	}

	return baseTags;
}

/**
 * Generates all possible tags for invalidation by dealer ID
 *
 * @param dealerId - The dealer ID (optional, uses env var if not provided)
 * @returns Array of all possible tags for the dealer
 *
 * @example
 * ```ts
 * const tags = getInvalidationTags('494a1788-0619-4a53-99c1-1c9f9b2e8fcc');
 * // Returns tags for all dealer endpoints
 * ```
 */
export function getInvalidationTags(dealerId?: string): string[] {
	const id = dealerId || getDealerId();
	return [
		`${id}:srp-rows`,
		`${id}:srp-filters`,
		`${id}:vdp-similars`,
		`${id}:lineup`,
		`${id}:dealer`,
		`${id}:dealer-staff`,
		`${id}:specials`,
	];
}

/**
 * Generates invalidation tags from request body
 *
 * @param body - The webhook request body
 * @returns Array of tags to invalidate
 *
 * @example
 * ```ts
 * // Invalidate all dealer data
 * getInvalidationTagsFromBody({ dealer_id: '494a1788-...' });
 * 
 * // Invalidate specific form
 * getInvalidationTagsFromBody({ tags: ['form:form-uuid'] });
 * 
 * // Invalidate specific VDP
 * getInvalidationTagsFromBody({ tags: ['494a1788-...:vdp:slug'] });
 * ```
 */
export function getInvalidationTagsFromBody(body: {
	dealer_id?: string;
	tags?: string[];
}): string[] {
	const tagsToInvalidate: string[] = [];

	// Add dealer-based tags (invalidates all dealer data)
	if (body.dealer_id) {
		tagsToInvalidate.push(...getInvalidationTags(body.dealer_id));
	}

	// Add specific tags
	if (body.tags && Array.isArray(body.tags)) {
		tagsToInvalidate.push(...body.tags);
	}

	return tagsToInvalidate;
}

/**
 * Generate cache tag for dealer configuration
 * @deprecated Use generateDealerTags() instead
 *
 * @returns Cache tag for dealer config
 */
export function getwebsiteInfoCacheTag(): string {
	console.warn('[Cache Tags] getwebsiteInfoCacheTag is deprecated. Use generateDealerTags() instead.');
	const dealerId = getDealerId();
	return `${dealerId}:dealer`;
}
