import type { Block } from 'payload'
import { link } from '../../fields/link'

export const ContentSection: Block = {
	slug: 'contentSection',
	interfaceName: 'ContentSectionBlock',
	labels: {
		singular: 'Content Section',
		plural: 'Content Sections',
	},
	fields: [
		{
			type: 'tabs',
			tabs: [
				{
					label: 'Content',
					fields: [
						{
							name: 'content',
							type: 'json',
							label: 'Content',
							required: true,
							admin: {
								description: 'Main content text created with the WYSIWYG editor',
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
						{
							name: 'contentAlignment',
							type: 'select',
							label: 'Content Text Alignment',
							defaultValue: 'left',
							options: [
								{ label: 'Left', value: 'left' },
								{ label: 'Center', value: 'center' },
								{ label: 'Right', value: 'right' },
							],
							admin: {
								description: 'Text alignment for the content',
							},
						},
						{
							name: 'contentVerticalAlign',
							type: 'select',
							label: 'Vertical Alignment',
							defaultValue: 'center',
							options: [
								{ label: 'Top', value: 'start' },
								{ label: 'Center', value: 'center' },
								{ label: 'Bottom', value: 'end' },
							],
							admin: {
								description: 'Vertical alignment when image is present',
							},
						},
					],
				},
				{
					label: 'Show More',
					fields: [
						{
							name: 'enableShowMore',
							type: 'checkbox',
							label: 'Enable "Show More" Section',
							defaultValue: false,
							admin: {
								description: 'Add expandable content that users can reveal with a "Show More" button',
							},
						},
						{
							name: 'expandedContent',
							type: 'json',
							label: 'Expanded Content (Show More)',
							defaultValue: {
								type: 'doc',
								content: [{ type: 'paragraph' }],
							},
							validate: (value, { siblingData }: { siblingData?: Record<string, unknown> }) => {
								if (!siblingData?.enableShowMore) {
									return true
								}
								if (value && typeof value === 'object' && 'type' in value) {
									return true
								}
								return 'Please enter content for the expanded section'
							},
							admin: {
								description: 'Additional content revealed when user clicks "Show More"',
								components: {
									Field: {
										path: '@dtcms/components/EditorField',
										clientProps: {},
									},
								},
								condition: (_, siblingData) => !!siblingData?.enableShowMore,
							},
						},
						{
							name: 'expandedHtmlContent',
							type: 'textarea',
							label: 'Expanded HTML Content',
							admin: {
								description: 'Auto-generated HTML from the expanded editor (read-only)',
								readOnly: true,
								hidden: true,
							},
						},
						{
							type: 'row',
							fields: [
								{
									name: 'showMoreButtonText',
									type: 'text',
									label: 'Show More Button Text',
									defaultValue: 'Show More',
									admin: {
										description: 'Custom text for the "Show More" button',
										condition: (_, siblingData) => !!siblingData?.enableShowMore,
										width: '50%',
									},
								},
								{
									name: 'showLessButtonText',
									type: 'text',
									label: 'Show Less Button Text',
									defaultValue: 'Show Less',
									admin: {
										description: 'Custom text for the "Show Less" button',
										condition: (_, siblingData) => !!siblingData?.enableShowMore,
										width: '50%',
									},
								},
							],
						},
						{
							name: 'showMoreButtonStyle',
							type: 'select',
							label: 'Button Style',
							defaultValue: 'link',
							options: [
								{ label: 'Text Link', value: 'link' },
								{ label: 'Primary Button', value: 'primary' },
								{ label: 'Secondary Button', value: 'secondary' },
								{ label: 'Outline Button', value: 'outline' },
							],
							admin: {
								description: 'Style of the Show More/Less button',
								condition: (_, siblingData) => !!siblingData?.enableShowMore,
							},
						},
					],
				},
				{
					label: 'Image',
					fields: [
						{
							name: 'image',
							type: 'upload',
							relationTo: 'media',
							label: 'Image',
							admin: {
								description: 'Optional image (recommended: 500x400px or similar aspect ratio)',
							},
						},
						{
							type: 'row',
							fields: [
								{
									name: 'imagePosition',
									type: 'select',
									label: 'Image Position',
									defaultValue: 'right',
									options: [
										{ label: 'Left', value: 'left' },
										{ label: 'Right', value: 'right' },
									],
									admin: {
										description: 'Position of image relative to content',
										condition: (_, siblingData) => !!siblingData?.image,
										width: '50%',
									},
								},
								{
									name: 'imagePriority',
									type: 'checkbox',
									label: 'Priority Image Loading',
									defaultValue: false,
									admin: {
										description: 'Enable for above-the-fold images (improves LCP)',
										condition: (_, siblingData) => !!siblingData?.image,
										width: '50%',
									},
								},
							],
						},
						{
							name: 'imageStyle',
							type: 'select',
							label: 'Image Style',
							defaultValue: 'rounded',
							options: [
								{ label: 'Rounded Corners', value: 'rounded' },
								{ label: 'Circle/Oval', value: 'circle' },
								{ label: 'Square', value: 'square' },
								{ label: 'No Style', value: 'none' },
							],
							admin: {
								description: 'Visual style for the image',
								condition: (_, siblingData) => !!siblingData?.image,
							},
						},
						{
							name: 'imageShadow',
							type: 'select',
							label: 'Image Shadow',
							defaultValue: 'lg',
							options: [
								{ label: 'None', value: 'none' },
								{ label: 'Small', value: 'sm' },
								{ label: 'Medium', value: 'md' },
								{ label: 'Large', value: 'lg' },
								{ label: 'Extra Large', value: 'xl' },
								{ label: '2XL', value: '2xl' },
							],
							admin: {
								description: 'Shadow depth for the image',
								condition: (_, siblingData) => !!siblingData?.image,
							},
						},
						{
							name: 'imageMaxWidth',
							type: 'select',
							label: 'Image Max Width',
							defaultValue: 'md',
							options: [
								{ label: 'Small (320px)', value: 'sm' },
								{ label: 'Medium (448px)', value: 'md' },
								{ label: 'Large (512px)', value: 'lg' },
								{ label: 'Full Column', value: 'full' },
							],
							admin: {
								description: 'Maximum width of the image',
								condition: (_, siblingData) => !!siblingData?.image,
							},
						},
						{
							name: 'mobileImagePosition',
							type: 'select',
							label: 'Mobile Image Position',
							defaultValue: 'top',
							options: [
								{ label: 'Above Content', value: 'top' },
								{ label: 'Below Content', value: 'bottom' },
								{ label: 'Hidden on Mobile', value: 'hidden' },
							],
							admin: {
								description: 'Image position on mobile devices',
								condition: (_, siblingData) => !!siblingData?.image,
							},
						},
					],
				},
				{
					label: 'Layout',
					fields: [
						{
							name: 'layout',
							type: 'select',
							label: 'Layout Style',
							defaultValue: 'split',
							options: [
								{ label: 'Split (Content + Image)', value: 'split' },
								{ label: 'Full Width Content', value: 'full' },
								{ label: 'Centered Content', value: 'centered' },
								{ label: 'Content with Background Image', value: 'background' },
							],
							admin: {
								description: 'Overall layout structure of the section',
							},
						},
						{
							name: 'contentWidth',
							type: 'select',
							label: 'Content Width (Full Layout)',
							defaultValue: '3xl',
							options: [
								{ label: 'Small (max-w-xl)', value: 'xl' },
								{ label: 'Medium (max-w-2xl)', value: '2xl' },
								{ label: 'Large (max-w-3xl)', value: '3xl' },
								{ label: 'Extra Large (max-w-4xl)', value: '4xl' },
								{ label: 'Full (max-w-7xl)', value: '7xl' },
							],
							admin: {
								description: 'Maximum width for full/centered layout',
								condition: (_, siblingData) =>
									siblingData?.layout === 'full' || siblingData?.layout === 'centered',
							},
						},
						{
							name: 'splitRatio',
							type: 'select',
							label: 'Split Ratio',
							defaultValue: '50-50',
							options: [
								{ label: 'Equal (50/50)', value: '50-50' },
								{ label: 'Content Heavy (60/40)', value: '60-40' },
								{ label: 'Image Heavy (40/60)', value: '40-60' },
								{ label: 'Content Wide (70/30)', value: '70-30' },
								{ label: 'Image Wide (30/70)', value: '30-70' },
							],
							admin: {
								description: 'Ratio between content and image columns',
								condition: (_, siblingData) => siblingData?.layout === 'split',
							},
						},
						{
							name: 'gapSize',
							type: 'select',
							label: 'Gap Between Columns',
							defaultValue: 'lg',
							options: [
								{ label: 'None', value: 'none' },
								{ label: 'Small', value: 'sm' },
								{ label: 'Medium', value: 'md' },
								{ label: 'Large', value: 'lg' },
								{ label: 'Extra Large', value: 'xl' },
							],
							admin: {
								description: 'Space between content and image',
								condition: (_, siblingData) => siblingData?.layout === 'split',
							},
						},
					],
				},
				{
					label: 'Spacing',
					fields: [
						{
							type: 'row',
							fields: [
								{
									name: 'paddingTop',
									type: 'select',
									label: 'Padding Top',
									defaultValue: 'lg',
									options: [
										{ label: 'None', value: 'none' },
										{ label: 'Extra Small', value: 'xs' },
										{ label: 'Small', value: 'sm' },
										{ label: 'Medium', value: 'md' },
										{ label: 'Large', value: 'lg' },
										{ label: 'Extra Large', value: 'xl' },
										{ label: '2XL', value: '2xl' },
									],
									admin: {
										description: 'Top padding (responsive)',
										width: '50%',
									},
								},
								{
									name: 'paddingBottom',
									type: 'select',
									label: 'Padding Bottom',
									defaultValue: 'lg',
									options: [
										{ label: 'None', value: 'none' },
										{ label: 'Extra Small', value: 'xs' },
										{ label: 'Small', value: 'sm' },
										{ label: 'Medium', value: 'md' },
										{ label: 'Large', value: 'lg' },
										{ label: 'Extra Large', value: 'xl' },
										{ label: '2XL', value: '2xl' },
									],
									admin: {
										description: 'Bottom padding (responsive)',
										width: '50%',
									},
								},
							],
						},
						{
							name: 'maxWidth',
							type: 'select',
							label: 'Container Max Width',
							defaultValue: '7xl',
							options: [
								{ label: '5XL (1024px)', value: '5xl' },
								{ label: '6XL (1152px)', value: '6xl' },
								{ label: '7XL (1280px)', value: '7xl' },
								{ label: 'Full Width', value: 'full' },
							],
							admin: {
								description: 'Maximum width of the section container',
							},
						},
						{
							name: 'horizontalPadding',
							type: 'select',
							label: 'Horizontal Padding',
							defaultValue: 'default',
							options: [
								{ label: 'None', value: 'none' },
								{ label: 'Small', value: 'small' },
								{ label: 'Default', value: 'default' },
								{ label: 'Large', value: 'large' },
							],
							admin: {
								description: 'Left and right padding',
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
							label: 'Background Color (Start)',
							defaultValue: '#ffffff',
							admin: {
								description: 'Hex color code for the background (or gradient start color)',
								components: {
									Field: {
										path: '@dtcms/components/ColorPickerField',
										clientProps: {},
									},
								},
							},
						},
						{
							name: 'isGradient',
							type: 'checkbox',
							label: 'Use Gradient Background',
							defaultValue: false,
							admin: {
								description: 'Enable gradient from start color to end color',
							},
						},
						{
							type: 'row',
							fields: [
								{
									name: 'gradientEndColor',
									type: 'text',
									label: 'Background Color (End)',
									defaultValue: '#f0f0f0',
									admin: {
										description: 'End color for gradient background',
										components: {
											Field: {
												path: '@dtcms/components/ColorPickerField',
												clientProps: {},
											},
										},
										condition: (_, siblingData) => !!siblingData?.isGradient,
										width: '50%',
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
										condition: (_, siblingData) => !!siblingData?.isGradient,
										width: '50%',
									},
								},
							],
						},
						{
							name: 'backgroundOverlay',
							type: 'select',
							label: 'Background Overlay',
							defaultValue: 'none',
							options: [
								{ label: 'None', value: 'none' },
								{ label: 'Light (10%)', value: 'light' },
								{ label: 'Medium (30%)', value: 'medium' },
								{ label: 'Dark (50%)', value: 'dark' },
								{ label: 'Heavy (70%)', value: 'heavy' },
							],
							admin: {
								description: 'Overlay opacity (useful with background images)',
								condition: (_, siblingData) => siblingData?.layout === 'background',
							},
						},
					],
				},
				{
					label: 'CTAs',
					fields: [
						{
							name: 'ctas',
							type: 'array',
							label: 'Call to Actions',
							maxRows: 4,
							fields: [
								link({
									appearances: false,
									overrides: {
										name: 'link',
										label: 'CTA Link',
										required: true,
									},
								}),
								{
									type: 'row',
									fields: [
										{
											name: 'position',
											type: 'select',
											label: 'CTA Position',
											defaultValue: 'content',
											options: [
												{ label: 'Below Content', value: 'content' },
												{ label: 'Below Image', value: 'image' },
											],
											admin: {
												description: 'Where to position the CTA button',
												width: '50%',
											},
										},
										{
											name: 'style',
											type: 'select',
											label: 'Button Style',
											defaultValue: 'primary',
											options: [
												{ label: 'Primary', value: 'primary' },
												{ label: 'Secondary', value: 'secondary' },
												{ label: 'Outline', value: 'outline' },
												{ label: 'Ghost', value: 'ghost' },
												{ label: 'Link', value: 'link' },
											],
											admin: {
												description: 'Visual style of the button',
												width: '50%',
											},
										},
									],
								},
								{
									name: 'size',
									type: 'select',
									label: 'Button Size',
									defaultValue: 'md',
									options: [
										{ label: 'Small', value: 'sm' },
										{ label: 'Medium', value: 'md' },
										{ label: 'Large', value: 'lg' },
									],
									admin: {
										description: 'Size of the button',
									},
								},
							],
						},
						{
							name: 'ctaAlignment',
							type: 'select',
							label: 'CTA Alignment',
							defaultValue: 'left',
							options: [
								{ label: 'Left', value: 'left' },
								{ label: 'Center', value: 'center' },
								{ label: 'Right', value: 'right' },
							],
							admin: {
								description: 'Alignment of CTA buttons',
							},
						},
						{
							name: 'ctaSpacing',
							type: 'select',
							label: 'CTA Spacing',
							defaultValue: 'md',
							options: [
								{ label: 'Small', value: 'sm' },
								{ label: 'Medium', value: 'md' },
								{ label: 'Large', value: 'lg' },
							],
							admin: {
								description: 'Space between CTA buttons',
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
										description: 'Hide section on mobile (< 768px)',
										width: '33%',
									},
								},
								{
									name: 'hideOnTablet',
									type: 'checkbox',
									label: 'Hide on Tablet',
									defaultValue: false,
									admin: {
										description: 'Hide section on tablet (768px - 1024px)',
										width: '33%',
									},
								},
								{
									name: 'hideOnDesktop',
									type: 'checkbox',
									label: 'Hide on Desktop',
									defaultValue: false,
									admin: {
										description: 'Hide section on desktop (> 1024px)',
										width: '33%',
									},
								},
							],
						},
						{
							name: 'mobileTextAlign',
							type: 'select',
							label: 'Mobile Text Alignment',
							options: [
								{ label: 'Use Default', value: 'default' },
								{ label: 'Left', value: 'left' },
								{ label: 'Center', value: 'center' },
								{ label: 'Right', value: 'right' },
							],
							admin: {
								description: 'Override text alignment on mobile',
							},
						},
						{
							name: 'mobilePaddingTop',
							type: 'select',
							label: 'Mobile Padding Top Override',
							options: [
								{ label: 'Use Default', value: 'default' },
								{ label: 'None', value: 'none' },
								{ label: 'Extra Small', value: 'xs' },
								{ label: 'Small', value: 'sm' },
								{ label: 'Medium', value: 'md' },
								{ label: 'Large', value: 'lg' },
							],
							admin: {
								description: 'Override top padding on mobile',
							},
						},
						{
							name: 'mobilePaddingBottom',
							type: 'select',
							label: 'Mobile Padding Bottom Override',
							options: [
								{ label: 'Use Default', value: 'default' },
								{ label: 'None', value: 'none' },
								{ label: 'Extra Small', value: 'xs' },
								{ label: 'Small', value: 'sm' },
								{ label: 'Medium', value: 'md' },
								{ label: 'Large', value: 'lg' },
							],
							admin: {
								description: 'Override bottom padding on mobile',
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
								description: 'Optional ID attribute for anchor links',
							},
						},
						{
							name: 'customClasses',
							type: 'text',
							label: 'Custom CSS Classes',
							admin: {
								description: 'Additional CSS classes for the section',
							},
						},
						{
							name: 'contentCustomClasses',
							type: 'text',
							label: 'Content Custom Classes',
							admin: {
								description: 'Additional CSS classes for the content area',
							},
						},
						{
							name: 'animationStyle',
							type: 'select',
							label: 'Animation Style',
							defaultValue: 'none',
							options: [
								{ label: 'None', value: 'none' },
								{ label: 'Fade In', value: 'fadeIn' },
								{ label: 'Slide Up', value: 'slideUp' },
								{ label: 'Slide In Left', value: 'slideLeft' },
								{ label: 'Slide In Right', value: 'slideRight' },
							],
							admin: {
								description: 'Animation when section comes into view',
							},
						},
					],
				},
			],
		},
	],
}
