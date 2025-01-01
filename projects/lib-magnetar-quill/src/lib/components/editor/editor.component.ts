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

  private imageHtmlElementImageModalComponentMapper: ImageHtmlElementImageModalComponentMapper = new ImageHtmlElementImageModalComponentMapper();

  private editorHtmlBackup!: HTMLTextAreaElement;
  private editorBackup!: HTMLDivElement;
  private parentElement!: HTMLElement;
   // Track if HTML view is active
  @Input() isHtmlView: boolean = false;
  @Output() requestImageEdit = new EventEmitter<ImageModalComponentModel>();

  private _requestImageInsert: ImageModalComponentModel | null = null;

  @Input()
  get requestImageInsert(): ImageModalComponentModel | null {
    return this._requestImageInsert;
  }
  set requestImageInsert(value: ImageModalComponentModel | null) {
    this._requestImageInsert = value;
    if (value) {
      // Perform any additional logic when value changes
      console.log('Image data set for insertion:', value);
      this.selectedImage= this.imageHtmlElementImageModalComponentMapper.mapImageModalComponentToImageHtmlElement(value as ImageModalComponentModel);
    }
  }

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
      this.contentService.insertHtmlAtCursor(htmlData);
      return;
    }

    // Fallback for plain text pasting
    const text = clipboardData.getData('text/plain') || '';

    // Insert sanitized text at cursor position
    this.contentService.insertTextAtCursor(text);
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



  // Open image edit modal with selected image data
  public openImageEdit(): void {
    if (this.selectedImage) {

      const imageData = this.imageHtmlElementImageModalComponentMapper.mapImageHtmlElementToImageModalComponent(this.selectedImage);

      console.log('imageData', imageData);
      this.requestImageEdit.emit(imageData);
      this.showImageModal = true;
      this.showContextMenu = false; // Close context menu after selection
    }
  }

  public insertImageFromUrl(imageData: ImageInternalData): void {
    this.contentService.insertImageFromUrl(imageData);
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
  public showImageModal: boolean = false;


  public deleteImage(): void {
    if (this.selectedImage && this.selectedImage.parentNode) {
      this.selectedImage.parentNode.removeChild(this.selectedImage);
      //this.showContextMenu = false;
    }
  }
}
