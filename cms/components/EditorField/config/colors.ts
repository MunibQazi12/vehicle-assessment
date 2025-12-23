/**
 * Color configuration for the editor
 * Define custom color palettes for text color selection
 */

/**
 * Color option interface
 */
export interface ColorOption {
	/** Hex color value */
	value: string
	/** Optional label/name for the color */
	label?: string
}

/**
 * Default color palette
 * This is used by default if no custom colors are provided
 */
export const defaultColors: ColorOption[] = [
	{ value: '#1A56DB', label: 'Primary Blue' },
	{ value: '#0E9F6E', label: 'Green' },
	{ value: '#FACA15', label: 'Yellow' },
	{ value: '#F05252', label: 'Red' },
	{ value: '#FF8A4C', label: 'Orange' },
	{ value: '#0694A2', label: 'Cyan' },
	{ value: '#B4C6FC', label: 'Light Blue' },
	{ value: '#8DA2FB', label: 'Periwinkle' },
	{ value: '#5145CD', label: 'Purple' },
	{ value: '#771D1D', label: 'Dark Red' },
	{ value: '#FCD9BD', label: 'Peach' },
	{ value: '#99154B', label: 'Magenta' },
	{ value: '#7E3AF2', label: 'Violet' },
	{ value: '#CABFFD', label: 'Lavender' },
	{ value: '#D61F69', label: 'Pink' },
	{ value: '#F8B4D9', label: 'Light Pink' },
	{ value: '#F6C196', label: 'Tan' },
	{ value: '#A4CAFE', label: 'Sky Blue' },
	{ value: '#B43403', label: 'Brown' },
	{ value: '#FCE96A', label: 'Light Yellow' },
	{ value: '#1E429F', label: 'Dark Blue' },
	{ value: '#768FFD', label: 'Medium Blue' },
	{ value: '#BCF0DA', label: 'Mint' },
	{ value: '#EBF5FF', label: 'Ice Blue' },
	{ value: '#16BDCA', label: 'Turquoise' },
	{ value: '#E74694', label: 'Hot Pink' },
	{ value: '#83B0ED', label: 'Cornflower' },
	{ value: '#03543F', label: 'Dark Green' },
	{ value: '#111928', label: 'Black' },
	{ value: '#4B5563', label: 'Dark Gray' },
	{ value: '#6B7280', label: 'Gray' },
	{ value: '#D1D5DB', label: 'Light Gray' },
	{ value: '#F3F4F6', label: 'Very Light Gray' },
	{ value: '#F9FAFB', label: 'Off White' },
]

/**
 * Example: Custom brand colors
 * Uncomment and modify to use custom brand colors
 */
// export const brandColors: ColorOption[] = [
// 	{ value: '#72c6f5', label: 'Brand Blue' },
// 	{ value: '#151B49', label: 'Brand Navy' },
// 	{ value: '#FF6B35', label: 'Brand Orange' },
// 	{ value: '#004E89', label: 'Brand Dark Blue' },
// 	{ value: '#F7931E', label: 'Brand Accent' },
// ]

/**
 * Convert dealer colors from API to ColorOption format
 * Combines main_colors and saved_colors from dealer info
 * @param mainColors Main dealer colors (typically 3: primary, secondary, accent)
 * @param savedColors Additional saved/brand colors
 * @returns Formatted color options
 */
export function getDealerColors(
	mainColors?: string[] | null,
	savedColors?: string[] | null
): ColorOption[] {
	const colors: ColorOption[] = []

	// Add main colors with labels
	if (mainColors && mainColors.length > 0) {
		const labels = ['Primary', 'Secondary', 'Accent']
		mainColors.forEach((color, index) => {
			if (color) {
				colors.push({
					value: color,
					label: `Brand ${labels[index] || `Color ${index + 1}`}`,
				})
			}
		})
	}

	// Add saved colors
	if (savedColors && savedColors.length > 0) {
		savedColors.forEach((color, index) => {
			if (color && !colors.find(c => c.value === color)) {
				colors.push({
					value: color,
					label: `Saved Color ${index + 1}`,
				})
			}
		})
	}

	// If no dealer colors, return default colors
	return colors.length > 0 ? colors : defaultColors
}

/**
 * Get colors for editor
 * Override this function to provide custom colors based on context
 * @param context Optional context (e.g., dealer ID, theme)
 * @returns Array of color options
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getEditorColors(_context?: string): ColorOption[] {
	// Example: Return different colors based on context
	// if (context === 'dealer-abc') return brandColors

	return defaultColors
}
