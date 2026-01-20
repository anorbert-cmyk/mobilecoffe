# Plan: Project Modernization & Restructure

> **Goal:** Transform the CoffeeCraft codebase into a modern, structured, secure project that is easy to debug, maintain, and scale.

## 1. Current State Analysis

### Pain Points Identified

| Problem | Impact | Root Cause |
| ------- | ------ | ---------- |
| Changes not reflecting in app | Critical | Metro cache + iOS bundle cache issues |
| Large monolithic screens | High | No feature isolation (files 12-27KB) |
| Mixed concerns | High | UI, data, logic all in same files |
| Debugging difficulty | High | No clear boundaries, hard to trace bugs |
| No test coverage | Medium | Hard to test tightly coupled code |
| Security gaps | Medium | No consistent auth boundary checks |

### Current Structure Problems

```text
app/                    # 61+ files, flat structure
├── (tabs)/             # 5 tabs mixed with 20+ subdirs
├── b2b/                # 17 files, no clear separation
│   └── dashboard/      # 7 files, monolithic screens
├── Various screens...  # No pattern, hard to navigate
```

---

## 2. Target Architecture

### 2.1 Feature-Based Structure

```text
src/
├── features/                    # Self-contained feature modules
│   ├── b2b-dashboard/
│   │   ├── components/          # StatCard, ActionCard, Hero
│   │   ├── hooks/               # useDashboardStats
│   │   ├── screens/             # DashboardScreen (thin wrapper)
│   │   ├── types.ts             # Feature-specific types
│   │   └── index.ts             # Barrel export
│   │
│   ├── cafe-discovery/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── screens/
│   │   └── index.ts
│   │
│   └── auth/                    # Centralized auth feature
│       ├── components/          # LoginForm, RegisterForm
│       ├── hooks/               # useAuth, useSession
│       ├── guards/              # AuthGuard, RoleGuard
│       └── index.ts
│
├── shared/                      # Truly reusable code
│   ├── components/              # Button, Icon, GlassPanel
│   ├── hooks/                   # useColors, useDebounce
│   ├── utils/                   # Formatters, validators
│   └── types/                   # Global types
│
├── core/                        # App infrastructure
│   ├── api/                     # tRPC client, axios instance
│   ├── auth/                    # Session management
│   ├── navigation/              # Navigation utilities
│   └── config/                  # App configuration
│
├── server/                      # Backend (already separated)
│
└── app/                         # Expo Router (THIN WRAPPERS ONLY)
    └── b2b/dashboard/index.tsx  # Just imports and renders
```

### 2.2 Key Principles

1. **Screens = Thin Wrappers** - Only import and compose, no logic
2. **Features = Self-Contained** - Each feature has its own components, hooks, types
3. **Shared = Truly Reusable** - Only things used by 3+ features
4. **Core = Infrastructure** - API clients, auth, config

---

## 3. Implementation Phases

### Phase 1: Foundation & Tooling (Day 1)

| Task | Agent | Status |
| ---- | ----- | ------ |
| Add path aliases for `@features`, `@shared`, `@core` | frontend-specialist | [ ] |
| Configure Metro to resolve new paths | frontend-specialist | [ ] |
| Add ESLint rules for import boundaries | frontend-specialist | [ ] |
| Create directory structure | frontend-specialist | [ ] |

**tsconfig.json additions:**

```json
{
  "compilerOptions": {
    "paths": {
      "@features/*": ["./src/features/*"],
      "@shared/*": ["./src/shared/*"],
      "@core/*": ["./src/core/*"]
    }
  }
}
```

### Phase 2: B2B Dashboard Migration (Day 1-2)

| Task | Agent | Status |
| ---- | ----- | ------ |
| Extract `ActionCard` component | frontend-specialist | [ ] |
| Extract `StatCard` component | frontend-specialist | [ ] |
| Extract `HeroSection` component | frontend-specialist | [ ] |
| Create `useDashboardStats` hook | frontend-specialist | [ ] |
| Create `DashboardScreen` thin wrapper | frontend-specialist | [ ] |
| Update `app/b2b/dashboard/index.tsx` to import from feature | frontend-specialist | [ ] |

### Phase 3: Auth & Security Hardening (Day 2-3)

| Task | Agent | Status |
| ---- | ----- | ------ |
| Create `AuthGuard` component | security-auditor | [ ] |
| Create `useRequireAuth` hook | security-auditor | [ ] |
| Add role-based access control | security-auditor | [ ] |
| Implement secure token refresh | security-auditor | [ ] |
| Add API request signing | security-auditor | [ ] |

### Phase 4: Debugging & Observability (Day 3)

| Task | Agent | Status |
| ---- | ----- | ------ |
| Add structured logging utility | debugger | [ ] |
| Create error boundary components | debugger | [ ] |
| Add performance monitoring hooks | debugger | [ ] |
| Create debug panel for dev mode | debugger | [ ] |

### Phase 5: Testing Infrastructure (Day 4)

| Task | Agent | Status |
| ---- | ----- | ------ |
| Configure **Vitest** for logic/hooks (Fast & Modern) | test-engineer | [ ] |
| Configure **Jest** for Component Testing (RN Standard) | test-engineer | [ ] |
| Add unit tests for hooks | test-engineer | [ ] |
| Add component tests | test-engineer | [ ] |
| Add E2E test setup (Detox) | test-engineer | [ ] |

### Phase 6: CI/CD & Build Optimization (Day 5)

| Task | Agent | Status |
| ---- | ----- | ------ |
| Create GitHub Actions workflow | devops-engineer | [ ] |
| Add pre-commit hooks (lint, type-check) | devops-engineer | [ ] |
| Optimize Metro bundler config | devops-engineer | [ ] |
| Add build caching | devops-engineer | [ ] |

---

## 4. Known Issues (Deferred)

> **NOTE:** The dashboard update issue (cache) is marked as **IMPORTANT** but will be addressed *after* the initial refactor.

**Root Cause Analysis:**
The dashboard changes are not reflecting because of iOS Bundle Cache / Metro Cache issues.

**Future Fix Steps:**

1. Clear all caches (node_modules, ios/build, DerivedData, Watchman)
2. Reinstall pods
3. Run Debug build (`npx expo run:ios --device --no-build-cache`)

---

## 5. Security Checklist

| Area | Current | Target |
| ---- | ------- | ------ |
| Auth Token Storage | SecureStore ✅ | SecureStore ✅ |
| API Auth Header | Present ✅ | + Request Signing |
| Route Protection | Partial ⚠️ | AuthGuard everywhere |
| Input Validation | tRPC Zod ✅ | tRPC Zod ✅ |
| Error Exposure | Raw errors ❌ | Sanitized messages |
| Rate Limiting | Server-side ✅ | + Client-side throttle |

---

## 6. Verification Criteria

- [ ] `npm run check` passes with 0 errors
- [ ] `npm run lint` passes
- [ ] All imports use path aliases (`@features/`, `@shared/`, `@core/`)
- [ ] No circular dependencies
- [ ] Each feature has at least 1 unit test
- [ ] Auth guard protects all protected routes
- [ ] Debug panel accessible in dev mode
- [ ] Fresh changes reflect immediately after `r` (reload)

---

## 7. Agents Required

| # | Agent | Responsibility |
| --- | --- | --- |
| 1 | **project-planner** | Create this plan ✅ |
| 2 | **frontend-specialist** | Feature extraction, component structure |
| 3 | **security-auditor** | Auth hardening, security review |
| 4 | **debugger** | Logging, error boundaries, debug tools |
| 5 | **test-engineer** | Test infrastructure, coverage |
| 6 | **devops-engineer** | CI/CD, build optimization |

---

## 8. Quick Start (After Approval)

```bash
# Run this to start implementation
/orchestrate Implement Phase 1-2 of PLAN-project-modernization.md
```

---

> **Note:** This plan prioritizes fixing the immediate dashboard issue first, then incrementally restructures the project for long-term maintainability.
