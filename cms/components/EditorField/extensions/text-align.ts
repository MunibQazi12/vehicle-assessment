/**
 * TailwindTextAlign TipTap Extension
 * Extends the base TextAlign extension to render with Tailwind classes
 * Supports responsive alignment with mobile, tablet, and desktop breakpoints
 */

import TextAlign from '@tiptap/extension-text-align'

export type ResponsiveAlignment = {
	mobile?: 'left' | 'center' | 'right' | 'justify'
	tablet?: 'left' | 'center' | 'right' | 'justify'
	desktop?: 'left' | 'center' | 'right' | 'justify'
}

export const TailwindTextAlign = TextAlign.extend({
	addGlobalAttributes() {
		return [
			{
				types: this.options.types,
				attributes: {
					textAlign: {
						default: this.options.defaultAlignment,
						parseHTML: element => {
							const classList = element.className?.split(' ') || []
							const responsive: ResponsiveAlignment = {}

							// Parse mobile (base class - no prefix)
							if (classList.includes('text-left')) responsive.mobile = 'left'
							else if (classList.includes('text-center')) responsive.mobile = 'center'
							else if (classList.includes('text-right')) responsive.mobile = 'right'
							else if (classList.includes('text-justify')) responsive.mobile = 'justify'

							// Parse tablet (md: prefix)
							const tabletClass = classList.find(cls => cls.startsWith('md:text-'))
							if (tabletClass) {
								const align = tabletClass.replace('md:text-', '') as ResponsiveAlignment['tablet']
								responsive.tablet = align
							}

							// Parse desktop (lg: prefix)
							const desktopClass = classList.find(cls => cls.startsWith('lg:text-'))
							if (desktopClass) {
								const align = desktopClass.replace('lg:text-', '') as ResponsiveAlignment['desktop']
								responsive.desktop = align
							}

							// If responsive data exists, return it
							if (Object.keys(responsive).length > 0) {
								return responsive
							}

							return element.style.textAlign || this.options.defaultAlignment
						},
						renderHTML: attributes => {
							const align = attributes.textAlign

							// If no alignment set, return empty
							if (!align || align === this.options.defaultAlignment) {
								return {}
							}

							// Handle responsive alignment object
							if (typeof align === 'object') {
								const responsive = align as ResponsiveAlignment
								const classes: string[] = []

								// Tailwind is mobile-first, so:
								// - Base class = mobile (no prefix)
								// - md: = tablet and up
								// - lg: = desktop and up

								// Mobile (base class) - use mobile value, fallback to tablet, then desktop
								const mobileAlign = responsive.mobile || responsive.tablet || responsive.desktop
								if (mobileAlign) {
									classes.push(`text-${mobileAlign}`)
								}

								// Tablet (md breakpoint) - only add if different from mobile
								const tabletAlign = responsive.tablet || responsive.desktop
								if (tabletAlign && tabletAlign !== mobileAlign) {
									classes.push(`md:text-${tabletAlign}`)
								}

								// Desktop (lg breakpoint) - only add if different from tablet
								if (responsive.desktop && responsive.desktop !== tabletAlign) {
									classes.push(`lg:text-${responsive.desktop}`)
								}

								if (classes.length > 0) {
									return {
										class: classes.join(' '),
									}
								}

								return {}
							}

							// Legacy: handle simple string alignment
							return {
								class: `text-${align}`,
							}
						},
					},
				},
			},
		]
	},

	addCommands() {
		return {
			...this.parent?.(),
			setResponsiveTextAlign:
				(alignment: ResponsiveAlignment) =>
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					({ state, tr, dispatch }: any) => {
						const { selection } = state
						const { from } = selection
						const $from = selection.$from

						// Find the node that supports textAlign
						let targetNode = null
						let targetPos = -1

						// First try the node at cursor position
						const nodeAtCursor = state.doc.nodeAt(from)

						if (nodeAtCursor && this.options.types.includes(nodeAtCursor.type.name)) {
							targetNode = nodeAtCursor
							targetPos = $from.before($from.depth)
						} else {
							// Search up the tree for a node that supports alignment
							for (let depth = $from.depth; depth > 0; depth--) {
								const parentNode = $from.node(depth)
								if (this.options.types.includes(parentNode.type.name)) {
									targetNode = parentNode
									targetPos = $from.before(depth)
									break
								}
							}
						}

						// If no valid node found, return false
						if (!targetNode || targetPos < 0) {
							return false
						}

						// Update the node's textAlign attribute
						if (dispatch) {
							// Create new attributes with updated alignment
							const newAttrs = {
								...targetNode.attrs,
								textAlign: alignment,
							}

							// Use setNodeMarkup to update the node type and attributes
							// This will trigger renderHTML to regenerate the classes
							tr.setNodeMarkup(targetPos, null, newAttrs)
						}

						return true
					},
		}
	},
})
