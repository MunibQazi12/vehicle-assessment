/**
 * Convert inline CSS styles to Tailwind utility classes
 * Main conversion function that handles all supported CSS properties
 */

import { normalizeColor } from './colors'
import { convertSpacing, convertBorderRadius, convertBoxShadow } from './converters'
import {
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
} from '../config/tailwind-maps'

/**
 * Convert inline styles to Tailwind classes
 * Replaces style="..." attributes with class="..." containing Tailwind utilities
 * @param html - HTML string with inline styles
 * @returns HTML string with Tailwind classes
 */
export const convertStylesToTailwind = (html: string): string => {
	return html.replace(/style="([^"]*)"/gi, (match, styleContent) => {
		const classes: string[] = []
		const remainingStyles: string[] = []

		// Split style content by semicolon
		const styles = styleContent
			.split(';')
			.map((s: string) => s.trim())
			.filter(Boolean)

		styles.forEach((style: string) => {
			const [property, ...valueParts] = style.split(':')
			if (!property || valueParts.length === 0) return

			const prop = property.trim().toLowerCase()
			const value = valueParts.join(':').trim()

			// Handle font-size
			if (prop === 'font-size') {
				const tailwindClass = fontSizePixelMap[value] || fontSizeRemMap[value]
				if (tailwindClass) {
					classes.push(tailwindClass)
					return
				}
				// Arbitrary value for custom sizes
				classes.push(`text-[${value}]`)
				return
			}

			// Handle color (text color)
			if (prop === 'color') {
				const color = normalizeColor(value)
				if (color === 'transparent') {
					classes.push('text-transparent')
				} else if (color === 'inherit') {
					classes.push('text-inherit')
				} else if (color === 'currentcolor' || color === 'currentColor') {
					classes.push('text-current')
				} else {
					classes.push(`text-[${color}]`)
				}
				return
			}

			// Handle background-color
			if (prop === 'background-color') {
				const color = normalizeColor(value)
				if (color === 'transparent') {
					classes.push('bg-transparent')
				} else if (color === 'inherit') {
					classes.push('bg-inherit')
				} else if (color === 'currentcolor' || color === 'currentColor') {
					classes.push('bg-current')
				} else {
					classes.push(`bg-[${color}]`)
				}
				return
			}

			// Handle text-align
			if (prop === 'text-align') {
				const align = value.toLowerCase()
				if (['left', 'center', 'right', 'justify', 'start', 'end'].includes(align)) {
					classes.push(`text-${align}`)
					return
				}
			}

			// Handle font-weight
			if (prop === 'font-weight') {
				const weightClass = fontWeightMap[value.toLowerCase()]
				if (weightClass) {
					classes.push(weightClass)
					return
				}
				classes.push(`font-[${value}]`)
				return
			}

			// Handle font-style
			if (prop === 'font-style') {
				const fontStyle = value.toLowerCase()
				if (fontStyle === 'italic') {
					classes.push('italic')
					return
				} else if (fontStyle === 'normal') {
					classes.push('not-italic')
					return
				}
			}

			// Handle text-decoration
			if (prop === 'text-decoration' || prop === 'text-decoration-line') {
				const deco = value.toLowerCase()
				if (deco.includes('underline')) {
					classes.push('underline')
					return
				} else if (deco.includes('line-through')) {
					classes.push('line-through')
					return
				} else if (deco.includes('overline')) {
					classes.push('overline')
					return
				} else if (deco === 'none') {
					classes.push('no-underline')
					return
				}
			}

			// Handle text-decoration-style
			if (prop === 'text-decoration-style') {
				const style = value.toLowerCase()
				const styleMap: Record<string, string> = {
					solid: 'decoration-solid',
					double: 'decoration-double',
					dotted: 'decoration-dotted',
					dashed: 'decoration-dashed',
					wavy: 'decoration-wavy',
				}
				if (styleMap[style]) {
					classes.push(styleMap[style])
					return
				}
			}

			// Handle text-decoration-color
			if (prop === 'text-decoration-color') {
				const color = normalizeColor(value)
				classes.push(`decoration-[${color}]`)
				return
			}

			// Handle text-decoration-thickness
			if (prop === 'text-decoration-thickness') {
				const thicknessMap: Record<string, string> = {
					auto: 'decoration-auto',
					'from-font': 'decoration-from-font',
					'0': 'decoration-0',
					'1px': 'decoration-1',
					'2px': 'decoration-2',
					'4px': 'decoration-4',
					'8px': 'decoration-8',
				}
				if (thicknessMap[value]) {
					classes.push(thicknessMap[value])
				} else {
					classes.push(`decoration-[${value}]`)
				}
				return
			}

			// Handle text-underline-offset
			if (prop === 'text-underline-offset') {
				const offsetMap: Record<string, string> = {
					auto: 'underline-offset-auto',
					'0': 'underline-offset-0',
					'1px': 'underline-offset-1',
					'2px': 'underline-offset-2',
					'4px': 'underline-offset-4',
					'8px': 'underline-offset-8',
				}
				if (offsetMap[value]) {
					classes.push(offsetMap[value])
				} else {
					classes.push(`underline-offset-[${value}]`)
				}
				return
			}

			// Handle letter-spacing
			if (prop === 'letter-spacing') {
				const spacingMap: Record<string, string> = {
					'-0.05em': 'tracking-tighter',
					'-0.025em': 'tracking-tight',
					'0': 'tracking-normal',
					'0em': 'tracking-normal',
					'0.025em': 'tracking-wide',
					'0.05em': 'tracking-wider',
					'0.1em': 'tracking-widest',
				}
				if (spacingMap[value]) {
					classes.push(spacingMap[value])
				} else {
					classes.push(`tracking-[${value}]`)
				}
				return
			}

			// Handle line-height
			if (prop === 'line-height') {
				const lineHeightMap: Record<string, string> = {
					'1': 'leading-none',
					'1.25': 'leading-tight',
					'1.375': 'leading-snug',
					'1.5': 'leading-normal',
					'1.625': 'leading-relaxed',
					'2': 'leading-loose',
					'0.75rem': 'leading-3',
					'1rem': 'leading-4',
					'1.25rem': 'leading-5',
					'1.5rem': 'leading-6',
					'1.75rem': 'leading-7',
					'2rem': 'leading-8',
					'2.25rem': 'leading-9',
					'2.5rem': 'leading-10',
				}
				if (lineHeightMap[value]) {
					classes.push(lineHeightMap[value])
				} else {
					classes.push(`leading-[${value}]`)
				}
				return
			}

			// Handle opacity
			if (prop === 'opacity') {
				const opacity = parseFloat(value)
				if (!isNaN(opacity)) {
					const percent = Math.round(opacity * 100)
					const standardOpacities = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100]
					if (standardOpacities.includes(percent)) {
						classes.push(`opacity-${percent}`)
					} else {
						classes.push(`opacity-[${opacity}]`)
					}
					return
				}
			}

			// Handle display
			if (prop === 'display') {
				const displayClass = displayMap[value.toLowerCase()]
				if (displayClass) {
					classes.push(displayClass)
					return
				}
			}

			// Handle position
			if (prop === 'position') {
				const positionClass = positionMap[value.toLowerCase()]
				if (positionClass) {
					classes.push(positionClass)
					return
				}
			}

			// Handle overflow
			if (prop === 'overflow') {
				const overflowClass = overflowMap[value.toLowerCase()]
				if (overflowClass) {
					classes.push(overflowClass)
					return
				}
			}

			// Handle overflow-x
			if (prop === 'overflow-x') {
				const overflowClass = overflowMap[value.toLowerCase()]
				if (overflowClass) {
					classes.push(overflowClass.replace('overflow-', 'overflow-x-'))
					return
				}
			}

			// Handle overflow-y
			if (prop === 'overflow-y') {
				const overflowClass = overflowMap[value.toLowerCase()]
				if (overflowClass) {
					classes.push(overflowClass.replace('overflow-', 'overflow-y-'))
					return
				}
			}

			// Handle cursor
			if (prop === 'cursor') {
				const cursorClass = cursorMap[value.toLowerCase()]
				if (cursorClass) {
					classes.push(cursorClass)
					return
				}
				classes.push(`cursor-[${value}]`)
				return
			}

			// Handle border-style
			if (prop === 'border-style') {
				const borderClass = borderStyleMap[value.toLowerCase()]
				if (borderClass) {
					classes.push(borderClass)
					return
				}
			}

			// Handle white-space
			if (prop === 'white-space') {
				const wsClass = whiteSpaceMap[value.toLowerCase()]
				if (wsClass) {
					classes.push(wsClass)
					return
				}
			}

			// Handle word-break
			if (prop === 'word-break') {
				const wbClass = wordBreakMap[value.toLowerCase()]
				if (wbClass) {
					classes.push(wbClass)
					return
				}
			}

			// Handle text-transform
			if (prop === 'text-transform') {
				const ttClass = textTransformMap[value.toLowerCase()]
				if (ttClass) {
					classes.push(ttClass)
					return
				}
			}

			// Handle vertical-align
			if (prop === 'vertical-align') {
				const vaClass = verticalAlignMap[value.toLowerCase()]
				if (vaClass) {
					classes.push(vaClass)
					return
				}
			}

			// Handle flex-wrap
			if (prop === 'flex-wrap') {
				const fwClass = flexWrapMap[value.toLowerCase()]
				if (fwClass) {
					classes.push(fwClass)
					return
				}
			}

			// Handle flex-direction
			if (prop === 'flex-direction') {
				const fdClass = flexDirectionMap[value.toLowerCase()]
				if (fdClass) {
					classes.push(fdClass)
					return
				}
			}

			// Handle justify-content
			if (prop === 'justify-content') {
				const jcClass = justifyContentMap[value.toLowerCase()]
				if (jcClass) {
					classes.push(jcClass)
					return
				}
			}

			// Handle align-items
			if (prop === 'align-items') {
				const aiClass = alignItemsMap[value.toLowerCase()]
				if (aiClass) {
					classes.push(aiClass)
					return
				}
			}

			// Handle align-content
			if (prop === 'align-content') {
				const acClass = alignContentMap[value.toLowerCase()]
				if (acClass) {
					classes.push(acClass)
					return
				}
			}

			// Handle object-fit
			if (prop === 'object-fit') {
				const ofClass = objectFitMap[value.toLowerCase()]
				if (ofClass) {
					classes.push(ofClass)
					return
				}
			}

			// Handle object-position
			if (prop === 'object-position') {
				const opClass = objectPositionMap[value.toLowerCase().replace(/\s+/g, '-')]
				if (opClass) {
					classes.push(opClass)
					return
				}
			}

			// Handle pointer-events
			if (prop === 'pointer-events') {
				const peClass = pointerEventsMap[value.toLowerCase()]
				if (peClass) {
					classes.push(peClass)
					return
				}
			}

			// Handle user-select
			if (prop === 'user-select') {
				const usClass = userSelectMap[value.toLowerCase()]
				if (usClass) {
					classes.push(usClass)
					return
				}
			}

			// Handle visibility
			if (prop === 'visibility') {
				const vClass = visibilityMap[value.toLowerCase()]
				if (vClass) {
					classes.push(vClass)
					return
				}
			}

			// Handle width
			if (prop === 'width') {
				if (value === '100%') {
					classes.push('w-full')
				} else if (value === 'auto') {
					classes.push('w-auto')
				} else if (value === 'fit-content') {
					classes.push('w-fit')
				} else if (value === 'min-content') {
					classes.push('w-min')
				} else if (value === 'max-content') {
					classes.push('w-max')
				} else if (value === '100vw') {
					classes.push('w-screen')
				} else {
					classes.push(`w-[${value}]`)
				}
				return
			}

			// Handle height
			if (prop === 'height') {
				if (value === '100%') {
					classes.push('h-full')
				} else if (value === 'auto') {
					classes.push('h-auto')
				} else if (value === 'fit-content') {
					classes.push('h-fit')
				} else if (value === 'min-content') {
					classes.push('h-min')
				} else if (value === 'max-content') {
					classes.push('h-max')
				} else if (value === '100vh') {
					classes.push('h-screen')
				} else {
					classes.push(`h-[${value}]`)
				}
				return
			}

			// Handle max-width
			if (prop === 'max-width') {
				if (value === '100%') {
					classes.push('max-w-full')
				} else if (value === 'none') {
					classes.push('max-w-none')
				} else if (value === 'fit-content') {
					classes.push('max-w-fit')
				} else if (value === 'min-content') {
					classes.push('max-w-min')
				} else if (value === 'max-content') {
					classes.push('max-w-max')
				} else {
					classes.push(`max-w-[${value}]`)
				}
				return
			}

			// Handle max-height
			if (prop === 'max-height') {
				if (value === '100%') {
					classes.push('max-h-full')
				} else if (value === 'none') {
					classes.push('max-h-none')
				} else if (value === 'fit-content') {
					classes.push('max-h-fit')
				} else if (value === 'min-content') {
					classes.push('max-h-min')
				} else if (value === 'max-content') {
					classes.push('max-h-max')
				} else if (value === '100vh') {
					classes.push('max-h-screen')
				} else {
					classes.push(`max-h-[${value}]`)
				}
				return
			}

			// Handle min-width
			if (prop === 'min-width') {
				if (value === '100%') {
					classes.push('min-w-full')
				} else if (value === '0') {
					classes.push('min-w-0')
				} else if (value === 'fit-content') {
					classes.push('min-w-fit')
				} else if (value === 'min-content') {
					classes.push('min-w-min')
				} else if (value === 'max-content') {
					classes.push('min-w-max')
				} else {
					classes.push(`min-w-[${value}]`)
				}
				return
			}

			// Handle min-height
			if (prop === 'min-height') {
				if (value === '100%') {
					classes.push('min-h-full')
				} else if (value === '0') {
					classes.push('min-h-0')
				} else if (value === 'fit-content') {
					classes.push('min-h-fit')
				} else if (value === 'min-content') {
					classes.push('min-h-min')
				} else if (value === 'max-content') {
					classes.push('min-h-max')
				} else if (value === '100vh') {
					classes.push('min-h-screen')
				} else {
					classes.push(`min-h-[${value}]`)
				}
				return
			}

			// Handle margin
			if (prop === 'margin') {
				classes.push(convertSpacing(value, 'm'))
				return
			}
			if (prop === 'margin-top') {
				classes.push(convertSpacing(value, 'mt'))
				return
			}
			if (prop === 'margin-bottom') {
				classes.push(convertSpacing(value, 'mb'))
				return
			}
			if (prop === 'margin-left') {
				classes.push(convertSpacing(value, 'ml'))
				return
			}
			if (prop === 'margin-right') {
				classes.push(convertSpacing(value, 'mr'))
				return
			}

			// Handle padding
			if (prop === 'padding') {
				classes.push(convertSpacing(value, 'p'))
				return
			}
			if (prop === 'padding-top') {
				classes.push(convertSpacing(value, 'pt'))
				return
			}
			if (prop === 'padding-bottom') {
				classes.push(convertSpacing(value, 'pb'))
				return
			}
			if (prop === 'padding-left') {
				classes.push(convertSpacing(value, 'pl'))
				return
			}
			if (prop === 'padding-right') {
				classes.push(convertSpacing(value, 'pr'))
				return
			}

			// Handle gap
			if (prop === 'gap') {
				classes.push(convertSpacing(value, 'gap'))
				return
			}
			if (prop === 'row-gap') {
				classes.push(convertSpacing(value, 'gap-y'))
				return
			}
			if (prop === 'column-gap') {
				classes.push(convertSpacing(value, 'gap-x'))
				return
			}

			// Handle border-radius
			if (prop === 'border-radius') {
				classes.push(convertBorderRadius(value))
				return
			}

			// Handle border-width
			if (prop === 'border-width') {
				const borderWidthMap: Record<string, string> = {
					'0': 'border-0',
					'0px': 'border-0',
					'1px': 'border',
					'2px': 'border-2',
					'4px': 'border-4',
					'8px': 'border-8',
				}
				if (borderWidthMap[value]) {
					classes.push(borderWidthMap[value])
				} else {
					classes.push(`border-[${value}]`)
				}
				return
			}

			// Handle border-color
			if (prop === 'border-color') {
				const color = normalizeColor(value)
				if (color === 'transparent') {
					classes.push('border-transparent')
				} else if (color === 'inherit') {
					classes.push('border-inherit')
				} else if (color === 'currentcolor' || color === 'currentColor') {
					classes.push('border-current')
				} else {
					classes.push(`border-[${color}]`)
				}
				return
			}

			// Handle box-shadow
			if (prop === 'box-shadow') {
				classes.push(convertBoxShadow(value))
				return
			}

			// Handle z-index
			if (prop === 'z-index') {
				const zIndexMap: Record<string, string> = {
					'0': 'z-0',
					'10': 'z-10',
					'20': 'z-20',
					'30': 'z-30',
					'40': 'z-40',
					'50': 'z-50',
					auto: 'z-auto',
				}
				if (zIndexMap[value]) {
					classes.push(zIndexMap[value])
				} else {
					classes.push(`z-[${value}]`)
				}
				return
			}

			// Handle top, right, bottom, left
			if (prop === 'top') {
				classes.push(convertSpacing(value, 'top'))
				return
			}
			if (prop === 'right') {
				classes.push(convertSpacing(value, 'right'))
				return
			}
			if (prop === 'bottom') {
				classes.push(convertSpacing(value, 'bottom'))
				return
			}
			if (prop === 'left') {
				classes.push(convertSpacing(value, 'left'))
				return
			}

			// Handle inset
			if (prop === 'inset') {
				classes.push(convertSpacing(value, 'inset'))
				return
			}

			// Handle flex
			if (prop === 'flex') {
				if (value === '1' || value === '1 1 0%') {
					classes.push('flex-1')
				} else if (value === 'auto' || value === '1 1 auto') {
					classes.push('flex-auto')
				} else if (value === 'initial' || value === '0 1 auto') {
					classes.push('flex-initial')
				} else if (value === 'none' || value === '0 0 auto') {
					classes.push('flex-none')
				} else {
					classes.push(`flex-[${value.replace(/\s+/g, '_')}]`)
				}
				return
			}

			// Handle flex-grow
			if (prop === 'flex-grow') {
				if (value === '0') {
					classes.push('grow-0')
				} else if (value === '1') {
					classes.push('grow')
				} else {
					classes.push(`grow-[${value}]`)
				}
				return
			}

			// Handle flex-shrink
			if (prop === 'flex-shrink') {
				if (value === '0') {
					classes.push('shrink-0')
				} else if (value === '1') {
					classes.push('shrink')
				} else {
					classes.push(`shrink-[${value}]`)
				}
				return
			}

			// Handle flex-basis
			if (prop === 'flex-basis') {
				if (value === 'auto') {
					classes.push('basis-auto')
				} else if (value === '100%') {
					classes.push('basis-full')
				} else {
					classes.push(`basis-[${value}]`)
				}
				return
			}

			// Handle order
			if (prop === 'order') {
				const orderMap: Record<string, string> = {
					'-9999': 'order-first',
					'9999': 'order-last',
					'0': 'order-none',
					'1': 'order-1',
					'2': 'order-2',
					'3': 'order-3',
					'4': 'order-4',
					'5': 'order-5',
					'6': 'order-6',
					'7': 'order-7',
					'8': 'order-8',
					'9': 'order-9',
					'10': 'order-10',
					'11': 'order-11',
					'12': 'order-12',
				}
				if (orderMap[value]) {
					classes.push(orderMap[value])
				} else {
					classes.push(`order-[${value}]`)
				}
				return
			}

			// Handle transform
			if (prop === 'transform') {
				if (value === 'none') {
					classes.push('transform-none')
				}
				// Complex transforms need to stay as style
				remainingStyles.push(style)
				return
			}

			// Handle transition
			if (prop === 'transition') {
				if (value === 'none') {
					classes.push('transition-none')
				} else if (value.includes('all')) {
					classes.push('transition-all')
				} else if (value.includes('color') || value.includes('background')) {
					classes.push('transition-colors')
				} else if (value.includes('opacity')) {
					classes.push('transition-opacity')
				} else if (value.includes('shadow')) {
					classes.push('transition-shadow')
				} else if (value.includes('transform')) {
					classes.push('transition-transform')
				} else {
					classes.push('transition')
				}
				return
			}

			// Handle aspect-ratio
			if (prop === 'aspect-ratio') {
				if (value === 'auto') {
					classes.push('aspect-auto')
				} else if (value === '1' || value === '1 / 1' || value === '1/1') {
					classes.push('aspect-square')
				} else if (value === '16 / 9' || value === '16/9') {
					classes.push('aspect-video')
				} else {
					classes.push(`aspect-[${value.replace(/\s+/g, '')}]`)
				}
				return
			}

			// Keep other styles as inline
			remainingStyles.push(style)
		})

		// Build result
		const parts: string[] = []

		if (remainingStyles.length > 0) {
			parts.push(`style="${remainingStyles.join('; ')};"`)
		}

		if (classes.length > 0) {
			parts.push(`class="${classes.join(' ')}"`)
		}

		return parts.length > 0 ? parts.join(' ') : ''
	})
}
