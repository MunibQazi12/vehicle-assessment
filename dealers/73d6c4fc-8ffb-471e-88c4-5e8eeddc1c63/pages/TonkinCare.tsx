import Image from "next/image"
import { Wrench, Clock } from "lucide-react"

// Low-quality base64 placeholder for hero image (reduces render delay)
const heroBlurDataURL =
	"data:image/jpeg;base64,/9j/2wBDABsSFBcUERsXFhceHBsgKEIrKCUlKFE6PTBCYFVlZF9VXVtqeJmBanGQc1tdhbWGkJ6jq62rZ4C8ybqmx5moq6T/2wBDARweHigjKE4rK06kbl1upKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKT/wAARCAAKAAoDASIAAhEBAxEB/8QAFwAAAwEAAAAAAAAAAAAAAAAAAQIEBf/EAB4QAAEEAQUAAAAAAAAAAAAAAAEAAgMVERQhIzEy/8QAFAEBAAAAAAAAAAAAAAAAAAAAA//EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/ABPaSakuYeMHZWC0gx2Vhv8AKVEd/9k="

// Blur placeholder for secondary images
const secondaryBlurDataURL =
	"data:image/jpeg;base64,/9j/2wBDABsSFBcUERsXFhceHBsgKEIrKCUlKFE6PTBCYFVlZF9VXVtqeJmBanGQc1tdhbWGkJ6jq62rZ4C8ybqmx5moq6T/2wBDARweHigjKE4rK06kbl1upKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKT/wAARCAAKAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAwL/xAAeEAEAAgIBBQAAAAAAAAAAAAABABEDBAIFISMxkf/EABQBAQAAAAAAAAAAAAAAAAAAAAH/xAAWEQEBAQAAAAAAAAAAAAAAAAAAARH/2gAMAwEAAhEDEQA/AK2eq88+LlWJq6LgG3ugeZ+wsarS9qgPthacf//Z"

export default function TonkinCare() {
	return (
		<div className="min-h-screen bg-white">
			<main>
				{/* Hero Section */}
				<section className="relative h-[400px] md:h-[500px] flex items-center justify-center">
					<Image
						src="https://cdn.dealertower.com/website-media/content/73d6c4fc-8ffb-471e-88c4-5e8eeddc1c63/Tonkincare-portland-oregon-3.webp"
						alt="TonkinCare hero background"
						fill
						priority
						fetchPriority="high"
						loading="eager"
						className="object-cover object-center"
						sizes="(max-width: 640px) 640px, (max-width: 1024px) 1024px, 1920px"
						quality={60}
						placeholder="blur"
						blurDataURL={heroBlurDataURL}
					/>
					<div className="absolute inset-0 bg-black/30" />
					<div className="relative z-10 text-center px-4">
						<p className="font-sans text-white text-lg md:text-xl mb-4 tracking-wide">Introducing</p>
						<div className="relative max-w-[240px] md:max-w-[400px] lg:max-w-[500px] h-16 mx-auto mb-6">
							<Image
								src="https://cdn.dealertower.com/website-media/content/73d6c4fc-8ffb-471e-88c4-5e8eeddc1c63/Tonkin-Care-One-O-White.webp"
								alt="TonkinCare"
								fill
								priority
								className="object-contain"
								sizes="(max-width: 768px) 240px, (max-width: 1024px) 400px, 500px"
								quality={60}
							/>
						</div>
						<h2 className="font-sans text-white text-2xl md:text-3xl font-semibold">
							Peace of Mind Now Comes Standard
						</h2>
					</div>
				</section>

				{/* Intro Section */}
				<section className="py-12 md:py-16 bg-white">
					<div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
						<p className="font-body text-gray-700 text-center text-base md:text-lg leading-relaxed mb-4 font-bold">
							Complimentary Maintenance Now included with the Purchase of a Qualified Used Vehicle from Tonkin
						</p>
						<p className="font-body text-gray-700 text-center text-base leading-relaxed">
							{
								"TonkinCare is more than just maintenance–it’s peace of mind. Now every qualified pre-owned vehicle purchased from Tonkin comes with a 1-year introductory vehicle maintenance plan (with 24-hour roadside assistance) that will save you money on future oil changes, provide you with towing, lockout assistance, fuel delivery, and jumpstarts in the event of bad luck on the road, and ensure that you and your vehicle are taken care of, long after you drive off the lot.\n\n"
							}
						</p>
					</div>
				</section>

				{/* Features Section */}
				<section className="py-12 md:py-16 bg-gray-50">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
							{/* Complimentary Oil Changes */}
							<div className="text-center">
								<div className="flex justify-center mb-6">
									<Wrench className="w-16 h-16 text-[#151B49]" strokeWidth={1.5} />
								</div>
								<h3 className="font-sans font-bold text-[#151B49] text-xl md:text-2xl mb-4">
									(2) Complimentary Oil Changes
								</h3>
								<div className="font-body text-gray-700 text-sm md:text-base leading-relaxed space-y-2">
									<p className="font-semibold mb-3">Service appointments include:</p>
									<p>– Engine oil and engine oil change</p>
									<p>– Robust multipoint inspection (see below for details)</p>
									<p>– Disposal of hazardous waste</p>
									<p>– Brake inspection</p>
									<p>– Tire inspection and rotation</p>
									<p className="mt-4">
										TonkinCare covers 2 oil changes during your first year, upgradable to 2, 3, and 4 year maintenance
										plans.
									</p>
								</div>
							</div>

							{/* 24-Hour Roadside Assistance */}
							<div className="text-center">
								<div className="flex justify-center mb-6">
									<Clock className="w-16 h-16 text-[#151B49]" strokeWidth={1.5} />
								</div>
								<h3 className="font-sans font-bold text-[#151B49] text-xl md:text-2xl mb-4">
									24-Hour Roadside Assistance
								</h3>
								<div className="font-body text-gray-700 text-sm md:text-base leading-relaxed space-y-2">
									<p className="mb-3">
										True 24-hour roadside assistance is backed by AAA for the full term of your agreement. Coverage
										includes (parts and fluids excluded):
									</p>
									<p>– Unlimited roadside assistance calls</p>
									<p>– Emergency fuel delivery</p>
									<p>– Flat tire changes</p>
									<p>– Jump starts</p>
									<p>– Lock-outs</p>
									<p>– Collision recovery</p>
									<p>– Winching & towing services</p>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Benefits Section */}
				<section className="py-12 md:py-16 bg-white">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
							<div className="order-2 lg:order-1">
								<div className="relative w-full aspect-[4/3] rounded-lg shadow-lg overflow-hidden">
									<Image
										src="https://cdn.dealertower.com/website-media/content/73d6c4fc-8ffb-471e-88c4-5e8eeddc1c63/Tonkin-care-two-1.webp"
										alt="Dealership service"
										fill
										className="object-cover"
										sizes="(max-width: 1024px) 100vw, 50vw"
										quality={60}
										placeholder="blur"
										blurDataURL={secondaryBlurDataURL}
									/>
								</div>
							</div>
							<div className="order-1 lg:order-2">
								<h3 className="font-sans font-bold text-[#151B49] text-2xl md:text-3xl mb-6">Benefits To You</h3>
								<ul className="font-body text-gray-700 text-base leading-relaxed space-y-3 list-disc list-outside pl-5">
									<li>Shield yourself from the rising costs of vehicle maintenance</li>
									<li>Top of the line maintenance provided by best-in-class technicians</li>
									<li>
										Peace of mind wherever you may be with unlimited 24-hour roadside assistance, emergency fuel
										delivery, and flat tire changes backed by AAA
									</li>
									<li>Rigorous multi-point inspection of every vehicle by factory-trained technicians</li>
									<li>Cover all your bases with brake inspections, tire rotations, and oil changes</li>
									<li>Timed reminders make it easy to ensure your getting the right services at the right time</li>
									<li>Complimentary with the purchase of every Tonkin pre-owned vehicle</li>
								</ul>
								<p className="font-body text-gray-600 text-sm mt-4 italic">
									**Coverage is included on most pre-owned makes and models, some exclusions apply.
								</p>
							</div>
						</div>
					</div>
				</section>

				{/* Dark Section - Additional Plans */}
				<section className="py-12 md:py-16 bg-[#1a1a1a] text-white">
					<div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
						<h3 className="font-sans font-bold text-xl md:text-2xl mb-4">
							Additional Long-Term Maintenance Plans Available
						</h3>
						<p className="font-body text-base leading-relaxed">
							Several long-term maintenance plans are available for purchase, and, if financed, can be conveniently
							included in your monthly payment (subject to credit approval). Expand coverage up to 2, 3, and 4 year
							options.
						</p>
					</div>
				</section>

				{/* Services Section */}
				<section className="py-12 md:py-16 bg-white">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<h2 className="font-sans font-bold text-[#151B49] text-2xl md:text-3xl text-center mb-8">
							The following services will be performed at each scheduled visit
						</h2>
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
							<div>
								<div className="relative w-full aspect-[4/3] rounded-lg shadow-lg overflow-hidden">
									<Image
										src="https://cdn.dealertower.com/website-media/content/73d6c4fc-8ffb-471e-88c4-5e8eeddc1c63/schedule-tech-visit.webp"
										alt="Mechanics working"
										fill
										loading="lazy"
										className="object-cover"
										sizes="(max-width: 1024px) 100vw, 50vw"
										quality={60}
										placeholder="blur"
										blurDataURL={secondaryBlurDataURL}
									/>
								</div>
							</div>
							<div>
								<p className="font-body text-gray-700 text-sm mb-6 leading-relaxed">
									This multi-point inspection of critical components in your vehicle, can help you save money by
									identifying potential problems, such as excessive wear. Early detection can reduce the possibility of
									a part failure.
								</p>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
									<div className="space-y-2 font-body text-gray-700 text-sm">
										<p className="font-semibold">Fluids inspected and replenished:</p>
										<p>Brake Master Cylinder</p>
										<p>Clutch Master Cylinder</p>
										<p>Transmission</p>
										<p>Differential</p>
										<p>Coolant</p>
										<p>Windshield Washer</p>
										<p>Power Steering</p>
										<p>Transfer Case (applicable vehicles)</p>
									</div>
									<div className="space-y-2 font-body text-gray-700 text-sm">
										<p className="font-semibold">Visual Inspection of:</p>
										<p>Air Filter (cabin and engine)</p>
										<p>System Hoses (cracking/leaks)</p>
										<p>Drive Belts (cracking/damage/wear)</p>
										<p>Axle Boots (damage/leaks)</p>
										<p>Shock Absorbers/Suspension</p>
										<p>PCV Valve (if applicable)</p>
										<p>Cooling System</p>
										<p>Exhaust System/Muffler</p>
										<p>Tire Wear, Pressure, and Adjustment</p>
										<p>Windshield Wiper</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Disclaimer Section */}
				<section className="py-8 bg-gray-100">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="font-body text-gray-600 text-xs leading-relaxed space-y-2">
							<p>
								*Some exclusions apply. For a list of excluded makes and models, click here. See dealer for details.
							</p>
							<p>
								*The Introductory Prepaid Maintenance Plan included in the vehicle price is cancelable (subject to
								specific agreement terms) but not refundable.
							</p>
							<p>
								*Additional optional, cancelable (subject to specific agreement terms) long-term coverage is available
								for a fee and is not required to obtain credit.
							</p>
							<p>
								*Additional services may be recommended by your servicing dealer. These additional services are not
								covered by your Agreement and are your responsibility.
							</p>
							<p>
								*The use of a synthetic-grade engine oil may be indicated for your vehicle. Synthetic oil and filter
								changes may be required less often. Consult your vehicle&apos;s scheduled maintenance guide for
								factory-recommended oil grade and service intervals.
							</p>
							<p>
								*Lockout Protection does not include the cost of key replacement. Emergency Fuel Delivery includes up to
								3 gallons of gasoline twice per month at non charge. Towing will be provided to the dealership where the
								vehicle was purchased/leased to or an alternate dealership if customer chooses. Maximum towing distance
								is 400 miles. Customer is responsible for towing cost beyond that distance. Certain restrictions may
								apply.
							</p>
							<p>
								*Not all customers will qualify for credit. TonkinCare (also known as Auto Care Plan) is sold by Gee
								Automotive Group under the express permission of Toyota Motor Insurance Services, Inc.
								(&quot;Administrator&quot;), who is the obligor of the program. The Administrator may be reached at (800)
								332-0712. This brochure is a sample of the terms of the maintenance plan, which are fully described in
								the Customer Agreement (Agreement), which will be mailed to you upon approval of your application. The
								actual time and mileage coverage, exclusions, and limitations of the Agreement issued to a customer may
								vary by both the vehicle model and according to the plan chosen by the customer. Services or repairs not
								covered by your plan are your responsibility, even if additional services are recommended by your dealer
								or revealed by inspections covered by your plan. Consult your vehicle&apos;s Owner&apos;s Manual for the
								factory-recommended service intervals.
							</p>
							<p>
								©2024 Toyota Motor Insurance Services, Inc. Continuous Customer Care is a service mark used by Toyota
								Motor Insurance Services, Inc. (TMIS) and its subsidiaries. Voluntary Protection Products are
								administered by TIMS or a third party contracted by TMIS. 24-868401 1/24
							</p>
						</div>
					</div>
				</section>
			</main>
		</div>
	)
}
