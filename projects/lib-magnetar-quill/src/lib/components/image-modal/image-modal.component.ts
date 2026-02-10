import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgIf} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ImageModalComponentModel} from "../../models/image-modal-component-model";
import {ImageService} from "../../services/image.service";
import {ClickOutsideDirective} from "../../directives/click-outside.directive";

@Component({
    selector: 'lib-image-modal',
    imports: [
        NgIf,
        ReactiveFormsModule,
        FormsModule,
        ClickOutsideDirective
    ],
    standalone: true,
    templateUrl: './image-modal.component.html',
    styleUrl: './image-modal.component.css'
})
export class ImageModalComponent {

  public maintainAspectRatio: boolean = true;
  private originalAspectRatio: number | null = null; // Store the original aspect ratio


  constructor(private imageService: ImageService) {
  }

  @Input() isEditMode: boolean = true;
  private _imageModalComponentModel: ImageModalComponentModel = new ImageModalComponentModel();

  @Input()
  set imageModalComponentModel(value: ImageModalComponentModel) {
    this._imageModalComponentModel = value;
    // You can add any logic here that needs to be executed
    // when the input value changes, e.g., updating other properties
    // or triggering some action based on the new value.
    this.setOriginalRatio();
  }

  get imageModalComponentModel(): ImageModalComponentModel {
    return this._imageModalComponentModel;
  }
  @Output() imageModalComponentModelChange = new EventEmitter<ImageModalComponentModel>();

  @Output() save = new EventEmitter<ImageModalComponentModel>();
  @Output() cancel = new EventEmitter<void>();

  public onSubmit(): ImageModalComponentModel {
    this.imageService.applyImageEdits();
    this.save.emit(this.imageModalComponentModel);
    this.imageModalComponentModelChange.emit(this.imageModalComponentModel)// Emit the updated model
    this.cancel.emit();
    return this.imageModalComponentModel;

  }

  public onCancel(): void {
    this.cancel.emit();
  }

  public toggleAspectRatio(): void {
    if (this.maintainAspectRatio && this.imageModalComponentModel.width && this.imageModalComponentModel.height) {
      // Calculate and store the original aspect ratio
      this.originalAspectRatio = this.imageModalComponentModel.height / this.imageModalComponentModel.width;
    } else {
      this.originalAspectRatio = null; // Reset aspect ratio when unchecking
    }
  }

  private setOriginalRatio(): number| null {

    if(this.imageModalComponentModel.width && this.imageModalComponentModel.height) {
      this.originalAspectRatio = this.imageModalComponentModel.height / this.imageModalComponentModel.width;
      return this.originalAspectRatio;
    }

    return null;
  }



  public updateHeight(): void {
    if (this.maintainAspectRatio && this.originalAspectRatio !== null && this.imageModalComponentModel.width) {
      // Calculate the new height based on the width and original aspect ratio
      this.imageModalComponentModel.height = Math.round(this.imageModalComponentModel.width * this.originalAspectRatio);
    }
  }


}
