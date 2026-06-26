import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditorComponent } from './editor.component';
import { FormattingService } from '../../services/formatting.service';
import { ContentService } from '../../services/content.service';
import { ImageService } from '../../services/image.service';

describe('EditorComponent', () => {
  let component: EditorComponent;
  let fixture: ComponentFixture<EditorComponent>;

  function placeCaretAtEnd(): void {
    const editor = component.editorWysiwyg.nativeElement;
    const range = document.createRange();
    range.selectNodeContents(editor);
    range.collapse(false);

    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
  }

  function pasteEvent(html: string, text: string): ClipboardEvent {
    return {
      preventDefault: jasmine.createSpy('preventDefault'),
      clipboardData: {
        items: { length: 0 },
        getData: (type: string): string => {
          if (type === 'text/html') {
            return html;
          }

          if (type === 'text/plain') {
            return text;
          }

          return '';
        }
      }
    } as unknown as ClipboardEvent;
  }

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

  it('should emit contentChanged after pasting HTML', () => {
    component.editorWysiwyg.nativeElement.innerHTML = '<p>Before</p>';
    placeCaretAtEnd();
    spyOn(component.contentChanged, 'emit');

    component.onPaste(pasteEvent('<strong> pasted</strong>', 'pasted'));

    expect(component.contentChanged.emit).toHaveBeenCalled();
    expect(component.contentChanged.emit).toHaveBeenCalledWith(jasmine.stringMatching(/pasted/));
  });

  it('should emit contentChanged after pasting plain text', () => {
    component.editorWysiwyg.nativeElement.innerHTML = 'Before';
    placeCaretAtEnd();
    spyOn(component.contentChanged, 'emit');

    component.onPaste(pasteEvent('', ' pasted'));

    expect(component.contentChanged.emit).toHaveBeenCalledWith(jasmine.stringMatching(/Before pasted/));
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
