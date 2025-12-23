import type { Block } from 'payload'

export const Spacer: Block = {
	slug: 'spacer',
	fields: [
		{
			name: 'size',
			type: 'select',
			defaultValue: 'medium',
			options: [
				{ label: 'Small (2rem)', value: 'small' },
				{ label: 'Medium (4rem)', value: 'medium' },
				{ label: 'Large (6rem)', value: 'large' },
				{ label: 'Extra Large (8rem)', value: 'xlarge' },
			],
			required: true,
			admin: {
				description: 'Select the amount of vertical space to add',
			},
		},
	],
	interfaceName: 'SpacerBlock',
	labels: {
		singular: 'Spacer',
		plural: 'Spacers',
	},
}
