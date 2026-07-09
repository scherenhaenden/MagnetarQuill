import {ImageModalComponentModel} from "../models/image-modal-component-model";

/**
 * @generatedInfoDoc
 * InfoDoc: class `ImageHtmlElementImageModalComponentMapper` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/mappers/image-html-element-image-modal-component-mapper.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */






export class ImageHtmlElementImageModalComponentMapper {

    /**
 * @generatedInfoDoc
 * InfoDoc: method `ImageHtmlElementImageModalComponentMapper`.`mapImageModalComponentToImageHtmlElement()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/mappers/image-html-element-image-modal-component-mapper.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */






public mapImageModalComponentToImageHtmlElement(imageModalComponentModel: ImageModalComponentModel): HTMLImageElement {

    // Create the image element
    const imageElement: HTMLImageElement = document.createElement('img');

    imageElement.src = imageModalComponentModel.url;
    imageElement.alt = imageModalComponentModel.alt || '';
    imageElement.style.width = imageModalComponentModel.width ? `${imageModalComponentModel.width}px` : 'auto';
    imageElement.style.height = imageModalComponentModel.height ? `${imageModalComponentModel.height}px` : 'auto';
    imageElement.style.borderWidth = `${imageModalComponentModel.border || 0}px`;
    imageElement.style.padding = `${imageModalComponentModel.vPadding || 0}px ${imageModalComponentModel.hPadding || 0}px`;
    imageElement.style.textAlign = imageModalComponentModel.alignment || 'left';

    return imageElement;
  }

    /**
 * @generatedInfoDoc
 * InfoDoc: method `ImageHtmlElementImageModalComponentMapper`.`mapImageHtmlElementToImageModalComponent()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/mappers/image-html-element-image-modal-component-mapper.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */






public mapImageHtmlElementToImageModalComponent(imageElement: HTMLImageElement): ImageModalComponentModel {
    // Create a new ImageModalComponentModel object
    const imageModalComponentModel = new ImageModalComponentModel();

    // Map properties from the image element to the model
    imageModalComponentModel.url = imageElement.src;
    imageModalComponentModel.alt = imageElement.alt || '';
    imageModalComponentModel.width = imageElement.width || null;
    imageModalComponentModel.height = imageElement.height || null;
    imageModalComponentModel.border = Number.parseInt(imageElement.style.borderWidth || '0', 10);
    imageModalComponentModel.hPadding = Number.parseInt(imageElement.style.paddingLeft || '0', 10);
    imageModalComponentModel.vPadding = Number.parseInt(imageElement.style.paddingTop || '0', 10);

    // Ensure alignment is valid before assigning
    imageElement.style.textAlign = imageModalComponentModel.alignment || 'left';

    return imageModalComponentModel;
  }

}
