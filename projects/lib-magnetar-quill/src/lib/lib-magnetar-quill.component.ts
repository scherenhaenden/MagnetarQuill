import {
  ChangeDetectorRef,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef, EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnInit, Output,
  ViewChild, WritableSignal
} from '@angular/core';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { EditorComponent } from "./components/editor/editor.component";
import {ImageInternalData} from "./models/image-internal-data";
import {ContentService} from "./services/content.service";
import {ImageModalComponent} from "./components/image-modal/image-modal.component";
import {NgIf} from "@angular/common";
import {ImageModalComponentModel} from "./models/image-modal-component-model";
import {ImageService} from "./services/image.service";
import {FormattingService} from "./services/formatting.service";
import {ClickOutsideDirective} from "./directives/click-outside.directive";

@Component({
  selector: 'magnetar-quill',
  standalone: true,
  imports: [ToolbarComponent, EditorComponent, ImageModalComponent, NgIf, ClickOutsideDirective],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './lib-magnetar-quill.component.html',
  styleUrl: './lib-magnetar-quill.component.less'
})
export class LibMagnetarQuillComponent implements OnInit, OnDestroy {

  public updateModel: ImageModalComponentModel = new ImageModalComponentModel();

  public showImageModal: boolean = false;
  @ViewChild('imageModelComponent') imageModalRef!: ImageModalComponent;

  public closeModal(): void {
    if(this.showImageModal) {
      this.showImageModal = false;

    }

  }



  //public imageModalComponentModel!: ImageModalComponentModel;
  private _imageModalComponentModel!: ImageModalComponentModel;


  public get imageModalComponentModel(): ImageModalComponentModel  {
    return this._imageModalComponentModel;
  }

  set imageModalComponentModel(value: ImageModalComponentModel ) {
    if (value) {
      this._imageModalComponentModel = value;
      this.updateModel = null!
      this.updateModel = value;
      this.cdRef.detectChanges();

    }
  }


  // add input and output for emit hear
  // Input for receiving initial content from the parent
  @Input() set content(value: string) {
    //this.editorHtmlContent = value;
    this.contentService.setEditorContent(value); // Set initial content in service
  }

  // Output to emit content changes to the parent
  @Output() contentChange = new EventEmitter<string>();

  constructor(private contentService: ContentService,
              private formattingService: FormattingService ,
              public imageService: ImageService,
              private cdRef: ChangeDetectorRef) {
  }



  public isHtmlView: boolean = false;

  // Toggle the HTML view state
  public toggleHtmlView(): void {
    this.isHtmlView = !this.isHtmlView;
  }


  // Method to open the image edit modal from the editor's context menu
  public openImageEditModal(): void {
    this.showImageModal = true;
  }

  // Method to reset the image data once editing is done
  public clearImageToEdit(): void {
    this.showImageModal = false;
  }


  ngOnInit(): void {

  }

  ngOnDestroy(): void {
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

  // Keydown event for shortcuts
  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    if (event.ctrlKey || event.metaKey) {
      switch (event.key.toLowerCase()) {
        case 'b':
          event.preventDefault();
          this.formattingService.toggleBold();
          break;
        case 'i':
          event.preventDefault();
          this.formattingService.toggleItalic();
          break;
        case 'u':
          event.preventDefault();
          this.formattingService.toggleUnderline();
          break;
      }
    }
  }


}
