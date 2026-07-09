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

  function selectContainerContents(container: HTMLElement): void {
    const range = document.createRange();
    range.selectNodeContents(container);

    const selection = window.getSelection()!;
    selection.removeAllRanges();
    selection.addRange(range);
  }

  function selectText(textNode: Text, startOffset: number, endOffset: number): void {
    const range = document.createRange();
    range.setStart(textNode, startOffset);
    range.setEnd(textNode, endOffset);

    const selection = window.getSelection()!;
    selection.removeAllRanges();
    selection.addRange(range);
  }

  function expectNoStyledSpan(container: HTMLElement, styleName: string, value: string): void {
    const matchingSpan = Array.from(container.querySelectorAll('span'))
      .find(span => span.style.getPropertyValue(styleName).includes(value));

    expect(matchingSpan).toBeUndefined();
  }

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

    it('should remove bold from a previously bolded selection', () => {
      const container = document.createElement('div');
      container.contentEditable = 'true';
      container.textContent = 'Bold text';
      document.body.appendChild(container);
      selectContainerContents(container);

      service.boldActive.set(false);
      service.toggleBold();
      expect(container.querySelector('span')?.style.fontWeight).toBe('bold');

      service.toggleBold();
      expectNoStyledSpan(container, 'font-weight', 'bold');
      expect(container.textContent).toBe('Bold text');

      container.remove();
    });

    it('should remove numeric inline bold weights without treating strong as bold', () => {
      const container = document.createElement('div');
      container.contentEditable = 'true';
      container.innerHTML = '<span style="font-weight: 700;">Bold text</span>';
      document.body.appendChild(container);

      const boldText = container.querySelector('span')!.firstChild as Text;
      selectText(boldText, 0, boldText.length);

      service.updateFormatStates();
      expect(service.boldActive()).toBeTrue();
      expect(service.strongActive()).toBeFalse();

      service.toggleBold();

      expectNoStyledSpan(container, 'font-weight', '700');
      expect(container.querySelector('strong')).toBeNull();
      expect(container.textContent).toBe('Bold text');

      container.remove();
    });
  });

  describe('toggleStrong', () => {
    it('should remove strong only from the selected text inside a shared strong element', () => {
      const container = document.createElement('div');
      container.contentEditable = 'true';
      container.innerHTML = '<strong>One Two</strong>';
      document.body.appendChild(container);

      const strongText = container.querySelector('strong')!.firstChild as Text;
      selectText(strongText, 0, 3);

      service.strongActive.set(true);
      service.toggleStrong();

      expect(container.textContent).toBe('One Two');
      expect(container.innerHTML).toBe('One<strong> Two</strong>');
      expect(window.getSelection()?.toString()).toBe('One');

      container.remove();
    });

    it('should not mark bold active for text that is only strong', () => {
      const container = document.createElement('div');
      container.contentEditable = 'true';
      container.innerHTML = '<strong>Strong only</strong>';
      document.body.appendChild(container);

      const strongText = container.querySelector('strong')!.firstChild as Text;
      selectText(strongText, 0, strongText.length);

      service.updateFormatStates();

      expect(service.strongActive()).toBeTrue();
      expect(service.boldActive()).toBeFalse();

      container.remove();
    });

    it('should keep strong when removing bold from text that has both formats', () => {
      const container = document.createElement('div');
      container.contentEditable = 'true';
      container.innerHTML = '<strong><span style="font-weight: bold;">Both</span></strong>';
      document.body.appendChild(container);

      const formattedText = container.querySelector('span')!.firstChild as Text;
      selectText(formattedText, 0, formattedText.length);

      service.boldActive.set(true);
      service.toggleBold();

      expect(container.textContent).toBe('Both');
      expect(container.querySelector('strong')).not.toBeNull();
      expectNoStyledSpan(container, 'font-weight', 'bold');

      container.remove();
    });

    it('should keep inline bold when removing strong from text that has both formats', () => {
      const container = document.createElement('div');
      container.contentEditable = 'true';
      container.innerHTML = '<span style="font-weight: bold;"><strong>Both</strong></span>';
      document.body.appendChild(container);

      const formattedText = container.querySelector('strong')!.firstChild as Text;
      selectText(formattedText, 0, formattedText.length);

      service.strongActive.set(true);
      service.toggleStrong();

      expect(container.textContent).toBe('Both');
      expect(container.querySelector('strong')).toBeNull();
      expect(container.querySelector('span')?.style.fontWeight).toBe('bold');

      container.remove();
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

    it('should remove italic from a previously italicized selection', () => {
      const container = document.createElement('div');
      container.contentEditable = 'true';
      container.textContent = 'Italic text';
      document.body.appendChild(container);
      selectContainerContents(container);

      service.italicActive.set(false);
      service.toggleItalic();
      expect(container.querySelector('span')?.style.fontStyle).toBe('italic');

      service.toggleItalic();
      expectNoStyledSpan(container, 'font-style', 'italic');
      expect(container.textContent).toBe('Italic text');

      container.remove();
    });

    it('should unwrap semantic italic tags when toggling italic off', () => {
      const container = document.createElement('div');
      container.contentEditable = 'true';
      container.innerHTML = '<em>Italic text</em>';
      document.body.appendChild(container);

      const italicText = container.querySelector('em')!.firstChild as Text;
      selectText(italicText, 0, italicText.length);

      service.italicActive.set(true);
      service.toggleItalic();

      expect(container.querySelector('em')).toBeNull();
      expect(container.textContent).toBe('Italic text');

      container.remove();
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

    it('should unwrap semantic underline tags when toggling underline off', () => {
      const container = document.createElement('div');
      container.contentEditable = 'true';
      container.innerHTML = '<u>Underline text</u>';
      document.body.appendChild(container);

      const underlineText = container.querySelector('u')!.firstChild as Text;
      selectText(underlineText, 0, underlineText.length);

      service.underlineActive.set(true);
      service.toggleUnderline();

      expect(container.querySelector('u')).toBeNull();
      expect(container.textContent).toBe('Underline text');

      container.remove();
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

    it('should remove strikethrough from a previously struck selection', () => {
      const container = document.createElement('div');
      container.contentEditable = 'true';
      container.textContent = 'Strike text';
      document.body.appendChild(container);
      selectContainerContents(container);

      service.strikethroughActive.set(false);
      service.toggleStrikethrough();
      expect(container.querySelector('span')?.style.textDecoration).toContain('line-through');

      service.toggleStrikethrough();
      expectNoStyledSpan(container, 'text-decoration', 'line-through');
      expect(container.textContent).toBe('Strike text');

      container.remove();
    });

    it('should unwrap semantic strikethrough tags when toggling strikethrough off', () => {
      const container = document.createElement('div');
      container.contentEditable = 'true';
      container.innerHTML = '<del>Strike text</del>';
      document.body.appendChild(container);

      const strikeText = container.querySelector('del')!.firstChild as Text;
      selectText(strikeText, 0, strikeText.length);

      service.strikethroughActive.set(true);
      service.toggleStrikethrough();

      expect(container.querySelector('del')).toBeNull();
      expect(container.textContent).toBe('Strike text');

      container.remove();
    });
  });

  describe('applyHeader', () => {
    it('should convert the selected block to the specified header level', () => {
      const container = document.createElement('div');
      container.contentEditable = 'true';
      container.innerHTML = '<p>Sample Text</p>';
      document.body.appendChild(container);
      selectContainerContents(container.querySelector('p')!);

      service.applyHeader('h1');

      expect(container.innerHTML).toBe('<h1>Sample Text</h1>');
      expect(service.currentHeader()).toBe('h1');

      container.remove();
    });

    it('should toggle a selected matching header back to normal text', () => {
      const container = document.createElement('div');
      container.contentEditable = 'true';
      container.innerHTML = '<h1>Sample Text</h1>';
      document.body.appendChild(container);
      selectContainerContents(container.querySelector('h1')!);

      service.updateFormatStates();
      expect(service.currentHeader()).toBe('h1');

      service.applyHeader('h1');

      expect(container.innerHTML).toBe('<p>Sample Text</p>');
      expect(service.currentHeader()).toBe('');

      container.remove();
    });
  });

  describe('setTextAlign', () => {
    it('should set the text alignment for every selected live paragraph', () => {
      const container = document.createElement('div');
      container.contentEditable = 'true';
      container.innerHTML = '<p>Paragraph 1</p><p>Paragraph 2</p>';
      document.body.appendChild(container);

      const range = document.createRange();
      range.setStartBefore(container.firstElementChild!);
      range.setEndAfter(container.lastElementChild!);
      const selection = window.getSelection()!;
      selection.removeAllRanges();
      selection.addRange(range);

      service.setTextAlign('center');

      expect((container.children[0] as HTMLElement).style.textAlign).toBe('center');
      expect((container.children[1] as HTMLElement).style.textAlign).toBe('center');

      container.remove();
    });

    it('should set text alignment for the caret block when there is no range selection', () => {
      const container = document.createElement('div');
      container.contentEditable = 'true';
      container.innerHTML = '<p>Paragraph 1</p><p>Paragraph 2</p>';
      document.body.appendChild(container);

      const text = container.querySelector('p')!.firstChild as Text;
      selectText(text, 2, 2);

      service.setTextAlign('right');

      expect((container.children[0] as HTMLElement).style.textAlign).toBe('right');
      expect((container.children[1] as HTMLElement).style.textAlign).toBe('');

      container.remove();
    });
  });

  describe('setBackgroundColor', () => {
    it('should change the background color of selected elements', () => {
      const element1 = document.createElement('div');
      const element2 = document.createElement('div');

      mockContentService.getSelectedElements.and.returnValue([element1, element2]);

      service.setBackgroundColor('#ff0000');
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

      container.remove();
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

      container.remove();
    });
  });

});
