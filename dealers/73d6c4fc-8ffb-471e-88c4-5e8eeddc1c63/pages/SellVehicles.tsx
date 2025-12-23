"use client"

import { useState } from "react"
import Image from "next/image"
import { Button, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@dealertower/components/ui"
import { Star } from "lucide-react"

export default function SellVehicles() {
  const [activeTab, setActiveTab] = useState<"plate" | "vin">("plate")

  return (
    <div className="font-body bg-white">
      <div>
        {/* Hero Section with Form */}
        <section className="relative h-[500px] md:h-[600px]">
          <Image
            src="/images/imgi-35-nop-background-memorial-3.webp"
            alt="Sell your vehicle hero background"
            fill
            priority
            fetchPriority="high"
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/30" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center w-full">
              {/* Left Content */}
              <div className="text-white">
                <h1 className="font-sans font-bold text-3xl md:text-4xl lg:text-5xl mb-4">
                  GET A REAL OFFER IN MINUTES
                </h1>
                <p className="text-lg md:text-xl font-light">We make selling your car fast and easy.</p>
              </div>

              {/* Right Form */}
              <div className="bg-white rounded-lg p-6 md:p-8 shadow-lg">
                <h3 className="font-sans font-semibold text-[#151B49] text-center text-lg mb-4">
                  Enter Your Vehicle Information
                </h3>

                {/* Tabs */}
                <div className="flex border-b border-gray-200 mb-6">
                  <button
                    onClick={() => setActiveTab("plate")}
                    className={`flex-1 pb-3 text-sm font-medium transition-colors ${
                      activeTab === "plate" ? "text-[#72c6f5] border-b-2 border-[#72c6f5]" : "text-gray-500"
                    }`}
                  >
                    LICENSE PLATE
                  </button>
                  <button
                    onClick={() => setActiveTab("vin")}
                    className={`flex-1 pb-3 text-sm font-medium transition-colors ${
                      activeTab === "vin" ? "text-[#72c6f5] border-b-2 border-[#72c6f5]" : "text-gray-500"
                    }`}
                  >
                    VIN
                  </button>
                </div>

                {/* Form Fields */}
                <form data-form-id="83c205bd-4d61-4c81-a28d-b75deb38bfcb">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs text-gray-600 mb-2 uppercase">
                        {activeTab === "plate" ? "License Plate" : "VIN"}
                      </label>
                      <Input placeholder={activeTab === "plate" ? "" : "Enter VIN"} className="w-full" />
                    </div>

                    <div>
                      <label className="block text-xs text-gray-600 mb-2 uppercase">State</label>
                      <Select>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Choose your state" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="OR">Oregon</SelectItem>
                          <SelectItem value="WA">Washington</SelectItem>
                          <SelectItem value="CA">California</SelectItem>
                          <SelectItem value="ID">Idaho</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button className="w-full bg-[#151B49] hover:bg-[#1a2055] text-white font-semibold py-6 rounded-md">
                      NEXT
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 md:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-sans font-bold text-[#151B49] text-3xl md:text-4xl text-center mb-4">HOW IT WORKS</h2>
            <p className="text-gray-700 text-center text-lg mb-12">
              Trade in or sell your vehicle to <span className="font-semibold">Tonkin Buy Center</span> in just a few
              easy steps.
            </p>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Illustration */}
              <div className="flex justify-center">
                <div className="relative w-full max-w-md aspect-square">
                  <Image src="/assets/images/imgi-5-img3.webp" alt="Buy Center Process Illustration" fill className="object-contain" />
                </div>
              </div>

              {/* Steps */}
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="font-sans font-bold text-2xl text-[#151B49]">1</div>
                  </div>
                  <div>
                    <h3 className="font-sans font-bold text-[#151B49] text-xl mb-2">GET IN TOUCH</h3>
                    <p className="text-gray-700">Let us know the condition and options of your vehicle</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="font-sans font-bold text-2xl text-[#151B49]">2</div>
                  </div>
                  <div>
                    <h3 className="font-sans font-bold text-[#151B49] text-xl mb-2">GET AN OFFER</h3>
                    <p className="text-gray-700">Our specialists will inspect your vehicle for any issues.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="font-sans font-bold text-2xl text-[#151B49]">3</div>
                  </div>
                  <div>
                    <h3 className="font-sans font-bold text-[#151B49] text-xl mb-2">GET PAID</h3>
                    <p className="text-gray-700">
                      Upon your vehicle passing inspection, we&apos;ll cut you a check and handle the DMV paperwork!
                    </p>
                  </div>
                </div>

                <a href="https://tonkinbuycenter.com/instant-cash-offer/" target="_blank" rel="noopener noreferrer">
                  <Button className="bg-[#72c6f5] hover:bg-[#5ab5e4] text-white font-semibold px-8 py-6 rounded-md">
                    BEGIN NOW
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Section */}
        <section className="py-16 md:py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Text Content */}
              <div>
                <h2 className="font-sans font-bold text-[#151B49] text-3xl md:text-4xl mb-6">
                  WHY CHOOSE TONKIN BUY CENTER?
                </h2>
                <div className="text-gray-700 text-base leading-relaxed space-y-4">
                  <p>
                    We&apos;re here to help you sell your car in the most enjoyable and stress-free way possible! Dive into
                    our friendly and simple process designed with your convenience in mind.{" "}
                    <span className="font-bold">MAXIMIZE YOUR VALUE. MINIMIZE THE HASSLE!</span>
                  </p>
                  <p className="font-semibold">Selling made simple with Tonkin Buy Center!</p>
                </div>
              </div>

              {/* Video */}
              <div className="relative rounded-lg overflow-hidden shadow-lg aspect-video">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/q-c8R3Xa9wA"
                  title="Tonkin Buy Center Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </section>

        {/* Three Cards Section */}
        <section className="py-16 md:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Card 1 */}
              <div className="bg-gray-50 rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                <div className="aspect-[4/3] overflow-hidden relative">
                  <Image src="/assets/images/imgi-7-b1.jpg" alt="Why Sell Us Your Car" fill className="object-cover" />
                </div>
                <div className="p-6 text-center">
                  <h3 className="font-sans font-bold text-[#151B49] text-lg">WHY SELL US YOUR CAR</h3>
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-gray-50 rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                <div className="aspect-[4/3] overflow-hidden relative">
                  <Image
                    src="/assets/images/imgi-6-b2.jpg"
                    alt="What's Needed to Sell Your Car"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="font-sans font-bold text-[#151B49] text-lg">WHAT&apos;S NEEDED TO SELL YOUR CAR</h3>
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-gray-50 rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                <div className="aspect-[4/3] overflow-hidden relative">
                  <Image src="/assets/images/imgi-8-b3.jpg" alt="Instant Cash Offer" fill className="object-cover" />
                </div>
                <div className="p-6 text-center">
                  <h3 className="font-sans font-bold text-[#151B49] text-lg">INSTANT CASH OFFER</h3>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Customer Reviews Section */}
        <section className="py-16 md:py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-sans font-bold text-[#151B49] text-3xl md:text-4xl text-center mb-12">
              CUSTOMER REVIEWS
            </h2>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Left Image */}
              <div className="rounded-lg overflow-hidden shadow-lg relative aspect-[300/225]">
                <Image
                  src="/assets/images/imgi-42-hero-buy-center-edited-300x225.webp"
                  alt="Happy Customer"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Right Reviews */}
              <div className="space-y-8">
                {/* Review 1 */}
                <div className="bg-white rounded-lg p-6 shadow-md">
                  <div className="flex gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-[#72c6f5] text-[#72c6f5]" />
                    ))}
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed mb-4">
                    I got an offer online for my car and fully expected to show up and have them change the offer to a
                    lower price because that&apos;s what most places will do, but they did not it was fast and easy and got
                    the full price I was quoted. If you are selling a car check these guys out the prices are fair.
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gray-300 rounded-full" />
                    <span className="text-sm font-medium text-gray-900">iglajiaanaker</span>
                  </div>
                </div>

                {/* Review 2 */}
                <div className="bg-white rounded-lg p-6 shadow-md">
                  <div className="flex gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-[#72c6f5] text-[#72c6f5]" />
                    ))}
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed mb-4">
                    I had such a great experience at Tonkin Buy Center! I wanted to sell a Subaru that I was leasing and
                    didn&apos;t want to deal with the hassle of selling it myself. I also didn&apos;t want to negotiate if a
                    dealership gave me a low offer. I was just looking for a fair offer where I didn&apos;t want to do caring
                    money after selling the car. Tonkin Buy Center gave me a fair offer for my car and Scott contacted
                    me within minutes of submitting the request.
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gray-300 rounded-full" />
                    <span className="text-sm font-medium text-gray-900">David Timothy</span>
                  </div>
                </div>
              </div>
            </div>

            {/* More Reviews Button */}
            <div className="text-center mt-12">
              <Button className="bg-[#72c6f5] hover:bg-[#5ab5e4] text-white font-semibold px-8 py-6 rounded-md">
                MORE REVIEWS
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
