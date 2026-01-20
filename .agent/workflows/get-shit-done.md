---
description: Get Shit Done - The Universal Workflow for Excellence
---
# Get Shit Done (GSD) Protocol

This workflow implements the "Get Shit Done" philosophy, ensuring high-quality, spec-driven development with atomic commits and continuous verification.

## 1. 🧠 Phase 1: Context & Strategy (The "Planner")

**Goal**: Understand the problem deeply before writing a single line of code.

- **Context Loading**:
  - [ ] Identify relevant files using `find_by_name` or `grep_search`.
  - [ ] Read file contents using `view_file`.
  - [ ] Check existing `task.md` and `implementation_plan.md`.

- **Strategic Planning**:
  - [ ] Update `task.md` with a breakdown of the new objective.
  - [ ] Create or update `implementation_plan.md`:
    - Define the **Goal**.
    - List **User Review Required** items (breaking changes, etc.).
    - Detail **Proposed Changes** (atomic, file-by-file).
    - Define **Verification Plan** (automated tests, manual checks).

- **Review Loop**:
  - [ ] **STOP** and ask the user to review the plan via `notify_user`.

## 2. ⚡ Phase 2: Execution (The "Maker")

**Goal**: Implement changes with surgical precision.

- **Atomic Implementation**:
  - [ ] Follow the approved `implementation_plan.md`.
  - [ ] Use `write_to_file` or `replace_file_content` for code changes.
  - [ ] **Crucial**: After every meaningful change, run a quick check (lint, type check, or partial test).

- **Workflow Enforcement**:
  - [ ] Do not deviate from the plan without updating it.
  - [ ] If new complexity arises, go back to Phase 1.

## 3. 🛡️ Phase 3: Verification (The "Checker")

**Goal**: Ensure zero regressions and high quality.

- **Automated Testing**:
  - [ ] Run relevant unit tests: `npm test` or `vitest`.
  - [ ] Run type checks: `tsc --noEmit` or `npm run check`.
  - [ ] Run linting: `npm run lint`.

- **Manual Verification**:
  - [ ] Verify the fix in the running application (simulated or real).
  - [ ] Check for UI regressions.

## 4. 📝 Phase 4: Documentation (The "Scribe")

**Goal**: Leave a clear trail for the future.

- **Artifact Update**:
  - [ ] Mark tasks as completed in `task.md`.
  - [ ] Create or update `walkthrough.md` with proof of work (screenshots, logs).

- **Final Handoff**:
  - [ ] Notify the user of completion with a summary of what was done.
