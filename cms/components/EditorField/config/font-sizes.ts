/**
 * Font size configuration for the editor
 * Maps Tailwind size keys to CSS values and dropdown options
 */

// Font size value to Tailwind class mapping
export const fontSizeTailwindMap: Record<string, string> = {
	xs: 'text-xs',
	sm: 'text-sm',
	base: 'text-base',
	lg: 'text-lg',
	xl: 'text-xl',
	'2xl': 'text-2xl',
	'3xl': 'text-3xl',
	'4xl': 'text-4xl',
	'5xl': 'text-5xl',
	'6xl': 'text-6xl',
	'7xl': 'text-7xl',
	'8xl': 'text-8xl',
	'9xl': 'text-9xl',
}

// Font size options for dropdown (value is Tailwind size key)
export const fontSizeOptions = [
	{ label: 'Extra Small', value: 'xs', preview: '0.75rem' },
	{ label: 'Small', value: 'sm', preview: '0.875rem' },
	{ label: 'Normal', value: 'base', preview: '1rem' },
	{ label: 'Large', value: 'lg', preview: '1.125rem' },
	{ label: 'Extra Large', value: 'xl', preview: '1.25rem' },
	{ label: '2XL', value: '2xl', preview: '1.5rem' },
	{ label: '3XL', value: '3xl', preview: '1.875rem' },
	{ label: '4XL', value: '4xl', preview: '2.25rem' },
	{ label: '5XL', value: '5xl', preview: '3rem' },
	{ label: '6XL', value: '6xl', preview: '3.75rem' },
] as const

export type FontSizeKey = keyof typeof fontSizeTailwindMap
export type FontSizeOption = (typeof fontSizeOptions)[number]
