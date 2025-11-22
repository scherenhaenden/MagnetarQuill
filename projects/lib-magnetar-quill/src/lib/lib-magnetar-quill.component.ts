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
import { ContentService } from "./services/content.service";
import { ImageModalComponent } from "./components/image-modal/image-modal.component";
import { NgIf } from "@angular/common";
import { ImageModalComponentModel } from "./models/image-modal-component-model";
import { ImageService } from "./services/image.service";
import { FormattingService } from "./services/formatting.service";
import { ClickOutsideDirective } from "./directives/click-outside.directive";

@Component({
    selector: 'magnetar-quill',
    imports: [ToolbarComponent, EditorComponent, ImageModalComponent, NgIf, ClickOutsideDirective],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    templateUrl: './lib-magnetar-quill.component.html',
    styleUrl: './lib-magnetar-quill.component.less'
})
export class LibMagnetarQuillComponent {

  /**
   * The data model for the image modal, used for updating image properties.
   * @public
   */
  public updateModel: ImageModalComponentModel = new ImageModalComponentModel();

  /**
   * A flag to control the visibility of the image editing modal.
   * @public
   */
  public showImageModal: boolean = false;

  /**
   * A flag to control the visibility of the HTML source view.
   * @public
   */
  public isHtmlView: boolean = false;

  /**
   * A reference to the image modal component instance.
   * @private
   */
  @ViewChild('imageModelComponent')
  private imageModalRef!: ImageModalComponent;

  /**
   * The internal data model for the image modal component.
   * @private
   */
  private _imageModalComponentModel!: ImageModalComponentModel;

  /**
   * The public getter for the image modal component model.
   * @returns {ImageModalComponentModel} The current image modal data.
   * @public
   */
  public get imageModalComponentModel(): ImageModalComponentModel {
    return this._imageModalComponentModel;
  }

  /**
   * The public setter for the image modal component model.
   * When a value is set, it updates the model and triggers change detection.
   * @param {ImageModalComponentModel} value - The new image modal data.
   * @public
   */
  public set imageModalComponentModel(value: ImageModalComponentModel) {
    if (value) {
      this._imageModalComponentModel = value;
      this.updateModel = value;
      this.cdRef.detectChanges();
    }
  }

  /**
   * An input property to receive the initial HTML content from the parent component.
   * @param {string} value - The HTML content string.
   * @public
   */
  @Input()
  public set content(value: string) {
    this.contentService.setEditorContent(value);
  }

  /**
   * An output event emitter that notifies the parent component of content changes.
   * @public
   */
  @Output()
  public contentChange: EventEmitter<string> = new EventEmitter<string>();

  /**
   * The constructor for the LibMagnetarQuillComponent.
   * @param {ContentService} contentService - The service for managing editor content.
   * @param {FormattingService} formattingService - The service for applying text formatting.
   * @param {ImageService} imageService - The service for handling image-related actions.
   * @param {ChangeDetectorRef} cdRef - The service for manual change detection.
   * @public
   */
  public constructor(
    private contentService: ContentService,
    private formattingService: FormattingService,
    public imageService: ImageService,
    private cdRef: ChangeDetectorRef
  ) {}

  /**
   * Closes the image editing modal if it is currently open.
   * @public
   */
  public closeModal(): void {
    if (this.showImageModal) {
      this.showImageModal = false;
    }
  }

  /**
   * Toggles the visibility of the HTML source view.
   * @public
   */
  public toggleHtmlView(): void {
    this.isHtmlView = !this.isHtmlView;
  }

  /**
   * Opens the image editing modal.
   * This is typically called from the editor's context menu.
   * @public
   */
  public openImageEditModal(): void {
    this.showImageModal = true;
  }

  /**
   * Resets the image data after editing is complete and closes the modal.
   * @public
   */
  public clearImageToEdit(): void {
    this.showImageModal = false;
  }

  /**
   * Handles the content changed event from the editor component.
   * Emits the new content to the parent component.
   * @param {string} newContent - The updated HTML content from the editor.
   * @public
   */
  public onEditorContentChanged(newContent: string): void {
    this.contentChange.emit(newContent);
  }
}
