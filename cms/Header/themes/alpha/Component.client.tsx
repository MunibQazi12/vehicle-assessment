'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import type { Header, Media } from '@dtcms/payload-types'

import { Logo } from '@dtcms/components/Logo/Logo'
import { CMSLink, type CMSLinkType } from '@dtcms/components/Link'
import { useHeaderTheme } from '@dtcms/providers/HeaderTheme'

interface AlphaHeaderProps {
	data: Header | null
}

/**
 * Alpha Header Theme - Fixed header with glassmorphism nav, dropdowns, and mobile menu
 */
export const AlphaHeader: React.FC<AlphaHeaderProps> = ({ data }) => {
	const [openDropdown, setOpenDropdown] = useState<string | null>(null)
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
	const [mobileDropdownOpen, setMobileDropdownOpen] = useState<string | null>(null)
	const [theme, setTheme] = useState<string | null>(null)
	const pathname = usePathname()

	const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null)
	const dropdownRefs = useRef<Map<string, HTMLDivElement>>(new Map())

	const homePath = '/'

	const { headerTheme, setHeaderTheme } = useHeaderTheme()

	useEffect(() => {
		setHeaderTheme(null)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [pathname])

	useEffect(() => {
		if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [headerTheme])

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

	const navItems = data?.navItems || []
	const logo = data?.logo as Media | null | undefined
	const ctaButton = data?.ctaButton as
		| {
			text?: string | null
			link?: CMSLinkType | null
		}
		| null
		| undefined

	const hasSubItems = (item: (typeof navItems)[0]) => {
		return item.subItems && item.subItems.length > 0
	}

	// Check if CTA button should be shown (text must not be empty)
	const showCtaButton = ctaButton?.text && ctaButton.text.trim().length > 0

	// Check if search box should be shown (defaults to true)
	const showSearchBox = data?.showSearchBox !== false

	return (
		<>
			<header
				className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm"
				{...(theme ? { 'data-theme': theme } : {})}
			>
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex items-center justify-between h-16 lg:h-18 gap-4">
						{/* Logo */}
						<div className="flex-shrink-0 z-50">
							<Link href={homePath} className="block cursor-pointer">
								{logo?.url ? (
									<Image
										src={logo.url}
										alt={logo.alt || 'Logo'}
										width={logo.width || 150}
										height={logo.height || 48}
										className="h-10 lg:h-12 w-auto object-contain"
										priority
									/>
								) : (
									<Logo loading="eager" priority="high" className="h-10 lg:h-12 w-auto" />
								)}
							</Link>
						</div>

						{/* Desktop Navigation */}
						<nav className="hidden lg:flex items-center gap-1 bg-white/60 backdrop-blur-lg rounded-full px-6 py-2 border border-white/40">
							{navItems.map((item, index) => {
								const link = item.link
								if (!link) return null

								const dropdownId = `nav-${index}`
								const showDropdown = hasSubItems(item)

								if (showDropdown) {
									return (
										<div
											key={index}
											className="relative"
											onMouseEnter={() => handleMouseEnter(dropdownId)}
											onMouseLeave={handleMouseLeave}
											ref={(el) => {
												if (el) dropdownRefs.current.set(dropdownId, el)
											}}
										>
											<button
												className="cursor-pointer flex items-center gap-1 text-[#151B49] text-sm font-medium hover:text-[#72c6f5] transition-colors duration-200 px-3 py-1.5 rounded-full hover:bg-white/50"
												aria-expanded={openDropdown === dropdownId}
												aria-haspopup="true"
											>
												{link.label}
												<svg
													className={`w-4 h-4 transition-transform duration-200 ${openDropdown === dropdownId ? 'rotate-180' : ''
														}`}
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M19 9l-7 7-7-7"
													/>
												</svg>
											</button>

											{/* Dropdown Menu */}
											{openDropdown === dropdownId && (
												<div className="absolute top-full left-0 pt-1 z-50">
													<div className="min-w-[200px] bg-white/95 backdrop-blur-xl rounded-xl shadow-xl border border-gray-200/50 pt-2 overflow-hidden">
														{item.subItems?.map((subItem, subIndex) => {
															const subLink = subItem.link
															if (!subLink) return null
															const isLastItem = subIndex === (item.subItems?.length ?? 0) - 1

															return (
																<CMSLink
																	key={subIndex}
																	{...subLink}
																	appearance="link"
																	className={`cursor-pointer block px-4 py-2.5 text-sm transition-colors duration-200 text-[#151B49] hover:bg-[#151B49] hover:text-white no-underline hover:no-underline ${isLastItem ? 'rounded-b-xl' : ''}`}
																/>
															)
														})}
													</div>
												</div>
											)}
										</div>
									)
								}

								return (
									<CMSLink
										key={index}
										{...link}
										appearance="link"
										className="cursor-pointer text-[#151B49] text-sm font-medium hover:text-[#72c6f5] transition-colors duration-200 px-3 py-1.5 rounded-full hover:bg-white/50 no-underline hover:no-underline"
									/>
								)
							})}
						</nav>

						<div className="flex items-center gap-3">
							{/* Search - Hidden on small screens */}
							{showSearchBox && (
								<div className="hidden xl:flex items-center bg-white/50 backdrop-blur-sm rounded-full px-4 py-1.5 border border-gray-200/50 hover:bg-white/70 transition-all duration-200">
									<input
										type="text"
										placeholder="Search vehicles"
										className="bg-transparent border-none outline-none text-sm w-36 placeholder:text-gray-500 cursor-text"
									/>
									<svg
										className="w-4 h-4 text-gray-400"
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
							)}

							{/* CTA Button */}
							{showCtaButton && ctaButton?.link && (
								<CMSLink
									{...ctaButton.link}
									appearance="link"
									className="cursor-pointer hidden lg:block bg-[#151B49] text-white px-5 py-2 text-sm font-medium hover:bg-[#72c6f5] hover:shadow-md transition-all duration-200 no-underline hover:no-underline"
								>
									{ctaButton.text}
								</CMSLink>
							)}

							{/* Mobile Menu Toggle */}
							<button
								onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
								className="cursor-pointer lg:hidden p-2 text-[#151B49] hover:text-[#72c6f5] transition-colors duration-200"
								aria-label="Toggle menu"
							>
								{mobileMenuOpen ? (
									<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M6 18L18 6M6 6l12 12"
										/>
									</svg>
								) : (
									<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M4 6h16M4 12h16M4 18h16"
										/>
									</svg>
								)}
							</button>
						</div>
					</div>

					{/* Mobile Menu */}
					{mobileMenuOpen && (
						<div className="lg:hidden fixed inset-x-0 top-16 h-[calc(100vh-4rem)] bg-white border-t border-gray-200 overflow-y-auto z-40">
							<div className="py-6 px-4 space-y-2">
								{navItems.map((item, index) => {
									const link = item.link
									if (!link) return null

									const dropdownId = `mobile-nav-${index}`
									const showDropdown = hasSubItems(item)

									if (showDropdown) {
										return (
											<div key={index}>
												<button
													onClick={() => toggleMobileDropdown(dropdownId)}
													className="cursor-pointer w-full flex items-center justify-between px-4 py-3 font-medium rounded-xl transition-all duration-200 text-[#151B49] hover:bg-[#72c6f5]/10 hover:text-[#72c6f5]"
													aria-expanded={mobileDropdownOpen === dropdownId}
												>
													<span>{link.label}</span>
													<svg
														className={`w-5 h-5 transition-transform duration-200 ${mobileDropdownOpen === dropdownId ? 'rotate-180' : ''
															}`}
														fill="none"
														stroke="currentColor"
														viewBox="0 0 24 24"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth={2}
															d="M19 9l-7 7-7-7"
														/>
													</svg>
												</button>

												{/* Mobile Dropdown Items */}
												{mobileDropdownOpen === dropdownId && (
													<div className="mt-1 ml-4 space-y-1">
														{item.subItems?.map((subItem, subIndex) => {
															const subLink = subItem.link
															if (!subLink) return null

															return (
																<div key={subIndex} onClick={closeMobileMenu}>
																	<CMSLink
																		{...subLink}
																		appearance="link"
																		className="cursor-pointer block px-4 py-2.5 text-sm transition-colors duration-200 rounded-lg text-[#151B49] hover:bg-[#151B49] hover:text-white no-underline hover:no-underline"
																	/>
																</div>
															)
														})}
													</div>
												)}
											</div>
										)
									}

									return (
										<div key={index} onClick={closeMobileMenu}>
											<CMSLink
												{...link}
												appearance="link"
												className="cursor-pointer block px-4 py-3 font-medium rounded-xl transition-all duration-200 text-[#151B49] hover:bg-[#151B49] hover:text-white no-underline hover:no-underline"
											/>
										</div>
									)
								})}

								{/* Mobile Search */}
								<div className="pt-4">
									<div className="flex items-center bg-white rounded-xl px-4 py-3 border border-gray-200">
										<input
											type="text"
											placeholder="Search"
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

								{/* Mobile CTA Button */}
								{showCtaButton && ctaButton?.link && (
									<div className="pt-4" onClick={closeMobileMenu}>
										<CMSLink
											{...ctaButton.link}
											appearance="link"
											className="cursor-pointer block w-full bg-[#151B49] text-white px-5 py-3 text-center font-medium hover:bg-[#72c6f5] hover:shadow-md transition-all duration-200 rounded-xl no-underline hover:no-underline"
										>
											{ctaButton.text}
										</CMSLink>
									</div>
								)}
							</div>
						</div>
					)}
				</div>
			</header>
			{/* Spacer to account for fixed header height */}
			<div className="h-16 lg:h-18" aria-hidden="true" />
		</>
	)
}
