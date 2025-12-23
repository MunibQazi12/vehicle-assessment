# Testing

This project uses [Vitest](https://vitest.dev/) for unit and integration testing with React Testing Library for component testing.

## Quick Start

```bash
# Run tests in watch mode
npm test

# Run tests once (CI mode)
npm test -- --run

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

## Test Structure

Tests are located in `__tests__/` directories alongside the code they test:

```
packages/
  lib/
    url/
      builder.ts
      parser.ts
      __tests__/
        url.test.ts       # Tests for builder.ts and parser.ts
    utils/
      text.ts
      hours.ts
      __tests__/
        text.test.ts      # Tests for text.ts
        hours.test.ts     # Tests for hours.ts
```

## Writing Tests

### Basic Test Structure

```typescript
import { describe, it, expect } from 'vitest';
import { myFunction } from '../myModule';

describe('myFunction', () => {
  it('should handle basic case', () => {
    const result = myFunction('input');
    expect(result).toBe('expected output');
  });

  it('should handle edge case', () => {
    expect(() => myFunction(null)).toThrow();
  });
});
```

### Testing React Components

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MyComponent } from '../MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent title="Test" />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('handles user interaction', async () => {
    const { user } = render(<MyComponent />);
    await user.click(screen.getByRole('button'));
    expect(screen.getByText('Clicked')).toBeInTheDocument();
  });
});
```

### Using Path Aliases

Tests support the same path aliases as the main codebase:

```typescript
import { buildUrl } from '@dealertower/lib/url';
import type { FilterState } from '@dealertower/types/filters';
```

## Configuration

### vitest.config.ts

The test configuration includes:

- **Environment**: `jsdom` for DOM testing
- **Globals**: `true` - no need to import `describe`, `it`, `expect`
- **Path aliases**: Matches `tsconfig.json` (`@dealertower/*`, `@dealers/*`)
- **Setup file**: `vitest.setup.tsx` for global mocks

### vitest.setup.tsx

Global test setup includes mocks for:

- **`next/image`** - Renders as standard `<img>` element
- **`next/navigation`** - Mocks `useRouter`, `useSearchParams`, `usePathname`, `useParams`
- **Environment variables** - Sets test values for `NEXTJS_APP_HOSTNAME` and `NEXTJS_APP_DEALER_ID`

## What to Test

### ✅ Should Have Tests

1. **Utility functions** (`packages/lib/utils/`)
   - Text normalization, formatting, parsing
   - Date/time calculations
   - Data transformations

2. **URL building and parsing** (`packages/lib/url/`)
   - Slug generation from filters
   - Filter extraction from URLs
   - Query parameter handling

3. **Business logic functions**
   - Filter state management
   - Cache key generation
   - Data validation

4. **Pure functions with complex logic**
   - Any function with conditional branches
   - Functions with multiple input combinations
   - Edge case handling

### ⚠️ Consider Testing

1. **React hooks** - Test with `@testing-library/react-hooks` or within component tests
2. **Client components** - Test user interactions and state changes
3. **API response transformations** - Test data mapping functions

### ❌ Skip Testing

1. **Server Components** - Test through E2E tests instead
2. **API routes** - Test through integration/E2E tests
3. **Simple pass-through components** - No logic to test
4. **Third-party library wrappers** - Trust the library's tests

## Test Patterns

### Testing URL Builder/Parser

```typescript
import { buildUrl, parseSlug } from '@dealertower/lib/url';
import type { FilterState } from '@dealertower/types/filters';

describe('URL round-trip', () => {
  it('should preserve filter state through build/parse cycle', () => {
    const filters: FilterState = {
      condition: ['new'],
      make: ['toyota'],
      model: ['camry'],
    };
    
    const built = buildUrl(filters);
    const parsed = parseSlug(built.path.split('/'));
    
    expect(parsed.filters.make).toEqual(filters.make);
    expect(parsed.filters.model).toEqual(filters.model);
  });
});
```

### Testing with Mocked Environment

```typescript
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('tenant-aware function', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('uses hostname from environment', () => {
    process.env.NEXTJS_APP_HOSTNAME = 'test-dealer.com';
    // Import and test your function
  });
});
```

### Testing Async Functions

```typescript
import { describe, it, expect, vi } from 'vitest';

describe('async function', () => {
  it('handles successful response', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: 'test' }),
    });
    global.fetch = mockFetch;

    const result = await myAsyncFunction();
    expect(result.data).toBe('test');
  });

  it('handles error response', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
    });
    global.fetch = mockFetch;

    await expect(myAsyncFunction()).rejects.toThrow();
  });
});
```

## Coverage

Run coverage report:

```bash
npm run test:coverage
```

Coverage reports are generated in:
- **Terminal**: Summary table
- **`coverage/`**: HTML report (open `coverage/index.html`)

### Coverage Targets

- **Utility functions**: 90%+ coverage
- **Business logic**: 80%+ coverage
- **Components**: 60%+ coverage (focus on critical paths)

## CI Integration

Tests run automatically on:
- Pull request creation/update
- Push to `main` or `development` branches

Failed tests will block PR merging.

## Debugging Tests

### Run single test file

```bash
npm test -- packages/lib/url/__tests__/url.test.ts
```

### Run tests matching pattern

```bash
npm test -- -t "should build new-vehicles"
```

### Debug in VS Code

Add to `.vscode/launch.json`:

```json
{
  "type": "node",
  "request": "launch",
  "name": "Debug Vitest",
  "program": "${workspaceFolder}/node_modules/vitest/vitest.mjs",
  "args": ["run", "--reporter=verbose"],
  "cwd": "${workspaceFolder}",
  "console": "integratedTerminal"
}
```

## Best Practices

1. **Name tests descriptively** - `it('should return empty array when input is null')`
2. **One assertion per test** - Makes failures easier to diagnose
3. **Use `describe` blocks** - Group related tests together
4. **Test edge cases** - Empty arrays, null values, boundary conditions
5. **Keep tests fast** - Mock external dependencies
6. **Don't test implementation details** - Test behavior, not internal structure
