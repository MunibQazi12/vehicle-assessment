/**
 * Configuration exports for EditorField
 */

// Color configuration
export { defaultColors, getEditorColors, getDealerColors } from './colors'
export type { ColorOption } from './colors'

// Font size configuration
export { fontSizeTailwindMap, fontSizeOptions } from './font-sizes'
export type { FontSizeKey, FontSizeOption } from './font-sizes'

// Tailwind CSS property mappings
export {
	fontSizePixelMap,
	fontSizeRemMap,
	fontWeightMap,
	displayMap,
	positionMap,
	overflowMap,
	cursorMap,
	borderStyleMap,
	whiteSpaceMap,
	wordBreakMap,
	textTransformMap,
	verticalAlignMap,
	flexWrapMap,
	flexDirectionMap,
	justifyContentMap,
	alignItemsMap,
	alignContentMap,
	objectFitMap,
	objectPositionMap,
	pointerEventsMap,
	userSelectMap,
	visibilityMap,
	namedColorsMap,
	borderRadiusMap,
} from './tailwind-maps'
