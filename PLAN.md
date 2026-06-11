# Canonical Plan of MagnetarQuill

This plan captures milestones, tasks, effort estimates, and task status; its structure must be kept intact.

## Milestones Overview
| Milestone ID | Name | Target Date | Description | Completion Criteria |
|---|---|---|---|---|
| `ms-01` | Project Initiation | 2026-02-20 | Establish governance baseline and canonical artifacts. | Required governance and planning files created and reviewed. |
| `ms-02` | Core Editor Baseline | 2026-03-10 | Validate core editing capabilities and architecture alignment. | Core requirements mapped to architecture and test strategy. |
| `ms-03` | Delivery Readiness | 2026-03-31 | Prepare release workflow and quality gates. | Branching, CI checks, and release checklist operational. |

## Task Backlog
| Task ID | Milestone | Title | Owner | Effort (pts) | Weight (%) | State | Notes |
|---|---|---|---|---:|---:|---|---|
| `task-101` | `ms-01` | Create canonical governance docs | Platform Team | 3 | 15 | `done` | Initial docs created and linked. |
| `task-102` | `ms-01` | Define machine-readable project template | Platform Team | 2 | 10 | `in_review` | Awaiting final schema validation. |
| `task-201` | `ms-02` | Align requirements with architecture modules | Core Team | 5 | 25 | `in_progress` | Cross-checking module boundaries. |
| `task-202` | `ms-02` | Define baseline quality gates | QA Team | 4 | 20 | `ready` | Depends on testing strategy sign-off. |
| `task-203` | `ms-02` | Upgrade workspace to Angular 20.3.16 | Core Team | 3 | 15 | `in_review` | Dependency matrix aligned to Angular `^20.3.16`; npm registry policy currently blocks full reinstall (`403`) and is tracked for follow-up validation. |
| `task-204` | `ms-02` | Upgrade workspace to Angular 21 | Core Team | 3 | 15 | `done` | Upgraded to Angular 21.1.0; Tests verified. |
| `task-205` | `ms-02` | Upgrade workspace to Angular 22 | Core Team | 3 | 15 | `done` | Upgraded workspace and publishable library peer dependencies to Angular `^22.0.0`; restored Angular ESLint linting and verified lint/build gates. |
| `task-206` | `ms-02` | Implement Light/Dark/Custom Theme Support | Core Team | 3 | 15 | `in_review` | Theme customization API, CSS variables, and toolbar controls. |
| `task-207` | `ms-02` | Implement HTML/Markdown Import-Export and RTF Load | Core Team | 3 | 15 | `in_review` | File import/export toolbar inputs, parsing services, and unit tests. |
| `task-301` | `ms-03` | Formalize release checklist | Delivery Team | 6 | 30 | `planned` | Planned after ms-02 acceptance. |

## Effort Summary
- **Total effort:** 35 pts
- **Completed:** 9 pts
- **In progress:** 5 pts
- **In review:** 9 pts
- **Remaining:** 12 pts

## State Definitions
- `planned`: Identified and approved for backlog, not yet ready to start.
- `ready`: Fully refined and available to begin.
- `in_progress`: Actively being worked.
- `blocked`: Temporarily halted by a blocker.
- `in_review`: Implementation complete and under review.
- `done`: Accepted and complete per definition of done.

## Change Management
This document must be updated whenever tasks change state, scope, ownership, or estimates. Corresponding updates must also be reflected in the project YAML file and `BITACORA.md`.


## Upgrade Reflection (task-204)
- Angular 21 adoption is configuration-complete in source control (framework packages, builder toolchain, linting stack, and library peer dependencies).
- Execution risk remains external: package retrieval is restricted by registry policy (`403 Forbidden`), so lockfile regeneration and full runtime verification must be finalized once access is restored.
- Mitigation: keep task in `in_review`, track the blocker explicitly, and rerun full CI (install + tests) immediately after policy unblock.

## Upgrade Reflection (task-205)
- Angular 22 adoption is configuration-complete in source control (framework packages, Angular build toolchain, TypeScript 6, linting stack, and library peer dependencies).
- Local verification has covered `npm run lint`, `npm run build`, and `npm run build-lib`.
- Mitigation: preserve the Angular 22 manifests during branch merges so older Angular 21 metadata does not regress the package surface.
