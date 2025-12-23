import type { Theme } from './types'

// Dark theme is disabled - these constants are kept for compatibility
export const themeLocalStorageKey = 'payload-theme'
export const defaultTheme: Theme = 'light'

// Dark theme is disabled - always returns light theme
export const getImplicitPreference = (): Theme => {
  return 'light'
}
