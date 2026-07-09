import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {NgIf} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ImageModalComponentModel} from "../../models/image-modal-component-model";
import {ImageService} from "../../services/image.service";
import {ClickOutsideDirective} from "../../directives/click-outside.directive";

/**
 * @generatedInfoDoc
 * InfoDoc: class `ImageModalComponent` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/components/image-modal/image-modal.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */







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
    styleUrl: './image-modal.component.css',
    changeDetection: ChangeDetectionStrategy.Eager
})
export class ImageModalComponent {

  public maintainAspectRatio: boolean = true;
  private originalAspectRatio: number | null = null; // Store the original aspect ratio


    /**
 * @generatedInfoDoc
 * InfoDoc: constructor for class `ImageModalComponent` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/components/image-modal/image-modal.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */







constructor(private readonly imageService: ImageService) {
  }

  @Input() isEditMode: boolean = true;
  private _imageModalComponentModel: ImageModalComponentModel = new ImageModalComponentModel();

    /**
 * @generatedInfoDoc
 * InfoDoc: setter `ImageModalComponent`.`imageModalComponentModel` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/components/image-modal/image-modal.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */







@Input()
  set imageModalComponentModel(value: ImageModalComponentModel) {
    this._imageModalComponentModel = value;
    // You can add any logic here that needs to be executed
    // when the input value changes, e.g., updating other properties
    // or triggering some action based on the new value.
    this.setOriginalRatio();
  }

    /**
 * @generatedInfoDoc
 * InfoDoc: getter `ImageModalComponent`.`imageModalComponentModel` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/components/image-modal/image-modal.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */







get imageModalComponentModel(): ImageModalComponentModel {
    return this._imageModalComponentModel;
  }
  @Output() imageModalComponentModelChange = new EventEmitter<ImageModalComponentModel>();

  @Output() save = new EventEmitter<ImageModalComponentModel>();
  @Output() cancel = new EventEmitter<void>();

    /**
 * @generatedInfoDoc
 * InfoDoc: method `ImageModalComponent`.`onSubmit()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/components/image-modal/image-modal.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */







public onSubmit(): ImageModalComponentModel {
    this.imageService.applyImageEdits();
    this.save.emit(this.imageModalComponentModel);
    this.imageModalComponentModelChange.emit(this.imageModalComponentModel)// Emit the updated model
    this.cancel.emit();
    return this.imageModalComponentModel;

  }

    /**
 * @generatedInfoDoc
 * InfoDoc: method `ImageModalComponent`.`onCancel()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/components/image-modal/image-modal.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */







public onCancel(): void {
    this.cancel.emit();
  }

    /**
 * @generatedInfoDoc
 * InfoDoc: method `ImageModalComponent`.`toggleAspectRatio()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/components/image-modal/image-modal.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */







public toggleAspectRatio(): void {
    if (this.maintainAspectRatio && this.imageModalComponentModel.width && this.imageModalComponentModel.height) {
      // Calculate and store the original aspect ratio
      this.originalAspectRatio = this.imageModalComponentModel.height / this.imageModalComponentModel.width;
    } else {
      this.originalAspectRatio = null; // Reset aspect ratio when unchecking
    }
  }

    /**
 * @generatedInfoDoc
 * InfoDoc: method `ImageModalComponent`.`setOriginalRatio()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/components/image-modal/image-modal.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */







private setOriginalRatio(): number| null {

    if(this.imageModalComponentModel.width && this.imageModalComponentModel.height) {
      this.originalAspectRatio = this.imageModalComponentModel.height / this.imageModalComponentModel.width;
      return this.originalAspectRatio;
    }

    return null;
  }



    /**
 * @generatedInfoDoc
 * InfoDoc: method `ImageModalComponent`.`updateHeight()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/components/image-modal/image-modal.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */







public updateHeight(): void {
    if (this.maintainAspectRatio && this.originalAspectRatio !== null && this.imageModalComponentModel.width) {
      // Calculate the new height based on the width and original aspect ratio
      this.imageModalComponentModel.height = Math.round(this.imageModalComponentModel.width * this.originalAspectRatio);
    }
  }


}
