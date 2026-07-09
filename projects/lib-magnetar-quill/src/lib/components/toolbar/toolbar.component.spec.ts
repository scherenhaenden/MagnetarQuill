import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToolbarComponent } from './toolbar.component';
import { FormattingService } from '../../services/formatting.service';
import { ContentService } from '../../services/content.service';
import { ImportExportService } from '../../services/import-export.service';
import { TableService } from '../../services/table.service';
import { By } from '@angular/platform-browser';

describe('ToolbarComponent', () => {
  type ToolbarComponentFileLoader = {
    handleFileContent(filename: string, content: string): void;
  };

  let component: ToolbarComponent;
  let fixture: ComponentFixture<ToolbarComponent>;
  let formattingService: jasmine.SpyObj<FormattingService>;
  let contentService: ContentService;

  beforeEach(async () => {
    const formattingSpy = jasmine.createSpyObj('FormattingService', ['applyStyle', 'clearFormatting', 'toggleBold', 'toggleItalic', 'toggleUnderline', 'toggleStrikethrough', 'toggleSuperscript', 'toggleSubscript', 'toggleList', 'applyHeader', 'setTextAlign', 'saveSelection', 'restoreSelection', 'updateFormatStates', 'toggleStrong', 'setLineSpacing', 'setBackgroundColor'], {
      strongActive: () => false,
      boldActive: () => false,
      italicActive: () => false,
      underlineActive: () => false,
      strikethroughActive: () => false,
      currentFontFamily: () => '',
      currentFontSize: () => '',
      currentTextColor: () => '#000000',
      currentHeader: () => ''
    });

    await TestBed.configureTestingModule({
      imports: [ToolbarComponent],
      providers: [
        { provide: FormattingService, useValue: formattingSpy },
        ContentService,
        ImportExportService
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToolbarComponent);
    component = fixture.componentInstance;
    formattingService = TestBed.inject(FormattingService) as jasmine.SpyObj<FormattingService>;
    contentService = TestBed.inject(ContentService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should publish active editor HTML after applying toolbar formatting', () => {
    const editor = document.createElement('div');
    editor.contentEditable = 'true';
    editor.innerHTML = '<p style="text-align: center;"><strong>Synced</strong></p>';
    document.body.appendChild(editor);
    spyOn(contentService, 'setEditorContent');
    spyOn(component.contentChanged, 'emit');

    const range = document.createRange();
    range.selectNodeContents(editor);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);

    component.toggleBold();

    expect(formattingService.restoreSelection).toHaveBeenCalled();
    expect(formattingService.toggleBold).toHaveBeenCalled();
    expect(contentService.setEditorContent).toHaveBeenCalledWith(editor.innerHTML);
    expect(component.contentChanged.emit).toHaveBeenCalledWith(editor.innerHTML);

    selection?.removeAllRanges();
    editor.remove();
  });

  it('should not publish toolbar content when there is no active editor selection', () => {
    window.getSelection()?.removeAllRanges();
    spyOn(contentService, 'setEditorContent');
    spyOn(component.contentChanged, 'emit');

    component.setTextAlign('justify');

    expect(formattingService.setTextAlign).toHaveBeenCalledWith('justify');
    expect(contentService.setEditorContent).not.toHaveBeenCalled();
    expect(component.contentChanged.emit).not.toHaveBeenCalled();
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

    it('should prevent default on mousedown for "Insert Table" button', () => {
        const buttons = fixture.debugElement.queryAll(By.css('button'));
        const insertTableBtn = buttons.find(el => el.nativeElement.textContent.includes('Insert Table'));
        expect(insertTableBtn).toBeTruthy('Could not find Insert Table button');

        const event = new MouseEvent('mousedown', { cancelable: true });
        spyOn(event, 'preventDefault');
        insertTableBtn!.nativeElement.dispatchEvent(event);
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

  describe('File Operations', () => {
    let importExportService: ImportExportService;
    let contentService: ContentService;

    beforeEach(() => {
      importExportService = TestBed.inject(ImportExportService);
      contentService = TestBed.inject(ContentService);
      spyOn(URL, 'createObjectURL').and.returnValue('blob:test');
      spyOn(URL, 'revokeObjectURL');
      spyOn(HTMLAnchorElement.prototype, 'click');
      spyOn(window, 'alert');
    });

    it('should trigger click on file input when triggerFileInput is called', () => {
      const mockInput = document.createElement('input');
      mockInput.type = 'file';
      spyOn(mockInput, 'click');
      component.triggerFileInput(mockInput);
      expect(mockInput.click).toHaveBeenCalled();
    });

    it('should export HTML correctly', () => {
      spyOn(contentService, 'getEditorContent').and.returnValue('<p>test html</p>');
      component.exportHtml();
      expect(contentService.getEditorContent).toHaveBeenCalled();
      expect(URL.createObjectURL).toHaveBeenCalled();
      expect(HTMLAnchorElement.prototype.click).toHaveBeenCalled();
    });

    it('should export Markdown correctly and warn if there are unsupported elements', () => {
      spyOn(contentService, 'getEditorContent').and.returnValue('<table></table>');
      spyOn(importExportService, 'convertHtmlToMarkdown').and.returnValue({
        markdown: '[Table (Unsupported in Markdown)]',
        hasUnsupportedElements: true
      });
      component.exportMarkdown();
      expect(importExportService.convertHtmlToMarkdown).toHaveBeenCalledWith('<table></table>');
      expect(window.alert).toHaveBeenCalledWith(jasmine.stringContaining('Warning'));
      expect(HTMLAnchorElement.prototype.click).toHaveBeenCalled();
    });

    it('should export RTF correctly', () => {
      spyOn(contentService, 'getEditorContent').and.returnValue('<p>test</p>');
      spyOn(importExportService, 'convertHtmlToRtf').and.returnValue('{\\rtf1 test}');
      component.exportRtf();
      expect(importExportService.convertHtmlToRtf).toHaveBeenCalledWith('<p>test</p>');
      expect(HTMLAnchorElement.prototype.click).toHaveBeenCalled();
    });

    it('should handle loaded file content based on extension', () => {
      spyOn(contentService, 'setEditorContent');
      spyOn(importExportService, 'convertMarkdownToHtml').and.returnValue('<p>md</p>');
      spyOn(importExportService, 'convertRtfToHtml').and.returnValue('<p>rtf</p>');

      // Test HTML
      (component as unknown as ToolbarComponentFileLoader).handleFileContent('test.html', '<h1>html</h1>');
      expect(contentService.setEditorContent).toHaveBeenCalledWith('<h1>html</h1>');

      // Test MD
      (component as unknown as ToolbarComponentFileLoader).handleFileContent('test.md', '# md');
      expect(importExportService.convertMarkdownToHtml).toHaveBeenCalledWith('# md');
      expect(contentService.setEditorContent).toHaveBeenCalledWith('<p>md</p>');

      // Test RTF
      (component as unknown as ToolbarComponentFileLoader).handleFileContent('test.rtf', 'rtf-data');
      expect(importExportService.convertRtfToHtml).toHaveBeenCalledWith('rtf-data');
      expect(contentService.setEditorContent).toHaveBeenCalledWith('<p>rtf</p>');

      // Test Unsupported
      (component as unknown as ToolbarComponentFileLoader).handleFileContent('test.pdf', 'pdf-data');
      expect(window.alert).toHaveBeenCalledWith(jasmine.stringContaining('Unsupported file type'));
    });

    it('should parse markdown content from editor and update it', () => {
      spyOn(contentService, 'getEditorContent').and.returnValue('<div># Header</div>');
      spyOn(importExportService, 'convertMarkdownToHtml').and.returnValue('<h1>Header</h1>');
      spyOn(contentService, 'setEditorContent');

      component.parseMarkdown();

      expect(contentService.getEditorContent).toHaveBeenCalled();
      expect(importExportService.convertMarkdownToHtml).toHaveBeenCalledWith('# Header');
      expect(contentService.setEditorContent).toHaveBeenCalledWith('<h1>Header</h1>');
    });
  });

  describe('Table Operations', () => {
    let tableService: TableService;

    beforeEach(() => {
      tableService = TestBed.inject(TableService);
    });

    it('should toggle showTableModal when clicking Insert Table button', () => {
      expect(component.showTableModal).toBeFalse();
      const buttons = fixture.debugElement.queryAll(By.css('button'));
      const insertTableBtn = buttons.find(el => el.nativeElement.textContent.includes('Insert Table'));
      insertTableBtn!.nativeElement.click();
      expect(component.showTableModal).toBeTrue();
    });

    it('should call tableService.insertTable and hide modal onTableSubmit', () => {
      spyOn(tableService, 'insertTable');
      component.showTableModal = true;
      component.onTableSubmit({ rows: 4, cols: 5 });
      expect(tableService.insertTable).toHaveBeenCalledWith(4, 5);
      expect(component.showTableModal).toBeFalse();
    });

    it('should show editing controls when active cell is not null', () => {
      const cellElement = document.createElement('td') as HTMLTableCellElement;
      tableService.activeCell.set(cellElement);
      fixture.detectChanges();

      const buttons = fixture.debugElement.queryAll(By.css('button'));
      const addRowBtn = buttons.find(el => el.nativeElement.textContent.includes('Add Row Above'));
      expect(addRowBtn).toBeTruthy('Could not find Add Row Above button when cell is active');
    });

    it('should call border change and color change handlers', () => {
      spyOn(tableService, 'setCellBorder');
      spyOn(tableService, 'setCellBackgroundColor');

      const mockEventBorder = { target: { value: 'dashed' } } as unknown as Event;
      component.onCellBorderChange(mockEventBorder);
      expect(tableService.setCellBorder).toHaveBeenCalledWith('dashed');

      const mockEventColor = { target: { value: '#ff0000' } } as unknown as Event;
      component.onCellBgColorChange(mockEventColor);
      expect(tableService.setCellBackgroundColor).toHaveBeenCalledWith('#ff0000');
    });
  });
});
