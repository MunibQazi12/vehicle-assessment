'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'

const HeroTemplate1Modal = dynamic(() => import('./HeroTemplate1Modal'), {
  ssr: false,
  loading: () => null,
})

type TabKey = 'bodystyle' | 'price' | 'location'

const ctas = [
  { key: 'bodystyle' as TabKey, label: 'Search by body style' },
  { key: 'price' as TabKey, label: 'Search by price' },
  { key: 'location' as TabKey, label: 'Search by location' },
]

interface HeroCTAsProps {
  heroText?: string | null
  enableBodyStyleSearch?: boolean | null
  enablePriceSearch?: boolean | null
  enableLocationSearch?: boolean | null
}

export function HeroCTAsMobile({
  heroText,
  enableBodyStyleSearch,
  enablePriceSearch,
  enableLocationSearch,
}: HeroCTAsProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const [initialTab, setInitialTab] = useState<TabKey>('bodystyle')

  const activeCtas = ctas.filter((cta) => {
    if (cta.key === 'bodystyle') return enableBodyStyleSearch !== false
    if (cta.key === 'price') return enablePriceSearch !== false
    if (cta.key === 'location') return enableLocationSearch !== false
    return true
  })

  const openModal = (tab: TabKey) => {
    setInitialTab(tab)
    setModalOpen(true)
  }

  return (
    <>
      <div className="bg-white py-8 px-4">
        {heroText && (
          <h2 className="font-sans font-bold text-[#151B49] text-xl text-center mb-6">
            {heroText}
          </h2>
        )}
        <div className="flex flex-col items-center justify-center gap-3 max-w-sm mx-auto">
          {activeCtas.map((cta) => (
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
      <HeroTemplate1Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialTab={initialTab}
      />
    </>
  )
}

export function HeroCTAsDesktop({
  heroText,
  enableBodyStyleSearch,
  enablePriceSearch,
  enableLocationSearch,
}: HeroCTAsProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const [initialTab, setInitialTab] = useState<TabKey>('bodystyle')

  const activeCtas = ctas.filter((cta) => {
    if (cta.key === 'bodystyle') return enableBodyStyleSearch !== false
    if (cta.key === 'price') return enablePriceSearch !== false
    if (cta.key === 'location') return enableLocationSearch !== false
    return true
  })

  const openModal = (tab: TabKey) => {
    setInitialTab(tab)
    setModalOpen(true)
  }

  return (
    <>
      <div className="relative z-10 text-center px-4 max-w-6xl mx-auto flex flex-col justify-end items-center h-full pb-12 lg:pb-16">
        {heroText && (
          <h2 className="font-sans font-bold text-white text-3xl md:text-4xl mb-8 lg:mb-12 drop-shadow-lg px-4 lg:text-3xl">
            {heroText}
          </h2>
        )}

        <div className="flex flex-row items-center justify-center gap-4 lg:gap-6 px-4">
          {activeCtas.map((cta) => (
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
      <HeroTemplate1Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialTab={initialTab}
      />
    </>
  )
}
