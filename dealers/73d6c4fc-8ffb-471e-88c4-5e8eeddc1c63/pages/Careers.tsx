import ContentSection from "../components/ContentSection"
import PageHero from "../components/PageHero"
import IframeSection from "../components/IframeSection"

export default function Careers() {
	return (
		<>
			{/* Hero Section */}
			<PageHero title="Start Your Career With Us Today" backgroundImage="https://cdn.dealertower.com/website-media/website-media/content/73d6c4fc-8ffb-471e-88c4-5e8eeddc1c63/contact-us.webp" />

			{/* 100 Best Companies Section */}
			<ContentSection
				title="Oregon's 100 Best Companies to Work for in Oregon 2025"
				description="In 2017 Gee Automotive Companies acquired the Ron Tonkin Family of Dealerships, Oregon's 11th largest private employer. This union created even more opportunities to start your career with Gee, where we pride ourselves on being a place where people enjoy coming to work because they know they make a difference. Our team members are our greatest asset, and together we're working to achieve the highest levels of excellence in vehicle sales and service. We have a team-oriented culture of excellence and trust which pushes us all to be our best every day.

Gee's industry-leading benefits package for full time employees includes: paid medical and dental insurance; 401K with company match; generous Gee Time Off (GTO) each year; life and disability insurance; lucrative discounts on automobiles, parts, and service at Gee locations all over the Pacific Northwest; company paid training and job-related education reimbursement; employee assistance program; cafeteria/flex plan; as well as concert and sporting event tickets. Most importantly, our team members have the tools, support and training to reach their highest potential with opportunities for career advancement and excellent compensation."
				imageSrc="https://cdn.dealertower.com/website-media/content/73d6c4fc-8ffb-471e-88c4-5e8eeddc1c63/100best2025-1024x847.webp"
				imageAlt="Oregon's 100 Best Companies to Work for in Oregon 2025"
				imagePosition="left"
			/>

			<IframeSection
				src="https://www.paycomonline.net/v4/ats/web.php/jobs?clientkey=EE0962D7FEFB07F5DA15E78B08A461D8&fromClientSide=true"
				title="Careers Job Board"
				height="1900px"
			/>
		</>
	)
}
