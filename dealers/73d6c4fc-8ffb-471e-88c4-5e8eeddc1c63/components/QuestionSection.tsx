/**
 * QuestionSection - Server Component
 * Static call-to-action section with links.
 * No client-side interactivity required.
 */

import Link from "next/link"

export default function QuestionSection() {
	return (
		<section className="py-12 sm:py-14 lg:py-16 bg-[#6B7A99] relative overflow-hidden">
			{/* Decorative background elements */}
			<div className="absolute inset-0 opacity-5">
				<div className="absolute top-0 left-0 w-96 h-96 bg-[#72c6f5] rounded-full blur-3xl"></div>
				<div className="absolute bottom-0 right-0 w-96 h-96 bg-[#72c6f5] rounded-full blur-3xl"></div>
			</div>

			<div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
				<div className="flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-8">
					<div className="text-center sm:text-left">
						<h2 className="font-sans font-bold text-2xl sm:text-3xl lg:text-4xl text-white mb-2">Have a question?</h2>
						<p className="font-sans text-white text-sm sm:text-base">We&apos;d love to hear from you!</p>
					</div>

					<div className="flex items-center gap-3 sm:gap-4">
						<Link
							href="/contact-us"
							className="cursor-pointer bg-[#72c6f5] text-white px-8 py-3.5 font-sans font-semibold hover:bg-white hover:text-[#151B49] hover:shadow-md transition-all duration-200 whitespace-nowrap"
						>
							CONTACT US
						</Link>

						<a
							href="https://www.facebook.com/TonkinFamilyofDealerships/"
							target="_blank"
							rel="noopener noreferrer"
							className="cursor-pointer w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 hover:scale-110 transition-all duration-300"
							aria-label="Visit Tonkin on Facebook"
						>
							<svg className="w-6 h-6 sm:w-7 sm:h-7 text-[#6B7A99]" fill="currentColor" viewBox="0 0 24 24">
								<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
							</svg>
						</a>
					</div>
				</div>
			</div>
		</section>
	)
}
