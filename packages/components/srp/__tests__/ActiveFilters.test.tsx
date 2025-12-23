import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react';

// Mock the hooks
vi.mock('@dealertower/lib/hooks/useSelectedFilters', () => ({
	useSelectedFilters: vi.fn(),
}))

vi.mock('@dealertower/lib/hooks/useUrlState', () => ({
	useUrlState: vi.fn(),
}))

import { ActiveFilters } from '../ActiveFilters'
import type { AvailableFilter, SelectedFilter } from '@dealertower/types/api'
import { useSelectedFilters } from '@dealertower/lib/hooks/useSelectedFilters'
import { useUrlState } from '@dealertower/lib/hooks/useUrlState'


describe('ActiveFilters', () => {
	const mockToggleArrayFilter = vi.fn()
	const mockUpdateFilter = vi.fn()

	const mockAvailableFilters: AvailableFilter[] = [
		{
			name: 'condition',
			label: 'Condition',
			type: 'select',
			value: [
				{ value: 'new', label: 'New', count: 10 },
				{ value: 'used', label: 'Used', count: 20 },
				{ value: 'certified', label: 'Certified', count: 15 },
			],
		},
		{
			name: 'body',
			label: 'Body Style',
			type: 'select',
			value: [
				{ value: 'suv', label: 'SUV', count: 30 },
				{ value: 'sedan', label: 'Sedan', count: 25 },
			],
		},
		{
			name: 'price',
			label: 'Price',
			type: 'number',
			value: [0, 100000],
		},
	]

	beforeEach(() => {
		vi.clearAllMocks()
		vi.mocked(useUrlState).mockReturnValue({
			toggleArrayFilter: mockToggleArrayFilter,
			updateFilter: mockUpdateFilter,
			updateRangeFilter: vi.fn(),
			updateSorting: vi.fn(),
			clearAllFilters: vi.fn(),
			getFilterValue: vi.fn(),
			getRangeFilterValue: vi.fn(),
			isFilterValueSelected: vi.fn(),
			getCurrentFilters: vi.fn(),
			getCurrentSorting: vi.fn(),
			navigateWithFilters: vi.fn()
		})
	})

	it('should not render when there are no selected filters', () => {
		vi.mocked(useSelectedFilters).mockReturnValue([])

		const { container } = render(
			<ActiveFilters availableFilters={mockAvailableFilters} />
		)

		expect(container.firstChild).toBeNull()
	})

	it('should render heading with correct count', () => {
		const mockSelectedFilters: SelectedFilter[] = [
			{
				name: 'body',
				label: 'SUV',
				value: 'suv',
				type: 'select',
			},
			{
				name: 'body',
				label: 'Sedan',
				value: 'sedan',
				type: 'select',
			},
		]

		vi.mocked(useSelectedFilters).mockReturnValue(mockSelectedFilters)

		render(<ActiveFilters availableFilters={mockAvailableFilters} />)

		expect(screen.getByText('Applied Filters (2)')).toBeInTheDocument()
	})

	it('should render chip for each selected filter with correct label', () => {
		const mockSelectedFilters: SelectedFilter[] = [
			{
				name: 'body',
				label: 'SUV',
				value: 'suv',
				type: 'select',
			},
			{
				name: 'body',
				label: 'Sedan',
				value: 'sedan',
				type: 'select',
			},
		]

		vi.mocked(useSelectedFilters).mockReturnValue(mockSelectedFilters)

		render(<ActiveFilters availableFilters={mockAvailableFilters} />)

		expect(screen.getByText('SUV')).toBeInTheDocument()
		expect(screen.getByText('Sedan')).toBeInTheDocument()
	})

	it('should call toggleArrayFilter when clicking remove on select filter', () => {
		const mockSelectedFilters: SelectedFilter[] = [
			{
				name: 'body',
				label: 'SUV',
				value: 'suv',
				type: 'select',
			},
		]

		vi.mocked(useSelectedFilters).mockReturnValue(mockSelectedFilters)

		render(<ActiveFilters availableFilters={mockAvailableFilters} />)

		const removeButton = screen.getByRole('button', { name: /remove suv/i });
		fireEvent.click(removeButton)

		expect(mockToggleArrayFilter).toHaveBeenCalledWith('body', 'suv')
		expect(mockUpdateFilter).not.toHaveBeenCalled()
	})

	it('should call updateFilter with null when clicking remove on non-select filter', () => {
		const mockSelectedFilters: SelectedFilter[] = [
			{
				name: 'price',
				label: 'Price',
				value: { min: 10000, max: 50000 },
				type: 'number',
			},
		]

		vi.mocked(useSelectedFilters).mockReturnValue(mockSelectedFilters)

		render(<ActiveFilters availableFilters={mockAvailableFilters} />)

		const removeButton = screen.getByLabelText('Remove Price')
		fireEvent.click(removeButton)

		expect(mockUpdateFilter).toHaveBeenCalledWith('price', null)
		expect(mockToggleArrayFilter).not.toHaveBeenCalled()
	})

	it('should hide remove button for certified filter when used is also selected', () => {
		const mockSelectedFilters: SelectedFilter[] = [
			{
				name: 'condition',
				label: 'Used',
				value: 'used',
				type: 'select',
			},
			{
				name: 'condition',
				label: 'Certified',
				value: 'certified',
				type: 'select',
			},
		]

		vi.mocked(useSelectedFilters).mockReturnValue(mockSelectedFilters)

		render(<ActiveFilters availableFilters={mockAvailableFilters} />)

		// Used filter should have remove button
		expect(screen.getByLabelText('Remove Used')).toBeInTheDocument()

		// Certified filter should NOT have remove button
		expect(screen.queryByLabelText('Remove Certified')).not.toBeInTheDocument()
		expect(screen.getByText('Certified')).toBeInTheDocument()
	})
})

