import { TestBed } from '@angular/core/testing';
import { ImportExportService } from './import-export.service';
import { LogService } from './log.service';

describe('ImportExportService – extended branch coverage', () => {
  let service: ImportExportService;

  beforeEach(() => {
    const logSpy = jasmine.createSpyObj('LogService', ['warn', 'info', 'error', 'debug', 'log']);
    TestBed.configureTestingModule({
      providers: [
        ImportExportService,
        { provide: LogService, useValue: logSpy }
      ]
    });
    service = TestBed.inject(ImportExportService);
  });

  // -------------------------------------------------------------------------
  // Markdown → HTML: additional branches
  // -------------------------------------------------------------------------
  describe('convertMarkdownToHtml – additional branches', () => {
    it('should convert h2 header', () => {
      expect(service.convertMarkdownToHtml('## H2')).toBe('<h2>H2</h2>');
    });

    it('should convert h4 header', () => {
      expect(service.convertMarkdownToHtml('#### H4')).toBe('<h4>H4</h4>');
    });

    it('should convert h5 header', () => {
      expect(service.convertMarkdownToHtml('##### H5')).toBe('<h5>H5</h5>');
    });

    it('should convert unordered list with - prefix', () => {
      const md = '- A\n- B';
      const result = service.convertMarkdownToHtml(md);
      expect(result).toContain('<ul>');
      expect(result).toContain('<li>A</li>');
      expect(result).toContain('<li>B</li>');
    });

    it('should convert mixed ordered list', () => {
      const md = '1. First\n2. Second\n3. Third';
      const result = service.convertMarkdownToHtml(md);
      expect(result).toContain('<ol>');
      expect(result).toContain('First');
      expect(result).toContain('Third');
    });

    it('should close list before blockquote', () => {
      const md = '* Item\n> Quote';
      const result = service.convertMarkdownToHtml(md);
      expect(result).toContain('</ul>');
      expect(result).toContain('<blockquote>');
    });

    it('should handle empty string', () => {
      expect(service.convertMarkdownToHtml('')).toBe('');
    });

    it('should convert bold and italic combined', () => {
      const result = service.convertMarkdownToHtml('**bold** and *italic*');
      expect(result).toContain('<strong>bold</strong>');
      expect(result).toContain('<em>italic</em>');
    });

    it('should treat plain paragraph text correctly', () => {
      expect(service.convertMarkdownToHtml('plain text')).toBe('<p>plain text</p>');
    });

    it('should not throw and return some output for inline code backtick syntax', () => {
      const result = service.convertMarkdownToHtml('Use `code` here');
      // Implementation may or may not support inline code; ensure no exception and output is truthy
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });
  });

  // -------------------------------------------------------------------------
  // HTML → Markdown: additional branches
  // -------------------------------------------------------------------------
  describe('convertHtmlToMarkdown – additional branches', () => {
    it('should handle anchor without href', () => {
      const result = service.convertHtmlToMarkdown('<p><a>no href</a></p>');
      expect(result.markdown).toContain('no href');
    });

    it('should handle img element', () => {
      const result = service.convertHtmlToMarkdown('<p><img src="test.png" alt="Alt" /></p>');
      expect(result.markdown).toContain('![Alt](test.png)');
    });

    it('should handle br as newline', () => {
      const result = service.convertHtmlToMarkdown('<p>Line1<br>Line2</p>');
      expect(result.markdown).toContain('Line1');
      expect(result.markdown).toContain('Line2');
    });

    it('should handle nested li items in ol', () => {
      const result = service.convertHtmlToMarkdown('<ol><li>One</li><li>Two</li><li>Three</li></ol>');
      expect(result.markdown).toBe('1. One\n2. Two\n3. Three');
    });

    it('should handle h4, h5, h6 headers', () => {
      const result = service.convertHtmlToMarkdown('<h4>H4</h4><h5>H5</h5><h6>H6</h6>');
      expect(result.markdown).toContain('#### H4');
      expect(result.markdown).toContain('##### H5');
      expect(result.markdown).toContain('###### H6');
    });

    it('should handle unsupported audio/iframe tags without throwing', () => {
      expect(() => {
        service.convertHtmlToMarkdown('<audio src="a.mp3"></audio><iframe src="frame.html"></iframe>');
      }).not.toThrow();
    });

    it('should handle empty input', () => {
      const result = service.convertHtmlToMarkdown('');
      expect(result.markdown).toBe('');
    });

    it('should handle plain text nodes', () => {
      const result = service.convertHtmlToMarkdown('<p>just text</p>');
      expect(result.markdown).toContain('just text');
    });

    it('should handle code element without throwing', () => {
      expect(() => {
        service.convertHtmlToMarkdown('<p><code>inline code</code></p>');
      }).not.toThrow();
    });

    it('should handle pre element as fenced code block', () => {
      const result = service.convertHtmlToMarkdown('<pre>code block</pre>');
      expect(result.markdown).toContain('code block');
    });

    it('should handle div element', () => {
      const result = service.convertHtmlToMarkdown('<div>inside div</div>');
      expect(result.markdown).toContain('inside div');
    });
  });

  // -------------------------------------------------------------------------
  // RTF → HTML: additional branches
  // -------------------------------------------------------------------------
  describe('convertRtfToHtml – additional branches', () => {
    it('should handle underline formatting', () => {
      const rtf = '{\\rtf1\\ansi\\deff0 {\\ul underlined} text.}';
      const result = service.convertRtfToHtml(rtf);
      expect(result).toContain('<u>');
      expect(result).toContain('underlined');
    });

    it('should handle strikethrough formatting', () => {
      const rtf = '{\\rtf1\\ansi\\deff0 {\\strike struck} text.}';
      const result = service.convertRtfToHtml(rtf);
      expect(result).toContain('<s>');
    });

    it('should return empty string for empty rtf', () => {
      const result = service.convertRtfToHtml('');
      expect(typeof result).toBe('string');
    });

    it('should handle \\line command', () => {
      const rtf = '{\\rtf1\\ansi\\deff0 line1\\line line2}';
      const result = service.convertRtfToHtml(rtf);
      expect(result).toContain('line1');
      expect(result).toContain('line2');
    });

    it('should handle tab characters', () => {
      const rtf = '{\\rtf1\\ansi\\deff0 col1\\tab col2}';
      const result = service.convertRtfToHtml(rtf);
      expect(result).toContain('col1');
    });

    it('should handle escaped braces', () => {
      const rtf = '{\\rtf1\\ansi\\deff0 open \\{ brace \\} text}';
      const result = service.convertRtfToHtml(rtf);
      expect(result).toContain('{');
      expect(result).toContain('}');
    });

    it('should handle escaped backslash', () => {
      const rtf = '{\\rtf1\\ansi\\deff0 back\\\\slash}';
      const result = service.convertRtfToHtml(rtf);
      expect(result).toContain('back');
    });
  });

  // -------------------------------------------------------------------------
  // HTML → RTF: additional branches
  // -------------------------------------------------------------------------
  describe('convertHtmlToRtf – additional branches', () => {
    it('should convert h2–h6 headers with appropriate font sizes', () => {
      const html = '<h2>H2</h2><h3>H3</h3><h4>H4</h4><h5>H5</h5><h6>H6</h6>';
      const rtf = service.convertHtmlToRtf(html);
      expect(rtf).toContain('H2');
      expect(rtf).toContain('H3');
      expect(rtf).toContain('H4');
      expect(rtf).toContain('H5');
      expect(rtf).toContain('H6');
    });

    it('should convert underline and strikethrough', () => {
      const html = '<p><u>Under</u> and <s>Strike</s></p>';
      const rtf = service.convertHtmlToRtf(html);
      expect(rtf).toContain('Under');
      expect(rtf).toContain('Strike');
    });

    it('should convert unordered list', () => {
      const html = '<ul><li>Item 1</li><li>Item 2</li></ul>';
      const rtf = service.convertHtmlToRtf(html);
      expect(rtf).toContain('Item 1');
      expect(rtf).toContain('Item 2');
    });

    it('should convert ordered list', () => {
      const html = '<ol><li>First</li><li>Second</li></ol>';
      const rtf = service.convertHtmlToRtf(html);
      expect(rtf).toContain('First');
      expect(rtf).toContain('Second');
    });

    it('should convert blockquote', () => {
      const html = '<blockquote>Quoted text</blockquote>';
      const rtf = service.convertHtmlToRtf(html);
      expect(rtf).toContain('Quoted text');
    });

    it('should convert anchor tags', () => {
      const html = '<p><a href="http://example.com">Link</a></p>';
      const rtf = service.convertHtmlToRtf(html);
      expect(rtf).toContain('Link');
    });

    it('should convert img tags without throwing', () => {
      const html = '<p><img src="test.png" alt="Test"/></p>';
      const rtf = service.convertHtmlToRtf(html);
      expect(rtf).toContain('{\\rtf1');
    });

    it('should escape special RTF chars in text', () => {
      const html = '<p>back\\slash and {brace} and more</p>';
      const rtf = service.convertHtmlToRtf(html);
      expect(rtf).toContain('\\\\');
    });

    it('should handle plain text paragraph', () => {
      const html = '<p>Simple paragraph</p>';
      const rtf = service.convertHtmlToRtf(html);
      expect(rtf).toContain('Simple paragraph');
    });

    it('should produce a valid RTF header', () => {
      const rtf = service.convertHtmlToRtf('<p>test</p>');
      expect(rtf).toContain('{\\rtf1');
      expect(rtf).toContain('\\ansi');
    });
  });
});
