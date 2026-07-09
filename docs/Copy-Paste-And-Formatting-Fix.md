# Copy/Paste and Formatting Toggle Fix

## Context

This note documents the fixes made on branch `fix/paste-content-change` for two related editor issues:

- Pasted content appeared in the editor but did not reliably emit outward `contentChange` updates.
- Formatting buttons such as bold, italic, and strikethrough could be activated but were difficult or impossible to deactivate afterward.

Use the Node/npm versions that match the target branch lockfile when validating or publishing the package.

## Affected Files

- `projects/lib-magnetar-quill/src/lib/components/editor/editor.component.ts`
- `projects/lib-magnetar-quill/src/lib/services/content.service.ts`
- `projects/lib-magnetar-quill/src/lib/services/formatting.service.ts`
- `projects/lib-magnetar-quill/src/lib/components/editor/editor.component.spec.ts`
- `projects/lib-magnetar-quill/src/lib/services/formatting.service.spec.ts`
- `package.json`
- `projects/lib-magnetar-quill/package.json`
- `package-lock.json`

## Copy/Paste Fix

### Problem

The editor intercepts paste events with `event.preventDefault()` and manually inserts pasted HTML, text, or images into the DOM.

Before this fix, those manual insertions bypassed the normal `onContentChange(...)` path. This meant:

- The editor DOM changed.
- The internal browser view showed the pasted content.
- But `EditorComponent.contentChanged` was not emitted consistently.
- Therefore the wrapper component did not emit public `contentChange` reliably.

### Fix

`EditorComponent` now uses a helper called `emitCurrentEditorContent(...)` after manual paste insertions.

That helper reads `editorWysiwyg.nativeElement.innerHTML` and routes it through the same `onContentChange(...)` method used by normal editor input.

This keeps paste behavior aligned with normal typing:

1. DOM changes.
2. `ContentService` receives the updated HTML.
3. `EditorComponent.contentChanged` emits.
4. `LibMagnetarQuillComponent.contentChange` emits outward.

### Selection Fix After Paste

`ContentService.insertHtmlAtCursor(...)` and `insertTextAtCursor(...)` now move the selection after the inserted content.

This prevents follow-up typing or toolbar actions from targeting the old selection/range around pasted content.

## Formatting Toggle Fix

### Problem

Formatting activation used `applyStyle(...)`, which wraps the selected content in a styled `<span>`.

Example:

```html
<span style="font-weight: bold">Text</span>
```

Deactivation used `removeFormatting(...)`, but the old implementation cloned the selected range and searched only for descendant `<span>` elements inside the clone.

That fails in common cases because the active styled `<span>` is often the ancestor/container of the selected text, not a descendant inside the cloned fragment.

Result:

- `boldActive`, `italicActive`, or `strikethroughActive` could flip to `false`.
- But the actual DOM style stayed in place.
- The UI looked like the user could not turn formatting off.

### Fix

`removeFormatting(...)` now works on the live DOM instead of mutating a cloned fragment.

The implementation:

1. Finds matching styled elements that intersect the active range.
2. Also checks selection ancestors, because the styled span can wrap the entire selection.
3. Removes only the requested CSS property.
4. Unwraps an empty `<span>` when no style remains.
5. Re-anchors the saved selection to the real nodes left in the DOM.

This is important because `ToolbarComponent.withEditorSelection(...)` restores the last saved range before every toolbar action. If a style removal deletes or unwraps a node, the saved range must not keep pointing at the removed node.

## Bound Editor Formatting Sync Fix

### Problem

When two `magnetar-quill` instances were bound to the same external `content` value, normal typing propagated between editors, but toolbar formatting did not reliably preserve the same HTML in the second editor.

The first phase of the fix made toolbar actions emit the active editor HTML, but the receiving editor still rendered different HTML because the inbound sync path used Angular HTML sanitization. That path preserved the text but stripped inline formatting styles such as:

- `font-weight: bold`
- `text-align: left`
- `text-align: center`
- `text-align: right`
- `text-align: justify`

### Fix

Toolbar actions now publish the active contenteditable editor's `innerHTML` through the same public `contentChange` path used by typing and paste.

The editor sync path now sanitizes inbound editor HTML without dropping safe formatting styles. It still removes unsafe content before writing to the editor DOM:

- unsafe elements such as `script`, `iframe`, `embed`, and `object`
- event-handler attributes such as `onclick`
- `srcdoc`
- `javascript:` URLs in `href` or `src`
- unsafe style values containing `url(...)`, `expression(...)`, or `javascript:`

## Version Change

The root package and library package are both set to `0.10.4`:

- `package.json`
- `projects/lib-magnetar-quill/package.json`

The root package-lock version was updated to match. Version `0.10.4` (bumped from `0.10.3`) is a patch release for bound-editor formatting synchronization and safe editor HTML rehydration.

## Verification Commands

Use Node `24.16.0` explicitly:

```bash
source ~/.nvm/nvm.sh
nvm use 24.16.0
```

Run the paste regression spec:

```bash
npx ng test lib-magnetar-quill --include projects/lib-magnetar-quill/src/lib/components/editor/editor.component.spec.ts --watch=false --no-progress --code-coverage=false
```

Run the formatting regression spec:

```bash
npx ng test lib-magnetar-quill --include projects/lib-magnetar-quill/src/lib/services/formatting.service.spec.ts --watch=false --no-progress --code-coverage=false
```

Run the library build:

```bash
npx ng build lib-magnetar-quill
```

## Regression Coverage Added

Paste tests now verify:

- HTML paste emits `contentChanged`.
- Plain text paste emits `contentChanged`.

Formatting tests now verify real DOM behavior:

- Bold can be applied and then removed.
- Italic can be applied and then removed.
- Strikethrough can be applied and then removed.
- Strong can be removed from only the selected slice inside a shared `<strong>` element.
- Strong and inline bold can be toggled independently when both formats are present.

Bound editor sync tests now verify:

- Synced content preserves `font-weight: bold`.
- Synced content preserves `text-align`.
- Unsafe synced HTML is removed without dropping safe formatting styles.

These tests intentionally avoid only spying on method calls because that missed the original bug: the method was called, but the DOM was not actually cleaned.

## Maintenance Notes

- Do not reintroduce clone-and-reinsert logic for simple formatting removal unless the selection behavior is fully tested.
- If a formatting action unwraps or replaces DOM nodes, always re-anchor `lastActiveRange`.
- Toolbar actions depend on `FormattingService.restoreSelection()`, so stale ranges can break subsequent actions even if one action appears to work.
- Keep the published package version aligned between the root package, the library package, and the lockfile.
