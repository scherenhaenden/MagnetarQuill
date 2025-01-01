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

@Component({
  selector: 'lib-editor',
  standalone: true,
  imports: [
    NgIf,
    NgClass,
    FormsModule
  ],
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.less'
})
export class EditorComponent implements OnInit, AfterViewInit, OnChanges, DoCheck {

  @ViewChild('editorWysiwyg', { static: true }) public editorWysiwyg!: ElementRef<HTMLDivElement>;
  @ViewChild('editorHtml', { static: true }) public editorHtml!: ElementRef<HTMLTextAreaElement>;




  public editorHtmlContent: string = '';

  private editorHtmlBackup!: HTMLTextAreaElement;
  private editorBackup!: HTMLDivElement;
  private parentElement!: HTMLElement;
   // Track if HTML view is active
  @Input() isHtmlView: boolean = false;
  @Output() requestImageEdit = new EventEmitter<ImageInternalData>();

  constructor(private formattingService: FormattingService,
              private contentService: ContentService

  ) {
    this.isHtmlView = false;
    this.formattingService.updateFormatStates();

  }

  ngOnInit() {
    //this.editorWysiwyg.nativeElement.addEventListener('paste', this.onPaste.bind(this));
    // Subscribe to the content observable to keep the editor synced

    this.editorHtmlContent = this.contentService.getEditorContent();
    this.editorWysiwyg.nativeElement.innerHTML = this.editorHtmlContent;
    console.log('editorHtmlContent', this.editorHtmlContent);



    this.contentService.editorContent$.subscribe(content => {
      this.editorHtmlContent = content;
    });

  }

  public onContentChange(htmlContent: string): void {
    // Update the content in the service whenever it changes
    this.contentService.setEditorContent(htmlContent);
    this.ensurePlaceholder();
  }

  public sanitizePaste: boolean = true; // Default to true, enabling sanitization

  // Toggle the paste sanitization
  public toggleSanitizePaste(): void {
    this.sanitizePaste = !this.sanitizePaste;
  }

  public onPaste(event: ClipboardEvent): void {


    console.log('onPaste', event);

    if(!this.sanitizePaste) {
      return;

    }

    event.preventDefault();

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

    // Check for HTML data (paths or Base64 strings)
    const htmlData = clipboardData.getData('text/html');
    if (htmlData) {
      this.insertHtmlAtCursor(htmlData);
      return;
    }

    // Fallback for plain text pasting
    const text = clipboardData.getData('text/plain') || '';

    // Insert sanitized text at cursor position
    this.insertTextAtCursor(text);
  }

  private handleImagePaste(file: File): void {
    const reader = new FileReader();
    reader.onload = (event: ProgressEvent<FileReader>) => {
      const imageUrl = event.target?.result as string;
      const img = `<img src="${imageUrl}" alt="Pasted Image" style="max-width:100%; height:auto;">`;
      this.insertHtmlAtCursor(img);
    };
    reader.readAsDataURL(file);
  }

  private insertHtmlAtCursor(html: string): void {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const fragment = document.createRange().createContextualFragment(html);
      range.deleteContents(); // Remove the current selection
      range.insertNode(fragment); // Insert the HTML fragment
    }
  }



  private insertTextAtCursor(text: string): void {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    range.deleteContents();
    range.insertNode(document.createTextNode(text));

    // Move the cursor after the inserted text
    range.setStartAfter(range.endContainer);
    selection.removeAllRanges();
    selection.addRange(range);
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

  // Open image edit modal with selected image data
  public openImageEdit(): void {
    if (this.selectedImage) {
      const imageData: ImageInternalData = {
        url: this.selectedImage.src,
        alt: this.selectedImage.alt,
        width: this.selectedImage.width || null,
        height: this.selectedImage.height || null,
        border: parseInt(this.selectedImage.style.borderWidth || '0', 10),
        hPadding: parseInt(this.selectedImage.style.paddingLeft || '0', 10),
        vPadding: parseInt(this.selectedImage.style.paddingTop || '0', 10),
        alignment: this.selectedImage.style.textAlign || 'left',
      };
      this.requestImageEdit.emit(imageData);
      this.showImageModal = true;
      this.showContextMenu = false; // Close context menu after selection
    }
  }

  public insertImageFromUrl(imageData: ImageInternalData): void {
    const img = document.createElement('img');
    img.src = imageData.url;
    img.alt = imageData.alt || '';
    img.style.width = imageData.width ? `${imageData.width}px` : 'auto';
    img.style.height = imageData.height ? `${imageData.height}px` : 'auto';
    img.style.borderWidth = `${imageData.border}px`;
    img.style.padding = `${imageData.vPadding}px ${imageData.hPadding}px`;
    img.style.textAlign = imageData.alignment ?? 'left';

    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.insertNode(img);
      range.collapse(false);
    }
  }

  public getEditorContent(): string {
    return this.editorWysiwyg.nativeElement.innerHTML;
  }

  public setEditorContent(event: Event): void {
    const content = (event.target as HTMLInputElement).value;
    this.editorWysiwyg.nativeElement.innerHTML = content;
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
    console.log(editor.innerText);
    if (editor.innerText.trim() === '') {
      editor.innerHTML = '<p><br></p>'; // Add an empty paragraph as a placeholder
    }
  }

  // Method to listen to changes and enforce the placeholder




  public imageUrl: string = '';
  public altText: string = '';
  public width: number | null = null;
  public height: number | null = null;
  public border: number = 0;
  public hPadding: number = 0;
  public vPadding: number = 0;
  public alignment: string = 'left';

  public showImageModal: boolean = false;


  public openImageModalForEdit(): void {
    if (this.selectedImage) {
      this.imageUrl = this.selectedImage.src;
      this.altText = this.selectedImage.alt;
      this.width = this.selectedImage.width || null;
      this.height = this.selectedImage.height || null;
      this.border = parseInt(this.selectedImage.style.borderWidth || '0', 10);
      this.hPadding = parseInt(this.selectedImage.style.paddingLeft || '0', 10);
      this.vPadding = parseInt(this.selectedImage.style.paddingTop || '0', 10);
      this.alignment = this.selectedImage.style.textAlign || 'left';

      this.showImageModal = true; // Show the modal
    }
  }





  public deleteImage(): void {
    if (this.selectedImage && this.selectedImage.parentNode) {
      this.selectedImage.parentNode.removeChild(this.selectedImage);
      //this.showContextMenu = false;
    }
  }

  public applyImageEdits(): void {
    if (this.selectedImage) {
      this.selectedImage.src = this.imageUrl;
      this.selectedImage.alt = this.altText;
      this.selectedImage.style.width = this.width ? `${this.width}px` : 'auto';
      this.selectedImage.style.height = this.height ? `${this.height}px` : 'auto';
      this.selectedImage.style.borderWidth = `${this.border}px`;
      this.selectedImage.style.padding = `${this.vPadding}px ${this.hPadding}px`;
      this.selectedImage.style.textAlign = this.alignment;
    }
    this.closeImageModal();
  }

  public closeImageModal(): void {
    this.showImageModal = false;
  }



}
