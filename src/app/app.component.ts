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

  constructor() {
    // Lade den Test-Text beim Start
    this.testText = TestText.testText;
  }

  ngAfterViewInit(): void {}

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

    this.previewWidth = 100 - newEditorWidth;
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
    // This function is no longer needed, as image responsiveness
    // is now handled entirely by CSS in the stylesheet.
  }
}
