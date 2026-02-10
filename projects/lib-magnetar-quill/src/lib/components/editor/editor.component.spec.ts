import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditorComponent } from './editor.component'; // Adjust path if needed

describe('EditorComponent', () => {
  let component: EditorComponent;
  let fixture: ComponentFixture<EditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditorComponent] // Or your component's module
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
    // No need to declare 'method' here, it's used only within each test.

    const testCases = [
      { input: '<p>Some text<br></p>', expected: '<p>Some text</p><br><p>&nbsp;</p>' },
      { input: '<p>Some text<br/></p>', expected: '<p>Some text</p><br/><p>&nbsp;</p>' },
      { input: '<p>Some text<br   /></p>', expected: '<p>Some text</p><br   /><p>&nbsp;</p>' },
      { input: '<p class="my-class">Some text<br></p>', expected: '<p class="my-class">Some text</p><br><p>&nbsp;</p>' },
      { input: '<p>Some text</p>', expected: '<p>Some text</p>' },
      { input: '<p>Some<br>text</p>', expected: '<p>Some<br>text</p>' },
      { input: '<p>Text1<br></p><p>Text2<br></p>', expected: '<p>Text1</p><br><p>&nbsp;</p><p>Text2</p><br><p>&nbsp;</p>' },
      { input: '<p><br></p>', expected: '<p></p><br><p>&nbsp;</p>' },
    ];

    testCases.forEach(({ input, expected }) => {
      it(`should transform "${input}" to "${expected}"`, () => {
        const method = component.fixParagraphWithBrAndSpace; // Declare 'method' inside the 'it'
        expect(method(input)).toBe(expected);
      });
    });
  });

  describe('fixParagraphWithMultipleBrs', () => {
    // No need to declare 'method' here

    const testCases = [
      { input: '<p>Text1<br><br>Text2</p>', expected: '<p>Text1</p><p>Text2</p>' },
      { input: '<p>Text1<br><br/><br>Text2</p>', expected: '<p>Text1</p><p>Text2</p>' },
      { input: '<p>Text1<br /><br  />Text2</p>', expected: '<p>Text1</p><p>Text2</p>' },
      { input: '<p class="foo">Text1<br><br>Text2</p>', expected: '<p>Text1</p><p>Text2</p>' },
      { input: '<p>Text1<br><br>Text2<br><br>Text3</p>', expected: '<p>Text1</p><p>Text2</p><p>Text3</p>' },
      { input: '<p>Text1<br>Text2</p>', expected: '<p>Text1<br>Text2</p>' },
      { input: '<p>Text1<br><br>Text2</p><p>Text3<br><br>Text4</p>', expected: '<p>Text1</p><p>Text2</p><p>Text3</p><p>Text4</p>' },
      { input: '<p><br><br></p>', expected: '<p>&nbsp;</p>' },
      // { input: '<p>  Text1<br><br>Text2  </p>', expected: '<p>  Text1</p><p>Text2  </p>' },
      { input: '<p><br><br>Text1</p>', expected: '<p>&nbsp;</p><p>Text1</p>' },
      { input: '<p>Text1<br><br></p>', expected: '<p>Text1</p><p>&nbsp;</p>' },
      { input: '<p>Text1<br><br>  </p>', expected: '<p>Text1</p><p>&nbsp;</p>' },
    ];

    testCases.forEach(({ input, expected }) => {
      it(`should transform "${input}" to "${expected}"`, () => {
        const method = component.fixParagraphWithMultipleBrs; // Declare 'method' inside the 'it'
        expect(method(input)).toBe(expected);
      });
    });
  });
});
