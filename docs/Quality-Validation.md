# Quality Validation

## One-command Validation

Use this command from the repository root:

```bash
npm run quality:report
```

The command runs the complete local quality suite:

1. Generated info-doc validation.
2. Style lint for duplicate selectors.
3. Angular lint for the app and library.
4. Library unit tests in Chrome Headless with coverage.
5. Library production build.
6. Application production build.

The runner continues after failures so the final report shows every check status in one place.

## Reports

Each run writes:

- `reports/quality/latest.md`: latest quality summary.
- `reports/quality/quality-report-<timestamp>.md`: timestamped summary.
- `reports/quality/<timestamp>-<check>.log`: raw output for each check.

The report includes pass/fail status, duration, log paths, and coverage percentages.

## Current Baseline

Last verified command:

```bash
npm run quality:report
```

Latest result:

- Overall status: PASS.
- Unit tests: 283 passed.
- Statements: 80.18%.
- Branches: 74.05%.
- Functions: 78.28%.
- Lines: 80.29%.

The application build currently emits a warning because the initial bundle exceeds the warning budget, but the build still passes.
