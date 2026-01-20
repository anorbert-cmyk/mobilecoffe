# Plan: System-Wide Debugging & Verification

> **Task Plan:** `PLAN-system-debug`
> **Goal:** Comprehensive "debug everything" sweep to identify and fix issues across Security, Code Quality, and UI Logic.

## 1. Orchestration Strategy

We will coordinate 3 specialized agents to audit the system:

| Agent | Focus Area | Tools/Scripts |
|-------|------------|---------------|
| **1. Debugger** | Code Quality & Type Safety | `npm run check`, `npm run lint` |
| **2. Security Auditor** | Vulnerabilities & Secrets | `security_scan.py` |
| **3. Frontend Specialist** | UI Regression & Logic | Manual Component Audit |

---

## 2. Phase Breakdown

### Phase 1: Static Analysis (The "Debugger")

- [x] Run **TypeScript Compiler** (`tsc --noEmit`) to catch type errors (especially in new B2B components).
- [x] Run **ESLint** to catch code quality issues and unused variables.
- [x] **Fix:** resolve any errors found immediately.

### Phase 2: Security Sweep (The "Security Auditor")

- [x] Run **Security Scanner** (`security_scan.py`).
- [x] **Audit:** Review "High/Critical" findings.
  - Check for hardcoded secrets in `auth.ts` / `oauth.ts`.
  - Verify dangerous code patterns (`eval`, `dangerouslySetInnerHTML`).
- [x] **Fix:** Remediate confirmed vulnerabilities.

### Phase 3: UI & Logic Verification (The "Frontend Specialist")

- [x] **Audit B2B Components:**
  - Verify `CafeCardV2` props and rendering logic.
  - Verify `FloatingTabBar` animation logic (ensure no memory leaks or re-render loops).
- [x] **Refactor:** Clean up any "mock" data left over (e.g., `STATS` in Dashboard).
- [x] **Optimize:** Ensure `Lucide` icons are tree-shaken correctly (imports).

---

## 3. Verification Criteria

- [x] `npm run check` passes with 0 errors.
- [x] `npm run lint` passes with 0 errors.
- [x] `security_scan.py` shows no *new* critical issues (known false positives documented).
- [x] Build succeeds (`npx expo export` dry run to verify bundling).

---

## 4. Execution Order

1. **Debugger** (Static Analysis)
2. **Security Auditor** (Security Scan)
3. **Frontend Specialist** (UI Fixes)
4. **Final Verification**
