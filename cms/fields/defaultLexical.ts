import type { TextFieldSingleValidation } from 'payload'
import {
	// Text formatting
	BoldFeature,
	ItalicFeature,
	UnderlineFeature,
	StrikethroughFeature,
	SubscriptFeature,
	SuperscriptFeature,
	InlineCodeFeature,
	// Headings & Paragraphs
	HeadingFeature,
	ParagraphFeature,
	// Alignment & Indentation
	AlignFeature,
	IndentFeature,
	// Lists
	OrderedListFeature,
	UnorderedListFeature,
	ChecklistFeature,
	// Block elements
	BlockquoteFeature,
	HorizontalRuleFeature,
	// Links & Media
	LinkFeature,
	UploadFeature,
	// Toolbars
	FixedToolbarFeature,
	InlineToolbarFeature,
	// Advanced features
	TextStateFeature,
	// Editor
	lexicalEditor,
	type LinkFields,
} from '@payloadcms/richtext-lexical'

export const defaultLexical = lexicalEditor({
	features: [
		// Text Formatting
		BoldFeature(),
		ItalicFeature(),
		UnderlineFeature(),
		StrikethroughFeature(),
		SubscriptFeature(),
		SuperscriptFeature(),
		InlineCodeFeature(),

		// Structure
		ParagraphFeature(),
		HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }),

		// Alignment & Indentation
		AlignFeature(), // Left, Center, Right, Justify
		IndentFeature(),

		// Lists
		OrderedListFeature(),
		UnorderedListFeature(),
		ChecklistFeature(),

		// Block Elements
		BlockquoteFeature(),
		HorizontalRuleFeature(),

		// Links & Media
		LinkFeature({
			enabledCollections: ['pages'],
			fields: ({ defaultFields }) => {
				const defaultFieldsWithoutUrl = defaultFields.filter((field) => {
					if ('name' in field && field.name === 'url') return false
					return true
				})

				return [
					...defaultFieldsWithoutUrl,
					{
						name: 'url',
						type: 'text',
						admin: {
							condition: (_data, siblingData) => siblingData?.linkType !== 'internal',
						},
						label: ({ t }) => t('fields:enterURL'),
						required: true,
						validate: ((value, options) => {
							if ((options?.siblingData as LinkFields)?.linkType === 'internal') {
								return true // no validation needed, as no url should exist for internal links
							}
							return value ? true : 'URL is required'
						}) as TextFieldSingleValidation,
					},
				]
			},
		}),
		UploadFeature({
			collections: {
				media: {
					fields: [
						{
							name: 'caption',
							type: 'text',
							label: 'Caption',
						},
					],
				},
			},
		}),

		// Toolbars
		FixedToolbarFeature(),
		InlineToolbarFeature(),

		// Text Colors & Highlights
		TextStateFeature({
			state: {
				color: {
					// Standard colors
					black: { label: 'Black', css: { color: '#000000' } },
					white: { label: 'White', css: { color: '#ffffff' } },
					gray: { label: 'Gray', css: { color: '#6b7280' } },
					red: { label: 'Red', css: { color: '#ef4444' } },
					orange: { label: 'Orange', css: { color: '#f97316' } },
					yellow: { label: 'Yellow', css: { color: '#eab308' } },
					green: { label: 'Green', css: { color: '#22c55e' } },
					blue: { label: 'Blue', css: { color: '#3b82f6' } },
					purple: { label: 'Purple', css: { color: '#a855f7' } },
					pink: { label: 'Pink', css: { color: '#ec4899' } },
				},
				highlight: {

				},
				font: {
					serif: {
						label: 'Serif',
						css: { 'font-family': 'Georgia, "Times New Roman", serif' },
					},
					mono: {
						label: 'Monospace',
						css: { 'font-family': 'ui-monospace, monospace' },
					},
				},
			},
		}),
	],
})
