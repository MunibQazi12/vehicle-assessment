# SRP Filtering System

## Overview

The filtering system allows users to narrow down vehicle inventory across multiple dimensions: condition, make/model, price, year, colors, and specifications.

## Filter Types

### Condition Filters

**New Vehicles**: Shows only new vehicles  
**Used Vehicles**: Shows used + certified vehicles (backend constraint)  
**Certified**: Shows certified vehicles only

See [Condition Rules](./condition-rules.md) for complex logic.

### Multi-Select Filters

Filters where users can select multiple values:
- Make, Model
- Year
- Trim, Body Type
- Fuel Type, Transmission
- Engine Type, Drivetrain
- Exterior Color, Interior Color
- Doors

### Range Filters

Filters with min/max values:
- Price (min/max)
- Mileage (min/max)
- Monthly Payment (max only)

### Boolean Flags

Filters that are simple on/off:
- Is Special (special pricing)
- Is New Arrival
- Is In Transit
- Is Sale Pending

## Client-Side Filtering

### State Management

```typescript
'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export function FilterControls() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState({
    condition: ['new'],
    make: [],
    year_min: null,
    year_max: null,
    price_min: null,
    price_max: null,
    colors: [],
    // ...
  });
  
  function handleFilterChange(filterName, value) {
    const newFilters = { ...filters };
    
    if (Array.isArray(newFilters[filterName])) {
      // Toggle multi-select
      if (newFilters[filterName].includes(value)) {
        newFilters[filterName] = newFilters[filterName].filter(v => v !== value);
      } else {
        newFilters[filterName].push(value);
      }
    } else {
      newFilters[filterName] = value;
    }
    
    setFilters(newFilters);
    updateURL(newFilters);
  }
  
  function updateURL(newFilters) {
    const url = buildUrl(newFilters);
    router.push(url);
  }
  
  return <div>{/* filter UI */}</div>;
}
```

### Filter Groups Component

```typescript
export function FilterGroup({ 
  title, 
  filters, 
  selectedValues, 
  onFilterChange 
}) {
  const [expanded, setExpanded] = useState(true);
  
  return (
    <div className="filter-group">
      <button 
        onClick={() => setExpanded(!expanded)}
        className="filter-header"
      >
        {title}
        <ChevronIcon open={expanded} />
      </button>
      
      {expanded && (
        <div className="filter-options">
          {filters.map(filter => (
            <label key={filter.value}>
              <input
                type="checkbox"
                checked={selectedValues.includes(filter.value)}
                onChange={() => onFilterChange(filter.value)}
              />
              {filter.label}
              <span className="count">({filter.count})</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
```

### Range Filter Component

```typescript
export function RangeFilter({
  title,
  minValue,
  maxValue,
  onMinChange,
  onMaxChange,
  min = 0,
  max = 100000,
  step = 1000,
}) {
  return (
    <div className="range-filter">
      <label>{title}</label>
      
      <div className="range-inputs">
        <input
          type="number"
          placeholder="Min"
          value={minValue || ''}
          onChange={(e) => onMinChange(e.target.value)}
          min={min}
          max={max}
          step={step}
        />
        <span>to</span>
        <input
          type="number"
          placeholder="Max"
          value={maxValue || ''}
          onChange={(e) => onMaxChange(e.target.value)}
          min={min}
          max={max}
          step={step}
        />
      </div>
      
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={minValue || min}
        onChange={(e) => onMinChange(e.target.value)}
      />
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={maxValue || max}
        onChange={(e) => onMaxChange(e.target.value)}
      />
    </div>
  );
}
```

## Nested Filtering

Some filters depend on previous selections:

**Condition → Make/Model**
- Make/Model options change based on selected condition
- New vehicles have different available makes than used

**Make → Model**
- Model options only show for selected make
- Need API call when make changes

Implementation:

```typescript
export function MakeFilter({ selectedCondition, onMakeChange }) {
  const [makes, setMakes] = useState([]);
  
  useEffect(() => {
    // Fetch makes for selected condition
    fetchMakesForCondition(selectedCondition).then(setMakes);
  }, [selectedCondition]);
  
  return <FilterGroup title="Make" filters={makes} onChange={onMakeChange} />;
}
```

## Filter Persistence

### URL-Based Persistence

Filters are preserved in URL, so:
- Bookmarking saves filter state
- Browser back/forward works
- Sharing links preserves filters

```typescript
// URL: /new-vehicles/toyota/camry/?year=2024,2023&price_min=25000&color=red

const filters = parseUrlFilters(url);
// Returns: {
//   condition: ['new'],
//   make: 'toyota',
//   model: 'camry',
//   year: ['2024', '2023'],
//   price_min: 25000,
//   colors: ['red']
// }
```

### Local Storage Cache (Optional)

For development/testing, cache recent filters:

```typescript
function saveRecentFilters(filters) {
  const recent = JSON.parse(localStorage.getItem('recent_filters') || '[]');
  recent.unshift(filters);
  localStorage.setItem('recent_filters', JSON.stringify(recent.slice(0, 5)));
}

function getRecentFilters() {
  return JSON.parse(localStorage.getItem('recent_filters') || '[]');
}
```

## Filter Combinations

### Valid Combinations

Valid filter paths and combinations:
- Condition + Make + Model (primary filters in URL)
- Any additional filters as query params
- Multiple conditions in query params

Example:
```
/new-vehicles/toyota/camry/?year=2024&color=red&price_min=25000
```

### Invalid Combinations

These should not occur with proper URL building:
- Model without make
- Make without condition
- Condition not first

## Filter API Integration

### Fetch Available Filters

```typescript
import { fetchSRPFilters } from '@dealertower/lib/api/srp';

const filters = await fetchSRPFilters(dealerId, hostname);

// Returns all available filters with counts:
{
  conditions: [],
  makes: [],
  models: [],
  years: [],
  trims: [],
  colors: [],
  // ... etc
}
```

### Fetch Filter Values (Dynamic)

When filter options change based on selections:

```typescript
import { fetchSRPFilterValues } from '@dealertower/lib/api/srp';

// Get colors for selected condition/make
const colors = await fetchSRPFilterValues(
  dealerId,
  'ext_color',
  {
    conditions: ['new'],
    make: 'toyota'
  },
  hostname
);

// Returns:
[
  { value: 'black', label: 'Black', count: 45 },
  { value: 'red', label: 'Red', count: 28 },
  // ...
]
```

## Clear Filters

Allow users to reset filters:

```typescript
function ClearFiltersButton({ onClear }) {
  return (
    <button onClick={onClear} className="clear-filters">
      Clear All Filters
    </button>
  );
}

// In parent:
function handleClearFilters() {
  const defaultFilters = { condition: ['new'] };
  setFilters(defaultFilters);
  router.push(buildUrl(defaultFilters));
}
```

## Filter Display

### Active Filters Chips

Show currently selected filters as removable chips:

```typescript
export function ActiveFilters({ filters, onRemove }) {
  return (
    <div className="active-filters">
      {Object.entries(filters).map(([key, values]) => {
        if (!values || values.length === 0) return null;
        
        return (
          <div key={key} className="filter-chips">
            {Array.isArray(values) ? (
              values.map(v => (
                <chip key={v}>
                  {v}
                  <button onClick={() => onRemove(key, v)}>×</button>
                </chip>
              ))
            ) : (
              <chip>
                {key}: {values}
                <button onClick={() => onRemove(key)}>×</button>
              </chip>
            )}
          </div>
        );
      })}
    </div>
  );
}
```

### Mobile Filter Drawer

On mobile, show filters in a drawer/modal:

```typescript
'use client';
export function MobileFilterDrawer({ isOpen, onClose }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="filter-drawer">
        <DialogHeader>Filters</DialogHeader>
        <FilterGroup title="Condition" /* ... */ />
        <FilterGroup title="Price" /* ... */ />
        {/* More filter groups */}
        <button onClick={onClose}>Apply Filters</button>
      </DialogContent>
    </Dialog>
  );
}
```

## Performance

### Optimize Filter Rendering

Use React.memo to prevent unnecessary re-renders:

```typescript
const FilterGroup = React.memo(function FilterGroup({ title, filters }) {
  return <div>{/* ... */}</div>;
});
```

### Debounce Range Input

Debounce range filter inputs to avoid excessive API calls:

```typescript
import { useDebouncedCallback } from 'use-debounce';

function PriceFilter({ onPriceChange }) {
  const debouncedChange = useDebouncedCallback((min, max) => {
    onPriceChange(min, max);
  }, 500);
  
  return (
    <input 
      onChange={(e) => debouncedChange(e.target.value, maxPrice)}
    />
  );
}
```

## Testing

Test filter functionality:

- [ ] Select single filter option
- [ ] Select multiple options
- [ ] Clear individual filter
- [ ] Clear all filters
- [ ] Filter combinations work
- [ ] URL updates correctly
- [ ] Browser back/forward works
- [ ] Range filters work
- [ ] Nested filters update correctly
- [ ] Mobile drawer opens/closes

## Related Documentation

- [SRP Overview](./overview.md) - Main search page
- [Condition Rules](./condition-rules.md) - Complex condition logic
- [URL Routing](../../core-concepts/url-routing.md) - URL structure
- [API Reference](../../api-reference/endpoints.md) - Filter API
