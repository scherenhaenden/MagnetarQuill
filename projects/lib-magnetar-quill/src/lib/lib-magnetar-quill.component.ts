import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild
} from '@angular/core';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { EditorComponent } from "./components/editor/editor.component";
import { ContentService } from "./services/content.service";
import { ImageModalComponent } from "./components/image-modal/image-modal.component";
import { NgIf } from "@angular/common";
import { ImageModalComponentModel } from "./models/image-modal-component-model";
import { ImageService } from "./services/image.service";
import { FormattingService } from "./services/formatting.service";
import { KeyboardShortcutService } from "./services/keyboard-shortcut.service";
import { LogService } from "./services/log.service";

export type EditorTheme = 'light' | 'dark' | 'custom' | (string & {});

/**
 * @generatedInfoDoc
 * InfoDoc: function `isEditorTheme()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/lib-magnetar-quill.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */





function isEditorTheme(value: string): value is EditorTheme {
  return /^[a-z0-9_-]+$/i.test(value);
}

/**
 * @generatedInfoDoc
 * InfoDoc: class `LibMagnetarQuillComponent` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/lib-magnetar-quill.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */







@Component({
    selector: 'magnetar-quill',
    imports: [ToolbarComponent, EditorComponent, ImageModalComponent, NgIf],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    standalone: true,
    templateUrl: './lib-magnetar-quill.component.html',
    styleUrl: './lib-magnetar-quill.component.less',
    changeDetection: ChangeDetectionStrategy.Eager,
    providers: [FormattingService, ContentService, KeyboardShortcutService, ImageService, LogService],
    host: {
      '[class]': '"magnetar-quill-container theme-" + theme'
    }
})
export class LibMagnetarQuillComponent {

  /**
   * The current theme of the editor.
   * @public
   */
  @Input() public theme: EditorTheme = 'light';

  /**
   * Emits when the theme changes.
   * @public
   */
  @Output() public themeChange: EventEmitter<EditorTheme> = new EventEmitter<EditorTheme>();

  /**
   * The data model for the image modal, used for updating image properties.
   * @public
   */
  public updateModel: ImageModalComponentModel = new ImageModalComponentModel();

  /**
   * A flag to control the visibility of the image editing modal.
   * @public
   */
  public showImageModal: boolean = false;

  /**
   * A flag to control the visibility of the HTML source view.
   * @public
   */
  public isHtmlView: boolean = false;

  /**
   * A reference to the image modal component instance.
   * @private
   */
  @ViewChild('imageModelComponent')
  private imageModalRef!: ImageModalComponent;

  /**
   * The internal data model for the image modal component.
   * @private
   */
  private _imageModalComponentModel!: ImageModalComponentModel;

  /**
   * The public getter for the image modal component model.
   * @returns {ImageModalComponentModel} The current image modal data.
   * @public
   */
    /**
 * @generatedInfoDoc
 * InfoDoc: getter `LibMagnetarQuillComponent`.`imageModalComponentModel` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/lib-magnetar-quill.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */







public get imageModalComponentModel(): ImageModalComponentModel {
    return this._imageModalComponentModel;
  }

  /**
   * The public setter for the image modal component model.
   * When a value is set, it updates the model and triggers change detection.
   * @param {ImageModalComponentModel} value - The new image modal data.
   * @public
   */
    /**
 * @generatedInfoDoc
 * InfoDoc: setter `LibMagnetarQuillComponent`.`imageModalComponentModel` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/lib-magnetar-quill.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */







public set imageModalComponentModel(value: ImageModalComponentModel) {
    if (value) {
      this._imageModalComponentModel = value;
      this.updateModel = value;
      this.cdRef.detectChanges();
    }
  }

  /**
   * An input property to receive the initial HTML content from the parent component.
   * @param {string} value - The HTML content string.
   * @public
   */
    /**
 * @generatedInfoDoc
 * InfoDoc: setter `LibMagnetarQuillComponent`.`content` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/lib-magnetar-quill.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */







@Input()
  public set content(value: string) {
    this.contentService.setEditorContent(value);
  }

  /**
   * An output event emitter that notifies the parent component of content changes.
   * @public
   */
  @Output()
  public contentChange: EventEmitter<string> = new EventEmitter<string>();

  /**
   * The constructor for the LibMagnetarQuillComponent.
   * @param {ContentService} contentService - The service for managing editor content.
   * @param {FormattingService} formattingService - The service for applying text formatting.
   * @param {ImageService} imageService - The service for handling image-related actions.
   * @param {KeyboardShortcutService} keyboardShortcutService - The service for handling keyboard shortcuts.
   * @param {ChangeDetectorRef} cdRef - The service for manual change detection.
   * @param {ElementRef} el - The reference to the component's host element.
   * @public
   */
    /**
 * @generatedInfoDoc
 * InfoDoc: constructor for class `LibMagnetarQuillComponent` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/lib-magnetar-quill.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */







public constructor(
    private readonly contentService: ContentService,
    private readonly formattingService: FormattingService,
    public readonly imageService: ImageService,
    private readonly keyboardShortcutService: KeyboardShortcutService,
    private readonly cdRef: ChangeDetectorRef,
    private readonly el: ElementRef
  ) {
    this.keyboardShortcutService.initialize(this.el.nativeElement);
  }

  /**
   * Closes the image editing modal if it is open.
   */
    /**
 * @generatedInfoDoc
 * InfoDoc: method `LibMagnetarQuillComponent`.`closeModal()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/lib-magnetar-quill.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */







public closeModal(): void {
    if (this.showImageModal) {
      this.showImageModal = false;
    }
  }

  /**
   * Toggles the visibility of the HTML source view.
   */
    /**
 * @generatedInfoDoc
 * InfoDoc: method `LibMagnetarQuillComponent`.`toggleHtmlView()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/lib-magnetar-quill.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */







public toggleHtmlView(): void {
    this.isHtmlView = !this.isHtmlView;
  }

  /**
   * Opens the image editing modal.
   */
    /**
 * @generatedInfoDoc
 * InfoDoc: method `LibMagnetarQuillComponent`.`openImageEditModal()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/lib-magnetar-quill.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */







public openImageEditModal(): void {
    this.showImageModal = true;
  }

  /**
   * Hides the image modal after editing is complete.
   */
    /**
 * @generatedInfoDoc
 * InfoDoc: method `LibMagnetarQuillComponent`.`clearImageToEdit()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/lib-magnetar-quill.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */







public clearImageToEdit(): void {
    this.showImageModal = false;
  }

  /**
   * Handles theme changes from the toolbar.
   * @param {string} newTheme - The newly selected theme.
   * @public
   */
    /**
 * @generatedInfoDoc
 * InfoDoc: method `LibMagnetarQuillComponent`.`onThemeChange()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/lib-magnetar-quill.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */







public onThemeChange(newTheme: string): void {
    if (!isEditorTheme(newTheme)) {
      return;
    }

    this.theme = newTheme;
    this.themeChange.emit(newTheme);
    this.cdRef.detectChanges();
  }

  /**
   * Emits the new content to the parent component when the editor content changes.
   * @param {string} newContent - The updated HTML content from the editor.
   * @public
   */
    /**
 * @generatedInfoDoc
 * InfoDoc: method `LibMagnetarQuillComponent`.`onEditorContentChanged()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/lib-magnetar-quill.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */







public onEditorContentChanged(newContent: string): void {
    this.contentChange.emit(newContent);
  }
}
