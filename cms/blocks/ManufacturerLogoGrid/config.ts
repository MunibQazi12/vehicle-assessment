import type { Block } from 'payload'

export const ManufacturerLogoGrid: Block = {
	slug: 'manufacturerLogoGrid',
	interfaceName: 'ManufacturerLogoGridBlock',
	labels: {
		singular: 'Manufacturer Logo Grid',
		plural: 'Manufacturer Logo Grids',
	},
	fields: [
		{
			name: 'columns',
			type: 'select',
			label: 'Number of Columns',
			defaultValue: '5',
			options: [
				{ label: '2 Columns', value: '2' },
				{ label: '3 Columns', value: '3' },
				{ label: '4 Columns', value: '4' },
				{ label: '5 Columns', value: '5' },
				{ label: '6 Columns', value: '6' },
			],
			admin: {
				description: 'Number of columns in the grid (automatically responsive on mobile)',
			},
		},
		{
			name: 'secondaryDealerHostname',
			type: 'text',
			label: 'Secondary Dealer Hostname',
			admin: {
				description:
					'Optional: Enter a secondary dealer hostname (e.g., www.dealertower.com) to show only brands from that dealer that are NOT in the current dealer. Leave empty to show current dealer brands.',
				placeholder: 'www.dealertower.com',
			},
		},
	],
}
