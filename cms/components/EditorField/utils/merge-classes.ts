/**
 * Merge duplicate class attributes in HTML
 * Handles cases where an element ends up with multiple class attributes
 */

/**
 * Merge duplicate class attributes into a single class attribute
 * @param html - HTML string that may have elements with duplicate class attributes
 * @returns HTML with merged class attributes
 */
export const mergeClasses = (html: string): string => {
	// Find elements with both style and class attributes and merge them
	return html.replace(
		/<(\w+)([^>]*?)class="([^"]*)"([^>]*?)class="([^"]*)"([^>]*)>/gi,
		(match, tag, before, class1, middle, class2, after) => {
			const mergedClasses = `${class1} ${class2}`.trim()
			// Clean up any extra whitespace in the attributes
			const cleanBefore = before.trim()
			const cleanMiddle = middle.trim()
			const cleanAfter = after.trim()
			const attrs = [cleanBefore, `class="${mergedClasses}"`, cleanMiddle, cleanAfter]
				.filter(Boolean)
				.join(' ')
			return `<${tag}${attrs ? ' ' + attrs : ''}>`
		},
	)
}
