export interface EditorHtmlSanitizerOptions {
  preserveStyles?: boolean;
}

/**
 * @generatedInfoDoc
 * InfoDoc: function `sanitizeEditorHtml()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/utils/editor-html-sanitizer.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */
export function sanitizeEditorHtml(html: string, options: EditorHtmlSanitizerOptions = {}): string {
  const preserveStyles = options.preserveStyles ?? true;
  const template = document.createElement('template');
  // Parse into an inert tree so sanitized paths can inspect/remove unsafe nodes; unsanitized paste bypasses this helper.
  template.innerHTML = html;

  template.content
    .querySelectorAll('meta, script, iframe, embed, object, link, style')
    .forEach(element => { element.remove(); });

  template.content.querySelectorAll('*').forEach(element => {
    Array.from(element.attributes).forEach(attribute => {
      const name = attribute.name.toLowerCase();
      const value = attribute.value.trim().toLowerCase();

      if (name.startsWith('on') || name === 'srcdoc' || isUnsafeUrlAttribute(name, value, element)) {
        element.removeAttribute(attribute.name);
      }
    });

    if (preserveStyles) {
      sanitizeStyleAttribute(element as HTMLElement);
    } else {
      element.removeAttribute('style');
    }
  });

  return template.innerHTML;
}

/**
 * @generatedInfoDoc
 * InfoDoc: function `sanitizeStyleAttribute()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/utils/editor-html-sanitizer.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */
function sanitizeStyleAttribute(element: HTMLElement): void {
  const style = element.getAttribute('style');
  if (style === null) {
    return;
  }

  if (style.trim() === '') {
    element.removeAttribute('style');
    return;
  }

  const sanitizedDeclarations = Array.from(element.style)
    .map(propertyName => {
      const value = element.style.getPropertyValue(propertyName).trim();
      const priority = element.style.getPropertyPriority(propertyName);

      if (isUnsafeStyleValue(value)) {
        return '';
      }

      return `${propertyName}: ${value}${priority ? ` !${priority}` : ''}`;
    })
    .filter(Boolean);

  if (sanitizedDeclarations.length === 0) {
    element.removeAttribute('style');
    return;
  }

  element.setAttribute('style', `${sanitizedDeclarations.join('; ')};`);
}

/**
 * @generatedInfoDoc
 * InfoDoc: function `isUnsafeStyleValue()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/utils/editor-html-sanitizer.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */
function isUnsafeStyleValue(value: string): boolean {
  const normalizedValue = value.replace(/\s+/g, '').toLowerCase();

  return normalizedValue.includes('javascript:') ||
    normalizedValue.includes('expression(') ||
    normalizedValue.includes('url(');
}

/**
 * @generatedInfoDoc
 * InfoDoc: function `isUnsafeUrlAttribute()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/utils/editor-html-sanitizer.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */
function isUnsafeUrlAttribute(name: string, value: string, element: Element): boolean {
  if (!['href', 'src', 'action', 'formaction'].includes(name)) {
    return false;
  }

  const normalizedValue = Array.from(value)
    .filter(character => character.charCodeAt(0) > 32)
    .join('')
    .toLowerCase();

  if (normalizedValue.startsWith('javascript:') || normalizedValue.startsWith('vbscript:')) {
    return true;
  }

  const isImageDataUrl = element.tagName.toLowerCase() === 'img' &&
    normalizedValue.startsWith('data:image/');

  return normalizedValue.startsWith('data:') && !isImageDataUrl;
}
