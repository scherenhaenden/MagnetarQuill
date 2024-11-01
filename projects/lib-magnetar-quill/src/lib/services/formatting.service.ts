import {Injectable, signal, WritableSignal} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FormattingService {

  // Signals to track formatting states
  public boldActive = signal(false);
  public italicActive = signal(false);
  public underlineActive = signal(false);
  public strikethroughActive = signal(false);

  constructor() { }


  // Method to update formatting states based on the current selection
  public updateFormatStates(): void {
    console.log("something");
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const container = selection.getRangeAt(0).commonAncestorContainer.parentElement;
      if (container) {
        this.boldActive.set(container.style.fontWeight === 'bold');
        this.italicActive.set(container.style.fontStyle === 'italic');
        this.underlineActive.set(container.style.textDecoration.includes('underline'));
        this.strikethroughActive.set(container.style.textDecoration.includes('line-through'));
      }
    }
  }

  // General toggle function to apply or remove styles based on current active state
  private toggler(activeSignal: WritableSignal<boolean>, styleName: string, value: string): void {
    if (activeSignal()) {
      this.removeFormatting(styleName, value);
    } else {
      this.applyStyle(styleName, value);
    }
    activeSignal.update(active => !active);
  }




  public toggleBold(): void {
    this.toggler(this.boldActive, 'font-weight', 'bold');
  }

  public toggleItalic(): void {
    this.toggler(this.italicActive, 'font-style', 'italic');
  }

  public toggleUnderline(): void {
    this.toggler(this.underlineActive, 'text-decoration', 'underline');
  }

  public toggleStrikethrough(): void {
    this.toggler(this.strikethroughActive, 'text-decoration', 'line-through');
  }




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


  public applyStyle(styleName: string, value: string): void {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const selectedText = range.extractContents();
      const span = document.createElement('span');
      span.style[styleName as any] = value;
      span.appendChild(selectedText);
      range.insertNode(span);
    }
  }


  private unwrap(element: HTMLElement): void {
    const parent = element.parentNode;
    if (parent) {
      while (element.firstChild) {
        parent.insertBefore(element.firstChild, element);
      }
      parent.removeChild(element);
    }
  }

  private removeFormatting(styleName: string, value: string): void {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const fragment = range.cloneContents();

      // Look for all span elements in the selection
      const spans = fragment.querySelectorAll('span');
      spans.forEach((span) => {
        if (span.style[styleName as any] === value) {
          this.unwrap(span);
        }
      });

      // Clear the existing selection and insert the unwrapped fragment
      range.deleteContents();
      range.insertNode(fragment);
    }
  }

}
