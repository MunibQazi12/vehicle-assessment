/**
 * Helper to extract label string from Payload's StaticLabel type
 * @param label - Payload field label (can be string, record, false, or undefined)
 * @param fallback - Fallback string if label is not available
 * @returns Label string
 */
export const getLabel = (
	label: string | Record<string, string> | undefined | false,
	fallback: string,
): string => {
	if (!label) return fallback
	if (typeof label === 'string') return label
	return Object.values(label)[0] || fallback
}
