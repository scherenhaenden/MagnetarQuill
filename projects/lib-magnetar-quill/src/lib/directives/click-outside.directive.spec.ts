import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ClickOutsideDirective } from './click-outside.directive';

@Component({
  template: `
    <div libClickOutside (clickOutside)="onOutsideClick()">
      <p class="inside">Click inside me</p>
    </div>
    <div class="outside">Click outside here</div>
  `
})
class TestHostComponent {
  public outsideClicked = false;

  onOutsideClick(): void {
    this.outsideClicked = true;
  }
}

describe('ClickOutsideDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let debugEl: DebugElement;
  let component: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClickOutsideDirective],  // <--- Import, not declare
      declarations: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    debugEl = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    const directive = debugEl.query(By.directive(ClickOutsideDirective));
    expect(directive).toBeTruthy();
  });

  it('should not emit if we click inside', () => {
    const insideEl = fixture.nativeElement.querySelector('.inside');
    insideEl.click();
    fixture.detectChanges();
    expect(component.outsideClicked).toBeFalse();
  });

  it('should not emit clickOutside on the first outside click due to the locking mechanism', () => {
    const outsideEl = fixture.nativeElement.querySelector('.outside');
    outsideEl.click();
    fixture.detectChanges();
    expect(component.outsideClicked).toBeFalse();
  });

  it('should emit clickOutside on the second click outside once the 500ms runnerTask has resolved', fakeAsync(() => {
    const outsideEl = fixture.nativeElement.querySelector('.outside');

    // First outside click - directive is locked
    outsideEl.click();
    fixture.detectChanges();
    expect(component.outsideClicked).toBeFalse();

    // Wait for 500ms
    tick(500);
    fixture.detectChanges();

    // Second outside click - should now emit
    outsideEl.click();
    fixture.detectChanges();
    expect(component.outsideClicked).toBeTrue();
  }));

  it('should not emit if second outside click occurs before 500ms', fakeAsync(() => {
    const outsideEl = fixture.nativeElement.querySelector('.outside');

    // First outside click
    outsideEl.click();
    fixture.detectChanges();
    expect(component.outsideClicked).toBeFalse();

    // Advance time only 300ms
    tick(300);
    outsideEl.click();
    fixture.detectChanges();

    // Should still not emit because 500ms haven't elapsed
    expect(component.outsideClicked).toBeFalse();

    // Advance the remaining time to resolve all timers
    tick(800); // Completes the 500ms timer
  }));

  it('should emit on an outside click after 500ms have passed since first outside click', fakeAsync(() => {
    const outsideEl = fixture.nativeElement.querySelector('.outside');

    // First outside click
    outsideEl.click();
    fixture.detectChanges();
    expect(component.outsideClicked).toBeFalse();

    // Wait the full 500ms
    tick(500);
    fixture.detectChanges();

    // Now second outside click
    outsideEl.click();
    fixture.detectChanges();
    expect(component.outsideClicked).toBeTrue();
  }));
});
