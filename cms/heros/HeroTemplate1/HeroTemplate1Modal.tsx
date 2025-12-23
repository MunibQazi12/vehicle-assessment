'use client'

import React from 'react'

type TabKey = 'bodystyle' | 'price' | 'location'

interface HeroTemplate1ModalProps {
  isOpen: boolean
  onClose: () => void
  initialTab: TabKey
}

export default function HeroTemplate1Modal({
  isOpen,
  onClose,
  initialTab,
}: HeroTemplate1ModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white p-8 rounded-lg max-w-md w-full relative shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
        <h2 className="text-2xl font-bold mb-4 capitalize">Search by {initialTab}</h2>
        <p className="text-gray-600 mb-6">
          This is a placeholder for the vehicle search modal functionality.
        </p>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-[#151B49] text-white px-4 py-2 rounded hover:bg-[#0f1335]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
