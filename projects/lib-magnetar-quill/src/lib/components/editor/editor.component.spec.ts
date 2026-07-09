import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditorComponent } from './editor.component';
import { FormattingService } from '../../services/formatting.service';
import { ContentService } from '../../services/content.service';
import { ImageService } from '../../services/image.service';

describe('EditorComponent', () => {
  let component: EditorComponent;
  let fixture: ComponentFixture<EditorComponent>;
  let contentService: ContentService;

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
    contentService = TestBed.inject(ContentService);
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

  it('should preserve formatting styles when rendering synced content', () => {
    contentService.setEditorContent('<p style="text-align: center;"><span style="font-weight: bold;">Bold</span></p>');

    expect(component.editorWysiwyg.nativeElement.innerHTML)
      .toContain('font-weight: bold');
    expect(component.editorWysiwyg.nativeElement.innerHTML)
      .toContain('text-align: center');
  });

  it('should remove unsafe synced content without dropping formatting styles', () => {
    contentService.setEditorContent(
      '<p onclick="alert(1)" style="text-align: right; background-image: url(javascript:alert(1));">Safe</p><script>alert(1)</script>'
    );

    const html = component.editorWysiwyg.nativeElement.innerHTML;

    expect(html).toContain('text-align: right');
    expect(html).not.toContain('onclick');
    expect(html).not.toContain('script');
    expect(html).not.toContain('javascript:');
    expect(html).not.toContain('background-image');
  });

  it('should keep safe synced links and important styles while removing unsafe attributes', () => {
    contentService.setEditorContent(
      '<a href="https://example.com" srcdoc="<p>x</p>" style="font-weight: bold !important;">Link</a>' +
      '<img src="javascript:alert(1)" alt="Unsafe">' +
      '<span style="">Empty</span>'
    );

    const html = component.editorWysiwyg.nativeElement.innerHTML;

    expect(html).toContain('href="https://example.com"');
    expect(html).toContain('font-weight: bold !important');
    expect(html).toContain('alt="Unsafe"');
    expect(html).not.toContain('srcdoc');
    expect(html).not.toContain('src="javascript:');
    expect(html).not.toContain('style=""');
  });

  it('should remove unsafe synced style expressions', () => {
    contentService.setEditorContent('<span style="width: expression(alert(1)); color: red;">Styled</span>');

    const html = component.editorWysiwyg.nativeElement.innerHTML;

    expect(html).toContain('color: red');
    expect(html).not.toContain('expression');
    expect(html).not.toContain('width');
  });

  it('should remove unsafe synced links and fully unsafe style attributes', () => {
    contentService.setEditorContent(
      '<a href="javascript:alert(1)">Unsafe link</a>' +
      '<span style="background-image: url(https://example.com/x.png);">Unsafe style</span>'
    );

    const html = component.editorWysiwyg.nativeElement.innerHTML;

    expect(html).toContain('Unsafe link');
    expect(html).toContain('Unsafe style');
    expect(html).not.toContain('href="javascript:');
    expect(html).not.toContain('background-image');
    expect(html).not.toContain('style=');
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
