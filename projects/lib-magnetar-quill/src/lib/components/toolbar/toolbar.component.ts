import {
  ChangeDetectionStrategy,
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
import {ImportExportService} from "../../services/import-export.service";
import {TableService} from "../../services/table.service";
import {TableModalComponent} from "../table-modal/table-modal.component";

/**
 * @generatedInfoDoc
 * InfoDoc: class `ToolbarComponent` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/components/toolbar/toolbar.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */







@Component({
    selector: 'lib-toolbar',
    imports: [
        NgIf,
        FormsModule,
        ImageModalComponent,
        TableModalComponent
    ],
    standalone: true,
    templateUrl: './toolbar.component.html',
    styleUrl: './toolbar.component.less',
    changeDetection: ChangeDetectionStrategy.Eager
})
export class ToolbarComponent {

  // Theme properties
  @Input() public theme: string = 'light';
  @Output() public themeChange = new EventEmitter<string>();

  // Toolbar properties
  @Output() toggleHtmlView = new EventEmitter<void>();
  @Output() insertImageFromUrl = new EventEmitter<ImageInternalData>();
  @Output() clearImageToEdit = new EventEmitter<void>();
  @Output() contentChanged = new EventEmitter<string>();

  @Input() imageToEdit: ImageInternalData | null = null;

  public showImageModal: boolean = false;
  public showTableModal: boolean = false;
  public imageUrl: string = '';
  public altText: string = '';
  public width: number | null = null;
  public height: number | null = null;
  public border: number = 0;
  public hPadding: number = 0;
  public vPadding: number = 0;
  public alignment: string = 'left';

    /**
 * @generatedInfoDoc
 * InfoDoc: constructor for class `ToolbarComponent` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/components/toolbar/toolbar.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */




constructor(public readonly formattingService: FormattingService,
              private readonly contentService: ContentService,
              private readonly importExportService: ImportExportService,
              public readonly tableService: TableService
              ) {}

    /**
 * @generatedInfoDoc
 * InfoDoc: method `ToolbarComponent`.`withEditorSelection()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/components/toolbar/toolbar.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */







private withEditorSelection(action: () => void): void {
    this.formattingService.restoreSelection();
    action();
    this.publishActiveEditorContent();
  }

    /**
 * @generatedInfoDoc
 * InfoDoc: method `ToolbarComponent`.`publishActiveEditorContent()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/components/toolbar/toolbar.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */



private publishActiveEditorContent(): void {
    const editor = this.getActiveEditorElement();
    if (!editor) {
      return;
    }

    const htmlContent = editor.innerHTML;
    this.contentService.setEditorContent(htmlContent);
    this.contentChanged.emit(htmlContent);
  }

    /**
 * @generatedInfoDoc
 * InfoDoc: method `ToolbarComponent`.`getActiveEditorElement()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/components/toolbar/toolbar.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */



private getActiveEditorElement(): HTMLElement | null {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      return null;
    }

    const range = selection.getRangeAt(0);
    const node = range.commonAncestorContainer;
    const element = node.nodeType === Node.ELEMENT_NODE
      ? node as Element
      : node.parentElement;

    return element?.closest('[contenteditable="true"]') as HTMLElement | null;
  }

  // Text Formatting Methods
    /**
 * @generatedInfoDoc
 * InfoDoc: method `ToolbarComponent`.`toggleBold()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/components/toolbar/toolbar.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */







public toggleBold(): void {
    this.withEditorSelection(() => this.formattingService.toggleBold());
  }

    /**
 * @generatedInfoDoc
 * InfoDoc: method `ToolbarComponent`.`toggleStrong()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/components/toolbar/toolbar.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */







public toggleStrong(): void {
    this.withEditorSelection(() => this.formattingService.toggleStrong());
  }

    /**
 * @generatedInfoDoc
 * InfoDoc: method `ToolbarComponent`.`toggleItalic()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/components/toolbar/toolbar.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */







public toggleItalic(): void {
    this.withEditorSelection(() => this.formattingService.toggleItalic());
  }

    /**
 * @generatedInfoDoc
 * InfoDoc: method `ToolbarComponent`.`toggleUnderline()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/components/toolbar/toolbar.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */







public toggleUnderline(): void {
    this.withEditorSelection(() => this.formattingService.toggleUnderline());
  }

    /**
 * @generatedInfoDoc
 * InfoDoc: method `ToolbarComponent`.`toggleStrikethrough()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/components/toolbar/toolbar.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */







public toggleStrikethrough(): void {
    this.withEditorSelection(() => this.formattingService.toggleStrikethrough());
  }

    /**
 * @generatedInfoDoc
 * InfoDoc: method `ToolbarComponent`.`toggleSuperscript()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/components/toolbar/toolbar.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */







public toggleSuperscript(): void {
    this.withEditorSelection(() => this.formattingService.toggleSuperscript());
  }

    /**
 * @generatedInfoDoc
 * InfoDoc: method `ToolbarComponent`.`toggleSubscript()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/components/toolbar/toolbar.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */







public toggleSubscript(): void {
    this.withEditorSelection(() => this.formattingService.toggleSubscript());
  }

    /**
 * @generatedInfoDoc
 * InfoDoc: method `ToolbarComponent`.`clearFormatting()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/components/toolbar/toolbar.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */







public clearFormatting(): void {
    this.withEditorSelection(() => this.formattingService.clearFormatting());
  }

  // List Formatting Methods
    /**
 * @generatedInfoDoc
 * InfoDoc: method `ToolbarComponent`.`toggleOrderedList()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/components/toolbar/toolbar.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */







public toggleOrderedList(): void {
    this.withEditorSelection(() => this.formattingService.toggleList('ordered'));
  }

    /**
 * @generatedInfoDoc
 * InfoDoc: method `ToolbarComponent`.`toggleUnorderedList()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/components/toolbar/toolbar.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */







public toggleUnorderedList(): void {
    this.withEditorSelection(() => this.formattingService.toggleList('unordered'));
  }

    /**
 * @generatedInfoDoc
 * InfoDoc: method `ToolbarComponent`.`setTextAlign()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/components/toolbar/toolbar.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */







public setTextAlign(alignment: 'left' | 'center' | 'right' | 'justify'): void {
    this.withEditorSelection(() => this.formattingService.setTextAlign(alignment));
  }

    /**
 * @generatedInfoDoc
 * InfoDoc: method `ToolbarComponent`.`wrapSelectionInBlock()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/components/toolbar/toolbar.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
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
    /**
 * @generatedInfoDoc
 * InfoDoc: method `ToolbarComponent`.`isBlockElement()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/components/toolbar/toolbar.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */







private isBlockElement(element: HTMLElement): boolean {
    const blockElements = ['P', 'DIV', 'SECTION', 'ARTICLE'];
    return blockElements.includes(element.tagName);
  }


    /**
 * @generatedInfoDoc
 * InfoDoc: method `ToolbarComponent`.`setLineSpacing()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/components/toolbar/toolbar.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */







public setLineSpacing(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.withEditorSelection(() => this.formattingService.setLineSpacing(target.value));
  }

  // Header and Font Options
    /**
 * @generatedInfoDoc
 * InfoDoc: method `ToolbarComponent`.`applyHeader()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/components/toolbar/toolbar.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */







public applyHeader(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.withEditorSelection(() => this.formattingService.applyHeader(target.value));
  }

    /**
 * @generatedInfoDoc
 * InfoDoc: method `ToolbarComponent`.`onFontFamilyChange()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/components/toolbar/toolbar.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */







public onFontFamilyChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.withEditorSelection(() => this.formattingService.applyStyle('font-family', target.value || ''));
  }

    /**
 * @generatedInfoDoc
 * InfoDoc: method `ToolbarComponent`.`onFontSizeChange()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/components/toolbar/toolbar.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */







public onFontSizeChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.withEditorSelection(() => this.formattingService.applyStyle('font-size', target.value || ''));
  }

  // Color Formatting
    /**
 * @generatedInfoDoc
 * InfoDoc: method `ToolbarComponent`.`onTextColorChange()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/components/toolbar/toolbar.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */







public onTextColorChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.withEditorSelection(() => this.formattingService.applyStyle('color', target.value));
  }

    /**
 * @generatedInfoDoc
 * InfoDoc: method `ToolbarComponent`.`onBackgroundColorChange()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/components/toolbar/toolbar.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */







public onBackgroundColorChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.withEditorSelection(() => this.formattingService.applyStyle('background-color', target.value));
  }

  // Image Handling
    /**
 * @generatedInfoDoc
 * InfoDoc: method `ToolbarComponent`.`openImageModal()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/components/toolbar/toolbar.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */







public openImageModal(): void {
    this.showImageModal = true;
  }

    /**
 * @generatedInfoDoc
 * InfoDoc: method `ToolbarComponent`.`closeImageModal()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/components/toolbar/toolbar.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */







public closeImageModal(): void {
    this.showImageModal = false;
    this.imageUrl = '';
  }

    /**
 * @generatedInfoDoc
 * InfoDoc: method `ToolbarComponent`.`insertImage()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/components/toolbar/toolbar.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */







public insertImage(imageModalComponentModel: ImageModalComponentModel): void {
    if (imageModalComponentModel.url.trim()) {
      this.insertImageFromUrl.emit({
        url: imageModalComponentModel.url,
        alt: imageModalComponentModel.alt,
        width: imageModalComponentModel.width,
        height: imageModalComponentModel.height,
        border: imageModalComponentModel.border,
        hPadding: imageModalComponentModel.hPadding,
        vPadding: imageModalComponentModel.vPadding,
        alignment: imageModalComponentModel.alignment,
      });
      this.closeImageModal();
    }
  }

  // Miscellaneous Methods
    /**
 * @generatedInfoDoc
 * InfoDoc: method `ToolbarComponent`.`onToggleHtmlView()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/components/toolbar/toolbar.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */







public onToggleHtmlView(): void {
    this.toggleHtmlView.emit();
  }

  /**
   * Handles theme changes selected from the toolbar UI.
   * @param {Event} event - The DOM event containing the selected theme.
   * @public
   */
    /**
 * @generatedInfoDoc
 * InfoDoc: method `ToolbarComponent`.`onThemeChange()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/components/toolbar/toolbar.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */







public onThemeChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    if (target) {
      this.theme = target.value;
      this.themeChange.emit(target.value);
    }
  }


  protected readonly hTMLSelectElement = HTMLSelectElement;
  public imageModalComponentModel!: ImageModalComponentModel | WritableSignal<ImageModalComponentModel>;

  // File Operations

  /**
   * Triggers the hidden file input element click event.
   */
    /**
 * @generatedInfoDoc
 * InfoDoc: method `ToolbarComponent`.`triggerFileInput()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/components/toolbar/toolbar.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */







public triggerFileInput(fileInput: HTMLInputElement): void {
    fileInput.click();
  }

  /**
   * Handles file selection and reads file content.
   */
    /**
 * @generatedInfoDoc
 * InfoDoc: method `ToolbarComponent`.`onFileSelected()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/components/toolbar/toolbar.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */







public onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      this.handleFileContent(file.name, text);
      target.value = '';
    };
    reader.readAsText(file);
  }

  /**
   * Processes the read file content based on file extension.
   */
    /**
 * @generatedInfoDoc
 * InfoDoc: method `ToolbarComponent`.`handleFileContent()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/components/toolbar/toolbar.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */







private handleFileContent(fileName: string, content: string): void {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (ext === 'html' || ext === 'htm') {
      this.contentService.setEditorContent(content);
    } else if (ext === 'md' || ext === 'markdown') {
      const html = this.importExportService.convertMarkdownToHtml(content);
      this.contentService.setEditorContent(html);
    } else if (ext === 'rtf') {
      const html = this.importExportService.convertRtfToHtml(content);
      this.contentService.setEditorContent(html);
    } else {
      alert(`Unsupported file type (.${ext}). Please load HTML, Markdown, or RTF files.`);
    }
  }

  /**
   * Exports the editor content as HTML.
   */
    /**
 * @generatedInfoDoc
 * InfoDoc: method `ToolbarComponent`.`exportHtml()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/components/toolbar/toolbar.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */







public exportHtml(): void {
    const html = this.contentService.getEditorContent();
    this.downloadFile(html, 'document.html', 'text/html');
  }

  /**
   * Exports the editor content as Markdown.
   */
    /**
 * @generatedInfoDoc
 * InfoDoc: method `ToolbarComponent`.`exportMarkdown()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/components/toolbar/toolbar.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */







public exportMarkdown(): void {
    const html = this.contentService.getEditorContent();
    const result = this.importExportService.convertHtmlToMarkdown(html);
    if (result.hasUnsupportedElements) {
      alert('Warning: The document contains elements (such as tables or videos) not fully supported by Markdown. These have been exported with placeholders.');
    }
    this.downloadFile(result.markdown, 'document.md', 'text/markdown');
  }

  /**
   * Exports the editor content as RTF.
   */
    /**
 * @generatedInfoDoc
 * InfoDoc: method `ToolbarComponent`.`exportRtf()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/components/toolbar/toolbar.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */







public exportRtf(): void {
    const html = this.contentService.getEditorContent();
    const rtf = this.importExportService.convertHtmlToRtf(html);
    this.downloadFile(rtf, 'document.rtf', 'application/rtf');
  }

  /**
   * Helper to trigger a browser file download.
   */
    /**
 * @generatedInfoDoc
 * InfoDoc: method `ToolbarComponent`.`downloadFile()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/components/toolbar/toolbar.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */







private downloadFile(content: string, filename: string, contentType: string): void {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }

    /**
 * @generatedInfoDoc
 * InfoDoc: method `ToolbarComponent`.`parseMarkdown()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/components/toolbar/toolbar.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */




public parseMarkdown(): void {
    const rawContent = this.contentService.getEditorContent();
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = rawContent;
    const markdownText = tempDiv.innerText || tempDiv.textContent || '';
    const html = this.importExportService.convertMarkdownToHtml(markdownText);
    this.contentService.setEditorContent(html);
  }

    /**
 * @generatedInfoDoc
 * InfoDoc: method `ToolbarComponent`.`onTableSubmit()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/components/toolbar/toolbar.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */




public onTableSubmit(event: { rows: number, cols: number }): void {
    this.withEditorSelection(() => this.tableService.insertTable(event.rows, event.cols));
    this.showTableModal = false;
  }

    /**
 * @generatedInfoDoc
 * InfoDoc: method `ToolbarComponent`.`addRowAbove()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/components/toolbar/toolbar.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */

public addRowAbove(): void {
    this.withEditorSelection(() => this.tableService.addRowAbove());
  }

    /**
 * @generatedInfoDoc
 * InfoDoc: method `ToolbarComponent`.`addRowBelow()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/components/toolbar/toolbar.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */

public addRowBelow(): void {
    this.withEditorSelection(() => this.tableService.addRowBelow());
  }

    /**
 * @generatedInfoDoc
 * InfoDoc: method `ToolbarComponent`.`deleteRow()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/components/toolbar/toolbar.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */

public deleteRow(): void {
    this.withEditorSelection(() => this.tableService.deleteRow());
  }

    /**
 * @generatedInfoDoc
 * InfoDoc: method `ToolbarComponent`.`addColumnBefore()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/components/toolbar/toolbar.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */

public addColumnBefore(): void {
    this.withEditorSelection(() => this.tableService.addColumnBefore());
  }

    /**
 * @generatedInfoDoc
 * InfoDoc: method `ToolbarComponent`.`addColumnAfter()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/components/toolbar/toolbar.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */

public addColumnAfter(): void {
    this.withEditorSelection(() => this.tableService.addColumnAfter());
  }

    /**
 * @generatedInfoDoc
 * InfoDoc: method `ToolbarComponent`.`deleteColumn()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/components/toolbar/toolbar.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */

public deleteColumn(): void {
    this.withEditorSelection(() => this.tableService.deleteColumn());
  }

    /**
 * @generatedInfoDoc
 * InfoDoc: method `ToolbarComponent`.`setCellAlignment()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/components/toolbar/toolbar.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */

public setCellAlignment(alignment: 'left' | 'center' | 'right'): void {
    this.withEditorSelection(() => this.tableService.setCellAlignment(alignment));
  }

    /**
 * @generatedInfoDoc
 * InfoDoc: method `ToolbarComponent`.`setCellVerticalAlignment()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/components/toolbar/toolbar.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */

public setCellVerticalAlignment(alignment: 'top' | 'middle' | 'bottom'): void {
    this.withEditorSelection(() => this.tableService.setCellVerticalAlignment(alignment));
  }

    /**
 * @generatedInfoDoc
 * InfoDoc: method `ToolbarComponent`.`mergeRight()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/components/toolbar/toolbar.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */

public mergeRight(): void {
    this.withEditorSelection(() => this.tableService.mergeRight());
  }

    /**
 * @generatedInfoDoc
 * InfoDoc: method `ToolbarComponent`.`mergeDown()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/components/toolbar/toolbar.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */

public mergeDown(): void {
    this.withEditorSelection(() => this.tableService.mergeDown());
  }

    /**
 * @generatedInfoDoc
 * InfoDoc: method `ToolbarComponent`.`splitCell()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/components/toolbar/toolbar.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */

public splitCell(): void {
    this.withEditorSelection(() => this.tableService.splitCell());
  }

    /**
 * @generatedInfoDoc
 * InfoDoc: method `ToolbarComponent`.`onCellBorderChange()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/components/toolbar/toolbar.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */




public onCellBorderChange(event: Event): void {
    const select = event.target as HTMLSelectElement | null;
    if (!select) {
      return;
    }

    this.withEditorSelection(() => this.tableService.setCellBorder(select.value as 'solid' | 'dashed' | 'none'));
  }

    /**
 * @generatedInfoDoc
 * InfoDoc: method `ToolbarComponent`.`onCellBgColorChange()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/components/toolbar/toolbar.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */




public onCellBgColorChange(event: Event): void {
    const input = event.target as HTMLInputElement | null;
    if (!input) {
      return;
    }

    this.withEditorSelection(() => this.tableService.setCellBackgroundColor(input.value));
  }
}
