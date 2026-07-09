# Editor Formatting Selection Plan - 2026-07-09

## Problem

- Text alignment currently changes only the block at the caret for multi-paragraph selections because the selected paragraphs are read from cloned range contents.
- Selecting multiple paragraphs or the whole editor should apply left, center, right, or justify to every real block touched by the selection.
- Header formatting does not expose the active header state in the toolbar, and applying H1 cannot be toggled back to Normal.

## Plan

1. Add a `currentHeader` formatting signal so the toolbar can reflect the header level at the current selection.
2. Resolve selected formatting targets from the live editor DOM, including paragraphs, headings, list items, and common block containers.
3. Update text alignment to apply styles to all live blocks intersecting the current selection, while preserving the single-caret behavior.
4. Update header application to convert selected live blocks to the requested heading/paragraph tag and toggle a matching heading back to Normal.
5. Bind the header dropdown value to the `currentHeader` signal.
6. Add regression tests for multi-block alignment, active H1 detection, and H1 toggle-off behavior.
7. Run the focused library tests/build to verify the fix.

## Completed

- Added live DOM block resolution for formatting commands.
- Updated text alignment so left, center, right, and justify apply to all selected blocks instead of cloned range contents.
- Added `currentHeader` state tracking and bound the toolbar header dropdown to it.
- Updated header conversion so selecting `Normal` converts selected headings back to paragraphs.
- Added regression coverage for multi-block alignment, caret-only alignment, H1 activation, and H1-to-Normal conversion.
- Added `npm run quality:report` for full lint, style, test, coverage, and build validation with Markdown reports.

## Note

The toolbar currently uses a native `<select>` for headings. A native select does not emit a `change` event when the already-selected option is chosen again, so removing an active H1 is supported by choosing `Normal`.

## Verification

- `npm run quality:report`
- Latest report: `reports/quality/latest.md`
