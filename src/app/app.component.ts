import { ChangeDetectionStrategy, Component, ElementRef, ViewChild, HostListener, AfterViewInit } from '@angular/core';
import { LibMagnetarQuillComponent, type EditorTheme } from "lib-magnetar-quill";
import { TestText } from './test-text';
import { NgIf } from "@angular/common";
import { FormsModule } from "@angular/forms";

/**
 * @generatedInfoDoc
 * InfoDoc: class `AppComponent` is tracked by the generated documentation contract.
 * Location: `src/app/app.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */








@Component({
    selector: 'app-root',
    imports: [LibMagnetarQuillComponent, NgIf, FormsModule],
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.less',
    changeDetection: ChangeDetectionStrategy.Eager
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
   * The theme applied to the editor.
   * @public
   */
  public editorTheme: EditorTheme = 'light';

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
    /**
 * @generatedInfoDoc
 * InfoDoc: constructor for class `AppComponent` is tracked by the generated documentation contract.
 * Location: `src/app/app.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */








public constructor() {
    // Load the test text on component initialization.
    this.testText = TestText.testText;
  }

  /**
   * A lifecycle hook that is called after Angular has fully initialized the component's view.
   * @public
   */
    /**
 * @generatedInfoDoc
 * InfoDoc: method `AppComponent`.`ngAfterViewInit()` is tracked by the generated documentation contract.
 * Location: `src/app/app.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */








public ngAfterViewInit(): void {
    // This hook is currently not used but is kept for future lifecycle-related logic.
  }

  /**
   * Starts the resizing process when the user clicks and holds the resize handle.
   * @param {MouseEvent} event - The mouse event triggered by the mousedown action.
   * @public
   */
    /**
 * @generatedInfoDoc
 * InfoDoc: method `AppComponent`.`onResizeStart()` is tracked by the generated documentation contract.
 * Location: `src/app/app.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
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
    /**
 * @generatedInfoDoc
 * InfoDoc: method `AppComponent`.`onMouseMove()` is tracked by the generated documentation contract.
 * Location: `src/app/app.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
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
    /**
 * @generatedInfoDoc
 * InfoDoc: method `AppComponent`.`onMouseUp()` is tracked by the generated documentation contract.
 * Location: `src/app/app.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */








@HostListener('document:mouseup')
  public onMouseUp(): void {
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
    /**
 * @generatedInfoDoc
 * InfoDoc: method `AppComponent`.`onSelectStart()` is tracked by the generated documentation contract.
 * Location: `src/app/app.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
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
    /**
 * @generatedInfoDoc
 * InfoDoc: method `AppComponent`.`onContentChange()` is tracked by the generated documentation contract.
 * Location: `src/app/app.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */








public onContentChange(): void {
    // This function is kept for potential future use but is currently empty.
  }

  /**
   * Handles theme changes selected from the host select dropdown.
   * @param {Event} event - The selection event.
   * @public
   */
    /**
 * @generatedInfoDoc
 * InfoDoc: method `AppComponent`.`onHostThemeChange()` is tracked by the generated documentation contract.
 * Location: `src/app/app.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */








public onHostThemeChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    if (target) {
      this.editorTheme = target.value as EditorTheme;
    }
  }
}
