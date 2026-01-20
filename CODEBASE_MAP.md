# Codebase Map

## 1. Technology Stack

- **Framework**: React Native (Expo SDK 52)
- **Language**: TypeScript (Strict Mode)
- **Styling**: NativeWind v4 (Tailwind CSS)
- **Backend / API**: TRPC (Express Adapter)
- **Database**: MySQL (via Drizzle ORM)
- **State Management**: React Query (TanStack Query) + Local Context Providers
- **Navigation**: Expo Router (File-based routing)

## 2. Directory Structure

### `app/` (Frontend Routing)

File-based routing using Expo Router.

- `(tabs)`: Main application tabs (Home, Search, Profile, etc.).
- `(auth)`: Authentication flows (Sign In, Sign Up).
- `b2b/`: Business features (Dashboard, Job Board, Registration).
- `coffee/`, `machine/`, `grinder/`: Detail pages for domain objects.
- `_layout.tsx`: Root layout with Context Providers (Auth, Subscription, etc.).

### `server/` (Backend Logic)

TRPC Server implementation.

- `routers/`: Domain-specific routers.
  - `appRouter`: Main entry point.
  - `businessRouter`: Business logic (Registration, Profile).
  - `jobRouter`: Job Board features.
  - `productRouter`: Product catalog.
- `_core/`: Server infrastructure (Context, System routes).
- `db.ts`: Drizzle database client initialization.

### `components/` (UI Library)

Results of "Premium Design" philosophy.

- `ui/`: Core primitives (`premium-button`, `icon-symbol`).
- `screen-container.tsx`: Standard page wrapper.

### `drizzle/` (Data Layer)

- `schema.ts`: Database Schema definitions (`users`, `businesses`, `jobs`, `products`).
- `migrations/`: SQL migration files.

### `lib/` (Utilities & Logic)

- `trpc.tsx`: TRPC Client setup.
- `_core/`: Core runtime utilities (Auth, Safe Area).
- `[feature]/`: Feature-specific logic providers (e.g., `subscription/`, `favorites/`).

## 3. Key Conventions

### "Get Shit Done" (GSD)

- **Workflow**: Context -> Discuss -> Plan -> Execute -> Verify.
- **Artifacts**: Stored in `.agent/workflows/`.

### Architecture Patterns

- **Full Stack Types**: TRPC ensures end-to-end type safety.
- **Feature-First**: Code is organized by domain features (`b2b/`, `coffee/`) rather than technical layers where possible.
- **Design**: "Premium" aesthetic using NativeWind (Tailwind).
- **Atomic Commits**: Small, verified changes.

## 4. Current Domain Capabilities

- **User**: Auth, Profile, Preferences.
- **Coffee**: Database, Recommendations, Brewing Guides.
- **B2B**: Business Profiles, Job Board (~MVP), Product Catalog.
- **Monetization**: Subscription tiers (Free/Premium), Affiliate links.
