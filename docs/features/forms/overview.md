# Forms System Overview

## What Forms Are Available?

The platform includes several form types for user interactions:

### 1. CTA Forms (Call-To-Action)
Used on SRP and VDP to capture leads:
- **Get Pre-Approved** - Financing application
- **Schedule Test Drive** - Schedule appointment
- **Request Information** - General inquiry
- **Make an Offer** - Purchase intent

### 2. Contact Forms
General dealer contact forms:
- **Contact Dealer** - Direct message
- **Business Inquiry** - Commercial inquiries

### 3. Custom Forms
Dealer-specific forms created per dealer customization.

## Architecture

### Server Components

Forms are rendered as Server Components by default:

```typescript
// packages/components/forms/GetPreApprovedForm.tsx

import { submitForm } from '@dealertower/lib/forms/submit';

export async function GetPreApprovedForm({ vehicleVin }) {
  return (
    <form action={submitForm}>
      <input type="hidden" name="form_type" value="pre_approved" />
      <input type="hidden" name="vehicle_vin" value={vehicleVin} />
      
      <input
        type="email"
        name="email"
        placeholder="Email"
        required
      />
      <input
        type="tel"
        name="phone"
        placeholder="Phone"
        required
      />
      <textarea
        name="message"
        placeholder="Comments"
      />
      
      <button type="submit">Get Pre-Approved</button>
    </form>
  );
}
```

### Client-Side Interaction

Forms can have client-side enhancements:

```typescript
'use client';
import { useState } from 'react';

export function GetPreApprovedFormEnhanced({ vehicleVin }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  async function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    
    try {
      const response = await fetch('/api/forms/submit/', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) throw new Error('Form submission failed');
      
      // Show success message
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }
  
  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      {error && <div className="error">{error}</div>}
      <button disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
}
```

## Form Data Collection

### Form Fields

**Common fields**:
- Email (required)
- Phone (required)
- First Name
- Last Name
- Message/Comments
- Preferred Contact Method
- Preferred Contact Time

**Vehicle-specific fields**:
- VIN (hidden)
- Vehicle Name (auto-filled)
- Trade-in Vehicle (optional)

**Context fields** (auto-attached):
- Hostname (tenant context)
- Dealer ID (tenant context)
- User IP (for logging)
- Timestamp
- Referrer URL

## Form Submission

### Server Action

```typescript
// packages/lib/forms/submit.ts

'use server';

import { getTenantContext } from '@dealertower/lib/tenant/server-context';

export async function submitForm(formData: FormData) {
  const { hostname } = await getTenantContext();
  
  // Validate CSRF token
  const csrfToken = formData.get('csrf_token');
  if (!validateCSRFToken(csrfToken)) {
    throw new Error('Invalid CSRF token');
  }
  
  // Extract form data
  const email = formData.get('email');
  const phone = formData.get('phone');
  const formType = formData.get('form_type');
  
  // Validate
  if (!email || !phone) {
    throw new Error('Missing required fields');
  }
  
  // Save to database
  const submission = await saveFormSubmission({
    hostname,
    dealerId: hostname, // hostname is lowercase and serves as dealer ID
    formType,
    email,
    phone,
    // ...
  });
  
  // Send notification email
  await sendFormNotification(submission);
  
  return { success: true };
}
```

### API Route

Alternatively, handle via API route:

```typescript
// app/api/forms/submit/route.ts

import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  // Verify CSRF token
  const csrfToken = request.headers.get('x-csrf-token');
  if (!verifyCSRFToken(csrfToken)) {
    return new Response('Invalid CSRF token', { status: 403 });
  }
  
  const formData = await request.json();
  
  // Validate, save, send email
  
  return Response.json({ success: true });
}
```

## CSRF Protection

### Token Generation

Generate CSRF token in form:

```typescript
import { generateCSRFToken } from '@dealertower/lib/security/csrf';

export async function GetPreApprovedForm() {
  const token = await generateCSRFToken();
  
  return (
    <form>
      <input type="hidden" name="csrf_token" value={token} />
      {/* form fields */}
    </form>
  );
}
```

### Token Storage

**Default**: In-memory (development)  
**Production**: Redis (via `REDIS_URL` env)

```typescript
// packages/lib/security/csrf.ts

export async function generateCSRFToken(): Promise<string> {
  const token = generateRandomString(32);
  
  // Store in Redis or memory
  await tokenStore.set(
    `csrf:${token}`,
    Date.now(),
    { ex: 3600 } // 1 hour
  );
  
  return token;
}

export async function verifyCSRFToken(token: string): Promise<boolean> {
  const exists = await tokenStore.exists(`csrf:${token}`);
  if (exists) {
    // Token used, delete it
    await tokenStore.delete(`csrf:${token}`);
    return true;
  }
  return false;
}
```

## Validation

### Client-Side

HTML5 validation:
- `required` - Field is required
- `type="email"` - Valid email format
- `pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"` - Phone format

```typescript
<input
  type="email"
  name="email"
  required
  aria-label="Email address"
/>
```

### Server-Side

Always validate on server:

```typescript
'use server';

export async function submitForm(formData: FormData) {
  const email = formData.get('email');
  const phone = formData.get('phone');
  
  // Validate email
  if (!email || !isValidEmail(email)) {
    throw new ValidationError('Invalid email');
  }
  
  // Validate phone
  if (!phone || !isValidPhone(phone)) {
    throw new ValidationError('Invalid phone');
  }
  
  // Sanitize input to prevent XSS
  const sanitized = sanitizeInput(formData);
  
  // Process...
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone: string): boolean {
  return /^\d{3}-\d{3}-\d{4}$/.test(phone);
}
```

## Rate Limiting

Prevent spam via rate limiting (optional):

```typescript
// packages/lib/security/rate-limit.ts

export async function checkRateLimit(
  ip: string,
  endpoint: string,
  maxRequests: number = 5
): Promise<boolean> {
  const key = `ratelimit:${ip}:${endpoint}`;
  const current = await redis.incr(key);
  
  if (current === 1) {
    // First request, set expiry
    await redis.expire(key, 60); // 1 minute window
  }
  
  return current <= maxRequests;
}
```

Configuration via env:
```bash
RATE_LIMIT_MAX_REQUESTS=5  # max requests per minute
```

## Notification Emails

### Dealer Notification

When form is submitted, notify dealer:

```typescript
async function sendFormNotification(submission) {
  const dealerEmail = await getDealerEmail(submission.dealerId);
  
  await sendEmail({
    to: dealerEmail,
    subject: `New ${submission.formType} Request`,
    html: renderEmailTemplate('form-notification', submission),
  });
}
```

### Confirmation Email

Send confirmation to customer:

```typescript
async function sendCustomerConfirmation(submission) {
  await sendEmail({
    to: submission.email,
    subject: 'We Received Your Request',
    html: renderEmailTemplate('form-confirmation', submission),
  });
}
```

## Form States

### Initial
```typescript
<form>
  <input defaultValue="" />
  <button>Submit</button>
</form>
```

### Submitting
```typescript
<form>
  <input disabled defaultValue="" />
  <button disabled>Submitting...</button>
</form>
```

### Success
```typescript
<div className="success-message">
  Thank you! We'll contact you soon.
</div>
```

### Error
```typescript
<form>
  <div className="error-message">
    An error occurred. Please try again.
  </div>
  <input defaultValue="" />
  <button>Submit</button>
</form>
```

## Modal Forms

Display forms in modals/dialogs:

```typescript
'use client';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@dealertower/components/ui/dialog';

export function TestDriveModal({ vehicleVin, isOpen, onClose }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Schedule Test Drive</DialogTitle>
        </DialogHeader>
        <ScheduleTestDriveForm
          vehicleVin={vehicleVin}
          onSuccess={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}
```

## Mobile Considerations

- Large touch targets (minimum 44x44px)
- Vertical input layout
- Avoid hover interactions
- Keyboard-friendly
- Phone number input for tel input on mobile
- Conditional address fields

## Analytics

Track form interactions:

```typescript
'use client';

export function FormWithAnalytics({ formType, vehicleVin }) {
  function trackSubmit() {
    gtag.event('form_submit', {
      form_type: formType,
      vehicle_vin: vehicleVin,
    });
  }
  
  return (
    <form onSubmit={trackSubmit}>
      {/* fields */}
    </form>
  );
}
```

## Testing Checklist

- [ ] Form submits successfully
- [ ] Validation works (required fields)
- [ ] CSRF token validates
- [ ] Success message displays
- [ ] Error handling works
- [ ] Confirmation email sent
- [ ] Dealer notification sent
- [ ] Rate limiting works (if enabled)
- [ ] Mobile layout works
- [ ] Accessibility compliant

## Related Documentation

- [Form Security](./security.md) - CSRF, rate limiting, validation
- [Form Examples](./examples.md) - Common form implementations
- [SRP Overview](../srp/overview.md) - Using forms on search
- [VDP Overview](../vdp/overview.md) - Using forms on detail
