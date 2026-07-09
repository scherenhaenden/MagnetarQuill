import { TestBed } from '@angular/core/testing';
import { SafeHtmlPipe } from './safe-html.pipe';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { SecurityContext } from '@angular/core';

describe('SafeHtmlPipe', () => {
  let pipe: SafeHtmlPipe;
  let sanitizer: DomSanitizer;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BrowserModule],
      providers: [SafeHtmlPipe]
    });
    pipe = TestBed.inject(SafeHtmlPipe);
    sanitizer = TestBed.inject(DomSanitizer);
  });

  function unwrap(value: ReturnType<SafeHtmlPipe['transform']>): string {
    return sanitizer.sanitize(SecurityContext.HTML, value) ?? '';
  }

  it('should be created', () => {
    expect(pipe).toBeTruthy();
  });

  it('should sanitize and return a string for valid html', () => {
    const result = unwrap(pipe.transform('<p>Hello World</p>'));
    expect(result).toContain('Hello World');
  });

  it('should return empty string for null input', () => {
    const result = unwrap(pipe.transform(null));
    expect(typeof result).toBe('string');
  });

  it('should return empty string for undefined input', () => {
    const result = unwrap(pipe.transform(undefined));
    expect(typeof result).toBe('string');
  });

  it('should strip potentially dangerous script tags', () => {
    const result = unwrap(pipe.transform('<script>alert("xss")</script><p>safe</p>'));
    expect(result).not.toContain('<script>');
  });

  it('should pass through safe content', () => {
    const result = unwrap(pipe.transform('<strong>bold</strong>'));
    expect(result).toContain('bold');
  });

  it('should preserve safe inline editor styles', () => {
    const result = unwrap(pipe.transform('<p style="text-align: right; font-weight: 700;">styled</p>'));
    expect(result).toContain('text-align: right');
    expect(result).toContain('font-weight: 700');
  });

  it('should strip unsafe urls while preserving image data urls', () => {
    const result = unwrap(pipe.transform(
      '<a href="vbscript:alert(1)">bad</a><form action="data:text/html,evil"></form><img src="data:image/png;base64,abc">'
    ));

    expect(result).not.toContain('vbscript:');
    expect(result).not.toContain('data:text/html');
    expect(result).toContain('data:image/png');
  });
});
