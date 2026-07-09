// File: keyboard-shortcut.service.ts
import { Injectable, OnDestroy, inject } from '@angular/core';
import { Subject } from 'rxjs';
import {FormattingService} from "./formatting.service";
import {SHORTCUTS} from "../models/shortcut-map";
import {ShortcutAction} from "../models/key-shortcuts";


// NOTE: filter, map from rxjs/operators were imported but not used in the original snippet. Removed for now.
// import { filter, map } from 'rxjs/operators';

// Import other services if needed (e.g., HistoryService for Undo/Redo)
// import { HistoryService } from './services/history.service';

/**
 * @generatedInfoDoc
 * InfoDoc: class `KeyboardShortcutService` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/keyboard-shortcut.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */






@Injectable()
export class KeyboardShortcutService implements OnDestroy {

  private readonly destroy$ = new Subject<void>();
  private readonly fmt = inject(FormattingService);
  private editorElement: HTMLElement | null = null;
  // Example: Inject HistoryService if it handles Undo/Redo
  // private readonly history = inject(HistoryService);

    /**
 * @generatedInfoDoc
 * InfoDoc: constructor for class `KeyboardShortcutService` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/keyboard-shortcut.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */






constructor() {
    // Use capture phase (true) to catch event early, potentially overriding default browser behavior
    window.addEventListener('keydown', this.handleKeydown, true);
  }

  /**
   * Initializes the service with the host element of the editor.
   * This is used to scope keyboard shortcuts to a specific editor instance.
   * @param {HTMLElement} element - The editor's native element.
   */
    /**
 * @generatedInfoDoc
 * InfoDoc: method `KeyboardShortcutService`.`initialize()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/keyboard-shortcut.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */






public initialize(element: HTMLElement): void {
    this.editorElement = element;
  }

  /** remove listener when the service is destroyed */
    /**
 * @generatedInfoDoc
 * InfoDoc: method `KeyboardShortcutService`.`ngOnDestroy()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/keyboard-shortcut.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */






public ngOnDestroy(): void {
    window.removeEventListener('keydown', this.handleKeydown, true);
    if (!this.destroy$.closed) {
      this.destroy$.complete();
      this.destroy$.unsubscribe();
    }
  }

  // ——————————————————————————— private ———————————————————————————

  // Using an arrow function assigned to a property preserves `this` context
  private readonly handleKeydown = (ev: KeyboardEvent): void => {

    if(!this.fmt) {
      console.error('FormattingService is not available in KeyboardShortcutService.');
      return;
    }

    const targetElement = ev.target as HTMLElement | null;

    // IMPORTANT: Only process shortcuts if the event target is inside this specific editor instance.
    // This prevents multiple editor instances from all reacting to the same global keydown event.
    if (!targetElement || !this.editorElement || !this.editorElement.contains(targetElement)) {
      return;
    }

    // Ignore shortcuts if typing inside an input, textarea etc., unless specifically allowed
    // Note: inputs usually have isContentEditable=false. The editor div has isContentEditable=true.
    if (!targetElement.isContentEditable && ['INPUT', 'TEXTAREA', 'SELECT'].includes(targetElement.tagName)) {
      return;
    }

    const match = SHORTCUTS.find(d =>
      ev.key.toLowerCase() === d.key &&
      (d.ctrl  ?? false) === ev.ctrlKey  &&
      (d.meta  ?? false) === ev.metaKey &&
      (d.shift ?? false) === ev.shiftKey &&
      (d.alt   ?? false) === ev.altKey
    );


    if (!match) {
      // No matching shortcut found in our map
      return;
    }

    // Keep native browser history handling for contenteditable editors.
    if (match.action === ShortcutAction.Undo || match.action === ShortcutAction.Redo) {
      return;
    }

    // Prevent default browser action for the matched shortcut (e.g., Ctrl+B making text bold natively)
    ev.preventDefault();
    // Stop the event from bubbling up or triggering other listeners
    ev.stopImmediatePropagation();

    // Call the corresponding service method based on the matched action
    switch (match.action) {
      // Basic Formatting
      case ShortcutAction.Bold:            this.fmt.toggleBold();            break;
      case ShortcutAction.Italic:          this.fmt.toggleItalic();          break;
      case ShortcutAction.Underline:       this.fmt.toggleUnderline();       break;
      case ShortcutAction.Strikethrough:   this.fmt.toggleStrikethrough();   break; // Assumes fmt service has this
      case ShortcutAction.Superscript:     this.fmt.toggleSuperscript();     break; // Assumes fmt service has this (e.g., wrapSelectionWithTag('sup'))
      case ShortcutAction.Subscript:       this.fmt.toggleSubscript();       break; // Assumes fmt service has this (e.g., wrapSelectionWithTag('sub'))
      case ShortcutAction.ClearFormatting: this.fmt.clearFormatting();       break; // Assumes fmt service has this

      // List Formatting
      case ShortcutAction.OrderedList:     this.fmt.toggleList('ordered');   break; // Assumes fmt service has this
      case ShortcutAction.UnorderedList:   this.fmt.toggleList('unordered'); break; // Assumes fmt service has this
      case ShortcutAction.Indent:          this.fmt.indent();                break; // Assumes fmt service has this
      case ShortcutAction.Outdent:         this.fmt.outdent();               break; // Assumes fmt service has this

      // Block Formatting Examples
      case ShortcutAction.Blockquote:      this.fmt.blockquote(); break; // Assumes fmt service has formatBlock
      case ShortcutAction.CodeBlock:       this.fmt.codeBlock();        break; // Assumes fmt service has formatBlock (using <pre> for code)

      // Default case for actions defined in enum but not handled here yet
      default:
        console.warn(`Shortcut action "${match.action}" triggered but not handled in KeyboardShortcutService.`);
    }
  };
}
