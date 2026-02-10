# Canonical Project Model of MagnetarQuill

## Purpose
MagnetarQuill exists to provide a structured, auditable way to build and evolve the MagnetarQuill editor and related deliverables. This repository follows the Magnetar standard for documentation, planning, and governance so that humans and AI collaborators can work consistently, transparently, and safely.

## How to Use This Repository
1. Clone the canonical model.
2. Copy and complete `projects/_template.project.yml` for your concrete project instance.
3. Replicate the required documentation set in your target repository.
4. Follow Work-In-Progress limits, branching rules, and blocker lifecycle policies.
5. Consult the example project artifacts to resolve implementation and governance questions.

## Project Contents
| File | Purpose |
|---|---|
| `PLAN.md` | Project tasks, milestones, owners, effort, and state tracking. |
| `BITACORA.md` | Immutable chronological logbook of project events and decisions. |
| `REQUIREMENTS.md` | Functional and non-functional specifications with priorities. |
| `ARCHITECTURE.md` | High-level system and module structure with key design decisions. |
| `RULES.md` | Naming conventions, state model, and workflow standards. |
| `STATUS.md` | Project health summary, progress indicators, risks, and mitigations. |
| `TESTING.md` | Testing strategy, coverage targets, and quality reporting rules. |
| `BLOCKERS.md` | Active/resolved blockers and escalation flow. |

Governance references: `BRANCHING_MODEL.md` and `WIP_GUIDELINES.md`.

## Progress Model Overview
Progress is tracked through milestones and tasks. Each task transitions through these states:
`planned` → `in_progress` → `in_review` → `done`.

Additional allowed states (`ready`, `blocked`) are defined in `RULES.md` and operationalized in `PLAN.md`. Every state transition, material decision, and exception must be recorded in `BITACORA.md`.

## YAML Project Schema
The file `projects/_template.project.yml` defines the canonical machine-readable schema. It captures:
- metadata
- stakeholders
- milestones
- tasks
- risks
- reporting configuration

This schema allows consistent automation, reporting, and compliance checks across projects.

## Guidance for AI Collaborators
AI agents must:
1. Parse the project YAML file before taking actions.
2. Use `PLAN.md` and `STATUS.md` to choose the highest-priority focus.
3. Respect `RULES.md`, `WIP_GUIDELINES.md`, and `BRANCHING_MODEL.md`.
4. Update `BITACORA.md` after completing any meaningful work.

## Architecture Diagram (Text)
```text
+-------------------+      +------------------+      +-------------------------+
| Governance Docs   | ---> | Planning Layer   | ---> | Execution Artifacts      |
| (RULES/BRANCHING/ |      | (PLAN/STATUS/YML)|      | (code, tests, blockers, |
| WIP/TESTING/etc.) |      |                  |      | bitacora entries)       |
+-------------------+      +------------------+      +-------------------------+
                                      |
                                      v
                            +------------------+
                            | Example Projects |
                            +------------------+
```

## Applying This Template
1. Copy this repository structure into your target project.
2. Replace placeholder content with project-specific details.
3. Instantiate `projects/<project>.project.yml` from the template and validate it.
4. Define initial milestones/tasks and log initial state in:
   - `PLAN.md`
   - `STATUS.md`
   - `BITACORA.md`

## Validating Canon Compliance
- [ ] All required files exist and are non-empty.
- [ ] Project YAML matches the canonical schema.
- [ ] `BITACORA.md` is updated reverse-chronologically (most recent first).
- [ ] Active branches follow `BRANCHING_MODEL.md`.
- [ ] Testing and blocker processes align with `TESTING.md` and `BLOCKERS.md`.
