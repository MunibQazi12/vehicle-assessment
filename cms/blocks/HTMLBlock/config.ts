import type { Block } from 'payload'

export const HTMLBlock: Block = {
	slug: 'htmlBlock',
	interfaceName: 'HTMLBlock',
	labels: {
		singular: 'HTML Block',
		plural: 'HTML Blocks',
	},
	fields: [
		{
			name: 'htmlContent',
			type: 'textarea',
			label: 'HTML Code',
			required: true,
			admin: {
				description: 'Paste your HTML code here. Styles and scripts will be rendered.',
				rows: 8,
				className: 'html-block-textarea',
			},
		},
		{
			name: 'enableScripts',
			type: 'checkbox',
			label: 'Enable JavaScript',
			defaultValue: true,
			admin: {
				description: 'Allow script tags to execute (use with caution)',
			},
		},
		{
			name: 'useContainer',
			type: 'checkbox',
			label: 'Use Container',
			defaultValue: true,
			admin: {
				description: 'Wrap content in a container div for consistent page width',
			},
		},
	],
}
