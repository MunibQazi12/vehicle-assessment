import type { Block } from 'payload'

export const ReviewsSection: Block = {
	slug: 'reviewsSection',
	interfaceName: 'ReviewsSectionBlock',
	labels: {
		singular: 'Reviews Section',
		plural: 'Reviews Sections',
	},
	fields: [
		// Section Header Settings
		{
			name: 'sectionTitle',
			type: 'text',
			label: 'Section Title',
			defaultValue: 'CUSTOMER REVIEWS',
			admin: {
				description: 'Main heading for the reviews section',
			},
		},
		{
			name: 'showAverageRating',
			type: 'checkbox',
			label: 'Show Average Rating',
			defaultValue: true,
		},
		{
			type: 'row',
			fields: [
				{
					name: 'averageRating',
					type: 'text',
					label: 'Average Rating',
					defaultValue: '4.60',
					admin: {
						description: 'Average star rating to display',
						width: '50%',
						condition: (_, siblingData) => !!siblingData?.showAverageRating,
					},
				},
				{
					name: 'ratingLabel',
					type: 'text',
					label: 'Rating Label',
					defaultValue: 'Average Star Rating!',
					admin: {
						description: 'Text displayed after the rating',
						width: '50%',
						condition: (_, siblingData) => !!siblingData?.showAverageRating,
					},
				},
			],
		},
		// Style Settings
		{
			name: 'styleSettings',
			type: 'group',
			label: 'Style Settings',
			fields: [
				{
					type: 'row',
					fields: [
						{
							name: 'backgroundColor',
							type: 'text',
							label: 'Background Color',
							defaultValue: '#151B49',
							admin: {
								description: 'Main background color',
								width: '50%',
								components: {
									Field: {
										path: '@dtcms/components/ColorPickerField',
										clientProps: {},
									},
								},
							},
						},
						{
							name: 'accentColor',
							type: 'text',
							label: 'Accent Color',
							defaultValue: '#72c6f5',
							admin: {
								description: 'Stars, rating number, and decorative elements',
								width: '50%',
								components: {
									Field: {
										path: '@dtcms/components/ColorPickerField',
										clientProps: {},
									},
								},
							},
						},
					],
				},
				{
					type: 'row',
					fields: [
						{
							name: 'titleColor',
							type: 'text',
							label: 'Title Color',
							defaultValue: '#ffffff',
							admin: {
								description: 'Section title text color',
								width: '50%',
								components: {
									Field: {
										path: '@dtcms/components/ColorPickerField',
										clientProps: {},
									},
								},
							},
						},
						{
							name: 'ratingLabelColor',
							type: 'text',
							label: 'Rating Label Color',
							defaultValue: '#ffffff',
							admin: {
								description: 'Rating label text color',
								width: '50%',
								components: {
									Field: {
										path: '@dtcms/components/ColorPickerField',
										clientProps: {},
									},
								},
							},
						},
					],
				},
				{
					name: 'showDecorativeElements',
					type: 'checkbox',
					label: 'Show Decorative Background Elements',
					defaultValue: true,
					admin: {
						description: 'Show blurred accent color circles in background',
					},
				},
			],
		},
		// Card Style Settings
		{
			name: 'cardSettings',
			type: 'group',
			label: 'Review Card Settings',
			fields: [
				{
					type: 'row',
					fields: [
						{
							name: 'cardBackgroundColor',
							type: 'text',
							label: 'Card Background',
							defaultValue: '#ffffff',
							admin: {
								width: '50%',
								components: {
									Field: {
										path: '@dtcms/components/ColorPickerField',
										clientProps: {},
									},
								},
							},
						},
						{
							name: 'cardTextColor',
							type: 'text',
							label: 'Card Text Color',
							defaultValue: '#374151',
							admin: {
								description: 'Review text color',
								width: '50%',
								components: {
									Field: {
										path: '@dtcms/components/ColorPickerField',
										clientProps: {},
									},
								},
							},
						},
					],
				},
				{
					type: 'row',
					fields: [
						{
							name: 'authorNameColor',
							type: 'text',
							label: 'Author Name Color',
							defaultValue: '#151B49',
							admin: {
								width: '50%',
								components: {
									Field: {
										path: '@dtcms/components/ColorPickerField',
										clientProps: {},
									},
								},
							},
						},
						{
							name: 'cardBorderRadius',
							type: 'select',
							label: 'Card Border Radius',
							defaultValue: '2xl',
							options: [
								{ label: 'None', value: 'none' },
								{ label: 'Small', value: 'sm' },
								{ label: 'Medium', value: 'md' },
								{ label: 'Large', value: 'lg' },
								{ label: 'Extra Large', value: 'xl' },
								{ label: '2XL', value: '2xl' },
								{ label: '3XL', value: '3xl' },
							],
							admin: {
								width: '50%',
							},
						},
					],
				},
			],
		},
		// Layout Settings
		{
			name: 'layoutSettings',
			type: 'group',
			label: 'Layout Settings',
			fields: [
				{
					type: 'row',
					fields: [
						{
							name: 'reviewsPerPage',
							type: 'number',
							label: 'Reviews Per Page',
							defaultValue: 2,
							min: 1,
							max: 6,
							admin: {
								description: 'Number of reviews visible at once',
								width: '50%',
							},
						},
						{
							name: 'gridColumns',
							type: 'select',
							label: 'Grid Columns (Desktop)',
							defaultValue: '2',
							options: [
								{ label: '1 Column', value: '1' },
								{ label: '2 Columns', value: '2' },
								{ label: '3 Columns', value: '3' },
							],
							admin: {
								width: '50%',
							},
						},
					],
				},
				{
					name: 'paddingSize',
					type: 'select',
					label: 'Section Padding',
					defaultValue: 'large',
					options: [
						{ label: 'Small', value: 'small' },
						{ label: 'Medium', value: 'medium' },
						{ label: 'Large', value: 'large' },
					],
				},
			],
		},
		// Reviews Content
		{
			name: 'reviews',
			type: 'array',
			label: 'Reviews',
			minRows: 1,
			maxRows: 20,
			admin: {
				initCollapsed: false,
				description: 'Add customer reviews to display',
			},
			fields: [
				{
					type: 'row',
					fields: [
						{
							name: 'author',
							type: 'text',
							label: 'Author Name',
							required: true,
							admin: {
								width: '50%',
							},
						},
						{
							name: 'rating',
							type: 'number',
							label: 'Star Rating',
							required: true,
							min: 1,
							max: 5,
							defaultValue: 5,
							admin: {
								width: '50%',
							},
						},
					],
				},
				{
					name: 'text',
					type: 'textarea',
					label: 'Review Text',
					required: true,
					admin: {
						rows: 4,
					},
				},
			],
		},
		// Pagination Settings
		{
			name: 'paginationSettings',
			type: 'group',
			label: 'Pagination Settings',
			fields: [
				{
					name: 'showPagination',
					type: 'checkbox',
					label: 'Show Pagination Dots',
					defaultValue: true,
				},
				{
					type: 'row',
					fields: [
						{
							name: 'activeDotColor',
							type: 'text',
							label: 'Active Dot Color',
							defaultValue: '#72c6f5',
							admin: {
								width: '50%',
								condition: (_, siblingData) => !!siblingData?.showPagination,
								components: {
									Field: {
										path: '@dtcms/components/ColorPickerField',
										clientProps: {},
									},
								},
							},
						},
						{
							name: 'inactiveDotColor',
							type: 'text',
							label: 'Inactive Dot Color',
							defaultValue: 'rgba(255, 255, 255, 0.3)',
							admin: {
								width: '50%',
								condition: (_, siblingData) => !!siblingData?.showPagination,
							},
						},
					],
				},
			],
		},
	],
}
