"use client"

import { useState } from "react"
import DealerCard from "./DealerCard"
import { Search, Car } from "lucide-react"

interface DepartmentHours {
  monday: string
  tuesday: string
  wednesday: string
  thursday: string
  friday: string
  saturday: string
  sunday: string
}

interface Dealer {
  name: string
  address: string
  city: string
  state: string
  zip: string
  phone: string
  departments: {
    [key: string]: {
      phone: string
      hours: DepartmentHours
    }
  }
  image: string
  serviceUrl: string
  partsUrl: string
  mapUrl: string
  brands: string[]
  dealerWebsite: string
}

interface DealersClientProps {
  dealers: Dealer[]
  availableBrands: string[]
  availableCities: string[]
  availableStates: string[]
}

export default function DealersClient({
  dealers,
  availableBrands,
  availableCities,
  availableStates,
}: DealersClientProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedState, setSelectedState] = useState("")
  const [selectedCity, setSelectedCity] = useState("")
  const [isBrandOpen, setIsBrandOpen] = useState(false)
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)

  // Add "All Brands" to the brands list
  const brands = ["All Brands", ...availableBrands]
  const cities = availableCities
  const states = availableStates

  // Filter dealers based on search query and filters
  const filteredDealers = dealers.filter((dealer) => {
    // Search query filter
    const matchesSearch = 
      dealer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dealer.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dealer.address.toLowerCase().includes(searchQuery.toLowerCase())

    // Brand filter
    const matchesBrand =
      selectedBrands.length === 0 ||
      selectedBrands.includes("All Brands") ||
      selectedBrands.some((selectedBrand) =>
        dealer.brands.some((dealerBrand) =>
          dealerBrand.toLowerCase() === selectedBrand.toLowerCase()
        )
      )

    // State filter
    const matchesState = !selectedState || dealer.state === selectedState

    // City filter
    const matchesCity = !selectedCity || dealer.city === selectedCity

    return matchesSearch && matchesBrand && matchesState && matchesCity
  })

  const handleBrandToggle = (brand: string) => {
    if (brand === "All Brands") {
      setSelectedBrands([])
    } else {
      setSelectedBrands((prev) => {
        let newBrands = prev.filter((b) => b !== "All Brands")
        if (newBrands.includes(brand)) {
          newBrands = newBrands.filter((b) => b !== brand)
        } else {
          newBrands = [...newBrands, brand]
        }
        return newBrands.length === 0 ? [] : newBrands
      })
    }
  }

  return (
    <>
      {/* Search and Filter Section */}
      <section className="bg-white py-8 sticky top-16 z-40 border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar - Always Visible */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, city, or address..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-300 rounded-xl text-gray-700 font-body placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#72c6f5] focus:border-transparent"
                />
              </div>
            </div>

            {/* Mobile Filter Button */}
            <button
              onClick={() => setIsFilterModalOpen(true)}
              className="lg:hidden px-6 py-3.5 bg-[#151B49] text-white rounded-xl font-body font-semibold hover:bg-[#1a2055] transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              Filters
            </button>

            {/* Desktop Filters */}
            <div className="hidden lg:flex gap-4">
              {/* Brand Filter */}
              <div className="relative min-w-[200px]">
                <button
                  onClick={() => setIsBrandOpen(!isBrandOpen)}
                  className="w-full px-4 py-3.5 bg-white border border-gray-300 rounded-xl text-left text-gray-700 font-body flex items-center justify-between hover:border-gray-400 transition-colors"
                >
                  <span>
                    {selectedBrands.length === 0 || selectedBrands.includes("All Brands")
                      ? "All Brands"
                      : `${selectedBrands.length} selected`}
                  </span>
                  <svg
                    className={`w-5 h-5 text-gray-500 transition-transform ${isBrandOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isBrandOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto z-50">
                    {brands.map((brand) => (
                      <label
                        key={brand}
                        className="flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                      >
                        <input
                          type="checkbox"
                          checked={
                            brand === "All Brands"
                              ? selectedBrands.length === 0 || selectedBrands.includes("All Brands")
                              : selectedBrands.includes(brand)
                          }
                          onChange={() => handleBrandToggle(brand)}
                          className="w-4 h-4 text-[#72c6f5] border-gray-300 rounded focus:ring-[#72c6f5]"
                        />
                        <span className="ml-3 font-body text-gray-900">{brand}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* City Filter */}
              <div className="relative min-w-[180px]">
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full px-4 py-3.5 bg-white border border-gray-300 rounded-xl text-gray-700 font-body appearance-none focus:outline-none focus:ring-2 focus:ring-[#72c6f5] focus:border-transparent hover:border-gray-400 transition-colors cursor-pointer"
                >
                  <option value="">All Cities</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
                <svg
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {/* State Filter */}
              <div className="relative min-w-[150px]">
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="w-full px-4 py-3.5 bg-white border border-gray-300 rounded-xl text-gray-700 font-body appearance-none focus:outline-none focus:ring-2 focus:ring-[#72c6f5] focus:border-transparent hover:border-gray-400 transition-colors cursor-pointer"
                >
                  <option value="">All States</option>
                  {states.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
                <svg
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Active Filters Display */}
          {(selectedBrands.length > 0 || selectedCity || selectedState) && (
            <div className="mt-4 flex flex-wrap gap-2">
              {selectedBrands.map((brand) => (
                <span
                  key={brand}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#72c6f5] text-white rounded-full text-sm font-body"
                >
                  {brand}
                  <button
                    onClick={() => handleBrandToggle(brand)}
                    className="hover:bg-white hover:bg-opacity-20 rounded-full p-0.5"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ))}
              {selectedCity && (
                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#72c6f5] text-white rounded-full text-sm font-body">
                  {selectedCity}
                  <button
                    onClick={() => setSelectedCity("")}
                    className="hover:bg-white hover:bg-opacity-20 rounded-full p-0.5"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              )}
              {selectedState && (
                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#72c6f5] text-white rounded-full text-sm font-body">
                  {selectedState}
                  <button
                    onClick={() => setSelectedState("")}
                    className="hover:bg-white hover:bg-opacity-20 rounded-full p-0.5"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Mobile Filter Modal */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden">
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[80vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="font-sans font-bold text-lg text-gray-900">Filters</h3>
              <button
                onClick={() => setIsFilterModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Filter Options */}
            <div className="px-6 py-6 space-y-6">
              {/* Brand Section */}
              <div>
                <label className="block font-body text-gray-900 text-sm font-medium mb-3">Brand</label>
                <div className="relative">
                  <svg
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <button
                    onClick={() => setIsBrandOpen(!isBrandOpen)}
                    className="w-full px-4 py-3.5 bg-white border border-gray-300 rounded-xl text-left text-gray-700 font-body flex items-center justify-between hover:border-gray-400 transition-colors"
                  >
                    <span className="pl-8">
                      {selectedBrands.length === 0 || selectedBrands.includes("All Brands")
                        ? "All Brands"
                        : `${selectedBrands.length} selected`}
                    </span>
                    <svg
                      className={`w-5 h-5 text-gray-500 transition-transform ${isBrandOpen ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {isBrandOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto z-50">
                      {brands.map((brand) => (
                        <label
                          key={brand}
                          className="flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                        >
                          <input
                            type="checkbox"
                            checked={
                              brand === "All Brands"
                                ? selectedBrands.length === 0 || selectedBrands.includes("All Brands")
                                : selectedBrands.includes(brand)
                            }
                            onChange={() => handleBrandToggle(brand)}
                            className="w-4 h-4 text-[#72c6f5] border-gray-300 rounded focus:ring-[#72c6f5]"
                          />
                          <span className="ml-3 font-body text-gray-900">{brand}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* City Section */}
              <div>
                <label className="block font-body text-gray-900 text-sm font-medium mb-3">City</label>
                <div className="relative">
                  <svg
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full pl-12 pr-10 py-3.5 bg-white border border-gray-300 rounded-xl text-gray-700 font-body appearance-none focus:outline-none focus:ring-2 focus:ring-[#72c6f5] focus:border-transparent hover:border-gray-400 transition-colors cursor-pointer"
                  >
                    <option value="">All Cities</option>
                    {cities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                  <svg
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* State Section */}
              <div>
                <label className="block font-body text-gray-900 text-sm font-medium mb-3">State</label>
                <div className="relative">
                  <svg
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <select
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    className="w-full pl-12 pr-10 py-3.5 bg-white border border-gray-300 rounded-xl text-gray-700 font-body appearance-none focus:outline-none focus:ring-2 focus:ring-[#72c6f5] focus:border-transparent hover:border-gray-400 transition-colors cursor-pointer"
                  >
                    <option value="">All States</option>
                    {states.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                  <svg
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Apply Button */}
            <div className="px-6 pb-6">
              <button
                onClick={() => setIsFilterModalOpen(false)}
                className="w-full px-6 py-4 bg-[#151B49] text-white rounded-xl font-body font-semibold hover:bg-[#1a2055] transition-colors text-base"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dealership Cards */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredDealers.length === 0 ? (
            <div className="text-center py-20">
              <Car className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="font-sans font-bold text-xl text-gray-600 mb-2">
                No dealers found
              </h3>
              <p className="font-body text-gray-500">
                Try adjusting your search or filter criteria
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDealers.map((dealer, index) => (
                <DealerCard
                  key={index}
                  cardType="dealer"
                  name={dealer.name}
                  address={dealer.address}
                  city={dealer.city}
                  state={dealer.state}
                  zip={dealer.zip}
                  image={dealer.image}
                  mapUrl={dealer.mapUrl}
                  departments={dealer.departments}
                  dealerWebsite={dealer.dealerWebsite}
                  serviceUrl={dealer.serviceUrl}
                  partsUrl={dealer.partsUrl}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
