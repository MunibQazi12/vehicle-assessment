"use client"

import { useState } from "react"
import DealerCard from "./DealerCard"
import { Car } from "lucide-react"

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
}

interface ServiceLocationsClientProps {
  dealers: Dealer[]
  availableBrands: string[]
}

export default function ServiceLocationsClient({
  dealers,
  availableBrands,
}: ServiceLocationsClientProps) {
  const [selectedBrands, setSelectedBrands] = useState<string[]>(["All"])

  // Add "All" to the brands list
  const brands = ["All", ...availableBrands]

  const toggleBrand = (brand: string) => {
    if (brand === "All") {
      setSelectedBrands(["All"])
    } else {
      setSelectedBrands((prev) => {
        const newBrands = prev.filter((b) => b !== "All")
        if (newBrands.includes(brand)) {
          const filtered = newBrands.filter((b) => b !== brand)
          return filtered.length === 0 ? ["All"] : filtered
        } else {
          return [...newBrands, brand]
        }
      })
    }
  }

  const filteredDealers = dealers.filter((dealer) => {
    if (selectedBrands.includes("All")) return true

    return selectedBrands.some((selectedBrand) =>
      dealer.brands.some((dealerBrand) =>
        dealerBrand.toLowerCase() === selectedBrand.toLowerCase()
      )
    )
  })

  return (
    <>
      {/* Brand Filter Tags */}
      <section className="bg-white border-b border-gray-200 sticky top-16 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="overflow-x-auto scrollbar-hide md:overflow-visible">
            <div className="flex md:flex-wrap gap-3 min-w-max md:min-w-0">
              {brands.map((brand) => (
                <button
                  key={brand}
                  onClick={() => toggleBrand(brand)}
                  className={`px-6 py-2.5 rounded-full font-sans font-semibold text-sm whitespace-nowrap transition-all cursor-pointer ${
                    selectedBrands.includes(brand)
                      ? "bg-[#151B49] text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {brand}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Service Cards Grid */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredDealers.length === 0 ? (
            <div className="text-center py-20">
              <Car className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="font-sans font-bold text-xl text-gray-600 mb-2">
                No service locations found
              </h3>
              <p className="font-body text-gray-500">
                Try selecting a different brand filter
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredDealers.map((dealer, index) => (
                <DealerCard
                  key={index}
                  cardType="service"
                  name={dealer.name}
                  address={dealer.address}
                  city={dealer.city}
                  state={dealer.state}
                  zip={dealer.zip}
                  image={dealer.image}
                  mapUrl={dealer.mapUrl}
                  departments={dealer.departments}
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
