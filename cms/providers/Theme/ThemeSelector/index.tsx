'use client'

import React from 'react'

// Dark theme is disabled - ThemeSelector returns null
// If you need to re-enable dark theme in the future:
// 1. Restore theme selection UI here
// 2. Update payload.config.ts admin.theme setting
// 3. Update ThemeProvider and InitTheme components
// 4. Uncomment dark theme CSS variables in globals.css
export const ThemeSelector: React.FC = () => {
  return null
}
