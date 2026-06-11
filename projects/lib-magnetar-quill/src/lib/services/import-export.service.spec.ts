import { TestBed } from '@angular/core/testing';
import { ImportExportService } from './import-export.service';
import { LogService } from './log.service';

describe('ImportExportService', () => {
  let service: ImportExportService;
  let logServiceSpy: jasmine.SpyObj<LogService>;

  beforeEach(() => {
    const logSpy = jasmine.createSpyObj('LogService', ['warn', 'info', 'error', 'debug', 'log']);
    TestBed.configureTestingModule({
      providers: [
        ImportExportService,
        { provide: LogService, useValue: logSpy }
      ]
    });
    service = TestBed.inject(ImportExportService);
    logServiceSpy = TestBed.inject(LogService) as jasmine.SpyObj<LogService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Markdown to HTML Conversion', () => {
    it('should convert headers correctly', () => {
      expect(service.convertMarkdownToHtml('# H1 Title')).toBe('<h1>H1 Title</h1>');
      expect(service.convertMarkdownToHtml('### H3 Title')).toBe('<h3>H3 Title</h3>');
      expect(service.convertMarkdownToHtml('###### H6 Title')).toBe('<h6>H6 Title</h6>');
    });

    it('should convert inline bold, italic, and strikethrough', () => {
      expect(service.convertMarkdownToHtml('This is **bold** text.')).toBe('<p>This is <strong>bold</strong> text.</p>');
      expect(service.convertMarkdownToHtml('This is *italic* text.')).toBe('<p>This is <em>italic</em> text.</p>');
      expect(service.convertMarkdownToHtml('This is ~~strikethrough~~ text.')).toBe('<p>This is <s>strikethrough</s> text.</p>');
    });

    it('should convert lists correctly', () => {
      const mdUl = '* Item 1\n* Item 2';
      expect(service.convertMarkdownToHtml(mdUl)).toBe('<ul><li>Item 1</li><li>Item 2</li></ul>');

      const mdOl = '1. Item 1\n2. Item 2';
      expect(service.convertMarkdownToHtml(mdOl)).toBe('<ol><li>Item 1</li><li>Item 2</li></ol>');
    });

    it('should convert links and images correctly', () => {
      expect(service.convertMarkdownToHtml('[Google](https://google.com)')).toBe('<p><a href="https://google.com">Google</a></p>');
      expect(service.convertMarkdownToHtml('![Logo](logo.png)')).toBe('<p><img src="logo.png" alt="Logo" /></p>');
    });

    it('should convert blockquotes correctly', () => {
      expect(service.convertMarkdownToHtml('> Quote line')).toBe('<blockquote>Quote line</blockquote>');
    });
  });

  describe('HTML to Markdown Conversion', () => {
    it('should convert headers back to markdown', () => {
      const result = service.convertHtmlToMarkdown('<h1>H1</h1><h2>H2</h2>');
      expect(result.markdown).toBe('# H1\n\n## H2');
      expect(result.hasUnsupportedElements).toBeFalse();
    });

    it('should convert bold, italic, strikethrough back to markdown', () => {
      const result = service.convertHtmlToMarkdown('<p><strong>Bold</strong> and <em>Italic</em> and <s>Strike</s></p>');
      expect(result.markdown).toBe('**Bold** and *Italic* and ~~Strike~~');
    });

    it('should convert lists back to markdown', () => {
      const resultUl = service.convertHtmlToMarkdown('<ul><li>A</li><li>B</li></ul>');
      expect(resultUl.markdown).toBe('* A\n* B');

      const resultOl = service.convertHtmlToMarkdown('<ol><li>A</li><li>B</li></ol>');
      expect(resultOl.markdown).toBe('1. A\n2. B');
    });

    it('should convert blockquotes, links, and images back to markdown', () => {
      const result = service.convertHtmlToMarkdown('<blockquote>Quote</blockquote><p><a href="http://test.com">Link</a></p>');
      expect(result.markdown).toBe('> Quote\n\n[Link](http://test.com)');
    });

    it('should report unsupported elements and log warnings for tables and videos', () => {
      const result = service.convertHtmlToMarkdown('<table><tr><td>Cell</td></tr></table><video src="v.mp4"></video>');
      expect(result.hasUnsupportedElements).toBeTrue();
      expect(logServiceSpy.warn).toHaveBeenCalled();
      expect(result.markdown).toContain('[Table (Unsupported in Markdown)]');
      expect(result.markdown).toContain('[Video (Unsupported in Markdown)]');
    });
  });

  describe('RTF to HTML Conversion', () => {
    it('should convert plain text and paragraph breaks', () => {
      const rtf = '{\\rtf1\\ansi\\deff0 Hello\\par World}';
      expect(service.convertRtfToHtml(rtf)).toBe('<p>Hello</p><p>World</p>');
    });

    it('should parse bold, italic, underline, and strikethrough formatting', () => {
      const rtfBold = '{\\rtf1\\ansi\\deff0 This is {\\b bold} text.}';
      expect(service.convertRtfToHtml(rtfBold)).toBe('<p>This is <strong>bold</strong> text.</p>');

      const rtfItalic = '{\\rtf1\\ansi\\deff0 This is {\\i italic} text.}';
      expect(service.convertRtfToHtml(rtfItalic)).toBe('<p>This is <em>italic</em> text.</p>');

      const rtfCombined = '{\\rtf1\\ansi\\deff0 This is {\\b\\i bold italic} text.}';
      expect(service.convertRtfToHtml(rtfCombined)).toBe('<p>This is <strong><em>bold italic</em></strong> text.</p>');
    });

    it('should skip metadata groups', () => {
      const rtfWithMeta = '{\\rtf1\\ansi\\deff0{\\fonttbl{\\f0 Arial;}}{\\generator custom}Real Text}';
      expect(service.convertRtfToHtml(rtfWithMeta)).toBe('<p>Real Text</p>');
    });
  });

  describe('HTML to RTF Conversion', () => {
    it('should generate basic RTF structures with text and formatting codes', () => {
      const html = '<p><strong>Bold</strong> and <em>Italic</em></p>';
      const rtf = service.convertHtmlToRtf(html);
      expect(rtf).toContain('\\rtf1');
      expect(rtf).toContain('{\\b Bold}');
      expect(rtf).toContain('{\\i Italic}');
    });

    it('should format header tags with correct font sizing', () => {
      const html = '<h1>H1 Title</h1>';
      const rtf = service.convertHtmlToRtf(html);
      expect(rtf).toContain('\\fs36');
      expect(rtf).toContain('H1 Title');
    });
  });
});
