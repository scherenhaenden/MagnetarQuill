import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TableModalComponent } from './table-modal.component';

describe('TableModalComponent', () => {
  let component: TableModalComponent;
  let fixture: ComponentFixture<TableModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit cancel event when onCancel is called', () => {
    spyOn(component.cancel, 'emit');
    component.onCancel();
    expect(component.cancel.emit).toHaveBeenCalled();
  });

  it('should emit submit event with rows and cols when onSubmit is called with positive values', () => {
    spyOn(component.submit, 'emit');
    component.rows = 4;
    component.cols = 5;
    component.onSubmit();
    expect(component.submit.emit).toHaveBeenCalledWith({ rows: 4, cols: 5 });
  });

  it('should not emit submit event when rows or cols are 0 or less', () => {
    spyOn(component.submit, 'emit');
    component.rows = 0;
    component.cols = 5;
    component.onSubmit();
    expect(component.submit.emit).not.toHaveBeenCalled();
  });
});
