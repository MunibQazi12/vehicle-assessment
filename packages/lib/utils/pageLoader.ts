/**
 * Check if static pages should be loaded
 * Defaults to true if LOAD_STATIC_PAGES is not set
 */
export function shouldLoadStaticPages(): boolean {
	return process.env.LOAD_STATIC_PAGES !== 'false'
}
