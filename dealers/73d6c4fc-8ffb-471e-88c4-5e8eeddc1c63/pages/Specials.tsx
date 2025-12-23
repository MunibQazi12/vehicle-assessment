import { getTenantContext } from "@dealertower/lib/tenant/server-context"
import { fetchWebsiteInformation } from "@dealertower/lib/api/dealer"
import type { DealerInfo, DealerWorkHours, DealerPhoneNumber } from "@dealertower/lib/api/dealer"
import DealerCard from "../components/DealerCard"
import PageHero from "../components/PageHero"

interface DepartmentHours {
  monday: string
  tuesday: string
  wednesday: string
  thursday: string
  friday: string
  saturday: string
  sunday: string
}

interface TransformedDealer {
  name: string
  address: string
  city: string
  state: string
  zip: string
  phone: string
  salesHours: DepartmentHours
  serviceHours: DepartmentHours
  partsHours: DepartmentHours
  image: string
  serviceUrl: string
  partsUrl: string
  mapUrl: string
}

/**
 * Transform API work hours to component format
 */
function transformWorkHours(workHours: DealerWorkHours[]): {
  salesHours: DepartmentHours
  serviceHours: DepartmentHours
  partsHours: DepartmentHours
} {
  const defaultHours: DepartmentHours = {
    monday: "Closed",
    tuesday: "Closed",
    wednesday: "Closed",
    thursday: "Closed",
    friday: "Closed",
    saturday: "Closed",
    sunday: "Closed",
  }

  const salesHours = { ...defaultHours }
  const serviceHours = { ...defaultHours }
  const partsHours = { ...defaultHours }

  workHours.forEach((dept) => {
    let targetHours: DepartmentHours
    if (dept.label.toLowerCase().includes("sales")) {
      targetHours = salesHours
    } else if (dept.label.toLowerCase().includes("service")) {
      targetHours = serviceHours
    } else if (dept.label.toLowerCase().includes("parts")) {
      targetHours = partsHours
    } else {
      return
    }

    dept.value.forEach((day) => {
      const dayName = day.label.toLowerCase() as keyof DepartmentHours
      if (dayName in targetHours) {
        targetHours[dayName] = day.is_open
          ? `${day.from} - ${day.to}`
          : "Closed"
      }
    })
  })

  return { salesHours, serviceHours, partsHours }
}

/**
 * Get primary phone number for a dealer
 */
function getPrimaryPhone(phoneNumbers: DealerPhoneNumber[]): string {
  const salesPhone = phoneNumbers.find((p) =>
    p.label.toLowerCase().includes("sales")
  )
  return salesPhone?.value || phoneNumbers[0]?.value || "N/A"
}

/**
 * Transform API dealer info to component format
 */
function transformDealer(dealer: DealerInfo): TransformedDealer {
  const hours = transformWorkHours(dealer.work_hours)
  const phone = getPrimaryPhone(dealer.phone_numbers)
  
  // Generate Google Maps URL
  const fullAddress = `${dealer.address || ""} ${dealer.city || ""} ${dealer.state || ""} ${dealer.zip_code || ""}`.trim()
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`

  return {
    name: dealer.name,
    address: dealer.address || "N/A",
    city: dealer.city || "",
    state: dealer.state || "",
    zip: dealer.zip_code || "",
    phone,
    salesHours: hours.salesHours,
    serviceHours: hours.serviceHours,
    partsHours: hours.partsHours,
    image: dealer.main_photo_url || "/assets/images/dealer-placeholder.jpg",
    serviceUrl: dealer.site_url ? `${dealer.site_url}/service` : "#",
    partsUrl: dealer.site_url ? `${dealer.site_url}/parts` : "#",
    mapUrl,
  }
}

export default async function Specials() {
  // Fetch dealer group information
  const { hostname } = await getTenantContext()
  const dealerGroupInfo = await fetchWebsiteInformation(hostname)

  // Transform dealers array or create single dealer array
  const dealers: TransformedDealer[] = dealerGroupInfo
    ? dealerGroupInfo.is_dealer_group && dealerGroupInfo.dealers
      ? dealerGroupInfo.dealers.map(transformDealer)
      : [transformDealer(dealerGroupInfo)]
    : []

  return (
    <main>
      {/* Hero Section */}
      <PageHero
        title="Specials"
        subtitle="VIEW OUR DEALERSHIP LOCATIONS AND CONTACTS"
        backgroundImage="/assets/images/specials-hero.jpg"
      />

      {/* Dealers Grid */}
      <section className="bg-gray-50 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {dealers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">
                No dealer information available at this time.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {dealers.map((dealer, index) => (
                <DealerCard
                  key={`${dealer.name}-${index}`}
                  cardType="specials"
                  name={dealer.name}
                  address={dealer.address}
                  city={dealer.city}
                  state={dealer.state}
                  zip={dealer.zip}
                  image={dealer.image}
                  mapUrl={dealer.mapUrl}
                  salesPhone={dealer.phone}
                  salesHours={dealer.salesHours}
                  servicePhone={dealer.phone}
                  serviceHours={dealer.serviceHours}
                  partsPhone={dealer.phone}
                  partsHours={dealer.partsHours}
                  serviceUrl={dealer.serviceUrl}
                  partsUrl={dealer.partsUrl}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
