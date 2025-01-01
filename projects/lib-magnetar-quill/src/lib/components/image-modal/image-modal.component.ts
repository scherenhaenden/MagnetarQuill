import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgIf} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ImageModalComponentModel} from "../../models/image-modal-component-model";
import {ImageService} from "../../services/image.service";

@Component({
  selector: 'lib-image-modal',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './image-modal.component.html',
  styleUrl: './image-modal.component.css'
})
export class ImageModalComponent {

  public maintainAspectRatio: boolean = false;
  private originalAspectRatio: number | null = null; // Store the original aspect ratio


  constructor(private imageService: ImageService) {
  }

  @Input() isEditMode: boolean = true;
  @Input() imageModalComponentModel: ImageModalComponentModel = new ImageModalComponentModel();
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

  public updateHeight(): void {
    if (this.maintainAspectRatio && this.originalAspectRatio !== null && this.imageModalComponentModel.width) {
      // Calculate the new height based on the width and original aspect ratio
      this.imageModalComponentModel.height = Math.round(this.imageModalComponentModel.width * this.originalAspectRatio);
    }
  }


}
