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
});
