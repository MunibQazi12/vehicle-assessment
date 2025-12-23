/**
 * Core EditorField system exports
 * Provides extensible editor components and configuration utilities
 */

// Core components
export { CoreEditor } from './CoreEditor'
export { ConfigurableToolbar } from './ConfigurableToolbar'

// Extension factory
export { createExtensions } from './extensions'

// Types and utilities
export {
	// Types
	type ToolbarFeature,
	type ToolbarFeatureGroup,
	type EditorPreset,
	type EditorConfig,
	type CoreEditorProps,
	type ToolbarProps,
	// Utilities
	featureGroupMap,
	expandFeatures,
	getPresetFeatures,
	resolveFeatures,
} from './types'
