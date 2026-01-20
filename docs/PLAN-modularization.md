# Plan: Hybrid Modularization (Option C)

> **Orchestration Task:** Transform monolithic structure into a modular, feature-based architecture while preserving existing shared components.

## 1. Goal & Context

**Problem:** The CoffeeCraft codebase has large, monolithic screen files (e.g., `products.tsx`, `subscription.tsx` at 6-13KB each) that mix UI, business logic, and data fetching. This makes testing, maintenance, and team collaboration difficult.

**Solution (Option C - Hybrid):**

1. Keep existing `components/`, `hooks/`, `lib/` as **shared layers**
2. Create new `features/` directory for complex, self-contained modules
3. Incrementally migrate complex screens to feature modules

---

## 2. Target Architecture

```text
src/
├── features/              # NEW: Feature modules
│   ├── b2b-dashboard/     # B2B Dashboard feature
│   │   ├── components/    # BentoGrid, StatCard, InsightCard
│   │   ├── hooks/         # useDashboardStats, useGreeting
│   │   └── index.ts       # Barrel export
│   ├── cafe-discovery/    # Cafe browsing feature
│   │   ├── components/    # CafeCardV2, FilterBar, MapView
│   │   ├── hooks/         # useCafeSearch, useLocation
│   │   └── index.ts
│   └── job-board/         # Job posting feature
│       ├── components/    # JobCard, ApplicationForm
│       ├── hooks/         # useJobApplications
│       └── index.ts
│
├── components/shared/     # MOVE: Rename from components/
│   ├── ui/                # GlassPanel, Button, Icon
│   └── navigation/        # FloatingTabBar
│
├── hooks/shared/          # MOVE: Rename from hooks/
│   ├── use-colors.ts
│   └── use-auth.ts
│
├── lib/                   # KEEP: Core utilities (trpc, auth, api)
│
└── app/                   # KEEP: Expo Router screens (thin wrappers)
```

---

## 3. Implementation Phases

### Phase 1: Foundation Setup (Agent: project-planner) ✅

- [x] Create modularization plan

### Phase 2: Directory Structure (Agent: frontend-specialist)

- [ ] Create `features/` directory
- [ ] Create `features/b2b-dashboard/` structure
- [ ] Create tsconfig path aliases for `@features/*`

### Phase 3: B2B Dashboard Module Migration (Agent: frontend-specialist)

- [ ] Extract `BentoGrid` component from `index.tsx`
- [ ] Extract `StatCard` component
- [ ] Extract `InsightCard` component
- [ ] Create `useDashboardStats` hook
- [ ] Create barrel export (`features/b2b-dashboard/index.ts`)
- [ ] Update `app/b2b/dashboard/index.tsx` to import from feature

### Phase 4: Shared Components Reorganization (Agent: frontend-specialist)

- [ ] Move `components/ui/*` to `components/shared/ui/*`
- [ ] Move `components/navigation/*` to `components/shared/navigation/*`
- [ ] Update all imports across the codebase

### Phase 5: Security & Verification (Agent: security-auditor)

- [ ] Run security scan on new structure
- [ ] Verify no broken imports
- [ ] Run TypeScript check
- [ ] Run lint

---

## 4. Path Alias Configuration

**tsconfig.json additions:**

```json
{
  "compilerOptions": {
    "paths": {
      "@features/*": ["./features/*"],
      "@shared/*": ["./components/shared/*", "./hooks/shared/*"]
    }
  }
}
```

---

## 5. Verification Criteria

- [ ] `npm run check` passes with 0 errors
- [ ] `npm run lint` passes
- [ ] App builds successfully (`npx expo export -p ios`)
- [ ] All existing functionality preserved
- [ ] Feature imports work: `import { BentoGrid } from '@features/b2b-dashboard'`

---

## 6. Risk Mitigation

| Risk               | Mitigation                                                       |
| ------------------ | ---------------------------------------------------------------- |
| Broken imports     | Update all import paths systematically                           |
| Expo Router issues | Keep `app/` structure unchanged, only refactor internal imports  |
| Team confusion     | Document new structure in `ARCHITECTURE.md`                      |

---

## 7. Agents Required

| #   | Agent                    | Responsibility               |
| --- | ------------------------ | ---------------------------- |
| 1   | **project-planner**      | Create this plan             |
| 2   | **frontend-specialist**  | Execute modularization       |
| 3   | **security-auditor**     | Verify security & run checks |
