import { TestBed } from '@angular/core/testing';
import { FormattingService } from './formatting.service';
import { ContentService } from './content.service';

describe('FormattingService', () => {
  let service: FormattingService;
  let mockContentService: jasmine.SpyObj<ContentService>;

  beforeEach(() => {
    mockContentService = jasmine.createSpyObj('ContentService', ['getSelectedElements']);
    TestBed.configureTestingModule({
      providers: [
        FormattingService,
        { provide: ContentService, useValue: mockContentService },
      ],
    });
    service = TestBed.inject(FormattingService);
  });

  describe('toggleBold', () => {
    it('should toggle the boldActive signal and apply/remove bold style', () => {
      spyOn(service, 'applyStyle');
      spyOn(service, 'removeFormatting');

      // Initially false, apply bold
      service.boldActive.set(false);
      service.toggleBold();
      expect(service.applyStyle).toHaveBeenCalledWith('font-weight', 'bold');
      expect(service.boldActive()).toBeTrue();

      // Now true, remove bold
      service.toggleBold();
      expect(service.removeFormatting).toHaveBeenCalledWith('font-weight', 'bold');
      expect(service.boldActive()).toBeFalse();
    });
  });

  describe('toggleItalic', () => {
    it('should toggle the italicActive signal and apply/remove italic style', () => {
      spyOn(service, 'applyStyle');
      spyOn(service, 'removeFormatting');

      // Initially false, apply italic
      service.italicActive.set(false);
      service.toggleItalic();
      expect(service.applyStyle).toHaveBeenCalledWith('font-style', 'italic');
      expect(service.italicActive()).toBeTrue();

      // Now true, remove italic
      service.toggleItalic();
      expect(service.removeFormatting).toHaveBeenCalledWith('font-style', 'italic');
      expect(service.italicActive()).toBeFalse();
    });
  });

  describe('toggleUnderline', () => {
    it('should toggle the underlineActive signal and apply/remove underline style', () => {
      spyOn(service, 'applyStyle');
      spyOn(service, 'removeFormatting');

      // Initially false, apply underline
      service.underlineActive.set(false);
      service.toggleUnderline();
      expect(service.applyStyle).toHaveBeenCalledWith('text-decoration', 'underline');
      expect(service.underlineActive()).toBeTrue();

      // Now true, remove underline
      service.toggleUnderline();
      expect(service.removeFormatting).toHaveBeenCalledWith('text-decoration', 'underline');
      expect(service.underlineActive()).toBeFalse();
    });
  });

  describe('toggleStrikethrough', () => {
    it('should toggle the strikethroughActive signal and apply/remove line-through style', () => {
      spyOn(service, 'applyStyle');
      spyOn(service, 'removeFormatting');

      // Initially false, apply strikethrough
      service.strikethroughActive.set(false);
      service.toggleStrikethrough();
      expect(service.applyStyle).toHaveBeenCalledWith('text-decoration', 'line-through');
      expect(service.strikethroughActive()).toBeTrue();

      // Now true, remove strikethrough
      service.toggleStrikethrough();
      expect(service.removeFormatting).toHaveBeenCalledWith('text-decoration', 'line-through');
      expect(service.strikethroughActive()).toBeFalse();
    });
  });

  describe('applyHeader', () => {
    it('should wrap the selected text with the specified header level', () => {
      const mockRange = {
        extractContents: jasmine.createSpy().and.returnValue(document.createTextNode('Sample Text')),
        insertNode: jasmine.createSpy(),
        selectNodeContents: jasmine.createSpy(), // Mock the missing method
      };

      const mockSelection = {
        rangeCount: 1,
        getRangeAt: jasmine.createSpy().and.returnValue(mockRange),
        removeAllRanges: jasmine.createSpy(),
        addRange: jasmine.createSpy(),
      };

      spyOn(window, 'getSelection').and.returnValue(mockSelection as unknown as Selection);

      service.applyHeader('h1');

      // Verify that the header element is inserted
      expect(mockRange.insertNode).toHaveBeenCalledWith(jasmine.any(HTMLElement));
      const insertedElement = mockRange.insertNode.calls.argsFor(0)[0] as HTMLElement;
      expect(insertedElement.tagName).toBe('H1');
      expect(insertedElement.textContent).toBe('Sample Text');

      // Verify selection adjustments
      expect(mockSelection.removeAllRanges).toHaveBeenCalled();
      expect(mockSelection.addRange).toHaveBeenCalled();
    });
  });

  describe('setTextAlign', () => {
    it('should set the text alignment for the selected paragraphs', () => {
      const paragraph1 = document.createElement('p');
      paragraph1.textContent = 'Paragraph 1';
      const paragraph2 = document.createElement('p');
      paragraph2.textContent = 'Paragraph 2';

      spyOn(service, 'splitRangeIntoParagraphs').and.returnValue([paragraph1, paragraph2]);

      const mockRange = {
        commonAncestorContainer: document.createElement('div'), // Needs to be HTMLElement
      } as unknown as Range;

      const mockSelection = {
        isCollapsed: false,
        rangeCount: 1,
        getRangeAt: jasmine.createSpy().and.returnValue(mockRange),
      } as unknown as Selection;

      spyOn(window, 'getSelection').and.returnValue(mockSelection);

      service.setTextAlign('center');
      expect(paragraph1.style.textAlign).toBe('center');
      expect(paragraph2.style.textAlign).toBe('center');
    });
  });

  describe('onBackgroundColorChange', () => {
    it('should change the background color of selected elements', () => {
      const mockEvent = { target: { value: '#ff0000' } } as unknown as Event;
      const element1 = document.createElement('div');
      const element2 = document.createElement('div');

      mockContentService.getSelectedElements.and.returnValue([element1, element2]);

      service.onBackgroundColorChange(mockEvent);
      // Browsers normalize colors to RGB in style properties
      // NOTE: This assertion handles both simple RGB normalization and potential exact hex match
      const color = element1.style.backgroundColor;
      const isRed = color === 'rgb(255, 0, 0)' || color === '#ff0000' || color === 'red';
      expect(isRed).toBeTrue();
    });
  });

  // New tests for clearFormatting edge-cases
  describe('clearFormatting', () => {
    it('should remove inline formatting but preserve images and block tags', () => {
      const container = document.createElement('div');
      container.contentEditable = 'true';
      container.innerHTML = '<p><span style="color:red">Hello <em>World</em></span><img src="data:," alt="x"></p>';
      document.body.appendChild(container);

      const range = document.createRange();
      range.selectNodeContents(container);
      const sel = window.getSelection()!;
      sel.removeAllRanges();
      sel.addRange(range);

      service.clearFormatting();

      // span/em should be removed (no inline tags), paragraph and image remain
      expect(container.querySelector('span')).toBeNull();
      expect(container.querySelector('em')).toBeNull();
      expect(container.querySelector('p')).not.toBeNull();
      expect(container.querySelector('img')).not.toBeNull();

      document.body.removeChild(container);
    });

    it('should preserve multiple block paragraphs and their text', () => {
      const container = document.createElement('div');
      container.contentEditable = 'true';
      container.innerHTML = '<p><strong>One</strong></p><p><i>Two</i></p>';
      document.body.appendChild(container);

      const range = document.createRange();
      // select both paragraphs
      range.setStartBefore(container.firstChild!);
      range.setEndAfter(container.lastChild!);
      const sel = window.getSelection()!;
      sel.removeAllRanges();
      sel.addRange(range);

      service.clearFormatting();

      const paragraphs = Array.from(container.querySelectorAll('p'));
      expect(paragraphs.length).toBe(2);
      expect(paragraphs[0].textContent?.trim()).toBe('One');
      expect(paragraphs[1].textContent?.trim()).toBe('Two');

      document.body.removeChild(container);
    });
  });

});
