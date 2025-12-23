"use client"

import { useState } from "react"
import ContentSection from "./ContentSection"

export default function Tonkin2USection() {
	const [showMore, setShowMore] = useState(false)

	const descriptionContent = (
		<div className="font-sans text-gray-700 text-sm sm:text-base lg:text-lg leading-relaxed space-y-4 max-w-xl mx-auto lg:mx-0">
			<p>
				At Tonkin Automotive Group, we are a family of dealerships with an inventory made up of various types and sizes
				from popular brands such as Acura, Jeep, Kia, Toyota, Mazda, Hyundai, Chevrolet, and much more. Tonkin Auto
				group is home to many different options and has served customers around Portland for years! We ensure a
				wonderful customer experience by meeting all of their great expectations with friendly and professional team
				members. Experience the difference in shopping at our dealerships. Our group has been serving the Pacific
				Northwest area since 1960 and holds a strong reputation for customer service and a family-like atmosphere.
				Whether it be our impressive Chevy & GMC truck selection, SUV options galore, or excellent repair service on
				cars trucks, or SUVs, we want our Portland area customers to experience everything we have to offer.
			</p>

			{showMore && (
				<>
					<div className="mt-6 pt-6 border-t border-gray-200">
						<h3 className="font-sans font-bold text-lg sm:text-xl text-[#151B49] mb-3">
							Large Selection of New Cars, Trucks, and SUVs Near Milwaukie
						</h3>
						<p>
							At Tonkin Automotive, you are sure to find the exact new cars, trucks, and SUVs you&apos;re looking for! We
							have an excellent team of skilled and expert advisors who can support answer any questions you might have
							regarding your new vehicle! Browse top models online or in-store for more information, and also be sure to
							check out our new vehicle specials. Located near Gresham, we are a one-stop-shop for all your New car
							needs. At Tonkin Auto Group, we offer all of your favorite models, consisting of the industry&apos;s latest
							SUVs, trucks, and cars. This includes the most popular Jeep Wranglers, Chevy Silverados, or Acura TLX.
							Just looking to buy new trucks? We offer award-winning pickup trucks including Dodge RAM, Ford F-150,
							Toyota Tundra, and Nissan Titan built for anything you&apos;d need. Speed in a different direction with a Fiat
							500X Sport or a Ducati motorcycle, perfect for your inner speed demon. We have more than enough ways to
							send you off in your new dream ride. Visit our dealership to find out more!
						</p>
					</div>

					<div className="mt-6 pt-6 border-t border-gray-200">
						<h3 className="font-sans font-bold text-lg sm:text-xl text-[#151B49] mb-3">
							Used and Certified Pre-Owned trucks, cars & SUVs for sale near Vancouver, WA
						</h3>
						<p>
							For our budget-conscious shoppers, Tonkin Auto Group offers a vast selection of used cars & certified
							pre-owned cars, trucks, and SUVs. Speaking of SUVs, if you need third-row seating or extra cargo space for
							your family shop from our vast selection. From many popular brands, you are sure to find a used SUV with
							style, comfort, and fuel efficiency. Choose from the Mercedes Benz GLE 350, Cadillac XT5, Audi Q5, and
							more! We carry a wide variety of makes, models, colors, trims, and body styles, so you&apos;re sure to find the
							used car you&apos;ve been looking for. Customers looking for peace of mind can shop our Certified Pre-Owned
							Ford, Chevy, or Dodge, and rest assured that all of our used vehicles have been inspected in detail. Have
							a trade-in? Great! We want to buy your car, even if you don&apos;t buy ours! Now, more than ever, we are
							offering top-dollar for all trade-ins, no matter the make or model. Visit us today at our used car
							dealerships, or view our website to learn more!
						</p>
					</div>

					<div className="mt-6 pt-6 border-t border-gray-200">
						<h3 className="font-sans font-bold text-lg sm:text-xl text-[#151B49] mb-3">
							Financing At Tonkin Dealerships Near Gresham
						</h3>
						<p>
							We offer many different financing options when it comes to purchasing trucks, cars, and SUVs. Our finance
							consultants will work with you to ensure you get the best rate that is within your budget. We even offer
							Credit Assistance Programs to our more credit-challenged customers to help them secure a loan or lease on
							their dream vehicle. You can contact our Finance Center at any of our dealerships or get pre-approved with
							an online finance application to start your financing process today.
						</p>
					</div>
				</>
			)}

			<button
				onClick={() => setShowMore(!showMore)}
				className="cursor-pointer inline-flex items-center gap-2 px-4 py-1.5 bg-gray-100 text-gray-700 font-sans text-sm font-semibold rounded-full hover:bg-[#151B49] hover:text-white transition-all duration-300"
			>
				{showMore ? "Show Less" : "Show More"}
				<svg
					className={`w-4 h-4 transition-transform duration-300 ${showMore ? "rotate-180" : ""}`}
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
				</svg>
			</button>
		</div>
	)

	return (
		<ContentSection
			title="Buy A Car Online With Home Delivery"
			subtitle="5-Day Return Period And The Actual Best Price."
			highlight="true"
			description={descriptionContent}
			ctaText="Learn more about Tonkin2U home delivery"
			ctaLink="https://www.tonkin2u.com/"
			ctaPosition="image"
			imageSrc="https://cdn.dealertower.com/website-media/content/73d6c4fc-8ffb-471e-88c4-5e8eeddc1c63/info-img-blk1.webp"
			imageAlt="Tonkin2U home delivery service"
			imageWidth={607}
			imageHeight={796}
			imagePosition="left"
			backgroundColor="light"
		/>
	)
}
