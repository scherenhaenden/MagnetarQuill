import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToolbarComponent } from './toolbar.component';
import { FormattingService } from '../../services/formatting.service';
import { ContentService } from '../../services/content.service';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

describe('ToolbarComponent', () => {
  let component: ToolbarComponent;
  let fixture: ComponentFixture<ToolbarComponent>;
  let formattingService: jasmine.SpyObj<FormattingService>;

  beforeEach(async () => {
    const formattingSpy = jasmine.createSpyObj('FormattingService', ['applyStyle', 'clearFormatting', 'toggleBold', 'toggleItalic', 'toggleUnderline', 'toggleStrikethrough', 'toggleSuperscript', 'toggleSubscript', 'toggleList', 'applyHeader', 'setTextAlign', 'saveSelection', 'restoreSelection', 'updateFormatStates', 'toggleStrong', 'setLineSpacing', 'setBackgroundColor'], {
      strongActive: () => false,
      boldActive: () => false,
      italicActive: () => false,
      underlineActive: () => false,
      strikethroughActive: () => false,
      currentFontFamily: () => '',
      currentFontSize: () => '',
      currentTextColor: () => '#000000'
    });

    await TestBed.configureTestingModule({
      imports: [ToolbarComponent],
      providers: [
        { provide: FormattingService, useValue: formattingSpy },
        ContentService
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToolbarComponent);
    component = fixture.componentInstance;
    formattingService = TestBed.inject(FormattingService) as jasmine.SpyObj<FormattingService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Focus Theft Prevention (mousedown.preventDefault)', () => {
    const buttonsToTest = [
      { selector: 'button[title="Toggle HTML View"]', name: 'Toggle HTML View' },
      { selector: 'button[title="Clear Formatting"]', name: 'Clear Formatting' },
      { selector: 'button[title="Bold"]', name: 'Bold' },
      { selector: 'button[title="Italic"]', name: 'Italic' },
      { selector: 'button[title="Underline"]', name: 'Underline' },
      { selector: 'button[title="Strikethrough"]', name: 'Strikethrough' },
      { selector: 'button[title="Align Left"]', name: 'Align Left' },
      { selector: 'button[title="Align Center"]', name: 'Align Center' },
      { selector: 'button[title="Align Right"]', name: 'Align Right' },
      { selector: 'button[title="Justify"]', name: 'Justify' },
      { selector: 'button[title="Ordered List"]', name: 'Ordered List' },
      { selector: 'button[title="Unordered List"]', name: 'Unordered List' },
      { selector: 'button[title="Superscript"]', name: 'Superscript' },
      { selector: 'button[title="Subscript"]', name: 'Subscript' }
    ];

    buttonsToTest.forEach(btn => {
      it(`should prevent default on mousedown for ${btn.name} to preserve editor focus`, () => {
        const debugElements = fixture.debugElement.queryAll(By.css(btn.selector));
        expect(debugElements.length).toBeGreaterThan(0, `Could not find button: ${btn.name}`);

        debugElements.forEach(el => {
            const event = new MouseEvent('mousedown', { cancelable: true });
            spyOn(event, 'preventDefault');
            el.nativeElement.dispatchEvent(event);
            expect(event.preventDefault).toHaveBeenCalled();
        });
      });
    });

    it('should prevent default on mousedown for "Insert Image" button', () => {
        const buttons = fixture.debugElement.queryAll(By.css('button'));
        const insertImageBtn = buttons.find(el => el.nativeElement.textContent.includes('Insert Image'));
        expect(insertImageBtn).toBeTruthy('Could not find Insert Image button');

        const event = new MouseEvent('mousedown', { cancelable: true });
        spyOn(event, 'preventDefault');
        insertImageBtn!.nativeElement.dispatchEvent(event);
        expect(event.preventDefault).toHaveBeenCalled();
    });
  });

  describe('Font Family Interaction', () => {
    it('should NOT prevent default on mousedown for Font Family select (needs focus for native dropdown)', () => {
      const selects = fixture.debugElement.queryAll(By.css('select'));
      const fontFamilySelect = selects[0]; 

      const event = new MouseEvent('mousedown', { cancelable: true });
      spyOn(event, 'preventDefault');
      
      fontFamilySelect.nativeElement.dispatchEvent(event);
      expect(event.preventDefault).not.toHaveBeenCalled();
    });

    it('should call formattingService.applyStyle when font family changes', () => {
      const selects = fixture.debugElement.queryAll(By.css('select'));
      const fontFamilySelect = selects[0];
      
      fontFamilySelect.nativeElement.value = 'Courier New';
      fontFamilySelect.nativeElement.dispatchEvent(new Event('change'));

      expect(formattingService.restoreSelection).toHaveBeenCalled();
      expect(formattingService.applyStyle).toHaveBeenCalledWith('font-family', 'Courier New');
    });
  });

  describe('Theme Interaction', () => {
    it('should call onThemeChange and emit themeChange event when theme dropdown changes', () => {
      spyOn(component.themeChange, 'emit');
      const selects = fixture.debugElement.queryAll(By.css('select'));
      const themeSelect = selects[selects.length - 1]; // Theme select is at the end

      themeSelect.nativeElement.value = 'dark';
      themeSelect.nativeElement.dispatchEvent(new Event('change'));

      expect(component.theme).toBe('dark');
      expect(component.themeChange.emit).toHaveBeenCalledWith('dark');
    });
  });
});
