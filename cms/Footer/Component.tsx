import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import { unstable_cache } from 'next/cache'

import type { Footer as FooterType } from '@dtcms/payload-types'

// Import theme components
import AlphaFooter from './themes/alpha/Component.client'
import type { FooterTheme } from './themes'

async function getFooter(): Promise<FooterType | null> {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.findGlobal({
    slug: 'footer',
    depth: 1,
  })

  return result as FooterType
}

const getCachedFooter = () =>
  unstable_cache(async () => getFooter(), ['footer'], {
    tags: ['global_footer'],
  })

export async function Footer() {
  const footerData = await getCachedFooter()()

  // Determine which theme component to render
  const theme = (footerData?.theme as FooterTheme) || 'alpha'

  // Map theme to component
  const ThemeComponent =
    {
      alpha: AlphaFooter,
    }[theme] || AlphaFooter

  return <ThemeComponent />
}
