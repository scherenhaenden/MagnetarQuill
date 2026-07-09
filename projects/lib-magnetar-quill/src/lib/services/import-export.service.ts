import { Injectable } from '@angular/core';
import { LogService } from './log.service';

export interface MarkdownExportResult {
  markdown: string;
  hasUnsupportedElements: boolean;
}

type MarkdownListType = 'ul' | 'ol';

interface MarkdownListState {
  type: MarkdownListType | null;
}

interface RtfState {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strike: boolean;
}

interface RtfRun extends RtfState {
  text: string;
  isParagraphBreak: boolean;
}

interface RtfParserState {
  index: number;
  currentState: RtfState;
  currentText: string;
  readonly runs: RtfRun[];
  readonly stateStack: RtfState[];
}

const RTF_METADATA_GROUPS = ['fonttbl', 'colortbl', 'stylesheet', 'info', 'generator', '*'];

/**
 * @generatedInfoDoc
 * InfoDoc: class `ImportExportService` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/import-export.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */







@Injectable({
  providedIn: 'root'
})
export class ImportExportService {

    /**
 * @generatedInfoDoc
 * InfoDoc: constructor for class `ImportExportService` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/import-export.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */







constructor(private readonly logService: LogService) {}

  /**
   * Converts Markdown text to HTML.
   */
    /**
 * @generatedInfoDoc
 * InfoDoc: method `ImportExportService`.`convertMarkdownToHtml()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/import-export.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */







public convertMarkdownToHtml(md: string): string {
    if (!md) return '';
    const lines = md.split(/\r?\n/);
    const listState: MarkdownListState = { type: null };

    let html = '';
    for (const line of lines) {
      html += this.renderMarkdownLine(line, listState);
    }

    html += this.closeMarkdownList(listState);
    return html;
  }

/**
 * @generatedInfoDoc
 * InfoDoc: method `ImportExportService`.`closeMarkdownList()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/import-export.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */




private closeMarkdownList(listState: MarkdownListState): string {
    if (!listState.type) {
      return '';
    }

    const closingTag = `</${listState.type}>`;
    listState.type = null;
    return closingTag;
  }

/**
 * @generatedInfoDoc
 * InfoDoc: method `ImportExportService`.`openMarkdownList()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/import-export.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */




private openMarkdownList(listState: MarkdownListState, type: MarkdownListType): string {
    if (listState.type === type) {
      return '';
    }

    const closeTag = this.closeMarkdownList(listState);
    listState.type = type;
    return `${closeTag}<${type}>`;
  }

/**
 * @generatedInfoDoc
 * InfoDoc: method `ImportExportService`.`renderMarkdownLine()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/import-export.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */




private renderMarkdownLine(line: string, listState: MarkdownListState): string {
    const trimmed = line.trim();
    if (!trimmed) {
      return this.closeMarkdownList(listState);
    }

    const headerMatch = line.match(/^(#{1,6})\s+(.*)$/);
    if (headerMatch) {
      const level = headerMatch[1].length;
      return `${this.closeMarkdownList(listState)}<h${level}>${this.parseInlineMarkdown(headerMatch[2])}</h${level}>`;
    }

    const ulMatch = line.match(/^([*+-])\s+(.*)$/);
    if (ulMatch) {
      return `${this.openMarkdownList(listState, 'ul')}<li>${this.parseInlineMarkdown(ulMatch[2])}</li>`;
    }

    const olMatch = line.match(/^(\d+)\.\s+(.*)$/);
    if (olMatch) {
      return `${this.openMarkdownList(listState, 'ol')}<li>${this.parseInlineMarkdown(olMatch[2])}</li>`;
    }

    const quoteMatch = line.match(/^>\s+(.*)$/);
    if (quoteMatch) {
      return `${this.closeMarkdownList(listState)}<blockquote>${this.parseInlineMarkdown(quoteMatch[1])}</blockquote>`;
    }

    return `${this.closeMarkdownList(listState)}<p>${this.parseInlineMarkdown(line)}</p>`;
  }

  /**
   * Helper to parse inline markdown elements.
   */
    /**
 * @generatedInfoDoc
 * InfoDoc: method `ImportExportService`.`parseInlineMarkdown()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/import-export.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */







private parseInlineMarkdown(text: string): string {
    let escaped = this.escapeHtml(text);

    // Bold: **text** or __text__
    escaped = escaped.replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>');
    escaped = escaped.replace(/__([^_\n]+)__/g, '<strong>$1</strong>');

    // Italic: *text* or _text_
    escaped = escaped.replace(/\*([^*\n]+)\*/g, '<em>$1</em>');
    escaped = escaped.replace(/_([^_\n]+)_/g, '<em>$1</em>');

    // Strikethrough: ~~text~~
    escaped = escaped.replace(/~~([^~\n]+)~~/g, '<s>$1</s>');

    // Images: ![alt](url)
    escaped = escaped.replace(/!\[([^\]\n]*)]\(([^)\n]*)\)/g, '<img src="$2" alt="$1" />');

    // Links: [text](url)
    escaped = escaped.replace(/\[([^\]\n]+)]\(([^)\n]+)\)/g, '<a href="$2">$1</a>');

    return escaped;
  }

  /**
   * Converts HTML content to Markdown.
   */
    /**
 * @generatedInfoDoc
 * InfoDoc: method `ImportExportService`.`convertHtmlToMarkdown()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/import-export.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */







public convertHtmlToMarkdown(html: string): MarkdownExportResult {
    if (!html) return { markdown: '', hasUnsupportedElements: false };

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const hasTables = doc.body.querySelector('table') !== null;
    const hasVideos = doc.body.querySelector('video') !== null;

    if (hasTables || hasVideos) {
      this.logService.warn('HTML to Markdown: Tables or videos are present. Markdown conversion may lose fidelity.');
    }

    let markdown = '';
    for (let c = 0; c < doc.body.childNodes.length; c++) {
      markdown += this.convertHtmlNodeToMarkdown(doc.body.childNodes[c]);
    }

    markdown = markdown.replace(/\n{3,}/g, '\n\n').trim();

    return {
      markdown,
      hasUnsupportedElements: hasTables || hasVideos
    };
  }

/**
 * @generatedInfoDoc
 * InfoDoc: method `ImportExportService`.`convertHtmlNodeToMarkdown()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/import-export.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */




private convertHtmlNodeToMarkdown(node: Node): string {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent || '';
    }

    if (node.nodeType !== Node.ELEMENT_NODE) {
      return '';
    }

    const el = node as HTMLElement;
    const content = Array.from(el.childNodes)
      .map(child => this.convertHtmlNodeToMarkdown(child))
      .join('');

    return this.renderMarkdownElement(el, content);
  }

/**
 * @generatedInfoDoc
 * InfoDoc: method `ImportExportService`.`renderMarkdownElement()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/import-export.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */




private renderMarkdownElement(el: HTMLElement, content: string): string {
    switch (el.tagName.toLowerCase()) {
      case 'strong':
      case 'b':
        return `**${content}**`;
      case 'em':
      case 'i':
        return `*${content}*`;
      case 'u':
        return `<u>${content}</u>`;
      case 's':
      case 'del':
      case 'strike':
        return `~~${content}~~`;
      case 'h1':
        return `# ${content}\n\n`;
      case 'h2':
        return `## ${content}\n\n`;
      case 'h3':
        return `### ${content}\n\n`;
      case 'h4':
        return `#### ${content}\n\n`;
      case 'h5':
        return `##### ${content}\n\n`;
      case 'h6':
        return `###### ${content}\n\n`;
      case 'p':
        return `${content}\n\n`;
      case 'br':
        return `\n`;
      case 'ul':
      case 'ol':
        return `${content}\n`;
      case 'li':
        return this.renderMarkdownListItem(el, content);
      case 'blockquote':
        return `> ${content}\n\n`;
      case 'a':
        return `[${content}](${el.getAttribute('href') || ''})`;
      case 'img':
        return `![${el.getAttribute('alt') || ''}](${el.getAttribute('src') || ''})`;
      case 'table':
        return `\n[Table (Unsupported in Markdown)]\n\n`;
      case 'video':
        return `\n[Video (Unsupported in Markdown)]\n\n`;
      default:
        return content;
    }
  }

/**
 * @generatedInfoDoc
 * InfoDoc: method `ImportExportService`.`renderMarkdownListItem()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/import-export.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */




private renderMarkdownListItem(el: HTMLElement, content: string): string {
    const parent = el.parentElement;
    if (parent?.tagName.toLowerCase() === 'ol') {
      const index = Array.from(parent.children).indexOf(el) + 1;
      return `${index}. ${content}\n`;
    }

    return `* ${content}\n`;
  }

  /**
   * Converts RTF content to HTML.
   */
    /**
 * @generatedInfoDoc
 * InfoDoc: method `ImportExportService`.`convertRtfToHtml()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/import-export.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */







public convertRtfToHtml(rtf: string): string {
    if (!rtf) return '';

    const len = rtf.length;
    const state: RtfParserState = {
      index: 0,
      currentState: { bold: false, italic: false, underline: false, strike: false },
      currentText: '',
      runs: [],
      stateStack: []
    };

    while (state.index < len) {
      this.consumeRtfToken(rtf, state);
    }

    this.commitRtfText(state);
    return this.renderRtfRuns(state.runs);
  }

/**
 * @generatedInfoDoc
 * InfoDoc: method `ImportExportService`.`consumeRtfToken()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/import-export.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */




private consumeRtfToken(rtf: string, state: RtfParserState): void {
    const char = rtf[state.index];

    if (char === '{') {
      this.consumeRtfGroupStart(rtf, state);
      return;
    }
    if (char === '}') {
      this.consumeRtfGroupEnd(state);
      return;
    }
    if (char === '\\') {
      this.consumeRtfControlSequence(rtf, state);
      return;
    }

    this.consumeRtfPlainText(char, state);
  }

/**
 * @generatedInfoDoc
 * InfoDoc: method `ImportExportService`.`consumeRtfGroupStart()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/import-export.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */




private consumeRtfGroupStart(rtf: string, state: RtfParserState): void {
    if (this.skipRtfMetadataGroup(rtf, state)) {
      return;
    }

    this.commitRtfText(state);
    state.stateStack.push({ ...state.currentState });
    state.index++;
  }

/**
 * @generatedInfoDoc
 * InfoDoc: method `ImportExportService`.`consumeRtfGroupEnd()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/import-export.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */




private consumeRtfGroupEnd(state: RtfParserState): void {
    this.commitRtfText(state);
    state.currentState = state.stateStack.pop() ?? state.currentState;
    state.index++;
  }

/**
 * @generatedInfoDoc
 * InfoDoc: method `ImportExportService`.`skipRtfMetadataGroup()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/import-export.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */




private skipRtfMetadataGroup(rtf: string, state: RtfParserState): boolean {
    const len = rtf.length;
    let wordStart = state.index + 1;
    while (wordStart < len && rtf[wordStart] === ' ') {
      wordStart++;
    }

    if (rtf[wordStart] !== '\\') {
      return false;
    }

    let wordEnd = wordStart + 1;
    while (wordEnd < len && /[a-z0-9*]/i.test(rtf[wordEnd])) {
      wordEnd++;
    }

    const word = rtf.slice(wordStart + 1, wordEnd);
    if (!RTF_METADATA_GROUPS.includes(word) && !word.startsWith('*')) {
      return false;
    }

    state.index = this.findRtfGroupEnd(rtf, wordEnd);
    return true;
  }

/**
 * @generatedInfoDoc
 * InfoDoc: method `ImportExportService`.`findRtfGroupEnd()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/import-export.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */




private findRtfGroupEnd(rtf: string, index: number): number {
    let braceCount = 1;
    let cursor = index;

    while (cursor < rtf.length && braceCount > 0) {
      if (rtf[cursor] === '{') {
        braceCount++;
      } else if (rtf[cursor] === '}') {
        braceCount--;
      }
      cursor++;
    }

    return cursor;
  }

/**
 * @generatedInfoDoc
 * InfoDoc: method `ImportExportService`.`consumeRtfControlSequence()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/import-export.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */




private consumeRtfControlSequence(rtf: string, state: RtfParserState): void {
    state.index++;
    if (state.index >= rtf.length) {
      return;
    }

    if (this.consumeEscapedRtfCharacter(rtf, state)) {
      return;
    }

    const word = this.readRtfControlWord(rtf, state);
    const param = this.readRtfControlParameter(rtf, state);
    this.consumeRtfControlTrailingSpace(rtf, state);
    this.applyRtfControlWord(word, param, state);
  }

/**
 * @generatedInfoDoc
 * InfoDoc: method `ImportExportService`.`consumeEscapedRtfCharacter()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/import-export.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */




private consumeEscapedRtfCharacter(rtf: string, state: RtfParserState): boolean {
    if (!['\\', '{', '}'].includes(rtf[state.index])) {
      return false;
    }

    state.currentText += rtf[state.index];
    state.index++;
    return true;
  }

/**
 * @generatedInfoDoc
 * InfoDoc: method `ImportExportService`.`readRtfControlWord()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/import-export.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */




private readRtfControlWord(rtf: string, state: RtfParserState): string {
    const start = state.index;
    while (state.index < rtf.length && /[a-z*]/i.test(rtf[state.index])) {
      state.index++;
    }

    return rtf.slice(start, state.index);
  }

/**
 * @generatedInfoDoc
 * InfoDoc: method `ImportExportService`.`readRtfControlParameter()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/import-export.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */




private readRtfControlParameter(rtf: string, state: RtfParserState): number | null {
    const sign = this.readRtfParameterSign(rtf, state);
    const start = state.index;
    while (state.index < rtf.length && /[0-9]/.test(rtf[state.index])) {
      state.index++;
    }

    const value = rtf.slice(start, state.index);
    return value ? Number.parseInt(value, 10) * sign : null;
  }

/**
 * @generatedInfoDoc
 * InfoDoc: method `ImportExportService`.`readRtfParameterSign()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/import-export.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */




private readRtfParameterSign(rtf: string, state: RtfParserState): number {
    if (rtf[state.index] !== '-') {
      return 1;
    }

    state.index++;
    return -1;
  }

/**
 * @generatedInfoDoc
 * InfoDoc: method `ImportExportService`.`consumeRtfControlTrailingSpace()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/import-export.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */




private consumeRtfControlTrailingSpace(rtf: string, state: RtfParserState): void {
    if (rtf[state.index] === ' ') {
      state.index++;
    }
  }

/**
 * @generatedInfoDoc
 * InfoDoc: method `ImportExportService`.`applyRtfControlWord()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/import-export.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */




private applyRtfControlWord(word: string, param: number | null, state: RtfParserState): void {
    if (word === 'par' || word === 'line') {
      this.addRtfParagraphBreak(state);
      return;
    }

    const stateKey = this.getRtfStateKey(word);
    if (!stateKey) {
      return;
    }

    this.commitRtfText(state);
    state.currentState[stateKey] = word === 'ulnone' ? false : param !== 0;
  }

/**
 * @generatedInfoDoc
 * InfoDoc: method `ImportExportService`.`getRtfStateKey()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/import-export.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */




private getRtfStateKey(word: string): keyof RtfState | null {
    switch (word) {
      case 'b':
        return 'bold';
      case 'i':
        return 'italic';
      case 'ul':
      case 'ulnone':
        return 'underline';
      case 'strike':
        return 'strike';
      default:
        return null;
    }
  }

/**
 * @generatedInfoDoc
 * InfoDoc: method `ImportExportService`.`addRtfParagraphBreak()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/import-export.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */




private addRtfParagraphBreak(state: RtfParserState): void {
    this.commitRtfText(state);
    state.runs.push({
      text: '',
      bold: false,
      italic: false,
      underline: false,
      strike: false,
      isParagraphBreak: true
    });
  }

/**
 * @generatedInfoDoc
 * InfoDoc: method `ImportExportService`.`consumeRtfPlainText()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/import-export.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */




private consumeRtfPlainText(char: string, state: RtfParserState): void {
    if (char !== '\r' && char !== '\n') {
      state.currentText += char;
    }
    state.index++;
  }

/**
 * @generatedInfoDoc
 * InfoDoc: method `ImportExportService`.`commitRtfText()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/import-export.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */




private commitRtfText(state: RtfParserState): void {
    if (!state.currentText) {
      return;
    }

    state.runs.push({
      text: state.currentText,
      bold: state.currentState.bold,
      italic: state.currentState.italic,
      underline: state.currentState.underline,
      strike: state.currentState.strike,
      isParagraphBreak: false
    });
    state.currentText = '';
  }

/**
 * @generatedInfoDoc
 * InfoDoc: method `ImportExportService`.`renderRtfRuns()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/import-export.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */




private renderRtfRuns(runs: RtfRun[]): string {
    let htmlResult = '<p>';
    for (const run of runs) {
      htmlResult += this.renderRtfRun(run);
    }

    htmlResult += '</p>';
    return htmlResult.replace(/<p>\s*<\/p>/g, '');
  }

/**
 * @generatedInfoDoc
 * InfoDoc: method `ImportExportService`.`renderRtfRun()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/import-export.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */




private renderRtfRun(run: RtfRun): string {
    if (run.isParagraphBreak) {
      return '</p><p>';
    }

    let runHtml = this.escapeHtml(run.text);
    if (run.italic) runHtml = `<em>${runHtml}</em>`;
    if (run.bold) runHtml = `<strong>${runHtml}</strong>`;
    if (run.underline) runHtml = `<u>${runHtml}</u>`;
    if (run.strike) runHtml = `<s>${runHtml}</s>`;
    return runHtml;
  }

  /**
   * Converts HTML content to RTF format.
   */
    /**
 * @generatedInfoDoc
 * InfoDoc: method `ImportExportService`.`convertHtmlToRtf()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/import-export.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */







public convertHtmlToRtf(html: string): string {
    if (!html) return '{\\rtf1\\ansi\\deff0\n{\\fonttbl{\\f0\\fnil\\fcharset0 Arial;}}\n\\viewkind4\\uc1\\pard\\lang1033\\f0\\fs24\n\\par\n}';

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    let bodyRtf = '';

    const traverse = (node: Node): string => {
      if (node.nodeType === Node.TEXT_NODE) {
        return this.escapeRtf(node.textContent || '');
      }

      if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as HTMLElement;
        let content = '';
        for (let c = 0; c < el.childNodes.length; c++) {
          content += traverse(el.childNodes[c]);
        }

        const tag = el.tagName.toLowerCase();
        switch (tag) {
          case 'strong':
          case 'b':
            return `{\\b ${content}}`;
          case 'em':
          case 'i':
            return `{\\i ${content}}`;
          case 'u':
            return `{\\ul ${content}}`;
          case 's':
          case 'del':
          case 'strike':
            return `{\\strike ${content}}`;
          case 'p':
            return `\\pard ${content}\\par\n`;
          case 'br':
            return `\\line\n`;
          case 'h1':
            return `{\\b\\fs36 \\pard ${content}}\\par\n`;
          case 'h2':
            return `{\\b\\fs32 \\pard ${content}}\\par\n`;
          case 'h3':
            return `{\\b\\fs28 \\pard ${content}}\\par\n`;
          case 'h4':
          case 'h5':
          case 'h6':
            return `{\\b\\fs24 \\pard ${content}}\\par\n`;
          case 'ul':
          case 'ol':
            return content;
          case 'li':
            return `\\bullet  ${content}\\par\n`;
          default:
            return content;
        }
      }
      return '';
    };

    for (let c = 0; c < doc.body.childNodes.length; c++) {
      bodyRtf += traverse(doc.body.childNodes[c]);
    }

    return `{\\rtf1\\ansi\\deff0\n{\\fonttbl{\\f0\\fnil\\fcharset0 Arial;}}\n\\viewkind4\\uc1\\pard\\lang1033\\f0\\fs24\n${bodyRtf}\n}`;
  }

    /**
 * @generatedInfoDoc
 * InfoDoc: method `ImportExportService`.`escapeHtml()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/import-export.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */







private escapeHtml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

    /**
 * @generatedInfoDoc
 * InfoDoc: method `ImportExportService`.`escapeRtf()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/import-export.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */







private escapeRtf(text: string): string {
    return text
      .replace(/\\/g, '\\\\')
      .replace(/{/g, '\\{')
      .replace(/}/g, '\\}')
      .replace(/\n/g, ' ');
  }
}
