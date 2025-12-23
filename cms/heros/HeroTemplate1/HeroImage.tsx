import React from 'react'
import { ImageMedia } from '@dtcms/components/Media/ImageMedia'
import type { Media } from '@dtcms/payload-types'

interface HeroImageProps {
  media?: Media | string | null
}

export function HeroImageMobile({ media }: HeroImageProps) {
  return (
    <div className="relative w-full aspect-square overflow-hidden">
      {media && typeof media === 'object' && (
        <ImageMedia
          resource={media}
          fill
          priority
          loading="eager"
          imgClassName="object-cover object-top"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/30" />
    </div>
  )
}

export function HeroImageDesktop({ media }: HeroImageProps) {
  return (
    <div className="absolute inset-0 z-0">
      {media && typeof media === 'object' && (
        <ImageMedia
          resource={media}
          fill
          priority
          loading="eager"
          imgClassName="object-cover object-top"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50" />
    </div>
  )
}
