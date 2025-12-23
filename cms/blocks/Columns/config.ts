import type { Block } from 'payload'

export const ColumnsBlock: Block = {
	slug: 'columnsBlock',
	interfaceName: 'ColumnsBlockType',
	fields: [
		{
			name: 'columns',
			type: 'array',
			label: 'Columns',
			minRows: 1,
			maxRows: 4,
			labels: {
				singular: 'Column',
				plural: 'Columns',
			},
			fields: [
				{
					name: 'size',
					type: 'select',
					label: 'Column Width',
					defaultValue: 'half',
					options: [
						{
							label: 'Full Width (12/12)',
							value: 'full',
						},
						{
							label: 'Two Thirds (8/12)',
							value: 'twoThirds',
						},
						{
							label: 'Half Width (6/12)',
							value: 'half',
						},
						{
							label: 'One Third (4/12)',
							value: 'oneThird',
						},
						{
							label: 'One Quarter (3/12)',
							value: 'oneQuarter',
						},
					],
				},
				{
					name: 'blocks',
					type: 'blocks',
					label: 'Column Content',
					labels: {
						singular: 'Block',
						plural: 'Blocks',
					},
					blocks: [], // Will be populated from parent collection
				},
			],
		},
		{
			name: 'gapSize',
			type: 'select',
			label: 'Gap Between Columns',
			defaultValue: 'medium',
			options: [
				{
					label: 'None',
					value: 'none',
				},
				{
					label: 'Small',
					value: 'small',
				},
				{
					label: 'Medium',
					value: 'medium',
				},
				{
					label: 'Large',
					value: 'large',
				},
				{
					label: 'Extra Large',
					value: 'xl',
				},
			],
		},
		{
			name: 'verticalAlign',
			type: 'select',
			label: 'Vertical Alignment',
			defaultValue: 'start',
			options: [
				{
					label: 'Top',
					value: 'start',
				},
				{
					label: 'Center',
					value: 'center',
				},
				{
					label: 'Bottom',
					value: 'end',
				},
				{
					label: 'Stretch',
					value: 'stretch',
				},
			],
		},
	],
}
