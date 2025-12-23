"use client"

import { useState } from "react"

interface Review {
	id: number
	rating: number
	text: string
	author: string
}

const reviews: Review[] = [
	{
		id: 1,
		rating: 5,
		text: "Bought our son his first car this morning! Our sales person Ray was great and very informative. Everything went smoothly and pretty quick. I would recommend Ron Tonkin Acura to anyone looking to buy a new or used car.",
		author: "Valerie Morton",
	},
	{
		id: 2,
		rating: 5,
		text: "Absolute pleasure and extremely patient, I never felt pressured to make a decision, and most importantly, a professional Shawn (much appreciated) who knows the car business inside and out. I highly recommend it if you are considering buying a new or previously owned automobile. Wonderful service and great experience.",
		author: "Malcolm Mwangi",
	},
	{
		id: 3,
		rating: 5,
		text: "Our sales associate Shane was easy to work with. Replied immediately to my emails and phone calls. Becki handled our financing. The entire process took 2 hours and that included the test drive! It was the smoothest car purchase we've had. Thank you",
		author: "Renae Smith (ironangelbiz)",
	},
	{
		id: 4,
		rating: 5,
		text: "I had a great experience at Ron Tonkin Acura. I purchased my Integra Type S from them and my sales person Deante was amazing and made the buying experience fantastic! Easy going and always communicated to me about the status of my car. I'd recommend anyone in the area who is interested in buying a new Acura to come visit Ron Tonkin Acura.",
		author: "Antony Guan",
	},
	{
		id: 5,
		rating: 5,
		text: "Found this 1500 used Sierra on auto trader and drove to Ron Tonkin to see it yesterday. I instantly fell in love with it and wanted to buy, but didn't have a lot of time to work with. The sales staff worked hard and were very accommodating to help me get the deal done. Jolee was a very nice lady and made this the easiest car buying experience I've ever had.",
		author: "Alex Cisneros",
	},
	{
		id: 6,
		rating: 5,
		text: "We came in to look at a vehicle late in the day. The organization was accommodating and we never felt any pressure. Each person we had contact with was helpful and made us feel relaxed about the whole process. They were honest in our negotiations and this is a place I would do business with again. I will also recommend and encourage family and friends to do business with them. Thank you Ron Tonkin Acura!",
		author: "Dorothea Jirka",
	},
]

export default function ReviewsSection() {
	const [currentPage, setCurrentPage] = useState(0)
	const reviewsPerPage = 2
	const totalPages = Math.ceil(reviews.length / reviewsPerPage)

	// Calculate which reviews to show
	const startIndex = currentPage * reviewsPerPage
	const visibleReviews = reviews.slice(startIndex, startIndex + reviewsPerPage)

	return (
		<section className="py-12 md:py-16 lg:py-24 bg-[#151B49] relative overflow-hidden">
			{/* Decorative background elements */}
			<div className="absolute inset-0 opacity-5">
				<div className="absolute top-0 left-0 w-96 h-96 bg-[#72c6f5] rounded-full blur-3xl"></div>
				<div className="absolute bottom-0 right-0 w-96 h-96 bg-[#72c6f5] rounded-full blur-3xl"></div>
			</div>

			<div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
				{/* Section Header */}
				<div className="text-center mb-8 lg:mb-12">
					<h2 className="font-sans font-bold text-2xl sm:text-3xl lg:text-4xl text-white mb-3 lg:mb-4">
						CUSTOMER REVIEWS
					</h2>
					<div className="flex items-center justify-center gap-2">
						<span className="font-sans font-bold text-xl sm:text-2xl lg:text-3xl text-[#72c6f5]">4.60</span>
						<span className="font-sans text-white text-base sm:text-lg">Average Star Rating!</span>
					</div>
				</div>

				{/* Reviews Grid */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto mb-6 lg:mb-8">
					{visibleReviews.map((review) => (
						<div
							key={review.id}
							className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-[400px] sm:h-[380px]"
						>
							{/* Star Rating */}
							<div className="flex gap-1 mb-4">
								{[...Array(review.rating)].map((_, i) => (
									<svg key={i} className="w-5 h-5 text-[#72c6f5]" fill="currentColor" viewBox="0 0 20 20">
										<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
									</svg>
								))}
							</div>

							{/* Review Text */}
							<p className="font-sans text-gray-700 text-sm sm:text-base leading-relaxed mb-6 flex-1 overflow-y-auto">
								{review.text}
							</p>

							{/* Author */}
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#72c6f5] to-[#5ab5e4] flex items-center justify-center shadow-md">
									<span className="text-white font-sans font-semibold">{review.author.charAt(0)}</span>
								</div>
								<span className="font-sans font-semibold text-[#151B49]">{review.author}</span>
							</div>
						</div>
					))}
				</div>

				<div className="flex items-center justify-center gap-2">
					{[...Array(totalPages)].map((_, index) => (
						<button
							key={index}
							onClick={() => setCurrentPage(index)}
							className={`rounded-full transition-all duration-300 cursor-pointer ${currentPage === index
									? "w-3 h-3 bg-[#72c6f5] scale-125"
									: "w-2 h-2 bg-white/30 hover:bg-white/50 hover:scale-125"
								}`}
							aria-label={`Go to page ${index + 1}`}
						/>
					))}
				</div>
			</div>
		</section>
	)
}
