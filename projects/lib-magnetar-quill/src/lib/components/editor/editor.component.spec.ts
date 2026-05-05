import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditorComponent } from './editor.component';
import { FormattingService } from '../../services/formatting.service';
import { ContentService } from '../../services/content.service';
import { ImageService } from '../../services/image.service';

describe('EditorComponent', () => {
  let component: EditorComponent;
  let fixture: ComponentFixture<EditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditorComponent],
      providers: [FormattingService, ContentService, ImageService]
    })
      .compileComponents();

    fixture = TestBed.createComponent(EditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('fixParagraphWithBrAndSpace', () => {
    const testCases = [
      { input: '<p>Some text<br></p>', expected: '<p>Some text</p><br><p>&nbsp;</p>' },
      { input: '<p>Some text<br/></p>', expected: '<p>Some text</p><br/><p>&nbsp;</p>' },
      { input: '<p>Some text</p>', expected: '<p>Some text</p>' },
    ];

    testCases.forEach(({ input, expected }) => {
      it(`should transform "${input}" to "${expected}"`, () => {
        expect(component.fixParagraphWithBrAndSpace(input)).toBe(expected);
      });
    });
  });
});
