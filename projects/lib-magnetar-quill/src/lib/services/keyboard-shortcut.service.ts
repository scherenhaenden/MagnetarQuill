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

@Injectable({ providedIn: 'root' })
export class KeyboardShortcutService implements OnDestroy {

  private readonly destroy$ = new Subject<void>();
  private readonly fmt = inject(FormattingService);
  // Example: Inject HistoryService if it handles Undo/Redo
  // private readonly history = inject(HistoryService);

  constructor() {
    // Use capture phase (true) to catch event early, potentially overriding default browser behavior
    window.addEventListener('keydown', this.handleKeydown, true);
    console.log('KeyboardShortcutService initialized and listener added.'); // Debug log
  }

  /** remove listener when the service is destroyed */
  public ngOnDestroy(): void {
    window.removeEventListener('keydown', this.handleKeydown, true);
    this.destroy$.next();
    this.destroy$.complete();
    console.log('KeyboardShortcutService destroyed and listener removed.'); // Debug log
  }

  // ——————————————————————————— private ———————————————————————————

  // Using an arrow function assigned to a property preserves `this` context
  private readonly handleKeydown = (ev: KeyboardEvent): void => {

    if(!this.fmt) {
      console.error('FormattingService is not available in KeyboardShortcutService.');
      return;
    }

    // Ignore shortcuts if typing inside an input, textarea etc., unless specifically allowed
    const targetElement = ev.target as HTMLElement;
    // Check explicitly if we are in a native input element and NOT in a contentEditable container (like the editor)
    // Note: inputs usually have isContentEditable=false. The editor div has isContentEditable=true.
    if (targetElement && !targetElement.isContentEditable && ['INPUT', 'TEXTAREA', 'SELECT'].includes(targetElement.tagName)) {
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

    console.log('Shortcut match found:', match.action); // Debug log

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

      // History
      case ShortcutAction.Undo:            /* this.history.undo(); */ console.warn(`Undo action triggered, requires HistoryService implementation.`); break; // Assumes history service exists
      case ShortcutAction.Redo:            /* this.history.redo(); */ console.warn(`Redo action triggered, requires HistoryService implementation.`); break; // Assumes history service exists

      // Block Formatting Examples
      case ShortcutAction.Blockquote:      this.fmt.blockquote(); break; // Assumes fmt service has formatBlock
      case ShortcutAction.CodeBlock:       this.fmt.codeBlock();        break; // Assumes fmt service has formatBlock (using <pre> for code)

      // Default case for actions defined in enum but not handled here yet
      default:
        console.warn(`Shortcut action "${match.action}" triggered but not handled in KeyboardShortcutService.`);
    }
  };
}
