# Text Formatting

### **1. Text Formatting - Detailed Specification**

#### **1.1 Basic Formatting Options**

- **Bold**: 
  - **Shortcut**: `Ctrl+B` (or `Cmd+B` on Mac).
  - **Behavior**: Applies bold styling to the selected text. If no text is selected, it toggles the bold state for any subsequently typed text.
  - **Implementation**: The editor should use `<strong>` or `<b>` tags in HTML mode, or the equivalent in other export formats (RTF, Markdown).

- **Italic**: 
  - **Shortcut**: `Ctrl+I` (or `Cmd+I` on Mac).
  - **Behavior**: Applies italic styling to the selected text. If no text is selected, it toggles the italic state for future text.
  - **Implementation**: Uses `<em>` or `<i>` tags in HTML mode.

- **Underline**: 
  - **Shortcut**: `Ctrl+U` (or `Cmd+U` on Mac).
  - **Behavior**: Underlines the selected text or toggles underline for subsequent text if none is selected.
  - **Implementation**: Uses `<u>` tag in HTML or equivalent.

- **Strikethrough**: 
  - **Shortcut**: No default shortcut.
  - **Behavior**: Applies strikethrough to selected text or toggles it for subsequent text.
  - **Implementation**: Uses `<s>` or `<strike>` tags in HTML.

---

#### **1.2 Font Options**

- **Font Family Selection**:
  - **UI Element**: Dropdown in the toolbar listing default and custom fonts.
  - **Default Fonts**: Common fonts like Arial, Times New Roman, Courier, etc., along with web-safe fonts.
  - **Behavior**: When a font is selected, it applies to the selected text or changes the current font for future input.
  - **Implementation**: Uses `style="font-family: ..."`.
  - **Custom Fonts**: Users should be able to add custom fonts by specifying a font URL (e.g., Google Fonts).

- **Font Size**:
  - **UI Element**: Dropdown or number input for selecting sizes (e.g., 10px, 12px, 14px).
  - **Behavior**: Changes the size of selected text or applies it to subsequent text if none is selected.
  - **Implementation**: Uses `style="font-size: ..."`.
  - **Range**: Font size should range from 8px to 72px, with customizable step values (e.g., 2px increments).

- **Text Color**:
  - **UI Element**: Color picker in the toolbar.
  - **Behavior**: Applies the chosen text color to the selection or sets it for future text.
  - **Implementation**: Uses `style="color: ..."`.
  - **Custom Colors**: Support for custom hex values and color palette.

- **Background Color**:
  - **UI Element**: Color picker in the toolbar, specifically for background highlight.
  - **Behavior**: Changes the background (highlight) color of the selected text or toggles for subsequent text.
  - **Implementation**: Uses `style="background-color: ..."`.

---

#### **1.3 Text Alignment & Spacing**

- **Text Alignment**:
  - **Options**: Left, Right, Center, Justify.
  - **UI Element**: A set of buttons in the toolbar for each alignment option.
  - **Behavior**: Applies to the entire paragraph in which the cursor is located or to multiple selected paragraphs.
  - **Implementation**: Uses `style="text-align: ..."`.
  
- **Line Spacing**:
  - **UI Element**: Dropdown or number input to control the space between lines (e.g., 1.0, 1.5, 2.0).
  - **Behavior**: Changes line spacing for the selected paragraph(s).
  - **Implementation**: Uses `style="line-height: ..."`.
  - **Custom Values**: Allow users to input specific line-height values (e.g., 1.15).

---

#### **1.4 Special Characters**

- **Superscript**:
  - **Shortcut**: `Ctrl+Shift+=` (or `Cmd+Shift+=` on Mac).
  - **Behavior**: Raises the selected text slightly above the baseline.
  - **Implementation**: Uses `<sup>` tags.

- **Subscript**:
  - **Shortcut**: `Ctrl+=` (or `Cmd+=` on Mac).
  - **Behavior**: Lowers the selected text slightly below the baseline.
  - **Implementation**: Uses `<sub>` tags.

---

#### **1.5 Custom Styles**

- **UI Element**: Dropdown for predefined styles (e.g., Heading 1, Heading 2, Paragraph).
- **Behavior**: Applies a predefined style to the selected text, changing its font, size, color, etc.
- **Implementation**: Predefined styles map to CSS classes (e.g., `.heading1`, `.paragraph`).
- **Custom Styles**: Users can create and save their own styles with custom settings for font, color, size, etc.

---

### **User Flow for Text Formatting**
- **Selection-Based Application**: Users can highlight text and apply bold, italics, etc., directly to the selection. The same applies to font changes, colors, and alignment.
- **Global Setting**: If no text is selected, changes will affect the text typed after the formatting action.
- **Clear Formatting**: A "clear formatting" button will reset any formatting applied to the selected text.

---

### **Performance Considerations**
- **Minimal DOM Manipulation**: Keep DOM manipulations to a minimum when applying formatting, especially with large documents.
- **Efficient Undo/Redo**: Ensure that each formatting change creates a history state, allowing easy undo/redo without performance hits.

---

### **Edge Cases**
- **Mixed Formatting**: When text with mixed formatting is selected, the toolbar should reflect an "indeterminate" state (e.g., the bold button is highlighted if part of the selection is bold).
- **Nested Formatting**: Handle cases where users apply overlapping formatting (e.g., bold inside italic text), ensuring consistent behavior across different browsers.

---

