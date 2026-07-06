import { TestBed } from '@angular/core/testing';
import { ContentService } from './content.service';
import { ImageInternalData } from '../models/image-internal-data';

describe('ContentService', () => {
  let service: ContentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ContentService]
    });
    service = TestBed.inject(ContentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('setEditorContent / getEditorContent', () => {
    it('should return empty string initially', () => {
      expect(service.getEditorContent()).toBe('');
    });

    it('should store and retrieve content', () => {
      service.setEditorContent('<p>Hello</p>');
      expect(service.getEditorContent()).toBe('<p>Hello</p>');
    });

    it('should update content when called multiple times', () => {
      service.setEditorContent('first');
      service.setEditorContent('second');
      expect(service.getEditorContent()).toBe('second');
    });

    it('should emit via editorContent$ observable', (done) => {
      service.editorContent$.subscribe(v => {
        if (v === '<b>test</b>') {
          done();
        }
      });
      service.setEditorContent('<b>test</b>');
    });
  });

  describe('insertImage', () => {
    it('should append image HTML to existing content', () => {
      service.setEditorContent('<p>Intro</p>');
      service.insertImage({ url: 'http://example.com/img.png', alt: 'Test', width: 100, height: 200 });
      const content = service.getEditorContent();
      expect(content).toContain('<img');
      expect(content).toContain('http://example.com/img.png');
      expect(content).toContain('alt="Test"');
      expect(content).toContain('width="100"');
      expect(content).toContain('height="200"');
    });

    it('should use empty string for alt and empty dimensions when not provided', () => {
      service.insertImage({ url: 'http://example.com/img.png' });
      const content = service.getEditorContent();
      expect(content).toContain('alt=""');
      expect(content).toContain('width=""');
      expect(content).toContain('height=""');
    });
  });

  describe('insertHtmlAtCursor', () => {
    it('should not throw when selection is null', () => {
      spyOn(window, 'getSelection').and.returnValue(null);
      expect(() => service.insertHtmlAtCursor('<b>bold</b>')).not.toThrow();
    });

    it('should not throw when rangeCount is 0', () => {
      const mockSel = jasmine.createSpyObj('Selection', ['getRangeAt']);
      Object.defineProperty(mockSel, 'rangeCount', { value: 0 });
      spyOn(window, 'getSelection').and.returnValue(mockSel as Selection);
      expect(() => service.insertHtmlAtCursor('<b>bold</b>')).not.toThrow();
    });

    it('should insert html at cursor when selection is valid', () => {
      const range = document.createRange();
      const div = document.createElement('div');
      div.contentEditable = 'true';
      div.innerHTML = '<p>text</p>';
      document.body.appendChild(div);
      range.selectNodeContents(div);

      const sel = window.getSelection()!;
      sel.removeAllRanges();
      sel.addRange(range);

      expect(() => service.insertHtmlAtCursor('<b>bold</b>')).not.toThrow();
      div.remove();
    });
  });

  describe('insertTextAtCursor', () => {
    it('should not throw when selection is null', () => {
      spyOn(window, 'getSelection').and.returnValue(null);
      expect(() => service.insertTextAtCursor('hello')).not.toThrow();
    });

    it('should not throw when rangeCount is 0', () => {
      const mockSel = jasmine.createSpyObj('Selection', ['getRangeAt', 'removeAllRanges', 'addRange']);
      Object.defineProperty(mockSel, 'rangeCount', { value: 0 });
      spyOn(window, 'getSelection').and.returnValue(mockSel as Selection);
      expect(() => service.insertTextAtCursor('hello')).not.toThrow();
    });

    it('should insert text at cursor', () => {
      const div = document.createElement('div');
      div.contentEditable = 'true';
      div.textContent = 'world';
      document.body.appendChild(div);

      const range = document.createRange();
      range.setStart(div.firstChild!, 0);
      range.collapse(true);
      const sel = window.getSelection()!;
      sel.removeAllRanges();
      sel.addRange(range);

      service.insertTextAtCursor('hello ');
      expect(div.textContent).toContain('hello');
      div.remove();
    });
  });

  describe('insertImageFromUrl', () => {
    it('should not throw when selection is null', () => {
      spyOn(window, 'getSelection').and.returnValue(null);
      const data: ImageInternalData = {
        url: 'http://img.com/a.png', alt: 'img', width: 100, height: 100,
        border: 0, hPadding: 0, vPadding: 0, alignment: 'left'
      };
      expect(() => service.insertImageFromUrl(data)).not.toThrow();
    });

    it('should not throw when rangeCount is 0', () => {
      const mockSel = jasmine.createSpyObj('Selection', ['getRangeAt']);
      Object.defineProperty(mockSel, 'rangeCount', { value: 0 });
      spyOn(window, 'getSelection').and.returnValue(mockSel as Selection);
      const data: ImageInternalData = {
        url: 'http://img.com/a.png', alt: '', width: null, height: null,
        border: 0, hPadding: 0, vPadding: 0, alignment: undefined
      };
      expect(() => service.insertImageFromUrl(data)).not.toThrow();
    });

    it('should insert image with null dimensions using auto', () => {
      const div = document.createElement('div');
      div.contentEditable = 'true';
      document.body.appendChild(div);

      const range = document.createRange();
      range.selectNodeContents(div);
      const sel = window.getSelection()!;
      sel.removeAllRanges();
      sel.addRange(range);

      const data: ImageInternalData = {
        url: 'http://img.com/a.png', alt: 'test', width: null, height: null,
        border: 2, hPadding: 5, vPadding: 10, alignment: 'center'
      };
      service.insertImageFromUrl(data);
      const img = div.querySelector('img');
      expect(img).toBeTruthy();
      expect(img!.style.width).toBe('auto');
      expect(img!.style.height).toBe('auto');
      div.remove();
    });

    it('should use provided width and height as px values', () => {
      const div = document.createElement('div');
      div.contentEditable = 'true';
      document.body.appendChild(div);

      const range = document.createRange();
      range.selectNodeContents(div);
      const sel = window.getSelection()!;
      sel.removeAllRanges();
      sel.addRange(range);

      const data: ImageInternalData = {
        url: 'http://img.com/b.png', alt: '', width: 300, height: 200,
        border: 0, hPadding: 0, vPadding: 0, alignment: undefined
      };
      service.insertImageFromUrl(data);
      const img = div.querySelector('img');
      expect(img!.style.width).toBe('300px');
      expect(img!.style.height).toBe('200px');
      div.remove();
    });
  });

  describe('getSelectedElements', () => {
    it('should return empty array when no selection', () => {
      spyOn(window, 'getSelection').and.returnValue(null);
      expect(service.getSelectedElements()).toEqual([]);
    });

    it('should return empty array when selection is collapsed', () => {
      const div = document.createElement('div');
      div.textContent = 'test';
      document.body.appendChild(div);
      const range = document.createRange();
      range.setStart(div.firstChild!, 0);
      range.collapse(true);
      const sel = window.getSelection()!;
      sel.removeAllRanges();
      sel.addRange(range);
      expect(service.getSelectedElements()).toEqual([]);
      div.remove();
    });

    it('should return P element when container is a P tag', () => {
      const p = document.createElement('p');
      p.textContent = 'paragraph';
      document.body.appendChild(p);
      const range = document.createRange();
      range.selectNodeContents(p);
      const sel = window.getSelection()!;
      sel.removeAllRanges();
      sel.addRange(range);
      const result = service.getSelectedElements();
      expect(result.length).toBeGreaterThanOrEqual(1);
      p.remove();
    });

    it('should collect P elements from non-P container', () => {
      const div = document.createElement('div');
      div.innerHTML = '<p>one</p><p>two</p>';
      document.body.appendChild(div);
      const range = document.createRange();
      range.selectNodeContents(div);
      const sel = window.getSelection()!;
      sel.removeAllRanges();
      sel.addRange(range);
      const result = service.getSelectedElements();
      expect(result.length).toBeGreaterThanOrEqual(2);
      div.remove();
    });
  });
});
