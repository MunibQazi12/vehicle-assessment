"use client"

import dynamic from "next/dynamic"
import { useState } from "react"

const VehicleSearchModal = dynamic(() => import("./VehicleSearchModal"), {
	ssr: false,
	loading: () => null,
})

type TabKey = "bodystyle" | "price" | "location"

const ctas = [
	{ key: "bodystyle" as TabKey, label: "Search by body style" },
	{ key: "price" as TabKey, label: "Search by price" },
	{ key: "location" as TabKey, label: "Search by location" },
]

export function HeroCTAsMobile() {
	const [modalOpen, setModalOpen] = useState(false)
	const [initialTab, setInitialTab] = useState<TabKey>("bodystyle")

	const openModal = (tab: TabKey) => {
		setInitialTab(tab)
		setModalOpen(true)
	}

	return (
		<>
			<div className="bg-white py-8 px-4">
				<div className="text-center mb-6">
					<p className="font-sans text-[#151B49] text-sm mb-3">
						WELCOME TO TONKIN.COM
					</p>
					<h1 className="font-sans font-bold text-[#151B49] text-xl">
						THE LARGEST SELECTION OF VEHICLES IN PORTLAND
					</h1>
				</div>
				<div className="flex flex-col items-center justify-center gap-3 max-w-sm mx-auto">
					{ctas.map((cta) => (
						<button
							key={cta.key}
							onClick={() => openModal(cta.key)}
							className="cursor-pointer bg-[#72c6f5] text-white px-6 py-3 font-sans font-semibold hover:bg-[#151B49] hover:shadow-md transition-all duration-200 w-full"
						>
							{cta.label}
						</button>
					))}
				</div>
			</div>
			<VehicleSearchModal isOpen={modalOpen} onClose={() => setModalOpen(false)} initialTab={initialTab} />
		</>
	)
}

export function HeroCTAsDesktop() {
	const [modalOpen, setModalOpen] = useState(false)
	const [initialTab, setInitialTab] = useState<TabKey>("bodystyle")

	const openModal = (tab: TabKey) => {
		setInitialTab(tab)
		setModalOpen(true)
	}

	return (
		<>
			<div className="relative z-10 text-center px-4 max-w-6xl mx-auto flex flex-col justify-end items-center h-full pb-12 lg:pb-1">
				<div className="mb-8 lg:mb-12">
					<p className="font-sans text-white text-lg lg:text-xl mb-4 drop-shadow-lg">
						WELCOME TO TONKIN.COM
					</p>
					<h1 className="font-sans font-bold text-white text-2xl lg:text-3xl drop-shadow-lg">
						THE LARGEST SELECTION OF VEHICLES IN PORTLAND
					</h1>
				</div>

				<div className="flex flex-row items-center justify-center gap-4 lg:gap-6 px-4">
					{ctas.map((cta) => (
						<button
							key={cta.key}
							onClick={() => openModal(cta.key)}
							className="cursor-pointer bg-[#72c6f5] text-white px-8 py-4 font-sans font-semibold hover:bg-[#151B49] hover:shadow-md transition-all duration-200 min-w-[200px] lg:min-w-[220px]"
						>
							{cta.label}
						</button>
					))}
				</div>
			</div>
			<VehicleSearchModal isOpen={modalOpen} onClose={() => setModalOpen(false)} initialTab={initialTab} />
		</>
	)
}
