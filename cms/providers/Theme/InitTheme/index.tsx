import Script from 'next/script'
import React from 'react'

// Dark theme is disabled - always use light theme
const FORCED_THEME = 'light'

export const InitTheme: React.FC = () => {
  return (
    // eslint-disable-next-line @next/next/no-before-interactive-script-outside-document
    <Script
      dangerouslySetInnerHTML={{
        __html: `
  (function () {
    // Dark theme is disabled - always force light theme
    document.documentElement.setAttribute('data-theme', '${FORCED_THEME}');
  })();
  `,
      }}
      id="theme-script"
      strategy="beforeInteractive"
    />
  )
}
