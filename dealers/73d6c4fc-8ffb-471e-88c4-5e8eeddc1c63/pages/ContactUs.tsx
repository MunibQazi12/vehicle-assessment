import PageHero from "../components/PageHero"
import { FormSSR } from "@dealertower/components/forms"

export default function ContactUs() {
	return (
		<>
			<main>
				{/* Hero Section */}
				<PageHero
					title="Contact Us"
					backgroundImage="https://cdn.dealertower.com/website-media/content/73d6c4fc-8ffb-471e-88c4-5e8eeddc1c63/contact-us-scaled.jpeg"
				/>

				{/* Form Section */}
				<section className="py-12 md:py-16 lg:py-20 bg-white">
					<div className="max-w-3xl mx-auto px-4 sm:px-6">
						{/* Header */}
						<div className="text-center mb-8">
							<h2 className="font-sans font-bold text-[#151B49] text-2xl md:text-3xl lg:text-4xl mb-4">
								We Welcome Your Feedback and Comments
							</h2>
							<p className="font-sans text-gray-700 text-sm md:text-base leading-relaxed mb-4 text-left">
								Do you have questions or comments for us? We&apos;d love to hear them! Fill out the form and we will get back
								to you as soon as possible.
							</p>
							<p className="font-sans text-gray-700 text-sm md:text-base leading-relaxed mb-2 text-left">
								If you need help with any aspect of the buying process, please don&apos;t hesitate to ask us. Our customer
								service representatives will be happy to assist you in any way. Whether through email, phone or in
								person, we&apos;re here to help you get the customer service you deserve.
							</p>
							<p className="font-sans text-gray-700 text-sm md:text-base leading-relaxed italic text-left">
								Interested in learning more? Contact us!
							</p>
						</div>

						<FormSSR formId="7622186d-9727-4be5-b775-91b4ab0aefc5" />
					</div>
				</section>
			</main>
		</>
	)
}
