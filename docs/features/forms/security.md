# Form Security

## Overview

Forms handle sensitive user data and must be protected against common web vulnerabilities.

## CSRF Protection (Cross-Site Request Forgery)

### What is CSRF?

Attacker tricks user into submitting form from malicious site. CSRF protection ensures requests originate from your app.

### Token-Based Protection

Generate unique token per form:

```typescript
// packages/lib/security/csrf.ts

import { randomBytes } from 'crypto';

export async function generateCSRFToken(): Promise<string> {
  // Generate random token
  const token = randomBytes(32).toString('hex');
  
  // Store in Redis (or memory in dev)
  const store = getTokenStore();
  await store.set(
    `csrf:${token}`,
    { createdAt: Date.now(), used: false },
    { ex: 3600 } // 1 hour expiry
  );
  
  return token;
}

export async function verifyCSRFToken(token: string): Promise<boolean> {
  const store = getTokenStore();
  const tokenData = await store.get(`csrf:${token}`);
  
  if (!tokenData) {
    return false; // Token doesn't exist
  }
  
  // Check if already used
  if (tokenData.used) {
    return false; // Token already consumed
  }
  
  // Mark as used and delete
  await store.delete(`csrf:${token}`);
  
  return true;
}
```

### In Forms

Include token in every form:

```typescript
export async function GetPreApprovedForm() {
  const csrfToken = await generateCSRFToken();
  
  return (
    <form action={submitForm}>
      <input
        type="hidden"
        name="csrf_token"
        value={csrfToken}
      />
      {/* form fields */}
    </form>
  );
}
```

### Verification

Verify token on submission:

```typescript
'use server';

export async function submitForm(formData: FormData) {
  const csrfToken = formData.get('csrf_token') as string;
  
  // Verify token
  if (!await verifyCSRFToken(csrfToken)) {
    throw new Error('Invalid form submission');
  }
  
  // Process form...
}
```

### Redis Storage (Production)

For distributed deployments, use Redis:

```typescript
// packages/lib/security/csrf.ts

import { createClient } from 'redis';

const redis = createClient({
  url: process.env.REDIS_URL,
});

export async function generateCSRFToken(): Promise<string> {
  const token = randomBytes(32).toString('hex');
  
  await redis.set(
    `csrf:${token}`,
    JSON.stringify({ createdAt: Date.now() }),
    { EX: 3600 }
  );
  
  return token;
}

export async function verifyCSRFToken(token: string): Promise<boolean> {
  const data = await redis.get(`csrf:${token}`);
  
  if (!data) return false;
  
  // Delete token (single use)
  await redis.del(`csrf:${token}`);
  
  return true;
}
```

Environment:
```bash
# .env.production
REDIS_URL=redis://cache.example.com:6379
```

## Rate Limiting

### What is Rate Limiting?

Prevent spam by limiting form submissions per IP/user.

### IP-Based Limiting

```typescript
// packages/lib/security/rate-limit.ts

export async function checkRateLimit(
  ip: string,
  endpoint: string,
  maxRequests: number = 5,
  windowSeconds: number = 60
): Promise<{ allowed: boolean; remaining: number }> {
  const key = `ratelimit:${endpoint}:${ip}`;
  const store = getStore(); // Redis or in-memory
  
  const current = await store.incr(key);
  
  if (current === 1) {
    // First request, set expiry
    await store.expire(key, windowSeconds);
  }
  
  const allowed = current <= maxRequests;
  const remaining = Math.max(0, maxRequests - current);
  
  return { allowed, remaining };
}
```

### In Form Handler

```typescript
'use server';

export async function submitForm(formData: FormData) {
  // Get client IP
  const ip = getClientIP();
  
  // Check rate limit
  const { allowed } = await checkRateLimit(
    ip,
    '/api/forms/submit/',
    5, // 5 requests
    60 // per 60 seconds
  );
  
  if (!allowed) {
    throw new Error('Too many requests. Try again later.');
  }
  
  // Process form...
}
```

### Configuration

```bash
# .env
RATE_LIMIT_MAX_REQUESTS=5
RATE_LIMIT_WINDOW_SECONDS=60
```

### Response Headers

Include rate limit info in response:

```typescript
return new Response(
  JSON.stringify({ error: 'Rate limited' }),
  {
    status: 429,
    headers: {
      'X-RateLimit-Limit': '5',
      'X-RateLimit-Remaining': '0',
      'X-RateLimit-Reset': futureTimestamp.toString(),
    },
  }
);
```

## Input Validation

### Client-Side

HTML5 validation (UX, not security):

```typescript
<form>
  <input
    type="email"
    name="email"
    required
    pattern="[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
    placeholder="your@email.com"
  />
  
  <input
    type="tel"
    name="phone"
    required
    pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
    placeholder="123-456-7890"
  />
  
  <textarea
    name="message"
    maxLength={500}
    required
  />
  
  <button type="submit">Submit</button>
</form>
```

### Server-Side (Critical)

Always validate on server:

```typescript
'use server';

import { z } from 'zod';

const FormSchema = z.object({
  email: z.string().email('Invalid email'),
  phone: z.string().regex(/^\d{3}-\d{3}-\d{4}$/, 'Invalid phone'),
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  message: z.string().max(500),
  vehicleVin: z.string().length(17),
});

export async function submitForm(formData: FormData) {
  const data = Object.fromEntries(formData);
  
  // Validate with schema
  const result = FormSchema.safeParse(data);
  
  if (!result.success) {
    throw new ValidationError(result.error.message);
  }
  
  const { email, phone, message } = result.data;
  
  // Process validated data...
}
```

## Input Sanitization

### XSS Prevention

Prevent cross-site scripting by sanitizing output:

```typescript
import DOMPurify from 'isomorphic-dompurify';

export function sanitizeInput(input: string): string {
  return DOMPurify.sanitize(input);
}

// Use in form:
const cleanMessage = sanitizeInput(formData.message);
await saveToDB(cleanMessage);
```

### Never Trust User Input

❌ Wrong:
```typescript
const html = `<div>${userMessage}</div>`; // XSS vulnerability
```

✅ Correct:
```typescript
<div>{userMessage}</div>  // React escapes by default
```

## SQL Injection Prevention

### Use Prepared Statements

Always use parameterized queries:

❌ Wrong:
```typescript
const query = `SELECT * FROM forms WHERE email = '${email}'`;
```

✅ Correct:
```typescript
const query = 'SELECT * FROM forms WHERE email = ?';
db.execute(query, [email]);
```

## Email Verification (Optional)

Verify email before processing:

```typescript
'use server';

export async function submitForm(formData: FormData) {
  const email = formData.get('email');
  
  // Send verification email with token
  const token = generateRandomToken();
  await saveVerificationToken(email, token);
  await sendVerificationEmail(email, token);
  
  return {
    success: true,
    message: 'Check your email to verify'
  };
}

export async function verifyEmail(token: string, email: string) {
  const valid = await validateToken(token, email);
  if (!valid) throw new Error('Invalid token');
  
  // Mark as verified
  await markEmailVerified(email);
}
```

## Response Validation

Ensure API responses don't leak sensitive data:

```typescript
'use server';

export async function submitForm(formData: FormData) {
  try {
    // Process form...
    const result = await saveFormSubmission(data);
    
    // Only return necessary info
    return {
      success: true,
      submissionId: result.id,
      // Don't return: passwords, tokens, internal IDs
    };
  } catch (error) {
    // Don't leak internal errors
    return {
      success: false,
      error: 'An error occurred. Please try again.',
      // Don't return: error.message, stack trace
    };
  }
}
```

## Secure Headers

Add security headers to form responses:

```typescript
// next.config.ts
export default {
  headers: [
    {
      source: '/api/forms/:path*',
      headers: [
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
        {
          key: 'X-XSS-Protection',
          value: '1; mode=block',
        },
      ],
    },
  ],
};
```

## Logging & Monitoring

### Log Form Submissions

Track for security analysis:

```typescript
export async function submitForm(formData: FormData) {
  const ip = getClientIP();
  const timestamp = new Date();
  
  // Log submission
  await logFormSubmission({
    ip,
    email: formData.get('email'),
    formType: formData.get('form_type'),
    timestamp,
    userAgent: getHeaderUserAgent(),
  });
  
  // Process...
}
```

### Detect Suspicious Activity

```typescript
const recentCount = await getRecentSubmissions(ip, 60); // last 60 seconds
if (recentCount > 10) {
  // Suspicious activity - block or require CAPTCHA
  await alertSecurityTeam(ip);
  throw new Error('Suspicious activity detected');
}
```

## CAPTCHA Integration (Optional)

Add CAPTCHA to prevent bot submissions:

```typescript
'use client';
import ReCAPTCHA from 'react-google-recaptcha';

export function GetPreApprovedForm() {
  const [captchaToken, setCaptchaToken] = useState(null);
  
  return (
    <form>
      <ReCAPTCHA
        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
        onChange={setCaptchaToken}
      />
      <button disabled={!captchaToken}>Submit</button>
    </form>
  );
}
```

Server verification:

```typescript
'use server';

export async function submitForm(formData: FormData) {
  const captchaToken = formData.get('captcha_token');
  
  // Verify with Google
  const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${captchaToken}`,
  });
  
  const data = await response.json();
  
  if (!data.success || data.score < 0.5) {
    throw new Error('CAPTCHA verification failed');
  }
  
  // Process...
}
```

## Security Checklist

- [ ] CSRF token generated and validated
- [ ] Rate limiting enabled
- [ ] Input validation on server
- [ ] Input sanitized before storage
- [ ] SQL injection prevented (prepared statements)
- [ ] XSS prevention (output escaping)
- [ ] Secure error messages (no internal details)
- [ ] Logging implemented
- [ ] Security headers set
- [ ] HTTPS only (TLS)
- [ ] Sensitive data not logged
- [ ] CAPTCHA enabled (optional)

## Related Documentation

- [Forms Overview](./overview.md) - Form architecture
- [Environment Variables](../../deployment/environment-variables.md) - Redis config
- [Security](../../deployment/vercel.md) - Production security
