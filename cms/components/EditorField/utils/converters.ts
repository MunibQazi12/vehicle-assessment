/**
 * Style value converters
 * Convert specific CSS values to Tailwind utility classes
 */

import { borderRadiusMap } from '../config/tailwind-maps'

/**
 * Convert spacing values to Tailwind arbitrary values
 * @param value - CSS spacing value (e.g., '16px', '1rem', 'auto')
 * @param prefix - Tailwind prefix (e.g., 'm', 'p', 'gap')
 * @returns Tailwind class string
 */
export const convertSpacing = (value: string, prefix: string): string => {
	const trimmed = value.trim()
	// Check for auto
	if (trimmed === 'auto') {
		return `${prefix}-auto`
	}
	// Check for 0
	if (trimmed === '0' || trimmed === '0px') {
		return `${prefix}-0`
	}
	// Convert to arbitrary value
	return `${prefix}-[${trimmed}]`
}

/**
 * Convert border radius to Tailwind
 * @param value - CSS border-radius value
 * @returns Tailwind class string
 */
export const convertBorderRadius = (value: string): string => {
	const trimmed = value.trim().toLowerCase()
	return borderRadiusMap[trimmed] || `rounded-[${trimmed}]`
}

/**
 * Convert box shadow to Tailwind
 * @param value - CSS box-shadow value
 * @returns Tailwind class string
 */
export const convertBoxShadow = (value: string): string => {
	const trimmed = value.trim().toLowerCase()
	if (trimmed === 'none') return 'shadow-none'
	// Check for common shadow patterns
	if (trimmed.includes('0 1px 2px') || trimmed.includes('0 1px 3px')) return 'shadow-sm'
	if (trimmed.includes('0 4px 6px') || trimmed.includes('0 1px 3px')) return 'shadow'
	if (trimmed.includes('0 10px 15px')) return 'shadow-md'
	if (trimmed.includes('0 20px 25px')) return 'shadow-lg'
	if (trimmed.includes('0 25px 50px')) return 'shadow-xl'
	// Use arbitrary value for custom shadows
	return `shadow-[${trimmed.replace(/\s+/g, '_')}]`
}
