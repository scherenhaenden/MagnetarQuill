# Branching Model

This project uses a Magnetar-adapted GitFlow model.

## Long-Lived Branches
- `master`: Production-ready, immutable release line.
- `develop` (optional): Integration branch for completed features.

## Short-Lived Branches
- `feature/<short-description>`
- `fix/<short-description>`
- `chore/<short-description>`
- `experiment/<short-description>`
- `hotfix/<short-description>`

## Merge Rules
- Rebase feature/fix branches before merge.
- Require CI success and documentation updates.
- PRs must reference affected tasks and include `BITACORA.md` entries.

## Release and Hotfix Flow
- Releases are cut from `master` after verification.
- Hotfixes branch from `master`, merge back to `master` (and `develop` if used), and require `STATUS.md` updates.
