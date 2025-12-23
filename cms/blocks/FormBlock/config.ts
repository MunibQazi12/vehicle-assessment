import type { Block } from 'payload'

export const FormBlock: Block = {
	slug: 'formBlock',
	interfaceName: 'FormBlock',
	labels: {
		singular: 'Form Block',
		plural: 'Form Blocks',
	},
	fields: [
		{
			name: 'formId',
			type: 'text',
			label: 'Form',
			required: true,
			admin: {
				description: 'Select a form from Dealer Tower to display on this page',
				components: {
					Field: '@dtcms/components/FormSelectField',
				},
			},
		},
		{
			name: 'useContainer',
			type: 'checkbox',
			label: 'Use Container',
			defaultValue: false,
			admin: {
				description: 'Wrap the form in a container div for consistent page width',
			},
		},
	],
}
