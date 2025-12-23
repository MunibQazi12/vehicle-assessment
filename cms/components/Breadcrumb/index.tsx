import React from 'react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { cn } from '@dtcms/utilities/ui'

import type { Page } from '@dtcms/payload-types'

interface BreadcrumbProps {
  breadcrumbs?: Page['breadcrumbs']
  className?: string
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ breadcrumbs, className }) => {
  if (!breadcrumbs || breadcrumbs.length === 0) {
    return null
  }

  return (
    <nav aria-label="Breadcrumb" className={cn('container py-4', className)}>
      <ol className="flex items-center gap-2 text-sm">
        {/* Home link */}
        <li>
          <Link
            href="/"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Home
          </Link>
        </li>

        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1

          return (
            <React.Fragment key={crumb.id || index}>
              <li>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </li>
              <li>
                {isLast ? (
                  <span className="text-foreground font-medium" aria-current="page">
                    {crumb.label}
                  </span>
                ) : (
                  <Link
                    href={crumb.url || '#'}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {crumb.label}
                  </Link>
                )}
              </li>
            </React.Fragment>
          )
        })}
      </ol>
    </nav>
  )
}
