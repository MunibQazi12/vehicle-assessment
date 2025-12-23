"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { X, ChevronLeft, ChevronRight } from "lucide-react"

interface VehicleSearchModalProps {
  isOpen: boolean
  onClose: () => void
  initialTab?: "bodystyle" | "price" | "location"
}

const bodyStyles = [
  { id: "cabriolet", name: "CABRIOLET", image: "/assets/convertible-car-side-view.jpg" },
  { id: "chassis", name: "CHASSIS", image: "/assets/commercial-truck-side-view.jpg" },
  { id: "coupe", name: "COUPE", image: "/assets/coupe-car-side-view.jpg" },
  { id: "hatchback", name: "HATCHBACK", image: "/assets/hatchback-car-side-view.jpg" },
  { id: "motorcycles", name: "MOTORCYCLES", image: "/assets/motorcycle-side-view.jpg" },
  { id: "sedan", name: "SEDAN", image: "/assets/sedan-car-side-view.jpg" },
  { id: "suv", name: "SUV", image: "/assets/suv-car-side-view.jpg" },
  { id: "truck", name: "TRUCK", image: "/assets/pickup-truck-side.png" },
  { id: "van", name: "VAN", image: "/assets/van-side-view.jpg" },
  { id: "wagon", name: "WAGON", image: "/assets/wagon-car-side-view.jpg" },
]

const dealerships = [
  { name: "DUCATI MOTOCORSA", url: "https://www.ducatiportland.com" },
  { name: "GENESIS OF PORTLAND", url: "https://www.genesisofportland.com" },
  { name: "GRESHAM SUBARU", url: "https://www.greshamsubaru.com" },
  { name: "RON TONKIN ACURA", url: "https://www.rontonkinacura.com" },
  { name: "RON TONKIN CHEVROLET", url: "https://www.tonkinchevrolet.com" },
  { name: "RON TONKIN CHRYSLER JEEP DODGE RAM FIAT", url: "https://www.rontonkindodge.net" },
  { name: "RON TONKIN HONDA", url: "https://www.rontonkinhonda.com" },
  { name: "RON TONKIN HYUNDAI", url: "https://www.rontonkinhyundai.com" },
  { name: "RON TONKIN KIA", url: "https://www.rontonkinkia.com" },
  { name: "RON TONKIN MAZDA", url: "https://www.rontonkinmazda.com" },
  { name: "RON TONKIN TOYOTA", url: "https://www.tonkintoyota.com" },
  { name: "TONKIN GLADSTONE HYUNDAI", url: "https://www.tonkingladstonehyundai.net" },
  { name: "TONKIN GRESHAM HONDA", url: "https://www.tonkingreshamhonda.com" },
  { name: "TONKIN HILLSBORO CHEVROLET", url: "http://www.tonkinhillsborocjdr.com" },
  { name: "TONKIN HILLSBORO CHRYSLER JEEP DODGE RAM", url: "http://www.tonkinhillsborocjdr.com" },
  { name: "TONKIN HILLSBORO FORD", url: "http://www.tonkinford.com" },
  { name: "TONKIN WILSONVILLE NISSAN", url: "https://www.tonkinwilsonvillenissan.com" },
]

export default function VehicleSearchModal({ isOpen, onClose, initialTab = "bodystyle" }: VehicleSearchModalProps) {
  const [scrollPosition, setScrollPosition] = useState(0)
  const itemWidth = 180

  const minPrice = 2990
  const maxPrice = 254773
  const [priceRange, setPriceRange] = useState([64000, 127000])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  // ESC key support for closing modal
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }

    document.addEventListener("keydown", handleEscKey)
    return () => document.removeEventListener("keydown", handleEscKey)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const scrollLeft = () => {
    setScrollPosition(Math.max(0, scrollPosition - itemWidth * 3))
  }

  const scrollRight = () => {
    setScrollPosition(Math.min(scrollPosition + itemWidth * 3, (bodyStyles.length - 5) * itemWidth))
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value.replace(/[^0-9]/g, "")) || minPrice
    setPriceRange([Math.max(minPrice, Math.min(value, priceRange[1])), priceRange[1]])
  }

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value.replace(/[^0-9]/g, "")) || maxPrice
    setPriceRange([priceRange[0], Math.min(maxPrice, Math.max(value, priceRange[0]))])
  }

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto"
      onClick={handleBackdropClick}
    >
      <div className="relative w-full max-w-6xl bg-[#EFF6FA] rounded-lg shadow-2xl my-auto max-h-[95vh] lg:max-h-[90vh] overflow-hidden flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 flex items-center gap-2 text-gray-600 hover:text-gray-900 font-sans text-sm cursor-pointer transition-colors bg-white rounded-full p-2 shadow-md"
        >
          <X className="w-5 h-5" />
          <span className="hidden sm:inline">Close</span>
        </button>

        <div className="p-4 sm:p-6 lg:p-12 overflow-y-auto flex-1">
          {initialTab === "bodystyle" && (
            <div className="space-y-8 pt-8 sm:pt-0">
              {/* Heading */}
              <div className="flex items-center justify-center gap-3 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
                  <circle cx="7" cy="17" r="2" />
                  <path d="M9 17h6" />
                  <circle cx="17" cy="17" r="2" />
                </svg>
                <h2 className="font-sans font-semibold text-xl md:text-2xl text-gray-800 text-center">
                  What kind of car do you want?
                </h2>
              </div>

              {/* Desktop Carousel */}
              <div className="hidden lg:block relative px-12">
                {scrollPosition > 0 && (
                  <button
                    onClick={scrollLeft}
                    className="absolute -left-2 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-gray-50 rounded-full p-3 shadow-lg cursor-pointer transition-all"
                  >
                    <ChevronLeft className="w-6 h-6 text-gray-700" />
                  </button>
                )}

                <div className="overflow-hidden">
                  <div
                    className="flex gap-6 transition-transform duration-300 ease-out"
                    style={{ transform: `translateX(-${scrollPosition}px)` }}
                  >
                    {bodyStyles.map((style) => (
                      <div
                        key={style.id}
                        className="flex-shrink-0 w-40 text-center cursor-pointer hover:scale-105 transition-transform"
                      >
                        <div className="bg-white rounded-xl p-4 mb-3 shadow-md relative h-20">
                          <Image
                            src={style.image || "/assets/placeholder.svg"}
                            alt={style.name}
                            fill
                            className="object-contain"
                          />
                        </div>
                        <p className="font-sans font-semibold text-sm text-gray-900">{style.name}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {scrollPosition < (bodyStyles.length - 5) * itemWidth && (
                  <button
                    onClick={scrollRight}
                    className="absolute -right-2 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-gray-50 rounded-full p-3 shadow-lg cursor-pointer transition-all"
                  >
                    <ChevronRight className="w-6 h-6 text-gray-700" />
                  </button>
                )}
              </div>

              {/* Mobile Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:hidden gap-3 sm:gap-4">
                {bodyStyles.map((style) => (
                  <div key={style.id} className="text-center cursor-pointer hover:scale-105 transition-transform">
                    <div className="bg-white rounded-xl p-3 sm:p-4 mb-2 shadow-md relative h-14 sm:h-16">
                      <Image
                        src={style.image || "/assets/placeholder.svg"}
                        alt={style.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <p className="font-sans font-semibold text-xs sm:text-sm text-gray-900">{style.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {initialTab === "price" && (
            <div className="py-4 sm:py-8 lg:py-12 space-y-6 sm:space-y-8 pt-12 sm:pt-8">
              {/* Price Input Fields */}
              <div className="flex justify-center items-center gap-2 sm:gap-4 mb-6 sm:mb-8">
                <input
                  type="text"
                  value={formatPrice(priceRange[0])}
                  onChange={handleMinPriceChange}
                  className="w-28 sm:w-32 md:w-40 px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-300 rounded text-center font-sans font-semibold text-base sm:text-lg focus:outline-none focus:border-[#72c6f5] cursor-pointer"
                />
                <input
                  type="text"
                  value={formatPrice(priceRange[1])}
                  onChange={handleMaxPriceChange}
                  className="w-28 sm:w-32 md:w-40 px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-300 rounded text-center font-sans font-semibold text-base sm:text-lg focus:outline-none focus:border-[#72c6f5] cursor-pointer"
                />
              </div>

              {/* Range Slider */}
              <div className="max-w-4xl mx-auto px-2 sm:px-4">
                <div className="relative pt-1">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                    <div className="flex-1 relative">
                      {/* Slider Track */}
                      <div className="h-2 bg-gray-300 rounded-full relative">
                        {/* Active Range */}
                        <div
                          className="absolute h-2 bg-[#72c6f5] rounded-full"
                          style={{
                            left: `${((priceRange[0] - minPrice) / (maxPrice - minPrice)) * 100}%`,
                            right: `${100 - ((priceRange[1] - minPrice) / (maxPrice - minPrice)) * 100}%`,
                          }}
                        />

                        {/* Min Handle */}
                        <input
                          type="range"
                          min={minPrice}
                          max={maxPrice}
                          step={1000}
                          value={priceRange[0]}
                          onChange={(e) =>
                            setPriceRange([Math.min(Number.parseInt(e.target.value), priceRange[1]), priceRange[1]])
                          }
                          className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#1a1a1a] [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#1a1a1a] [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-lg"
                          style={{ top: "-4px" }}
                        />

                        {/* Max Handle */}
                        <input
                          type="range"
                          min={minPrice}
                          max={maxPrice}
                          step={1000}
                          value={priceRange[1]}
                          onChange={(e) =>
                            setPriceRange([priceRange[0], Math.max(Number.parseInt(e.target.value), priceRange[0])])
                          }
                          className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#1a1a1a] [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#1a1a1a] [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-lg"
                          style={{ top: "-4px" }}
                        />
                      </div>

                      {/* Price Labels */}
                      <div className="flex justify-between mt-4 text-xs sm:text-sm text-gray-500 font-sans">
                        <span>{formatPrice(minPrice)}</span>
                        <span className="hidden sm:inline">{formatPrice(64000)}</span>
                        <span>{formatPrice(127000)}</span>
                        <span className="hidden sm:inline">{formatPrice(191000)}</span>
                        <span>{formatPrice(maxPrice)}</span>
                      </div>
                    </div>

                    {/* Go Button */}
                    <button className="cursor-pointer bg-[#72c6f5] hover:bg-[#5ab3e8] text-white font-sans font-bold px-6 sm:px-8 py-2 sm:py-3 rounded transition-colors w-full sm:w-auto">
                      Go!
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {initialTab === "location" && (
            <div className="py-4 sm:py-8 lg:py-12 pt-12 sm:pt-8">
              <div className="flex items-center justify-center gap-3 mb-8">
                <h2 className="font-sans font-semibold text-xl md:text-2xl text-gray-800 text-center">
                  Choose Your Dealership Location
                </h2>
              </div>

              <div className="max-w-6xl mx-auto px-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                  {dealerships.map((dealer, index) => (
                    <a
                      key={index}
                      href={dealer.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cursor-pointer border-2 border-[#72c6f5] rounded-full px-4 sm:px-6 py-3 sm:py-4 font-sans font-bold text-xs sm:text-sm text-gray-900 hover:bg-[#72c6f5] hover:text-white transition-all duration-200 flex items-center justify-center text-center min-h-[56px]"
                    >
                      {dealer.name}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
