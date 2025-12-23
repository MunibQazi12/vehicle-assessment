import type { GlobalConfig } from 'payload'

import { link } from '@dtcms/fields/link'
import { revalidateHeader } from './hooks/revalidateHeader'
import { headerThemeOptions } from './themes'
export const Header: GlobalConfig = {
	slug: 'header',
	access: {
		read: () => true,
	},
	fields: [
		{
			name: 'theme',
			type: 'select',
			required: true,
			defaultValue: 'alpha',
			options: headerThemeOptions,
			admin: {
				position: 'sidebar',
				description: 'Select the header layout/theme to use',
			},
		},
		{
			name: 'logo',
			type: 'upload',
			relationTo: 'media',
			admin: {
				position: 'sidebar',
				description: 'Custom logo for the header',
				condition: (data) => data?.theme === 'alpha',
			},
		},
		{
			name: 'navItems',
			type: 'array',
			label: 'Navigation Items',
			fields: [
				link({
					appearances: false,
				}),
				{
					name: 'subItems',
					type: 'array',
					label: 'Sub Menu Items',
					admin: {
						description: 'Optional nested menu items (dropdown)',
						initCollapsed: true,
						components: {
							RowLabel: '@dtcms/Header/RowLabel#RowLabel',
						},
					},
					fields: [
						link({
							appearances: false,
						}),
					],
					maxRows: 10,
				},
			],
			maxRows: 6,
			admin: {
				initCollapsed: true,
				components: {
					RowLabel: '@dtcms/Header/RowLabel#RowLabel',
				},
			},
		},
		{
			name: 'showSearchBox',
			type: 'checkbox',
			label: 'Show Search Box',
			defaultValue: true,
			admin: {
				position: 'sidebar',
				description: 'Show or hide the "Search vehicles" search box in the header.',
				condition: (data) => data?.theme === 'alpha',
			},
		},
		{
			name: 'ctaButton',
			type: 'group',
			label: 'CTA Button',
			admin: {
				position: 'sidebar',
				description:
					'Configure the call-to-action button (e.g., "Contact Us"). Leave text empty to hide the button.',
				condition: (data) => data?.theme === 'alpha',
			},
			fields: [
				{
					name: 'text',
					type: 'text',
					label: 'Button Text',
					admin: {
						description: 'Text to display on the button. Leave empty to hide the button.',
					},
				},
				link({
					appearances: false,
					disableLabel: true,
					overrides: {
						name: 'link',
						label: 'Button Link',
						admin: {
							condition: (data, siblingData) => !!siblingData?.text,
						},
					},
				}),
			],
		},
	],
	hooks: {
		afterChange: [revalidateHeader],
	},
}
