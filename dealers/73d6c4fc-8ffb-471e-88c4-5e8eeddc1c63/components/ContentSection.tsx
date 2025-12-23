/**
 * ContentSection - Server Component
 * Flexible content section with optional image and CTA.
 * No client-side interactivity required.
 */

import Image from "next/image"
import Link from "next/link"
import type { ReactNode } from "react"
import { isExternalUrl } from "@dealertower/lib/utils"

interface ContentSectionProps {
  title: string
  subtitle?: string
  highlight?: string
  description: string | ReactNode
  ctaText?: string
  ctaLink?: string
  ctaPosition?: "content" | "image"
  imageSrc?: string
  imageAlt?: string
  imageWidth?: number
  imageHeight?: number
  imagePriority?: boolean
  imagePosition?: "left" | "right"
  backgroundColor?: "white" | "navy" | "light"
  children?: ReactNode
}

export default function ContentSection({
  title,
  subtitle,
  highlight,
  description,
  ctaText,
  ctaLink,
  ctaPosition = "content",
  imageSrc,
  imageAlt,
  imageWidth = 500,
  imageHeight = 400,
  imagePriority = false,
  imagePosition = "right",
  backgroundColor = "white",
  children,
}: ContentSectionProps) {
  const bgClasses = {
    white: "bg-gradient-to-b from-gray-50 to-white",
    navy: "bg-[#151B49]",
    light: "bg-gradient-to-b from-white to-gray-50",
  }

  const textColor = backgroundColor === "navy" ? "text-white" : "text-[#151B49]"
  const descColor = backgroundColor === "navy" ? "text-gray-200" : "text-gray-700"

  const CTAButton = ctaText && ctaLink && (
    isExternalUrl(ctaLink) ? (
      <a
        href={ctaLink}
        target="_blank"
        rel="noopener noreferrer"
        className="cursor-pointer inline-block bg-[#72c6f5] text-white px-8 py-3.5 font-sans font-semibold hover:bg-[#151B49] hover:shadow-md transition-all duration-200"
      >
        {ctaText}
      </a>
    ) : (
      <Link
        href={ctaLink}
        className="cursor-pointer inline-block bg-[#72c6f5] text-white px-8 py-3.5 font-sans font-semibold hover:bg-[#151B49] hover:shadow-md transition-all duration-200"
      >
        {ctaText}
      </Link>
    )
  )

  return (
    <section className={`py-12 md:py-16 lg:py-24 ${bgClasses[backgroundColor]}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Content Side */}
          <div
            className={`text-center lg:text-left ${imagePosition === "left" ? "order-2 lg:order-2" : "order-2 lg:order-1"}`}
          >
            <h2
              className={`font-sans font-bold text-2xl sm:text-3xl lg:text-2xl ${textColor} mb-3 lg:mb-4 leading-tight`}
            >
              {title}
            </h2>

            {subtitle && (
              <p
                className={`font-sans font-bold text-3xl sm:text-4xl lg:text-4xl ${highlight ? "text-[#72c6f5]" : textColor} mb-6 lg:mb-8`}
              >
                {subtitle}
              </p>
            )}

            {typeof description === "string" ? (
              <p
                className={`font-sans ${descColor} text-sm sm:text-base lg:text-lg leading-relaxed mb-6 lg:mb-8 max-w-xl mx-auto lg:mx-0`}
              >
                {description}
              </p>
            ) : (
              <div className="mb-6 lg:mb-8">{description}</div>
            )}

            {children}

            {ctaPosition === "content" && CTAButton}
          </div>

          {/* Image Side */}
          {imageSrc && (
            <div
              className={`flex flex-col items-center ${imagePosition === "left" ? "lg:items-start order-1 lg:order-1" : "lg:items-end order-1 lg:order-2"} gap-6`}
            >
              <div className="relative w-full max-w-sm sm:max-w-md rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-shadow duration-300">
                <Image
                  src={imageSrc}
                  alt={imageAlt || ""}
                  width={imageWidth}
                  height={imageHeight}
                  priority={imagePriority}
                  className="w-full h-auto"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 448px"
                />
              </div>

              {ctaPosition === "image" && CTAButton}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
