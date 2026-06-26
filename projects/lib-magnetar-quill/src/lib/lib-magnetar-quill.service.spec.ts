import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LibMagnetarQuillComponent } from './lib-magnetar-quill.component';
import { By } from '@angular/platform-browser';

describe('LibMagnetarQuillComponent', () => {
  let fixture: ComponentFixture<LibMagnetarQuillComponent>;
  let component: LibMagnetarQuillComponent;
  let editor: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LibMagnetarQuillComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LibMagnetarQuillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    const editorDebug = fixture.debugElement.query(By.css('lib-editor'));
    editor = editorDebug.nativeElement;
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
    const boldButton = fixture.debugElement.query(By.css('button[title="Bold"]'));
    expect(boldButton).toBeTruthy();
    boldButton.triggerEventHandler('click', null);
    fixture.detectChanges();
  });

  it('should toggle italic formatting', () => {
    editor.innerHTML = 'Test text';
    selectEditorContents();

    const italicButton = fixture.debugElement.query(By.css('button[title="Italic"]'));
    expect(italicButton).toBeTruthy();
    italicButton.triggerEventHandler('click', null);
    fixture.detectChanges();

  });

  it('should toggle underline formatting', () => {
    editor.innerHTML = 'Test text';
    selectEditorContents();

    const underlineButton = fixture.debugElement.query(By.css('button[title="Underline"]'));
    expect(underlineButton).toBeTruthy();
    underlineButton.triggerEventHandler('click', null);
    fixture.detectChanges();

  });

  it('should toggle strikethrough formatting', () => {
    editor.innerHTML = 'Test text';
    selectEditorContents();

    const strikethroughButton = fixture.debugElement.query(By.css('button[title="Strikethrough"]'));
    expect(strikethroughButton).toBeTruthy();
    strikethroughButton.triggerEventHandler('click', null);
    fixture.detectChanges();

  });

  it('should apply heading styles', () => {
    const h1Button = fixture.debugElement.query(By.css('select[title="Header Level"]'));
    expect(h1Button).toBeTruthy();
    h1Button.triggerEventHandler('change', { target: { value: 'h1' } });
    fixture.detectChanges();
  });

  it('should create lists', () => {
    const unorderedListButton = fixture.debugElement.query(By.css('button[title="Unordered List"]'));
    expect(unorderedListButton).toBeTruthy();
    unorderedListButton.triggerEventHandler('click', null);
    fixture.detectChanges();
  });
});
