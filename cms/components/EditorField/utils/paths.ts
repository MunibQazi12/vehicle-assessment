/**
 * Path utilities for EditorField variants
 */

/**
 * Derive the HTML field path from the JSON field path
 * Handles patterns like:
 * - 'title' -> 'titleHtml'
 * - 'subtitle' -> 'subtitleHtml'
 * - 'content' -> 'htmlContent' (legacy)
 * - 'blocks.0.title' -> 'blocks.0.titleHtml'
 */
export function getHtmlFieldPath(path: string): string {
	// Split path to get the field name
	const parts = path.split('.')
	const fieldName = parts[parts.length - 1]

	// Special case for 'content' field (legacy pattern)
	if (fieldName === 'content') {
		parts[parts.length - 1] = 'htmlContent'
		return parts.join('.')
	}

	// For other fields, append 'Html' to the field name
	parts[parts.length - 1] = `${fieldName}Html`
	return parts.join('.')
}
