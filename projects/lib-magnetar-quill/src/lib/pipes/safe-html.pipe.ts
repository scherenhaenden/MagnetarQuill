import { Pipe, PipeTransform, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { sanitizeEditorHtml } from '../utils/editor-html-sanitizer';

/**
 * @generatedInfoDoc
 * InfoDoc: class `SafeHtmlPipe` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/pipes/safe-html.pipe.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */





@Pipe({
  name: 'safeHtml',
  standalone: true
})
export class SafeHtmlPipe implements PipeTransform {
  private readonly sanitizer = inject(DomSanitizer);

    /**
 * @generatedInfoDoc
 * InfoDoc: method `SafeHtmlPipe`.`transform()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/pipes/safe-html.pipe.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */





public transform(value: string | null | undefined): SafeHtml {
    const safeHtml = sanitizeEditorHtml(value ?? '', { preserveStyles: true });
    return this.sanitizer.bypassSecurityTrustHtml(safeHtml);
  }
}
