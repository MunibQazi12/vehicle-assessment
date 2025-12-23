# Form Implementation Examples

## Overview

Real-world examples of common form implementations in the dt-nextjs platform.

## Test Drive Request Form

### Component

```tsx
'use client';

import { FormEvent, useState } from 'react';
import { Vehicle } from '@dealertower/types/vehicle';

interface Props {
  vehicle: Vehicle;
}

export function TestDriveForm({ vehicle }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    try {
      const response = await fetch('/api/forms/test-drive/', {
        method: 'POST',
        body: JSON.stringify({
          firstName: formData.get('firstName'),
          lastName: formData.get('lastName'),
          email: formData.get('email'),
          phone: formData.get('phone'),
          preferredDate: formData.get('preferredDate'),
          preferredTime: formData.get('preferredTime'),
          vehicleId: vehicle.id,
          message: formData.get('message'),
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      setSuccess(true);
      e.currentTarget.reset();

      // Auto-hide success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
        <h3 className="text-lg font-bold text-green-800 mb-2">
          Test Drive Scheduled!
        </h3>
        <p className="text-green-700">
          Thank you for your interest. We'll confirm your test drive appointment shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-bold">Schedule a Test Drive</h2>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold mb-1">First Name *</label>
          <input
            type="text"
            name="firstName"
            required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-bold mb-1">Last Name *</label>
          <input
            type="text"
            name="lastName"
            required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold mb-1">Email *</label>
        <input
          type="email"
          name="email"
          required
          className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-bold mb-1">Phone *</label>
        <input
          type="tel"
          name="phone"
          required
          className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold mb-1">Preferred Date *</label>
          <input
            type="date"
            name="preferredDate"
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-bold mb-1">Preferred Time *</label>
          <select
            name="preferredTime"
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="">Select a time</option>
            <option value="09:00">9:00 AM</option>
            <option value="10:00">10:00 AM</option>
            <option value="11:00">11:00 AM</option>
            <option value="13:00">1:00 PM</option>
            <option value="14:00">2:00 PM</option>
            <option value="15:00">3:00 PM</option>
            <option value="16:00">4:00 PM</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold mb-1">Additional Comments</label>
        <textarea
          name="message"
          rows={4}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white font-bold py-3 rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? 'Scheduling...' : 'Schedule Test Drive'}
      </button>
    </form>
  );
}
```

### Usage on Vehicle Detail Page

```tsx
import { TestDriveForm } from '@dealertower/components/forms/TestDriveForm';

export default function VehicleDetailPage() {
  const vehicle = await fetchVehicle();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-2">
        <VehicleGallery vehicle={vehicle} />
        <VehicleSpecs vehicle={vehicle} />
      </div>

      <div className="md:col-span-1">
        <TestDriveForm vehicle={vehicle} />
      </div>
    </div>
  );
}
```

## Pre-Approved Financing Form

### Component

```tsx
'use client';

import { FormEvent, useState } from 'react';
import { submitPreApprovedRequest } from '@dealertower/lib/api/forms';

export function PreApprovedForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loanAmount, setLoanAmount] = useState(25000);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    try {
      const response = await fetch('/api/forms/pre-approved/', {
        method: 'POST',
        body: JSON.stringify({
          firstName: formData.get('firstName'),
          lastName: formData.get('lastName'),
          email: formData.get('email'),
          phone: formData.get('phone'),
          desiredLoanAmount: parseInt(formData.get('loanAmount') as string),
          creditScore: formData.get('creditScore'),
          employmentStatus: formData.get('employmentStatus'),
          zipCode: formData.get('zipCode'),
          tradeInValue: formData.get('tradeInValue'),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      setSuccess(true);
      e.currentTarget.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
        <h3 className="text-lg font-bold text-green-800">Pre-Approval Submitted!</h3>
        <p className="text-green-700 mt-2">
          We'll review your application and contact you within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-bold">Get Pre-Approved for Financing</h2>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold mb-1">First Name *</label>
          <input type="text" name="firstName" required className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-bold mb-1">Last Name *</label>
          <input type="text" name="lastName" required className="w-full border rounded px-3 py-2" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold mb-1">Email *</label>
        <input type="email" name="email" required className="w-full border rounded px-3 py-2" />
      </div>

      <div>
        <label className="block text-sm font-bold mb-1">Phone *</label>
        <input type="tel" name="phone" required className="w-full border rounded px-3 py-2" />
      </div>

      <div>
        <label className="block text-sm font-bold mb-1">
          Desired Loan Amount: ${loanAmount.toLocaleString()}
        </label>
        <input
          type="range"
          name="loanAmount"
          min="10000"
          max="100000"
          step="5000"
          value={loanAmount}
          onChange={(e) => setLoanAmount(parseInt(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-600 mt-1">
          <span>$10,000</span>
          <span>$100,000</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold mb-1">Credit Score Range</label>
        <select name="creditScore" className="w-full border rounded px-3 py-2">
          <option value="">Select range</option>
          <option value="excellent">Excellent (750+)</option>
          <option value="good">Good (700-749)</option>
          <option value="fair">Fair (650-699)</option>
          <option value="poor">Fair Credit</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-bold mb-1">Employment Status</label>
        <select name="employmentStatus" className="w-full border rounded px-3 py-2">
          <option value="">Select status</option>
          <option value="employed">Employed</option>
          <option value="self-employed">Self-Employed</option>
          <option value="retired">Retired</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold mb-1">Zip Code</label>
          <input type="text" name="zipCode" className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-bold mb-1">Trade-In Value</label>
          <input type="number" name="tradeInValue" className="w-full border rounded px-3 py-2" />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-600 text-white font-bold py-3 rounded hover:bg-green-700 disabled:bg-gray-400"
      >
        {loading ? 'Submitting...' : 'Get Pre-Approved'}
      </button>
    </form>
  );
}
```

## Quick Contact Form (Modal)

### Component

```tsx
'use client';

import { FormEvent, useState } from 'react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicleTitle?: string;
  vehicleId?: string;
}

export function ContactModal({ isOpen, onClose, vehicleTitle, vehicleId }: ContactModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    try {
      const response = await fetch('/api/forms/quick-contact/', {
        method: 'POST',
        body: JSON.stringify({
          name: formData.get('name'),
          phone: formData.get('phone'),
          email: formData.get('email'),
          inquiryType: formData.get('inquiryType'),
          vehicleId,
          message: formData.get('message'),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit');
      }

      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Contact Us</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        {vehicleTitle && (
          <p className="text-sm text-gray-600 mb-4">
            Interested in: <strong>{vehicleTitle}</strong>
          </p>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-bold mb-1">Name *</label>
            <input
              type="text"
              name="name"
              required
              className="w-full border rounded px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-1">Phone *</label>
            <input
              type="tel"
              name="phone"
              required
              className="w-full border rounded px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-1">Email *</label>
            <input
              type="email"
              name="email"
              required
              className="w-full border rounded px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-1">How can we help?</label>
            <select name="inquiryType" className="w-full border rounded px-3 py-2 text-sm">
              <option value="general">General Inquiry</option>
              <option value="pricing">Pricing Question</option>
              <option value="availability">Availability</option>
              <option value="trade-in">Trade-In Value</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold mb-1">Message</label>
            <textarea
              name="message"
              rows={3}
              className="w-full border rounded px-3 py-2 text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 text-sm"
          >
            {loading ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>
    </div>
  );
}
```

### Usage

```tsx
import { useState } from 'react';
import { ContactModal } from '@dealertower/components/forms/ContactModal';

export function VehicleCard({ vehicle }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="border rounded-lg p-4">
        <h3>{vehicle.title}</h3>
        <p>${vehicle.price}</p>
        <button
          onClick={() => setShowModal(true)}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
        >
          Contact Dealer
        </button>
      </div>

      <ContactModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        vehicleTitle={vehicle.title}
        vehicleId={vehicle.id}
      />
    </>
  );
}
```

## Best Practices Summary

### Form State Management

- Use `useState` for form state
- Track `loading`, `error`, and `success` states separately
- Reset form on successful submission
- Clear errors when user starts typing again

### Validation

- Always include `required` attribute on HTML inputs
- Use email/tel input types for validation
- Validate on the server (never trust client-side only)
- Show clear error messages

### User Experience

- Disable submit button while loading
- Show success/error messages clearly
- Auto-hide success messages after 5 seconds
- Make labels descriptive
- Group related fields

### Security

- Never send sensitive data in URL params
- Always POST forms (not GET)
- Include CSRF protection token
- Validate and sanitize inputs server-side
- Rate limit submissions

### Accessibility

- Use proper `<label>` elements
- Include ARIA labels if needed
- Ensure keyboard navigation works
- Use semantic HTML

## Related Documentation

- [Forms Overview](./overview.md) - Form architecture and patterns
- [Forms Security](./security.md) - CSRF, validation, sanitization
- [CTA Buttons](../deployment/performance.md) - Form performance optimization
