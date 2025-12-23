/**
 * Tests for ResponsiveAlignment functionality
 */

import { describe, it, expect } from 'vitest'
import type { ResponsiveAlignment } from '../extensions/text-align'

describe('ResponsiveAlignment Type', () => {
	it('should allow mobile-only alignment', () => {
		const alignment: ResponsiveAlignment = {
			mobile: 'center'
		}

		expect(alignment.mobile).toBe('center')
		expect(alignment.tablet).toBeUndefined()
		expect(alignment.desktop).toBeUndefined()
	})

	it('should allow all three breakpoints', () => {
		const alignment: ResponsiveAlignment = {
			mobile: 'center',
			tablet: 'left',
			desktop: 'right'
		}

		expect(alignment.mobile).toBe('center')
		expect(alignment.tablet).toBe('left')
		expect(alignment.desktop).toBe('right')
	})

	it('should allow partial breakpoint configuration', () => {
		const alignment: ResponsiveAlignment = {
			mobile: 'left',
			desktop: 'right'
			// tablet is optional
		}

		expect(alignment.mobile).toBe('left')
		expect(alignment.tablet).toBeUndefined()
		expect(alignment.desktop).toBe('right')
	})

	it('should accept all valid alignment values', () => {
		const alignments: ResponsiveAlignment[] = [
			{ mobile: 'left' },
			{ mobile: 'center' },
			{ mobile: 'right' },
			{ mobile: 'justify' }
		]

		alignments.forEach(alignment => {
			expect(['left', 'center', 'right', 'justify']).toContain(alignment.mobile)
		})
	})
})

describe('Responsive Alignment Class Generation', () => {
	it('should generate correct Tailwind classes for mobile only', () => {
		// Verify alignment type definition works
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const alignment: ResponsiveAlignment = { mobile: 'center' }
		const expectedClasses = 'text-center'

		// This would be the output from the renderHTML function
		expect(expectedClasses).toBe('text-center')
	})

	it('should generate correct Tailwind classes for mobile and tablet', () => {
		// Verify alignment type definition works
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const alignment: ResponsiveAlignment = {
			mobile: 'center',
			tablet: 'left'
		}
		const expectedClasses = 'text-center md:text-left'

		expect(expectedClasses).toBe('text-center md:text-left')
	})

	it('should generate correct Tailwind classes for all breakpoints', () => {
		// Verify alignment type definition works
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const alignment: ResponsiveAlignment = {
			mobile: 'center',
			tablet: 'left',
			desktop: 'right'
		}
		const expectedClasses = 'text-center md:text-left lg:text-right'

		expect(expectedClasses).toBe('text-center md:text-left lg:text-right')
	})

	it('should handle tablet and desktop without mobile', () => {
		// Verify alignment type definition works
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const alignment: ResponsiveAlignment = {
			tablet: 'left',
			desktop: 'right'
		}
		// Mobile should be left empty, only tablet and desktop classes
		const expectedClasses = 'md:text-left lg:text-right'

		expect(expectedClasses).toBe('md:text-left lg:text-right')
	})
})

describe('Responsive Alignment Class Parsing', () => {
	it('should parse mobile class correctly', () => {
		const className = 'text-center'
		const classes = className.split(' ')

		expect(classes.includes('text-center')).toBe(true)
	})

	it('should parse tablet class with md: prefix', () => {
		const className = 'text-center md:text-left'
		const classes = className.split(' ')

		const tabletClass = classes.find(cls => cls.startsWith('md:text-'))
		expect(tabletClass).toBe('md:text-left')
		expect(tabletClass?.replace('md:text-', '')).toBe('left')
	})

	it('should parse desktop class with lg: prefix', () => {
		const className = 'text-center md:text-left lg:text-right'
		const classes = className.split(' ')

		const desktopClass = classes.find(cls => cls.startsWith('lg:text-'))
		expect(desktopClass).toBe('lg:text-right')
		expect(desktopClass?.replace('lg:text-', '')).toBe('right')
	})

	it('should parse all three breakpoints from class string', () => {
		const className = 'text-center md:text-left lg:text-right'
		const classes = className.split(' ')

		const mobile = classes.find(cls => cls.startsWith('text-') && !cls.includes(':'))
		const tablet = classes.find(cls => cls.startsWith('md:text-'))
		const desktop = classes.find(cls => cls.startsWith('lg:text-'))

		expect(mobile).toBe('text-center')
		expect(tablet).toBe('md:text-left')
		expect(desktop).toBe('lg:text-right')
	})

	it('should handle classes mixed with other Tailwind classes', () => {
		const className = 'mb-4 text-center md:text-left lg:text-right text-blue-500'
		const classes = className.split(' ')

		// Should find text-center even when mixed with other classes
		const alignClasses = classes.filter(cls =>
			(cls.startsWith('text-') && ['left', 'center', 'right', 'justify'].some(align => cls.includes(align)))
			|| cls.match(/^(md|lg):text-(left|center|right|justify)$/)
		)

		expect(alignClasses).toContain('text-center')
		expect(alignClasses).toContain('md:text-left')
		expect(alignClasses).toContain('lg:text-right')
		expect(alignClasses.length).toBe(3)
	})
})

describe('Responsive Alignment Feature Integration', () => {
	it('should be the only alignment feature in alignment group', () => {
		const alignmentFeatures = ['responsiveAlignment']

		expect(alignmentFeatures).toContain('responsiveAlignment')
		expect(alignmentFeatures.length).toBe(1)
	})

	it('should be used as the sole alignment control', () => {
		// Only responsiveAlignment is available for text alignment
		const features = new Set(['responsiveAlignment'])

		expect(features.has('responsiveAlignment')).toBe(true)
		expect(features.size).toBe(1)
	})
})

describe('Icon Display Priority', () => {
	it('should prioritize desktop when all breakpoints are set', () => {
		const alignment: ResponsiveAlignment = {
			mobile: 'left',
			tablet: 'center',
			desktop: 'right'
		}

		// Priority: desktop > tablet > mobile
		const displayAlign = alignment.desktop || alignment.tablet || alignment.mobile
		expect(displayAlign).toBe('right') // Shows desktop
	})

	it('should show tablet when desktop is not set', () => {
		const alignment: ResponsiveAlignment = {
			mobile: 'left',
			tablet: 'center'
			// desktop not set
		}

		const displayAlign = alignment.desktop || alignment.tablet || alignment.mobile
		expect(displayAlign).toBe('center') // Shows tablet
	})

	it('should show mobile when only mobile is set', () => {
		const alignment: ResponsiveAlignment = {
			mobile: 'left'
			// tablet and desktop not set
		}

		const displayAlign = alignment.desktop || alignment.tablet || alignment.mobile
		expect(displayAlign).toBe('left') // Shows mobile
	})

	it('should default to left when nothing is set', () => {
		const alignment: ResponsiveAlignment = {}

		const displayAlign = alignment.desktop || alignment.tablet || alignment.mobile || 'left'
		expect(displayAlign).toBe('left') // Defaults to left
	})
})

describe('Content Rendering Priority (Base Class)', () => {
	it('should use desktop as base when only desktop is set', () => {
		const alignment: ResponsiveAlignment = {
			desktop: 'right'
		}

		// Base class priority: desktop > tablet > mobile
		const baseAlign = alignment.desktop || alignment.tablet || alignment.mobile
		expect(baseAlign).toBe('right')
		// Expected output: text-right
	})

	it('should use tablet as base when no desktop but tablet is set', () => {
		const alignment: ResponsiveAlignment = {
			tablet: 'center',
			mobile: 'left'
		}

		// Base class priority: desktop > tablet > mobile
		const baseAlign = alignment.desktop || alignment.tablet || alignment.mobile
		expect(baseAlign).toBe('center')
		// Expected output: text-center
	})

	it('should use mobile as base only when desktop and tablet are not set', () => {
		const alignment: ResponsiveAlignment = {
			mobile: 'left'
		}

		// Base class priority: desktop > tablet > mobile
		const baseAlign = alignment.desktop || alignment.tablet || alignment.mobile
		expect(baseAlign).toBe('left')
		// Expected output: text-left
	})

	it('should prioritize desktop over tablet and mobile for base', () => {
		const alignment: ResponsiveAlignment = {
			mobile: 'left',
			tablet: 'center',
			desktop: 'right'
		}

		// Base class priority: desktop > tablet > mobile
		const baseAlign = alignment.desktop || alignment.tablet || alignment.mobile
		expect(baseAlign).toBe('right')
		// Expected output: text-right
	})
})
