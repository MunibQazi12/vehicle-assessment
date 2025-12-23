import type { Block } from 'payload'

export const ContainerSection: Block = {
	slug: 'containerSection',
	interfaceName: 'ContainerSectionBlock',
	labels: {
		singular: 'Container Section',
		plural: 'Container Sections',
	},
	fields: [
		{
			type: 'tabs',
			tabs: [
				{
					label: 'Content',
					fields: [
						{
							name: 'blocks',
							type: 'blocks',
							label: 'Content Blocks',
							labels: {
								singular: 'Block',
								plural: 'Blocks',
							},
							blocks: [], // Will be populated from parent collection
							admin: {
								description: 'Add blocks inside this container section',
							},
						},
					],
				},
				{
					label: 'Container Settings',
					fields: [
						{
							name: 'maxWidth',
							type: 'select',
							label: 'Max Width',
							defaultValue: '3xl',
							options: [
								{ label: 'Extra Small (max-w-xs - 320px)', value: 'xs' },
								{ label: 'Small (max-w-sm - 384px)', value: 'sm' },
								{ label: 'Medium (max-w-md - 448px)', value: 'md' },
								{ label: 'Large (max-w-lg - 512px)', value: 'lg' },
								{ label: 'XL (max-w-xl - 576px)', value: 'xl' },
								{ label: '2XL (max-w-2xl - 672px)', value: '2xl' },
								{ label: '3XL (max-w-3xl - 768px)', value: '3xl' },
								{ label: '4XL (max-w-4xl - 896px)', value: '4xl' },
								{ label: '5XL (max-w-5xl - 1024px)', value: '5xl' },
								{ label: '6XL (max-w-6xl - 1152px)', value: '6xl' },
								{ label: '7XL (max-w-7xl - 1280px)', value: '7xl' },
								{ label: 'Full (max-w-full)', value: 'full' },
								{ label: 'None (no max-width)', value: 'none' },
							],
							admin: {
								description: 'Maximum width of the inner container',
							},
						},
						{
							name: 'horizontalPadding',
							type: 'select',
							label: 'Horizontal Padding',
							defaultValue: 'default',
							options: [
								{ label: 'None', value: 'none' },
								{ label: 'Small (px-2 / sm:px-4)', value: 'small' },
								{ label: 'Default (px-4 / sm:px-6)', value: 'default' },
								{ label: 'Large (px-6 / sm:px-8)', value: 'large' },
								{ label: 'XL (px-8 / sm:px-10)', value: 'xl' },
							],
							admin: {
								description: 'Horizontal padding inside the container',
							},
						},
						{
							name: 'centerContent',
							type: 'checkbox',
							label: 'Center Container',
							defaultValue: true,
							admin: {
								description: 'Center the container horizontally (mx-auto)',
							},
						},
					],
				},
				{
					label: 'Section Spacing',
					fields: [
						{
							name: 'paddingTop',
							type: 'select',
							label: 'Padding Top',
							defaultValue: 'md',
							options: [
								{ label: 'None', value: 'none' },
								{ label: 'Extra Small (py-2 / md:py-4)', value: 'xs' },
								{ label: 'Small (py-4 / md:py-6 / lg:py-8)', value: 'sm' },
								{ label: 'Medium (py-8 / md:py-12 / lg:py-16)', value: 'md' },
								{ label: 'Large (py-12 / md:py-16 / lg:py-20)', value: 'lg' },
								{ label: 'XL (py-16 / md:py-20 / lg:py-24)', value: 'xl' },
								{ label: '2XL (py-20 / md:py-24 / lg:py-32)', value: '2xl' },
							],
							admin: {
								description: 'Top padding of the section (responsive)',
							},
						},
						{
							name: 'paddingBottom',
							type: 'select',
							label: 'Padding Bottom',
							defaultValue: 'md',
							options: [
								{ label: 'None', value: 'none' },
								{ label: 'Extra Small (py-2 / md:py-4)', value: 'xs' },
								{ label: 'Small (py-4 / md:py-6 / lg:py-8)', value: 'sm' },
								{ label: 'Medium (py-8 / md:py-12 / lg:py-16)', value: 'md' },
								{ label: 'Large (py-12 / md:py-16 / lg:py-20)', value: 'lg' },
								{ label: 'XL (py-16 / md:py-20 / lg:py-24)', value: 'xl' },
								{ label: '2XL (py-20 / md:py-24 / lg:py-32)', value: '2xl' },
							],
							admin: {
								description: 'Bottom padding of the section (responsive)',
							},
						},
					],
				},
				{
					label: 'Background',
					fields: [
						{
							name: 'backgroundColor',
							type: 'text',
							label: 'Background Color',
							defaultValue: '#ffffff',
							admin: {
								description: 'Background color of the section',
								components: {
									Field: {
										path: '@dtcms/components/ColorPickerField',
									},
								},
							},
						},
						{
							name: 'enableGradient',
							type: 'checkbox',
							label: 'Enable Gradient Background',
							defaultValue: false,
						},
						{
							name: 'gradientEndColor',
							type: 'text',
							label: 'Gradient End Color',
							defaultValue: '#f3f4f6',
							admin: {
								description: 'End color for gradient background',
								condition: (_, siblingData) => !!siblingData?.enableGradient,
								components: {
									Field: {
										path: '@dtcms/components/ColorPickerField',
									},
								},
							},
						},
						{
							name: 'gradientDirection',
							type: 'select',
							label: 'Gradient Direction',
							defaultValue: 'to-b',
							options: [
								{ label: 'Top to Bottom', value: 'to-b' },
								{ label: 'Bottom to Top', value: 'to-t' },
								{ label: 'Left to Right', value: 'to-r' },
								{ label: 'Right to Left', value: 'to-l' },
								{ label: 'Top-Left to Bottom-Right', value: 'to-br' },
								{ label: 'Top-Right to Bottom-Left', value: 'to-bl' },
								{ label: 'Bottom-Left to Top-Right', value: 'to-tr' },
								{ label: 'Bottom-Right to Top-Left', value: 'to-tl' },
							],
							admin: {
								description: 'Direction of the gradient',
								condition: (_, siblingData) => !!siblingData?.enableGradient,
							},
						},
					],
				},
				{
					label: 'Responsive',
					fields: [
						{
							type: 'row',
							fields: [
								{
									name: 'hideOnMobile',
									type: 'checkbox',
									label: 'Hide on Mobile',
									defaultValue: false,
									admin: {
										description: 'Hide this section on mobile devices (< 768px)',
										width: '33%',
									},
								},
								{
									name: 'hideOnTablet',
									type: 'checkbox',
									label: 'Hide on Tablet',
									defaultValue: false,
									admin: {
										description: 'Hide this section on tablet devices (768px - 1024px)',
										width: '33%',
									},
								},
								{
									name: 'hideOnDesktop',
									type: 'checkbox',
									label: 'Hide on Desktop',
									defaultValue: false,
									admin: {
										description: 'Hide this section on desktop devices (> 1024px)',
										width: '33%',
									},
								},
							],
						},
						{
							name: 'mobileMaxWidth',
							type: 'select',
							label: 'Mobile Max Width Override',
							options: [
								{ label: 'Use Default', value: 'default' },
								{ label: 'Full Width', value: 'full' },
								{ label: 'Extra Small (320px)', value: 'xs' },
								{ label: 'Small (384px)', value: 'sm' },
								{ label: 'Medium (448px)', value: 'md' },
								{ label: 'Large (512px)', value: 'lg' },
							],
							admin: {
								description: 'Override max width on mobile devices (< 768px)',
							},
						},
						{
							name: 'mobilePaddingTop',
							type: 'select',
							label: 'Mobile Padding Top Override',
							options: [
								{ label: 'Use Default', value: 'default' },
								{ label: 'None', value: 'none' },
								{ label: 'Extra Small (0.5rem)', value: 'xs' },
								{ label: 'Small (1rem)', value: 'sm' },
								{ label: 'Medium (2rem)', value: 'md' },
								{ label: 'Large (3rem)', value: 'lg' },
								{ label: 'XL (4rem)', value: 'xl' },
							],
							admin: {
								description: 'Override top padding on mobile devices (< 768px)',
							},
						},
						{
							name: 'mobilePaddingBottom',
							type: 'select',
							label: 'Mobile Padding Bottom Override',
							options: [
								{ label: 'Use Default', value: 'default' },
								{ label: 'None', value: 'none' },
								{ label: 'Extra Small (0.5rem)', value: 'xs' },
								{ label: 'Small (1rem)', value: 'sm' },
								{ label: 'Medium (2rem)', value: 'md' },
								{ label: 'Large (3rem)', value: 'lg' },
								{ label: 'XL (4rem)', value: 'xl' },
							],
							admin: {
								description: 'Override bottom padding on mobile devices (< 768px)',
							},
						},
						{
							name: 'mobileHorizontalPadding',
							type: 'select',
							label: 'Mobile Horizontal Padding Override',
							options: [
								{ label: 'Use Default', value: 'default' },
								{ label: 'None', value: 'none' },
								{ label: 'Extra Small (0.25rem)', value: 'xs' },
								{ label: 'Small (0.5rem)', value: 'sm' },
								{ label: 'Medium (1rem)', value: 'md' },
								{ label: 'Large (1.5rem)', value: 'lg' },
							],
							admin: {
								description: 'Override horizontal padding on mobile devices (< 768px)',
							},
						},
					],
				},
				{
					label: 'Advanced',
					fields: [
						{
							name: 'htmlId',
							type: 'text',
							label: 'HTML ID',
							admin: {
								description: 'Optional ID attribute for the section (useful for anchor links)',
							},
						},
						{
							name: 'customClasses',
							type: 'text',
							label: 'Custom CSS Classes',
							admin: {
								description: 'Additional CSS classes to apply to the section wrapper',
							},
						},
						{
							name: 'innerCustomClasses',
							type: 'text',
							label: 'Inner Container Custom Classes',
							admin: {
								description: 'Additional CSS classes to apply to the inner container',
							},
						},
					],
				},
			],
		},
	],
}
