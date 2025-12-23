# Website Information API

## Overview

The Website Information API provides dealer metadata, configuration, and website scripts. Use this API to fetch dealer-specific branding, hours, and third-party scripts (GTM, chat widgets, tracking).

## Endpoint

```
POST https://api.dealertower.com/public/{hostname}/v2/dealers/website-information
```

## Request

### Parameters

```typescript
interface WebsiteInformationRequest {
  hostname: string;  // Required: dealer hostname (e.g., "www.nissanofportland.com")
}
```

### Example Request

```typescript
import { fetchWebsiteInformation } from '@dealertower/lib/api/dealer';

// In Server Component
const dealerInfo = await fetchWebsiteInformation(dealerId);
```

Or using fetch directly:

```typescript
const response = await fetch(
  'https://api.dealertower.com/public/www.nissanofportland.com/v2/dealers/website-information',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      hostname: 'www.nissanofportland.com'
    }),
    next: {
      revalidate: 86400,  // Cache for 24 hours
      tags: ['dealer:nissan-portland', 'website-info']
    }
  }
);

const dealerInfo = await response.json();
```

## Response

### Full Response Structure

```typescript
interface WebsiteInformationResponse {
  // Dealer Identification
  dealer_id: string;              // UUID: "494a1788-0619-4a53-99c1-1c9f9b2e8fcc"
  name: string;                   // "Nissan of Portland"
  brand: string;                  // Manufacturer brand (optional)
  
  // Contact Information
  address: string;                // Full address: "123 Auto Street, Portland, OR 97201"
  city: string;
  state: string;                  // State abbreviation: "OR"
  zip: string;
  phone: string;                  // Phone number: "(503) 555-0123"
  email: string;                  // Email: "sales@nissanofportland.com"
  website: string;                // Website URL
  
  // Branding
  logo_url: string;               // Logo asset URL: "/api/assets/logo.png"
  colors: {
    primary: string;              // Primary brand color: "#1e40af"
    secondary?: string;           // Secondary color: "#0891b2"
    accent?: string;              // Accent color: "#f97316"
  };
  
  // Hours of Operation
  hours: {
    monday: string;               // "9:00 AM - 8:00 PM"
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;             // "9:00 AM - 6:00 PM"
    sunday: string;               // "11:00 AM - 5:00 PM" or "Closed"
    holidays?: {
      [date: string]: string;     // "2024-12-25": "Closed"
    };
  };
  
  // Business Information
  established?: number;           // Year: 1995
  service_available: boolean;     // Has service department
  financing_available: boolean;   // Offers financing
  trade_in_available: boolean;    // Accepts trade-ins
  warranty_available?: boolean;   // Extended warranties
  
  // Website Scripts (GTM, chat widgets, pixels, etc.)
  scripts: {
    head: Array<{                 // Inject in <head>
      type: "script" | "link" | "meta" | "style";
      content: string;            // Full HTML to inject
      attributes?: {
        id?: string;
        async?: boolean;
        defer?: boolean;
        src?: string;
        [key: string]: any;
      };
    }>;
    before_body_close: Array<{    // Inject before </body>
      type: "script" | "noscript";
      content: string;
    }>;
    after_body_open?: Array<{     // Inject after <body> (optional)
      type: "script" | "div";
      content: string;
    }>;
  };
  
  // Certified Logos (OEM Badges)
  certifications: Array<{
    name: string;                 // "Nissan Certified Pre-Owned"
    logo_url: string;             // Badge image URL
    type: "manufacturer" | "program" | "award";
  }>;
  
  // Navigation Structure (optional)
  navigation?: {
    main: Array<{
      label: string;
      url: string;
      children?: Array<{ label: string; url: string }>;
    }>;
  };
  
  // Legal/Compliance
  disclaimers?: {
    pricing?: string;             // Price disclaimer text
    inventory?: string;           // Inventory disclaimer
    financing?: string;           // Financing terms
  };
  
  // Additional Configuration
  settings?: {
    show_reviews?: boolean;
    show_financing_calculator?: boolean;
    show_trade_in_form?: boolean;
    enable_chat?: boolean;
    enable_notifications?: boolean;
  };
}
```

### Example Response

```json
{
  "dealer_id": "494a1788-0619-4a53-99c1-1c9f9b2e8fcc",
  "name": "Nissan of Portland",
  "brand": "Nissan",
  "address": "123 Auto Street",
  "city": "Portland",
  "state": "OR",
  "zip": "97201",
  "phone": "(503) 555-0123",
  "email": "sales@nissanofportland.com",
  "website": "https://www.nissanofportland.com",
  "logo_url": "/api/assets/logo.png",
  "colors": {
    "primary": "#1e40af",
    "secondary": "#0891b2"
  },
  "hours": {
    "monday": "9:00 AM - 8:00 PM",
    "tuesday": "9:00 AM - 8:00 PM",
    "wednesday": "9:00 AM - 8:00 PM",
    "thursday": "9:00 AM - 8:00 PM",
    "friday": "9:00 AM - 8:00 PM",
    "saturday": "9:00 AM - 6:00 PM",
    "sunday": "11:00 AM - 5:00 PM"
  },
  "established": 1995,
  "service_available": true,
  "financing_available": true,
  "trade_in_available": true,
  "scripts": {
    "head": [
      {
        "type": "script",
        "content": "<script async src='https://www.googletagmanager.com/gtag/js?id=G-XXXXXX'></script>",
        "attributes": { "async": true }
      }
    ],
    "before_body_close": [
      {
        "type": "script",
        "content": "<script>\nwindow.dataLayer = window.dataLayer || [];\nfunction gtag(){dataLayer.push(arguments);}\ngtag('js', new Date());\ngtag('config', 'G-XXXXXX');\n</script>"
      }
    ]
  },
  "certifications": [
    {
      "name": "Nissan Certified Pre-Owned",
      "logo_url": "https://...",
      "type": "manufacturer"
    }
  ]
}
```

## Common Use Cases

### Fetch and Display Dealer Hours

```typescript
'use client';

import { useEffect, useState } from 'react';
import { fetchWebsiteInformation } from '@dealertower/lib/api/dealer';

export function DealerHours({ dealerId }: { dealerId: string }) {
  const [hours, setHours] = useState(null);

  useEffect(() => {
    fetchWebsiteInformation(dealerId).then((info) => {
      setHours(info.hours);
    });
  }, [dealerId]);

  if (!hours) return <div>Loading hours...</div>;

  return (
    <div className="space-y-2">
      <h3 className="font-bold">Hours</h3>
      {Object.entries(hours).map(([day, time]) => (
        <div key={day} className="flex justify-between">
          <span className="capitalize">{day}</span>
          <span>{time}</span>
        </div>
      ))}
    </div>
  );
}
```

### Display Dealer Information in Header

```typescript
import { getTenantContext } from '@dealertower/lib/tenant/server-context';
import Image from 'next/image';

export async function DealerHeader() {
  const { websiteInfo } = await getTenantContext();
  if (!websiteInfo) return null;

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Image
            src={websiteInfo.logo_url}
            alt={websiteInfo.name}
            width={200}
            height={75}
            priority
          />
        </div>
        <div className="text-right">
          <p className="font-bold">{websiteInfo.name}</p>
          <p className="text-sm text-gray-600">{websiteInfo.phone}</p>
        </div>
      </div>
    </header>
  );
}
```

### Inject Website Scripts

```typescript
import { getTenantContext } from '@dealertower/lib/tenant/server-context';

export async function HeadScripts() {
  const { websiteInfo } = await getTenantContext();

  if (!websiteInfo?.scripts?.head) {
    return null;
  }

  return (
    <>
      {websiteInfo.scripts.head.map((script, index) => (
        <div key={index} dangerouslySetInnerHTML={{ __html: script.content }} />
      ))}
    </>
  );
}
```

### Display Certifications

```typescript
import { fetchWebsiteInformation } from '@dealertower/lib/api/dealer';

export async function CertificationBadges({ dealerId }: { dealerId: string }) {
  const dealerInfo = await fetchWebsiteInformation(dealerId);

  return (
    <div className="flex gap-4">
      {dealerInfo.certifications?.map((cert) => (
        <div key={cert.name} title={cert.name}>
          <img src={cert.logo_url} alt={cert.name} height={60} />
        </div>
      ))}
    </div>
  );
}
```

## Caching Strategy

Cache Website Information responses aggressively (24 hours):

```typescript
fetch(url, {
  method: 'POST',
  body: JSON.stringify({ hostname }),
  next: {
    revalidate: 86400,  // 24 hours
    tags: [
      `dealer:${dealerId}`,
      'website-info',
      'website-scripts'
    ]
  }
})
```

Invalidate via webhook:

```bash
curl -X POST https://your-site.com/api/revalidate/ \
  -H "x-revalidation-secret: secret" \
  -d '{"tags":["website-scripts"]}'
```

## Error Handling

Handle missing or invalid data:

```typescript
async function getDealerInfo(dealerId: string) {
  try {
    const info = await fetchWebsiteInformation(dealerId);
    
    // Provide defaults
    const hours = info.hours || getDefaultHours();
    const logo = info.logo_url || '/default-logo.png';
    const scripts = info.scripts || { head: [], before_body_close: [] };
    
    return { ...info, hours, logo, scripts };
  } catch (error) {
    console.error('Failed to fetch dealer info:', error);
    return null;
  }
}

function getDefaultHours() {
  return {
    monday: 'Call for hours',
    tuesday: 'Call for hours',
    // ... etc
  };
}
```

## Troubleshooting

### Missing Scripts

**Problem**: Scripts object is empty

**Solutions**:
1. Verify scripts are configured in Dealer Tower admin
2. Check API response in Network tab
3. Ensure dealer account is active

### Logo Not Loading

**Problem**: Logo URL returns 404

**Solutions**:
1. Verify logo uploaded to dealer's public assets
2. Check path: `/api/assets/logo.png`
3. File should be in `dealers/{uuid}/public/logo.png`

### Hours Not Formatted

**Problem**: Hours string not user-friendly

**Solution**: Parse and format hours manually:

```typescript
function formatHours(hours: Record<string, string>) {
  return Object.entries(hours).map(([day, time]) => ({
    day: day.charAt(0).toUpperCase() + day.slice(1),
    time: time === 'Closed' ? 'Closed' : time
  }));
}
```

## Related Documentation

- [API Overview](./overview.md) - API fundamentals
- [SRP Endpoints](./endpoints.md) - Vehicle inventory endpoints
- [Dealer Customization](../dealer-customization/overview.md) - Using dealer info
- [Website Scripts](../features/scripts/overview.md) - Script injection details
