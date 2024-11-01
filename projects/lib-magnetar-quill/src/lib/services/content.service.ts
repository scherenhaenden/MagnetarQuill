import { Injectable } from '@angular/core';
import {ImageInternalData} from "../models/image-internal-data";
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ContentService {

  constructor() { }

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

  // Observable to track the HTML content of the editor
  private editorContent = new BehaviorSubject<string>('');
  editorContent$ = this.editorContent.asObservable();

  // Method to update the content
  public setEditorContent(htmlContent: string): void {
    console.log('htmlContent', htmlContent);
    this.editorContent.next(htmlContent);
  }

  // Method to retrieve the current content as a snapshot
  public getEditorContent(): string {
    console.log('getEditorContent', this.editorContent.getValue());
    return this.editorContent.getValue();
  }


}
