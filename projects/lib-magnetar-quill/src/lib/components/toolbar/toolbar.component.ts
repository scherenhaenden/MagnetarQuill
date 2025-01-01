import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild, WritableSignal
} from '@angular/core';
import { FormattingService } from "../../services/formatting.service";
import { NgIf } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ImageInternalData } from "../../models/image-internal-data";
import {ImageModalComponent} from "../image-modal/image-modal.component";
import {ImageModalComponentModel} from "../../models/image-modal-component-model";

@Component({
  selector: 'lib-toolbar',
  standalone: true,
  imports: [
    NgIf,
    FormsModule,
    ImageModalComponent
  ],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.less'
})
export class ToolbarComponent implements OnInit, OnDestroy {

  // Toolbar properties
  @Output() toggleHtmlView = new EventEmitter<void>();
  @Output() insertImageFromUrl = new EventEmitter<ImageInternalData>();
  @Output() clearImageToEdit = new EventEmitter<void>();

  @Input() imageToEdit: ImageInternalData | null = null;

  public showImageModal: boolean = false;
  public imageUrl: string = '';
  public altText: string = '';
  public width: number | null = null;
  public height: number | null = null;
  public border: number = 0;
  public hPadding: number = 0;
  public vPadding: number = 0;
  public alignment: string = 'left';

  constructor(public formattingService: FormattingService) {}

  // Lifecycle Hooks
  ngOnInit(): void {
    document.addEventListener('keydown', this.handleShortcuts.bind(this));
  }

  ngOnDestroy(): void {
    document.removeEventListener('keydown', this.handleShortcuts.bind(this));
  }

  // Text Formatting Methods
  public toggleBold(): void {
    this.formattingService.applyStyle('font-weight', 'bold');
  }

  public toggleItalic(): void {
    this.formattingService.applyStyle('font-style', 'italic');
  }

  public toggleUnderline(): void {
    this.formattingService.applyStyle('text-decoration', 'underline');
  }

  public toggleStrikethrough(): void {
    this.formattingService.applyStyle('text-decoration', 'line-through');
  }

  public toggleSuperscript(): void {
    this.formattingService.wrapSelectionWithTag('sup');
  }

  public toggleSubscript(): void {
    this.formattingService.wrapSelectionWithTag('sub');
  }

  // List Formatting Methods
  public toggleOrderedList(): void {
    this.formattingService.toggleList('ordered');
  }

  public toggleUnorderedList(): void {
    this.formattingService.toggleList('unordered');
  }

  // Alignment and Spacing
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

  // Helper: Split the selected range into individual paragraphs
  private splitRangeIntoParagraphs(range: Range): HTMLElement[] {
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

  // Helper method to find the nearest parent <p> element
  private findParentParagraph(element: HTMLElement): HTMLElement | null {
    while (element && element.tagName !== 'P') {
      element = element.parentElement as HTMLElement;
    }
    return element?.tagName === 'P' ? element : null;
  }

  public justifyContent(alignment: 'left' | 'center' | 'right' | 'justify'): void {

    console.log('justifyContent');


    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const fragment = range.cloneContents();
    const nodes = Array.from(fragment.childNodes);

    nodes.forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as HTMLElement;

        // Apply alignment to block-level elements
        if (this.isBlockElement(element)) {
          element.style.textAlign = alignment;
        } else {
          // Wrap inline elements with <span>
          const span = document.createElement('span');
          span.style.textAlign = alignment;
          span.appendChild(node.cloneNode(true));
          range.insertNode(span);
        }
      }
    });

    // Remove the old content and replace it with justified content
    range.deleteContents();
    range.insertNode(fragment);
  }

  public wrapSelectionInBlock(blockTag: string): void {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const blockElement = document.createElement(blockTag);

    // Extract selected content and wrap it in the block tag
    blockElement.appendChild(range.extractContents());
    range.insertNode(blockElement);

    // Adjust selection to focus on the new block
    selection.removeAllRanges();
    const newRange = document.createRange();
    newRange.selectNodeContents(blockElement);
    selection.addRange(newRange);
  }


  public applyStyle(styleName: string, value: string): void {
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


// Helper for checking if an element is block-level
  private isBlockElement(element: HTMLElement): boolean {
    const blockElements = ['P', 'DIV', 'SECTION', 'ARTICLE'];
    return blockElements.includes(element.tagName);
  }


  public setLineSpacing(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const elements = this.getSelectedElements();
    elements.forEach((element: HTMLElement) => element.style.lineHeight = target.value);
  }

  // Header and Font Options
  public applyHeader(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.formattingService.applyHeader(target.value);
  }

  public onFontFamilyChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.formattingService.applyStyle('font-family', target.value || '');
  }

  public onFontSizeChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.formattingService.applyStyle('font-size', target.value || '');
  }

  // Color Formatting
  public onTextColorChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.formattingService.applyStyle('color', target.value);
  }

  public onBackgroundColorChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const elements = this.getSelectedElements();
    elements.forEach((element: HTMLElement) => element.style.backgroundColor = target.value);
  }

  // Image Handling
  public openImageModal(): void {
    this.showImageModal = true;
  }

  public closeImageModal(): void {
    this.showImageModal = false;
    this.imageUrl = '';
  }

  public insertImage( imageModalComponentModel: ImageModalComponentModel): void {
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

  // Miscellaneous Methods
  public onToggleHtmlView(): void {
    this.toggleHtmlView.emit();
  }

  public clearFormatting(): void {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const selectedText = range.extractContents();
      const span = document.createElement('span');
      span.style.cssText = '';
      span.appendChild(selectedText);
      range.insertNode(span);
    }
  }

  // Helper Methods
  private handleShortcuts(event: KeyboardEvent): void {
    if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === '=') {
      event.preventDefault();
      this.toggleSuperscript();
    } else if ((event.ctrlKey || event.metaKey) && event.key === '=') {
      event.preventDefault();
      this.toggleSubscript();
    }
  }

  private getSelectedElements(): HTMLElement[] {
    const selection = window.getSelection();
    const elements: HTMLElement[] = [];
    if (selection && !selection.isCollapsed) {
      const range = selection.getRangeAt(0);
      let container: Node = range.commonAncestorContainer;
      if (container.nodeType === Node.TEXT_NODE) {
        container = container.parentElement as HTMLElement;
      }
      if (container instanceof HTMLElement) {
        if (container.tagName === 'P') {
          elements.push(container);
        } else {
          container.querySelectorAll('p').forEach(paragraph => elements.push(paragraph));
        }
      }
    }
    return elements;
  }


  // Keydown Event for Formatting Shortcuts
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

  protected readonly hTMLSelectElement = HTMLSelectElement;
  public imageModalComponentModel!: ImageModalComponentModel | WritableSignal<ImageModalComponentModel>;
}
