import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import type { SRPVehicle, CTAType, CTADevice, CTALocation } from '@dealertower/types/api'

// Mock useWebsiteInfo hook before importing the component
vi.mock('@dealertower/lib/tenant/context', () => ({
	useWebsiteInfo: vi.fn(() => null),
}))

// Mock CTAButton component before importing the component
vi.mock('@dealertower/components/shared/CTAButton', () => ({
	CTAButton: ({ cta }: { cta: { cta_label: string } }) => (
		<button>{cta.cta_label}</button>
	),
}))

// Mock image utility functions before importing the component
vi.mock('@dealertower/lib/utils/image', () => ({
	getSecureVehicleImageUrl: vi.fn((url: string | null) => url || ''),
	getBlurDataURL: vi.fn((url: string | null) => url || ''),
}))

// Mock Swiper components before importing the component
vi.mock('swiper/react', () => ({
	Swiper: ({ children, onBeforeInit }: { children: React.ReactNode; onBeforeInit?: (swiper: any) => void }) => {
		// Call onBeforeInit if provided to simulate Swiper initialization
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

import NewVehicleCard from '../NewVehicleCard'
import { getSecureVehicleImageUrl, getBlurDataURL } from '@dealertower/lib/utils/image'
import { useWebsiteInfo } from '@dealertower/lib/tenant/context'

describe('NewVehicleCard', () => {
	const mockVehicle: SRPVehicle = {
		// Status flags
		is_special: false,
		is_in_transit: false,
		is_commercial: false,
		is_sale_pending: false,
		is_new_arrival: false,
		is_sold: false,

		// Identifiers
		vehicle_id: '123',
		dealer_ids: ['dealer1'],
		stock_number: 'ST12345',
		vin_number: 'VIN123',

		// Display info
		title: '2024 Toyota Camry',
		subtitle: null,

		// Vehicle details
		condition: 'New',
		year: '2024',
		make: 'Toyota',
		model: 'Camry',
		trim: 'LE',
		doors: 4,
		body: 'Sedan',
		drive_train: 'FWD',
		fuel_type: 'Gas',

		// Colors
		ext_color: '#FF0000',
		ext_color_raw: 'Red',
		int_color: '#000000',
		int_color_raw: 'Black',

		// Specifications
		mileage: 5000,
		mpg_highway: 35,
		mpg_city: 28,
		transmission: 'Automatic',
		engine: '2.5L',

		// Inventory info
		days_in_stock: 10,
		description: null,
		keywords: [],
		key_features: [],
		package_ids: [],
		presets_package_ids: [],

		// Interactive elements
		cta: [
			{
				cta_label: 'Confirm Availability',
				cta_type: 'form',
				device: 'both',
				cta_conditions: [],
				cta_location: 'srp',
				btn_attributes: [],
				btn_classes: [],
				btn_styles: null,
				btn_content: 'form-uuid-123',
				open_newtab: false,
			},
		],
		tag: null,
		oem_incentives: null,

		// CarFax
		is_carfax_one_owner: true,
		carfax_icon_url: 'https://example.com/carfax.png',
		carfax_url: 'https://example.com/carfax',

		// Pricing
		price: 25000,
		sale_price: 24000,
		retail_price: 28000,
		prices: null,

		// Media
		vdp_slug: '2024-toyota-camry',
		photo: 'https://example.com/photo.jpg',
		photo_preview: null,
		video: null,
		video_subtitle: null,

		// Dealer info
		dealer: ['Dealer Name'],
		city: ['City'],
		state: ['State'],
		address: ['Address'],
		website: ['https://example.com'],
		zipcode: ['12345'],
	}

	beforeEach(() => {
		vi.clearAllMocks()
		// Setup default mocks for image utilities
		vi.mocked(getSecureVehicleImageUrl).mockImplementation((url) => url || '')
		vi.mocked(getBlurDataURL).mockImplementation((url) => url || '')
		// Setup default mock for useWebsiteInfo (returns null by default)
		vi.mocked(useWebsiteInfo).mockReturnValue(null)
	})

	it('should render vehicle image with correct src and alt', () => {
		vi.mocked(getSecureVehicleImageUrl).mockReturnValue('https://example.com/photo.jpg')
		vi.mocked(getBlurDataURL).mockReturnValue(undefined)

		render(<NewVehicleCard vehicle={mockVehicle} />)

		const image = screen.getByAltText('2024 Toyota Camry')
		expect(image).toBeInTheDocument()
		expect(getSecureVehicleImageUrl).toHaveBeenCalledWith('https://example.com/photo.jpg')
		expect(getBlurDataURL).toHaveBeenCalledWith(null)
	})

	it('should use "Vehicle" as alt text when title is missing', () => {
		const vehicleWithoutTitle = {
			...mockVehicle,
			title: null,
		}
		vi.mocked(getSecureVehicleImageUrl).mockReturnValue('https://example.com/photo.jpg')
		vi.mocked(getBlurDataURL).mockReturnValue(undefined)

		render(<NewVehicleCard vehicle={vehicleWithoutTitle} />)

		const image = screen.getByAltText('Vehicle')
		expect(image).toBeInTheDocument()
	})

	it('should render "No image available" when image is missing', () => {
		const vehicleWithoutImage = {
			...mockVehicle,
			photo: null,
		}
		vi.mocked(getSecureVehicleImageUrl).mockReturnValue('')

		render(<NewVehicleCard vehicle={vehicleWithoutImage} />)

		expect(screen.getByText('No image available')).toBeInTheDocument()
	})

	it('should use blur placeholder when photo_preview exists', () => {
		const vehicleWithPreview = {
			...mockVehicle,
			photo_preview: 'preview_base64_string',
		}
		vi.mocked(getSecureVehicleImageUrl).mockReturnValue('https://example.com/photo.jpg')
		vi.mocked(getBlurDataURL).mockReturnValue('data:image/webp;base64,preview_data')

		render(<NewVehicleCard vehicle={vehicleWithPreview} />)

		expect(getBlurDataURL).toHaveBeenCalledWith('preview_base64_string')
		const image = screen.getByAltText('2024 Toyota Camry')
		expect(image).toBeInTheDocument()
	})

	it('should render vehicle title', () => {
		render(<NewVehicleCard vehicle={mockVehicle} />)

		expect(screen.getByText('2024 Toyota Camry')).toBeInTheDocument()
	})

	it('should construct title from year, make, model when title is missing', () => {
		const vehicleWithoutTitle = {
			...mockVehicle,
			title: null,
		}

		render(<NewVehicleCard vehicle={vehicleWithoutTitle} />)

		expect(screen.getByText('2024 Toyota Camry')).toBeInTheDocument()
	})

	it('should render stock number', () => {
		render(<NewVehicleCard vehicle={mockVehicle} />)

		expect(screen.getByText('ST12345')).toBeInTheDocument()
	})

	it('should render "Stock N/A" when stock number is missing', () => {
		const vehicleWithoutStock = {
			...mockVehicle,
			stock_number: null,
		}

		render(<NewVehicleCard vehicle={vehicleWithoutStock} />)

		expect(screen.getByText('Stock N/A')).toBeInTheDocument()
	})

	it('should render vehicle condition/type', () => {
		render(<NewVehicleCard vehicle={mockVehicle} />)

		expect(screen.getByText('New')).toBeInTheDocument()
	})

	it('should render "Vehicle" when condition is missing', () => {
		const vehicleWithoutCondition = {
			...mockVehicle,
			condition: null,
		}

		render(<NewVehicleCard vehicle={vehicleWithoutCondition} />)

		expect(screen.getByText('Vehicle')).toBeInTheDocument()
	})

	it('should render sale price using price when both price and sale_price exist', () => {
		render(<NewVehicleCard vehicle={mockVehicle} />)

		// price (25000) takes precedence over sale_price (24000)
		expect(screen.getByText('$25,000')).toBeInTheDocument()
	})

	it('should use sale_price when price is missing', () => {
		const vehicleWithSalePriceOnly = {
			...mockVehicle,
			price: null,
			sale_price: 24000,
		}

		render(<NewVehicleCard vehicle={vehicleWithSalePriceOnly} />)

		expect(screen.getByText('$24,000')).toBeInTheDocument()
	})

	it('should render MSRP and savings when both prices exist and savings > 0', () => {
		render(<NewVehicleCard vehicle={mockVehicle} />)

		expect(screen.getByText(/MSRP/)).toBeInTheDocument()
		expect(screen.getByText('$28,000')).toBeInTheDocument()
		expect(screen.getByText('$3,000 Savings')).toBeInTheDocument()
	})

	it('should not render savings when savings is 0 or negative', () => {
		const vehicleNoSavings = {
			...mockVehicle,
			price: 28000,
			sale_price: 28000,
			retail_price: 28000,
		}

		render(<NewVehicleCard vehicle={vehicleNoSavings} />)

		expect(screen.queryByText(/Savings/)).not.toBeInTheDocument()
	})

	it('should render year feature when year exists', () => {
		render(<NewVehicleCard vehicle={mockVehicle} />)

		expect(screen.getByText('2024')).toBeInTheDocument()
	})

	it('should render mileage feature when mileage exists', () => {
		render(<NewVehicleCard vehicle={mockVehicle} />)

		expect(screen.getByText('5,000 mi')).toBeInTheDocument()
	})

	it('should render exterior color feature when ext_color_raw exists', () => {
		render(<NewVehicleCard vehicle={mockVehicle} />)

		expect(screen.getByText('Red')).toBeInTheDocument()
	})

	it('should render exterior color swatch when ext_color exists', () => {
		render(<NewVehicleCard vehicle={mockVehicle} />)

		const swatches = screen.getAllByTitle('Red')
		expect(swatches.length).toBeGreaterThan(0)
	})

	it('should render interior color swatch when int_color exists', () => {
		render(<NewVehicleCard vehicle={mockVehicle} />)

		const swatches = screen.getAllByTitle('Black')
		expect(swatches.length).toBeGreaterThan(0)
	})

	it('should render Carfax logo when both carfax_url and carfax_icon_url exist', () => {
		// Only test if both carfax_url and carfax_icon_url are present in mock data
		expect(mockVehicle.carfax_url).toBeTruthy()
		expect(mockVehicle.carfax_icon_url).toBeTruthy()

		render(<NewVehicleCard vehicle={mockVehicle} />)

		const carfaxImage = screen.getByAltText('CARFAX')
		expect(carfaxImage).toBeInTheDocument()
		expect(carfaxImage).toHaveAttribute('src', 'https://example.com/carfax.png')
	})

	it('should not render logos section when no logos exist', () => {
		const vehicleWithoutLogos = {
			...mockVehicle,
			carfax_url: null,
			carfax_icon_url: null,
		}

		render(<NewVehicleCard vehicle={vehicleWithoutLogos} />)

		// Logos section should not be visible when no logos are present
		const carfaxImage = screen.queryByAltText('CARFAX')
		expect(carfaxImage).not.toBeInTheDocument()
	})

	it('should not render Carfax logo when carfax_url is missing', () => {
		const vehicleWithoutCarfaxUrl = {
			...mockVehicle,
			carfax_url: null,
		}

		render(<NewVehicleCard vehicle={vehicleWithoutCarfaxUrl} />)

		const carfaxImage = screen.queryByAltText('CARFAX')
		expect(carfaxImage).not.toBeInTheDocument()
	})

	it('should not render Carfax logo when carfax_icon_url is missing', () => {
		const vehicleWithoutCarfaxIcon = {
			...mockVehicle,
			carfax_icon_url: null,
		}

		render(<NewVehicleCard vehicle={vehicleWithoutCarfaxIcon} />)

		const carfaxImage = screen.queryByAltText('CARFAX')
		expect(carfaxImage).not.toBeInTheDocument()
	})

	it('should render action buttons from cta array', () => {
		render(<NewVehicleCard vehicle={mockVehicle} />)

		// Only check for buttons that are actually in the mock vehicle's cta array
		expect(screen.getByText('Confirm Availability')).toBeInTheDocument()
	})

	it('should render multiple CTA buttons when present in cta array', () => {
		const vehicleWithMultipleCTAs: SRPVehicle = {
			...mockVehicle,
			cta: [
				{
					cta_label: 'Confirm Availability',
					cta_type: 'form' as CTAType,
					device: 'both' as CTADevice,
					cta_conditions: [],
					cta_location: 'srp' as CTALocation,
					btn_attributes: [],
					btn_classes: [],
					btn_styles: null,
					btn_content: 'form-uuid-123',
					open_newtab: false,
				},
				{
					cta_label: 'Schedule a Test Drive',
					cta_type: 'link' as CTAType,
					device: 'both' as CTADevice,
					cta_conditions: [],
					cta_location: 'srp' as CTALocation,
					btn_attributes: [],
					btn_classes: [],
					btn_styles: null,
					btn_content: 'https://example.com/test-drive',
					open_newtab: false,
				},
				{
					cta_label: 'Estimate My Payment',
					cta_type: 'form' as CTAType,
					device: 'both' as CTADevice,
					cta_conditions: [],
					cta_location: 'srp' as CTALocation,
					btn_attributes: [],
					btn_classes: [],
					btn_styles: null,
					btn_content: 'form-uuid-456',
					open_newtab: false,
				},
			],
		}

		render(<NewVehicleCard vehicle={vehicleWithMultipleCTAs} />)

		expect(screen.getByText('Confirm Availability')).toBeInTheDocument()
		expect(screen.getByText('Schedule a Test Drive')).toBeInTheDocument()
		expect(screen.getByText('Estimate My Payment')).toBeInTheDocument()
	})

	it('should not render CTA buttons when cta array is empty', () => {
		const vehicleWithoutCTAs = {
			...mockVehicle,
			cta: [],
		}

		render(<NewVehicleCard vehicle={vehicleWithoutCTAs} />)

		expect(screen.queryByText('Confirm Availability')).not.toBeInTheDocument()
	})

	it('should handle missing optional fields gracefully', () => {
		const minimalVehicle: SRPVehicle = {
			...mockVehicle,
			title: null,
			stock_number: null,
			condition: null,
			year: null,
			mileage: null,
			ext_color_raw: null,
			ext_color: null,
			int_color: null,
			int_color_raw: null,
			carfax_icon_url: null,
			price: null,
			sale_price: null,
			retail_price: null,
			photo: null,
			photo_preview: null,
			cta: [], // Empty cta array - no buttons should render
		}
		vi.mocked(getSecureVehicleImageUrl).mockReturnValue('')

		render(<NewVehicleCard vehicle={minimalVehicle} />)

		// Should still render basic structure
		expect(screen.getByText('No image available')).toBeInTheDocument()
		expect(screen.getByText('Stock N/A')).toBeInTheDocument()
		expect(screen.getByText('Vehicle')).toBeInTheDocument()
		// No CTA buttons should render when cta array is empty
		expect(screen.queryByText('Confirm Availability')).not.toBeInTheDocument()
	})

	it('should render Swiper navigation buttons', () => {
		render(<NewVehicleCard vehicle={mockVehicle} />)

		expect(screen.getByLabelText('Previous')).toBeInTheDocument()
		expect(screen.getByLabelText('Next')).toBeInTheDocument()
	})
})

