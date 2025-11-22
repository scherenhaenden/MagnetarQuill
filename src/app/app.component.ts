import { Component, ElementRef, ViewChild, HostListener, AfterViewInit } from '@angular/core';
import { LibMagnetarQuillComponent } from "lib-magnetar-quill";
import { TestText } from './test-text';
import { NgIf } from "@angular/common";
import { FormsModule } from "@angular/forms";

@Component({
    selector: 'app-root',
    imports: [LibMagnetarQuillComponent, NgIf, FormsModule],
    templateUrl: './app.component.html',
    styleUrl: './app.component.less'
})
export class AppComponent implements AfterViewInit {
  /**
   * The title of the demo application.
   * @public
   */
  public title = 'MagnetarQuill Demo';

  /**
   * A flag to control the visibility of the live preview pane.
   * @public
   */
  public showOutput: boolean = true;

  /**
   * The initial HTML content for the editor, loaded from a test data file.
   * @public
   */
  public testText: string = '';

  /**
   * The current width of the editor pane as a percentage.
   * @public
   */
  public editorWidth: number = 50; // Default width: 50%

  /**
   * The current width of the preview pane as a percentage.
   * @public
   */
  public previewWidth: number = 50; // Default width: 50%

  /**
   * A flag to indicate whether the user is currently resizing the panes.
   * @private
   */
  private isResizing: boolean = false;

  /**
   * The starting X-coordinate of the mouse when a resize action begins.
   * @private
   */
  private startX: number = 0;

  /**
   * The width of the editor pane when a resize action begins.
   * @private
   */
  private startEditorWidth: number = 0;

  /**
   * A reference to the main content container element.
   * @public
   */
  @ViewChild('mainContent', { static: false })
  public mainContent?: ElementRef;

  /**
   * The constructor for the AppComponent.
   * Initializes the component by loading the test text.
   */
  public constructor() {
    // Load the test text on component initialization.
    this.testText = TestText.testText;
  }

  /**
   * A lifecycle hook that is called after Angular has fully initialized the component's view.
   * @public
   */
  public ngAfterViewInit(): void {
    // This hook is currently not used but is kept for future lifecycle-related logic.
  }

  /**
   * Starts the resizing process when the user clicks and holds the resize handle.
   * @param {MouseEvent} event - The mouse event triggered by the mousedown action.
   * @public
   */
  public onResizeStart(event: MouseEvent): void {
    event.preventDefault();
    this.isResizing = true;
    this.startX = event.clientX;
    this.startEditorWidth = this.editorWidth;

    // Change the cursor for the entire page to indicate a resize is in progress.
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }

  /**
   * Handles the mouse move event to dynamically resize the editor and preview panes.
   * @param {MouseEvent} event - The mouse event triggered by the mousemove action.
   * @public
   */
  @HostListener('document:mousemove', ['$event'])
  public onMouseMove(event: MouseEvent): void {
    if (!this.isResizing || !this.mainContent) {
      return;
    }

    const containerWidth = this.mainContent.nativeElement.offsetWidth;
    const deltaX = event.clientX - this.startX;
    const deltaPercent = (deltaX / containerWidth) * 100;

    let newEditorWidth = this.startEditorWidth + deltaPercent;

    // Constrain the width of the panes to be between 20% and 80%.
    newEditorWidth = Math.max(20, Math.min(80, newEditorWidth));

    this.editorWidth = newEditorWidth;
    this.previewWidth = 100 - newEditorWidth;
  }

  /**
   * Stops the resizing process when the user releases the mouse button.
   * @param {MouseEvent} event - The mouse event triggered by the mouseup action.
   * @public
   */
  @HostListener('document:mouseup', ['$event'])
  public onMouseUp(event: MouseEvent): void {
    if (this.isResizing) {
      this.isResizing = false;

      // Reset the cursor to its default state.
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }
  }

  /**
   * Prevents text selection while the user is resizing the panes.
   * @param {Event} event - The selectstart event.
   * @public
   */
  @HostListener('document:selectstart', ['$event'])
  public onSelectStart(event: Event): void {
    if (this.isResizing) {
      event.preventDefault();
    }
  }

  /**
   * A handler for the contentChange event from the editor.
   * This function is no longer needed, as image responsiveness
   * is now handled entirely by CSS in the stylesheet.
   * @public
   */
  public onContentChange(): void {
    // This function is kept for potential future use but is currently empty.
  }
}