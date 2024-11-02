import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { EditorComponent } from "./components/editor/editor.component";
import {ImageInternalData} from "./models/image-internal-data";

@Component({
  selector: 'magnetar-quill',
  standalone: true,
  imports: [ToolbarComponent, EditorComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './lib-magnetar-quill.component.html',
  styleUrl: './lib-magnetar-quill.component.less'
})
export class LibMagnetarQuillComponent implements OnInit, OnDestroy {

  public isHtmlView: boolean = false;

  // Toggle the HTML view state
  public toggleHtmlView(): void {
    this.isHtmlView = !this.isHtmlView;
  }


  public imageToEdit: ImageInternalData | null = null;

  // Method to open the image edit modal from the editor's context menu
  public openImageEditModal(imageData: ImageInternalData): void {
    this.imageToEdit = imageData;
  }

  // Method to reset the image data once editing is done
  public clearImageToEdit(): void {
    this.imageToEdit = null;
  }


  ngOnInit(): void {
    document.addEventListener('keydown', this.handleShortcuts.bind(this));
  }

  ngOnDestroy(): void {
    document.removeEventListener('keydown', this.handleShortcuts.bind(this));
  }

  private handleShortcuts(event: KeyboardEvent): void {
    // Handle Superscript (Ctrl+Shift+= or Cmd+Shift+=)
    if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === '=') {
      event.preventDefault(); // Prevent default behavior
      this.toggleSuperscript();
    }

    // Handle Subscript (Ctrl+= or Cmd+=)
    if ((event.ctrlKey || event.metaKey) && event.key === '=') {
      event.preventDefault(); // Prevent default behavior
      this.toggleSubscript();
    }
  }


  // Bold Toggle
  public toggleBold(): void {
    this.applyStyle('font-weight', 'bold');
  }

  // Italic Toggle
  public toggleItalic(): void {
    this.applyStyle('font-style', 'italic');
  }

  // Underline Toggle
  public toggleUnderline(): void {
    this.applyStyle('text-decoration', 'underline');
  }

  // Strikethrough Toggle
  public toggleStrikethrough(): void {
    this.applyStyle('text-decoration', 'line-through');
  }

  // Font Family
  // Update to handle default values
public onFontFamilyChange(event: Event): void {
  const target = event.target as HTMLSelectElement;
  const fontFamily = target.value || '';  // Empty string for default
  this.applyStyle('font-family', fontFamily);
}

  // Font Size
  public onFontSizeChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const fontSize = target.value || '';  // Empty string for default
    this.applyStyle('font-size', fontSize);
  }

  // Text Color
  public onTextColorChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.applyStyle('color', target.value);
  }

  // Background Color
  public onBackgroundColorChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const elements = this.getSelectedElements();

    elements.forEach((element: HTMLElement) => {
      element.style.backgroundColor = target.value;
    });
  }

  private getSelectedElements(): HTMLElement[] {
    const selection = window.getSelection();
    const elements: HTMLElement[] = [];

    if (selection && !selection.isCollapsed) {
      const range = selection.getRangeAt(0);
      let container: Node = range.commonAncestorContainer;

      // If the container is a text node, find its parent element
      if (container.nodeType === Node.TEXT_NODE) {
        container = container.parentElement as HTMLElement;
      }

      // Check if the container is a paragraph or contains multiple paragraphs
      if (container instanceof HTMLElement) {
        if (container.tagName === 'P') {
          // Single paragraph
          elements.push(container);
        } else {
          // Multiple paragraphs
          const paragraphs = container.querySelectorAll('p');
          paragraphs.forEach((paragraph: HTMLElement) => {
            elements.push(paragraph);
          });
        }
      }
    }

    return elements;
  }


  private wrapSelectionWithTag(tagName: string): void {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const selectedText = range.extractContents();

      // Check if the selection is already wrapped in <sup> or <sub>
      const parentNode = range.commonAncestorContainer.parentElement;

      if (parentNode && parentNode.tagName.toLowerCase() === tagName) {
        // If the tag is already applied, unwrap it by replacing the parent with its children
        const children = Array.from(parentNode.childNodes);  // Convert NodeList to an array
        parentNode.replaceWith(...children);
      } else {
        // Otherwise, wrap the selection with the specified tag
        const wrapper = document.createElement(tagName);
        wrapper.appendChild(selectedText);
        range.insertNode(wrapper);

        // Adjust the selection to end after the newly inserted node
        selection.removeAllRanges();
        const newRange = document.createRange();
        newRange.setStartAfter(wrapper);
        selection.addRange(newRange);
      }
    }
  }











  // Method to clear formatting
public clearFormatting(): void {
  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    const selectedText = range.extractContents();
    const span = document.createElement('span');
    span.style.cssText = '';  // Reset all styles
    span.appendChild(selectedText);
    range.insertNode(span);
  }
}


  // Method to apply styles to the selected text
  private applyStyle(styleName: string, value: string): void {
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

  public setTextAlign(alignment: string): void {
    const selection = window.getSelection();

    if (selection && !selection.isCollapsed) {
      const range = selection.getRangeAt(0);
      let container: Node = range.commonAncestorContainer;

      // If the container is a text node, find its parent element
      if (container.nodeType === Node.TEXT_NODE) {
        container = container.parentElement as HTMLElement;
      }

      // Check if the container is an element and then apply text alignment
      if (container instanceof HTMLElement && container.tagName === 'P') {
        // Apply alignment to a single paragraph
        container.style.textAlign = alignment;
      } else if (container instanceof HTMLElement) {
        // Apply alignment to all <p> elements inside the container
        const paragraphs = container.querySelectorAll('p');
        paragraphs.forEach((paragraph: HTMLElement) => {
          paragraph.style.textAlign = alignment;
        });
      }
    }
  }

  public toggleSuperscript(): void {
    this.wrapSelectionWithTag('sup');
  }

  public toggleSubscript(): void {
    this.wrapSelectionWithTag('sub');
  }


  public setLineSpacing(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const elements = this.getSelectedElements();

    elements.forEach((element: HTMLElement) => {
      element.style.lineHeight = target.value;
    });
  }


  // Keydown event for shortcuts
  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    if (event.ctrlKey || event.metaKey) {
      switch (event.key.toLowerCase()) {
        case 'b':
          event.preventDefault();
          this.toggleBold();
          break;
        case 'i':
          event.preventDefault();
          this.toggleItalic();
          break;
        case 'u':
          event.preventDefault();
          this.toggleUnderline();
          break;
      }
    }
  }
}
