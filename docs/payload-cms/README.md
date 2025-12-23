# Payload CMS Documentation Structure

This directory contains detailed documentation for various aspects of Payload CMS integration and usage within this project. Below is a guide to the contents of each folder:

## 🔒 Security (Critical)

- **[tenant-security.md](./tenant-security.md)**: **READ FIRST** - Comprehensive guide to tenant isolation in Payload CMS. Covers how all CMS operations are locked to `NEXTJS_APP_DEALER_ID`, query-level filtering, admin panel security, and attack prevention.
- **[server-side-validation.md](./server-side-validation.md)**: **IMPLEMENTATION GUIDE** - Server-side tenant validation hooks that prevent unauthorized cross-tenant data access. Explains the `validateTenantAccess` hook applied to all tenant-enabled collections, with examples and test coverage.
- **[attack-vector-analysis.md](./attack-vector-analysis.md)**: Detailed security analysis of NonClearableTenantSelector component. Analyzes 6 attack vectors (client-side manipulation, API bypass, session hijacking, race conditions, SQL injection, env override) and explains why each fails. Proves component is secure and necessary.

## Documentation Folders

- **access-control/**: Documentation on defining permissions and access control logic (e.g., roles, collection-level access).
- **admin/**: Guides related to the Payload Admin panel customization and configuration.
- **authentication/**: Details on user authentication strategies, login flows, and session management.
- **configuration/**: Core configuration settings for Payload, including `payload.config.ts` options.
- **custom-components/**: Instructions for building and registering custom React components within the Admin UI.
- **database/**: Database connection setup, schema management, and adapter configurations (PostgreSQL).
- **ecommerce/**: Specifics related to e-commerce features if applicable (e.g., orders, products).
- **email/**: Configuration for email transport and templates.
- **examples/**: Code examples and patterns for common tasks.
- **fields/**: Documentation on Payload's field types and how to define them in collections/globals.
- **folders/**: Information about folder-based organization or specific folder structures.
- **getting-started/**: Introductory guides for developers new to Payload CMS.
- **graphql/**: Documentation for the automatically generated GraphQL API.
- **hooks/**: Guide to using Collection and Global hooks (beforeChange, afterRead, etc.).
- **integrations/**: Third-party integrations and external services.
- **jobs-queue/**: Information on background jobs and queue management.
- **live-preview/**: Setup and usage of the Live Preview feature with the Next.js frontend.
- **local-api/**: Using the Local API to interact with Payload directly on the server.
- **migration-guide/**: Guides for migrating between Payload versions or database schemas.
- **performance/**: Tips and best practices for optimizing Payload performance.
- **plugins/**: Documentation on installed plugins and how to create new ones.
- **production/**: Guidelines for deploying and running Payload in a production environment.
- **queries/**: How to construct queries for finding and filtering documents.
- **query-presets/**: Pre-defined query configurations or saved views.
- **rest-api/**: Documentation for the automatically generated REST API endpoints.
- **rich-text/**: Configuration and usage of the Rich Text editor (Lexical or Slate).
- **trash/**: Information about soft-delete or trash functionality.
- **troubleshooting/**: Common issues and solutions.
- **typescript/**: TypeScript specific guides, including type generation and usage.
- **upload/**: File upload handling, media collections, and storage adapters.
- **versions/**: Documentation related to document versioning and drafts.

Agents should refer to the specific subdirectories for detailed implementation guidelines on each topic.
