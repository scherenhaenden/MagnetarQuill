import {
  ChangeDetectorRef,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  EventEmitter,
  Input,
  Output,
  ViewChild
} from '@angular/core';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { EditorComponent } from "./components/editor/editor.component";
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
export class LibMagnetarQuillComponent {

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
}
