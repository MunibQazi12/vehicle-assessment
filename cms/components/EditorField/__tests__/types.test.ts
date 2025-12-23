/**
 * Tests for EditorField core types and utility functions
 */

import { describe, it, expect } from 'vitest'
import {
	expandFeatures,
	getPresetFeatures,
	resolveFeatures,
	featureGroupMap,
	type ToolbarFeature,
	type ToolbarFeatureGroup,
} from '../core/types'

describe('featureGroupMap', () => {
	it('should contain all expected feature groups', () => {
		const expectedGroups: ToolbarFeatureGroup[] = [
			'textFormatting',
			'textFormattingExtended',
			'colors',
			'typography',
			'alignment',
			'links',
			'media',
			'lists',
			'blocks',
			'history',
		]

		for (const group of expectedGroups) {
			expect(featureGroupMap).toHaveProperty(group)
			expect(Array.isArray(featureGroupMap[group])).toBe(true)
		}
	})

	it('should have correct features in textFormatting group', () => {
		expect(featureGroupMap.textFormatting).toEqual(['bold', 'italic', 'underline', 'strikethrough'])
	})

	it('should have correct features in alignment group', () => {
		expect(featureGroupMap.alignment).toEqual(['responsiveAlignment'])
	})
})

describe('expandFeatures', () => {
	it('should return empty set for empty array', () => {
		const result = expandFeatures([])
		expect(result.size).toBe(0)
	})

	it('should keep individual features as-is', () => {
		const features: ToolbarFeature[] = ['bold', 'italic']
		const result = expandFeatures(features)

		expect(result.has('bold')).toBe(true)
		expect(result.has('italic')).toBe(true)
		expect(result.size).toBe(2)
	})

	it('should expand feature groups into individual features', () => {
		const result = expandFeatures(['textFormatting'])

		expect(result.has('bold')).toBe(true)
		expect(result.has('italic')).toBe(true)
		expect(result.has('underline')).toBe(true)
		expect(result.has('strikethrough')).toBe(true)
		expect(result.size).toBe(4)
	})

	it('should handle mixed individual features and groups', () => {
		const result = expandFeatures(['bold', 'alignment', 'undo'])

		expect(result.has('bold')).toBe(true)
		expect(result.has('responsiveAlignment')).toBe(true)
		expect(result.has('undo')).toBe(true)
		expect(result.size).toBe(3)
	})

	it('should deduplicate overlapping features', () => {
		// textFormattingExtended includes all of textFormatting
		const result = expandFeatures(['textFormatting', 'bold', 'italic'])

		// Should not have duplicates
		expect(result.has('bold')).toBe(true)
		expect(result.has('italic')).toBe(true)
		expect(result.size).toBe(4) // Same as textFormatting
	})
})

describe('getPresetFeatures', () => {
	it('should return minimal features for minimal preset', () => {
		const result = getPresetFeatures('minimal')

		expect(result.has('bold')).toBe(true)
		expect(result.has('italic')).toBe(true)
		expect(result.has('underline')).toBe(true)
		expect(result.has('strikethrough')).toBe(true)
		// Should NOT have advanced features
		expect(result.has('image')).toBe(false)
		expect(result.has('youtube')).toBe(false)
		expect(result.has('textColor')).toBe(false)
	})

	it('should return header features for header preset', () => {
		const result = getPresetFeatures('header')

		// Should have basic formatting
		expect(result.has('bold')).toBe(true)
		expect(result.has('italic')).toBe(true)
		expect(result.has('underline')).toBe(true)
		// Should have colors
		expect(result.has('textColor')).toBe(true)
		// Should have sizing
		expect(result.has('fontSize')).toBe(true)
		// Should have responsive alignment
		expect(result.has('responsiveAlignment')).toBe(true)
		// Should NOT have media
		expect(result.has('image')).toBe(false)
		expect(result.has('youtube')).toBe(false)
		// Should NOT have lists
		expect(result.has('bulletList')).toBe(false)
	})

	it('should return simple features for simple preset', () => {
		const result = getPresetFeatures('simple')

		// Should have text formatting
		expect(result.has('bold')).toBe(true)
		expect(result.has('italic')).toBe(true)
		// Should have colors
		expect(result.has('textColor')).toBe(true)
		// Should have links
		expect(result.has('link')).toBe(true)
		// Should have lists
		expect(result.has('bulletList')).toBe(true)
		expect(result.has('orderedList')).toBe(true)
		// Should have history
		expect(result.has('undo')).toBe(true)
		expect(result.has('redo')).toBe(true)
		// Should NOT have media
		expect(result.has('image')).toBe(false)
		expect(result.has('youtube')).toBe(false)
	})

	it('should return standard features for standard preset', () => {
		const result = getPresetFeatures('standard')

		// Should have all text formatting
		expect(result.has('bold')).toBe(true)
		expect(result.has('italic')).toBe(true)
		expect(result.has('subscript')).toBe(true)
		expect(result.has('superscript')).toBe(true)
		expect(result.has('highlight')).toBe(true)
		expect(result.has('code')).toBe(true)
		// Should have colors
		expect(result.has('textColor')).toBe(true)
		expect(result.has('backgroundColor')).toBe(true)
		// Should have media
		expect(result.has('image')).toBe(true)
		expect(result.has('youtube')).toBe(true)
		// Should have blocks
		expect(result.has('blockquote')).toBe(true)
		expect(result.has('codeBlock')).toBe(true)
	})

	it('should return empty set for custom preset', () => {
		const result = getPresetFeatures('custom')
		expect(result.size).toBe(0)
	})
})

describe('resolveFeatures', () => {
	it('should return preset features when preset is specified', () => {
		const result = resolveFeatures({ preset: 'header' })

		expect(result.has('bold')).toBe(true)
		expect(result.has('textColor')).toBe(true)
		expect(result.has('fontSize')).toBe(true)
	})

	it('should default to standard preset when no preset specified', () => {
		const result = resolveFeatures({})

		// Standard preset features
		expect(result.has('image')).toBe(true)
		expect(result.has('youtube')).toBe(true)
	})

	it('should use custom features when preset is custom', () => {
		const result = resolveFeatures({
			preset: 'custom',
			features: ['bold', 'italic', 'textColor'],
		})

		expect(result.has('bold')).toBe(true)
		expect(result.has('italic')).toBe(true)
		expect(result.has('textColor')).toBe(true)
		expect(result.size).toBe(3)
	})

	it('should expand feature groups in custom features', () => {
		const result = resolveFeatures({
			preset: 'custom',
			features: ['alignment', 'history'],
		})

		expect(result.has('responsiveAlignment')).toBe(true)
		expect(result.has('undo')).toBe(true)
		expect(result.has('redo')).toBe(true)
		expect(result.size).toBe(3)
	})

	it('should ignore custom features when preset is not custom', () => {
		const result = resolveFeatures({
			preset: 'minimal',
			features: ['image', 'youtube'], // These should be ignored
		})

		// Should have minimal features only
		expect(result.has('bold')).toBe(true)
		expect(result.has('image')).toBe(false)
		expect(result.has('youtube')).toBe(false)
	})
})
