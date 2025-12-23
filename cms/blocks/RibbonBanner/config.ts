import type { Block } from 'payload'
import { defaultLexical } from '../../fields/defaultLexical'

export const RibbonBanner: Block = {
	slug: 'ribbonBanner',
	interfaceName: 'RibbonBannerBlock',
	labels: {
		singular: 'Ribbon Banner',
		plural: 'Ribbon Banners',
	},
	fields: [
		{
			name: 'text',
			type: 'richText',
			label: 'Banner Text',
			required: true,
			editor: defaultLexical,
			admin: {
				description: 'Main text content of the banner (rich text supported)',
			},
		},
		{
			name: 'gradientFrom',
			type: 'text',
			label: 'Gradient Start Color',
			defaultValue: '#72c6f5',
			admin: {
				description: 'Hex color code for gradient start (e.g., #72c6f5)',
			},
		},
		{
			name: 'gradientTo',
			type: 'text',
			label: 'Gradient End Color',
			defaultValue: '#5ab5e4',
			admin: {
				description: 'Hex color code for gradient end (e.g., #5ab5e4)',
			},
		},
		{
			name: 'showArrow',
			type: 'checkbox',
			label: 'Show Arrow',
			defaultValue: true,
			admin: {
				description: 'Display downward pointing arrow below the banner',
			},
		},
	],
}
