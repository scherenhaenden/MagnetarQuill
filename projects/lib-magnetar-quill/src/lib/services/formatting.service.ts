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

  constructor(private contentService: ContentService) { }


  // Method to update formatting states based on the current selection
  public updateFormatStates(): void {

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
