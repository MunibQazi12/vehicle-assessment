import { describe, it, expect } from 'vitest'
import { convertStylesToTailwind, mergeClasses, getLabel } from '../utils'

describe('getLabel', () => {
	it('should return fallback for undefined label', () => {
		expect(getLabel(undefined, 'Fallback')).toBe('Fallback')
	})

	it('should return fallback for false label', () => {
		expect(getLabel(false, 'Fallback')).toBe('Fallback')
	})

	it('should return string label directly', () => {
		expect(getLabel('My Label', 'Fallback')).toBe('My Label')
	})

	it('should return first value from object label', () => {
		expect(getLabel({ en: 'English', es: 'Spanish' }, 'Fallback')).toBe('English')
	})
})

describe('convertStylesToTailwind', () => {
	describe('font-size conversion', () => {
		it('should convert pixel font-size to Tailwind class', () => {
			const html = '<span style="font-size: 16px">Text</span>'
			expect(convertStylesToTailwind(html)).toBe('<span class="text-base">Text</span>')
		})

		it('should convert rem font-size to Tailwind class', () => {
			const html = '<span style="font-size: 1.5rem">Text</span>'
			expect(convertStylesToTailwind(html)).toBe('<span class="text-2xl">Text</span>')
		})

		it('should use arbitrary value for custom font-size', () => {
			const html = '<span style="font-size: 22px">Text</span>'
			expect(convertStylesToTailwind(html)).toBe('<span class="text-[22px]">Text</span>')
		})
	})

	describe('color conversion', () => {
		it('should convert hex color to Tailwind arbitrary class', () => {
			const html = '<span style="color: #ff0000">Text</span>'
			expect(convertStylesToTailwind(html)).toBe('<span class="text-[#ff0000]">Text</span>')
		})

		it('should convert rgb color to hex Tailwind class', () => {
			const html = '<span style="color: rgb(255, 0, 0)">Text</span>'
			expect(convertStylesToTailwind(html)).toBe('<span class="text-[#ff0000]">Text</span>')
		})

		it('should handle transparent color', () => {
			const html = '<span style="color: transparent">Text</span>'
			expect(convertStylesToTailwind(html)).toBe('<span class="text-transparent">Text</span>')
		})

		it('should handle inherit color', () => {
			const html = '<span style="color: inherit">Text</span>'
			expect(convertStylesToTailwind(html)).toBe('<span class="text-inherit">Text</span>')
		})
	})

	describe('background-color conversion', () => {
		it('should convert hex bg color to Tailwind arbitrary class', () => {
			const html = '<span style="background-color: #00ff00">Text</span>'
			expect(convertStylesToTailwind(html)).toBe('<span class="bg-[#00ff00]">Text</span>')
		})

		it('should handle transparent background', () => {
			const html = '<span style="background-color: transparent">Text</span>'
			expect(convertStylesToTailwind(html)).toBe('<span class="bg-transparent">Text</span>')
		})
	})

	describe('text-align conversion', () => {
		it('should convert text-align to Tailwind class', () => {
			const html = '<p style="text-align: center">Text</p>'
			expect(convertStylesToTailwind(html)).toBe('<p class="text-center">Text</p>')
		})

		it('should convert text-align justify', () => {
			const html = '<p style="text-align: justify">Text</p>'
			expect(convertStylesToTailwind(html)).toBe('<p class="text-justify">Text</p>')
		})
	})

	describe('font-weight conversion', () => {
		it('should convert numeric font-weight', () => {
			const html = '<span style="font-weight: 700">Text</span>'
			expect(convertStylesToTailwind(html)).toBe('<span class="font-bold">Text</span>')
		})

		it('should convert named font-weight', () => {
			const html = '<span style="font-weight: bold">Text</span>'
			expect(convertStylesToTailwind(html)).toBe('<span class="font-bold">Text</span>')
		})
	})

	describe('font-style conversion', () => {
		it('should convert italic font-style', () => {
			const html = '<span style="font-style: italic">Text</span>'
			expect(convertStylesToTailwind(html)).toBe('<span class="italic">Text</span>')
		})

		it('should convert normal font-style', () => {
			const html = '<span style="font-style: normal">Text</span>'
			expect(convertStylesToTailwind(html)).toBe('<span class="not-italic">Text</span>')
		})
	})

	describe('text-decoration conversion', () => {
		it('should convert underline', () => {
			const html = '<span style="text-decoration: underline">Text</span>'
			expect(convertStylesToTailwind(html)).toBe('<span class="underline">Text</span>')
		})

		it('should convert line-through', () => {
			const html = '<span style="text-decoration: line-through">Text</span>'
			expect(convertStylesToTailwind(html)).toBe('<span class="line-through">Text</span>')
		})

		it('should convert none decoration', () => {
			const html = '<span style="text-decoration: none">Text</span>'
			expect(convertStylesToTailwind(html)).toBe('<span class="no-underline">Text</span>')
		})
	})

	describe('display conversion', () => {
		it('should convert display flex', () => {
			const html = '<div style="display: flex">Content</div>'
			expect(convertStylesToTailwind(html)).toBe('<div class="flex">Content</div>')
		})

		it('should convert display none to hidden', () => {
			const html = '<div style="display: none">Content</div>'
			expect(convertStylesToTailwind(html)).toBe('<div class="hidden">Content</div>')
		})

		it('should convert display grid', () => {
			const html = '<div style="display: grid">Content</div>'
			expect(convertStylesToTailwind(html)).toBe('<div class="grid">Content</div>')
		})
	})

	describe('position conversion', () => {
		it('should convert position absolute', () => {
			const html = '<div style="position: absolute">Content</div>'
			expect(convertStylesToTailwind(html)).toBe('<div class="absolute">Content</div>')
		})

		it('should convert position relative', () => {
			const html = '<div style="position: relative">Content</div>'
			expect(convertStylesToTailwind(html)).toBe('<div class="relative">Content</div>')
		})
	})

	describe('spacing conversion', () => {
		it('should convert margin', () => {
			const html = '<div style="margin: 16px">Content</div>'
			expect(convertStylesToTailwind(html)).toBe('<div class="m-[16px]">Content</div>')
		})

		it('should convert margin-top', () => {
			const html = '<div style="margin-top: 8px">Content</div>'
			expect(convertStylesToTailwind(html)).toBe('<div class="mt-[8px]">Content</div>')
		})

		it('should convert margin auto', () => {
			const html = '<div style="margin: auto">Content</div>'
			expect(convertStylesToTailwind(html)).toBe('<div class="m-auto">Content</div>')
		})

		it('should convert padding', () => {
			const html = '<div style="padding: 24px">Content</div>'
			expect(convertStylesToTailwind(html)).toBe('<div class="p-[24px]">Content</div>')
		})

		it('should convert gap', () => {
			const html = '<div style="gap: 12px">Content</div>'
			expect(convertStylesToTailwind(html)).toBe('<div class="gap-[12px]">Content</div>')
		})
	})

	describe('width/height conversion', () => {
		it('should convert width 100%', () => {
			const html = '<div style="width: 100%">Content</div>'
			expect(convertStylesToTailwind(html)).toBe('<div class="w-full">Content</div>')
		})

		it('should convert width auto', () => {
			const html = '<div style="width: auto">Content</div>'
			expect(convertStylesToTailwind(html)).toBe('<div class="w-auto">Content</div>')
		})

		it('should convert custom width', () => {
			const html = '<div style="width: 300px">Content</div>'
			expect(convertStylesToTailwind(html)).toBe('<div class="w-[300px]">Content</div>')
		})

		it('should convert height 100%', () => {
			const html = '<div style="height: 100%">Content</div>'
			expect(convertStylesToTailwind(html)).toBe('<div class="h-full">Content</div>')
		})
	})

	describe('flex conversion', () => {
		it('should convert flex-direction column', () => {
			const html = '<div style="flex-direction: column">Content</div>'
			expect(convertStylesToTailwind(html)).toBe('<div class="flex-col">Content</div>')
		})

		it('should convert justify-content center', () => {
			const html = '<div style="justify-content: center">Content</div>'
			expect(convertStylesToTailwind(html)).toBe('<div class="justify-center">Content</div>')
		})

		it('should convert align-items center', () => {
			const html = '<div style="align-items: center">Content</div>'
			expect(convertStylesToTailwind(html)).toBe('<div class="items-center">Content</div>')
		})

		it('should convert flex-wrap', () => {
			const html = '<div style="flex-wrap: wrap">Content</div>'
			expect(convertStylesToTailwind(html)).toBe('<div class="flex-wrap">Content</div>')
		})
	})

	describe('border conversion', () => {
		it('should convert border-radius', () => {
			const html = '<div style="border-radius: 8px">Content</div>'
			expect(convertStylesToTailwind(html)).toBe('<div class="rounded-lg">Content</div>')
		})

		it('should convert border-radius full', () => {
			const html = '<div style="border-radius: 9999px">Content</div>'
			expect(convertStylesToTailwind(html)).toBe('<div class="rounded-full">Content</div>')
		})

		it('should convert border-width', () => {
			const html = '<div style="border-width: 2px">Content</div>'
			expect(convertStylesToTailwind(html)).toBe('<div class="border-2">Content</div>')
		})

		it('should convert border-color', () => {
			const html = '<div style="border-color: #333333">Content</div>'
			expect(convertStylesToTailwind(html)).toBe('<div class="border-[#333333]">Content</div>')
		})
	})

	describe('opacity conversion', () => {
		it('should convert standard opacity', () => {
			const html = '<div style="opacity: 0.5">Content</div>'
			expect(convertStylesToTailwind(html)).toBe('<div class="opacity-50">Content</div>')
		})

		it('should convert custom opacity', () => {
			const html = '<div style="opacity: 0.33">Content</div>'
			expect(convertStylesToTailwind(html)).toBe('<div class="opacity-[0.33]">Content</div>')
		})
	})

	describe('combined styles', () => {
		it('should convert multiple styles to multiple classes', () => {
			const html = '<p style="text-align: center; font-weight: bold; color: #ff0000">Text</p>'
			expect(convertStylesToTailwind(html)).toBe('<p class="text-center font-bold text-[#ff0000]">Text</p>')
		})

		it('should keep unknown styles as inline style', () => {
			const html = '<div style="font-family: Arial; color: #000">Content</div>'
			const result = convertStylesToTailwind(html)
			expect(result).toContain('style="font-family: Arial;"')
			expect(result).toContain('class="text-[#000000]"')
		})
	})

	describe('cursor conversion', () => {
		it('should convert cursor pointer', () => {
			const html = '<button style="cursor: pointer">Click</button>'
			expect(convertStylesToTailwind(html)).toBe('<button class="cursor-pointer">Click</button>')
		})

		it('should convert cursor not-allowed', () => {
			const html = '<button style="cursor: not-allowed">Disabled</button>'
			expect(convertStylesToTailwind(html)).toBe('<button class="cursor-not-allowed">Disabled</button>')
		})
	})

	describe('z-index conversion', () => {
		it('should convert standard z-index', () => {
			const html = '<div style="z-index: 10">Content</div>'
			expect(convertStylesToTailwind(html)).toBe('<div class="z-10">Content</div>')
		})

		it('should convert custom z-index', () => {
			const html = '<div style="z-index: 100">Content</div>'
			expect(convertStylesToTailwind(html)).toBe('<div class="z-[100]">Content</div>')
		})
	})

	describe('text-transform conversion', () => {
		it('should convert uppercase', () => {
			const html = '<span style="text-transform: uppercase">Text</span>'
			expect(convertStylesToTailwind(html)).toBe('<span class="uppercase">Text</span>')
		})

		it('should convert capitalize', () => {
			const html = '<span style="text-transform: capitalize">Text</span>'
			expect(convertStylesToTailwind(html)).toBe('<span class="capitalize">Text</span>')
		})
	})

	describe('overflow conversion', () => {
		it('should convert overflow hidden', () => {
			const html = '<div style="overflow: hidden">Content</div>'
			expect(convertStylesToTailwind(html)).toBe('<div class="overflow-hidden">Content</div>')
		})

		it('should convert overflow-x auto', () => {
			const html = '<div style="overflow-x: auto">Content</div>'
			expect(convertStylesToTailwind(html)).toBe('<div class="overflow-x-auto">Content</div>')
		})
	})
})

describe('mergeClasses', () => {
	it('should merge duplicate class attributes', () => {
		const html = '<div class="text-lg" class="font-bold">Content</div>'
		expect(mergeClasses(html)).toBe('<div class="text-lg font-bold">Content</div>')
	})

	it('should not affect elements with single class attribute', () => {
		const html = '<div class="text-lg font-bold">Content</div>'
		expect(mergeClasses(html)).toBe('<div class="text-lg font-bold">Content</div>')
	})
})
