import Image from "next/image"
import Link from "next/link"
import PageHero from "../components/PageHero"

export default function TonkinGee() {
	return (
		<div className="min-h-screen bg-white">
			<main>
				<PageHero title="Tonkin & Gee: Two Family Legacies" backgroundImage="https://cdn.dealertower.com/website-media/content/73d6c4fc-8ffb-471e-88c4-5e8eeddc1c63/about-hero-bg.webp" backgroundImageMobile="https://cdn.dealertower.com/website-media/content/73d6c4fc-8ffb-471e-88c4-5e8eeddc1c63/about-hero-bg-mobile.webp" />

				{/* Main Content Section */}
				<section className="py-12 sm:py-16 lg:py-20 bg-white">
					<div className="max-w-7xl mx-auto px-4 sm:px-6">
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
							{/* Left Column - Text Content */}
							<div className="space-y-6">
								<p className="font-sans text-gray-800 text-base leading-relaxed">
									<span className="font-bold">The Tonkin Family of Dealerships began in 1960</span>, with a $100,000
									loan to Ron Tonkin from First National Bank in Portland, Oregon. This was used to purchase the first
									dealership – Ron Tonkin Chevrolet – that still calls the city home today. By 1965, success led Mr.
									Tonkin to purchase a fine-acre plot on what was then the edge of Portland proper, on what is now 122nd
									Street.
								</p>

								<p className="font-sans text-gray-800 text-base leading-relaxed">
									A year later, Tonkin Gran Turismo was founded, and in less than a decade became the most successful
									Ferrari dealership in the United States. Success here and in the original Chevrolet store led to swift
									expansion, including another Chevrolet store, Saabb, Alfa-Romeos and Maseratis.
								</p>

								<p className="font-sans text-gray-800 text-base leading-relaxed">
									Ron Tonkin became one of the best-known leaders in the automotive industry, earning numerous awards
									and commendations. His auto group continued to grow with his success, eventually encompassing Acura,
									Alfa-Romeo, Chevrolet, Chrysler, Dodge, Ducati, Fiat, Honda, Hyundai, Jeep, Kia, Mazda, Nissan, Ram,
									and Toyota.
								</p>

								<div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-6">
									{/* Vintage Pontiac Dealership Image */}
									<div className="relative aspect-[4/3] rounded-lg shadow-md overflow-hidden">
										<Image
											src="https://cdn.dealertower.com/website-media/content/73d6c4fc-8ffb-471e-88c4-5e8eeddc1c63/gee_pontiac_desktop-768x306.webp"
											alt="Vintage George Gee Pontiac dealership building from 1982"
											fill
											className="object-cover"
										/>
									</div>
									{/* Dealership Sign Pole Image */}
									<div className="relative aspect-[4/3] rounded-lg shadow-md overflow-hidden">
										<Image
											src="https://cdn.dealertower.com/website-media/content/73d6c4fc-8ffb-471e-88c4-5e8eeddc1c63/tonkin-sign.webp"
											alt="Tall Tonkin Chevrolet dealership sign pole"
											fill
											className="object-cover"
										/>
									</div>
								</div>

								<p className="font-sans text-gray-800 text-base leading-relaxed">
									<span className="font-bold">
										Meanwhile, in Spokane, Washington, George and Theresa Gee opened their first dealership in 1982.
									</span>{" "}
									Their son, Ryan Gee, became CEO in 2003 and guided Gee Automotive Companies through rapid growth.
									Today, Gee operates 41 dealerships across the western United States, including the Tonkin stores in
									Oregon.
								</p>

								<p className="font-sans text-gray-800 text-base leading-relaxed">
									In late 2016, the Tonkin Family of Dealerships was acquired by Gee Automotive. More than a business
									transaction, it was the union of two family-owned companies built on shared values: service,
									community, and trust.
								</p>

								<p className="font-sans text-gray-800 text-base leading-relaxed">
									The past near-decade has seen Gee Automotive continue the Tonkin tradition of serving Portland&apos;s
									families, providing them with new and used vehicles to help them work, play and travel. Our
									headquarters are now Milwaukie, Oregon, and we cannot wait to help our neighbors get where they are
									going in the years to come.
								</p>

								<div className="pt-4">
									<Link
										href="/team"
										className="cursor-pointer inline-block bg-[#72c6f5] text-white px-8 py-3 font-sans font-semibold text-base hover:bg-[#151B49] hover:shadow-md transition-all duration-200"
									>
										OUR TEAM
									</Link>
								</div>
							</div>

							{/* Right Column - Large Dealership Image */}
							<div className="lg:sticky lg:top-24 h-fit">
								<div className="relative aspect-[3/4] rounded-lg shadow-xl overflow-hidden">
									<Image
										src="https://cdn.dealertower.com/website-media/content/73d6c4fc-8ffb-471e-88c4-5e8eeddc1c63/tonkin-sign.webp"
										alt="Modern Tonkin Chevrolet dealership sign pole with American flag"
										fill
										className="object-cover"
									/>
								</div>
							</div>
						</div>
					</div>
				</section>
			</main>
		</div>
	)
}
