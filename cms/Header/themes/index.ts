/**
 * Predefined header themes
 * Each theme represents a different layout/structure
 */

export const HEADER_THEMES = {
  default: {
    label: 'Alpha',
    value: 'alpha',
  },
} as const

export type HeaderTheme = keyof typeof HEADER_THEMES

export const headerThemeOptions = Object.values(HEADER_THEMES).map((theme) => ({
  label: theme.label,
  value: theme.value,
}))
