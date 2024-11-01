import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FormattingService {

  constructor() { }

  // Toggle list type (ordered or unordered)
  public toggleList(type: 'ordered' | 'unordered'): void {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      return;
    }

    const range = selection.getRangeAt(0);
    const listTag = type === 'ordered' ? 'ol' : 'ul';
    const list = document.createElement(listTag);

    // Wrap selected content in list items
    const fragment = range.extractContents();
    const items = Array.from(fragment.childNodes);
    items.forEach(node => {
      const listItem = document.createElement('li');
      listItem.appendChild(node);
      list.appendChild(listItem);
    });

    range.insertNode(list);
    selection.removeAllRanges();
    selection.addRange(range);
  }

  // Apply a header level (H1-H6) or paragraph to the selected text
  public applyHeader(headerLevel: string): void {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);

      // Create the header element (or <p> for normal text)
      const headerTag = headerLevel || 'p';
      const headerElement = document.createElement(headerTag);

      // Wrap the selected content in the header element
      headerElement.appendChild(range.extractContents());
      range.insertNode(headerElement);

      // Adjust the selection to be within the new header element
      selection.removeAllRanges();
      range.selectNodeContents(headerElement);
      selection.addRange(range);
    }
  }
}
