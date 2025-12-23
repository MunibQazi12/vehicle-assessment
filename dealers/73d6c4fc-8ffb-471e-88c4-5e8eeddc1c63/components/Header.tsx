"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Header() {
	const [openDropdown, setOpenDropdown] = useState<string | null>(null)
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
	const [mobileDropdownOpen, setMobileDropdownOpen] = useState<string | null>(null)
	const pathname = usePathname()

	const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null)

	const handleMouseEnter = (dropdown: string) => {
		if (closeTimeoutRef.current) {
			clearTimeout(closeTimeoutRef.current)
			closeTimeoutRef.current = null
		}
		setOpenDropdown(dropdown)
	}

	const handleMouseLeave = () => {
		closeTimeoutRef.current = setTimeout(() => {
			setOpenDropdown(null)
		}, 150)
	}

	const toggleMobileDropdown = (dropdown: string) => {
		setMobileDropdownOpen(mobileDropdownOpen === dropdown ? null : dropdown)
	}

	const closeMobileMenu = () => {
		setMobileMenuOpen(false)
		setMobileDropdownOpen(null)
	}

	const isActive = (path: string) => pathname === path

	return (
		<>
			<header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm h-20">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
					<div className="flex items-center justify-between h-full gap-4">
						{/* Logo */}
						<div className="flex-shrink-0 z-50">
							<Link href="/" className="block cursor-pointer">
								<Image
									src="/assets/images/tonkin-gee-logo.png"
									alt="Tonkin Gee Automotive Group"
									width={240}
									height={74}
									className="h-14 lg:h-20 w-auto"
								/>
							</Link>
						</div>

						<nav className="hidden lg:flex items-center gap-1 bg-white/60 backdrop-blur-lg rounded-full px-6 py-2 border border-white/40">
							{/* Shop Cars - Dropdown */}
							<div
								className="relative group"
								onMouseEnter={() => handleMouseEnter("shop-cars")}
								onMouseLeave={handleMouseLeave}
							>
								<button className="cursor-pointer text-[#151B49] text-sm font-medium hover:text-[#72c6f5] transition-colors duration-200 flex items-center gap-1 px-3 py-1.5 rounded-full hover:bg-white/50">
									Shop Cars
									<svg
										className="w-3.5 h-3.5 transition-transform group-hover:rotate-180 duration-200"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
									</svg>
								</button>
								{openDropdown === "shop-cars" && (
									<div className="absolute top-full left-0 pt-1 z-50">
										<div className="w-56 bg-white/95 backdrop-blur-xl rounded-xl shadow-xl border border-gray-200/50 px-2 overflow-hidden">
											<Link
												href="/new-vehicles"
												className="cursor-pointer block px-4 py-2.5 text-sm text-[#151B49] hover:bg-[#72c6f5]/10 hover:text-[#72c6f5] transition-colors duration-200"
											>
												New Vehicles
											</Link>
											<Link
												href="/used-vehicles"
												className="cursor-pointer block px-4 py-2.5 text-sm text-[#151B49] hover:bg-[#72c6f5]/10 hover:text-[#72c6f5] transition-colors duration-200"
											>
												Used Vehicles
											</Link>
										</div>
									</div>
								)}
							</div>

							{/* Tonkin Care */}
							<Link
								href="/tonkincare"
								className={`cursor-pointer text-sm font-medium transition-colors duration-200 px-3 py-1.5 rounded-full hover:bg-white/50 ${isActive("/tonkincare") ? "text-[#72c6f5] bg-[#72c6f5]/10" : "text-[#151B49] hover:text-[#72c6f5]"
									}`}
							>
								Tonkin Care
							</Link>

							{/* Specials */}
							<Link
								href="/specials"
								className={`cursor-pointer text-sm font-medium transition-colors duration-200 px-3 py-1.5 rounded-full hover:bg-white/50 ${isActive("/specials") ? "text-[#72c6f5] bg-[#72c6f5]/10" : "text-[#151B49] hover:text-[#72c6f5]"
									}`}
							>
								Specials
							</Link>

							{/* Service - Dropdown */}
							<div
								className="relative group"
								onMouseEnter={() => handleMouseEnter("service")}
								onMouseLeave={handleMouseLeave}
							>
								<button className="cursor-pointer text-[#151B49] text-sm font-medium hover:text-[#72c6f5] transition-colors duration-200 flex items-center gap-1 px-3 py-1.5 rounded-full hover:bg-white/50">
									Service
									<svg
										className="w-3.5 h-3.5 transition-transform group-hover:rotate-180 duration-200"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
									</svg>
								</button>
								{openDropdown === "service" && (
									<div className="absolute top-full left-0 pt-1 z-50">
										<div className="w-56 bg-white/95 backdrop-blur-xl rounded-xl shadow-xl border border-gray-200/50 pt-2 overflow-hidden">
											<Link
												href="/service"
												className={`cursor-pointer block px-4 py-2.5 text-sm transition-colors duration-200 ${isActive("/service")
													? "bg-[#151B49] text-white"
													: "text-[#151B49] hover:bg-[#151B49] hover:text-white"
													}`}
											>
												Tonkin Service Locations
											</Link>
											<Link
												href="/tonkin-collision-center"
												className={`cursor-pointer block px-4 py-2.5 text-sm transition-colors duration-200 rounded-b-xl ${isActive("/tonkin-collision-center")
													? "bg-[#151B49] text-white"
													: "text-[#151B49] hover:bg-[#151B49] hover:text-white"
													}`}
											>
												Tonkin Collision Center
											</Link>
										</div>
									</div>
								)}
							</div>

							{/* About Tonkin - Dropdown */}
							<div
								className="relative group"
								onMouseEnter={() => handleMouseEnter("about")}
								onMouseLeave={handleMouseLeave}
							>
								<button className="cursor-pointer text-[#151B49] text-sm font-medium hover:text-[#72c6f5] transition-colors duration-200 flex items-center gap-1 px-3 py-1.5 rounded-full hover:bg-white/50">
									About Tonkin
									<svg
										className="w-3.5 h-3.5 transition-transform group-hover:rotate-180 duration-200"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
									</svg>
								</button>
								{openDropdown === "about" && (
									<div className="absolute top-full left-0 pt-1 z-50">
										<div className="w-56 bg-white/95 backdrop-blur-xl rounded-xl shadow-xl border border-gray-200/50 pt-2 overflow-hidden">
											<Link
												href="/tonkin-gee"
												className={`cursor-pointer block px-4 py-2.5 text-sm transition-colors duration-200 ${isActive("/tonkin-gee")
													? "bg-[#151B49] text-white"
													: "text-[#151B49] hover:bg-[#151B49] hover:text-white"
													}`}
											>
												About Tonkin & Gee
											</Link>
											<Link
												href="/dealers"
												className={`cursor-pointer block px-4 py-2.5 text-sm transition-colors duration-200 ${isActive("/dealers")
													? "bg-[#151B49] text-white"
													: "text-[#151B49] hover:bg-[#151B49] hover:text-white"
													}`}
											>
												Dealers
											</Link>
											<Link
												href="/team"
												className={`cursor-pointer block px-4 py-2.5 text-sm transition-colors duration-200 ${isActive("/team")
													? "bg-[#151B49] text-white"
													: "text-[#151B49] hover:bg-[#151B49] hover:text-white"
													}`}
											>
												Meet Our Team
											</Link>
											<Link
												href="/tonkin-gee/careers"
												className={`cursor-pointer block px-4 py-2.5 text-sm transition-colors duration-200 ${isActive("/tonkin-gee/careers")
													? "bg-[#151B49] text-white"
													: "text-[#151B49] hover:bg-[#151B49] hover:text-white"
													}`}
											>
												Careers
											</Link>
											<Link
												href="/tonkin-gee/gee-grant"
												className={`cursor-pointer block px-4 py-2.5 text-sm transition-colors duration-200 rounded-b-xl ${isActive("/tonkin-gee/gee-grant")
													? "bg-[#151B49] text-white"
													: "text-[#151B49] hover:bg-[#151B49] hover:text-white"
													}`}
											>
												Gee Grant Apprenticeship
											</Link>
										</div>
									</div>
								)}
							</div>
						</nav>

						<div className="flex items-center gap-3">
							{/* Search - Hidden on small screens */}
							<div className="hidden xl:flex items-center bg-gray-100 rounded-full px-4 py-1.5 border border-gray-200/50 hover:bg-gray-200 transition-all duration-200">
								<input
									type="text"
									placeholder="Search vehicles"
									className="bg-transparent border-none outline-none text-sm w-36 placeholder:text-gray-500 cursor-text"
								/>
								<svg className="w-4 h-4 text-[#151B49]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
									/>
								</svg>
							</div>

							{/* Locations Button */}
							<Link
								href="/dealers"
								className="cursor-pointer hidden lg:block bg-[#151B49] text-white px-5 py-2 text-sm font-medium hover:bg-[#72c6f5] hover:shadow-md transition-all duration-200"
							>
								Store Locations
							</Link>

							{/* Mobile Menu Toggle */}
							<button
								onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
								className="cursor-pointer lg:hidden p-2 text-[#151B49] hover:text-[#72c6f5] transition-colors duration-200"
								aria-label="Toggle menu"
							>
								{mobileMenuOpen ? (
									<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12M6 12h12" />
									</svg>
								) : (
									<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
									</svg>
								)}
							</button>
						</div>
					</div>

					{mobileMenuOpen && (
						<div className="lg:hidden fixed inset-x-0 top-20 h-[calc(100vh-5rem)] bg-white border-t border-gray-200 overflow-y-auto z-40">
							<div className="py-6 px-4 space-y-2">
								{/* Shop Cars - Mobile Dropdown */}
								<div>
									<button
										onClick={() => toggleMobileDropdown("shop-cars")}
										className="cursor-pointer w-full flex items-center justify-between px-4 py-3 text-[#151B49] font-medium hover:bg-[#72c6f5]/10 hover:text-[#72c6f5] rounded-xl transition-all duration-200"
									>
										Shop Cars
										<svg
											className={`w-5 h-5 transition-transform duration-200 ${mobileDropdownOpen === "shop-cars" ? "rotate-180" : ""}`}
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
										</svg>
									</button>
									{mobileDropdownOpen === "shop-cars" && (
										<div className="mt-1 ml-4 space-y-1">
											<Link
												href="/new-vehicles"
												onClick={closeMobileMenu}
												className="cursor-pointer block px-4 py-2.5 text-sm text-[#151B49] hover:bg-[#72c6f5]/10 hover:text-[#72c6f5] rounded-lg transition-all duration-200"
											>
												New Vehicles
											</Link>
											<Link
												href="/used-vehicles"
												onClick={closeMobileMenu}
												className="cursor-pointer block px-4 py-2.5 text-sm text-[#151B49] hover:bg-[#72c6f5]/10 hover:text-[#72c6f5] rounded-lg transition-all duration-200"
											>
												Used Vehicles
											</Link>
										</div>
									)}
								</div>

								{/* Tonkin Care */}
								<Link
									href="/tonkincare"
									onClick={closeMobileMenu}
									className={`cursor-pointer block px-4 py-3 font-medium rounded-xl transition-all duration-200 ${isActive("/tonkincare")
										? "bg-[#151B49] text-white"
										: "text-[#151B49] hover:bg-[#151B49] hover:text-white"
										}`}
								>
									Tonkin Care
								</Link>

								{/* Specials */}
								<Link
									href="/specials"
									onClick={closeMobileMenu}
									className={`cursor-pointer block px-4 py-3 font-medium rounded-xl transition-all duration-200 ${isActive("/specials")
										? "bg-[#151B49] text-white"
										: "text-[#151B49] hover:bg-[#151B49] hover:text-white"
										}`}
								>
									Specials
								</Link>

								{/* Service - Mobile Dropdown */}
								<div>
									<button
										onClick={() => toggleMobileDropdown("service")}
										className="cursor-pointer w-full flex items-center justify-between px-4 py-3 text-[#151B49] font-medium hover:bg-[#72c6f5]/10 hover:text-[#72c6f5] rounded-xl transition-all duration-200"
									>
										Service
										<svg
											className={`w-5 h-5 transition-transform duration-200 ${mobileDropdownOpen === "service" ? "rotate-180" : ""}`}
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
										</svg>
									</button>
									{mobileDropdownOpen === "service" && (
										<div className="mt-1 ml-4 space-y-1">
											<Link
												href="/service"
												onClick={closeMobileMenu}
												className={`cursor-pointer block px-4 py-2.5 text-sm transition-colors duration-200 rounded-lg ${isActive("/service")
													? "bg-[#151B49] text-white"
													: "text-[#151B49] hover:bg-[#151B49] hover:text-white"
													}`}
											>
												Tonkin Service Locations
											</Link>
											<Link
												href="/tonkin-collision-center"
												onClick={closeMobileMenu}
												className={`cursor-pointer block px-4 py-2.5 text-sm transition-colors duration-200 rounded-lg ${isActive("/tonkin-collision-center")
													? "bg-[#151B49] text-white"
													: "text-[#151B49] hover:bg-[#151B49] hover:text-white"
													}`}
											>
												Tonkin Collision Center
											</Link>
										</div>
									)}
								</div>

								{/* About Tonkin - Mobile Dropdown */}
								<div>
									<button
										onClick={() => toggleMobileDropdown("about")}
										className="cursor-pointer w-full flex items-center justify-between px-4 py-3 text-[#151B49] font-medium hover:bg-[#72c6f5]/10 hover:text-[#72c6f5] rounded-xl transition-all duration-200"
									>
										About Tonkin
										<svg
											className={`w-5 h-5 transition-transform duration-200 ${mobileDropdownOpen === "about" ? "rotate-180" : ""}`}
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
										</svg>
									</button>
									{mobileDropdownOpen === "about" && (
										<div className="mt-1 ml-4 space-y-1">
											<Link
												href="/tonkin-gee"
												onClick={closeMobileMenu}
												className={`cursor-pointer block px-4 py-2.5 text-sm transition-colors duration-200 rounded-lg ${isActive("/tonkin-gee")
													? "bg-[#151B49] text-white"
													: "text-[#151B49] hover:bg-[#151B49] hover:text-white"
													}`}
											>
												About Tonkin & Gee
											</Link>
											<Link
												href="/dealers"
												onClick={closeMobileMenu}
												className={`cursor-pointer block px-4 py-2.5 text-sm transition-colors duration-200 rounded-lg ${isActive("/dealers")
													? "bg-[#151B49] text-white"
													: "text-[#151B49] hover:bg-[#151B49] hover:text-white"
													}`}
											>
												Dealers
											</Link>
											<Link
												href="/team"
												onClick={closeMobileMenu}
												className={`cursor-pointer block px-4 py-2.5 text-sm transition-colors duration-200 rounded-lg ${isActive("/team")
													? "bg-[#151B49] text-white"
													: "text-[#151B49] hover:bg-[#151B49] hover:text-white"
													}`}
											>
												Meet Our Team
											</Link>
											<Link
												href="/tonkin-gee/careers"
												onClick={closeMobileMenu}
												className={`cursor-pointer block px-4 py-2.5 text-sm transition-colors duration-200 rounded-lg ${isActive("/tonkin-gee/careers")
													? "bg-[#151B49] text-white"
													: "text-[#151B49] hover:bg-[#151B49] hover:text-white"
													}`}
											>
												Careers
											</Link>
											<Link
												href="/tonkin-gee/gee-grant"
												onClick={closeMobileMenu}
												className={`cursor-pointer block px-4 py-2.5 text-sm transition-colors duration-200 rounded-lg ${isActive("/tonkin-gee/gee-grant")
													? "bg-[#151B49] text-white"
													: "text-[#151B49] hover:bg-[#151B49] hover:text-white"
													}`}
											>
												Gee Grant Apprenticeship
											</Link>
										</div>
									)}
								</div>

								{/* Mobile Search */}
								<div className="pt-4">
									<div className="flex items-center bg-white rounded-xl px-4 py-3 border border-gray-200">
										<input
											type="text"
											placeholder="Search vehicles"
											className="bg-transparent border-none outline-none text-sm w-full placeholder:text-gray-500 cursor-text"
										/>
										<svg
											className="w-5 h-5 text-gray-400 flex-shrink-0"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
											/>
										</svg>
									</div>
								</div>

								{/* Mobile Locations Button */}
								<div className="pt-4">
									<Link
										href="/dealers"
										onClick={closeMobileMenu}
										className="cursor-pointer block w-full bg-[#151B49] text-white px-5 py-3 text-center font-medium hover:bg-[#72c6f5] hover:shadow-md transition-all duration-200 rounded-xl"
									>
										Locations
									</Link>
								</div>
							</div>
						</div>
					)}
				</div>
			</header>
			{/* Spacer to account for fixed header height */}
			<div className="h-20" aria-hidden="true" />
		</>
	)
}
