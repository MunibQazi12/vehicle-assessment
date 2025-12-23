import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'

// Mock hooks before importing the component
vi.mock('@dealertower/lib/hooks/useUrlState', () => ({
	useUrlState: vi.fn(),
}))

vi.mock('@dealertower/lib/hooks/useClientSideFilters', () => ({
	useFilterValues: vi.fn(),
}))

// Mock Swiper components before importing the component
vi.mock('swiper/react', () => ({
	Swiper: ({ children, onBeforeInit }: { children: React.ReactNode; onBeforeInit?: (swiper: any) => void }) => {
		if (onBeforeInit) {
			setTimeout(() => {
				onBeforeInit({
					params: {
						navigation: {
							prevEl: null,
							nextEl: null,
						},
					},
				})
			}, 0)
		}
		return <div data-testid="swiper">{children}</div>
	},
	SwiperSlide: ({ children }: { children: React.ReactNode }) => <div data-testid="swiper-slide">{children}</div>,
}))

vi.mock('swiper/modules', () => ({
	Navigation: {},
}))

// Mock SVG icons
vi.mock('@dealertower/svgs/icons', () => ({
	CarIcon: () => <svg data-testid="car-icon" />,
}))

vi.mock('@dealertower/svgs/cars', () => ({
	sedan: () => <svg data-testid="sedan-icon" />,
	suv: () => <svg data-testid="suv-icon" />,
	truck: () => <svg data-testid="truck-icon" />,
	coupe: () => <svg data-testid="coupe-icon" />,
	hatchback: () => <svg data-testid="hatchback-icon" />,
}))

// Mock BODY_STYLE_ICONS constant
vi.mock('../constants/cars', () => ({
	BODY_STYLE_ICONS: {
		sedan: () => <svg data-testid="sedan-icon" />,
		suv: () => <svg data-testid="suv-icon" />,
		truck: () => <svg data-testid="truck-icon" />,
		coupe: () => <svg data-testid="coupe-icon" />,
		'bare chassis': () => <svg data-testid="bare-chassis-icon" />,
	},
}))

import { SRPIconsCarousel } from '../SRPIconsCarousel'
import { useUrlState } from '@dealertower/lib/hooks/useUrlState'
import { useFilterValues } from '@dealertower/lib/hooks/useClientSideFilters'

describe('SRPIconsCarousel', () => {
	const mockToggleArrayFilter = vi.fn()

	beforeEach(() => {
		vi.clearAllMocks()
		vi.mocked(useUrlState).mockReturnValue({
			toggleArrayFilter: mockToggleArrayFilter,
		} as any)
		vi.mocked(useFilterValues).mockReturnValue([])
	})

	it('should render header text and icon', () => {
		render(<SRPIconsCarousel />)

		expect(screen.getByTestId('car-icon')).toBeInTheDocument()
		const headerText = screen.getByText((content, element) => {
			return element?.tagName === 'P' && content.length > 0
		})
		expect(headerText).toBeInTheDocument()
	})

	it('should render navigation buttons', () => {
		render(<SRPIconsCarousel />)

		expect(screen.getByRole('button', { name: 'Previous' })).toBeInTheDocument()
		expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument()
	})

	it('should render all body style icons from BODY_STYLE_ICONS', () => {
		render(<SRPIconsCarousel />)

		// Check that buttons are rendered for each body style
		expect(screen.getByText('Sedans')).toBeInTheDocument()
		expect(screen.getByText('Suvs')).toBeInTheDocument()
		expect(screen.getByText('Trucks')).toBeInTheDocument()
		expect(screen.getByText('Coupes')).toBeInTheDocument()
		expect(screen.getByText('Bare Chassiss')).toBeInTheDocument()
	})

	it('should format labels as title case and pluralized', () => {
		render(<SRPIconsCarousel />)

		// Single word: "sedan" -> "Sedans"
		expect(screen.getByText('Sedans')).toBeInTheDocument()

		// Multiple words: "bare chassis" -> "Bare Chassiss"
		expect(screen.getByText('Bare Chassiss')).toBeInTheDocument()
	})

	it('should call toggleArrayFilter when clicking a body style button', () => {
		render(<SRPIconsCarousel />)

		const sedanButton = screen.getByText('Sedans').closest('button')
		expect(sedanButton).toBeInTheDocument()

		if (sedanButton) {
			fireEvent.click(sedanButton)
			expect(mockToggleArrayFilter).toHaveBeenCalledWith('body', 'sedan')
		}
	})

	it('should show selected state when body style is in currentBodyValues', () => {
		vi.mocked(useFilterValues).mockReturnValue(['sedan'])

		render(<SRPIconsCarousel />)

		const sedanButton = screen.getByText('Sedans').closest('button')
		expect(sedanButton).toHaveAttribute('aria-pressed', 'true')
		expect(sedanButton).toHaveClass('bg-zinc-900')
		expect(sedanButton).toHaveClass('border-zinc-900')
	})

	it('should show unselected state when body style is not in currentBodyValues', () => {
		vi.mocked(useFilterValues).mockReturnValue([])

		render(<SRPIconsCarousel />)

		const sedanButton = screen.getByText('Sedans').closest('button')
		expect(sedanButton).toHaveAttribute('aria-pressed', 'false')
		expect(sedanButton).toHaveClass('bg-white/80')
		expect(sedanButton).toHaveClass('border-zinc-200')
	})

	it('should handle multiple selected body styles', () => {
		vi.mocked(useFilterValues).mockReturnValue(['sedan', 'suv'])

		render(<SRPIconsCarousel />)

		const sedanButton = screen.getByText('Sedans').closest('button')
		const suvButton = screen.getByText('Suvs').closest('button')
		const truckButton = screen.getByText('Trucks').closest('button')

		expect(sedanButton).toHaveAttribute('aria-pressed', 'true')
		expect(suvButton).toHaveAttribute('aria-pressed', 'true')
		expect(truckButton).toHaveAttribute('aria-pressed', 'false')
	})

	it('should render Swiper component', () => {
		render(<SRPIconsCarousel />)

		expect(screen.getByTestId('swiper')).toBeInTheDocument()
	})

	it('should handle empty selected values', () => {
		vi.mocked(useFilterValues).mockReturnValue([])

		render(<SRPIconsCarousel />)

		// All buttons should be unselected
		const buttons = screen.getAllByRole('button').filter(
			(btn) => btn.getAttribute('aria-pressed') !== null
		)

		buttons.forEach((button) => {
			expect(button).toHaveAttribute('aria-pressed', 'false')
		})
	})
})

