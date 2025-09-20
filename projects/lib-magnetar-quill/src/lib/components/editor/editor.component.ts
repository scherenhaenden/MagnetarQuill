import {
  AfterViewInit,
  Component,
  DoCheck,
  ElementRef, EventEmitter,
  HostListener, Input,
  OnChanges, OnInit, Output,
  SimpleChanges,
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
import {ClickOutsideDirective} from "../../directives/click-outside.directive";

@Component({
  selector: 'lib-editor',
  standalone: true,
  imports: [
    NgIf,
    NgClass,
    FormsModule,
    ClickOutsideDirective
  ],
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.less'
})
export class EditorComponent implements OnInit, AfterViewInit, OnChanges, DoCheck {

  @ViewChild('editorWysiwyg', { static: true }) public editorWysiwyg!: ElementRef<HTMLDivElement>;
  @ViewChild('editorHtml', { static: true }) public editorHtml!: ElementRef<HTMLTextAreaElement>;
  public editorHtmlContent: string = '';

  private imageHtmlElementImageModalComponentMapper: ImageHtmlElementImageModalComponentMapper = new ImageHtmlElementImageModalComponentMapper();

  private editorHtmlBackup!: HTMLTextAreaElement;
  private editorBackup!: HTMLDivElement;
  private parentElement!: HTMLElement;
   // Track if HTML view is active
  @Input() isHtmlView: boolean = false;
  @Output() requestImageEdit = new EventEmitter<ImageModalComponentModel>();
  @Output() editPicture = new EventEmitter<void>();
  @Output() contentChanged = new EventEmitter<string>();

  private _requestImageInsert: ImageModalComponentModel | null = null;

  @Input()
  get requestImageInsert(): ImageModalComponentModel | null {
    return this._requestImageInsert;
  }
  set requestImageInsert(value: ImageModalComponentModel | null) {

    console.log('requestImageInsert', value);

    this._requestImageInsert = value;
    if (value) {
      // Perform any additional logic when value changes
      console.log('Image data set for insertion:', value);
      this.selectedImage= this.imageHtmlElementImageModalComponentMapper.mapImageModalComponentToImageHtmlElement(value as ImageModalComponentModel);
    }
  }

  constructor(private formattingService: FormattingService,
              private contentService: ContentService,
              private imageService: ImageService

  ) {
    this.isHtmlView = false;
    this.formattingService.updateFormatStates();

  }

  ngOnInit() {
    //this.editorWysiwyg.nativeElement.addEventListener('paste', this.onPaste.bind(this));
    // Subscribe to the content observable to keep the editor synced

    this.editorHtmlContent = this.contentService.getEditorContent();
    this.editorWysiwyg.nativeElement.innerHTML = this.editorHtmlContent;

    this.contentService.editorContent$.subscribe(content => {
      this.editorHtmlContent = content;
    });

  }

  /**
   * Handles the change in content by updating the service with the new HTML content.
   * This method normalizes line breaks, splits the content into paragraphs,
   * and ensures that the placeholder is maintained.
   *
   * @param {string} htmlContent - The HTML content that has been updated.
   * @returns {void} This method does not return a value.
   *
   * @example
   * // Example usage of onContentChange
   * const newContent = "<p>New paragraph.</p>";
   * instance.onContentChange(newContent);
   *
   * @throws {Error} Throws an error if the content cannot be processed.
   */
  public onContentChange(htmlContent: string): void {
    // Update the content in the service whenever it changes

    htmlContent = this.fixParagraphWithBrAndSpace(htmlContent); // Normalize line breaks
    htmlContent = this.splitIntoParagraphs(htmlContent);
    this.contentService.setEditorContent(htmlContent);
    this.ensurePlaceholder();
    this.contentChanged.emit(htmlContent);

  }

  public sanitizePaste: boolean = true; // Default to true, enabling sanitization

  // Toggle the paste sanitization
  public toggleSanitizePaste(): void {
    this.sanitizePaste = !this.sanitizePaste;
  }

  public onPaste(event: ClipboardEvent): void {
    if (!this.sanitizePaste) {
      return;
    }

    event.preventDefault(); // Prevent default paste behavior

    const clipboardData = event.clipboardData;
    console.log('clipboardData', clipboardData);

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
      return;
    }

    // Fallback for plain text pasting
    const text = clipboardData.getData('text/plain') || '';
    this.contentService.insertTextAtCursor(text); // Insert plain text
  }


  private sanitizeHtml(html: string): string {
    // Remove <meta> tags
    html = html.replace(/<meta[^>]*>/gi, '');

    // Remove all inline styles
    html = html.replace(/style="[^"]*"/gi, '');

    // Remove unwanted tags (e.g., <script>, <iframe>)
    html = html.replace(/<(script|iframe|embed|object)[^>]*>.*?<\/\1>/gi, '');

    return html;
  }

  private normalizeLineBreaks(html: string): string {

    console.log('normalizeLineBreaks', html);
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




  private handleImagePaste(file: File): void {
    const reader = new FileReader();
    reader.onload = (event: ProgressEvent<FileReader>) => {
      const imageUrl = event.target?.result as string;
      const img = `<img src="${imageUrl}" alt="Pasted Image" style="max-width:100%; height:auto;">`;
      this.contentService.insertHtmlAtCursor(img);
    };
    reader.readAsDataURL(file);
  }
  @HostListener('mouseup')
  @HostListener('keyup')
  public onSelectionChange(): void {
    this.formattingService.updateFormatStates();
  }

  public scrollToTopOnFocus(): void {
    this.editorWysiwyg.nativeElement.scrollTop = 0; // Scrolls to the top of the editor
  }



  public isFixedHeight: boolean = true;

  public toggleEditorHeight(): void {
    this.isFixedHeight = !this.isFixedHeight;
  }


  public contextMenuPosition = { x: 0, y: 0 };
  public showContextMenu: boolean = false;
  private selectedImage: HTMLImageElement | null = null;

  // Open context menu on right-click over an image
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

  private showContextMenuAt(x: number, y: number): void {
    this.contextMenuPosition = { x, y };
    this.showContextMenu = true;
  }

  public hideContextMenu(): void {
    this.showContextMenu = false;
  }



  // Open image edit modal with selected image data
  public openImageEdit(): void {
    if (this.selectedImage) {

      this.imageService.setSelectedImageOnEditor(this.imageHtmlElementImageModalComponentMapper.mapImageHtmlElementToImageModalComponent(this.selectedImage));

      const imageData = this.imageHtmlElementImageModalComponentMapper.mapImageHtmlElementToImageModalComponent(this.selectedImage);

      this.requestImageEdit.emit(imageData);
      this.editPicture.emit();
      this.showImageModal = true;
      this.showContextMenu = false; // Close context menu after selection
    }
  }

  public insertImageFromUrl(imageData: ImageInternalData): void {
    this.contentService.insertImageFromUrl(imageData);
  }

  public getEditorContent(): string {
    return this.splitIntoParagraphs(this.editorWysiwyg.nativeElement.innerHTML);
  }

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
  public fixParagraphWithBrAndSpace(input: string): string {
    // Regex Explanation:
    //
    // 1) (<p[^>]*>)    : Captures the opening <p> tag with any attributes.
    // 2) ([\s\S]*?)    : Captures all content within <p>, in a non-greedy manner.
    // 3) (<br\s*\/?>)  : Matches <br> or <br/>, capturing it.
    // 4) \s*<\/p>      : Matches optional whitespace, then the closing </p> tag.
    //
    // Replacement:
    //   $1$2</p><br><p>&nbsp;</p>
    //
    // This effectively:
    //   1) Keeps the opening <p> and any attributes ($1)
    //   2) Keeps all paragraph content ($2)
    //   3) Closes the paragraph (</p>)
    //   4) Moves the <br> outside the </p>
    //   5) Adds an extra empty paragraph <p>&nbsp;</p>

    const pattern = /(<p[^>]*>)([\s\S]*?)(<br\s*\/?>)\s*<\/p>/g;
    return input.replace(pattern, '$1$2</p>$3<p>&nbsp;</p>');
  }

  /**
   * Splits paragraphs containing two or more consecutive <br> tags into
   * multiple paragraphs.
   *
   * @param input The HTML string to transform
   * @returns The transformed HTML string
   */
  public fixParagraphWithMultipleBrs(input: string): string {
    const paragraphPattern = /<p[^>]*>[\s\S]*?<\/p>/g;
    return input.replace(paragraphPattern, (paragraph) => {
      // Extract content within the <p> tags, excluding the tags themselves.
      const content = paragraph.slice(paragraph.indexOf(">") + 1, paragraph.lastIndexOf("</p>"));

      // Split the content by two or more <br> tags (with optional whitespace and /)
      const brPattern = /(?:<br\s*\/?>\s*){2,}/gi;
      const parts = content.split(brPattern);

      // Reconstruct into separate paragraphs.  Add &nbsp; to empty paragraphs.
      let result = '';
      for (const part of parts) {
        const trimmedPart = part.trim();
        if (trimmedPart.length > 0) {
          result += `<p>${trimmedPart}</p>`;
        } else {
          result += '<p>&nbsp;</p>';
        }
      }
      return result;
    });
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
  public splitIntoParagraphs(htmlContent: string): string {


    // Step 1: Remove any improperly nested <p> tags
    let cleanedContent = htmlContent.replace(/<p>\s*<p[^>]*>/gi, '<p>'); // Replace nested opening <p> tags
    cleanedContent = cleanedContent.replace(/<\/p>\s*<\/p>/gi, '</p>'); // Replace nested closing </p> tags
    cleanedContent = cleanedContent.replace(/<\/p>\s*<p>/gi, '</p><p>'); // Ensure proper separation of paragraphs

    // Step 2: Replace consecutive <br> tags with a marker for splitting
    const marker = '###SPLIT###';
    cleanedContent = cleanedContent.replace(/(<br\s*\/?>\s*){2,}/gi, marker);

    // Step 3: Split the content by the marker
    const parts = cleanedContent.split(marker).map(part => part.trim());

    // Step 4: Wrap each part in a <p> tag, ensuring no nested <p> tags
    const structuredContent = parts
      .filter(part => part !== '') // Ignore empty parts
      .map(part => `<p>${part}</p>`)
      .join('');

    // Step 5: Final cleanup to ensure no invalid nesting remains
    //return structuredContent.replace(/<p>\s*<\/p>/g, ''); // Remove empty <p> tags
    //console.log('htmlContent:1', htmlContent);
    htmlContent = this.fixParagraphWithBrAndSpace(htmlContent);
    //console.log('htmlContent:2', htmlContent);
    return htmlContent;
  }



  ngAfterViewInit(): void {

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
  private checkAndRestoreEditor(): void {
    if (!this.parentElement.contains(this.editorWysiwyg.nativeElement)) {
      // Restore the editor element from backup
      this.parentElement.appendChild(this.editorBackup);
      this.editorWysiwyg = new ElementRef(this.editorBackup); // Reassign the editor ViewChild
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    this.ensurePlaceholder();
  }
  ngDoCheck() {
    //this.ensurePlaceholder();

  }

  // Always insert <br> on Enter, without creating new block elements
  @HostListener('keydown.enter', ['$event'])
  public handleEnterKey(event: KeyboardEvent): void {
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
  private ensurePlaceholder(): void {
    const editor = this.editorWysiwyg.nativeElement;
    if (editor.innerText.trim() === '') {
      editor.innerHTML = '<p><br></p>'; // Add an empty paragraph as a placeholder
    }
  }

  // Method to listen to changes and enforce the placeholder
  public showImageModal: boolean = false;


  public deleteImage(): void {
    if (this.selectedImage && this.selectedImage.parentNode) {
      this.selectedImage.parentNode.removeChild(this.selectedImage);
      //this.showContextMenu = false;
    }
  }
}
