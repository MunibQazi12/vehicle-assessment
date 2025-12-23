import React from 'react'
import { cn } from '@dtcms/utilities/ui'
import type { ColumnsBlockType } from '@dtcms/payload-types'
import { RenderBlocks } from '@dtcms/blocks/RenderBlocks'

type Props = ColumnsBlockType & {
  className?: string
  disableInnerContainer?: boolean
}

export const ColumnsBlock: React.FC<Props> = (props) => {
  const { columns, gapSize, verticalAlign, className, disableInnerContainer } = props

  // Column width classes mapping
  const colsSpanClasses: Record<string, string> = {
    full: 'col-span-12',
    twoThirds: 'col-span-12 lg:col-span-8',
    half: 'col-span-12 lg:col-span-6',
    oneThird: 'col-span-12 lg:col-span-4',
    oneQuarter: 'col-span-12 lg:col-span-3',
  }

  // Gap size classes
  const gapClasses: Record<string, string> = {
    none: 'gap-0',
    small: 'gap-4',
    medium: 'gap-8',
    large: 'gap-12',
    xl: 'gap-16',
  }

  // Vertical alignment classes
  const alignClasses: Record<string, string> = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
  }

  if (!columns || columns.length === 0) {
    return null
  }

  return (
    <div className={cn('columns-block my-8', className)}>
      <div className={cn({ container: !disableInnerContainer })}>
        <div
          className={cn(
            'grid grid-cols-12',
            gapSize ? gapClasses[gapSize] : 'gap-8',
            verticalAlign ? alignClasses[verticalAlign] : 'items-start'
          )}
        >
          {columns.map((column, index) => {
            const { size, blocks } = column

            return (
              <div
                key={index}
                className={cn(colsSpanClasses[size || 'half'])}
              >
                {blocks && blocks.length > 0 && (
                  <RenderBlocks blocks={blocks} />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default ColumnsBlock
