import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibMagnetarQuillComponent } from './lib-magnetar-quill.component';

describe('LibMagnetarQuillComponent', () => {
  let component: LibMagnetarQuillComponent;
  let fixture: ComponentFixture<LibMagnetarQuillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LibMagnetarQuillComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LibMagnetarQuillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a default theme of light', () => {
    expect(component.theme).toBe('light');
  });

  it('should update theme and emit themeChange when onThemeChange is called', () => {
    spyOn(component.themeChange, 'emit');
    component.onThemeChange('dark');
    expect(component.theme).toBe('dark');
    expect(component.themeChange.emit).toHaveBeenCalledWith('dark');
  });

  it('should apply the correct theme class to the host element', () => {
    component.theme = 'dark';
    fixture.detectChanges();
    const hostEl = fixture.nativeElement;
    expect(hostEl.className).toContain('theme-dark');

    component.theme = 'custom';
    fixture.detectChanges();
    expect(hostEl.className).toContain('theme-custom');
  });
});
