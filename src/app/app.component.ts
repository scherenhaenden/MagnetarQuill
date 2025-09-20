import { Component, ElementRef, ViewChild, HostListener, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { LibMagnetarQuillComponent } from "lib-magnetar-quill";
import { TestText } from './test-text';
import { NgIf } from "@angular/common";
import { FormsModule } from "@angular/forms";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LibMagnetarQuillComponent, NgIf, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.less'
})
export class AppComponent implements AfterViewInit {
  title = 'MagnetarQuill Demo';

  public showOutput = true;
  public testText = '';

  // Resize-Eigenschaften
  public editorWidth = 50; // Standardbreite 50%
  public previewWidth = 50; // Standardbreite 50%

  private isResizing = false;
  private startX = 0;
  private startEditorWidth = 0;

  @ViewChild('mainContent', { static: false }) mainContent?: ElementRef;

  constructor(private cdr: ChangeDetectorRef) {
    // Lade den Test-Text beim Start
    this.testText = TestText.testText;
  }

  ngAfterViewInit(): void {
    // Initiale Bildanpassung nach dem View geladen ist
    setTimeout(() => {
      this.adjustPreviewImages();
    }, 100);
  }

  /**
   * Startet den Resize-Vorgang
   */
  onResizeStart(event: MouseEvent): void {
    event.preventDefault();
    this.isResizing = true;
    this.startX = event.clientX;
    this.startEditorWidth = this.editorWidth;

    // Cursor für die gesamte Seite ändern während des Resizing
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }

  /**
   * Mouse Move Handler für das Resizing
   */
  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (!this.isResizing || !this.mainContent) return;

    const containerWidth = this.mainContent.nativeElement.offsetWidth;
    const deltaX = event.clientX - this.startX;
    const deltaPercent = (deltaX / containerWidth) * 100;

    let newEditorWidth = this.startEditorWidth + deltaPercent;

    // Begrenze die Breiten (mindestens 20%, maximal 80%)
    newEditorWidth = Math.max(20, Math.min(80, newEditorWidth));

    this.editorWidth = newEditorWidth;
    this.previewWidth = 100 - newEditorWidth;

    // Bilder in der Vorschau anpassen nach Resize
    setTimeout(() => {
      this.adjustPreviewImages();
    }, 10);
  }

  /**
   * Mouse Up Handler - beendet das Resizing
   */
  @HostListener('document:mouseup', ['$event'])
  onMouseUp(event: MouseEvent): void {
    if (this.isResizing) {
      this.isResizing = false;

      // Cursor zurücksetzen
      document.body.style.cursor = '';
      document.body.style.userSelect = '';

      // Final adjustment der Bilder
      this.adjustPreviewImages();
    }
  }

  /**
   * Verhindert Textselektierung während des Resizing
   */
  @HostListener('document:selectstart', ['$event'])
  onSelectStart(event: Event): void {
    if (this.isResizing) {
      event.preventDefault();
    }
  }

  /**
   * Wird aufgerufen wenn sich der Content ändert
   */
  onContentChange(): void {
    // Bilder anpassen wenn sich der Content ändert
    setTimeout(() => {
      this.adjustPreviewImages();
    }, 50);
  }

  /**
   * Passt alle Bilder in der Live-Vorschau programmatisch an
   */
  private adjustPreviewImages(): void {
    const previewArea = document.querySelector('.rendered-html') as HTMLElement;
    if (!previewArea) return;

    const images = previewArea.querySelectorAll('img') as NodeListOf<HTMLImageElement>;

    images.forEach(img => {
      // Entferne alle width/height Attribute und Styles
      img.removeAttribute('width');
      img.removeAttribute('height');
      img.style.removeProperty('width');
      img.style.removeProperty('height');

      // Setze responsive Eigenschaften direkt
      img.style.maxWidth = '100%';
      img.style.width = 'auto';
      img.style.height = 'auto';
      img.style.objectFit = 'contain';
      img.style.display = 'block';
      img.style.margin = '1rem auto';
      img.style.borderRadius = '8px';
      img.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
    });
  }
}
