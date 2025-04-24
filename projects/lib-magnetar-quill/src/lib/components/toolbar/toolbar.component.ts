import {
  Component,
  EventEmitter,
  Input,
  Output,
  WritableSignal
} from '@angular/core';
import { FormattingService } from "../../services/formatting.service";
import { NgIf } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ImageInternalData } from "../../models/image-internal-data";
import {ImageModalComponent} from "../image-modal/image-modal.component";
import {ImageModalComponentModel} from "../../models/image-modal-component-model";
import {ContentService} from "../../services/content.service";

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
export class ToolbarComponent {

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

  constructor(public formattingService: FormattingService,
              private contentService: ContentService
              ) {}

  // Text Formatting Methods
  /**
   * Toggles the bold formatting of the current text selection or insertion point.
   *
   * @returns {void} - This method does not return any value.
   */
  public toggleBold(): void {
    this.formattingService.toggleBold();
  }

  /**
   * Toggles the italic formatting for the current selection or element.
   *
   * @returns {void} - This function does not return any value.
   *
   * Example usage:
   * instance.toggleItalic();
   */
  public toggleItalic(): void {
    this.formattingService.toggleItalic();
  }

  /**
   * Toggles underline formatting on the current selection.
   *
   * This method uses the `formattingService` to switch between applying and removing an underline from the selected text.
   */
  public toggleUnderline(): void {
    this.formattingService.toggleUnderline();
  }

  /**
   * Toggles the strikethrough formatting on the current selection or at the cursor position.
   *
   * @function
   * @name toggleStrikethrough
   * @returns {void}
   */
  public toggleStrikethrough(): void {
    this.formattingService.toggleStrikethrough();
  }

  /**
   * Toggles the superscript formatting for the currently selected text.
   *
   * This method uses the `formattingService` to apply or remove superscript formatting based on the current selection.
   */
  public toggleSuperscript(): void {
    this.formattingService.toggleSuperscript();
  }

  /**
   * Toggles the subscript formatting on the current selection or at the cursor position.
   *
   * @function toggleSubscript
   * @memberof FormattingController
   * @instance
   * @returns {void}
   */
  public toggleSubscript(): void {
    this.formattingService.toggleSubscript();
  }

  // List Formatting Methods
  public toggleOrderedList(): void {
    this.formattingService.toggleList('ordered');
  }

  public toggleUnorderedList(): void {
    this.formattingService.toggleList('unordered');
  }

  // Alignment and Spacing
  /**
   * Sets the text alignment of selected paragraph elements.
   *
   * @param {string} alignment - The desired text alignment ('left', 'center', 'right', 'justify').
   * @returns {void}
   *
   * @example
   * setTextAlign('center');
   */
  public setTextAlign(alignment: string): void {

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
        const paragraphs = this.formattingService.splitRangeIntoParagraphs(range);

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
        const parentParagraph = this.formattingService.findParentParagraph(container as HTMLElement);
        if (parentParagraph) {
          parentParagraph.style.textAlign = alignment;
        }
      }
    }
  }

  /**
   * Wraps the currently selected text in a block-level HTML element specified by `blockTag`.
   *
   * @param {string} blockTag - The tag name of the block element to create and insert around the selection.
   * @returns {void}
   * @throws {Error} Throws an error if no selection is found or if the selection range count is zero.
   */
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


// Helper for checking if an element is block-level
  private isBlockElement(element: HTMLElement): boolean {
    const blockElements = ['P', 'DIV', 'SECTION', 'ARTICLE'];
    return blockElements.includes(element.tagName);
  }


  public setLineSpacing(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const elements = this.contentService.getSelectedElements();
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
    const elements = this.contentService.getSelectedElements();
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

  protected readonly hTMLSelectElement = HTMLSelectElement;
  public imageModalComponentModel!: ImageModalComponentModel | WritableSignal<ImageModalComponentModel>;
}
