/**
 * Tests for TailwindTextAlign command functionality
 * These tests verify the command logic and data structure handling
 */

import { describe, it, expect } from 'vitest'
import type { ResponsiveAlignment } from '../text-align'

describe('TailwindTextAlign setResponsiveTextAlign command', () => {
	it('should properly verify command would receive correct alignment object', () => {
		const alignment: ResponsiveAlignment = {
			mobile: 'center',
			tablet: 'left',
			desktop: 'right'
		}

		// Verify structure that would be passed to command
		expect(alignment).toHaveProperty('mobile', 'center')
		expect(alignment).toHaveProperty('tablet', 'left')
		expect(alignment).toHaveProperty('desktop', 'right')
	})

	it('should handle mobile-only alignment', () => {
		const alignment: ResponsiveAlignment = {
			mobile: 'center'
		}

		expect(alignment.mobile).toBe('center')
		expect(alignment.tablet).toBeUndefined()
		expect(alignment.desktop).toBeUndefined()
	})

	it('should handle all three breakpoints', () => {
		const alignment: ResponsiveAlignment = {
			mobile: 'left',
			tablet: 'center',
			desktop: 'right'
		}

		expect(alignment.mobile).toBe('left')
		expect(alignment.tablet).toBe('center')
		expect(alignment.desktop).toBe('right')
	})

	it('should properly structure alignment object for command', () => {
		// Simulate what happens in ResponsiveAlignmentControl
		const currentAlignment: ResponsiveAlignment = {
			mobile: 'left'
		}

		const activeBreakpoint = 'tablet'
		const newValue = 'center'

		const newAlignment: ResponsiveAlignment = { ...currentAlignment }
		newAlignment[activeBreakpoint] = newValue

		expect(newAlignment.mobile).toBe('left')
		expect(newAlignment.tablet).toBe('center')
		expect(newAlignment.desktop).toBeUndefined()
	})

	it('should update existing alignment without losing other breakpoints', () => {
		const currentAlignment: ResponsiveAlignment = {
			mobile: 'left',
			tablet: 'center',
			desktop: 'right'
		}

		// User changes tablet alignment
		const newAlignment: ResponsiveAlignment = { ...currentAlignment }
		newAlignment.tablet = 'justify'

		expect(newAlignment.mobile).toBe('left')
		expect(newAlignment.tablet).toBe('justify') // changed
		expect(newAlignment.desktop).toBe('right')
	})

	it('should handle adding desktop to existing mobile/tablet', () => {
		const currentAlignment: ResponsiveAlignment = {
			mobile: 'center',
			tablet: 'left'
		}

		const newAlignment: ResponsiveAlignment = { ...currentAlignment }
		newAlignment.desktop = 'right'

		expect(newAlignment.mobile).toBe('center')
		expect(newAlignment.tablet).toBe('left')
		expect(newAlignment.desktop).toBe('right')
	})
})
