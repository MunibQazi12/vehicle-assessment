'use client'
import React, { useEffect, useMemo, useState } from 'react'
import { SelectInput, TextInput, useField } from '@payloadcms/ui'
import type { OptionObject, TextFieldClientComponent } from 'payload'
import type { FormsListAPIResponse } from '@dealertower/types'

// Helper to extract label string from Payload's StaticLabel type
const getLabel = (label: string | Record<string, string> | undefined | false, fallback: string): string => {
	if (!label) return fallback
	if (typeof label === 'string') return label
	// For i18n labels, return the first available translation or fallback
	return Object.values(label)[0] || fallback
}

const FormSelectField: TextFieldClientComponent = ({ field, path }) => {
	const { value, setValue } = useField<string>({ path })
	const [options, setOptions] = useState<OptionObject[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const fetchForms = async () => {
			try {
				setLoading(true)
				setError(null)

				// Use internal API route which reads hostname from environment variables
				const response = await fetch('/api/forms/')

				if (!response.ok) {
					throw new Error('Failed to fetch forms')
				}

				const data: FormsListAPIResponse = await response.json()

				if (data.success && Array.isArray(data.data)) {
					setOptions(
						data.data.map((form) => ({
							label: form.label,
							value: form.id,
						}))
					)
				} else {
					throw new Error(data.error || 'Invalid response format')
				}
			} catch (err) {
				setError(err instanceof Error ? err.message : 'Failed to load forms')
				console.error('Error fetching forms:', err)
			} finally {
				setLoading(false)
			}
		}

		fetchForms()
	}, [])

	const selectedFormLabel = useMemo(() => {
		const v = value || ''
		const opt = options.find((o) => o.value === v)
		if (!opt) return null
		const label = opt.label
		if (typeof label === 'string') return label
		if (label && typeof label === 'object') return Object.values(label)[0] || null
		return null
	}, [options, value])

	return (
		<div className="field-type text">
			{error ? (
				<TextInput
					path={path}
					label={getLabel(field.label, field.name)}
					required={field.required}
					description={field.admin?.description}
					value={value || ''}
					onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
					placeholder="Enter Form ID manually"
					showError
					Error={<div className="field-error">{error}</div>}
				/>
			) : (
				<SelectInput
					name={field.name}
					path={path}
					label={field.label}
					required={field.required}
					description={field.admin?.description}
					options={options}
					value={value || ''}
					isClearable
					placeholder={loading ? 'Loading forms…' : 'Select a form'}
					readOnly={loading}
					onChange={(selected) => {
						// ReactSelect adapter returns an option object or null (for single select)
						const nextValue = (selected as unknown as { value?: string } | null)?.value
						setValue(nextValue || '')
					}}
				/>
			)}

			{value && !error ? (
				<div className="field-description" style={{ marginTop: 6 }}>
					Form ID: <code>{value}</code>
					{selectedFormLabel ? (
						<>
							{' '}
							— <span>{selectedFormLabel}</span>
						</>
					) : null}
				</div>
			) : null}
		</div>
	)
}

export default FormSelectField
