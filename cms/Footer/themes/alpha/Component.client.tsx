"use client"

import Image from "next/image"
import Link from "next/link"
import { useMemo, useState } from "react"
import QuestionSection from "./QuestionSection"
import { useWebsiteInfo } from "@dealertower/lib/tenant/context"
import { FooterLink } from "@dealertower/components/ui"

const footerLinks = {
	newInventory: [
		{ label: "New Vehicles", url: "/new-vehicles/" },
		{ label: "Used Vehicles", url: "/used-vehicles/" },
		{ label: "Careers", url: "/tonkin-gee/careers/" },
	],
	quickLinks: [
		{ label: "Specials", url: "/specials" },
		{ label: "Service", url: "/service/" },
	],
}

export default function Footer() {
	const websiteInfo = useWebsiteInfo()
	const [openAccordion, setOpenAccordion] = useState<string | null>(null)

	const dealershipLinks = useMemo(() => {
		const apiDealers = websiteInfo?.dealers?.filter((dealer) => dealer?.name && dealer?.site_url)

		if (apiDealers && apiDealers.length > 0) {
			return apiDealers
				.map((dealer) => ({
					label: dealer.name,
					url: dealer.site_url!,
				}))
				.sort((a, b) => a.label.localeCompare(b.label))
		}

		return []
	}, [websiteInfo])

	const toggleAccordion = (section: string) => {
		setOpenAccordion(openAccordion === section ? null : section)
	}

	return (
		<>
			<QuestionSection />

			<footer className="bg-[#151B49] text-white">
				<div className="max-w-7xl mx-auto px-4 sm:px-6">
					{/* Top Section with Logo and Links */}
					<div className="py-12 lg:py-16 border-b border-white/10">
						{/* Logo */}
						<div className="mb-10 lg:mb-12">
							<Image
								src="/assets/images/tonkin-white-logo.webp"
								alt="Tonkin Automotive Group"
								width={350}
								height={111}
								className="h-14 w-auto"
							/>
						</div>

						{/* Desktop Layout - Grid with improved spacing */}
						<div className="hidden lg:grid lg:grid-cols-4 gap-16">
							{/* Main Inventory */}
							<div>
								<h3 className="font-sans font-bold text-lg mb-6 text-white border-b border-[#72c6f5] pb-2">
									Main Inventory
								</h3>
								<ul className="space-y-3.5">
									{footerLinks.newInventory.map((link, index) => (
										<li key={index}>
											<FooterLink
												url={link.url}
												className="cursor-pointer font-sans text-sm text-gray-300 hover:text-[#72c6f5] hover:pl-2 transition-all duration-200 block"
											>
												{link.label}
											</FooterLink>
										</li>
									))}
								</ul>
							</div>

							{/* Dealerships - Split into 2 columns */}
							<div className="col-span-2">
								<h3 className="font-sans font-bold text-lg mb-6 text-white border-b border-[#72c6f5] pb-2">
									Dealerships
								</h3>
								<div className="grid grid-cols-2 gap-x-10">
									<ul className="space-y-3.5">
										{dealershipLinks.slice(0, Math.ceil(dealershipLinks.length / 2)).map((link) => (
											<li key={link.url}>
												<FooterLink
													url={link.url}
													className="cursor-pointer font-sans text-sm text-gray-300 hover:text-[#72c6f5] hover:pl-2 transition-all duration-200 block"
													external
												>
													{link.label}
												</FooterLink>
											</li>
										))}
									</ul>
									<ul className="space-y-3.5">
										{dealershipLinks.slice(Math.ceil(dealershipLinks.length / 2)).map((link) => (
											<li key={link.url}>
												<FooterLink
													url={link.url}
													className="cursor-pointer font-sans text-sm text-gray-300 hover:text-[#72c6f5] hover:pl-2 transition-all duration-200 block"
													external
												>
													{link.label}
												</FooterLink>
											</li>
										))}
									</ul>
								</div>
							</div>

							{/* Quick Links */}
							<div>
								<h3 className="font-sans font-bold text-lg mb-6 text-white border-b border-[#72c6f5] pb-2">
									Quick Links
								</h3>
								<ul className="space-y-3.5">
									{footerLinks.quickLinks.map((link, index) => (
										<li key={index}>
											<FooterLink
												url={link.url}
												className="cursor-pointer font-sans text-sm text-gray-300 hover:text-[#72c6f5] hover:pl-2 transition-all duration-200 block"
											>
												{link.label}
											</FooterLink>
										</li>
									))}
								</ul>
							</div>
						</div>

						{/* Mobile Layout - Accordions */}
						<div className="lg:hidden space-y-1">
							{/* Main Inventory Accordion */}
							<div className="border-b border-white/10">
								<button
									onClick={() => toggleAccordion("inventory")}
									className="cursor-pointer w-full flex items-center justify-between py-4 text-left"
								>
									<h3 className="font-sans font-semibold text-base text-white">Main Inventory</h3>
									<svg
										className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${openAccordion === "inventory" ? "rotate-180" : ""
											}`}
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
									</svg>
								</button>
								<div
									className={`overflow-hidden transition-all duration-300 ${openAccordion === "inventory" ? "max-h-96 pb-4" : "max-h-0"
										}`}
								>
									<ul className="space-y-3">
										{footerLinks.newInventory.map((link, index) => (
											<li key={index}>
												<FooterLink
													url={link.url}
													className="cursor-pointer font-sans text-sm text-gray-300 hover:text-[#72c6f5] transition-colors duration-200 block"
												>
													{link.label}
												</FooterLink>
											</li>
										))}
									</ul>
								</div>
							</div>

							{/* Dealerships Accordion */}
							<div className="border-b border-white/10">
								<button
									onClick={() => toggleAccordion("dealerships")}
									className="cursor-pointer w-full flex items-center justify-between py-4 text-left"
								>
									<h3 className="font-sans font-semibold text-base text-white">Dealerships</h3>
									<svg
										className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${openAccordion === "dealerships" ? "rotate-180" : ""
											}`}
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
									</svg>
								</button>
								<div
									className={`overflow-hidden transition-all duration-300 ${openAccordion === "dealerships" ? "max-h-[600px] pb-4" : "max-h-0"
										}`}
								>
									<ul className="space-y-3">
										{dealershipLinks.map((link) => (
											<li key={link.url}>
												<FooterLink
													url={link.url}
													className="cursor-pointer font-sans text-sm text-gray-300 hover:text-[#72c6f5] transition-colors duration-200 block"
													external
												>
													{link.label}
												</FooterLink>
											</li>
										))}
									</ul>
								</div>
							</div>

							{/* Quick Links Accordion */}
							<div className="border-b border-white/10">
								<button
									onClick={() => toggleAccordion("quicklinks")}
									className="cursor-pointer w-full flex items-center justify-between py-4 text-left"
								>
									<h3 className="font-sans font-semibold text-base text-white">Quick Links</h3>
									<svg
										className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${openAccordion === "quicklinks" ? "rotate-180" : ""
											}`}
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
									</svg>
								</button>
								<div
									className={`overflow-hidden transition-all duration-300 ${openAccordion === "quicklinks" ? "max-h-96 pb-4" : "max-h-0"
										}`}
								>
									<ul className="space-y-3">
										{footerLinks.quickLinks.map((link, index) => (
											<li key={index}>
												<FooterLink
													url={link.url}
													className="cursor-pointer font-sans text-sm text-gray-300 hover:text-[#72c6f5] transition-colors duration-200 block"
												>
													{link.label}
												</FooterLink>
											</li>
										))}
									</ul>
								</div>
							</div>
						</div>
					</div>

					{/* DealerTower Branding - Above Bottom Row */}
					<div className="border-t border-white/10 pt-6 pb-6">
						<div className="flex items-center justify-end">
							<a
								href="https://dealertower.com"
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-center gap-1.5 text-xs text-gray-300 hover:text-[#72c6f5] transition-colors whitespace-nowrap group"
							>
								<span>Automotive Website by</span>
								<Image
									src="https://cdn.dealertower.com/website-media/brand-assets/Dealertower+logo.svg"
									alt="DealerTower"
									width={64}
									height={16}
									className="h-4 w-auto opacity-90 group-hover:opacity-100 transition-opacity"
									unoptimized
								/>
								<span className="text-white group-hover:text-[#72c6f5] transition-colors">
									DealerTower
								</span>
							</a>
						</div>
					</div>

					{/* Bottom Bar with enhanced design */}
					<div className="border-t border-white/10 pt-6 pb-6">
						<div className="flex flex-col lg:flex-row items-center justify-between gap-4">
							{/* Links on the left */}
							<div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 text-sm text-gray-400">
								<a
									href="https://www.cigna.com/legal/compliance/machine-readable-files"
									target="_blank"
									rel="noopener noreferrer"
									className="cursor-pointer font-sans hover:text-[#72c6f5] transition-colors duration-200"
								>
									Transparency in Coverage
								</a>
								<span>•</span>
								<Link
									href="/privacy-policy/"
									className="cursor-pointer font-sans hover:text-[#72c6f5] transition-colors duration-200"
								>
									Privacy Policy
								</Link>
								<span>•</span>
								<Link
									href="/sitemap/"
									className="cursor-pointer font-sans hover:text-[#72c6f5] transition-colors duration-200"
								>
									Sitemap
								</Link>
								<span>•</span>
								<a
									href="/sitemap.xml"
									className="cursor-pointer font-sans hover:text-[#72c6f5] transition-colors duration-200"
								>
									Sitemap XML
								</a>
							</div>

							{/* Copyright on the right */}
							<p className="font-sans text-sm text-gray-400 text-center lg:text-right whitespace-nowrap">
								© {new Date().getFullYear()} Tonkin Automotive Group. All rights reserved.
							</p>
						</div>
					</div>
				</div>
			</footer>
		</>
	)
}
