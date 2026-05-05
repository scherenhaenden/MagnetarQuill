import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ImageModalComponent } from './image-modal.component';
import { ImageService } from '../../services/image.service';


describe('ImageModalComponent', () => {
  let component: ImageModalComponent;
  let fixture: ComponentFixture<ImageModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageModalComponent],
      providers: [ImageService]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ImageModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
