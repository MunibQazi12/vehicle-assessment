# Website Scripts Overview

## What Are Website Scripts?

Third-party scripts that dealers want to inject into their pages:
- Google Tag Manager / Analytics
- Chat widgets (Intercom, Drift, etc.)
- Conversion tracking (Facebook Pixel, etc.)
- Customer service (Zendesk, Freshdesk, etc.)
- Marketing automation (HubSpot, Marketo, etc.)

## How It Works

### 1. Dealer Configuration

Dealer configures scripts in their dealer settings:
- Script code (HTML/JavaScript)
- Placement location (head, before body, after body)
- Page type (all pages, SRP only, VDP only)

### 2. API Returns Script Data

Website Information API returns configured scripts:

```typescript
const websiteInfo = await fetchWebsiteInformation(hostname);

websiteInfo.scripts = [
  {
    id: 1,
    name: 'Google Tag Manager',
    code: '<script>...</script>',
    placement: 'head',
    location: 'everywhere',
  },
  {
    id: 2,
    name: 'Chat Widget',
    code: '<script>...</script>',
    placement: 'before_body',
    location: 'everywhere',
  },
];
```

### 3. Scripts Injected into Page

Scripts are placed in appropriate locations:

```html
<!DOCTYPE html>
<html>
<head>
  <!-- head scripts injected here -->
  <script>/* Google Tag Manager */</script>
</head>
<body>
  <!-- before_body scripts injected here -->
  <script>/* Chat Widget */</script>
  
  {/* Page content */}
  
  <!-- after_body scripts injected here -->
  <script>/* Analytics */</script>
</body>
</html>
```

## Script Locations

### Head

**When**: Loaded before page renders  
**Use case**: Global analytics, verification scripts  
**Risk**: Blocks page rendering if slow

```typescript
<HeadScripts scripts={websiteInfo.scripts} />
```

### Before Body (Body Start)

**When**: After body tag opens  
**Use case**: Chat widgets, initial setup  
**Risk**: Low, doesn't block rendering

```typescript
<BodyScriptsStart scripts={websiteInfo.scripts} />
{/* Page content */}
<BodyScriptsEnd scripts={websiteInfo.scripts} />
```

### After Body (Body End)

**When**: Before closing body tag  
**Use case**: Tracking, analytics, non-critical  
**Best practice**: Preferred location

## Script Placements

**Placement types**:
- `head` - In `<head>` tag
- `before_body` - Start of `<body>`
- `after_body` - End of `<body>`

**Locations**:
- `everywhere` - All pages
- `srp` - Search Results Pages only
- `vdp` - Vehicle Detail Pages only
- `dealer` - Dealer-specific pages

## Implementation

### Root Layout

Inject head scripts:

```typescript
// app/layout.tsx

import { HeadScripts } from '@dealertower/components/scripts/HeadScripts';
import { BodyScripts } from '@dealertower/components/scripts/BodyScripts';

export default async function RootLayout({ children }) {
  const websiteInfo = await fetchWebsiteInformation(dealerId, hostname);
  
  return (
    <html>
      <head>
        <HeadScripts scripts={websiteInfo.scripts} />
      </head>
      <body>
        <BodyScripts 
          scripts={websiteInfo.scripts} 
          placement="before_body"
        />
        
        {children}
        
        <BodyScripts 
          scripts={websiteInfo.scripts} 
          placement="after_body"
        />
      </body>
    </html>
  );
}
```

### HeadScripts Component

```typescript
// packages/components/scripts/HeadScripts.tsx

export async function HeadScripts({ scripts }) {
  const headScripts = scripts.filter(
    (s) => s.placement === 'head' && shouldInclude(s)
  );
  
  return (
    <>
      {headScripts.map((script) => (
        <script
          key={script.id}
          dangerouslySetInnerHTML={{ __html: script.code }}
        />
      ))}
    </>
  );
}
```

### BodyScripts Component

```typescript
// packages/components/scripts/BodyScripts.tsx

export async function BodyScripts({ scripts, placement }) {
  const filtered = scripts.filter(
    (s) => s.placement === placement && shouldInclude(s)
  );
  
  return (
    <>
      {filtered.map((script) => (
        <script
          key={script.id}
          dangerouslySetInnerHTML={{ __html: script.code }}
        />
      ))}
    </>
  );
}
```

## Location Detection

Determine which page type user is on:

```typescript
export function determineLocation(pathname: string): 
  'srp' | 'vdp' | 'dealer' | 'other' {
  if (pathname.includes('/new-vehicles') || pathname.includes('/used-vehicles')) {
    return 'srp';
  }
  if (pathname.includes('/vehicle/')) {
    return 'vdp';
  }
  if (pathname.includes('/dealer/')) {
    return 'dealer';
  }
  return 'other';
}
```

Use in component:

```typescript
export function ScriptsWrapper({ children, location }) {
  const websiteInfo = await fetchWebsiteInformation(dealerId, hostname);
  
  const applicableScripts = websiteInfo.scripts.filter((s) => {
    return s.location === 'everywhere' || s.location === location;
  });
  
  return (
    <>
      <BodyScripts scripts={applicableScripts} placement="before_body" />
      {children}
      <BodyScripts scripts={applicableScripts} placement="after_body" />
    </>
  );
}
```

## Filter Scripts

### shouldInclude Helper

```typescript
function shouldInclude(script: Script): boolean {
  // Don't include if scripts disabled globally
  if (process.env.DISABLE_WEBSITE_SCRIPTS === '1') {
    return false;
  }
  
  // Don't include if no code
  if (!script.code || script.code.trim() === '') {
    return false;
  }
  
  return true;
}
```

## Common Scripts

### Google Tag Manager (GTM)

**Placement**: head  
**Location**: everywhere

```html
<script>
  (function(w,d,s,l,i){
    w[l]=w[l]||[];
    w[l].push({'gtm.start': new Date().getTime(), event:'gtm.js'});
    var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
    j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
    f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer','GTM-XXXXX');
</script>
```

### Chat Widget (Intercom)

**Placement**: before_body  
**Location**: everywhere

```html
<script>
  window.intercomSettings = {
    api_base: "https://api-iam.intercom.io",
    app_id: "YOUR_APP_ID"
  };
  
  (function(){var w=window;var ic=w.Intercom;
  if(typeof ic==="function"){ic('reattach_activator');
  ic('update',intercomSettings);}else{
  var d=document;var i=function(){i.c(arguments)};
  i.q=[];i.c=function(args){i.q.push(args)};
  w.Intercom=i;
  var l=function(){var s=d.createElement('script');
  s.type='text/javascript';s.async=true;
  s.src='https://widget.intercom.io/widget/YOUR_APP_ID';
  var x=d.getElementsByTagName('script')[0];
  x.parentNode.insertBefore(s,x);};
  if(w.attachEvent){w.attachEvent('onload',l);}
  else{w.addEventListener('load',l,false);}}})()
</script>
```

### Facebook Pixel

**Placement**: head  
**Location**: everywhere

```html
<script>
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', 'YOUR_PIXEL_ID');
  fbq('track', 'PageView');
</script>
```

## Environment Control

Disable all scripts in development:

```bash
# .env.local
DISABLE_WEBSITE_SCRIPTS=1
```

Or enable scripts:

```bash
# .env.local
DISABLE_WEBSITE_SCRIPTS=0
```

Check in component:

```typescript
if (process.env.DISABLE_WEBSITE_SCRIPTS === '1') {
  // Don't load scripts
  return null;
}
```

## Caching

Scripts are cached with website information:

```typescript
const websiteInfo = await fetchWebsiteInformation(dealerId, hostname);
// Cache key: {hostname}:{path}:websiteinfo
// TTL: 6 hours
// Tags: hostname:*, dealer:*, website:info
```

Invalidate scripts when updated:

```bash
curl -X POST https://site.com/api/revalidate/ \
  -H "x-revalidation-secret: SECRET" \
  -d '{"hostname": "www.dealer.com", "tags": ["website:info"]}'
```

## Performance Considerations

### Load Order
1. **Critical** (head): GTM, verification scripts
2. **Important** (before_body): Chat, customer service
3. **Analytics** (after_body): Tracking, analytics

### Async Loading
Load scripts asynchronously to not block page:

```html
<script async src="..."></script>
<script defer src="..."></script>
```

### Script Size
Monitor script size impact:
- Each script should be < 100KB
- Total scripts should be < 500KB
- Warn if scripts slow down page

## Security Considerations

### XSS Risk
Scripts can execute arbitrary code. Verify:
- Scripts come from trusted sources
- Scripts are properly formatted
- No injected malicious code

### Performance Risk
Too many scripts = slow pages:
- Monitor Core Web Vitals
- Set script size limits
- Warn if over limit

## Troubleshooting

### Scripts Not Loading

Check:
1. `DISABLE_WEBSITE_SCRIPTS` not set to 1
2. API returns scripts
3. Script code not empty
4. Browser console for errors

### Scripts Loading Slowly

Check:
1. Script size
2. Third-party server status
3. Network tab for timing
4. Consider async/defer loading

### Script Conflicts

Check:
1. Multiple instances of same script
2. Conflicting libraries
3. Global variable conflicts

## Related Documentation

- [Website Information API](../../api-reference/website-information.md) - Script API
- [Performance](../../deployment/performance.md) - Web Vitals impact
- [Caching](../../core-concepts/caching.md) - Script caching
