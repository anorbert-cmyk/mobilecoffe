# Get Shit Done (GSD) Protocol

This workflow implements the "Get Shit Done" philosophy by TÂCHES, adapted for this agent.

## Core Philosophy

- **Context Engineering**: We explicitly manage context to avoid degradation.
- **Atomic Commits**: Every task gets its own commit.
- **Spec-Driven**: We discuss, plan, then execute.

## Commands

- `/gsd:new-project`: Initialize a new project or milestone.
- `/gsd:discuss-phase [N]`: capture preferences before planning.
- `/gsd:plan-phase [N]`: Research and create atomic plans.
- `/gsd:execute-phase [N]`: Implement the plan.
- `/gsd:verify-work [N]`: Verify deliverables with the user.
- `/gsd:quick`: Fast path for bugs/small features.

---

## 1. Initialize Project / Milestone

**Trigger**: Start of a new major feature set or project.
**Output**: `PROJECT.md`, `REQUIREMENTS.md`, `ROADMAP.md`, `STATE.md`

1. **Context Loading**:
    - [ ] Run `list_dir` to understand project structure.
    - [ ] Read `task.md` (if exists).

2. **Define Scope**:
    - [ ] Ask questions to clarify goals, constraints, and tech preferences.
    - [ ] Create/Update `PROJECT.md` (High-level goals).
    - [ ] Create `REQUIREMENTS.md` (Detailed specs, v1 vs v2).
    - [ ] Create `ROADMAP.md` (Phases mapped to requirements).

## 2. Discuss Phase

**Trigger**: Before starting a specific phase in the Roadmap.
**Output**: `{phase}-CONTEXT.md`

1. **Identify Decisions**:
    - [ ] Analyze the phase goal.
    - [ ] Identify "Gray Areas": Visuals, API contracts, Content structure.

2. **Capture Preferences**:
    - [ ] Ask the user specific questions about these gray areas.
    - [ ] Document agreed decisions in `{phase}-CONTEXT.md`.

## 3. Plan Phase

**Trigger**: After Discuss Phase.
**Output**: `{phase}-RESEARCH.md`, `{phase}-PLAN.md`

1. **Research**:
    - [ ] Investigate libraries, patterns, or existing code relevant to the phase.
    - [ ] Document findings in `{phase}-RESEARCH.md`.

2. **Atomic Planning**:
    - [ ] Create `{phase}-PLAN.md` with a list of atomic tasks.
    - [ ] Ensure every task is small enough for a single context window.

## 4. Execute Phase

**Trigger**: After Plan Approval.
**Output**: Code changes, `{phase}-SUMMARY.md`

1. **Execution Loop**:
    - [ ] **Task Boundary**: Set mode to EXECUTION.
    - [ ] Follow `{phase}-PLAN.md` strictly.
    - [ ] **Atomic Commits**: After each logical step, commit changes (if git is available) or checkpoint.
    - [ ] **Verify**: Run quick checks (lint/types) after each step.

2. **Summary**:
    - [ ] Update `{phase}-SUMMARY.md` with what was accomplished.

## 5. Verify Work

**Trigger**: After Execution.
**Output**: `{phase}-UAT.md`

1. **User Acceptance Testing (UAT)**:
    - [ ] Define what the user should be able to do.
    - [ ] Guide the user through manual verification steps.
    - [ ] Document results in `{phase}-UAT.md`.

2. **Fix Loop**:
    - [ ] If issues found: Diagnose -> Plan Fix -> Execute Fix.

## 6. Complete Milestone

**Trigger**: All phases done.
**Output**: Archive artifacts, Tag release.

---

## Quick Mode (`/gsd:quick`)

**Use for**: Bug fixes, small features, config changes.

1. **Scope**: Ask "What do you want to do?".
2. **execute**:
    - [ ] Create `.planning/quick/[task-name]/PLAN.md`.
    - [ ] Execute tasks immediately.
    - [ ] Update `SUMMARY.md`.
