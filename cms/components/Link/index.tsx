'use client'
import { Button, type ButtonProps } from '@dtcms/components/ui/button'
import { cn } from '@dtcms/utilities/ui'
import Link from 'next/link'
import React from 'react'

import type { Page } from '@dtcms/payload-types'

export type CMSLinkType = {
  appearance?: 'inline' | ButtonProps['variant']
  children?: React.ReactNode
  className?: string
  label?: string | null
  newTab?: boolean | null
  reference?: {
    relationTo: 'pages'
    value: Page | string | number
  } | null
  size?: ButtonProps['size'] | null
  type?: 'custom' | 'reference' | 'none' | null
  url?: string | null
}

export const CMSLink: React.FC<CMSLinkType> = (props) => {
  const {
    type,
    appearance = 'inline',
    children,
    className,
    label,
    newTab,
    reference,
    size: sizeFromProps,
    url,
  } = props

  // Handle "no URL" type - render as span instead of link
  if (type === 'none') {
    if (appearance === 'inline') {
      return (
        <span className={cn(className)}>
          {label}
          {children}
        </span>
      )
    }

    return (
      <Button asChild={false} className={className} size={sizeFromProps} variant={appearance}>
        {label}
        {children}
      </Button>
    )
  }

  // Build href for links
  let href: string | null = null

  if (type === 'reference' && typeof reference?.value === 'object' && reference.value.slug) {
    const basePath = reference?.relationTo !== 'pages' ? `/${reference?.relationTo}` : ''
    const slugPath = `${basePath}/${reference.value.slug}`
    href = slugPath
  } else if (url) {
    href = url
  }

  if (!href) return null

  const size = appearance === 'link' ? 'clear' : sizeFromProps
  const newTabProps = newTab ? { rel: 'noopener noreferrer', target: '_blank' } : {}

  /* Ensure we don't break any styles set by richText */
  if (appearance === 'inline') {
    return (
      <Link className={cn(className)} href={href} {...newTabProps}>
        {label}
        {children}
      </Link>
    )
  }

  return (
    <Button asChild className={className} size={size} variant={appearance}>
      <Link className={cn(className)} href={href} {...newTabProps}>
        {label}
        {children}
      </Link>
    </Button>
  )
}
