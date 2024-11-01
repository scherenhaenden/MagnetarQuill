import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {FormattingService} from "../../services/formatting.service";
import {NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {ImageInternalData} from "../../models/image-internal-data";

@Component({
  selector: 'lib-toolbar',
  standalone: true,
  imports: [
    NgIf,
    FormsModule
  ],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.less'
})
export class ToolbarComponent implements OnInit, OnDestroy {


  constructor(public formattingService: FormattingService) {}


  ngOnInit(): void {
    document.addEventListener('keydown', this.handleShortcuts.bind(this));
  }

  ngOnDestroy(): void {
    document.removeEventListener('keydown', this.handleShortcuts.bind(this));
  }

  @Output() toggleHtmlView = new EventEmitter<void>();

  // Emit the toggle event
  public onToggleHtmlView(): void {
    this.toggleHtmlView.emit();
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
    this.formattingService.applyStyle('font-weight', 'bold');
  }

  // Method to toggle ordered list
  public toggleOrderedList(): void {
    this.formattingService.toggleList('ordered');
  }

  // Method to toggle unordered list
  public toggleUnorderedList(): void {
    this.formattingService.toggleList('unordered');
  }

  // Italic Toggle
  public toggleItalic(): void {
    this.formattingService.applyStyle('font-style', 'italic');
  }

  // Underline Toggle
  public toggleUnderline(): void {
    this.formattingService.applyStyle('text-decoration', 'underline');
  }

  // Strikethrough Toggle
  public toggleStrikethrough(): void {
    this.formattingService.applyStyle('text-decoration', 'line-through');
  }

  // Font Family
  // Update to handle default values
public onFontFamilyChange(event: Event): void {
  const target = event.target as HTMLSelectElement;
  const fontFamily = target.value || '';  // Empty string for default
  this.formattingService.applyStyle('font-family', fontFamily);
}

  // Font Size
  public onFontSizeChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const fontSize = target.value || '';  // Empty string for default
    this.formattingService.applyStyle('font-size', fontSize);
  }

  // Text Color
  public onTextColorChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.formattingService.applyStyle('color', target.value);
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



  public imageUrl: string = '';
  public altText: string = '';
  public width: number | null = null;
  public height: number | null = null;
  public border: number = 0;
  public hPadding: number = 0;
  public vPadding: number = 0;
  public alignment: string = 'left';


  @Input() imageToEdit: ImageInternalData | null = null;
  @Output() clearImageToEdit = new EventEmitter<void>();


  @Output() insertImageFromUrl = new EventEmitter<ImageInternalData>(); // Emit the image URL to the parent or editor
  public showImageModal: boolean = false;


  public openImageModal(): void {
    this.showImageModal = true;
  }

  public closeImageModal(): void {
    this.showImageModal = false;
    this.imageUrl = ''; // Reset the URL field
  }

  public insertImage(): void {
    if (this.imageUrl.trim()) {
      this.insertImageFromUrl.emit({
        url: this.imageUrl,
        alt: this.altText,
        width: this.width,
        height: this.height,
        border: this.border,
        hPadding: this.hPadding,
        vPadding: this.vPadding,
        alignment: this.alignment,
      });
      this.closeImageModal();
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

  public setTextAlign(alignment: string): void {

    console.log(alignment);
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

  // Apply the selected header level
  public applyHeader(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.formattingService.applyHeader(target.value);
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

  protected readonly HTMLSelectElement = HTMLSelectElement;
}


