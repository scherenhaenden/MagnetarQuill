# Contributing Guidelines

## Development Setup
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the project locally:
   ```bash
   npx nx serve
   ```

## Contribution Workflow
1. Create a branch using the canonical naming convention.
2. Implement scoped changes tied to one or more tasks.
3. Update relevant docs (`PLAN.md`, `STATUS.md`, `BITACORA.md`) when state or decisions change.
4. Run tests and static checks before opening PR.
5. Open PR with linked task IDs and concise change summary.

## Pull Request Requirements
- CI must pass.
- Documentation must be synchronized.
- Task states should be accurate (`in_review` before PR where applicable).
