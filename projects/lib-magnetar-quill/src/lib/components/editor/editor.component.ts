import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DoCheck,
  ElementRef, EventEmitter,
  HostListener, Input,
  OnChanges, OnDestroy, OnInit, Output,
  ViewChild
} from '@angular/core';
import {NgClass, NgIf} from "@angular/common";
import {ImageInternalData} from "../../models/image-internal-data";
import {FormattingService} from "../../services/formatting.service";
import {ContentService} from "../../services/content.service";
import {FormsModule} from "@angular/forms";
import {ImageModalComponentModel} from "../../models/image-modal-component-model";
import {ImageHtmlElementImageModalComponentMapper} from "../../mappers/image-html-element-image-modal-component-mapper";
import {ImageService} from "../../services/image.service";
import {TableService} from "../../services/table.service";
import {ClickOutsideDirective} from "../../directives/click-outside.directive";
import {Subject, takeUntil} from 'rxjs';
import {sanitizeEditorHtml} from '../../utils/editor-html-sanitizer';

/**
 * @generatedInfoDoc
 * InfoDoc: class `EditorComponent` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/components/editor/editor.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */







@Component({
    selector: 'lib-editor',
    imports: [
        NgIf,
        NgClass,
        FormsModule,
        ClickOutsideDirective
    ],
    standalone: true,
    templateUrl: './editor.component.html',
    styleUrl: './editor.component.less',
    changeDetection: ChangeDetectionStrategy.Eager
})
export class EditorComponent implements OnInit, AfterViewInit, OnChanges, DoCheck, OnDestroy {

  @ViewChild('editorWysiwyg', { static: true }) public editorWysiwyg!: ElementRef<HTMLDivElement>;
  @ViewChild('editorHtml', { static: true }) public editorHtml!: ElementRef<HTMLTextAreaElement>;
  public editorHtmlContent: string = '';

  private imageHtmlElementImageModalComponentMapper: ImageHtmlElementImageModalComponentMapper = new ImageHtmlElementImageModalComponentMapper();

  private editorHtmlBackup!: HTMLTextAreaElement;
  private editorBackup!: HTMLDivElement;
  private parentElement!: HTMLElement;
  private readonly destroy$: Subject<void> = new Subject<void>();
   // Track if HTML view is active
  @Input() isHtmlView: boolean = false;
  @Output() requestImageEdit = new EventEmitter<ImageModalComponentModel>();
  @Output() editPicture = new EventEmitter<void>();
  @Output() contentChanged = new EventEmitter<string>();

  private _requestImageInsert: ImageModalComponentModel | null = null;

    /**
 * @generatedInfoDoc
 * InfoDoc: getter `EditorComponent`.`requestImageInsert` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/components/editor/editor.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */







@Input()
  get requestImageInsert(): ImageModalComponentModel | null {
    return this._requestImageInsert;
  }
    /**
 * @generatedInfoDoc
 * InfoDoc: setter `EditorComponent`.`requestImageInsert` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/components/editor/editor.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */







set requestImageInsert(value: ImageModalComponentModel | null) {
    this._requestImageInsert = value;
    if (value) {
      this.selectedImage= this.imageHtmlElementImageModalComponentMapper.mapImageModalComponentToImageHtmlElement(value as ImageModalComponentModel);
    }
  }

    /**
 * @generatedInfoDoc
 * InfoDoc: constructor for class `EditorComponent` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/components/editor/editor.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */




constructor(private readonly formattingService: FormattingService,
              private readonly contentService: ContentService,
              private readonly imageService: ImageService,
              public readonly tableService: TableService
  ) {
    this.isHtmlView = false;
    this.formattingService.updateFormatStates();
    this.fixParagraphWithBrAndSpace = this.fixParagraphWithBrAndSpace.bind(this);
    this.fixParagraphWithMultipleBrs = this.fixParagraphWithMultipleBrs.bind(this);

  }

    /**
 * @generatedInfoDoc
 * InfoDoc: method `EditorComponent`.`ngOnInit()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/components/editor/editor.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */







public ngOnInit(): void {
    //this.editorWysiwyg.nativeElement.addEventListener('paste', this.onPaste.bind(this));
    // Subscribe to the content observable to keep the editor synced

    this.editorHtmlContent = this.contentService.getEditorContent();
    this.syncEditorDomFromContent(this.editorHtmlContent);

    this.contentService.editorContent$.pipe(takeUntil(this.destroy$)).subscribe(content => {
      this.editorHtmlContent = content;
      const editorElement = this.editorWysiwyg.nativeElement;
      const editorHasFocus = editorElement.contains(document.activeElement);
      if (!this.isHtmlView && !editorHasFocus && editorElement.innerHTML !== content) {
        this.syncEditorDomFromContent(content);
      }
    });

  }

    /**
 * @generatedInfoDoc
 * InfoDoc: method `EditorComponent`.`onSelectionChange()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/components/editor/editor.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */







@HostListener('document:selectionchange')
  @HostListener('mouseup')
  @HostListener('keyup')
  @HostListener('focus')
  public onSelectionChange(): void {
    if (!this.isSelectionInsideEditor()) {
      return;
    }

    this.formattingService.saveSelection();
    this.formattingService.updateFormatStates();

    const selection = window.getSelection();
    this.tableService.updateTableState(selection?.focusNode || null);
  }

    /**
 * @generatedInfoDoc
 * InfoDoc: method `EditorComponent`.`isSelectionInsideEditor()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/components/editor/editor.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */







private isSelectionInsideEditor(): boolean {
    const selection = window.getSelection();
    const editor = this.editorWysiwyg?.nativeElement;

    if (!selection || selection.rangeCount === 0 || !editor) {
      return false;
    }

    const anchorNode = selection.anchorNode;
    const focusNode = selection.focusNode;

    return (!!anchorNode && editor.contains(anchorNode)) || (!!focusNode && editor.contains(focusNode));
  }

  /**
   * Cleans up resources when the component is destroyed.
   */
    /**
 * @generatedInfoDoc
 * InfoDoc: method `EditorComponent`.`ngOnDestroy()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/components/editor/editor.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */







public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Sanitizes HTML content for the editor.
   */
    /**
 * @generatedInfoDoc
 * InfoDoc: method `EditorComponent`.`sanitizeHtmlForEditor()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/components/editor/editor.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */







private sanitizeHtmlForEditor(htmlContent: string): string {
    return sanitizeEditorHtml(htmlContent, { preserveStyles: true });
  }

  /**
 * SECURITY NOTE:
 * This method intentionally writes to innerHTML as part of a controlled rich-text editor.
 * RISK: Assigning user-controlled data to innerHTML can lead to XSS vulnerabilities.
 * JUSTIFICATION: To support full RTF editing (including complex styles and attributes),
 * direct innerHTML assignment is used to avoid Angular's sanitizer from stripping necessary content.
 * MITIGATION: All externally supplied HTML (e.g., pasted or loaded content) MUST be sanitized
 * before reaching this point via the onPaste handler or other ingestion paths.
 * The editor DOM is treated as an internal, trusted editing surface.
 */
    /**
 * @generatedInfoDoc
 * InfoDoc: method `EditorComponent`.`syncEditorDomFromContent()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/components/editor/editor.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */







private syncEditorDomFromContent(content: string): void {
    this.editorWysiwyg.nativeElement.innerHTML = this.sanitizeHtmlForEditor(content);
  }

  /**
   * Updates the service with the new HTML content upon change.
   * NOTE: This method emits transient (raw) HTML during 'input' events for performance,
   * and performs a 'forceClean' (normalization) on 'blur' or major changes.
   * Consumers should be aware that the emitted HTML may vary slightly in structure until 'blur'.
   * @param {string} htmlContent - The updated HTML content.
   * @param {boolean} forceClean - Whether to apply aggressive cleaning (e.g., on paste or major change).
   */
    /**
 * @generatedInfoDoc
 * InfoDoc: method `EditorComponent`.`onContentChange()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/components/editor/editor.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */







public onContentChange(htmlContent: string, forceClean: boolean = false): void {
    // Update the content in the service whenever it changes
    
    if (forceClean) {
      htmlContent = this.fixParagraphWithBrAndSpace(htmlContent); // Normalize line breaks
      htmlContent = this.splitIntoParagraphs(htmlContent);
    }
    
    this.contentService.setEditorContent(htmlContent);
    this.ensurePlaceholder();
    this.contentChanged.emit(htmlContent);
  }

    /**
 * @generatedInfoDoc
 * InfoDoc: method `EditorComponent`.`emitCurrentEditorContent()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/components/editor/editor.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */







private emitCurrentEditorContent(): void {
    this.onContentChange(this.editorWysiwyg.nativeElement.innerHTML);
  }

  public sanitizePaste: boolean = true; // Default to true, enabling sanitization

  // Toggle the paste sanitization
    /**
 * @generatedInfoDoc
 * InfoDoc: method `EditorComponent`.`toggleSanitizePaste()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/components/editor/editor.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */







public toggleSanitizePaste(): void {
    this.sanitizePaste = !this.sanitizePaste;
  }

    /**
 * @generatedInfoDoc
 * InfoDoc: method `EditorComponent`.`onPaste()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/components/editor/editor.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */







public onPaste(event: ClipboardEvent): void {
    if (!this.sanitizePaste) {
      return;
    }

    event.preventDefault(); // Prevent default paste behavior

    const clipboardData = event.clipboardData;

    if (!clipboardData) return;

    // Check for image data
    for (let i = 0; i < clipboardData.items.length; i++) {
      const item = clipboardData.items[i];
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file) {
          this.handleImagePaste(file);
          return; // Exit after processing image
        }
      }
    }

    // Check for HTML data
    const htmlData = clipboardData.getData('text/html');
    if (htmlData) {
      const sanitizedHtml = this.sanitizeHtml(htmlData); // Sanitize HTML content
      const normalizedHtml = this.normalizeLineBreaks(sanitizedHtml); // Normalize line breaks
      this.contentService.insertHtmlAtCursor(normalizedHtml); // Insert cleaned HTML
      this.emitCurrentEditorContent();
      return;
    }

    // Fallback for plain text pasting
    const text = clipboardData.getData('text/plain') || '';
    this.contentService.insertTextAtCursor(text); // Insert plain text
    this.emitCurrentEditorContent();
  }


    /**
 * @generatedInfoDoc
 * InfoDoc: method `EditorComponent`.`sanitizeHtml()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/components/editor/editor.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */







private sanitizeHtml(html: string): string {
    return sanitizeEditorHtml(html, { preserveStyles: false });
  }

    /**
 * @generatedInfoDoc
 * InfoDoc: method `EditorComponent`.`normalizeLineBreaks()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/components/editor/editor.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */







private normalizeLineBreaks(html: string): string {
    // Replace multiple consecutive <br> tags with a single <br>
    html = html.replace(/(<br\s*\/?>\s*){2,}/gi, '<br>');

    // Remove any existing <p> tags to avoid nested paragraphs
    html = html.replace(/<\/?p[^>]*>/gi, '');

    // Replace <br> tags with closing and opening paragraph tags
    html = html.replace(/(?:<br\s*\/?>)+/gi, '</p><p>');

    // Ensure the entire content is wrapped in a single <p> if it doesn't already start/end with <p>
    if (!html.startsWith('<p>')) {
      html = `<p>${html}`;
    }
    if (!html.endsWith('</p>')) {
      html = `${html}</p>`;
    }

    return html;
  }




    /**
 * @generatedInfoDoc
 * InfoDoc: method `EditorComponent`.`handleImagePaste()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/components/editor/editor.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */







private handleImagePaste(file: File): void {
    const reader = new FileReader();
    reader.onload = (event: ProgressEvent<FileReader>) => {
      const imageUrl = event.target?.result as string;
      const img = `<img src="${imageUrl}" alt="Pasted Image" style="max-width:100%; height:auto;">`;
      this.contentService.insertHtmlAtCursor(img);
      this.emitCurrentEditorContent();
    };
    reader.readAsDataURL(file);
  }

    /**
 * @generatedInfoDoc
 * InfoDoc: method `EditorComponent`.`scrollToTopOnFocus()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/components/editor/editor.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */







public scrollToTopOnFocus(): void {
    this.editorWysiwyg.nativeElement.scrollTop = 0; // Scrolls to the top of the editor
  }



  public isFixedHeight: boolean = true;

    /**
 * @generatedInfoDoc
 * InfoDoc: method `EditorComponent`.`toggleEditorHeight()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/components/editor/editor.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */







public toggleEditorHeight(): void {
    this.isFixedHeight = !this.isFixedHeight;
  }


  public contextMenuPosition = { x: 0, y: 0 };
  public showContextMenu: boolean = false;
  private selectedImage: HTMLImageElement | null = null;

  // Open context menu on right-click over an image
    /**
 * @generatedInfoDoc
 * InfoDoc: method `EditorComponent`.`onRightClick()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/components/editor/editor.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */







@HostListener('contextmenu', ['$event'])
  onRightClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).tagName === 'IMG') {
      event.preventDefault();
      this.selectedImage = event.target as HTMLImageElement;
      this.showContextMenuAt(event.clientX, event.clientY);
    } else {
      this.showContextMenu = false;
    }
  }

    /**
 * @generatedInfoDoc
 * InfoDoc: method `EditorComponent`.`showContextMenuAt()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/components/editor/editor.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */







private showContextMenuAt(x: number, y: number): void {
    this.contextMenuPosition = { x, y };
    this.showContextMenu = true;
  }

    /**
 * @generatedInfoDoc
 * InfoDoc: method `EditorComponent`.`hideContextMenu()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/components/editor/editor.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */







public hideContextMenu(): void {
    this.showContextMenu = false;
  }



  // Open image edit modal with selected image data
    /**
 * @generatedInfoDoc
 * InfoDoc: method `EditorComponent`.`openImageEdit()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/components/editor/editor.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */







public openImageEdit(): void {
    if (this.selectedImage) {

      this.imageService.setSelectedImageOnEditor(
        this.imageHtmlElementImageModalComponentMapper.mapImageHtmlElementToImageModalComponent(this.selectedImage),
        this.selectedImage
      );

      const imageData = this.imageHtmlElementImageModalComponentMapper.mapImageHtmlElementToImageModalComponent(this.selectedImage);

      this.requestImageEdit.emit(imageData);
      this.editPicture.emit();
      this.showImageModal = true;
      this.showContextMenu = false; // Close context menu after selection
    }
  }

    /**
 * @generatedInfoDoc
 * InfoDoc: method `EditorComponent`.`insertImageFromUrl()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/components/editor/editor.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */







public insertImageFromUrl(imageData: ImageInternalData): void {
    this.contentService.insertImageFromUrl(imageData);
  }

    /**
 * @generatedInfoDoc
 * InfoDoc: method `EditorComponent`.`getEditorContent()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/components/editor/editor.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */







public getEditorContent(): string {
    return this.splitIntoParagraphs(this.editorWysiwyg.nativeElement.innerHTML);
  }

    /**
 * @generatedInfoDoc
 * InfoDoc: method `EditorComponent`.`setEditorContent()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/components/editor/editor.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */







public setEditorContent(event: Event): void {
    const content = (event.target as HTMLInputElement).value;
    this.editorWysiwyg.nativeElement.innerHTML = this.splitIntoParagraphs(content);
  }

  /**
   * Moves the trailing <br> from inside a <p> tag to outside it,
   * and then adds an extra empty paragraph (<p>&nbsp;</p>) after.
   *
   * Example:
   * Input:
   *   <p ...>Some text<br></p>
   *
   * Output:
   *   <p ...>Some text</p><br><p>&nbsp;</p>
   *
   * @param input - The HTML string to transform
   * @returns The transformed HTML string
   */
    /**
 * @generatedInfoDoc
 * InfoDoc: method `EditorComponent`.`fixParagraphWithBrAndSpace()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/components/editor/editor.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */







public fixParagraphWithBrAndSpace(input: string): string {
    return this.transformParagraphs(input, (openingTag, content, originalParagraph) => {
      const trailingBreak = this.extractTrailingBreak(content);
      if (!trailingBreak) {
        return originalParagraph;
      }

      return `${openingTag}${trailingBreak.before}</p>${trailingBreak.breakTag}<p>&nbsp;</p>`;
    });
  }

  /**
   * Splits paragraphs containing two or more consecutive <br> tags into
   * multiple paragraphs.
   *
   * @param input The HTML string to transform
   * @returns The transformed HTML string
   */
    /**
 * @generatedInfoDoc
 * InfoDoc: method `EditorComponent`.`fixParagraphWithMultipleBrs()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/components/editor/editor.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */







public fixParagraphWithMultipleBrs(input: string): string {
    return this.transformParagraphs(input, (_openingTag, content, originalParagraph) => {
      const parts = this.splitByRepeatedBreaks(content);
      if (!parts) {
        return originalParagraph;
      }

      if (parts.every(part => part.trim().length === 0)) {
        return '<p>&nbsp;</p>';
      }

      return parts
        .map(part => part.trim().length > 0 ? `<p>${part}</p>` : '<p>&nbsp;</p>')
        .join('');
    });
  }

/**
 * @generatedInfoDoc
 * InfoDoc: method `EditorComponent`.`transformParagraphs()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/components/editor/editor.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */







private transformParagraphs(
    input: string,
    transform: (openingTag: string, content: string, originalParagraph: string) => string
  ): string {
    let output = '';
    let index = 0;

    while (index < input.length) {
      const openingStart = this.findOpeningParagraphStart(input, index);
      if (openingStart === -1) {
        output += input.slice(index);
        break;
      }

      const openingEnd = input.indexOf('>', openingStart);
      const closingStart = input.indexOf('</p>', openingEnd + 1);
      if (openingEnd === -1 || closingStart === -1) {
        output += input.slice(index);
        break;
      }

      const closingEnd = closingStart + '</p>'.length;
      const openingTag = input.slice(openingStart, openingEnd + 1);
      const content = input.slice(openingEnd + 1, closingStart);
      const originalParagraph = input.slice(openingStart, closingEnd);

      output += input.slice(index, openingStart);
      output += transform(openingTag, content, originalParagraph);
      index = closingEnd;
    }

    return output;
  }

/**
 * @generatedInfoDoc
 * InfoDoc: method `EditorComponent`.`findOpeningParagraphStart()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/components/editor/editor.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */







private findOpeningParagraphStart(input: string, startIndex: number): number {
    let index = input.indexOf('<p', startIndex);
    while (index !== -1) {
      const nextCharacter = input[index + 2];
      if (nextCharacter === '>' || this.isWhitespace(nextCharacter)) {
        return index;
      }
      index = input.indexOf('<p', index + 2);
    }

    return -1;
  }

/**
 * @generatedInfoDoc
 * InfoDoc: method `EditorComponent`.`extractTrailingBreak()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/components/editor/editor.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */







private extractTrailingBreak(content: string): {before: string; breakTag: string} | null {
    const contentEnd = this.trimEndIndex(content);
    if (contentEnd === 0 || content[contentEnd - 1] !== '>') {
      return null;
    }

    const breakStart = content.lastIndexOf('<', contentEnd - 1);
    if (breakStart === -1) {
      return null;
    }

    const breakTag = content.slice(breakStart, contentEnd);
    if (!this.isBreakTag(breakTag)) {
      return null;
    }

    return {
      before: content.slice(0, breakStart),
      breakTag
    };
  }

/**
 * @generatedInfoDoc
 * InfoDoc: method `EditorComponent`.`splitByRepeatedBreaks()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/components/editor/editor.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */







private splitByRepeatedBreaks(content: string): string[] | null {
    const parts: string[] = [];
    let index = 0;
    let partStart = 0;

    while (index < content.length) {
      const firstBreakEnd = this.readBreakTag(content, index);
      if (firstBreakEnd === null) {
        index += 1;
        continue;
      }

      const secondBreakStart = this.skipWhitespace(content, firstBreakEnd);
      const secondBreakEnd = this.readBreakTag(content, secondBreakStart);
      if (secondBreakEnd === null) {
        index = firstBreakEnd;
        continue;
      }

      parts.push(content.slice(partStart, index));
      index = this.consumeRepeatedBreaks(content, secondBreakEnd);
      partStart = index;
    }

    if (parts.length === 0) {
      return null;
    }

    parts.push(content.slice(partStart));
    return parts;
  }

/**
 * @generatedInfoDoc
 * InfoDoc: method `EditorComponent`.`consumeRepeatedBreaks()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/components/editor/editor.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */







private consumeRepeatedBreaks(content: string, startIndex: number): number {
    let index = this.skipWhitespace(content, startIndex);
    let nextBreakEnd = this.readBreakTag(content, index);

    while (nextBreakEnd !== null) {
      index = this.skipWhitespace(content, nextBreakEnd);
      nextBreakEnd = this.readBreakTag(content, index);
    }

    return index;
  }

/**
 * @generatedInfoDoc
 * InfoDoc: method `EditorComponent`.`readBreakTag()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/components/editor/editor.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */







private readBreakTag(content: string, startIndex: number): number | null {
    if (!content.slice(startIndex, startIndex + 3).toLowerCase().startsWith('<br')) {
      return null;
    }

    let index = startIndex + 3;
    index = this.skipWhitespace(content, index);

    if (content[index] === '/') {
      index += 1;
      index = this.skipWhitespace(content, index);
    }

    return content[index] === '>' ? index + 1 : null;
  }

/**
 * @generatedInfoDoc
 * InfoDoc: method `EditorComponent`.`isBreakTag()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/components/editor/editor.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */







private isBreakTag(tag: string): boolean {
    return this.readBreakTag(tag, 0) === tag.length;
  }

/**
 * @generatedInfoDoc
 * InfoDoc: method `EditorComponent`.`skipWhitespace()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/components/editor/editor.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */







private skipWhitespace(content: string, startIndex: number): number {
    let index = startIndex;
    while (index < content.length && this.isWhitespace(content[index])) {
      index += 1;
    }
    return index;
  }

/**
 * @generatedInfoDoc
 * InfoDoc: method `EditorComponent`.`trimEndIndex()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/components/editor/editor.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */







private trimEndIndex(content: string): number {
    let index = content.length;
    while (index > 0 && this.isWhitespace(content[index - 1])) {
      index -= 1;
    }
    return index;
  }

/**
 * @generatedInfoDoc
 * InfoDoc: method `EditorComponent`.`isWhitespace()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/components/editor/editor.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */







private isWhitespace(character: string | undefined): boolean {
    return character === ' ' ||
      character === '\n' ||
      character === '\r' ||
      character === '\t' ||
      character === '\f';
  }


  /**
   * Splits the provided HTML content into properly structured paragraphs.
   * This method cleans up improperly nested <p> tags, replaces consecutive
   * <br> tags with a marker for splitting, and wraps each part in <p> tags.
   *
   * @param {string} htmlContent - The HTML content to be processed.
   * @returns {string} The structured HTML content with paragraphs properly formatted.
   *
   * @example
   * const input = "<p>First paragraph.<br><br>Second paragraph.</p>";
   * const output = splitIntoParagraphs(input);
   * // output will be "<p>First paragraph.</p><p>Second paragraph.</p>"
   *
   * @throws {Error} Throws an error if the input content is not a valid string.
   */
    /**
 * @generatedInfoDoc
 * InfoDoc: method `EditorComponent`.`splitIntoParagraphs()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/components/editor/editor.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */







public splitIntoParagraphs(htmlContent: string): string {
    return this.fixParagraphWithMultipleBrs(this.fixParagraphWithBrAndSpace(htmlContent));
  }

    /**
 * @generatedInfoDoc
 * InfoDoc: method `EditorComponent`.`ngAfterViewInit()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/components/editor/editor.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */







public ngAfterViewInit(): void {

    if(this.isHtmlView) {
      //editorHtmlBackup
      // Store a reference to the parent node
      this.parentElement = this.editorHtmlBackup.parentElement as HTMLElement;

      // Clone the editor element and store it as a backup
      this.editorHtmlBackup = this.editorHtmlBackup.cloneNode(true) as HTMLTextAreaElement;

      // Monitor changes to detect if the editor is removed
      const observer = new MutationObserver(() => this.checkAndRestoreEditor());
      observer.observe(this.parentElement, { childList: true });

    }
    else{

      // Store a reference to the parent node
      this.parentElement = this.editorWysiwyg.nativeElement.parentNode as HTMLElement;

      // Clone the editor element and store it as a backup
      this.editorBackup = this.editorWysiwyg.nativeElement.cloneNode(true) as HTMLDivElement;

      // Monitor changes to detect if the editor is removed
      const observer = new MutationObserver(() => this.checkAndRestoreEditor());
      observer.observe(this.parentElement, { childList: true });

    }



  }
  // Method to check and restore the editor element if deleted
    /**
 * @generatedInfoDoc
 * InfoDoc: method `EditorComponent`.`checkAndRestoreEditor()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/components/editor/editor.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */







private checkAndRestoreEditor(): void {
    if (!this.parentElement.contains(this.editorWysiwyg.nativeElement)) {
      // Restore the editor element from backup
      this.parentElement.appendChild(this.editorBackup);
      this.editorWysiwyg = new ElementRef(this.editorBackup); // Reassign the editor ViewChild
    }
  }

  /**
   * Handles changes to input properties.
   */
    /**
 * @generatedInfoDoc
 * InfoDoc: method `EditorComponent`.`ngOnChanges()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/components/editor/editor.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */







public ngOnChanges(): void {
    this.ensurePlaceholder();
  }
  /**
   * Custom change detection logic.
   */
    /**
 * @generatedInfoDoc
 * InfoDoc: method `EditorComponent`.`ngDoCheck()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/components/editor/editor.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */







public ngDoCheck(): void {
    //this.ensurePlaceholder();

  }

  // Always insert <br> on Enter, without creating new block elements
    /**
 * @generatedInfoDoc
 * InfoDoc: method `EditorComponent`.`handleEnterKey()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/components/editor/editor.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */







@HostListener('keydown.enter', ['$event'])
  public handleEnterKey(event: Event): void {
    event.preventDefault(); // Prevent default Enter behavior

    const selection = window.getSelection();

    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);

      // Insert <br> at the current cursor position
      const lineBreak = document.createElement('br');
      range.insertNode(lineBreak);

      // Move the cursor after the <br>
      range.setStartAfter(lineBreak);
      range.setEndAfter(lineBreak);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }



  // Method to ensure editor always has a placeholder or content
  /**
   * Ensures a placeholder is set in the editor if it is empty.
   */
    /**
 * @generatedInfoDoc
 * InfoDoc: method `EditorComponent`.`ensurePlaceholder()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/components/editor/editor.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */







private ensurePlaceholder(): void {
    const editor = this.editorWysiwyg.nativeElement;
    if (editor.innerText.trim() === '') {
      editor.innerHTML = '<p><br></p>'; // Add an empty paragraph as a placeholder
    }
  }

  // Method to listen to changes and enforce the placeholder
  public showImageModal: boolean = false;


    /**
 * @generatedInfoDoc
 * InfoDoc: method `EditorComponent`.`deleteImage()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/components/editor/editor.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */







public deleteImage(): void {
    if (this.selectedImage) {
      this.selectedImage.remove();
      //this.showContextMenu = false;
    }
  }

  // Table Resize Logic

  private resizingCell: HTMLTableCellElement | null = null;
  private resizeType: 'col' | 'row' | null = null;
  private startX = 0;
  private startY = 0;
  private startWidth = 0;
  private startHeight = 0;

    /**
 * @generatedInfoDoc
 * InfoDoc: method `EditorComponent`.`onMouseMove()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/components/editor/editor.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */




@HostListener('document:mousemove', ['$event'])
  public onMouseMove(event: MouseEvent): void {
    if (this.resizingCell) {
      if (this.resizeType === 'col') {
        const deltaX = event.clientX - this.startX;
        this.resizingCell.style.width = `${Math.max(50, this.startWidth + deltaX)}px`;
      } else if (this.resizeType === 'row') {
        const deltaY = event.clientY - this.startY;
        this.resizingCell.style.height = `${Math.max(30, this.startHeight + deltaY)}px`;
      }
      return;
    }

    const target = event.target as HTMLElement | null;
    if (!target?.closest) {
      return;
    }

    const cell = target.closest('td, th') as HTMLTableCellElement;
    if (cell) {
      const rect = cell.getBoundingClientRect();
      const edgeSize = 8;
      const nearRight = (rect.right - event.clientX) < edgeSize;
      const nearBottom = (rect.bottom - event.clientY) < edgeSize;

      if (nearRight) {
        cell.style.cursor = 'col-resize';
      } else if (nearBottom) {
        cell.style.cursor = 'row-resize';
      } else {
        cell.style.cursor = 'default';
      }
    }
  }

    /**
 * @generatedInfoDoc
 * InfoDoc: method `EditorComponent`.`onMouseDown()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/components/editor/editor.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */




@HostListener('mousedown', ['$event'])
  public onMouseDown(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const cell = target.closest('td, th') as HTMLTableCellElement;
    if (cell) {
      const rect = cell.getBoundingClientRect();
      const edgeSize = 8;
      const nearRight = (rect.right - event.clientX) < edgeSize;
      const nearBottom = (rect.bottom - event.clientY) < edgeSize;

      if (nearRight) {
        this.resizingCell = cell;
        this.resizeType = 'col';
        this.startX = event.clientX;
        this.startWidth = cell.offsetWidth;
        event.preventDefault();
      } else if (nearBottom) {
        this.resizingCell = cell;
        this.resizeType = 'row';
        this.startY = event.clientY;
        this.startHeight = cell.offsetHeight;
        event.preventDefault();
      }
    }
  }

    /**
 * @generatedInfoDoc
 * InfoDoc: method `EditorComponent`.`onMouseUp()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/components/editor/editor.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */




@HostListener('window:mouseup')
  public onMouseUp(): void {
    if (this.resizingCell) {
      this.emitCurrentEditorContent();
    }
    this.resizingCell = null;
    this.resizeType = null;
  }
}
