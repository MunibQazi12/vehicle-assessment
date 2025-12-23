'use client'

import React, { createContext, useCallback, use, useEffect, useState } from 'react'

import type { Theme, ThemeContextType } from './types'

// Dark theme is disabled - always use light theme
const FORCED_THEME: Theme = 'light'

const initialContext: ThemeContextType = {
	setTheme: () => null,
	theme: FORCED_THEME,
}

const ThemeContext = createContext(initialContext)

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
	// Always force light theme - state is constant
	const [theme] = useState<Theme>(FORCED_THEME)

	// Theme switching is disabled - always use light theme
	const setTheme = useCallback(() => {
		// No-op: dark theme is disabled, always stay on light
		document.documentElement.setAttribute('data-theme', FORCED_THEME)
	}, [])

	useEffect(() => {
		// Set light theme on mount only
		document.documentElement.setAttribute('data-theme', FORCED_THEME)
	}, [])

	return <ThemeContext value={{ setTheme, theme }}>{children}</ThemeContext>
}

export const useTheme = (): ThemeContextType => use(ThemeContext)
