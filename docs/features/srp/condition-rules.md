# Condition Filter Business Rules

## Overview

The condition filter (New / Used / Certified) has complex logic due to a backend constraint: the used vehicle dataset **always includes** certified vehicles.

## The Core Constraint

**Backend Rule**: When you request "used" vehicles from the API, the response includes both regular used vehicles AND certified vehicles. There is no way to get "used-only" without certified.

This creates a unique UI/UX challenge that must be handled carefully.

## Rules

### Rule 1: Used Always Includes Certified

When the user selects "Pre-Owned (used)":

- UI automatically checks the "Certified" checkbox
- Certified checkbox becomes **disabled** (cannot uncheck)
- Both conditions are sent to API
- API call: `conditions: ['used', 'certified']`
- URL: `/used-vehicles/`

**Example**:
```
User action: Click "Pre-Owned (used)"
    ↓
UI state: condition = 'used', certified = true
    ↓
Certified checkbox: disabled ✓
    ↓
API call: conditions: ['used', 'certified']
    ↓
URL: /used-vehicles/
```

### Rule 2: Certified Can Be Selected Alone

When the user deselects "Pre-Owned (used)" (leaving only certified):

- Certified checkbox remains checked
- Certified checkbox becomes **enabled** (can toggle)
- Only certified is sent to API
- API call: `conditions: ['certified']`
- URL: `/used-vehicles/certified/`

**Example**:
```
User action: Uncheck "Pre-Owned (used)"
    ↓
UI state: condition = null, certified = true
    ↓
Certified checkbox: enabled ✓
    ↓
API call: conditions: ['certified']
    ↓
URL: /used-vehicles/certified/
```

### Rule 3: New + Certified Combination

When user selects both New and Certified:

- Both are selected but "Used" is not
- This is a valid combination
- Both are sent to API
- URL: `/used-vehicles/certified/?condition=new`

**Example**:
```
User action: Check "New" and "Certified" (no "Used")
    ↓
UI state: condition = 'new', certified = true, used = false
    ↓
API call: conditions: ['new', 'certified']
    ↓
URL: /used-vehicles/certified/?condition=new
```

### Rule 4: URL Parsing Special Case

**This is critical**: The path segment `/used-vehicles/certified/` has a special meaning:

- `/used-vehicles/` → parses as `['used', 'certified']` (both)
- `/used-vehicles/certified/` → parses as `['certified']` (ONLY certified, not used)

This allows the URL to distinguish between:
1. All used vehicles (which happen to include certified)
2. Only certified vehicles

**URL Examples**:
```
/used-vehicles/
  ↓
Parsed filters: ['used', 'certified']
Meaning: All used vehicles (which include certified)

/used-vehicles/certified/
  ↓
Parsed filters: ['certified']
Meaning: Only certified vehicles (not all used)
```

## Implementation

### Checkbox Logic

```typescript
'use client';
import { useState } from 'react';

export function ConditionFilters({ selectedConditions, onChange }) {
  const isNewSelected = selectedConditions.includes('new');
  const isUsedSelected = selectedConditions.includes('used');
  const isCertifiedSelected = selectedConditions.includes('certified');
  
  function handleNewChange(checked) {
    const newConditions = new Set(selectedConditions);
    if (checked) {
      newConditions.add('new');
    } else {
      newConditions.delete('new');
    }
    onChange(Array.from(newConditions));
  }
  
  function handleUsedChange(checked) {
    const newConditions = new Set(selectedConditions);
    if (checked) {
      // Used selected: add both used and certified
      newConditions.add('used');
      newConditions.add('certified');
    } else {
      // Used deselected: remove used but keep certified
      newConditions.delete('used');
      // Note: certified stays if it was selected
    }
    onChange(Array.from(newConditions));
  }
  
  function handleCertifiedChange(checked) {
    const newConditions = new Set(selectedConditions);
    if (checked) {
      newConditions.add('certified');
    } else {
      newConditions.delete('certified');
    }
    onChange(Array.from(newConditions));
  }
  
  // Certified is disabled when used is selected
  const certifiedDisabled = isUsedSelected;
  
  return (
    <fieldset>
      <legend>Vehicle Condition</legend>
      
      <label>
        <input
          type="checkbox"
          checked={isNewSelected}
          onChange={(e) => handleNewChange(e.target.checked)}
        />
        New Vehicles
      </label>
      
      <label>
        <input
          type="checkbox"
          checked={isUsedSelected}
          onChange={(e) => handleUsedChange(e.target.checked)}
        />
        Pre-Owned (Used)
      </label>
      
      <label>
        <input
          type="checkbox"
          checked={isCertifiedSelected}
          onChange={(e) => handleCertifiedChange(e.target.checked)}
          disabled={certifiedDisabled}
        />
        Certified
        {certifiedDisabled && <span className="help-text">(Included with Used)</span>}
      </label>
    </fieldset>
  );
}
```

### URL Parsing

```typescript
// packages/lib/url/parser.ts

export function parseSlug(slug: string[]): ParsedSlug {
  if (!slug || slug.length === 0) {
    return {
      condition: 'new',
      filters: { conditions: ['new'] },
    };
  }
  
  // Check for /used-vehicles/certified/ pattern
  if (slug[0] === 'used-vehicles' && slug[1] === 'certified') {
    // Special case: certified ONLY (not used)
    return {
      condition: 'certified',
      make: slug[2],
      model: slug[3],
      filters: { conditions: ['certified'] },
    };
  }
  
  // Regular /used-vehicles/ (includes certified)
  if (slug[0] === 'used-vehicles') {
    return {
      condition: 'used',
      make: slug[1],
      model: slug[2],
      filters: { conditions: ['used', 'certified'] },
    };
  }
  
  // New vehicles
  if (slug[0] === 'new-vehicles') {
    return {
      condition: 'new',
      make: slug[1],
      model: slug[2],
      filters: { conditions: ['new'] },
    };
  }
}
```

### URL Building

```typescript
// packages/lib/url/builder.ts

export function buildUrl(filters: FilterState): BuiltUrl {
  const conditions = filters.conditions || [];
  
  let pathname = '/';
  
  // Determine path based on conditions
  if (conditions.includes('new') && !conditions.includes('used')) {
    pathname += 'new-vehicles/';
  } else if (conditions.includes('used') && conditions.includes('certified')) {
    // Both used and certified → /used-vehicles/
    pathname += 'used-vehicles/';
  } else if (conditions.includes('certified') && !conditions.includes('used')) {
    // Only certified → /used-vehicles/certified/
    pathname += 'used-vehicles/certified/';
  }
  
  // Add make/model if present
  if (filters.make) {
    pathname += filters.make.toLowerCase() + '/';
  }
  if (filters.model && filters.make) {
    pathname += filters.model.toLowerCase() + '/';
  }
  
  // Build query params for other filters
  const queryParams = new URLSearchParams();
  
  // If new is selected along with used/certified, add it to query
  if (
    conditions.includes('new') && 
    (conditions.includes('used') || conditions.includes('certified'))
  ) {
    queryParams.append('condition', 'new');
  }
  
  // Add other filters...
  // (colors, year, price, etc.)
  
  const search = queryParams.toString();
  return {
    pathname,
    search: search ? '?' + search : '',
  };
}
```

## State Machine Diagram

```
                    ┌─────────────────────┐
                    │    Start: New Only   │
                    │  ✓ New              │
                    │  ☐ Used (disabled)  │
                    │  ☐ Certified        │
                    └──────────┬──────────┘
                               │
                    ┌──────────┴──────────┐
                    │                     │
          Click Used │          Click Certified
                    │                     │
                    ▼                     ▼
        ┌───────────────────┐   ┌──────────────────┐
        │  Used + Certified │   │  New + Certified │
        │  ✓ New            │   │  ✓ New           │
        │  ✓ Used           │   │  ☐ Used (diabled)│
        │  ✓ Certified      │   │  ✓ Certified     │
        │  (locked)         │   │  (enabled)       │
        └────────┬──────────┘   └────────┬─────────┘
                 │                       │
    Uncheck Used │        Uncheck Certified
                 │                       │
                 ▼                       ▼
        ┌──────────────────┐   ┌──────────────────┐
        │  Certified Only  │   │    New Only      │
        │  ✓ New           │   │  ✓ New           │
        │  ☐ Used          │   │  ☐ Used (disabled)
        │  ✓ Certified     │   │  ☐ Certified     │
        │  (enabled)       │   │  (enabled)       │
        └──────────────────┘   └──────────────────┘
```

## Testing Scenarios

### Scenario 1: Select Used
```
Start: New only
Action: Check "Pre-Owned"
Expected: 
  - New + Used + Certified all checked
  - Certified disabled
  - API: ['used', 'certified']
  - URL: /used-vehicles/
```

### Scenario 2: Used to Certified Only
```
Start: New + Used + Certified
Action: Uncheck "Pre-Owned"
Expected:
  - New checked, Used unchecked, Certified checked
  - Certified enabled
  - API: ['new', 'certified']
  - URL: /used-vehicles/certified/?condition=new
```

### Scenario 3: New + Certified (no Used)
```
Start: New only
Action: Check "Certified"
Expected:
  - New + Certified checked, Used unchecked
  - Certified enabled
  - API: ['new', 'certified']
  - URL: /used-vehicles/certified/?condition=new
```

### Scenario 4: Certified Only (Used Deselected)
```
Start: New + Used + Certified
Action: Uncheck "Pre-Owned"
Expected:
  - New checked, Used unchecked, Certified checked
  - Certified enabled
  - API: ['new', 'certified']
  - URL: /used-vehicles/certified/?condition=new
```

## Common Mistakes

❌ **Wrong**: Sending `['used']` without `['certified']`
- Backend won't work as expected
- User gets certified vehicles anyway

❌ **Wrong**: Disabling certified when only New is selected
- User should be able to select New + Certified

❌ **Wrong**: URL `/new-vehicles/used-vehicles/...`
- Never mix conditions in path
- Use query params for additional conditions

✅ **Correct**: Handle all state combinations explicitly
✅ **Correct**: Lock certified when used is selected
✅ **Correct**: Use URL query params for additional conditions

## Related Documentation

- [SRP Overview](./overview.md) - Search page overview
- [URL Routing](../../core-concepts/url-routing.md) - Complete URL rules
- [Filtering System](./filtering.md) - General filtering
