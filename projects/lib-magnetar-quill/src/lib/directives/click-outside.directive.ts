import {Directive, ElementRef, EventEmitter, HostListener, Output} from '@angular/core';

/**
 * @generatedInfoDoc
 * InfoDoc: class `ClickOutsideDirective` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/directives/click-outside.directive.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */







@Directive({
  selector: '[libClickOutside]',
  standalone: true
})
export class ClickOutsideDirective {
  @Output() clickOutside = new EventEmitter<void>();
  private runnerNonAcceptingDuringthisTime = true;

    /**
 * @generatedInfoDoc
 * InfoDoc: constructor for class `ClickOutsideDirective` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/directives/click-outside.directive.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */







constructor(private readonly elementRef: ElementRef) {}

    /**
 * @generatedInfoDoc
 * InfoDoc: method `ClickOutsideDirective`.`onDocumentClick()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/directives/click-outside.directive.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */







@HostListener('document:click', ['$event.target'])
  public onDocumentClick(targetElement: EventTarget | null): void {
    if (!targetElement || !(targetElement instanceof Node)) {
        return;
    }
    const clickedInside = this.elementRef.nativeElement.contains(targetElement);
    if (!clickedInside) {

      if (this.runnerNonAcceptingDuringthisTime) {

        (async () => {
         await this.setRunnerAesTrueAfterTaskRan();
        })();

        return;

      }
      this.clickOutside.emit();
    }
  }



    /**
 * @generatedInfoDoc
 * InfoDoc: method `ClickOutsideDirective`.`setRunnerAesTrueAfterTaskRan()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/directives/click-outside.directive.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */







private async setRunnerAesTrueAfterTaskRan(): Promise<void> {
    await this.runnerTask();
    this.runnerNonAcceptingDuringthisTime = false;
  }


    /**
 * @generatedInfoDoc
 * InfoDoc: method `ClickOutsideDirective`.`runnerTask()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/directives/click-outside.directive.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */







private runnerTask(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(); // Resolve the promise after 500 ms
      }, 500);
    });
  }

}
