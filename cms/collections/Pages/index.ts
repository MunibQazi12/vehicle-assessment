import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { CallToAction } from '../../blocks/CallToAction/config'
import { MediaBlock } from '../../blocks/MediaBlock/config'
import { StatsBarAlpha } from '../../blocks/StatsBarAlpha/config'
import { WYSIWYGBlock as TextBlock } from '../../blocks/WYSIWYGBlock/config'
import { ColumnsBlock } from '../../blocks/Columns/config'
import { HTMLBlock } from '../../blocks/HTMLBlock/config'
import { Spacer } from '../../blocks/Spacer/config'
import { ManufacturerLogoGrid } from '../../blocks/ManufacturerLogoGrid/config'
import { RibbonBanner } from '../../blocks/RibbonBanner/config'
import { ContentSection } from '../../blocks/ContentSection/config'
import { ReviewsSection } from '../../blocks/ReviewsSection/config'
import { ContainerSection } from '../../blocks/ContainerSection/config'
import { FormBlock } from '../../blocks/FormBlock/config'

// Shared blocks array for reuse in layout and nested columns
const layoutBlocks = [CallToAction, MediaBlock, StatsBarAlpha, TextBlock, ColumnsBlock, HTMLBlock, Spacer, ManufacturerLogoGrid, RibbonBanner, ContentSection, ReviewsSection, ContainerSection, FormBlock]

// Configure nested blocks for ColumnsBlock
if (ColumnsBlock.fields) {
	const columnsField = ColumnsBlock.fields.find((f) => 'name' in f && f.name === 'columns' && 'type' in f && f.type === 'array')
	if (columnsField && 'type' in columnsField && columnsField.type === 'array' && 'fields' in columnsField && columnsField.fields) {
		const blocksField = columnsField.fields.find((f) => 'name' in f && f.name === 'blocks' && 'type' in f && f.type === 'blocks')
		if (blocksField && 'type' in blocksField && blocksField.type === 'blocks' && 'blocks' in blocksField) {
			// Allow all blocks except ColumnsBlock and ContainerSection to prevent deep/circular nesting
			blocksField.blocks = [CallToAction, MediaBlock, StatsBarAlpha, TextBlock, HTMLBlock, Spacer, ManufacturerLogoGrid, RibbonBanner, ContentSection, ReviewsSection, FormBlock]
		}
	}
}

// Configure nested blocks for ContainerSection
if (ContainerSection.fields) {
	// ContainerSection uses tabs, so we need to find the tabs field first
	const tabsField = ContainerSection.fields.find((f) => 'type' in f && f.type === 'tabs')
	if (tabsField && 'type' in tabsField && tabsField.type === 'tabs' && 'tabs' in tabsField && tabsField.tabs) {
		const contentTab = tabsField.tabs.find((tab) => 'fields' in tab && tab.label === 'Content')
		if (contentTab && 'fields' in contentTab && contentTab.fields) {
			const blocksField = contentTab.fields.find((f) => 'name' in f && f.name === 'blocks' && 'type' in f && f.type === 'blocks')
			if (blocksField && 'type' in blocksField && blocksField.type === 'blocks' && 'blocks' in blocksField) {
				// Allow all blocks except ContainerSection itself to prevent deep nesting
				blocksField.blocks = [CallToAction, MediaBlock, StatsBarAlpha, TextBlock, ColumnsBlock, HTMLBlock, Spacer, ManufacturerLogoGrid, RibbonBanner, ContentSection, ReviewsSection, FormBlock]
			}
		}
	}
}
import { hero } from '@dtcms/heros/config'
import { populatePublishedAt } from '../../hooks/populatePublishedAt'
import { generatePreviewPath } from '../../utilities/generatePreviewPath'
import { revalidateDelete, revalidatePage } from './hooks/revalidatePage'

import {
	MetaDescriptionField,
	MetaImageField,
	MetaTitleField,
	OverviewField,
	PreviewField,
} from '@payloadcms/plugin-seo/fields'

export const Pages: CollectionConfig<'pages'> = {
	slug: 'pages',
	access: {
		create: authenticated,
		delete: authenticated,
		read: authenticatedOrPublished,
		update: authenticated,
	},
	// This config controls what's populated by default when a page is referenced
	// https://payloadcms.com/docs/queries/select#defaultpopulate-collection-config-property
	// Type safe if the collection slug generic is passed to `CollectionConfig` - `CollectionConfig<'pages'>
	defaultPopulate: {
		title: true,
		slug: true,
	},
	admin: {
		defaultColumns: ['title', 'slug', 'updatedAt'],
		livePreview: {
			url: ({ data, req }) =>
				generatePreviewPath({
					slug: data?.slug,
					collection: 'pages',
					req,
				}),
		},
		preview: (data, { req }) =>
			generatePreviewPath({
				slug: data?.slug as string,
				collection: 'pages',
				req,
			}),
		useAsTitle: 'title',
	},
	fields: [
		{
			type: 'tabs',
			tabs: [
				{
					fields: [hero],
					label: 'Hero',
				},
				{
					fields: [
						{
							name: 'layout',
							type: 'blocks',
							blocks: layoutBlocks,
							required: true,
							admin: {
								initCollapsed: true,
							},
						},
					],
					label: 'Content',
				},
				{
					name: 'meta',
					label: 'SEO',
					fields: [
						OverviewField({
							titlePath: 'meta.title',
							descriptionPath: 'meta.description',
							imagePath: 'meta.image',
						}),
						MetaTitleField({
							hasGenerateFn: true,
						}),
						MetaImageField({
							relationTo: 'media',
						}),
						MetaDescriptionField({}),
						PreviewField({
							// if the `generateUrl` function is configured
							hasGenerateFn: true,

							// field paths to match the target field for data
							titlePath: 'meta.title',
							descriptionPath: 'meta.description',
						}),
					],
				},
				{
					label: 'Settings',
					fields: [
						{
							name: 'title',
							type: 'text',
							required: true,
						},
						{
							name: 'slug',
							type: 'text',
							required: true,
							index: true,
						},
						{
							name: 'publishedAt',
							type: 'date',
						},
						{
							name: 'parent',
							type: 'relationship',
							relationTo: 'pages',
							admin: {
								description:
									'Select a parent page to create a hierarchy. Breadcrumbs will be automatically generated.',
							},
						},
						{
							name: 'enableBreadcrumb',
							type: 'checkbox',
							label: 'Enable Breadcrumb',
							defaultValue: false,
						},
						{
							name: 'breadcrumbs',
							type: 'array',
							admin: {
								disabled: true,
								readOnly: true,
							},
							fields: [
								{
									name: 'doc',
									type: 'relationship',
									relationTo: 'pages',
								},
								{
									name: 'url',
									type: 'text',
								},
								{
									name: 'label',
									type: 'text',
								},
							],
						},
					],
				},
			],
		},
	],
	hooks: {
		afterChange: [revalidatePage],
		beforeChange: [populatePublishedAt],
		afterDelete: [revalidateDelete],
	},
	versions: {
		drafts: {
			autosave: {
				interval: 100, // We set this interval for optimal live preview
			},
			schedulePublish: true,
		},
		maxPerDoc: 50,
	},
}
