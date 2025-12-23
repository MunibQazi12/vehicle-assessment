'use client'
import React from 'react'
import { useField } from '@payloadcms/ui'
import type { TextFieldClientComponent } from 'payload'

// Helper to extract label string from Payload's StaticLabel type
const getLabel = (label: string | Record<string, string> | undefined | false, fallback: string): string => {
  if (!label) return fallback
  if (typeof label === 'string') return label
  // For i18n labels, return the first available translation or fallback
  return Object.values(label)[0] || fallback
}

const ColorPickerField: TextFieldClientComponent = ({ field, path }) => {
  const { value, setValue } = useField<string>({ path })

  return (
    <div className="field-type text">
      <label className="field-label" htmlFor={path}>
        {getLabel(field.label, field.name)}
        {field.required && <span className="required">*</span>}
      </label>
      <div className="flex items-center gap-3">
        <input
          type="color"
          id={path}
          value={value || '#151B49'}
          onChange={(e) => setValue(e.target.value)}
          className="h-10 w-20 cursor-pointer rounded border border-border bg-background"
        />
        <input
          type="text"
          value={value || '#151B49'}
          onChange={(e) => setValue(e.target.value)}
          placeholder="#151B49"
          className="flex h-10 w-full rounded border border-border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
      </div>
      {field.admin?.description && (
        <div className="field-description text-sm text-muted-foreground mt-2">
          {getLabel(field.admin.description, '')}
        </div>
      )}
    </div>
  )
}

export default ColorPickerField
