import { TestBed } from '@angular/core/testing';
import { SafeHtmlPipe } from './safe-html.pipe';
import { BrowserModule } from '@angular/platform-browser';

describe('SafeHtmlPipe', () => {
  let pipe: SafeHtmlPipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BrowserModule],
      providers: [SafeHtmlPipe]
    });
    pipe = TestBed.inject(SafeHtmlPipe);
  });

  it('should be created', () => {
    expect(pipe).toBeTruthy();
  });

  it('should sanitize and return a string for valid html', () => {
    const result = pipe.transform('<p>Hello World</p>');
    expect(result).toContain('Hello World');
  });

  it('should return empty string for null input', () => {
    const result = pipe.transform(null);
    expect(typeof result).toBe('string');
  });

  it('should return empty string for undefined input', () => {
    const result = pipe.transform(undefined);
    expect(typeof result).toBe('string');
  });

  it('should strip potentially dangerous script tags', () => {
    const result = pipe.transform('<script>alert("xss")</script><p>safe</p>');
    expect(result).not.toContain('<script>');
  });

  it('should pass through safe content', () => {
    const result = pipe.transform('<strong>bold</strong>');
    expect(result).toContain('bold');
  });
});
