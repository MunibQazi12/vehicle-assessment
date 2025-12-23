/**
 * Spacing TipTap Extension
 * Allows custom margins for block elements (paragraphs, headings)
 * Renders as Tailwind spacing classes (mt-*, mb-*, ml-*, mr-*)
 */

import { Extension } from '@tiptap/core'

export type SpacingValue = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '8' | '10' | '12' | '16' | '20' | '24'

export interface SpacingAttrs {
	marginTop?: SpacingValue
	marginBottom?: SpacingValue
	marginLeft?: SpacingValue
	marginRight?: SpacingValue
}

declare module '@tiptap/core' {
	interface Commands<ReturnType> {
		spacing: {
			/**
			 * Set spacing (margins) for the current block
			 */
			setSpacing: (spacing: SpacingAttrs) => ReturnType
			/**
			 * Reset spacing to defaults
			 */
			resetSpacing: () => ReturnType
		}
	}
}

// Valid Tailwind spacing values
const validSpacingValues = ['0', '1', '2', '3', '4', '5', '6', '8', '10', '12', '16', '20', '24']

// Parse spacing class from element
function parseSpacingClass(classList: string[], prefix: string): SpacingValue | undefined {
	for (const cls of classList) {
		if (cls.startsWith(`${prefix}-`)) {
			const value = cls.replace(`${prefix}-`, '')
			if (validSpacingValues.includes(value)) {
				return value as SpacingValue
			}
		}
	}
	return undefined
}

export const Spacing = Extension.create({
	name: 'spacing',

	addOptions() {
		return {
			types: ['heading', 'paragraph'],
		}
	},

	addGlobalAttributes() {
		return [
			{
				types: this.options.types,
				attributes: {
					spacing: {
						default: null,
						parseHTML: element => {
							const classList = element.className?.split(' ') || []
							const spacing: SpacingAttrs = {}

							const mt = parseSpacingClass(classList, 'mt')
							const mb = parseSpacingClass(classList, 'mb')
							const ml = parseSpacingClass(classList, 'ml')
							const mr = parseSpacingClass(classList, 'mr')

							if (mt) spacing.marginTop = mt
							if (mb) spacing.marginBottom = mb
							if (ml) spacing.marginLeft = ml
							if (mr) spacing.marginRight = mr

							// Return null if no spacing set
							if (Object.keys(spacing).length === 0) {
								return null
							}

							return spacing
						},
						renderHTML: attributes => {
							const spacing = attributes.spacing as SpacingAttrs | null
							if (!spacing) {
								return {}
							}

							const classes: string[] = []

							if (spacing.marginTop) {
								classes.push(`mt-${spacing.marginTop}`)
							}
							if (spacing.marginBottom) {
								classes.push(`mb-${spacing.marginBottom}`)
							}
							if (spacing.marginLeft) {
								classes.push(`ml-${spacing.marginLeft}`)
							}
							if (spacing.marginRight) {
								classes.push(`mr-${spacing.marginRight}`)
							}

							if (classes.length > 0) {
								return {
									class: classes.join(' '),
								}
							}

							return {}
						},
					},
				},
			},
		]
	},

	addCommands() {
		return {
			setSpacing:
				(spacing: SpacingAttrs) =>
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					({ state, tr, dispatch }: any) => {
						const { selection } = state
						const { from, to } = selection
						let updated = false

						// Update all nodes in selection
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						state.doc.nodesBetween(from, to, (node: any, pos: number) => {
							if (this.options.types.includes(node.type.name)) {
								// Start with existing spacing
								const existingSpacing = node.attrs.spacing || {}
								const newSpacing = { ...existingSpacing }

									// Apply updates from spacing parameter
									// Explicitly handle undefined values to delete specific properties
									(Object.keys(spacing) as Array<keyof SpacingAttrs>).forEach((key: keyof SpacingAttrs) => {
										if (spacing[key] === null || spacing[key] === undefined) {
											// Explicitly delete this property
											delete newSpacing[key]
										} else {
											// Set the new value
											newSpacing[key] = spacing[key]
										}
									})

								tr.setNodeMarkup(pos, undefined, {
									...node.attrs,
									spacing: Object.keys(newSpacing).length > 0 ? newSpacing : null,
								})
								updated = true
							}
						})

						// Dispatch the transaction if changes were made
						if (updated && dispatch) {
							dispatch(tr)
						}

						return updated
					},
			resetSpacing:
				() =>
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					({ state, tr, dispatch }: any) => {
						const { selection } = state
						const { from, to } = selection
						let updated = false

						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						state.doc.nodesBetween(from, to, (node: any, pos: number) => {
							if (this.options.types.includes(node.type.name)) {
								tr.setNodeMarkup(pos, undefined, {
									...node.attrs,
									spacing: null,
								})
								updated = true
							}
						})

						// Dispatch the transaction if changes were made
						if (updated && dispatch) {
							dispatch(tr)
						}

						return updated
					},
		}
	},
})
