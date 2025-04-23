// File: shortcut-map.ts
import { ShortcutAction, ShortcutDef } from './key-shortcuts';

export const SHORTCUTS: readonly ShortcutDef[] = [
  // Basic Formatting
  { key: 'b', ctrl: true,  action: ShortcutAction.Bold },
  { key: 'b', meta: true,  action: ShortcutAction.Bold },          // macOS Bold

  { key: 'i', ctrl: true,  action: ShortcutAction.Italic },
  { key: 'i', meta: true,  action: ShortcutAction.Italic },        // macOS Italic

  { key: 'u', ctrl: true,  action: ShortcutAction.Underline },
  { key: 'u', meta: true,  action: ShortcutAction.Underline },     // macOS Underline

  // Strikethrough (Example: Ctrl+Shift+S - Adjust if needed)
  { key: 's', ctrl: true, shift: true, action: ShortcutAction.Strikethrough },
  { key: 's', meta: true, shift: true, action: ShortcutAction.Strikethrough }, // macOS Strikethrough

  // Subscript/Superscript (Based on your ToolbarComponent code)
  { key: '=', ctrl: true,             action: ShortcutAction.Subscript },
  { key: '=', meta: true,             action: ShortcutAction.Subscript },    // macOS Subscript
  { key: '=', ctrl: true, shift: true, action: ShortcutAction.Superscript },
  { key: '=', meta: true, shift: true, action: ShortcutAction.Superscript }, // macOS Superscript

  // Lists (Examples: Ctrl+Shift+7/8 - Adjust if needed)
  { key: '7', ctrl: true, shift: true, action: ShortcutAction.OrderedList },
  { key: '7', meta: true, shift: true, action: ShortcutAction.OrderedList }, // macOS Ordered List
  { key: '8', ctrl: true, shift: true, action: ShortcutAction.UnorderedList },
  { key: '8', meta: true, shift: true, action: ShortcutAction.UnorderedList }, // macOS Unordered List

  // Indent/Outdent (Examples: Ctrl+] / Ctrl+[ - Adjust if needed)
  // Note: Tab/Shift+Tab might require more complex handling depending on context
  { key: ']', ctrl: true, action: ShortcutAction.Indent },
  { key: ']', meta: true, action: ShortcutAction.Indent }, // macOS Indent
  { key: '[', ctrl: true, action: ShortcutAction.Outdent },
  { key: '[', meta: true, action: ShortcutAction.Outdent }, // macOS Outdent

  // History
  { key: 'z', ctrl: true,             action: ShortcutAction.Undo },
  { key: 'z', meta: true,             action: ShortcutAction.Undo },         // macOS Undo
  { key: 'y', ctrl: true,             action: ShortcutAction.Redo },
  { key: 'z', ctrl: true, shift: true, action: ShortcutAction.Redo },         // Windows Redo alternative
  { key: 'y', meta: true,             action: ShortcutAction.Redo },         // macOS Redo (usually Shift+Cmd+Z)
  { key: 'z', meta: true, shift: true, action: ShortcutAction.Redo },         // macOS Redo standard

  // Clear Formatting (Example: Ctrl+\ - Adjust if needed)
  { key: '\\', ctrl: true, action: ShortcutAction.ClearFormatting },
  { key: '\\', meta: true, action: ShortcutAction.ClearFormatting }, // macOS Clear Formatting

  // Block Formatting Examples (Add/Adjust keybindings as needed)
  // { key: "'", ctrl: true, action: ShortcutAction.Blockquote }, // Example: Ctrl+'
  // { key: "'", meta: true, action: ShortcutAction.Blockquote }, // macOS Example: Cmd+'
  // { key: "k", ctrl: true, shift: true, action: ShortcutAction.CodeBlock }, // Example: Ctrl+Shift+K
  // { key: "k", meta: true, shift: true, action: ShortcutAction.CodeBlock }, // macOS Example: Cmd+Shift+K
];
