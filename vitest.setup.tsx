/// <reference types="vitest/globals" />
import '@testing-library/jest-dom/vitest'
import React from 'react'

// Mock Next.js Image component
vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: { src: string; alt: string; [key: string]: unknown }) => {
    return React.createElement('img', { src, alt, ...props })
  },
}))

// Mock Next.js navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
  useParams: () => ({}),
}))

// Mock environment variables for tests
process.env.NEXTJS_APP_HOSTNAME = 'www.tonkin.com'
process.env.NEXTJS_APP_DEALER_ID = '73d6c4fc-8ffb-471e-88c4-5e8eeddc1c63'
