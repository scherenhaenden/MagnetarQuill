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
| `task-301` | `ms-03` | Formalize release checklist | Delivery Team | 6 | 30 | `planned` | Planned after ms-02 acceptance. |

## Effort Summary
- **Total effort:** 20 pts
- **Completed:** 3 pts
- **In progress:** 5 pts
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
