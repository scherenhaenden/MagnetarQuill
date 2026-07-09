import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Output,
  ViewChild
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClickOutsideDirective } from '../../directives/click-outside.directive';

/**
 * @generatedInfoDoc
 * InfoDoc: class `TableModalComponent` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/components/table-modal/table-modal.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */




@Component({
  selector: 'lib-table-modal',
  imports: [FormsModule, ClickOutsideDirective],
  standalone: true,
  templateUrl: './table-modal.component.html',
  styleUrl: './table-modal.component.css',
  changeDetection: ChangeDetectionStrategy.Eager
})
export class TableModalComponent implements AfterViewInit {
  public rows: number = 3;
  public cols: number = 3;

  @ViewChild('rowsInput') private readonly rowsInput?: ElementRef<HTMLInputElement>;

  @Output() public cancel = new EventEmitter<void>();
  @Output() public submit = new EventEmitter<{ rows: number; cols: number }>();

    /**
 * @generatedInfoDoc
 * InfoDoc: constructor for class `TableModalComponent` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/components/table-modal/table-modal.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */




constructor() {}

/**
 * @generatedInfoDoc
 * InfoDoc: method `TableModalComponent`.`ngAfterViewInit()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/components/table-modal/table-modal.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */

public ngAfterViewInit(): void {
    queueMicrotask(() => this.rowsInput?.nativeElement.focus());
  }

/**
 * @generatedInfoDoc
 * InfoDoc: method `TableModalComponent`.`onEscape()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/components/table-modal/table-modal.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */

@HostListener('keydown.escape')
  public onEscape(): void {
    this.onCancel();
  }

    /**
 * @generatedInfoDoc
 * InfoDoc: method `TableModalComponent`.`onCancel()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/components/table-modal/table-modal.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */




public onCancel(): void {
    this.cancel.emit();
  }

    /**
 * @generatedInfoDoc
 * InfoDoc: method `TableModalComponent`.`onSubmit()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/components/table-modal/table-modal.component.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */




public onSubmit(): void {
    const rows = Math.floor(this.rows);
    const cols = Math.floor(this.cols);

    if (rows > 0 && cols > 0) {
      this.submit.emit({ rows, cols });
    }
  }
}
