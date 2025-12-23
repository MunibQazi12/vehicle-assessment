import { getTenantContext } from "@dealertower/lib/tenant/server-context"
import { fetchWebsiteInformation } from "@dealertower/lib/api/dealer"
import type { DealerInfo, DealerWorkHours, DealerPhoneNumber } from "@dealertower/lib/api/dealer"
import { standardizeBrandNames } from "@dealertower/lib/utils/text"
import ServiceLocationsClient from "../components/ServiceLocationsClient"
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

/**
 * Transform API work hours to component format
 * Dynamically loops through all departments instead of hardcoded sales/service/parts
 */
function transformWorkHours(workHours: DealerWorkHours[]): {
  [key: string]: DepartmentHours
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

  const departments: { [key: string]: DepartmentHours } = {}

  workHours.forEach((dept) => {
    const deptKey = dept.label.toLowerCase()
    const deptHours = { ...defaultHours }

    dept.value.forEach((day) => {
      const dayName = day.label.toLowerCase() as keyof DepartmentHours
      if (dayName in deptHours) {
        deptHours[dayName] = day.is_open
          ? `${formatTime(day.from)} - ${formatTime(day.to)}`
          : "Closed"
      }
    })

    departments[deptKey] = deptHours
  })

  return departments
}

/**
 * Format time from 24-hour format (HH:mm) to 12-hour format (hh:mmam/pm)
 */
function formatTime(time: string): string {
  const [hours, minutes] = time.split(":")
  const hour = parseInt(hours)
  const ampm = hour >= 12 ? "pm" : "am"
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
  return `${displayHour.toString().padStart(2, "0")}:${minutes}${ampm}`
}

/**
 * Get phone numbers grouped by department
 */
function getPhoneNumbersByDept(phoneNumbers: DealerPhoneNumber[]): {
  [key: string]: string
} {
  const phones: { [key: string]: string } = {}

  phoneNumbers.forEach((phone) => {
    const deptKey = phone.label.toLowerCase()
    phones[deptKey] = phone.value
  })

  return phones
}

/**
 * Get primary phone number (fallback to first available)
 */
function getPrimaryPhone(phoneNumbers: DealerPhoneNumber[]): string {
  if (phoneNumbers.length === 0) return "N/A"

  // Try to find sales phone first
  const salesPhone = phoneNumbers.find((p) =>
    p.label.toLowerCase().includes("sales")
  )
  if (salesPhone) return salesPhone.value

  // Fall back to first phone
  return phoneNumbers[0].value
}

/**
 * Transform API dealer info to component format
 */
function transformDealer(dealer: DealerInfo): TransformedDealer {
  const workHoursByDept = transformWorkHours(dealer.work_hours)
  const phonesByDept = getPhoneNumbersByDept(dealer.phone_numbers)
  const primaryPhone = getPrimaryPhone(dealer.phone_numbers)

  // Build departments object with phone and hours
  const departments: TransformedDealer["departments"] = {}
  Object.keys(workHoursByDept).forEach((deptKey) => {
    departments[deptKey] = {
      phone: phonesByDept[deptKey] || primaryPhone,
      hours: workHoursByDept[deptKey],
    }
  })

  // Generate Google Maps URL
  const fullAddress = `${dealer.address || ""} ${dealer.city || ""} ${dealer.state || ""} ${dealer.zip_code || ""}`.trim()
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`

  return {
    name: dealer.name,
    address: dealer.address || "N/A",
    city: dealer.city || "",
    state: dealer.state || "",
    zip: dealer.zip_code || "",
    phone: primaryPhone,
    departments,
    image: dealer.main_photo_url || "/assets/images/dealer-placeholder.jpg",
    serviceUrl: dealer.site_url ? `${dealer.site_url}/service` : "#",
    partsUrl: dealer.site_url ? `${dealer.site_url}/parts` : "#",
    mapUrl,
    brands: standardizeBrandNames(dealer.manufactures || []),
  }
}

export default async function ServiceLocations() {
  // Fetch dealer group information
  const { hostname } = await getTenantContext()
  const dealerGroupInfo = await fetchWebsiteInformation(hostname)

  // Transform dealers array or create single dealer array
  const dealers: TransformedDealer[] = dealerGroupInfo
    ? dealerGroupInfo.is_dealer_group && dealerGroupInfo.dealers
      ? dealerGroupInfo.dealers.map(transformDealer)
      : [transformDealer(dealerGroupInfo)]
    : []

  // Extract unique brands from all dealers
  const allBrands = Array.from(
    new Set(dealers.flatMap((dealer) => dealer.brands))
  ).sort()

  return (
    <main>
      {/* Hero Section */}
      <PageHero
        title="Service"
        subtitle="VIEW OUR DEALERSHIP LOCATIONS AND CONTACTS"
        backgroundImage="/assets/images/service-hero.jpg"
      />

      {/* Client Component for Interactive Filtering */}
      <ServiceLocationsClient dealers={dealers} availableBrands={allBrands} />
    </main>
  )
}
