import { cn } from '@dtcms/utilities/ui'
import React from 'react'

type SpacerBlockProps = {
  size?: 'small' | 'medium' | 'large' | 'xlarge'
  blockType: 'spacer'
}

type Props = {
  className?: string
} & SpacerBlockProps

export const SpacerBlock: React.FC<Props> = ({ className, size = 'medium' }) => {
  const sizeClasses = {
    small: 'h-8', // 2rem
    medium: 'h-16', // 4rem
    large: 'h-24', // 6rem
    xlarge: 'h-32', // 8rem
  }

  return (
    <div
      className={cn('w-full', sizeClasses[size], className)}
      aria-hidden="true"
    />
  )
}
