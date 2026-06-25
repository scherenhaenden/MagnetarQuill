# Canonical Ruleset of MagnetarQuill

## Introduction
These rules codify the Magnetar standard for project governance, planning, and execution. All project activity must comply unless a formal exception is explicitly documented in `BITACORA.md`.

## Naming Conventions
- **Repositories:** `magnetar-<domain>-<descriptor>`
- **Branches:** `<type>/<short-description>` where `type ∈ {feature, fix, chore, experiment, hotfix}`
- **Tasks and blockers:** `kebab-case` (e.g., `task-202`, `blocker-db-outage`)
- **YAML keys:** `lower_snake_case`
- **File names:** Must mirror canonical repository filenames

## Required Files
Every Magnetar project must include:
- `README.md`
- `PLAN.md`
- `BITACORA.md`
- `REQUIREMENTS.md`
- `ARCHITECTURE.md`
- `RULES.md`
- `STATUS.md`
- `TESTING.md`
- `BLOCKERS.md`
- `BRANCHING_MODEL.md`
- `WIP_GUIDELINES.md`
- `CONTRIBUTING.md`
- `projects/<project>.project.yml`

Any omission requires an explicit exemption entry in `BITACORA.md`.

## Branching Conventions
- `master`: Immutable release line. Merges require successful CI and corresponding documentation updates.
- `develop` (optional): Integration branch for completed features before stabilization.
- `feature/*`: Branches from `master` or `develop`; must be rebased before merge.
- `hotfix/*`: Branches from `master`; requires `STATUS.md` update upon completion.
- Every PR must reference affected tasks and include `BITACORA.md` entries.

## Allowed Task States
Valid states are:
1. `planned`
2. `ready`
3. `in_progress`
4. `in_review`
5. `blocked`
6. `done`

Allowed transitions include:
- `planned` → `ready`
- `ready` → `in_progress`
- `in_progress` → `in_review`
- `in_review` → `done`
- `in_progress` ↔ `blocked`
- `in_review` → `in_progress` (requested changes)

## Work-In-Progress (WIP) Constraints
- **WIP limit:** Maximum of 2 simultaneous `in_progress` tasks per individual or AI agent.
- Exceeding this limit requires approval documented in `WIP_GUIDELINES.md` and logged in `BITACORA.md`.

## Blocker Lifecycle
1. **Discovery:** Log blocker in `BLOCKERS.md` with ID, description, severity, owner, timestamp.
2. **Assessment:** Reflect risk impact in `STATUS.md`; add mitigation notes in `BITACORA.md`.
3. **Escalation:** If unresolved after one business day, escalate per escalation policy.
4. **Resolution:** Document remediation in `BITACORA.md`; set blocker status to `resolved`.
5. **Retrospective:** Capture lessons learned and process improvements.

## Documentation Discipline
- `BITACORA.md`: Must chronologically record every state change, decision, or exception.
- `STATUS.md`: Must be updated at least daily or after each PR merge.
- `PLAN.md`: Source of truth for milestones, scope, ownership, and task state.

## AI Agent Responsibilities
- Parse the project YAML before acting.
- Do not open PRs unless relevant task state is `in_review`.
- Log assumptions and uncertainties in `BITACORA.md`.

## Compliance and Enforcement
- CI should validate required files and minimum structural checks.
- Periodic governance audits will verify ongoing compliance.
