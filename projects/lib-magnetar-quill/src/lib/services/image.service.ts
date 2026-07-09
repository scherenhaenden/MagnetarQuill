import {Injectable, signal, WritableSignal} from '@angular/core';
import {ImageModalComponentModel} from "../models/image-modal-component-model";

/**
 * @generatedInfoDoc
 * InfoDoc: class `ImageService` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/image.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */






@Injectable()
export class ImageService {

  // Signal to manage the selected image
  public selectedImage: WritableSignal<ImageModalComponentModel | null> = signal(null);
  private selectedImageElement: HTMLImageElement | null = null;


    /**
 * @generatedInfoDoc
 * InfoDoc: constructor for class `ImageService` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/image.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */






constructor() { }

    /**
 * @generatedInfoDoc
 * InfoDoc: method `ImageService`.`setSelectedImageOnEditor()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/image.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */






public setSelectedImageOnEditor(imageModalComponentModel: ImageModalComponentModel, imageElement: HTMLImageElement | null = null): void {
    this.selectedImage.set(imageModalComponentModel);
    this.selectedImageElement = imageElement;
  }


    /**
 * @generatedInfoDoc
 * InfoDoc: method `ImageService`.`applyImageEdits()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/image.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */






public applyImageEdits(): void {
    const image = this.selectedImage();
    if (!image) {
      return;
    }

    const imgElement = this.selectedImageElement;
    if (!imgElement) {
      return;
    }

    this.updateImageElement(imgElement, image);
  }

/**
 * @generatedInfoDoc
 * InfoDoc: method `ImageService`.`updateImageElement()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/image.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */






private updateImageElement(imgElement: HTMLImageElement, image: ImageModalComponentModel): void {
    imgElement.src = image.url;
    imgElement.alt = image.alt || '';
    imgElement.style.width = image.width ? `${image.width}px` : 'auto';
    imgElement.style.height = image.height ? `${image.height}px` : 'auto';
    imgElement.style.borderWidth = image.border ? `${image.border}px` : '';
    imgElement.style.padding = `${image.vPadding || 0}px ${image.hPadding || 0}px`;
    imgElement.style.textAlign = image.alignment || 'left';
  }


  // Method to clear the selected image
    /**
 * @generatedInfoDoc
 * InfoDoc: method `ImageService`.`clearSelectedImage()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/image.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */






public clearSelectedImage(): void {
    this.selectedImage.set(null);
    this.selectedImageElement = null;
  }

    /**
 * @generatedInfoDoc
 * InfoDoc: method `ImageService`.`getBase64()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/image.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */






public getBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }
}
