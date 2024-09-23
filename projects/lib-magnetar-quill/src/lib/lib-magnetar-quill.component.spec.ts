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
});
