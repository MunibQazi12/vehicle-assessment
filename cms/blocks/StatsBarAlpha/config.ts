import type { Block } from 'payload'

export const StatsBarAlpha: Block = {
	slug: 'statsBarAlpha',
	interfaceName: 'StatsBarAlphaBlock',
	fields: [
		{
			name: 'backgroundColor',
			type: 'text',
			label: 'Background Color',
			defaultValue: '#151B49',
			admin: {
				description: 'Hex color code for the background',
				components: {
					Field: {
						path: '@dtcms/components/ColorPickerField',
						clientProps: {},
					},
				},
			},
		},
		{
			name: 'stats',
			type: 'array',
			label: 'Statistics',
			minRows: 1,
			maxRows: 5,
			fields: [
				{
					type: 'row',
					fields: [
						{
							name: 'valueType',
							type: 'select',
							label: 'Value Type',
							required: true,
							defaultValue: 'custom',
							options: [
								{ label: 'Count of New Vehicles', value: 'new-vehicles' },
								{ label: 'Count of Used Vehicles', value: 'used-vehicles' },
								{ label: 'Custom Value', value: 'custom' },
							],
							admin: {
								width: '50%',
							},
						},
						{
							name: 'value',
							type: 'text',
							label: 'Value',
							admin: {
								description: 'e.g., "1,234" or "+30,000"',
								width: '50%',
								condition: (data, siblingData) => {
									return siblingData?.valueType === 'custom'
								},
							},
						},
						{
							name: 'label',
							type: 'text',
							label: 'Label',
							required: true,
							admin: {
								description: 'e.g., "NEW VEHICLES"',
								width: '50%',
							},
						},
						{
							name: 'link',
							type: 'text',
							label: 'Link (optional)',
							admin: {
								description: 'Internal link path, e.g., "/new-vehicles/"',
								width: '50%',
							},
						},
					],
				},
				{
					type: 'row',
					fields: [
						{
							name: 'linkTarget',
							type: 'select',
							label: 'Link Target',
							defaultValue: '_self',
							options: [
								{ label: 'Same Tab', value: '_self' },
								{ label: 'New Tab', value: '_blank' },
							],
							admin: {
								width: '50%',
								condition: (data, siblingData) => {
									return !!siblingData?.link
								},
							},
						},
						{
							name: 'linkRel',
							type: 'select',
							label: 'Link Relation',
							defaultValue: 'follow',
							options: [
								{ label: 'Follow (Default)', value: 'follow' },
								{ label: 'No Follow', value: 'nofollow' },
								{ label: 'No Follow & No Opener', value: 'nofollow noopener' },
								{ label: 'Sponsored', value: 'sponsored' },
								{ label: 'UGC (User Generated Content)', value: 'ugc' },
							],
							admin: {
								width: '50%',
								condition: (data, siblingData) => {
									return !!siblingData?.link
								},
							},
						},
					],
				},
			],
			defaultValue: [
				{ valueType: 'new-vehicles', value: '—', label: 'NEW VEHICLES', link: '/new-vehicles/' },
				{ valueType: 'used-vehicles', value: '—', label: 'USED VEHICLES', link: '/used-vehicles/' },
				{ valueType: 'custom', value: '+30,000', label: 'POSITIVE ONLINE REVIEWS', link: '' },
			],
		},
	],
	labels: {
		plural: 'Stats Bars Alpha',
		singular: 'Stats Bar Alpha',
	},
}
