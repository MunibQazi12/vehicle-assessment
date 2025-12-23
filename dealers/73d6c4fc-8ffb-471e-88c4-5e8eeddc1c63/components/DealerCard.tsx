"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronDown, Phone, MapPin } from "lucide-react"

interface DepartmentHours {
  monday: string
  tuesday: string
  wednesday: string
  thursday: string
  friday: string
  saturday: string
  sunday: string
}

interface Department {
  phone: string
  hours: DepartmentHours
}

interface DealerCardProps {
  // Common props
  name: string
  address: string
  city: string
  state: string
  zip: string
  image: string
  mapUrl: string

  // Department data - dynamic object with any department names
  departments?: {
    [key: string]: Department
  }
  primaryPhone?: string

  // Legacy support for hardcoded departments (optional)
  salesPhone?: string
  salesHours?: DepartmentHours
  servicePhone?: string
  serviceHours?: DepartmentHours
  partsPhone?: string
  partsHours?: DepartmentHours

  // Card type and CTAs
  cardType: "dealer" | "specials" | "service"
  dealerWebsite?: string // For dealer card "View Dealership" button
  serviceUrl?: string // For service scheduling
  partsUrl?: string
}

export default function DealerCard({
  name,
  address,
  city,
  state,
  zip,
  image,
  mapUrl,
  departments,
  salesPhone,
  salesHours,
  servicePhone,
  serviceHours,
  partsPhone,
  partsHours,
  cardType,
  dealerWebsite,
  serviceUrl,
}: DealerCardProps) {
  // Get available department keys
  const departmentKeys = departments ? Object.keys(departments) : []
  const firstDepartment = departmentKeys[0] || "sales"
  
  const [expandedSection, setExpandedSection] = useState<string | null>(
    cardType === "dealer" ? firstDepartment : null
  )

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  const formatHours = (hours: DepartmentHours) => {
    return [
      { day: "Monday", time: hours.monday },
      { day: "Tuesday", time: hours.tuesday },
      { day: "Wednesday", time: hours.wednesday },
      { day: "Thursday", time: hours.thursday },
      { day: "Friday", time: hours.friday },
      { day: "Saturday", time: hours.saturday },
      { day: "Sunday", time: hours.sunday },
    ]
  }

  const renderAccordion = (title: string, phone: string, hours: DepartmentHours, sectionKey: string) => {
    const isExpanded = expandedSection === sectionKey

    return (
      <div className="border-b border-gray-200 last:border-b-0">
        <button
          onClick={() => toggleSection(sectionKey)}
          className="w-full flex items-center justify-between py-4 px-6 hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <span className="font-sans font-bold text-[#151B49] text-sm uppercase tracking-wide">{title}:</span>
          <div
            className={`w-6 h-6 rounded-full border-2 border-[#151B49] flex items-center justify-center transition-transform duration-300 ${
              isExpanded ? "rotate-180" : ""
            }`}
          >
            <ChevronDown className="w-4 h-4 text-[#151B49]" />
          </div>
        </button>

        {isExpanded && (
          <div className="px-6 pb-6 space-y-4">
            {/* Phone Number */}
            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-[#151B49]" />
              <a
                href={`tel:${phone}`}
                className="text-[#151B49] hover:text-[#4A90E2] font-semibold transition-colors cursor-pointer"
              >
                {phone}
              </a>
            </div>

            {/* Hours */}
            <div className="space-y-2">
              {formatHours(hours).map((item) => (
                <div key={item.day} className="flex justify-between text-sm">
                  <span className="font-semibold text-gray-700">{item.day}:</span>
                  <span className="text-gray-600">{item.time}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col h-full">
      {/* Header - Dealer Name */}
      <div className="p-6 text-center border-b border-gray-200">
        <h3 className="font-sans font-bold text-[#151B49] text-xl lg:text-2xl">{name}</h3>
      </div>

      {/* Hero Image with CTA Overlay */}
      <div className="relative h-48">
        <Image src={image || "/assets/placeholder.svg"} alt={name} fill className="object-cover" />
        {cardType === "dealer" && dealerWebsite && (
          <a
            href={dealerWebsite}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-[#4A90E2] text-white px-4 py-1.5 text-sm rounded-full font-semibold hover:bg-[#357ABD] transition-colors shadow-md cursor-pointer whitespace-nowrap"
          >
            View Dealership
          </a>
        )}
      </div>

      {/* Address */}
      <div className="p-6 text-center border-b border-gray-200">
        <a
          href={mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-[#151B49] hover:text-[#4A90E2] transition-colors cursor-pointer group"
        >
          <MapPin className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <div>
            <div className="font-semibold">{address}</div>
            <div className="text-gray-600">
              {city}, {state} {zip}
            </div>
          </div>
        </a>
      </div>

      {/* Accordion Sections - Flexible content area */}
      <div className="border-b border-gray-200 flex-grow">
        {departments ? (
          // Dynamic departments from API
          departmentKeys.map((deptKey) => {
            const dept = departments[deptKey]
            const label = deptKey.charAt(0).toUpperCase() + deptKey.slice(1)
            return <div key={deptKey}>{renderAccordion(label, dept.phone, dept.hours, deptKey)}</div>
          })
        ) : (
          // Legacy hardcoded departments (fallback)
          <>
            {salesPhone && salesHours && renderAccordion("Sales", salesPhone, salesHours, "sales")}
            {(cardType === "dealer" || cardType === "service") &&
              servicePhone &&
              serviceHours &&
              renderAccordion("Service", servicePhone, serviceHours, "service")}
            {(cardType === "dealer" || cardType === "service") &&
              partsPhone &&
              partsHours &&
              renderAccordion("Parts", partsPhone, partsHours, "parts")}
          </>
        )}
      </div>

      {/* CTA Buttons Section */}
      {cardType === "specials" && (
        <div className="p-6 space-y-3">
          <a
            href="#new-vehicle-specials"
            className="block w-full bg-[#151B49] text-white text-center py-3 rounded-md font-semibold hover:bg-[#1a2055] transition-colors cursor-pointer"
          >
            New Vehicle Specials
          </a>
          <a
            href="#pre-owned-specials"
            className="block w-full border-2 border-[#151B49] text-[#151B49] text-center py-3 rounded-md font-semibold hover:bg-[#151B49] hover:text-white transition-colors cursor-pointer"
          >
            Pre-Owned Vehicle Specials
          </a>
          <a
            href="#dealership-specials"
            className="block w-full border-2 border-[#151B49] text-[#151B49] text-center py-3 rounded-md font-semibold hover:bg-[#151B49] hover:text-white transition-colors cursor-pointer"
          >
            Dealership Specials
          </a>
        </div>
      )}

      {cardType === "service" && serviceUrl && (
        <div className="p-6 space-y-3">
          <a
            href="#service-specials"
            className="block w-full bg-[#151B49] text-white text-center py-3 rounded-md font-semibold hover:bg-[#1a2055] transition-colors cursor-pointer"
          >
            Service Specials
          </a>
          <a
            href={serviceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full border-2 border-[#151B49] text-[#151B49] text-center py-3 rounded-md font-semibold hover:bg-[#151B49] hover:text-white transition-colors cursor-pointer"
          >
            Schedule Service
          </a>
        </div>
      )}

      {/* Embedded Map - Only for dealer cards - Fixed at bottom */}
      {cardType === "dealer" && (
        <div className="relative h-64 mt-auto">
          <iframe
            src={`https://maps.google.com/maps?q=${encodeURIComponent(
              `${address}, ${city}, ${state} ${zip}`,
            )}&output=embed`}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={`Map of ${name}`}
          />
          <a
            href={mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute top-4 left-4 bg-white text-[#4A90E2] px-4 py-2 rounded-md font-semibold shadow-md hover:bg-gray-50 transition-colors cursor-pointer"
          >
            View larger map
          </a>
        </div>
      )}
    </div>
  )
}
