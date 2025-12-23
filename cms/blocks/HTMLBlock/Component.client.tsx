'use client'

import React, { useEffect, useRef } from 'react'
import DOMPurify from 'isomorphic-dompurify'

type HTMLContentProps = {
  htmlContent: string
  enableScripts?: boolean
}

export const HTMLContent: React.FC<HTMLContentProps> = ({ htmlContent, enableScripts = false }) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current || !enableScripts) return

    // If scripts are enabled, find and execute them
    const scripts = containerRef.current.querySelectorAll('script')
    scripts.forEach((script) => {
      const newScript = document.createElement('script')
      
      // Copy attributes
      Array.from(script.attributes).forEach((attr) => {
        newScript.setAttribute(attr.name, attr.value)
      })
      
      // Copy content
      newScript.textContent = script.textContent
      
      // Replace old script with new one to trigger execution
      script.parentNode?.replaceChild(newScript, script)
    })
  }, [htmlContent, enableScripts])

  // Sanitize HTML to prevent XSS attacks
  const sanitizedHTML = React.useMemo(() => {
    // Extract style tags before sanitization and reinsert after
    const styleRegex = /<style[^>]*>[\s\S]*?<\/style>/gi
    const styleTags = htmlContent.match(styleRegex) || []
    
    // Create a placeholder for style tags
    let htmlWithPlaceholders = htmlContent
    styleTags.forEach((styleTag, index) => {
      htmlWithPlaceholders = htmlWithPlaceholders.replace(styleTag, `<div data-style-placeholder="${index}"></div>`)
    })
    
    // Configure DOMPurify with safe defaults
    const config = {
      ADD_TAGS: ['link', 'iframe'],
      ADD_ATTR: [
        'target', 'rel', 'href', 'class', 'id', 'style', 
        'itemscope', 'itemtype', 'itemprop', 'content',
        'alt', 'width', 'height', 'src', 'frameborder', 'allowfullscreen',
        'data-style-placeholder'
      ],
      ALLOW_DATA_ATTR: true,
      KEEP_CONTENT: true,
      ALLOW_UNKNOWN_PROTOCOLS: false,
    }

    // If scripts are enabled, allow script tags
    if (enableScripts) {
      config.ADD_TAGS.push('script')
      config.ADD_ATTR.push('async', 'defer', 'type', 'charset')
    }

    // Sanitize the HTML with placeholders
    let sanitized = DOMPurify.sanitize(htmlWithPlaceholders, config) as string
    
    // Reinsert style tags by replacing placeholders
    styleTags.forEach((styleTag, index) => {
      sanitized = (sanitized as string).replace(
        `<div data-style-placeholder="${index}"></div>`,
        styleTag
      )
    })
    
    return sanitized
  }, [htmlContent, enableScripts])

  return (
    <div
      ref={containerRef}
      className="html-block-content"
      dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
    />
  )
}
