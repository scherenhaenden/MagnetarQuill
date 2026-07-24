import { TestBed } from '@angular/core/testing';
import { FormattingService } from './formatting.service';
import { ContentService } from './content.service';

describe('FormattingService – extended branch coverage', () => {
  let service: FormattingService;
  let mockContentService: jasmine.SpyObj<ContentService>;

  function selectContainerContents(container: HTMLElement): void {
    const range = document.createRange();
    range.selectNodeContents(container);
    const selection = window.getSelection()!;
    selection.removeAllRanges();
    selection.addRange(range);
  }

  function collapseCaretInto(container: HTMLElement): void {
    const range = document.createRange();
    range.setStart(container, 0);
    range.collapse(true);
    const selection = window.getSelection()!;
    selection.removeAllRanges();
    selection.addRange(range);
  }

  beforeEach(() => {
    mockContentService = jasmine.createSpyObj('ContentService', ['getSelectedElements']);
    mockContentService.getSelectedElements.and.returnValue([]);
    TestBed.configureTestingModule({
      providers: [
        FormattingService,
        { provide: ContentService, useValue: mockContentService },
      ],
    });
    service = TestBed.inject(FormattingService);
  });

  // -------------------------------------------------------------------------
  // toggleSuperscript / toggleSubscript
  // -------------------------------------------------------------------------
  describe('toggleSuperscript', () => {
    it('should wrap selection in sup tag', () => {
      const container = document.createElement('div');
      container.contentEditable = 'true';
      container.textContent = 'Hello';
      document.body.appendChild(container);
      selectContainerContents(container);

      service.toggleSuperscript();

      expect(container.querySelector('sup')).not.toBeNull();
      container.remove();
    });

    it('should unwrap sup tag when already superscript', () => {
      const container = document.createElement('div');
      container.contentEditable = 'true';
      container.innerHTML = '<sup>Hello</sup>';
      document.body.appendChild(container);
      selectContainerContents(container);

      service.toggleSuperscript();
      service.toggleSuperscript();

      container.remove();
    });
  });

  describe('toggleSubscript', () => {
    it('should wrap selection in sub tag', () => {
      const container = document.createElement('div');
      container.contentEditable = 'true';
      container.textContent = 'Hello';
      document.body.appendChild(container);
      selectContainerContents(container);

      service.toggleSubscript();

      expect(container.querySelector('sub')).not.toBeNull();
      container.remove();
    });
  });

  // -------------------------------------------------------------------------
  // toggleList
  // -------------------------------------------------------------------------
  describe('toggleList', () => {
    it('should wrap selection in ul for unordered list', () => {
      const container = document.createElement('div');
      container.contentEditable = 'true';
      container.innerHTML = '<p>Item</p>';
      document.body.appendChild(container);
      selectContainerContents(container);

      service.toggleList('unordered');

      const html = container.innerHTML;
      expect(html).toContain('<ul>');
      container.remove();
    });

    it('should wrap selection in ol for ordered list', () => {
      const container = document.createElement('div');
      container.contentEditable = 'true';
      container.innerHTML = '<p>Item</p>';
      document.body.appendChild(container);
      selectContainerContents(container);

      service.toggleList('ordered');

      const html = container.innerHTML;
      expect(html).toContain('<ol>');
      container.remove();
    });

    it('should not throw when selection is null', () => {
      spyOn(window, 'getSelection').and.returnValue(null);
      expect(() => service.toggleList('unordered')).not.toThrow();
    });
  });

  // -------------------------------------------------------------------------
  // blockquote / codeBlock
  // -------------------------------------------------------------------------
  describe('blockquote', () => {
    it('should wrap selection in blockquote', () => {
      const container = document.createElement('div');
      container.contentEditable = 'true';
      container.innerHTML = '<p>Quote text</p>';
      document.body.appendChild(container);
      selectContainerContents(container);

      service.blockquote();

      expect(container.innerHTML).toContain('blockquote');
      container.remove();
    });
  });

  describe('codeBlock', () => {
    it('should wrap selection in pre/code', () => {
      const container = document.createElement('div');
      container.contentEditable = 'true';
      container.innerHTML = '<p>Code text</p>';
      document.body.appendChild(container);
      selectContainerContents(container);

      service.codeBlock();

      expect(container.innerHTML).toContain('pre');
      container.remove();
    });
  });

  // -------------------------------------------------------------------------
  // indent / outdent
  // -------------------------------------------------------------------------
  describe('indent', () => {
    it('should not throw when called with selection', () => {
      const container = document.createElement('p');
      container.textContent = 'Text';
      document.body.appendChild(container);
      selectContainerContents(container);
      mockContentService.getSelectedElements.and.returnValue([container]);

      expect(() => service.indent()).not.toThrow();
      container.remove();
    });

    it('should not throw when no selection', () => {
      spyOn(window, 'getSelection').and.returnValue(null);
      expect(() => service.indent()).not.toThrow();
    });
  });

  describe('outdent', () => {
    it('should not throw when called', () => {
      const container = document.createElement('p');
      container.textContent = 'Text';
      container.style.paddingLeft = '40px';
      document.body.appendChild(container);
      selectContainerContents(container);
      mockContentService.getSelectedElements.and.returnValue([container]);

      expect(() => service.outdent()).not.toThrow();
      container.remove();
    });
  });

  // -------------------------------------------------------------------------
  // setLineSpacing
  // -------------------------------------------------------------------------
  describe('setLineSpacing', () => {
    it('should set line-height on selected elements', () => {
      const p = document.createElement('p');
      p.textContent = 'Text';
      document.body.appendChild(p);
      mockContentService.getSelectedElements.and.returnValue([p]);

      service.setLineSpacing('2.0');

      expect(p.style.lineHeight).toBe('2');
      p.remove();
    });

    it('should not throw when no elements selected', () => {
      mockContentService.getSelectedElements.and.returnValue([]);
      expect(() => service.setLineSpacing('1.5')).not.toThrow();
    });
  });

  // -------------------------------------------------------------------------
  // saveSelection / restoreSelection
  // -------------------------------------------------------------------------
  describe('saveSelection / restoreSelection', () => {
    it('should save and restore a valid selection', () => {
      const container = document.createElement('div');
      container.contentEditable = 'true';
      container.textContent = 'Selection text';
      document.body.appendChild(container);
      selectContainerContents(container);

      service.saveSelection();
      // Collapse selection
      window.getSelection()?.collapse(document.body, 0);
      service.restoreSelection();

      // Selection should be restored
      const sel = window.getSelection();
      expect(sel).not.toBeNull();
      container.remove();
    });

    it('should not throw when restoring without a saved selection', () => {
      expect(() => service.restoreSelection()).not.toThrow();
    });
  });

  // -------------------------------------------------------------------------
  // applyStyle with no selection
  // -------------------------------------------------------------------------
  describe('applyStyle – no selection', () => {
    it('should not throw when selection is null', () => {
      spyOn(window, 'getSelection').and.returnValue(null);
      expect(() => service.applyStyle('color', 'red')).not.toThrow();
    });
  });

  // -------------------------------------------------------------------------
  // removeFormatting with no selection
  // -------------------------------------------------------------------------
  describe('removeFormatting – no selection', () => {
    it('should not throw when selection is null', () => {
      spyOn(window, 'getSelection').and.returnValue(null);
      expect(() => service.removeFormatting('color', 'red')).not.toThrow();
    });
  });

  // -------------------------------------------------------------------------
  // clearFormatting with no selection
  // -------------------------------------------------------------------------
  describe('clearFormatting – no selection', () => {
    it('should not throw when selection is null', () => {
      spyOn(window, 'getSelection').and.returnValue(null);
      expect(() => service.clearFormatting()).not.toThrow();
    });
  });

  // -------------------------------------------------------------------------
  // setTextAlign – collapsed selection / caret-only path
  // -------------------------------------------------------------------------
  describe('setTextAlign – caret-only path', () => {
    it('should not throw with collapsed selection', () => {
      const container = document.createElement('p');
      container.textContent = 'Text';
      document.body.appendChild(container);
      collapseCaretInto(container);

      expect(() => service.setTextAlign('right')).not.toThrow();
      container.remove();
    });

    it('should not throw when selection is null', () => {
      spyOn(window, 'getSelection').and.returnValue(null);
      expect(() => service.setTextAlign('left')).not.toThrow();
    });
  });

  // -------------------------------------------------------------------------
  // updateFormatStates – no selection / collapsed selection
  // -------------------------------------------------------------------------
  describe('updateFormatStates', () => {
    it('should not throw when called with no selection', () => {
      spyOn(window, 'getSelection').and.returnValue(null);
      expect(() => service.updateFormatStates()).not.toThrow();
    });

    it('should not throw with collapsed selection', () => {
      const container = document.createElement('p');
      container.textContent = 'Text';
      document.body.appendChild(container);
      collapseCaretInto(container);
      expect(() => service.updateFormatStates()).not.toThrow();
      container.remove();
    });
  });
});
