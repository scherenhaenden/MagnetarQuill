// File: key-shortcuts.ts (or wherever you place this)

export enum ShortcutAction {
  // Basic Formatting
  Bold            = 'bold',
  Italic          = 'italic',
  Underline       = 'underline',
  Strikethrough   = 'strikethrough',
  Superscript     = 'superscript',
  Subscript       = 'subscript',
  ClearFormatting = 'clearFormatting',

  // List Formatting
  OrderedList     = 'orderedList',
  UnorderedList   = 'unorderedList',
  Indent          = 'indent',   // Could be for lists or general text
  Outdent         = 'outdent',  // Could be for lists or general text

  // History
  Undo            = 'undo',
  Redo            = 'redo',

  // Block Formatting (Example - add if needed)
  Blockquote      = 'blockquote',
  CodeBlock       = 'codeBlock',

  // Add other specific actions your editor might support via shortcuts
}

// You would also keep the interface from the suggestion:
export interface ShortcutDef {
  key: string;          // physical key, lower-case
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;       // ⌘ on macOS
  action: ShortcutAction;
}
