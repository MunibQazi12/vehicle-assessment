'use client'
import Link from 'next/link'
import React from 'react'

import type { Footer } from '@dtcms/payload-types'

import { ThemeSelector } from '@dtcms/providers/Theme/ThemeSelector'
import { CMSLink } from '@dtcms/components/Link'
import { Logo } from '@dtcms/components/Logo/Logo'

interface FooterClientProps {
  data: Footer | null
}

export const FooterClient: React.FC<FooterClientProps> = ({ data }) => {
  const homePath = '/'

  const navItems = data?.navItems || []

  return (
    <footer className="mt-auto border-t border-border bg-black dark:bg-card text-white">
      <div className="container py-8 gap-8 flex flex-col md:flex-row md:justify-between">
        <Link className="flex items-center" href={homePath}>
          <Logo />
        </Link>

        <div className="flex flex-col-reverse items-start md:flex-row gap-4 md:items-center">
          <ThemeSelector />
          <nav className="flex flex-col md:flex-row gap-4">
            {navItems
              .filter((item) => item && typeof item === 'object' && item.link)
              .map(({ link }, i) => {
                return <CMSLink className="text-white" key={i} {...link} />
              })}
          </nav>
        </div>
      </div>
    </footer>
  )
}
