import type { GlobalConfig } from 'payload'

import { link } from '@dtcms/fields/link'
import { revalidateFooter } from './hooks/revalidateFooter'
import { footerThemeOptions } from './themes'
export const Footer: GlobalConfig = {
	slug: 'footer',
	access: {
		read: () => true,
	},
	fields: [
		{
			name: 'theme',
			type: 'select',
			required: true,
			defaultValue: 'alpha',
			options: footerThemeOptions,
			admin: {
				description: 'Select the footer layout/theme to use',
			},
		},
		{
			name: 'navItems',
			type: 'array',
			fields: [
				link({
					appearances: false,
				}),
			],
			maxRows: 6,
			admin: {
				initCollapsed: true,
				components: {
					RowLabel: '@dtcms/Footer/RowLabel#RowLabel',
				},
			},
		},
	],
	hooks: {
		afterChange: [revalidateFooter],
	},
}
