import Image from "next/image"
import PageHero from "../components/PageHero"
import { fetchWebsiteInformation } from "@dealertower/lib/api/dealer"
import { getStateFullName } from "@dealertower/lib/utils/states"

export default async function GeeGrant() {
	// Always fetch from geeautomotive.com for Gee Grant statistics
	const dealerInfo = await fetchWebsiteInformation("www.geeautomotive.com")

	// Calculate stats from dealer info
	const dealerCount = dealerInfo?.dealers?.length || 0
	const statesSet = new Set(dealerInfo?.dealers?.map(d => d.state).filter(Boolean))
	const stateCount = statesSet.size

	// Format state names for display (e.g., "Oregon, Washington, Idaho, and Arizona")
	const stateNames = Array.from(statesSet).map(abbr => getStateFullName(abbr)).sort()
	const stateList = stateNames.length > 1
		? stateNames.slice(0, -1).join(", ") + ", and " + stateNames[stateNames.length - 1]
		: stateNames[0] || "multiple states"

	// Get unique manufacturers across all dealers
	const manufacturersSet = new Set<string>()
	dealerInfo?.dealers?.forEach(dealer => {
		dealer.manufactures?.forEach(m => manufacturersSet.add(m))
	})
	const manufacturerCount = manufacturersSet.size
	return (
		<>
			<main>
				{/* Hero Section */}
				<PageHero title="Gee Grant Apprenticeship Program" backgroundImage="https://cdn.dealertower.com/website-media/content/73d6c4fc-8ffb-471e-88c4-5e8eeddc1c63/grant-hero.webp" />

				{/* Who is Gee? Section */}
				<section className="py-12 md:py-16 lg:py-20 bg-white">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="text-center mb-12">
							<p className="font-body text-[#72c6f5] text-sm uppercase tracking-wide mb-3">#GrowWithGee</p>
							<h2 className="font-sans font-bold text-[#151B49] text-3xl sm:text-4xl mb-6">Who is Gee?</h2>
							<p className="font-body text-gray-700 text-lg max-w-3xl mx-auto">
								Thinking about a career as a Certified Automotive Technician? - The Gee Grant Apprenticeship Program
								will get you there!
							</p>
						</div>

						{/* Stats Grid */}
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
							{/* 2000+ Employees */}
							<div className="text-center">
								<div className="flex justify-center mb-4">
									<svg className="w-16 h-16 text-[#72c6f5]" fill="currentColor" viewBox="0 0 24 24">
										<path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z" />
									</svg>
								</div>
								<p className="font-sans font-bold text-[#151B49] text-xl mb-1">2000+ EMPLOYEES</p>
							</div>

							{/* Dealerships */}
							<div className="text-center">
								<div className="flex justify-center mb-4">
									<svg className="w-16 h-16 text-[#72c6f5]" fill="currentColor" viewBox="0 0 24 24">
										<path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2z" />
									</svg>
								</div>
								<p className="font-sans font-bold text-[#151B49] text-xl mb-1">{dealerCount} DEALERSHIPS</p>
							</div>

							{/* States */}
							<div className="text-center">
								<div className="flex justify-center mb-4">
									<svg className="w-16 h-16 text-[#72c6f5]" fill="currentColor" viewBox="0 0 24 24">
										<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
									</svg>
								</div>
								<p className="font-sans font-bold text-[#151B49] text-xl mb-1">{stateCount} STATES</p>
							</div>

							{/* Manufacturers */}
							<div className="text-center">
								<div className="flex justify-center mb-4">
									<svg className="w-16 h-16 text-[#72c6f5]" fill="currentColor" viewBox="0 0 24 24">
										<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
										<circle cx="12" cy="12" r="3" />
									</svg>
								</div>
								<p className="font-sans font-bold text-[#151B49] text-xl mb-1">{manufacturerCount} MANUFACTURERS</p>
							</div>
						</div>

						<p className="font-body text-gray-700 text-base leading-relaxed text-center max-w-5xl mx-auto">
							Gee Automotive, along with the subsidiary Tonkin Family of Dealerships, has been selling and servicing
							vehicles in the Northwest since 1956. With 2000+ employees working at {dealerCount} dealerships in {stateList}, Gee Automotive is one of the largest employers in the State of Oregon. Gee
							Automotive is also recognized as one of the Top 20 Best Companies to Work for in Washington and Top 100 in
							Oregon. We&apos;re also noted as one of the Fastest Growing Businesses in Oregon and Washington.
						</p>
					</div>
				</section>

				{/* The Gee Automotive Vision */}
				<section className="py-12 md:py-16 lg:py-20 bg-gray-50">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="text-center mb-12">
							<h2 className="font-sans font-bold text-[#151B49] text-3xl sm:text-4xl mb-6">
								The Gee Automotive Vision
							</h2>
							<p className="font-body text-gray-700 text-lg max-w-3xl mx-auto">
								The Gee Automotive vision is simple: to create industry-leading value for everyone, including our
								customers, team members, and investors, to bring us, as close to be the premier dealership group in the
								country.
							</p>
						</div>

						{/* Vision Grid */}
						<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
							{/* Team */}
							<div className="text-center">
								<div className="flex justify-center mb-4">
									<svg className="w-12 h-12 text-[#72c6f5]" fill="currentColor" viewBox="0 0 24 24">
										<path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
									</svg>
								</div>
								<p className="font-sans font-bold text-[#151B49] text-sm uppercase mb-2">TEAM</p>
								<p className="font-body text-gray-600 text-xs">We are greater working together</p>
							</div>

							{/* Trust */}
							<div className="text-center">
								<div className="flex justify-center mb-4">
									<svg className="w-12 h-12 text-[#72c6f5]" fill="currentColor" viewBox="0 0 24 24">
										<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
									</svg>
								</div>
								<p className="font-sans font-bold text-[#151B49] text-sm uppercase mb-2">TRUST</p>
								<p className="font-body text-gray-600 text-xs">We rely on each other</p>
							</div>

							{/* Excellence */}
							<div className="text-center">
								<div className="flex justify-center mb-4">
									<svg className="w-12 h-12 text-[#72c6f5]" fill="currentColor" viewBox="0 0 24 24">
										<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
									</svg>
								</div>
								<p className="font-sans font-bold text-[#151B49] text-sm uppercase mb-2">EXCELLENCE</p>
								<p className="font-body text-gray-600 text-xs">We are in it to be industry best</p>
							</div>

							{/* Family */}
							<div className="text-center">
								<div className="flex justify-center mb-4">
									<svg className="w-12 h-12 text-[#72c6f5]" fill="currentColor" viewBox="0 0 24 24">
										<path d="M12 5.9c1.16 0 2.1.94 2.1 2.1s-.94 2.1-2.1 2.1S9.9 9.16 9.9 8s.94-2.1 2.1-2.1m0 9c2.97 0 6.1 1.46 6.1 2.1v1.1H5.9V17c0-.64 3.13-2.1 6.1-2.1M12 4C9.79 4 8 5.79 8 8s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 9c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4z" />
									</svg>
								</div>
								<p className="font-sans font-bold text-[#151B49] text-sm uppercase mb-2">FAMILY</p>
								<p className="font-body text-gray-600 text-xs">We support our team</p>
							</div>

							{/* Integrity */}
							<div className="text-center">
								<div className="flex justify-center mb-4">
									<svg className="w-12 h-12 text-[#72c6f5]" fill="currentColor" viewBox="0 0 24 24">
										<path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4.1L12 1z" />
									</svg>
								</div>
								<p className="font-sans font-bold text-[#151B49] text-sm uppercase mb-2">INTEGRITY</p>
								<p className="font-body text-gray-600 text-xs">We support our team</p>
							</div>

							{/* Learning */}
							<div className="text-center">
								<div className="flex justify-center mb-4">
									<svg className="w-12 h-12 text-[#72c6f5]" fill="currentColor" viewBox="0 0 24 24">
										<path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h16v-3L12 3z" />
									</svg>
								</div>
								<p className="font-sans font-bold text-[#151B49] text-sm uppercase mb-2">LEARNING</p>
								<p className="font-body text-gray-600 text-xs">We strive to improve</p>
							</div>
						</div>
					</div>
				</section>

				{/* Why Become a Certified Automotive Technician */}
				<section className="py-12 md:py-16 lg:py-20 bg-gradient-to-r from-[#4a5568] to-[#2d3748]">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
							<div>
								<h2 className="font-sans font-bold text-white text-3xl sm:text-4xl mb-6">
									Why Become a Certified Automotive Technician?
								</h2>
								<p className="font-body text-white/90 text-base leading-relaxed">
									Certified Automotive Technicians are in high demand and can expect to start earning money much more
									quickly than students who pursue 4 year degrees. Automotive Technicians get on-the-job training in
									just 2 years and the average starting salary in Oregon is over $40,000 per year. Successful Automotive
									Technicians have the ability to grow into Technician also allows for further education and career
									development. After your initial schooling, you will be a dealership Technician. Many of our dealership
									Technicians further their career by getting certifications like Master Technician, Service Advisor or
									Service Manager. There are many paths to follow in a career as a Certified Automotive Technician, and
									your path will depend on where your passion and strengths lie. Cars are constantly changing and so are
									vehicles. You will spend a large part of your future keeping up with recalls, updates, and so much
									more.
								</p>
							</div>
							<div className="flex justify-center">
								<div className="relative rounded-2xl shadow-2xl w-full max-w-md aspect-[4/3] overflow-hidden">
									<Image
										src="https://cdn.dealertower.com/website-media/content/73d6c4fc-8ffb-471e-88c4-5e8eeddc1c63/tech1.webp"
										alt="Automotive Technician at Work"
										fill
										className="object-cover"
									/>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* What is the Gee Grant */}
				<section className="py-12 md:py-16 lg:py-20 bg-white">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="text-center mb-12">
							<h2 className="font-sans font-bold text-[#151B49] text-3xl sm:text-4xl mb-2">
								What is the <span className="text-[#72c6f5]">Gee Grant?</span>
							</h2>
						</div>

						<div className="mb-12">
							<p className="font-body text-gray-700 text-base leading-relaxed mb-4">
								The GeeGrant is a tuition assistance program for continuing education with an accredited Technician
								Training School. With the GeeGrant, we will invest in your future by providing the tools, tuition
								reimbursement, and support you need to achieve your goal of becoming a Certified Automotive Technician.
							</p>
							<p className="font-body text-gray-700 text-base leading-relaxed mb-4">
								Students can earn a certificate and become a Certified Automotive Technician through one of two
								Apprentice Degree (ASE) Degree in Automotive Technology from Mount Hood Community College. The GeeGrant
								Program pays out over 5 years, 1st school year is looking for the dealership. Employees will have access
								to continued education to augment Master Certification for B-2 years following schools tuition free.
							</p>
							<p className="font-body text-gray-700 text-base leading-relaxed">
								There are two approved program options:
							</p>
						</div>

						{/* Programs Grid */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
							{/* Ford ASSET Program */}
							<div className="bg-gray-50 rounded-lg p-8">
								<h3 className="font-sans font-bold text-[#151B49] text-2xl mb-4">Ford ASSET Program</h3>
								<p className="font-body text-gray-700 text-base leading-relaxed mb-6">
									Students in the Ford ASSET Program will spend 4 months of their schooling learning full-time at Tonkin
									Hillsboro Ford getting real-world experience after an initial grounding period in the classroom.
								</p>
								<p className="font-body text-gray-700 text-base leading-relaxed mb-6">
									Graduates of the Ford ASSET Program will go on to work full-time at Tonkin Hillsboro Ford earning top
									dollar on their own certification-based pay scale.
								</p>
								<ul className="space-y-2">
									<li className="flex items-start gap-2">
										<svg
											className="w-5 h-5 text-[#72c6f5] mt-0.5 flex-shrink-0"
											fill="currentColor"
											viewBox="0 0 24 24"
										>
											<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
										</svg>
										<span className="font-body text-gray-700 text-sm">A-Level Techs: $35 / Hour</span>
									</li>
									<li className="flex items-start gap-2">
										<svg
											className="w-5 h-5 text-[#72c6f5] mt-0.5 flex-shrink-0"
											fill="currentColor"
											viewBox="0 0 24 24"
										>
											<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
										</svg>
										<span className="font-body text-gray-700 text-sm">B-Level Techs: $55 / Hour</span>
									</li>
								</ul>
							</div>

							{/* MOPAR Career Program */}
							<div className="bg-gray-50 rounded-lg p-8">
								<h3 className="font-sans font-bold text-[#151B49] text-2xl mb-4">MOPAR Career Program (MCAP)</h3>
								<p className="font-body text-gray-700 text-base leading-relaxed mb-6">
									Students in the MCAP program will spend 4 months of their schooling learning full-time at the Tonkin
									CJDRF in Milwaukie, OR getting real-world experience after an initial grounding period in the
									classroom. OR paid to $15/hour while in their school program - full paid to the ground.
								</p>
								<p className="font-body text-gray-700 text-base leading-relaxed mb-6">
									Graduates of the MCAP program will go on to work full-time at Tonkin CJDRF earning top dollar on their
									own certification-based pay scale. Students who graduate from the MCAP program will graduate as FCA
									Level 1.
								</p>
								<ul className="space-y-2">
									<li className="flex items-start gap-2">
										<svg
											className="w-5 h-5 text-[#72c6f5] mt-0.5 flex-shrink-0"
											fill="currentColor"
											viewBox="0 0 24 24"
										>
											<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
										</svg>
										<span className="font-body text-gray-700 text-sm">FCA Level 1: $35 / Hour</span>
									</li>
									<li className="flex items-start gap-2">
										<svg
											className="w-5 h-5 text-[#72c6f5] mt-0.5 flex-shrink-0"
											fill="currentColor"
											viewBox="0 0 24 24"
										>
											<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
										</svg>
										<span className="font-body text-gray-700 text-sm">FCA Level 4: $55 / Hour</span>
									</li>
									<li className="flex items-start gap-2">
										<svg
											className="w-5 h-5 text-[#72c6f5] mt-0.5 flex-shrink-0"
											fill="currentColor"
											viewBox="0 0 24 24"
										>
											<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
										</svg>
										<span className="font-body text-gray-700 text-sm">FCA Level 5: $65 / Hour</span>
									</li>
								</ul>
							</div>
						</div>
					</div>
				</section>

				{/* Post Program Career Development */}
				<section className="py-12 md:py-16 lg:py-20 bg-gray-50">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
							<div>
								<h2 className="font-sans font-bold text-[#151B49] text-3xl sm:text-4xl mb-6">
									Post Program Career Development
								</h2>
								<p className="font-body text-gray-700 text-base leading-relaxed">
									After graduating as a Certified Automotive Technician, employees at Gee Automotive will be encouraged
									to help technicians continue their education and achieve master certifications.
								</p>
							</div>
							<div className="flex justify-center">
								<div className="relative rounded-2xl shadow-xl w-full max-w-md aspect-[4/3] overflow-hidden">
									<Image
										src="https://cdn.dealertower.com/website-media/content/73d6c4fc-8ffb-471e-88c4-5e8eeddc1c63/worker2.webp"
										alt="Technician in Training"
										fill
										className="object-cover"
									/>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Gee Automotive Benefits */}
				<section className="py-12 md:py-16 lg:py-20 bg-white">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<h2 className="font-sans font-bold text-[#151B49] text-3xl sm:text-4xl mb-8 text-center">
							Gee Automotive Benefits
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
							<div>
								<p className="font-body text-gray-700 text-base leading-relaxed">
									The GeeGrant is a tuition assistance program for continuing education with an accredited Technician
									Training School. With the GeeGrant, we will invest in your future by providing the tools, tuition
									reimbursement, and support you need to achieve your goal of becoming a Certified Automotive
									Technician.
								</p>
							</div>
							<div>
								<p className="font-body text-gray-700 text-base leading-relaxed">
									Employees at Gee Automotive enjoy many benefits that enable single dealership-type offers like company
									paid long- and short-term disability, an Employee Assistance Program (EAP), and most importantly a
									team-oriented culture of excellence and trust which pushes us all to be our best every day coverage.
								</p>
							</div>
						</div>
					</div>
				</section>
			</main>
		</>
	)
}
