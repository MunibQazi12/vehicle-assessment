/**
 * Predefined footer themes
 * Each theme represents a different layout/structure
 */

export const FOOTER_THEMES = {
	alpha: {
		label: 'Alpha Footer',
		value: 'alpha',
	},
} as const

export type FooterTheme = keyof typeof FOOTER_THEMES

export const footerThemeOptions = Object.values(FOOTER_THEMES).map((theme) => ({
	label: theme.label,
	value: theme.value,
}))
