import {Directive, ElementRef, EventEmitter, HostListener, OnDestroy, Output} from '@angular/core';
import {debounceTime, filter, fromEvent, Subscription} from "rxjs";

@Directive({
  selector: '[libClickOutside]',
  standalone: true
})
export class ClickOutsideDirective {
  @Output() clickOutside = new EventEmitter<void>();
  private debounceTimer: any = null; // Tracks the debounce timer

  private runnerNonAcceptingDuringthisTime = true;
  private didThisRun = false;

  constructor(private elementRef: ElementRef) {}

  @HostListener('document:click', ['$event.target'])
  public onDocumentClick(targetElement: HTMLElement): void {

    console.warn("ClickOutsideDirective event listener called");

    const clickedInside = this.elementRef.nativeElement.contains(targetElement);
    console.warn("ClickOutsideDirective clicked inside?", clickedInside);

    console.warn("ClickOutsideDirective event listener called", clickedInside);
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

  private startDebounce(): void {
    this.debounceTimer = setTimeout(() => {
      this.debounceTimer = null; // Clear the timer after the debounce time
    }, 500); // Debounce time in milliseconds
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
