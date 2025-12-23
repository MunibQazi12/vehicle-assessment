# Installation

## Prerequisites

- **Node.js**: 18.0 or higher
- **npm**: Latest version (comes with Node.js)
- **Git**: For cloning the repository
- **Access**: Dealer Tower API credentials

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/datgate/dt-nextjs.git
cd dt-nextjs
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```bash
# API Configuration
DEALER_TOWER_API_URL=https://api.dealertower.com/public

# Local Development Override
NEXTJS_APP_HOSTNAME=www.nissanofportland.com
NEXTJS_APP_DEALER_ID=494a1788-0619-4a53-99c1-1c9f9b2e8fcc

# Cache Invalidation
REVALIDATION_SECRET=your-secret-here

# Environment
NODE_ENV=development
```

See [Configuration](./configuration.md) for detailed environment variable documentation.

### 4. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Build Commands

### Development
```bash
npm run dev         # Start development server on localhost:3000
```

### Production Build
```bash
npm run build       # Create production build
npm run start       # Start production server
```

### Code Quality
```bash
npm run lint        # Run ESLint checks
npm run lint:fix    # Auto-fix ESLint issues
```

## Project Structure

```
dt-nextjs/
├── app/                      # Next.js App Router
│   ├── (dealer)/            # Dealer-specific dynamic routes
│   ├── (srp)/               # Search Results Page routes
│   ├── api/                 # API routes
│   └── vehicle/             # Vehicle Detail Page
├── dealers/                  # Dealer-specific customizations
│   └── {dealer-uuid}/       # Per-dealer folders
├── packages/                 # Shared code
│   ├── components/          # React components
│   ├── lib/                 # Utility functions
│   └── types/               # TypeScript types
├── docs/                     # Documentation
└── public/                   # Static assets
```

## Verification

After installation, verify the setup:

1. **Development server starts without errors**
2. **Homepage loads** at `http://localhost:3000`
3. **API connectivity** - Check network tab for successful API calls
4. **Tenant detection** - Verify hostname override works

## Troubleshooting

### Port 3000 Already in Use

```bash
# Kill process on port 3000
npx kill-port 3000

# Or use a different port
PORT=3001 npm run dev
```

### Module Not Found Errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors

```bash
# Regenerate TypeScript types
rm -rf .next
npm run build
```

## Next Steps

- [Configuration](./configuration.md) - Configure environment variables
- [Local Development](./local-development.md) - Development workflow
- [Architecture](../core-concepts/architecture.md) - Understand the system
