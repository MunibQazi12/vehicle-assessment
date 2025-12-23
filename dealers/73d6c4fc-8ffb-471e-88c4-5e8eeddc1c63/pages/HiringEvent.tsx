import Image from "next/image";
import { FormSSR } from "@dealertower/components/forms";

export default function HiringEvent() {
	return (
		<>
			<main>
				{/* Hero Image - Container 1400px */}
				<section className="w-full max-w-[1400px] mx-auto relative aspect-[16/6]">
					<Image src="https://cdn.dealertower.com/website-media/content/73d6c4fc-8ffb-471e-88c4-5e8eeddc1c63/Header-Image+.webp" alt="Join Our Growing Family" fill className="object-cover" priority />
				</section>

				{/* Text Section */}
				<section className="py-12 md:py-16 lg:py-20 bg-white">
					<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
						<h2 className="font-sans font-bold text-[#151B49] text-3xl md:text-4xl lg:text-5xl mb-6">
							THE ROAD TO EXCELLENCE STARTS HERE
						</h2>
						<p className="font-sans text-[#333] text-base md:text-lg leading-relaxed">
							At Ron Tonkin Family of Dealerships, our promise is to provide our customers with the most compelling car
							shopping experience possible by offering the best possible service, selection, quality, and value. We know
							that customers have high expectations, and as a family of dealerships we enjoy the challenge of meeting
							and exceeding those standards each and every time. Since 1960, we&apos;ve been committed to continuing to
							deliver and improve on this promise, with a network of hard-working team members behind the wheel.
						</p>
					</div>
				</section>

				{/* Second Image - Container 1400px */}
				<section className="w-full max-w-[1400px] mx-auto relative aspect-[2048/762]">
					<Image
						src="https://cdn.dealertower.com/website-media/content/73d6c4fc-8ffb-471e-88c4-5e8eeddc1c63/HIRING-26TH.webp"
						alt="Upcoming Hiring Event - Thursday June 26 at Tonkin Parts Center"
						fill
						className="object-cover"
					/>
				</section>

				{/* Form Section - Two Columns */}
				<section className="py-12 md:py-16 lg:py-20 bg-gray-50">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
							{/* Left Column - Text */}
							<div className="lg:pr-8">
								<h2 className="font-sans font-bold text-[#151B49] text-3xl md:text-4xl lg:text-5xl mb-6">
									MAKE A GREAT FIRST IMPRESSION
								</h2>
								<h3 className="font-sans font-bold text-[#151B49] text-xl md:text-2xl mb-4">
									RSVP TO OUR UPCOMING HIRING EVENT
								</h3>
								<p className="font-sans text-[#333] text-base md:text-lg leading-relaxed">
									Coming to our upcoming Hiring Event? RSVP in advance so we can get to know you before hand! Not ready?
									No need to RSVP ahead of time, but we hope to see you there!
								</p>
							</div>

							{/* Right Column - Form */}
							<div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
								<FormSSR formId="76c8200d-2b9c-4ff0-842a-885b1ca84c50" />
							</div>
						</div>
					</div>
				</section>

				{/* Alternate Submission Section */}
				<section className="py-12 md:py-16 lg:py-20 bg-white">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
							{/* Left Column - Text and Form */}
							<div className="space-y-8">
								<div>
									<h2 className="font-sans font-bold text-[#151B49] text-3xl md:text-4xl lg:text-5xl mb-6">
										CAN&apos;T MAKE IT?
									</h2>
									<h3 className="font-sans font-bold text-[#151B49] text-xl md:text-2xl mb-4">
										WE WOULD LOVE TO STILL MEET YOU
									</h3>
									<p className="font-sans text-[#333] text-base md:text-lg leading-relaxed">
										Does our July Hiring Event not work with your schedule? Not a problem. Please{" "}
										<span className="font-bold text-[#151B49] cursor-pointer">CLICK HERE</span> to send us your resume
										and our team will reach out to you soon to schedule an interview.
									</p>
								</div>

								{/* Form */}
								<div className="bg-gray-50 rounded-2xl shadow-lg p-6 md:p-8">
									<FormSSR formId="858a1802-e791-475d-9f1e-ecdae9786be7" />
								</div>
							</div>

							{/* Right Column - CTA Buttons */}
							<div className="flex flex-col justify-center gap-6 lg:pl-8">
								<a
									href="/about/careers/"
									target="_blank"
									rel="noopener noreferrer"
									className="cursor-pointer block bg-[#72c6f5] text-white font-sans font-semibold text-xl md:text-2xl text-center px-8 py-4 hover:bg-[#151B49] hover:shadow-md transition-all duration-200"
								>
									Open Positions
								</a>
								<a
									href="/team/"
									target="_blank"
									rel="noopener noreferrer"
									className="cursor-pointer block bg-[#72c6f5] text-white font-sans font-semibold text-xl md:text-2xl text-center px-8 py-4 hover:bg-[#151B49] hover:shadow-md transition-all duration-200"
								>
									Our Company
								</a>
							</div>
						</div>
					</div>
				</section>
			</main>
		</>
	)
}
