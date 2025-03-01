import { Injectable } from '@angular/core';
import {ImageInternalData} from "../models/image-internal-data";
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ContentService {


  // Observable to track the HTML content of the editor
  private editorContent = new BehaviorSubject<string>('');
  editorContent$ = this.editorContent.asObservable();

  // Method to update the content
  public setEditorContent(htmlContent: string): void {
    this.editorContent.next(htmlContent);
  }

  // Method to retrieve the current content as a snapshot
  public getEditorContent(): string {
    return this.editorContent.getValue();
  }

  // Method to insert an image
  // Method to insert image as HTML content
  public insertImage(imageData: { url: string, alt?: string, width?: number, height?: number }): void {
    const imageHtml = `<img src="${imageData.url}" alt="${imageData.alt || ''}"
                        width="${imageData.width || ''}" height="${imageData.height || ''}" />`;

    // Assuming content appending, you can customize this as needed
    const currentContent = this.getEditorContent();
    const updatedContent = currentContent + imageHtml;
    this.setEditorContent(updatedContent);
  }


  public insertHtmlAtCursor(html: string): void {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const fragment = document.createRange().createContextualFragment(html);
      range.deleteContents(); // Remove the current selection
      range.insertNode(fragment); // Insert the HTML fragment
    }
  }

  public insertTextAtCursor(text: string): void {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    range.deleteContents();
    range.insertNode(document.createTextNode(text));

    // Move the cursor after the inserted text
    range.setStartAfter(range.endContainer);
    selection.removeAllRanges();
    selection.addRange(range);
  }

  public insertImageFromUrl(imageData: ImageInternalData): void {
    const img = document.createElement('img');
    img.src = imageData.url;
    img.alt = imageData.alt || '';
    img.style.width = imageData.width ? `${imageData.width}px` : 'auto';
    img.style.height = imageData.height ? `${imageData.height}px` : 'auto';
    img.style.borderWidth = `${imageData.border}px`;
    img.style.padding = `${imageData.vPadding}px ${imageData.hPadding}px`;
    img.style.textAlign = imageData.alignment ?? 'left';

    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.insertNode(img);
      range.collapse(false);
    }
  }


  public getSelectedElements(): HTMLElement[] {
    const selection = window.getSelection();
    const elements: HTMLElement[] = [];
    if (selection && !selection.isCollapsed) {
      const range = selection.getRangeAt(0);
      let container: Node = range.commonAncestorContainer;
      if (container.nodeType === Node.TEXT_NODE) {
        container = container.parentElement as HTMLElement;
      }
      if (container instanceof HTMLElement) {
        if (container.tagName === 'P') {
          elements.push(container);
        } else {
          container.querySelectorAll('p').forEach(paragraph => elements.push(paragraph));
        }
      }
    }
    return elements;
  }

}
