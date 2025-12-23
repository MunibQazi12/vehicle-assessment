/**
 * CSS property to Tailwind class mappings
 * Used by the style-to-tailwind converter
 */

// Map pixel sizes to Tailwind classes
export const fontSizePixelMap: Record<string, string> = {
	'10px': 'text-xs',
	'12px': 'text-xs',
	'14px': 'text-sm',
	'16px': 'text-base',
	'18px': 'text-lg',
	'20px': 'text-xl',
	'24px': 'text-2xl',
	'30px': 'text-3xl',
	'36px': 'text-4xl',
	'48px': 'text-5xl',
	'60px': 'text-6xl',
	'72px': 'text-7xl',
	'96px': 'text-8xl',
	'128px': 'text-9xl',
}

// Map rem sizes to Tailwind classes
export const fontSizeRemMap: Record<string, string> = {
	'0.75rem': 'text-xs',
	'0.875rem': 'text-sm',
	'1rem': 'text-base',
	'1.125rem': 'text-lg',
	'1.25rem': 'text-xl',
	'1.5rem': 'text-2xl',
	'1.875rem': 'text-3xl',
	'2.25rem': 'text-4xl',
	'3rem': 'text-5xl',
	'3.75rem': 'text-6xl',
	'4.5rem': 'text-7xl',
	'6rem': 'text-8xl',
	'8rem': 'text-9xl',
}

// Font weight mapping
export const fontWeightMap: Record<string, string> = {
	'100': 'font-thin',
	'200': 'font-extralight',
	'300': 'font-light',
	'400': 'font-normal',
	'500': 'font-medium',
	'600': 'font-semibold',
	'700': 'font-bold',
	'800': 'font-extrabold',
	'900': 'font-black',
	normal: 'font-normal',
	bold: 'font-bold',
	bolder: 'font-bold',
	lighter: 'font-light',
}

// Display mapping
export const displayMap: Record<string, string> = {
	block: 'block',
	'inline-block': 'inline-block',
	inline: 'inline',
	flex: 'flex',
	'inline-flex': 'inline-flex',
	grid: 'grid',
	'inline-grid': 'inline-grid',
	hidden: 'hidden',
	none: 'hidden',
	contents: 'contents',
	'flow-root': 'flow-root',
}

// Position mapping
export const positionMap: Record<string, string> = {
	static: 'static',
	fixed: 'fixed',
	absolute: 'absolute',
	relative: 'relative',
	sticky: 'sticky',
}

// Overflow mapping
export const overflowMap: Record<string, string> = {
	auto: 'overflow-auto',
	hidden: 'overflow-hidden',
	visible: 'overflow-visible',
	scroll: 'overflow-scroll',
	clip: 'overflow-clip',
}

// Cursor mapping
export const cursorMap: Record<string, string> = {
	auto: 'cursor-auto',
	default: 'cursor-default',
	pointer: 'cursor-pointer',
	wait: 'cursor-wait',
	text: 'cursor-text',
	move: 'cursor-move',
	help: 'cursor-help',
	'not-allowed': 'cursor-not-allowed',
	none: 'cursor-none',
	'context-menu': 'cursor-context-menu',
	progress: 'cursor-progress',
	cell: 'cursor-cell',
	crosshair: 'cursor-crosshair',
	'vertical-text': 'cursor-vertical-text',
	alias: 'cursor-alias',
	copy: 'cursor-copy',
	'no-drop': 'cursor-no-drop',
	grab: 'cursor-grab',
	grabbing: 'cursor-grabbing',
}

// Border style mapping
export const borderStyleMap: Record<string, string> = {
	solid: 'border-solid',
	dashed: 'border-dashed',
	dotted: 'border-dotted',
	double: 'border-double',
	hidden: 'border-hidden',
	none: 'border-none',
}

// White space mapping
export const whiteSpaceMap: Record<string, string> = {
	normal: 'whitespace-normal',
	nowrap: 'whitespace-nowrap',
	pre: 'whitespace-pre',
	'pre-line': 'whitespace-pre-line',
	'pre-wrap': 'whitespace-pre-wrap',
	'break-spaces': 'whitespace-break-spaces',
}

// Word break mapping
export const wordBreakMap: Record<string, string> = {
	normal: 'break-normal',
	words: 'break-words',
	all: 'break-all',
	keep: 'break-keep',
}

// Text transform mapping
export const textTransformMap: Record<string, string> = {
	uppercase: 'uppercase',
	lowercase: 'lowercase',
	capitalize: 'capitalize',
	none: 'normal-case',
}

// Vertical align mapping
export const verticalAlignMap: Record<string, string> = {
	baseline: 'align-baseline',
	top: 'align-top',
	middle: 'align-middle',
	bottom: 'align-bottom',
	'text-top': 'align-text-top',
	'text-bottom': 'align-text-bottom',
	sub: 'align-sub',
	super: 'align-super',
}

// Flex wrap mapping
export const flexWrapMap: Record<string, string> = {
	wrap: 'flex-wrap',
	'wrap-reverse': 'flex-wrap-reverse',
	nowrap: 'flex-nowrap',
}

// Flex direction mapping
export const flexDirectionMap: Record<string, string> = {
	row: 'flex-row',
	'row-reverse': 'flex-row-reverse',
	column: 'flex-col',
	'column-reverse': 'flex-col-reverse',
}

// Justify content mapping
export const justifyContentMap: Record<string, string> = {
	'flex-start': 'justify-start',
	'flex-end': 'justify-end',
	center: 'justify-center',
	'space-between': 'justify-between',
	'space-around': 'justify-around',
	'space-evenly': 'justify-evenly',
	start: 'justify-start',
	end: 'justify-end',
}

// Align items mapping
export const alignItemsMap: Record<string, string> = {
	'flex-start': 'items-start',
	'flex-end': 'items-end',
	center: 'items-center',
	baseline: 'items-baseline',
	stretch: 'items-stretch',
	start: 'items-start',
	end: 'items-end',
}

// Align content mapping
export const alignContentMap: Record<string, string> = {
	'flex-start': 'content-start',
	'flex-end': 'content-end',
	center: 'content-center',
	'space-between': 'content-between',
	'space-around': 'content-around',
	'space-evenly': 'content-evenly',
	stretch: 'content-stretch',
	start: 'content-start',
	end: 'content-end',
}

// Object fit mapping
export const objectFitMap: Record<string, string> = {
	contain: 'object-contain',
	cover: 'object-cover',
	fill: 'object-fill',
	none: 'object-none',
	'scale-down': 'object-scale-down',
}

// Object position mapping
export const objectPositionMap: Record<string, string> = {
	bottom: 'object-bottom',
	center: 'object-center',
	left: 'object-left',
	'left-bottom': 'object-left-bottom',
	'left-top': 'object-left-top',
	right: 'object-right',
	'right-bottom': 'object-right-bottom',
	'right-top': 'object-right-top',
	top: 'object-top',
}

// Pointer events mapping
export const pointerEventsMap: Record<string, string> = {
	none: 'pointer-events-none',
	auto: 'pointer-events-auto',
}

// User select mapping
export const userSelectMap: Record<string, string> = {
	none: 'select-none',
	text: 'select-text',
	all: 'select-all',
	auto: 'select-auto',
}

// Visibility mapping
export const visibilityMap: Record<string, string> = {
	visible: 'visible',
	hidden: 'invisible',
	collapse: 'collapse',
}

// Named colors to hex
export const namedColorsMap: Record<string, string> = {
	black: '#000000',
	white: '#ffffff',
	red: '#ff0000',
	green: '#008000',
	blue: '#0000ff',
	yellow: '#ffff00',
	orange: '#ffa500',
	purple: '#800080',
	pink: '#ffc0cb',
	gray: '#808080',
	grey: '#808080',
	transparent: 'transparent',
}

// Border radius mapping
export const borderRadiusMap: Record<string, string> = {
	'0': 'rounded-none',
	'0px': 'rounded-none',
	'0.125rem': 'rounded-sm',
	'2px': 'rounded-sm',
	'0.25rem': 'rounded',
	'4px': 'rounded',
	'0.375rem': 'rounded-md',
	'6px': 'rounded-md',
	'0.5rem': 'rounded-lg',
	'8px': 'rounded-lg',
	'0.75rem': 'rounded-xl',
	'12px': 'rounded-xl',
	'1rem': 'rounded-2xl',
	'16px': 'rounded-2xl',
	'1.5rem': 'rounded-3xl',
	'24px': 'rounded-3xl',
	'9999px': 'rounded-full',
	'50%': 'rounded-full',
}
