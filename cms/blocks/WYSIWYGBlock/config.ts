import type { Block } from 'payload'

export const WYSIWYGBlock: Block = {
	slug: 'content',
	interfaceName: 'ContentBlock',
	labels: {
		singular: 'Text Block',
		plural: 'Text Blocks',
	},
	fields: [
		{
			name: 'content',
			type: 'json',
			label: 'Content',
			required: true,
			admin: {
				description: 'Rich text content created with the WYSIWYG editor',
				components: {
					Field: {
						path: '@dtcms/components/EditorField',
						clientProps: {},
					},
				},
			},
		},
		{
			name: 'htmlContent',
			type: 'textarea',
			label: 'HTML Content',
			admin: {
				description: 'Auto-generated HTML from the editor (read-only)',
				readOnly: true,
				hidden: true,
			},
		},
	],
}
