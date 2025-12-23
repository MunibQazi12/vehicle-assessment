"use client"

import { useState } from "react"
import Image from "next/image"
import type { StaffGroup } from "@dealertower/types/api"

interface TeamGridProps {
  staffGroups: StaffGroup[]
}

export default function TeamGrid({ staffGroups }: TeamGridProps) {
  const [activeTab, setActiveTab] = useState<string>(staffGroups[0]?.group || "")
  const [expandedBios, setExpandedBios] = useState<Set<number>>(new Set())

  const truncateBio = (bio: string, maxLength = 150) => {
    if (bio.length <= maxLength) return bio
    return bio.slice(0, maxLength) + "..."
  }

  const toggleBio = (index: number) => {
    const newExpanded = new Set(expandedBios)
    if (newExpanded.has(index)) {
      newExpanded.delete(index)
    } else {
      newExpanded.add(index)
    }
    setExpandedBios(newExpanded)
  }

  const activeGroup = staffGroups.find(group => group.group === activeTab)
  const activeMembers = activeGroup?.members || []

  return (
    <>
      {/* Tabs */}
      <section className="bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex gap-2 bg-gray-100 p-1.5 rounded-full">
            {staffGroups.map((group) => (
              <button
                key={group.group}
                onClick={() => {
                  setActiveTab(group.group)
                  setExpandedBios(new Set()) // Reset expanded bios when switching tabs
                }}
                className={`px-8 py-3 font-sans font-semibold text-sm sm:text-base rounded-full transition-all duration-300 cursor-pointer ${
                  activeTab === group.group
                    ? "bg-[#151B49] text-white shadow-md"
                    : "text-gray-600 hover:text-[#151B49] hover:bg-white/50"
                }`}
              >
                {group.group}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Team Grid */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {activeMembers.map((member, index) => (
              <div
                key={`${member.name}-${index}`}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
              >
                {/* Image */}
                <div className="w-full h-96 sm:h-80 lg:h-96 bg-gray-100 relative">
                  {member.avatar_url ? (
                    <Image
                      src={member.avatar_url}
                      alt={member.name}
                      fill
                      className="object-cover object-center"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      priority={index < 4}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <svg
                        className="w-20 h-20 text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="font-sans font-bold text-[#151B49] text-xl mb-2">{member.name}</h3>
                  <p className="font-body text-[#151B49] text-sm font-medium mb-4 border-b border-gray-200 pb-3">
                    {member.role}
                  </p>

                  {member.description && (
                    <>
                      <p className="font-body text-gray-600 text-sm leading-relaxed mb-4">
                        {expandedBios.has(index) ? member.description : truncateBio(member.description)}
                      </p>

                      {member.description.length > 150 && (
                        <button
                          onClick={() => toggleBio(index)}
                          className="inline-flex items-center gap-2 px-4 py-1.5 bg-gray-100 text-gray-700 font-sans text-sm font-semibold rounded-full hover:bg-[#151B49] hover:text-white transition-all duration-300 mb-4 cursor-pointer"
                        >
                          {expandedBios.has(index) ? "Show Less" : "Show More"}
                          <svg
                            className={`w-4 h-4 transition-transform duration-300 ${expandedBios.has(index) ? "rotate-180" : ""}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      )}
                    </>
                  )}

                  {/* Email Icon */}
                  {member.email && (
                    <div className="flex items-center justify-start pt-3 border-t border-gray-200">
                      <a
                        href={`mailto:${member.email}`}
                        className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#72c6f5] hover:bg-[#151B49] transition-colors"
                        aria-label={`Email ${member.name}`}
                      >
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
