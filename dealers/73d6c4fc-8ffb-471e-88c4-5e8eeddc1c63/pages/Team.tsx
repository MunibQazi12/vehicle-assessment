import { fetchStaffInformation } from "@dealertower/lib/api/dealer"
import { getTenantContext } from "@dealertower/lib/tenant/server-context"
import PageHero from "../components/PageHero"
import TeamGrid from "../components/TeamGrid"

export default async function Team() {
  const { hostname } = await getTenantContext()
  const staffGroups = await fetchStaffInformation(hostname)

  // If no staff data is available, show a message
  if (!staffGroups || staffGroups.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main>
          <PageHero
            title="Meet Our Team"
            backgroundImage="/assets/images/team-hero.jpg"
            subtitle="Get to know the exceptional leaders driving success across the Tonkin family of dealerships"
          />
          <section className="py-12 sm:py-16 lg:py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <p className="text-gray-600 text-lg">
                Staff information is currently being updated. Please check back soon.
              </p>
            </div>
          </section>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main>
        <PageHero
          title="Meet Our Team"
          backgroundImage="/assets/images/team-hero.jpg"
          subtitle="Get to know the exceptional leaders driving success across the Tonkin family of dealerships"
        />
        <TeamGrid staffGroups={staffGroups} />
      </main>
    </div>
  )
}
