/**
 * Color conversion utilities
 * Handles RGB, RGBA, HSL, and named color formats
 */

import { namedColorsMap } from '../config/tailwind-maps'

/**
 * Convert RGB/RGBA color string to hex format
 * @param rgb - Color in rgb() or rgba() format
 * @returns Hex color string
 */
export const rgbToHex = (rgb: string): string => {
	// Handle rgb format
	const rgbMatch = rgb.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/)
	if (rgbMatch) {
		const r = parseInt(rgbMatch[1]).toString(16).padStart(2, '0')
		const g = parseInt(rgbMatch[2]).toString(16).padStart(2, '0')
		const b = parseInt(rgbMatch[3]).toString(16).padStart(2, '0')
		return `#${r}${g}${b}`
	}

	// Handle rgba format
	const rgbaMatch = rgb.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/)
	if (rgbaMatch) {
		const r = parseInt(rgbaMatch[1]).toString(16).padStart(2, '0')
		const g = parseInt(rgbaMatch[2]).toString(16).padStart(2, '0')
		const b = parseInt(rgbaMatch[3]).toString(16).padStart(2, '0')
		return `#${r}${g}${b}`
	}

	return rgb
}

/**
 * Convert HSL color string to hex format
 * @param hsl - Color in hsl() format
 * @returns Hex color string
 */
export const hslToHex = (hsl: string): string => {
	const match = hsl.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/)
	if (!match) return hsl

	const h = parseInt(match[1]) / 360
	const s = parseInt(match[2]) / 100
	const l = parseInt(match[3]) / 100

	let r, g, b
	if (s === 0) {
		r = g = b = l
	} else {
		const hue2rgb = (p: number, q: number, t: number) => {
			if (t < 0) t += 1
			if (t > 1) t -= 1
			if (t < 1 / 6) return p + (q - p) * 6 * t
			if (t < 1 / 2) return q
			if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
			return p
		}
		const q = l < 0.5 ? l * (1 + s) : l + s - l * s
		const p = 2 * l - q
		r = hue2rgb(p, q, h + 1 / 3)
		g = hue2rgb(p, q, h)
		b = hue2rgb(p, q, h - 1 / 3)
	}

	const toHex = (x: number) => {
		const hex = Math.round(x * 255).toString(16)
		return hex.length === 1 ? '0' + hex : hex
	}

	return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

/**
 * Normalize any color format to hex
 * Handles rgb(), rgba(), hsl(), hex, and named colors
 * @param color - Color in any supported format
 * @returns Normalized hex color string
 */
export const normalizeColor = (color: string): string => {
	const trimmed = color.trim().toLowerCase()

	if (trimmed.startsWith('rgb')) {
		return rgbToHex(trimmed)
	}
	if (trimmed.startsWith('hsl')) {
		return hslToHex(trimmed)
	}
	if (trimmed.startsWith('#')) {
		// Expand shorthand hex (#abc -> #aabbcc)
		if (trimmed.length === 4) {
			return `#${trimmed[1]}${trimmed[1]}${trimmed[2]}${trimmed[2]}${trimmed[3]}${trimmed[3]}`
		}
		return trimmed
	}

	return namedColorsMap[trimmed] || color
}
