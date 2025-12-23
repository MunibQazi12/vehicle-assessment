import type { Field } from 'payload'

export const hero: Field = {
	name: 'hero',
	type: 'group',
	fields: [
		{
			name: 'type',
			type: 'select',
			defaultValue: 'none',
			label: 'Type',
			options: [
				{
					label: 'None',
					value: 'none',
				},
				{
					label: 'Hero Alpha',
					value: 'heroTemplate1',
				},
				{
					label: 'Page Hero',
					value: 'heroTemplate2',
				},
			],
			required: true,
		},
		{
			name: 'heroAlphaText',
			type: 'text',
			label: 'Hero Text',
			admin: {
				condition: (_, { type } = {}) =>
					['heroTemplate1'].includes(type),
			},
		},
		{
			name: 'backgroundImage',
			type: 'upload',
			label: 'Background Image',
			admin: {
				condition: (_, { type } = {}) =>
					['heroTemplate1', 'heroTemplate2'].includes(type),
			},
			relationTo: 'media',
			validate: (value: unknown, { siblingData }: { siblingData?: Record<string, unknown> }) => {
				if (siblingData?.type === 'heroTemplate1' && !value) {
					return 'Background Image is required for Hero Alpha'
				}
				return true
			},
		},
		{
			name: 'mobileBackgroundImage',
			type: 'upload',
			label: 'Mobile Background Image',
			admin: {
				condition: (_, { type } = {}) =>
					['heroTemplate1', 'heroTemplate2'].includes(type),
			},
			relationTo: 'media',
		},
		{
			name: 'enableBodyStyleSearch',
			type: 'checkbox',
			label: 'Enable Body Style Search',
			defaultValue: true,
			admin: {
				condition: (_, { type } = {}) =>
					['heroTemplate1'].includes(type),
			},
		},
		{
			name: 'enablePriceSearch',
			type: 'checkbox',
			label: 'Enable Price Search',
			defaultValue: true,
			admin: {
				condition: (_, { type } = {}) =>
					['heroTemplate1'].includes(type),
			},
		},
		{
			name: 'enableLocationSearch',
			type: 'checkbox',
			label: 'Enable Location Search',
			defaultValue: true,
			admin: {
				condition: (_, { type } = {}) =>
					['heroTemplate1'].includes(type),
			},
		},
		// HeroTemplate2 (Page Hero) Fields
		{
			name: 'title',
			type: 'text',
			label: 'Title',
			admin: {
				condition: (_, { type } = {}) =>
					['heroTemplate2'].includes(type),
			},
		},
		{
			name: 'subtitle',
			type: 'text',
			label: 'Subtitle',
			admin: {
				condition: (_, { type } = {}) =>
					['heroTemplate2'].includes(type),
			},
		},
		{
			name: 'height',
			type: 'select',
			label: 'Height',
			defaultValue: 'medium',
			options: [
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
			],
			admin: {
				condition: (_, { type } = {}) =>
					['heroTemplate2'].includes(type),
			},
		},
		{
			name: 'textAlignment',
			type: 'select',
			label: 'Text Alignment',
			defaultValue: 'center',
			options: [
				{
					label: 'Left',
					value: 'left',
				},
				{
					label: 'Center',
					value: 'center',
				},
				{
					label: 'Right',
					value: 'right',
				},
			],
			admin: {
				condition: (_, { type } = {}) =>
					['heroTemplate2'].includes(type),
			},
		},
		{
			name: 'overlayOpacity',
			type: 'number',
			label: 'Image Overlay Opacity (%)',
			defaultValue: 40,
			min: 0,
			max: 100,
			admin: {
				condition: (_, { type } = {}) =>
					['heroTemplate2'].includes(type),
				description: 'Controls how visible the background image is (0 = hidden, 100 = fully visible)',
			},
		},
		{
			name: 'gradientFrom',
			type: 'text',
			label: 'Gradient Start Color',
			defaultValue: '#151B49',
			admin: {
				condition: (_, { type } = {}) =>
					['heroTemplate2'].includes(type),
				description: 'Fallback gradient start color (hex)',
			},
		},
		{
			name: 'gradientTo',
			type: 'text',
			label: 'Gradient End Color',
			defaultValue: '#1a2055',
			admin: {
				condition: (_, { type } = {}) =>
					['heroTemplate2'].includes(type),
				description: 'Fallback gradient end color (hex)',
			},
		},
	],
	label: false,
}
