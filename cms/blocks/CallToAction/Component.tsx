import React from 'react'

import type { CallToActionBlock as CTABlockProps } from '@dtcms/payload-types'

import RichText from '@dtcms/components/RichText'
import { CMSLink } from '@dtcms/components/Link'

export const CallToActionBlock: React.FC<CTABlockProps> = ({ links, richText }) => {
  return (
    <div className="container">
      <div className="bg-card rounded border-border border p-4 flex flex-col gap-8 md:flex-row md:justify-between md:items-center">
        <div className="max-w-[48rem] flex items-center">
          {richText && <RichText className="mb-0" data={richText} enableGutter={false} />}
        </div>
        <div className="flex flex-col gap-8">
          {(links || [])
            .filter((item) => item && typeof item === 'object' && item.link)
            .map(({ link }, i) => {
              return <CMSLink key={i} size="lg" {...link} />
            })}
        </div>
      </div>
    </div>
  )
}
