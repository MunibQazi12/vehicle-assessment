/**
 * Tests for path utilities
 */

import { describe, it, expect } from 'vitest'
import { getHtmlFieldPath } from '../paths'

describe('getHtmlFieldPath', () => {
	it('should convert simple field name to Html suffix', () => {
		expect(getHtmlFieldPath('title')).toBe('titleHtml')
		expect(getHtmlFieldPath('subtitle')).toBe('subtitleHtml')
		expect(getHtmlFieldPath('heading')).toBe('headingHtml')
	})

	it('should handle legacy content field specially', () => {
		expect(getHtmlFieldPath('content')).toBe('htmlContent')
	})

	it('should handle nested paths', () => {
		expect(getHtmlFieldPath('blocks.0.title')).toBe('blocks.0.titleHtml')
		expect(getHtmlFieldPath('sections.2.subtitle')).toBe('sections.2.subtitleHtml')
		expect(getHtmlFieldPath('hero.content')).toBe('hero.htmlContent')
	})

	it('should handle deeply nested paths', () => {
		expect(getHtmlFieldPath('layout.blocks.0.content')).toBe('layout.blocks.0.htmlContent')
		expect(getHtmlFieldPath('page.sections.1.items.0.title')).toBe('page.sections.1.items.0.titleHtml')
	})

	it('should preserve numeric indices in paths', () => {
		expect(getHtmlFieldPath('items.5.name')).toBe('items.5.nameHtml')
		expect(getHtmlFieldPath('data.123.value')).toBe('data.123.valueHtml')
	})
})
