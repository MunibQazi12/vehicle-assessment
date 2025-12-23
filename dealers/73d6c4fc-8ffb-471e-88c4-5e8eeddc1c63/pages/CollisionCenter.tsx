import Image from "next/image"
import PageHero from "../components/PageHero"

export default function CollisionCenter() {
	return (
		<>
			<main className="min-h-screen bg-white">
				<PageHero title="Tonkin Collision Center" backgroundImage="https://cdn.dealertower.com/website-media/content/73d6c4fc-8ffb-471e-88c4-5e8eeddc1c63/tonkin_collision_home_hero.jpg.webp" />

				{/* Main Content Section */}
				<section className="py-12 md:py-16 lg:py-20 bg-white">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
							{/* Left Content */}
							<div className="lg:col-span-2">
								<h2 className="font-sans font-bold text-[#151B49] text-2xl sm:text-3xl lg:text-4xl mb-6">
									Portland, Oregon&apos;s premier independent repair shop
								</h2>
								<p className="font-body text-gray-700 text-base leading-relaxed mb-8">
									The Tonkin Collision Center, located conveniently at{" "}
									<a
										href="https://www.google.com/maps/dir/?api=1&destination=800+SE+122ND+Avenue+Portland+OR+97233"
										target="_blank"
										rel="noopener noreferrer"
										className="text-[#72c6f5] hover:text-[#151B49] underline font-medium transition-colors"
									>
										800 SE 122ND Avenue in Portland, Oregon
									</a>
									, is a full service automobile repair shop owned and operated by the Tonkin Family of Dealerships. We
									have seasoned staff. We are a non-direct repair facility and not tied to a preexist repair on lists of
									insurance referrals, and we work with all insurance companies and will do so at the customer&apos;s behalf
									once the claim is started.
								</p>

								{/* Certification Logos */}
								<div className="flex flex-wrap items-center gap-8 lg:gap-12 mb-8">
									<div className="w-32 h-24 flex items-center justify-center relative">
										<Image
											src="https://cdn.dealertower.com/website-media/content/73d6c4fc-8ffb-471e-88c4-5e8eeddc1c63/gm-logo.jpg.webp"
											alt="General Motors Certified"
											fill
											className="object-contain"
										/>
									</div>
									<div className="w-32 h-24 flex items-center justify-center relative">
										<Image
											src="https://cdn.dealertower.com/website-media/content/73d6c4fc-8ffb-471e-88c4-5e8eeddc1c63/cert-toyota-sq.webp"
											alt="Toyota Certified CollisionCenter"
											fill
											className="object-contain"
										/>
									</div>
									<div className="w-32 h-24 flex items-center justify-center relative">
										<Image
											src="https://cdn.dealertower.com/website-media/content/73d6c4fc-8ffb-471e-88c4-5e8eeddc1c63/Honda-Symbol-Transparent-Free.webp"
											alt="Honda Certified"
											fill
											className="object-contain"
										/>
									</div>
								</div>
							</div>

							{/* Right Sidebar - Info Box */}
							<div className="lg:col-span-1">
								<div className="bg-[#72c6f5] text-white p-6 rounded-lg">
									<h3 className="font-sans font-bold text-lg text-center mb-6 border-b border-white/30 pb-4">
										NO APPOINTMENT NECESSARY | QUICK TURNAROUND
									</h3>

									{/* Hours of Operation */}
									<div className="mb-6">
										<h4 className="font-sans font-bold text-sm mb-3">HOURS OF OPERATION</h4>
										<div className="space-y-2 text-sm">
											<div className="flex justify-between">
												<span>Monday</span>
												<span>8 AM - 5 PM</span>
											</div>
											<div className="flex justify-between">
												<span>Tuesday</span>
												<span>8 AM - 5 PM</span>
											</div>
											<div className="flex justify-between">
												<span>Wednesday</span>
												<span>8 AM - 5 PM</span>
											</div>
											<div className="flex justify-between">
												<span>Thursday</span>
												<span>8 AM - 5 PM</span>
											</div>
											<div className="flex justify-between">
												<span>Friday</span>
												<span>8 AM - 5 PM</span>
											</div>
											<div className="flex justify-between">
												<span>Saturday</span>
												<span>Closed</span>
											</div>
											<div className="flex justify-between">
												<span>Sunday</span>
												<span>Closed</span>
											</div>
										</div>
									</div>

									{/* Contact Us */}
									<div className="border-t border-white/30 pt-4">
										<h4 className="font-sans font-bold text-sm mb-3">CONTACT US</h4>
										<div className="space-y-2 text-sm">
											<a href="tel:+19714355813" className="cursor-pointer block hover:underline transition-all">
												971-435-5813
											</a>
											<a
												href="mailto:collisioncenter@tonkin.com"
												className="cursor-pointer block break-words hover:underline transition-all"
											>
												collisioncenter@tonkin.com
											</a>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Why Choose Section */}
				<section className="py-12 md:py-16 lg:py-20 bg-[#151B49]">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
							{/* Image */}
							<div className="order-2 lg:order-1">
								<div className="rounded-2xl overflow-hidden shadow-2xl relative aspect-[4/3]">
									<Image
										src="https://cdn.dealertower.com/website-media/content/73d6c4fc-8ffb-471e-88c4-5e8eeddc1c63/Collision+Center.webp"
										alt="Welding work at collision center"
										fill
										className="object-cover"
									/>
								</div>
							</div>

							{/* Content */}
							<div className="order-1 lg:order-2 text-white">
								<h2 className="font-sans font-bold text-3xl sm:text-4xl mb-6">Why choose Tonkin Collision Center?</h2>
								<p className="font-body text-gray-200 text-base leading-relaxed mb-8">
									In addition to the convenience offered by Tonkin Collision Center, our number one concern is your well
									being and the safety of your ride. Our trustworthy technicians have worked for years in the car
									industry, and know what it takes to make your car run like new.
								</p>

								<div className="space-y-4">
									<div className="flex items-start gap-3">
										<svg className="w-6 h-6 text-[#72c6f5] flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
											<path
												fillRule="evenodd"
												d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
												clipRule="evenodd"
											/>
										</svg>
										<span className="font-body text-sm">LIFETIME GUARANTEE ON WORKMANSHIP (PAINT AND BODY)</span>
									</div>
									<div className="flex items-start gap-3">
										<svg className="w-6 h-6 text-[#72c6f5] flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
											<path
												fillRule="evenodd"
												d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
												clipRule="evenodd"
											/>
										</svg>
										<span className="font-body text-sm">WORK WITH ALL INSURANCE COMPANIES</span>
									</div>
									<div className="flex items-start gap-3">
										<svg className="w-6 h-6 text-[#72c6f5] flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
											<path
												fillRule="evenodd"
												d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
												clipRule="evenodd"
											/>
										</svg>
										<span className="font-body text-sm">CERTIFIED WITH TOYOTA AND GM</span>
									</div>
									<div className="flex items-start gap-3">
										<svg className="w-6 h-6 text-[#72c6f5] flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
											<path
												fillRule="evenodd"
												d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
												clipRule="evenodd"
											/>
										</svg>
										<span className="font-body text-sm">NO APPOINTMENT NECESSARY FOR ESTIMATES</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Two Column Info Section */}
				<section className="py-12 md:py-16 lg:py-20 bg-gray-50">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
							{/* Left Column */}
							<div>
								<h3 className="font-sans font-bold text-[#151B49] text-xl mb-4">Lifetime Guarantee</h3>
								<p className="font-body text-gray-700 text-sm leading-relaxed mb-6">
									When your ride is repaired at Tonkin Collision Center, you can rest easy in the quality of the work.
									While manufacturer paints come with their own warranty (typically one year), we guarantee our paint
									and body work for as long as you own the vehicle. This guarantee is non-transferable, and does not
									carry over to future owners.
								</p>

								<h3 className="font-sans font-bold text-[#151B49] text-xl mb-4">Work with any insurance</h3>
								<p className="font-body text-gray-700 text-sm leading-relaxed">
									Tonkin Collision Center is pleased to work with any insurance and not be beholden to any. No matter
									your coverage, we will work with you, and will ensure you receive the very best service and parts for
									your car&apos;s needs.
								</p>
							</div>

							{/* Right Column */}
							<div>
								<h3 className="font-sans font-bold text-[#151B49] text-xl mb-4">Certified with Toyota and GM</h3>
								<p className="font-body text-gray-700 text-sm leading-relaxed mb-6">
									Our brand is welcome at Tonkin Collision Center, but if you own a Toyota or General Motors vehicle,
									you are in luck. Our shop is officially certified with both of these brands (including ongoing
									training with Toyota throughout the shop), meaning the repair process is streamlined and efficient,
									bringing you a faster turnaround time and higher quality repairs.
								</p>

								<h3 className="font-sans font-bold text-[#151B49] text-xl mb-4">No Appointment Necessary</h3>
								<p className="font-body text-gray-700 text-sm leading-relaxed">
									When you need an estimate for your vehicle&apos;s repairs, just drop on by. Tonkin Collision Center is here
									whenever you are, and no appointment is necessary. Once repairs are done, as possible, and we&apos;ll
									provide you with the information you need to choose a shop to do your repairs. Our estimate will
									provide you with the information you need to make the best decision for you and your family.
								</p>
							</div>
						</div>
					</div>
				</section>

				{/* Map Section */}
				<section className="py-12 md:py-16">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="rounded-2xl overflow-hidden shadow-xl">
							<iframe
								src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2795.8766825784!2d-122.53768!3d45.5155!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5495a0b6c8b6c8b7%3A0x1c8b6c8b6c8b6c8b!2s800%20SE%20122nd%20Ave%2C%20Portland%2C%20OR%2097233!5e0!3m2!1sen!2sus!4v1234567890"
								width="100%"
								height="450"
								style={{ border: 0 }}
								allowFullScreen
								loading="lazy"
								referrerPolicy="no-referrer-when-downgrade"
								title="Tonkin Collision Center Location"
							/>
						</div>
					</div>
				</section>
			</main>
		</>
	)
}
