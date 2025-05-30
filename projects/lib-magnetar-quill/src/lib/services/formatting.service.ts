import {Injectable, signal, WritableSignal} from '@angular/core';
import {ContentService} from "./content.service";

@Injectable({
  providedIn: 'root'
})
export class FormattingService {

  // Signals to track formatting states
  public boldActive = signal(false);
  public italicActive = signal(false);
  public underlineActive = signal(false);
  public strikethroughActive = signal(false);
  public strongActive = signal(false);

  constructor(private contentService: ContentService) { }


  // Method to update formatting states based on the current selection
  /**
   * Updates the formatting states (bold, italic, underline, strikethrough, strong)
   * based on the current text selection in the document.
   *
   * This method retrieves the current selection from the window and checks the
   * common ancestor container of the selected range. It determines the formatting
   * styles applied to the selected text by examining the style properties of the
   * container element. The method updates the corresponding state variables to
   * reflect whether each formatting style is active.
   *
   * It specifically checks for:
   * - Bold: If the font weight is set to 'bold'.
   * - Italic: If the font style is set to 'italic'.
   * - Underline: If the text decoration includes 'underline'.
   * - Strikethrough: If the text decoration includes 'line-through'.
   * - Strong: If the container element is a <strong> tag.
   *
   * @throws {Error} Throws an error if there is an issue accessing the selection or
   *                 if the container cannot be determined.
   *
   * @returns {void} This method does not return a value.
   *
   * @example
   * // Example usage:
   * // Assuming this method is called when a user selects text in a contenteditable element,
   * // it will update the formatting states based on the selected text's styles.
   */
  public updateFormatStates(): void {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      let container: Node | null = selection.getRangeAt(0).commonAncestorContainer;
      while (container && container.nodeType !== Node.ELEMENT_NODE) {
        container = container.parentNode;
      }
      if (container instanceof HTMLElement) {
        this.boldActive.set(container.style.fontWeight === 'bold');
        this.italicActive.set(container.style.fontStyle === 'italic');
        this.underlineActive.set(container.style.textDecoration.includes('underline'));
        this.strikethroughActive.set(container.style.textDecoration.includes('line-through'));
        // Check if the container is a <strong> element
        this.strongActive.set(container.tagName.toLowerCase() === 'strong');
      }
    }
  }



  // General toggle function to apply or remove styles based on current active state
  /**
   * Toggles the application of a specified style based on the current state of an active signal.
   * If the signal is active, the specified style is removed; otherwise, the style is applied.
   *
   * @param {WritableSignal<boolean>} activeSignal - A writable signal that indicates whether the style is currently active.
   * @param {string} styleName - The name of the style to be applied or removed.
   * @param {string} value - The value associated with the style to be applied or removed.
   * @returns {void} This function does not return a value.
   *
   * @example
   * const signal = createWritableSignal(false);
   * toggler(signal, 'highlight', 'red');
   * // If signal is false, 'highlight' style with value 'red' will be applied.
   *
   * @throws {Error} Throws an error if the activeSignal is not a WritableSignal.
   */
  private toggler(activeSignal: WritableSignal<boolean>, styleName: string, value: string): void {
    console.log('activeSignal', activeSignal())
    console.log('styleName', styleName)
    console.log('value', value)
    if (activeSignal()) {
      this.removeFormatting(styleName, value);
      activeSignal.set(false)
    } else {
      this.applyStyle(styleName, value);
      activeSignal.set(true)
    }
    //activeSignal.update(active => !active);
  }




  public toggleBold(): void {
    this.toggler(this.boldActive, 'font-weight', 'bold');
  }

  /**
   * Toggles the strong formatting of the currently selected text in the document.
   * If the selected text is already wrapped in a <strong> element, it unwraps it.
   * Otherwise, it wraps the selected text in a new <strong> element.
   *
   * This method modifies the DOM directly and updates the selection to reflect
   * the changes made. It also updates the internal state to indicate whether
   * the strong formatting is currently active.
   *
   * @throws {Error} Throws an error if the selection cannot be determined or if
   *                 there is an issue with modifying the DOM.
   *
   * @returns {void} This method does not return a value.
   *
   * @example
   * // Assuming there is a text selection in the document,
   * // calling toggleStrong will either wrap it in <strong> or unwrap it.
   * toggleStrong();
   */
  public toggleStrong(): void {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      return;
    }

    const range = selection.getRangeAt(0);
    let currentElement: Node | null = range.commonAncestorContainer;
    // Traverse up until we get an element node
    while (currentElement && currentElement.nodeType !== Node.ELEMENT_NODE) {
      currentElement = (currentElement as Element).parentElement;
    }

    if (currentElement instanceof HTMLElement && currentElement.tagName.toLowerCase() === 'strong') {
      // Unwrap the <strong> element and update the signal
      this.unwrap(currentElement);
      this.strongActive.set(false);
    } else {
      // Wrap the selected content in a <strong> element
      const strongElement = document.createElement('strong');
      strongElement.appendChild(range.extractContents());
      range.insertNode(strongElement);

      // Adjust the selection to cover the new <strong> element
      selection.removeAllRanges();
      const newRange = document.createRange();
      newRange.selectNodeContents(strongElement);
      selection.addRange(newRange);

      this.strongActive.set(true);
    }
  }




  /**
   * Toggles the italic styling for the text.
   * This method activates or deactivates the italic font style based on the current state of the italicActive property.
   * It utilizes a toggler function to apply the necessary CSS style changes.
   *
   * @returns {void} This method does not return a value.
   *
   * @example
   * // Assuming italicActive is true, calling toggleItalic will deactivate italic styling.
   * toggleItalic();
   *
   * @throws {Error} Throws an error if the toggler function is not defined or fails to execute.
   */
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


  public applyStyleV2(styleName: string, value: string): void {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const fragment = range.cloneContents();
    const nodes = Array.from(fragment.childNodes);

    nodes.forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as HTMLElement;
        element.style[styleName as any] = value;
      } else {
        // Wrap text nodes in a <span> to apply the style
        const span = document.createElement('span');
        span.style[styleName as any] = value;
        span.textContent = node.textContent;
        range.insertNode(span);
      }
    });

    range.deleteContents();
    range.insertNode(fragment);
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

  public toggleSuperscript(): void {
    this.wrapSelectionWithTag('sup');
  }

  public toggleSubscript(): void {
    this.wrapSelectionWithTag('sub');
  }

  public wrapSelectionWithTag(tagName: string): void {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const selectedText = range.extractContents();
      const parentNode = range.commonAncestorContainer.parentElement;
      if (parentNode && parentNode.tagName.toLowerCase() === tagName) {
        const children = Array.from(parentNode.childNodes);
        parentNode.replaceWith(...children);
      } else {
        const wrapper = document.createElement(tagName);
        wrapper.appendChild(selectedText);
        range.insertNode(wrapper);
        selection.removeAllRanges();
        const newRange = document.createRange();
        newRange.setStartAfter(wrapper);
        selection.addRange(newRange);
      }
    }
  }


  /**
   * Removes the specified formatting from the selected text in the document.
   * This method searches for all `<span>` elements within the current selection
   * and unwraps those that have a specific style property set to a given value.
   *
   * @param {string} styleName - The name of the CSS style property to check against.
   * @param {string} value - The value of the CSS style property that should be removed.
   *
   * @returns {void} This method does not return a value.
   *
   * @throws {Error} Throws an error if the selection is invalid or if there are issues
   *                 accessing the document's selection.
   *
   * @example
   * // Example usage:
   * removeFormatting('color', 'red');
   * // This will remove all spans with red text color from the current selection.
   */
  public removeFormatting(styleName: string, value: string): void {
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

  public setTextAlign(alignment: string): void {
    //this.justifyContent(alignment as 'left' | 'center' | 'right' | 'justify');

    let selection = window.getSelection();

    if (selection && !selection.isCollapsed) {
      const range = selection.getRangeAt(0);
      let container: Node = range.commonAncestorContainer;

      // If the container is a text node, get its parent
      if (container.nodeType === Node.TEXT_NODE) {
        container = container.parentElement as HTMLElement;
      }

      // Handle multi-paragraph selections by splitting the range
      if (container instanceof HTMLElement) {
        const paragraphs = this.splitRangeIntoParagraphs(range);

        paragraphs.forEach((paragraph) => {
          if (paragraph instanceof HTMLElement && paragraph.tagName === 'P') {
            paragraph.style.textAlign = alignment;
          }
        });
      }
    } else {
      console.warn('No valid selection found.');
    }

    console.log('setTextAlign');

    selection = window.getSelection();

    console.log('selection', selection);

    if (selection && !selection.isCollapsed) {
      const range = selection.getRangeAt(0);
      let container: Node = range.commonAncestorContainer;

      console.log('container', container);

      // If the container is a text node, find its parent element
      if (container.nodeType === Node.TEXT_NODE) {
        container = container.parentElement as HTMLElement;
      }

      // If the container is a <p> element, apply the alignment
      if (container instanceof HTMLElement && container.tagName === 'P') {
        container.style.textAlign = alignment;
      } else {
        // Traverse up the DOM to find the nearest parent <p> element
        const parentParagraph = this.findParentParagraph(container as HTMLElement);
        if (parentParagraph) {
          parentParagraph.style.textAlign = alignment;
        }
      }
    }
  }

  public splitRangeIntoParagraphs(range: Range): HTMLElement[] {
    const fragment = range.cloneContents();
    const paragraphs: HTMLElement[] = [];

    fragment.childNodes.forEach((node) => {
      if (node instanceof HTMLElement && node.tagName === 'P') {
        paragraphs.push(node);
      } else if (node.nodeType === Node.TEXT_NODE) {
        // Wrap standalone text in a <p> for consistency
        const wrapper = document.createElement('p');
        wrapper.textContent = node.textContent?.trim() || '';
        paragraphs.push(wrapper);
      }
    });

    return paragraphs;
  }


  public findParentParagraph(element: HTMLElement): HTMLElement | null {
    while (element && element.tagName !== 'P') {
      element = element.parentElement as HTMLElement;
    }
    return element?.tagName === 'P' ? element : null;
  }



  public onBackgroundColorChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const elements = this.contentService.getSelectedElements();
    elements.forEach((element: HTMLElement) => element.style.backgroundColor = target.value);
  }


}
