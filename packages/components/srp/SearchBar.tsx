/**
 * Search Bar Component (Client Component)
 * Allows users to search vehicles by keywords with debounced real-time search
 * Uses context for client-side filtering when available
 */

"use client";

import { useState, useEffect, useRef } from "react";
import { useClientSideFilteringContext } from "@dealertower/lib/context/ClientSideFilteringContext";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

export function SearchBar() {
  const context = useClientSideFilteringContext();
  const searchParams = useSearchParams();
  
  // Get search from URL (source of truth)
  const urlSearch = searchParams.get('search') || "";
  const [searchValue, setSearchValue] = useState("");
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize and sync with URL search on mount and changes
  useEffect(() => {
    setSearchValue(urlSearch);
  }, [urlSearch]);

	// Update local state when context search changes (e.g., from URL on initial load)
	useEffect(() => {
		if (context?.currentSearch !== undefined && context?.currentSearch !== searchValue) {
			setSearchValue(context.currentSearch || "");
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [context?.currentSearch]); // Only sync from context, not searchValue

	// Debounced search effect - triggers 250ms after user stops typing
	useEffect(() => {
		// Clear existing timer
		if (debounceTimerRef.current) {
			clearTimeout(debounceTimerRef.current);
		}

		// Don't trigger if value matches current context search
		if (searchValue === (context?.currentSearch || "")) {
			return;
		}

		// Set new timer for debounced search
		debounceTimerRef.current = setTimeout(() => {
			handleSearch(searchValue);
		}, 250);

		// Cleanup timer on unmount or when searchValue changes
		return () => {
			if (debounceTimerRef.current) {
				clearTimeout(debounceTimerRef.current);
			}
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchValue]); // Only depend on searchValue

	const handleSearch = (value: string) => {
		if (!context) return;

		const trimmedValue = value.trim();

		// Merge search into filters (not just as an option)
		const updatedFilters = {
			...(context.currentFilters || {}),
			...(trimmedValue ? { search: trimmedValue } : {}),
		};

		// Remove search from filters if empty
		if (!trimmedValue && updatedFilters.search) {
			delete updatedFilters.search;
		}

		// Update filters via context
		context.updateFiltersClientSide(
			updatedFilters,
			{
				resetPage: true,
				sortBy: context.currentSortBy || undefined,
				order: context.currentOrder || undefined,
				search: trimmedValue || undefined,
			}
		);
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			// Clear debounce timer and search immediately
			if (debounceTimerRef.current) {
				clearTimeout(debounceTimerRef.current);
			}
			handleSearch(searchValue);
		}
	};

	const handleClear = () => {
		setSearchValue("");
		// Search will be triggered by useEffect after clearing
	};

	return (
		<div className="relative h-[56px] flex-1 flex items-center rounded-[37px] border border-c-gray-black bg-white sm:px-10 p-[10px_10px_10px_40px]">
            <Search className="h-4 w-4 text-c-blue absolute left-4" />
			<input
				type="text"
				value={searchValue}
				onChange={(e) => setSearchValue(e.target.value)}
				onKeyDown={handleKeyDown}
				placeholder="Search make, model, or keyword"
				className="w-full h-5 text-[16px] font-normal text-[#64748B] placeholder:text-[#64748B] bg-transparent outline-none font-inter"
			/>
			{searchValue && (
				<button
					onClick={handleClear}
					className="absolute inset-y-0 right-0 flex items-center pr-4 text-zinc-400 hover:text-zinc-600"
					aria-label="Clear search"
				>
					<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
			)}
		</div>
	);
}
