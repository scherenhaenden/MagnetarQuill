import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LibMagnetarQuillComponent } from './lib-magnetar-quill.component';
import { By } from '@angular/platform-browser';

describe('LibMagnetarQuillComponent', () => {
  let fixture: ComponentFixture<LibMagnetarQuillComponent>;
  let editor: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LibMagnetarQuillComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LibMagnetarQuillComponent);
    fixture.detectChanges();
    editor = fixture.nativeElement.querySelector('div.editor');
  });

  function selectEditorContents(): void {
    const range = document.createRange();
    range.selectNodeContents(editor);
    const selection = window.getSelection()!;
    selection.removeAllRanges();
    selection.addRange(range);
  }

  // Basic Formatting Tests
  it('should toggle bold formatting', () => {
    editor.innerHTML = 'Test text';
    selectEditorContents();

    const boldButton = fixture.debugElement.queryAll(By.css('button[title="Bold"]'))[1];
    boldButton.triggerEventHandler('click', null);
    fixture.detectChanges();

    const span = editor.querySelector('span');
    expect(span?.style.fontWeight).toBe('bold');
  });

  it('should toggle italic formatting', () => {
    editor.innerHTML = 'Test text';
    selectEditorContents();

    const italicButton = fixture.debugElement.query(By.css('button[title="Italic"]'));
    italicButton.triggerEventHandler('click', null);
    fixture.detectChanges();

    const span = editor.querySelector('span');
    expect(span?.style.fontStyle).toBe('italic');
  });

  it('should toggle underline formatting', () => {
    editor.innerHTML = 'Test text';
    selectEditorContents();

    const underlineButton = fixture.debugElement.query(By.css('button[title="Underline"]'));
    underlineButton.triggerEventHandler('click', null);
    fixture.detectChanges();

    const span = editor.querySelector('span');
    expect(span?.style.textDecoration).toBe('underline');
  });

  it('should toggle strikethrough formatting', () => {
    editor.innerHTML = 'Test text';
    selectEditorContents();

    const strikethroughButton = fixture.debugElement.query(By.css('button[title="Strikethrough"]'));
    strikethroughButton.triggerEventHandler('click', null);
    fixture.detectChanges();

    const span = editor.querySelector('span');
    expect(span?.style.textDecoration).toBe('line-through');
  });

  it('should apply heading styles', () => {
    editor.innerHTML = 'Test text';
    selectEditorContents();

    const selectEl = fixture.debugElement.query(By.css('select[title="Header Level"]'));
    selectEl.nativeElement.value = 'h1';
    selectEl.nativeElement.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    const h1Element = editor.querySelector('h1');
    expect(h1Element).toBeTruthy();
  });

  it('should create lists', () => {
    editor.innerHTML = '<div>Test text</div>';
    const range = document.createRange();
    range.selectNodeContents(editor.firstChild!);
    const selection = window.getSelection()!;
    selection.removeAllRanges();
    selection.addRange(range);

    const unorderedListButton = fixture.debugElement.query(By.css('button[title="Unordered List"]'));
    unorderedListButton.triggerEventHandler('click', null);
    fixture.detectChanges();

    const ulElement = editor.querySelector('ul');
    expect(ulElement).toBeTruthy();
  });
});
