import {ComponentFixture, TestBed} from '@angular/core/testing';
import { LibMagnetarQuillService } from './lib-magnetar-quill.service';
import {LibMagnetarQuillComponent} from "./lib-magnetar-quill.component";
import { By } from '@angular/platform-browser';

describe('LibMagnetarQuillComponent', () => {
  let component: LibMagnetarQuillComponent;
  let fixture: ComponentFixture<LibMagnetarQuillComponent>;
  let editor: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LibMagnetarQuillComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LibMagnetarQuillComponent);
    component = fixture.componentInstance;
    editor = fixture.nativeElement.querySelector('#editor');
    fixture.detectChanges();
  });

  // Basic Formatting Tests
  it('should toggle bold formatting', () => {
    const boldButton = fixture.debugElement.query(By.css('button[title="Bold"]'));
    boldButton.triggerEventHandler('click', null);
    fixture.detectChanges();

    const isBoldApplied = editor.classList.contains('bold') ||
      editor.querySelector('.bold') !== null;

    expect(isBoldApplied).toBe(true);
  });

  it('should toggle italic formatting', () => {
    const italicButton = fixture.debugElement.query(By.css('button[title="Italic"]'));
    italicButton.triggerEventHandler('click', null);
    fixture.detectChanges();

    const isItalicApplied = editor.classList.contains('italic') ||
      editor.querySelector('.italic') !== null;

    expect(isItalicApplied).toBe(true);
  });

  it('should toggle underline formatting', () => {
    const underlineButton = fixture.debugElement.query(By.css('button[title="Underline"]'));
    underlineButton.triggerEventHandler('click', null);
    fixture.detectChanges();

    const isUnderlineApplied = editor.classList.contains('underline') ||
      editor.querySelector('.underline') !== null;

    expect(isUnderlineApplied).toBe(true);
  });

  it('should toggle strikethrough formatting', () => {
    const strikethroughButton = fixture.debugElement.query(By.css('button[title="Strikethrough"]'));
    strikethroughButton.triggerEventHandler('click', null);
    fixture.detectChanges();

    const isStrikethroughApplied = editor.classList.contains('strikethrough') ||
      editor.querySelector('.strikethrough') !== null;

    expect(isStrikethroughApplied).toBe(true);
  });

  // Additional Formatting Tests (Adapt as needed)
  it('should apply heading styles', () => {
    // Assuming you have buttons for H1, H2, etc.
    const h1Button = fixture.debugElement.query(By.css('button[title="Heading 1"]')); // Adjust selector as needed
    h1Button.triggerEventHandler('click', null);
    fixture.detectChanges();

    const h1Element = editor.querySelector('h1');
    expect(h1Element).toBeTruthy();
  });

  it('should create lists', () => {
    const unorderedListButton = fixture.debugElement.query(By.css('button[title="Unordered List"]')); // Adjust selector
    unorderedListButton.triggerEventHandler('click', null);
    fixture.detectChanges();

    const ulElement = editor.querySelector('ul');
    expect(ulElement).toBeTruthy();
  });
/*
  it('should handle links', () => {
    // Assuming you have a way to trigger the link dialog/modal
    component.openLinkDialog(); // Or however you trigger it
    component.setLinkUrl('https://www.example.com');
    component.insertLink();
    fixture.detectChanges();

    const linkElement = editor.querySelector('a');
    expect(linkElement).toBeTruthy();
    expect(linkElement.getAttribute('href')).toBe('https://www.example.com');
  });

  // Content Manipulation Tests
  it('should insert text at the cursor position', () => {
    const initialContent = editor.innerHTML;
    const newText = 'This is new text';

    // Simulate typing or pasting (you might need to trigger specific events or use a library for this)
    editor.innerHTML = initialContent + newText;
    editor.dispatchEvent(new Event('input')); // Trigger input event to notify the component
    fixture.detectChanges();

    expect(editor.innerHTML).toContain(newText);
  });

  it('should delete selected text', () => {
    const initialContent = 'Some text to select and delete';
    editor.innerHTML = initialContent;

    // Simulate selection (again, you might need specific events or a library)
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(editor);
    selection.removeAllRanges();
    selection.addRange(range);

    // Trigger delete (e.g., by pressing the Delete key or calling a component method)
    editor.dispatchEvent(new KeyboardEvent('keydown', { key: 'Delete' }));
    fixture.detectChanges();

    expect(editor.innerHTML).toBe('');
  });

  // Other Potential Tests
  it('should handle keyboard shortcuts', () => {
    // Example: Ctrl+B for bold
    editor.dispatchEvent(new KeyboardEvent('keydown', { key: 'b', ctrlKey: true }));
    fixture.detectChanges();

    const isBoldApplied = editor.classList.contains('bold') ||
      editor.querySelector('.bold') !== null;

    expect(isBoldApplied).toBe(true);
  });

  it('should emit events on content changes', () => {
    spyOn(component.contentChange, 'emit');
    editor.innerHTML = 'New content';
    editor.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(component.contentChange.emit).toHaveBeenCalled();
  });

  it('should load initial content', () => {
    const initialContent = '<p>This is the initial content</p>';
    component.initialContent = initialContent;
    fixture.detectChanges();

    expect(editor.innerHTML).toBe(initialContent);
  });

  // ... other tests based on your component's features ...

  it('should have the editor element', () => {
    expect(editor).toBeTruthy();
  });*/
});
