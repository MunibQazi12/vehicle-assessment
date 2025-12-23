import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import type { FilterState } from '@dealertower/types/filters'

// Mock hooks before importing the component
vi.mock('@dealertower/lib/context/ClientSideFilteringContext', () => ({
	useClientSideFilteringContext: vi.fn(),
}))

// Mock useSearchParams before importing the component
vi.mock('next/navigation', async () => {
	const actual = await vi.importActual('next/navigation')
	return {
		...actual,
		useSearchParams: vi.fn(),
	}
})

import { SearchBar } from '../SearchBar'
import { useClientSideFilteringContext } from '@dealertower/lib/context/ClientSideFilteringContext'
import { useSearchParams } from 'next/navigation'

type MockContextValue = {
	isClientMode: boolean
	isLoading: boolean
	isPending: boolean
	currentFilters: FilterState | null
	currentSortBy: string | null
	currentOrder: "asc" | "desc" | null
	currentSearch: string | null
	vehicleData: null
	filterData: null
	error: string | null
	updateFiltersClientSide: (
		newFilters: FilterState,
		options?: {
			resetPage?: boolean
			sortBy?: string
			order?: "asc" | "desc"
			search?: string
		}
	) => Promise<void>
}

describe('SearchBar', () => {
	const SEARCH_PLACEHOLDER = 'Search make, model, or keyword'
	const mockUpdateFiltersClientSide = vi.fn().mockResolvedValue(undefined)

	const createMockContext = (overrides?: Partial<MockContextValue>): MockContextValue => ({
		isClientMode: true,
		isLoading: false,
		isPending: false,
		currentFilters: null,
		currentSortBy: null,
		currentOrder: null,
		currentSearch: null,
		vehicleData: null,
		filterData: null,
		error: null,
		updateFiltersClientSide: mockUpdateFiltersClientSide as MockContextValue['updateFiltersClientSide'],
		...overrides,
	})

	const mockContext = createMockContext()

	beforeEach(() => {
		vi.clearAllMocks()
		vi.useFakeTimers()
		vi.mocked(useClientSideFilteringContext).mockReturnValue(mockContext)
		// Default mock for useSearchParams (empty search)
		const emptySearchParams = new URLSearchParams()
		vi.mocked(useSearchParams).mockReturnValue(emptySearchParams as ReturnType<typeof useSearchParams>)
	})

	afterEach(() => {
		vi.runOnlyPendingTimers()
		vi.useRealTimers()
	})

	it('should render search input with placeholder', () => {
		render(<SearchBar />)

		const input = screen.getByPlaceholderText(SEARCH_PLACEHOLDER)
		expect(input).toBeInTheDocument()
		expect(input).toHaveAttribute('type', 'text')
	})

	it('should render search icon', () => {
		const { container } = render(<SearchBar />)

		// Search icon from lucide-react renders as SVG
		const searchIcon = container.querySelector('svg')
		expect(searchIcon).toBeInTheDocument()
	})

	it('should not render clear button when searchValue is empty', () => {
		render(<SearchBar />)

		const clearButton = screen.queryByRole('button', { name: 'Clear search' })
		expect(clearButton).not.toBeInTheDocument()
	})

	it('should render clear button when searchValue exists', () => {
		render(<SearchBar />)

		const input = screen.getByPlaceholderText(SEARCH_PLACEHOLDER)
		fireEvent.change(input, { target: { value: 'test' } })

		const clearButton = screen.getByRole('button', { name: 'Clear search' })
		expect(clearButton).toBeInTheDocument()
	})

	it('should update searchValue on input change', () => {
		render(<SearchBar />)

		const input = screen.getByPlaceholderText(SEARCH_PLACEHOLDER)
		fireEvent.change(input, { target: { value: 'toyota' } })

		expect(input).toHaveValue('toyota')
	})
	  
	it('should sync with context.currentSearch when it changes', () => {
		const { rerender } = render(<SearchBar />)

		// Update context with new search value
		vi.mocked(useClientSideFilteringContext).mockReturnValue(
			createMockContext({ currentSearch: 'honda' })
		)

		rerender(<SearchBar />)

		const input = screen.getByPlaceholderText(SEARCH_PLACEHOLDER)
		expect(input).toHaveValue('honda')
	})

	it('Should be called immediately on Enter key', () => {
		render(<SearchBar />)

		const input = screen.getByPlaceholderText(SEARCH_PLACEHOLDER)
		fireEvent.change(input, { target: { value: 'toyota' } })

		// Press Enter before debounce completes
		fireEvent.keyDown(input, { key: 'Enter' })

		// Should be called immediately (not waiting for debounce)
		expect(mockUpdateFiltersClientSide).toHaveBeenCalledWith(
			{ search: 'toyota' },
			{
				resetPage: true,
				sortBy: undefined,
				order: undefined,
				search: 'toyota',
			}
		)
	})

	it('should not trigger search if value matches context.currentSearch', async () => {
		vi.mocked(useClientSideFilteringContext).mockReturnValue(
			createMockContext({ currentSearch: 'toyota' })
		)

		render(<SearchBar />)

		const input = screen.getByPlaceholderText(SEARCH_PLACEHOLDER)
		// Set value to match context
		fireEvent.change(input, { target: { value: 'toyota' } })

		vi.advanceTimersByTime(250)

		// Should not trigger search since value matches context
		expect(mockUpdateFiltersClientSide).not.toHaveBeenCalled()
	})

	it('should handle context being null gracefully', () => {
		vi.mocked(useClientSideFilteringContext).mockReturnValue(undefined)

		render(<SearchBar />)

		const input = screen.getByPlaceholderText(SEARCH_PLACEHOLDER)
		fireEvent.change(input, { target: { value: 'toyota' } })

		vi.advanceTimersByTime(250)

		// Should not throw error, just not call updateFiltersClientSide
		expect(mockUpdateFiltersClientSide).not.toHaveBeenCalled()
	})
})

