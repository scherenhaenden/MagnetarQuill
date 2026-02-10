import {Directive, ElementRef, EventEmitter, HostListener, OnDestroy, Output} from '@angular/core';

@Directive({
  selector: '[libClickOutside]',
  standalone: true
})
export class ClickOutsideDirective {
  @Output() clickOutside = new EventEmitter<void>();
  private debounceTimer: any = null; // Tracks the debounce timer

  private runnerNonAcceptingDuringthisTime = true;

  constructor(private elementRef: ElementRef) {}

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



  private async setRunnerAesTrueAfterTaskRan(): Promise<void> {
    await this.runnerTask();
    this.runnerNonAcceptingDuringthisTime = false;
  }


  private runnerTask(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(); // Resolve the promise after 500 ms
      }, 500);
    });
  }

}
