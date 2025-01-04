# Content Structuring


### **2. Content Structuring - Detailed Specification**

---

#### **2.1 Headers**

- **Custom Header Levels**:
  - **Available Levels**: H1, H2, H3, H4, H5, H6.
  - **UI Element**: A dropdown in the toolbar displaying header options (e.g., "Heading 1", "Heading 2", etc.).
  - **Behavior**: When a header level is selected, it changes the format of the current paragraph or the selected text to the appropriate header level.
  - **Shortcut**: Provide shortcuts for header levels (e.g., `Ctrl+1` for H1, `Ctrl+2` for H2).
  - **Implementation**:
    - HTML: Uses `<h1>`, `<h2>`, `<h3>`, etc., tags.
    - RTF/Markdown: Map to appropriate header formats based on the export format.

- **Custom Styling**:
  - Allow users to **define custom styles** for headers (e.g., font, color, size). These styles can be modified via a settings panel.
  - **Default Styles**: Provide default styling for each header level that can be overridden by users.

- **Multiple Headings in Selection**:
  - If the selection spans multiple paragraphs with different headings, the editor should show the heading as “mixed” or "indeterminate" in the UI.

---

#### **2.2 Lists**

- **Ordered (Numbered) Lists**:
  - **UI Element**: A button in the toolbar for creating ordered lists.
  - **Behavior**:
    - When clicked, it converts the selected text or paragraph into an ordered list item.
    - Subsequent `Enter` key presses should automatically create new list items.
  - **Numbering Format**: Default to numbers (1, 2, 3), but allow customization (e.g., Roman numerals I, II, III or alphabetic a, b, c).
  - **Implementation**:
    - HTML: Uses `<ol>` (ordered list) and `<li>` (list item) tags.
    - RTF/Markdown: Map to numbered list formatting.

- **Unordered (Bullet) Lists**:
  - **UI Element**: A button in the toolbar for creating unordered lists.
  - **Behavior**:
    - Converts the selected text or paragraph into a bulleted list item.
    - Pressing `Enter` creates new bullet points.
  - **Bullet Types**: Provide multiple bullet styles (e.g., dots, dashes, squares).
  - **Implementation**:
    - HTML: Uses `<ul>` (unordered list) and `<li>` tags.
    - RTF/Markdown: Map to bullet list formatting.

- **Nested Lists**:
  - **Indentation**: Users can increase or decrease list indentation via the toolbar or shortcuts (`Tab` to increase indent, `Shift+Tab` to decrease).
  - **Behavior**: Indenting a list item will nest it under the previous list item, creating a **sublist**.
  - **Multi-Level Lists**: The editor should support multi-level lists, with the ability to switch between bullet and numbered list types at different levels.

- **List Continuation**:
  - Lists should continue when the user presses `Enter` at the end of a list item, but pressing `Enter` twice should end the list and switch back to a paragraph format.

---

#### **2.3 Indentation Control**

- **Paragraph Indentation**:
  - **UI Element**: Buttons in the toolbar to **increase** and **decrease** indentation.
  - **Behavior**:
    - Increases or decreases the indentation of the current paragraph or selected text.
    - **Custom Values**: Users should be able to define custom indentation sizes (e.g., 10px, 20px).
  - **Implementation**:
    - HTML: Uses `style="margin-left:..."` or `style="text-indent:..."`.

- **List Indentation**:
  - The same indentation controls apply to lists, allowing users to **nest list items**.
  - **Tab and Shift+Tab** shortcuts should adjust the list levels.
  
---

#### **2.4 Block Elements**

- **Block Formats**:
  - **Paragraph**:
    - **UI Element**: Paragraph is the default format in the dropdown (along with headers, lists).
    - **Behavior**: Resets any special formatting (e.g., heading, preformatted text) to standard paragraph text.
    - **Implementation**: Wraps text in `<p>` tags in HTML and the corresponding tags in other formats.
  
  - **Preformatted Text**:
    - **UI Element**: Available in the block format dropdown.
    - **Behavior**: Formats text as **preformatted** (i.e., preserves whitespace and uses a monospaced font).
    - **Implementation**: Uses `<pre>` tags in HTML to preserve formatting exactly as typed (e.g., spaces, line breaks).
    - **Use Case**: Useful for code snippets or text where spacing and formatting must remain untouched.
  
  - **Custom Blocks**:
    - **UI Element**: A "Custom Block" option in the block format dropdown.
    - **Behavior**: Allows users to apply a custom-defined block style, which could include specific font settings, background colors, padding, and borders.
    - **Implementation**: Uses a combination of `<div>` or `<section>` tags with custom CSS classes (e.g., `.custom-block`).
    - **Custom Block Settings**: Users can define custom styles for blocks, like colored backgrounds for callouts or bordered boxes for special content.
    - **Drag-and-Drop**: Allow users to drag these blocks around within the document for flexible positioning.

---

### **User Flow for Content Structuring**

- **Headers**: When a user selects a header option (H1, H2, etc.), the current paragraph or selected block will change its format to that header level. If the user selects a custom header style, it will apply the associated styles (font, color, size).
  
- **Lists**: Lists will automatically format paragraphs as ordered or unordered lists. Pressing `Enter` creates a new list item, and pressing `Tab` indents it to create a nested list. `Shift+Tab` will decrease the indent level, making the list item part of the previous level.

- **Block Elements**: Users can switch between different block types (e.g., paragraph, preformatted text) based on the nature of their content. Custom blocks will be stylized and adjustable for special purposes.

---

### **Performance Considerations**

- **Efficient DOM Management**: When switching between list items, headers, and block formats, the editor should ensure minimal DOM manipulation to avoid performance hits on large documents.
  
- **Consistency in Mixed Formatting**: Handle cases where multiple block types are selected. For example, when switching between a header and paragraph format, maintain formatting consistency across selections.

---

### **Edge Cases**

- **Mixed Lists and Headers**: If a list contains multiple headers, the editor should handle the formatting properly without breaking the list structure. For example, if a user applies a heading to a list item, it should still behave like a list while adopting the header style.

- **Empty List Items**: If a user creates a list item but leaves it empty and presses `Enter`, the list should end, and the cursor should return to a regular paragraph.

- **Custom Block Removal**: When switching from a custom block to a regular paragraph, ensure that all custom styles are properly cleared.


