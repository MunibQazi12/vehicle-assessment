import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'

import type { Header as HeaderType } from '@dtcms/payload-types'

// Import theme components
import { AlphaHeader } from './themes/alpha/Component.client'

async function getHeader(): Promise<HeaderType | null> {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.findGlobal({
    slug: 'header',
    depth: 2,
  })

  return result as HeaderType
}

const getCachedHeader = () =>
  unstable_cache(async () => getHeader(), ['header'], {
    tags: ['global_header'],
  })

export async function Header() {
  const headerData = await getCachedHeader()()

  // Determine which theme component to render
  const theme = headerData?.theme || 'alpha'

  // Map theme to component
  const themeComponents: Record<string, typeof AlphaHeader> = {
    alpha: AlphaHeader,
    default: AlphaHeader,
  }
  const ThemeComponent = themeComponents[theme] || AlphaHeader

  return <ThemeComponent data={headerData} />
}
