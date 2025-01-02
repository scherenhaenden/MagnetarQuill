import {Injectable, signal, WritableSignal} from '@angular/core';
import {ImageModalComponentModel} from "../models/image-modal-component-model";

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  // Signal to manage the selected image
  public selectedImage: WritableSignal<ImageModalComponentModel | null> = signal(null);


  constructor() { }

  public setSelectedImageOnEditor(mageModalComponentModel: ImageModalComponentModel): void {
    this.selectedImage.set(mageModalComponentModel);
  }


  public applyImageEdits(): void {

    // Check if a selected image exists
    if (this.selectedImage()) {
      const image = this.selectedImage()!;

      // Find the actual <img> element in the DOM (if using direct manipulation)
      const imgElement = document.querySelector(`img[src="${image.url}"]`) as HTMLImageElement;

      if (imgElement) {
        // Update the properties of the <img> tag
        imgElement.src = image.url;
        imgElement.alt = image.alt || '';
        imgElement.style.width = image.width ? `${image.width}px` : 'auto';
        imgElement.style.height = image.height ? `${image.height}px` : 'auto';
        imgElement.style.borderWidth = image.border ? `${image.border}px` : '';
        imgElement.style.padding = `${image.vPadding || 0}px ${image.hPadding || 0}px`;
        imgElement.style.textAlign = image.alignment || 'left';
      }
    }
  }


  // Method to clear the selected image
  public clearSelectedImage(): void {
    this.selectedImage.set(null);
  }

  public getBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }
}
