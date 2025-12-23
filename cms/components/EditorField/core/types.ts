/**
 * Core types for the extensible EditorField system
 * Defines toolbar features, presets, and editor configuration options
 */

import type { Editor } from '@tiptap/react'
import type { AnyExtension } from '@tiptap/core'

/**
 * Individual toolbar features that can be enabled/disabled
 */
export type ToolbarFeature =
	// Text formatting
	| 'bold'
	| 'italic'
	| 'underline'
	| 'strikethrough'
	| 'subscript'
	| 'superscript'
	| 'highlight'
	| 'code'
	// Colors
	| 'textColor'
	| 'backgroundColor'
	// Typography
	| 'fontSize'
	| 'formatDropdown' // h1-h6, paragraph
	// Alignment
	| 'responsiveAlignment' // Responsive alignment control with breakpoints
	// Spacing
	| 'spacing' // Block margin controls
	// Links & Media
	| 'link'
	| 'unlink'
	| 'image'
	| 'youtube'
	// Lists
	| 'bulletList'
	| 'orderedList'
	// Block elements
	| 'blockquote'
	| 'horizontalRule'
	| 'codeBlock'
	// History
	| 'undo'
	| 'redo'

/**
 * Feature groups for easier configuration
 */
export type ToolbarFeatureGroup =
	| 'textFormatting' // bold, italic, underline, strikethrough
	| 'textFormattingExtended' // + subscript, superscript, highlight, code
	| 'colors' // textColor, backgroundColor
	| 'typography' // fontSize, formatDropdown
	| 'alignment' // responsiveAlignment
	| 'spacing' // block margin controls
	| 'links' // link, unlink
	| 'media' // image, youtube
	| 'lists' // bulletList, orderedList
	| 'blocks' // blockquote, horizontalRule, codeBlock
	| 'history' // undo, redo

/**
 * Mapping of feature groups to their constituent features
 */
export const featureGroupMap: Record<ToolbarFeatureGroup, ToolbarFeature[]> = {
	textFormatting: ['bold', 'italic', 'underline', 'strikethrough'],
	textFormattingExtended: ['bold', 'italic', 'underline', 'strikethrough', 'subscript', 'superscript', 'highlight', 'code'],
	colors: ['textColor', 'backgroundColor'],
	typography: ['fontSize', 'formatDropdown'],
	alignment: ['responsiveAlignment'],
	spacing: ['spacing'],
	links: ['link', 'unlink'],
	media: ['image', 'youtube'],
	lists: ['bulletList', 'orderedList'],
	blocks: ['blockquote', 'horizontalRule', 'codeBlock'],
	history: ['undo', 'redo'],
}

/**
 * Predefined editor presets
 */
export type EditorPreset =
	| 'minimal' // Just text formatting basics
	| 'header' // For customizing headers/titles - colors, size, alignment, basic formatting
	| 'simple' // Standard text editing without media
	| 'standard' // Full-featured editor
	| 'custom' // Use custom feature configuration

/**
 * Editor configuration options
 */
export interface EditorConfig {
	/**
	 * Preset configuration to use
	 * If 'custom', must provide features array
	 */
	preset?: EditorPreset

	/**
	 * Custom features when preset is 'custom'
	 * Can be individual features or feature groups
	 */
	features?: (ToolbarFeature | ToolbarFeatureGroup)[]

	/**
	 * Placeholder text for the editor
	 * @default 'Start writing...'
	 */
	placeholder?: string

	/**
	 * Minimum height of the editor content area
	 * @default '200px'
	 */
	minHeight?: string

	/**
	 * Whether to show a single row toolbar (compact)
	 * @default false
	 */
	singleRowToolbar?: boolean

	/**
	 * Custom CSS classes for the editor container
	 */
	className?: string

	/**
	 * Whether to sync HTML content to a sibling field
	 * @default true
	 */
	syncHtmlContent?: boolean

	/**
	 * Debounce time in ms for content updates
	 * @default 1000
	 */
	debounceMs?: number

	/**
	 * Custom color palette for color picker
	 */
	colors?: Array<{ value: string; label?: string }>
}

/**
 * Props for the core editor component
 */
export interface CoreEditorProps extends EditorConfig {
	/**
	 * Current value (TipTap JSON)
	 */
	value: object | null | undefined

	/**
	 * Called when content changes
	 */
	onChange: (json: object, html: string) => void

	/**
	 * Field label
	 */
	label?: string

	/**
	 * Whether the field is required
	 */
	required?: boolean

	/**
	 * Description text below the editor
	 */
	description?: string
}

/**
 * Props for toolbar components
 */
export interface ToolbarProps {
	editor: Editor
	features: Set<ToolbarFeature>
	singleRow?: boolean
	/**
	 * Custom color palette for color picker
	 */
	colors?: Array<{ value: string; label?: string }>
}

/**
 * Factory function type for creating editor extensions
 */
export type ExtensionFactory = (config?: EditorConfig) => AnyExtension[]

/**
 * Helper function to expand feature groups into individual features
 */
export function expandFeatures(features: (ToolbarFeature | ToolbarFeatureGroup)[]): Set<ToolbarFeature> {
	const expandedFeatures = new Set<ToolbarFeature>()

	for (const feature of features) {
		if (feature in featureGroupMap) {
			// It's a group, expand it
			for (const groupFeature of featureGroupMap[feature as ToolbarFeatureGroup]) {
				expandedFeatures.add(groupFeature)
			}
		} else {
			// It's an individual feature
			expandedFeatures.add(feature as ToolbarFeature)
		}
	}

	return expandedFeatures
}

/**
 * Get features for a preset
 */
export function getPresetFeatures(preset: EditorPreset): Set<ToolbarFeature> {
	switch (preset) {
		case 'minimal':
			return expandFeatures(['textFormatting'])

		case 'header':
			// For header editing: basic formatting, colors, size, alignment, heading levels
			return expandFeatures([
				'bold',
				'italic',
				'underline',
				'textColor',
				'fontSize',
				'formatDropdown',
				'responsiveAlignment',
			])

		case 'simple':
			// Standard text editing without media
			return expandFeatures([
				'textFormatting',
				'colors',
				'typography',
				'alignment',
				'spacing',
				'links',
				'lists',
				'history',
			])

		case 'standard':
			// Full-featured editor
			return expandFeatures([
				'textFormattingExtended',
				'colors',
				'typography',
				'alignment',
				'spacing',
				'links',
				'media',
				'lists',
				'blocks',
				'history',
			])

		case 'custom':
		default:
			return new Set()
	}
}

/**
 * Resolve the final feature set from config
 */
export function resolveFeatures(config: EditorConfig): Set<ToolbarFeature> {
	const { preset = 'standard', features } = config

	if (preset === 'custom' && features) {
		return expandFeatures(features)
	}

	return getPresetFeatures(preset)
}
