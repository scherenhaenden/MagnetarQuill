# Testing Strategy for MagnetarQuill

## Types of Tests
- **Unit Tests:** Validate command execution, state transitions, and serialization helpers.
- **Integration Tests:** Verify component interactions (toolbar ↔ editor surface ↔ model binding).
- **End-to-End Tests:** Validate user workflows in the host application (formatting, insertions, save/load).
- **Regression Tests:** Preserve behavior for fixed bugs and previously shipped features.

## Code Coverage
- Automated test coverage target: **≥ 80%** for critical editor core modules.
- New core features should include tests before merge.

## Acceptance Criteria
- All required tests pass in CI.
- No critical or high-severity regressions remain open.
- Documentation updates are included for behavior changes.

## Bug Reporting Process
1. Create an issue with reproducible steps, expected behavior, and actual behavior.
2. Assign severity (`critical`, `high`, `medium`, `low`) and impacted component.
3. Link issue to relevant task and milestone.
4. Add regression test before closure when applicable.
5. Record significant bug milestones (discovery/resolution) in `BITACORA.md`.
