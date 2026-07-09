import {Injectable, signal, WritableSignal} from '@angular/core';
import {ContentService} from "./content.service";

type RemovableStyleKey = `${string}:${string}`;

const SEMANTIC_STYLE_TAGS = new Map<RemovableStyleKey, ReadonlySet<string>>([
  ['font-style:italic', new Set(['em', 'i'])],
  ['text-decoration:underline', new Set(['u'])],
  ['text-decoration:line-through', new Set(['s', 'del', 'strike'])]
]);

/**
 * @generatedInfoDoc
 * InfoDoc: class `FormattingService` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/formatting.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */











@Injectable()
export class FormattingService {

  // Signals to track formatting states
  public boldActive = signal(false);
  public italicActive = signal(false);
  public underlineActive = signal(false);
  public strikethroughActive = signal(false);
  public strongActive = signal(false);
  public currentFontFamily = signal('');
  public currentFontSize = signal('');
  public currentTextColor = signal('#000000');
  public currentHeader = signal('');

  private lastActiveRange: Range | null = null;
    /**
 * @generatedInfoDoc
 * InfoDoc: constructor for class `FormattingService` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/formatting.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */











constructor(private readonly contentService: ContentService) { }


  /**
   * Saves the current window selection as the last active range.
   * This is called by the editor on selectionchange, mouseup, or keyup.
   */
    /**
 * @generatedInfoDoc
 * InfoDoc: method `FormattingService`.`saveSelection()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/formatting.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */











public saveSelection(): void {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      this.lastActiveRange = selection.getRangeAt(0).cloneRange();
    }
  }

  /**
   * Restores the last saved selection to the window.
   */
    /**
 * @generatedInfoDoc
 * InfoDoc: method `FormattingService`.`restoreSelection()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/formatting.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */











public restoreSelection(): void {
    if (this.lastActiveRange) {
      const selection = window.getSelection();
      if (selection) {
        try {
          selection.removeAllRanges();
          selection.addRange(this.lastActiveRange);
        } catch {
          this.lastActiveRange = null;
        }
      }
    }
  }

    /**
 * @generatedInfoDoc
 * InfoDoc: method `FormattingService`.`setActiveRange()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/formatting.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */











private setActiveRange(range: Range): void {
    this.lastActiveRange = range.cloneRange();
    const selection = window.getSelection();
    if (selection) {
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }

  /**
   * Gets the active range, either from the current window selection or the saved state.
   */
    /**
 * @generatedInfoDoc
 * InfoDoc: method `FormattingService`.`getActiveRange()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/formatting.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */











private getActiveRange(): Range | null {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      return selection.getRangeAt(0);
    }
    return this.lastActiveRange;
  }


  // Method to update formatting states based on the current selection
  /**
   * Updates the formatting states (bold, italic, underline, strikethrough, strong)
   * based on the current text selection in the document.
   *
   * It uses computed styles for accuracy across CSS classes and inherited styles.
   */
    /**
 * @generatedInfoDoc
 * InfoDoc: method `FormattingService`.`updateFormatStates()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/formatting.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */











public updateFormatStates(): void {
    this.saveSelection();
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      return;
    }

    const range = selection.getRangeAt(0);
    const currentNode = selection.focusNode ?? range.commonAncestorContainer;
    const formatStates = this.collectFormatStates(currentNode);

    this.boldActive.set(formatStates.isBold);
    this.italicActive.set(formatStates.isItalic);
    this.underlineActive.set(formatStates.isUnderline);
    this.strikethroughActive.set(formatStates.isStrikethrough);
    this.strongActive.set(formatStates.isStrong);

    this.currentFontFamily.set(this.getSelectedFontFamily(range, selection.focusNode));
    this.currentFontSize.set(this.getSelectedFontSize(range, selection.focusNode));
    this.currentTextColor.set(this.getSelectedTextColor(range, selection.focusNode));
    this.currentHeader.set(this.getSelectedHeaderTag(range, selection.focusNode));
  }

/**
 * @generatedInfoDoc
 * InfoDoc: method `FormattingService`.`collectFormatStates()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/formatting.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */











private collectFormatStates(startNode: Node | null): {
    isBold: boolean;
    isItalic: boolean;
    isUnderline: boolean;
    isStrikethrough: boolean;
    isStrong: boolean;
  } {
    const formatStates = {
      isBold: false,
      isItalic: false,
      isUnderline: false,
      isStrikethrough: false,
      isStrong: false
    };

    let currentNode = startNode;
    while (currentNode) {
      if (currentNode.nodeType === Node.ELEMENT_NODE) {
        const shouldStop = this.mergeElementFormatStates(currentNode as HTMLElement, formatStates);
        if (shouldStop) {
          break;
        }
      }
      currentNode = currentNode.parentNode;
    }
    return formatStates;
  }

/**
 * @generatedInfoDoc
 * InfoDoc: method `FormattingService`.`mergeElementFormatStates()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/formatting.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */











private mergeElementFormatStates(
    element: HTMLElement,
    formatStates: {
      isBold: boolean;
      isItalic: boolean;
      isUnderline: boolean;
      isStrikethrough: boolean;
      isStrong: boolean;
    }
  ): boolean {
    const style = window.getComputedStyle(element);
    const inlineFontWeight = element.style.getPropertyValue('font-weight');

    formatStates.isBold ||= inlineFontWeight === 'bold' || Number.parseInt(inlineFontWeight, 10) >= 700;
    formatStates.isItalic ||= style.fontStyle === 'italic';
    formatStates.isUnderline ||= style.textDecorationLine.includes('underline');
    formatStates.isStrikethrough ||= style.textDecorationLine.includes('line-through');
    formatStates.isStrong ||= element.tagName.toLowerCase() === 'strong';

    return element.contentEditable === 'true';
  }
    /**
 * @generatedInfoDoc
 * InfoDoc: method `FormattingService`.`getSelectedFontFamily()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/formatting.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */











private getSelectedFontFamily(range: Range, fallbackNode: Node | null): string {
    if (range.collapsed) {
      return this.getFontFamilyFromNode(fallbackNode);
    }

    const families = new Set<string>();
    const root = range.commonAncestorContainer;
    const walker = document.createTreeWalker(
      root,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: (node: Node): number => {
          if (!range.intersectsNode(node) || !node.textContent?.trim()) {
            return NodeFilter.FILTER_SKIP;
          }
          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );

    let current = walker.nextNode();
    while (current) {
      const family = this.getFontFamilyFromNode(current);
      if (family) {
        families.add(family);
        if (families.size > 1) {
          return '';
        }
      }
      current = walker.nextNode();
    }

    if (families.size === 1) {
      return [...families][0];
    }

    return this.getFontFamilyFromNode(fallbackNode);
  }

    /**
 * @generatedInfoDoc
 * InfoDoc: method `FormattingService`.`getFontFamilyFromNode()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/formatting.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */











private getFontFamilyFromNode(node: Node | null): string {
    let current: Node | null = node;
    while (current && current.nodeType !== Node.ELEMENT_NODE) {
      current = current.parentNode;
    }

    if (!(current instanceof Element)) {
      return '';
    }

    const computedFamily = window.getComputedStyle(current).fontFamily;
    const firstFamily = computedFamily.split(',')[0]?.trim() ?? '';
    return firstFamily.replace(/^['"]|['"]$/g, '');
  }

    /**
 * @generatedInfoDoc
 * InfoDoc: method `FormattingService`.`getSelectedFontSize()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/formatting.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */











private getSelectedFontSize(range: Range, fallbackNode: Node | null): string {
    if (range.collapsed) {
      return this.getFontSizeFromNode(fallbackNode);
    }

    const sizes = new Set<string>();
    const root = range.commonAncestorContainer;
    const walker = document.createTreeWalker(
      root,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: (node: Node): number => {
          if (!range.intersectsNode(node) || !node.textContent?.trim()) {
            return NodeFilter.FILTER_SKIP;
          }
          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );

    let current = walker.nextNode();
    while (current) {
      const size = this.getFontSizeFromNode(current);
      if (size) {
        sizes.add(size);
        if (sizes.size > 1) {
          return '';
        }
      }
      current = walker.nextNode();
    }

    if (sizes.size === 1) {
      return [...sizes][0];
    }

    return this.getFontSizeFromNode(fallbackNode);
  }

    /**
 * @generatedInfoDoc
 * InfoDoc: method `FormattingService`.`getFontSizeFromNode()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/formatting.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */











private getFontSizeFromNode(node: Node | null): string {
    let current: Node | null = node;
    while (current && current.nodeType !== Node.ELEMENT_NODE) {
      current = current.parentNode;
    }

    if (!(current instanceof Element)) {
      return '';
    }

    return window.getComputedStyle(current).fontSize.trim();
  }

    /**
 * @generatedInfoDoc
 * InfoDoc: method `FormattingService`.`getSelectedTextColor()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/formatting.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */











private getSelectedTextColor(range: Range, fallbackNode: Node | null): string {
    if (range.collapsed) {
      return this.getTextColorFromNode(fallbackNode);
    }

    const colors = new Set<string>();
    const root = range.commonAncestorContainer;
    const walker = document.createTreeWalker(
      root,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: (node: Node): number => {
          if (!range.intersectsNode(node) || !node.textContent?.trim()) {
            return NodeFilter.FILTER_SKIP;
          }
          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );

    let current = walker.nextNode();
    while (current) {
      const color = this.getTextColorFromNode(current);
      if (color) {
        colors.add(color);
        if (colors.size > 1) {
          return '#000000';
        }
      }
      current = walker.nextNode();
    }

    if (colors.size === 1) {
      return [...colors][0];
    }

    return this.getTextColorFromNode(fallbackNode);
  }

    /**
 * @generatedInfoDoc
 * InfoDoc: method `FormattingService`.`getTextColorFromNode()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/formatting.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */











private getTextColorFromNode(node: Node | null): string {
    let current: Node | null = node;
    while (current && current.nodeType !== Node.ELEMENT_NODE) {
      current = current.parentNode;
    }

    if (!(current instanceof Element)) {
      return '#000000';
    }

    return this.normalizeColorValue(window.getComputedStyle(current).color);
  }

    /**
 * @generatedInfoDoc
 * InfoDoc: method `FormattingService`.`normalizeColorValue()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/formatting.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */











private normalizeColorValue(value: string): string {
    const rgbMatch = value.match(/\d+(\.\d+)?/g);
    if (!rgbMatch || rgbMatch.length < 3) {
      return '#000000';
    }

    const [r, g, b] = rgbMatch.slice(0, 3).map(channel => {
      const intValue = Math.max(0, Math.min(255, Math.round(Number(channel))));
      return intValue.toString(16).padStart(2, '0');
    });

    return `#${r}${g}${b}`;
  }



  // General toggle function to apply or remove styles based on current active state
  /**
   * Toggles the application of a specified style based on the current state of an active signal.
   * If the signal is active, the specified style is removed; otherwise, the style is applied.
   *
   * @param {WritableSignal<boolean>} activeSignal - A writable signal that indicates whether the style is currently active.
   * @param {string} styleName - The name of the style to be applied or removed.
   * @param {string} value - The value associated with the style to be applied or removed.
   * @returns {void} This function does not return a value.
   *
   * @example
   * const signal = createWritableSignal(false);
   * toggler(signal, 'highlight', 'red');
   * // If signal is false, 'highlight' style with value 'red' will be applied.
   *
   * @throws {Error} Throws an error if the activeSignal is not a WritableSignal.
   */
    /**
 * @generatedInfoDoc
 * InfoDoc: method `FormattingService`.`toggler()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/formatting.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */











private toggler(activeSignal: WritableSignal<boolean>, styleName: string, value: string): void {
    if (activeSignal()) {
      this.removeFormatting(styleName, value);
      activeSignal.set(false)
    } else {
      this.applyStyle(styleName, value);
      activeSignal.set(true)
    }
  }




    /**
 * @generatedInfoDoc
 * InfoDoc: method `FormattingService`.`toggleBold()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/formatting.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */











public toggleBold(): void {
    this.toggler(this.boldActive, 'font-weight', 'bold');
  }

  /**
   * Toggles the strong formatting of the currently selected text in the document.
   * If the selected text is already wrapped in a <strong> element, it unwraps it.
   * Otherwise, it wraps the selected text in a new <strong> element.
   *
   * This method modifies the DOM directly and updates the selection to reflect
   * the changes made. It also updates the internal state to indicate whether
   * the strong formatting is currently active.
   *
   * @throws {Error} Throws an error if the selection cannot be determined or if
   *                 there is an issue with modifying the DOM.
   *
   * @returns {void} This method does not return a value.
   *
   * @example
   * // Assuming there is a text selection in the document,
   * // calling toggleStrong will either wrap it in <strong> or unwrap it.
   * toggleStrong();
   */
    /**
 * @generatedInfoDoc
 * InfoDoc: method `FormattingService`.`toggleStrong()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/formatting.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */











public toggleStrong(): void {
    const selection = window.getSelection();
    const range = this.getActiveRange();
    if (!selection || !range) {
      return;
    }

    const strongElement = this.findSelectedStrongElement(range);

    if (strongElement) {
      this.unwrapStrongSelection(range, selection, strongElement);
      this.strongActive.set(false);
      return;
    }

    this.wrapSelectionInStrong(range, selection);
    this.strongActive.set(true);
  }

/**
 * @generatedInfoDoc
 * InfoDoc: method `FormattingService`.`findSelectedStrongElement()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/formatting.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */











private findSelectedStrongElement(range: Range): HTMLElement | null {
    return this.findStrongAncestor(range.commonAncestorContainer) ??
      this.findStrongAncestor(range.startContainer) ??
      this.findStrongAncestor(range.endContainer);
  }

/**
 * @generatedInfoDoc
 * InfoDoc: method `FormattingService`.`findStrongAncestor()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/formatting.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */











private findStrongAncestor(node: Node | null): HTMLElement | null {
    let currentElement: Node | null = node;
    while (currentElement && currentElement.nodeType !== Node.ELEMENT_NODE) {
      currentElement = currentElement.parentNode;
    }

    while (currentElement instanceof HTMLElement) {
      if (currentElement.tagName.toLowerCase() === 'strong') {
        return currentElement;
      }
      currentElement = currentElement.parentElement;
    }

    return null;
  }

/**
 * @generatedInfoDoc
 * InfoDoc: method `FormattingService`.`unwrapStrongSelection()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/formatting.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */











private unwrapStrongSelection(range: Range, selection: Selection, strongElement: HTMLElement): void {
    const beforeFragment = this.cloneStrongSide(range, strongElement, 'before');
    const selectedFragment = range.cloneContents();
    const afterFragment = this.cloneStrongSide(range, strongElement, 'after');
    const unwrappedNodes = Array.from(selectedFragment.childNodes);
    const parent = strongElement.parentNode;

    if (!parent) {
      return;
    }

    this.insertStrongSide(beforeFragment, strongElement);
    strongElement.before(selectedFragment);
    this.insertStrongSide(afterFragment, strongElement);
    strongElement.remove();
    this.restoreSelectionRange(selection, unwrappedNodes);
  }

/**
 * @generatedInfoDoc
 * InfoDoc: method `FormattingService`.`cloneStrongSide()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/formatting.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */











private cloneStrongSide(range: Range, strongElement: HTMLElement, side: 'before' | 'after'): DocumentFragment {
    const sideRange = document.createRange();
    if (side === 'before') {
      sideRange.setStart(strongElement, 0);
      sideRange.setEnd(range.startContainer, range.startOffset);
      return sideRange.cloneContents();
    }

    sideRange.setStart(range.endContainer, range.endOffset);
    sideRange.setEnd(strongElement, strongElement.childNodes.length);
    return sideRange.cloneContents();
  }

/**
 * @generatedInfoDoc
 * InfoDoc: method `FormattingService`.`insertStrongSide()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/formatting.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */











private insertStrongSide(fragment: DocumentFragment, strongElement: HTMLElement): void {
    if (!fragment.textContent) {
      return;
    }

    const sideStrongElement = strongElement.cloneNode(false) as HTMLElement;
    sideStrongElement.appendChild(fragment);
    strongElement.before(sideStrongElement);
  }

/**
 * @generatedInfoDoc
 * InfoDoc: method `FormattingService`.`restoreSelectionRange()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/formatting.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */











private restoreSelectionRange(selection: Selection, nodes: Node[]): void {
    const connectedNodes = nodes.filter(node => node.isConnected);
    if (connectedNodes.length === 0) {
      return;
    }

    const newRange = document.createRange();
    newRange.setStartBefore(connectedNodes[0]);
    newRange.setEndAfter(connectedNodes[connectedNodes.length - 1]);
    selection.removeAllRanges();
    selection.addRange(newRange);
  }

/**
 * @generatedInfoDoc
 * InfoDoc: method `FormattingService`.`wrapSelectionInStrong()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/formatting.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */











private wrapSelectionInStrong(range: Range, selection: Selection): void {
    const strongElement = document.createElement('strong');
    strongElement.appendChild(range.extractContents());
    range.insertNode(strongElement);

    selection.removeAllRanges();
    const newRange = document.createRange();
    newRange.selectNodeContents(strongElement);
    selection.addRange(newRange);
  }




  /**
   * Toggles the italic styling for the text.
   * This method activates or deactivates the italic font style based on the current state of the italicActive property.
   * It utilizes a toggler function to apply the necessary CSS style changes.
   *
   * @returns {void} This method does not return a value.
   *
   * @example
   * // Assuming italicActive is true, calling toggleItalic will deactivate italic styling.
   * toggleItalic();
   *
   * @throws {Error} Throws an error if the toggler function is not defined or fails to execute.
   */
    /**
 * @generatedInfoDoc
 * InfoDoc: method `FormattingService`.`toggleItalic()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/formatting.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */











public toggleItalic(): void {
    this.toggler(this.italicActive, 'font-style', 'italic');
  }

    /**
 * @generatedInfoDoc
 * InfoDoc: method `FormattingService`.`toggleUnderline()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/formatting.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */











public toggleUnderline(): void {
    this.toggler(this.underlineActive, 'text-decoration', 'underline');
  }

    /**
 * @generatedInfoDoc
 * InfoDoc: method `FormattingService`.`toggleStrikethrough()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/formatting.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */











public toggleStrikethrough(): void {
    this.toggler(this.strikethroughActive, 'text-decoration', 'line-through');
  }

  // Toggle list type (ordered or unordered)
    /**
 * @generatedInfoDoc
 * InfoDoc: method `FormattingService`.`toggleList()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/formatting.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */











public toggleList(type: 'ordered' | 'unordered'): void {
    const range = this.getActiveRange();
    if (!range) {
      return;
    }

    const listTag = type === 'ordered' ? 'ol' : 'ul';
    const list = document.createElement(listTag);

    // Wrap selected content in list items
    const fragment = range.extractContents();
    const items = Array.from(fragment.childNodes);
    items.forEach(node => {
      const listItem = document.createElement('li');
      listItem.appendChild(node);
      list.appendChild(listItem);
    });

    range.insertNode(list);
    this.saveSelection();
  }

  // Apply a header level (H1-H6) or paragraph to the selected text
    /**
 * @generatedInfoDoc
 * InfoDoc: method `FormattingService`.`applyHeader()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/formatting.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */











public applyHeader(headerLevel: string): void {
    const range = this.getActiveRange();
    if (!range) {
      return;
    }

    const headerTag = this.normalizeHeaderTag(headerLevel);
    const blocks = this.getSelectedTargetBlocks(range);
    if (blocks.length === 0) {
      this.wrapSelectionInHeader(range, headerTag);
      this.currentHeader.set(headerTag === 'p' ? '' : headerTag);
      return;
    }

    const nextTag = headerTag !== 'p' && blocks.every(block => block.tagName.toLowerCase() === headerTag)
      ? 'p'
      : headerTag;
    const convertedBlocks = blocks.map(block => this.replaceBlockTag(block, nextTag));

    const newRange = document.createRange();
    newRange.setStartBefore(convertedBlocks[0]);
    newRange.setEndAfter(convertedBlocks[convertedBlocks.length - 1]);
    this.setActiveRange(newRange);
    this.currentHeader.set(nextTag === 'p' ? '' : nextTag);
  }

    /**
 * @generatedInfoDoc
 * InfoDoc: method `FormattingService`.`applyStyle()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/formatting.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */











public applyStyle(styleName: string, value: string): void {
    const range = this.getActiveRange();
    if (range) {
      const selectedText = range.extractContents();
      const span = document.createElement('span');
      span.style.setProperty(styleName, value);
      span.appendChild(selectedText);
      range.insertNode(span);

      // Re-anchor selection to the inserted span so follow-up toolbar actions
      // keep targeting the same content instead of a stale pre-wrap range.
      const newRange = document.createRange();
      newRange.selectNodeContents(span);
      this.setActiveRange(newRange);
    }
  }

    /**
 * @generatedInfoDoc
 * InfoDoc: method `FormattingService`.`styleMatches()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/formatting.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */











private styleMatches(element: HTMLElement, styleName: string, value: string): boolean {
    const inlineValue = element.style.getPropertyValue(styleName);

    if (inlineValue) {
      if (styleName === 'font-weight') {
        return inlineValue === value || Number.parseInt(inlineValue, 10) >= 700;
      }

      return styleName === 'text-decoration'
        ? inlineValue.includes(value)
        : inlineValue === value;
    }

    if (styleName === 'font-weight') {
      return false;
    }

    const computed = window.getComputedStyle(element);
    if (styleName === 'text-decoration') {
      return computed.textDecorationLine.includes(value);
    }

    return computed.getPropertyValue(styleName) === value;
  }

    /**
 * @generatedInfoDoc
 * InfoDoc: method `FormattingService`.`removeStyleFromElement()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/formatting.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */











private removeStyleFromElement(element: HTMLElement, styleName: string, value: string): Node[] {
    const tagName = element.tagName.toLowerCase();
    const removableTags = SEMANTIC_STYLE_TAGS.get(`${styleName}:${value}`);
    if (removableTags?.has(tagName)) {
      return this.unwrap(element);
    }

    if (styleName === 'text-decoration') {
      const currentDecoration = element.style.getPropertyValue(styleName);
      const remainingDecoration = currentDecoration
        .split(/\s+/)
        .filter(part => part && part !== value)
        .join(' ');

      if (remainingDecoration) {
        element.style.setProperty(styleName, remainingDecoration);
      } else {
        element.style.removeProperty(styleName);
      }
    } else {
      element.style.removeProperty(styleName);
    }

    if (element.tagName === 'SPAN' && element.attributes.length === 1 && !element.getAttribute('style')) {
      return this.unwrap(element);
    }

    return [element];
  }

    /**
 * @generatedInfoDoc
 * InfoDoc: method `FormattingService`.`collectMatchingStyleElements()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/formatting.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */











private collectMatchingStyleElements(range: Range, styleName: string, value: string): HTMLElement[] {
    const matches = new Set<HTMLElement>();
    const commonAncestor = range.commonAncestorContainer.nodeType === Node.ELEMENT_NODE
      ? range.commonAncestorContainer as HTMLElement
      : range.commonAncestorContainer.parentElement;

    const collectAncestors = (node: Node | null): void => {
      let current: Node | null = node?.nodeType === Node.ELEMENT_NODE ? node : node?.parentNode ?? null;

      while (current instanceof HTMLElement) {
        if (this.styleMatches(current, styleName, value)) {
          matches.add(current);
        }

        if (current === commonAncestor || current.contentEditable === 'true') {
          break;
        }

        current = current.parentElement;
      }
    };

    collectAncestors(range.startContainer);
    collectAncestors(range.endContainer);

    if (commonAncestor instanceof HTMLElement) {
      if (this.styleMatches(commonAncestor, styleName, value)) {
        matches.add(commonAncestor);
      }

      const walker = document.createTreeWalker(commonAncestor, NodeFilter.SHOW_ELEMENT, {
        acceptNode: (node: Node): number => {
          if (!(node instanceof HTMLElement) || !range.intersectsNode(node)) {
            return NodeFilter.FILTER_SKIP;
          }

          return this.styleMatches(node, styleName, value)
            ? NodeFilter.FILTER_ACCEPT
            : NodeFilter.FILTER_SKIP;
        }
      });

      let current = walker.nextNode();
      while (current) {
        matches.add(current as HTMLElement);
        current = walker.nextNode();
      }
    }

    return Array.from(matches);
  }

  private static readonly BLOCK_TAGS = new Set([
    'P','DIV','LI','OL','UL','SECTION','ARTICLE','BLOCKQUOTE','PRE',
    'H1','H2','H3','H4','H5','H6'
  ]);

  // typescript
// projects/lib-magnetar-quill/src/lib/services/formatting.service.ts
// TypeScript

private static readonly VOID_TAGS = new Set([
  'BR','IMG','HR','INPUT','SOURCE','VIDEO','AREA','BASE','COL','EMBED','LINK','META','PARAM','TRACK','WBR'
]);

/**
 * @generatedInfoDoc
 * InfoDoc: method `FormattingService`.`clearFormatting()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/formatting.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */











public clearFormatting(): void {
  const range = this.getActiveRange();
  if (!range || range.collapsed) {
    return;
  }

  const fragment = range.cloneContents();

  // Build a temporary container element to generate HTML
  const cleanedContainer = document.createElement('div');
  Array.from(fragment.childNodes).forEach(node => {
    const stripped = this.stripFormattingNode(node);
    // stripFormattingNode may return a DocumentFragment or Node
    cleanedContainer.appendChild(stripped);
  });

  // If nothing to insert, bail out
  if (!cleanedContainer.hasChildNodes()) {
    return;
  }

  const html = cleanedContainer.innerHTML || '';

  // Try to insert the change via execCommand (Browser manages Undo/Selection)
  let success: boolean;
  try {
    success = document.execCommand('insertHTML', false, html);
  } catch {
    success = false;
  }

  if (success) {
    // Browser handled replacement; nothing more to do.
    return;
  }

  // Fallback: insert nodes via DOM (preserve structure, restore selection)
  // Move prepared children into a fragment to insert
  const insertFragment = document.createDocumentFragment();
  while (cleanedContainer.firstChild) {
    insertFragment.appendChild(cleanedContainer.firstChild);
  }

  const nodesToInsert = Array.from(insertFragment.childNodes) as Node[];
  if (nodesToInsert.length === 0) {
    return;
  }

  // Replace selection with the prepared fragment
  range.deleteContents();
  range.insertNode(insertFragment);

  this.saveSelection();
}


/**
 * @generatedInfoDoc
 * InfoDoc: method `FormattingService`.`stripFormattingNode()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/formatting.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */











private stripFormattingNode(node: Node): Node {
  if (node.nodeType === Node.TEXT_NODE) {
    return document.createTextNode(node.textContent || '');
  }

  if (node.nodeType !== Node.ELEMENT_NODE) {
    return document.createTextNode('');
  }

  const element = node as HTMLElement;
  const tag = element.tagName.toUpperCase();

  if (FormattingService.BLOCK_TAGS.has(tag)) {
    return this.createStrippedBlockElement(element, tag);
  }

  if (FormattingService.VOID_TAGS.has(tag)) {
    return this.createStrippedVoidElement(element, tag);
  }

  return this.createStrippedInlineFragment(element);
  }

/**
 * @generatedInfoDoc
 * InfoDoc: method `FormattingService`.`createStrippedBlockElement()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/formatting.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */











private createStrippedBlockElement(element: HTMLElement, tag: string): HTMLElement {
    const strippedElement = document.createElement(tag.toLowerCase());
    Array.from(element.childNodes).forEach(child => {
      strippedElement.appendChild(this.stripFormattingNode(child));
    });
    return strippedElement;
  }

/**
 * @generatedInfoDoc
 * InfoDoc: method `FormattingService`.`createStrippedVoidElement()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/formatting.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */











private createStrippedVoidElement(element: HTMLElement, tag: string): HTMLElement {
    const strippedElement = document.createElement(tag.toLowerCase());
    if (tag === 'IMG' && element instanceof HTMLImageElement) {
      this.copyImageAttribute(element, strippedElement, 'src');
      this.copyImageAttribute(element, strippedElement, 'alt');
    }
    return strippedElement;
  }

/**
 * @generatedInfoDoc
 * InfoDoc: method `FormattingService`.`copyImageAttribute()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/formatting.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */











private copyImageAttribute(source: HTMLImageElement, target: HTMLElement, attributeName: string): void {
    const attributeValue = source.getAttribute(attributeName);
    if (attributeValue) {
      target.setAttribute(attributeName, attributeValue);
    }
  }

/**
 * @generatedInfoDoc
 * InfoDoc: method `FormattingService`.`createStrippedInlineFragment()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/formatting.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */











private createStrippedInlineFragment(element: HTMLElement): DocumentFragment {
    const fragment = document.createDocumentFragment();
    Array.from(element.childNodes).forEach(child => {
      fragment.appendChild(this.stripFormattingNode(child));
    });
    return fragment;
  }



    /**
 * @generatedInfoDoc
 * InfoDoc: method `FormattingService`.`applyStyleV2()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/formatting.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */











public applyStyleV2(styleName: string, value: string): void {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const fragment = range.cloneContents();
    const nodes = Array.from(fragment.childNodes);

    nodes.forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as HTMLElement;
        (element.style as unknown as Record<string, string>)[styleName] = value;
      } else {
        const span = document.createElement('span');
        (span.style as unknown as Record<string, string>)[styleName] = value;
        span.textContent = node.textContent;
        fragment.replaceChild(span, node);
      }
    });

    range.deleteContents();
    range.insertNode(fragment);
  }



    /**
 * @generatedInfoDoc
 * InfoDoc: method `FormattingService`.`unwrap()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/formatting.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */











private unwrap(element: HTMLElement): Node[] {
    const parent = element.parentNode;
    const unwrappedNodes: Node[] = [];
    if (!parent) {
      return unwrappedNodes;
    }

    while (element.firstChild) {
      const child = element.firstChild;
      unwrappedNodes.push(child);
      element.before(child);
    }
    element.remove();
    return unwrappedNodes;
  }

    /**
 * @generatedInfoDoc
 * InfoDoc: method `FormattingService`.`toggleSuperscript()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/formatting.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */











public toggleSuperscript(): void {
    this.wrapSelectionWithTag('sup');
  }

    /**
 * @generatedInfoDoc
 * InfoDoc: method `FormattingService`.`toggleSubscript()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/formatting.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */











public toggleSubscript(): void {
    this.wrapSelectionWithTag('sub');
  }

    /**
 * @generatedInfoDoc
 * InfoDoc: method `FormattingService`.`wrapSelectionWithTag()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/formatting.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */











public wrapSelectionWithTag(tagName: string): void {
    const range = this.getActiveRange();
    if (range) {
      const selectedText = range.extractContents();
      const parentNode = range.commonAncestorContainer.parentElement;
      if (parentNode && parentNode.tagName.toLowerCase() === tagName) {
        const children = Array.from(parentNode.childNodes);
        parentNode.replaceWith(...children);
      } else {
        const wrapper = document.createElement(tagName);
        wrapper.appendChild(selectedText);
        range.insertNode(wrapper);
        this.saveSelection();
      }
    }
  }


  /**
   * Removes the specified formatting from the selected text in the document.
   * This method searches for all `<span>` elements within the current selection
   * and unwraps those that have a specific style property set to a given value.
   *
   * @param {string} styleName - The name of the CSS style property to check against.
   * @param {string} value - The value of the CSS style property that should be removed.
   *
   * @returns {void} This method does not return a value.
   *
   * @throws {Error} Throws an error if the selection is invalid or if there are issues
   *                 accessing the document's selection.
   *
   * @example
   * // Example usage:
   * removeFormatting('color', 'red');
   * // This will remove all spans with red text color from the current selection.
   */
    /**
 * @generatedInfoDoc
 * InfoDoc: method `FormattingService`.`removeFormatting()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/formatting.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */











public removeFormatting(styleName: string, value: string): void {
    const selection = window.getSelection();
    const range = this.getActiveRange();
    if (!selection || !range) {
      return;
    }

    const elements = this.collectMatchingStyleElements(range, styleName, value);
    const affectedNodes = elements.flatMap(element => this.removeStyleFromElement(element, styleName, value))
      .filter(node => node.isConnected);

    if (affectedNodes.length > 0) {
      const newRange = document.createRange();
      newRange.setStartBefore(affectedNodes[0]);
      newRange.setEndAfter(affectedNodes[affectedNodes.length - 1]);
      this.setActiveRange(newRange);
    }
  }

    /**
 * @generatedInfoDoc
 * InfoDoc: method `FormattingService`.`setTextAlign()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/formatting.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */











public setTextAlign(alignment: string): void {
    const range = this.getActiveRange();
    if (!range) {
      console.warn('No valid selection found.');
      return;
    }

    const blocks = this.getSelectedTargetBlocks(range);
    blocks.forEach(block => {
      block.style.setProperty('text-align', alignment);
    });
    this.saveSelection();
  }

/**
 * @generatedInfoDoc
 * InfoDoc: method `FormattingService`.`findRangeParentParagraph()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/formatting.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */











private findRangeParentParagraph(range: Range): HTMLElement | null {
    const container = this.normalizeContainerElement(range.commonAncestorContainer);
    return container ? this.findParentParagraph(container) : null;
  }

/**
 * @generatedInfoDoc
 * InfoDoc: method `FormattingService`.`normalizeContainerElement()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/formatting.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */











private normalizeContainerElement(container: Node): HTMLElement | null {
    if (container instanceof HTMLElement) {
      return container;
    }

    return container.parentElement;
  }

    /**
 * @generatedInfoDoc
 * InfoDoc: method `FormattingService`.`splitRangeIntoParagraphs()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/formatting.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */











public splitRangeIntoParagraphs(range: Range): HTMLElement[] {
    const fragment = range.cloneContents();
    const paragraphs: HTMLElement[] = [];

    fragment.childNodes.forEach((node) => {
      if (node instanceof HTMLElement && node.tagName === 'P') {
        paragraphs.push(node);
      } else if (node.nodeType === Node.TEXT_NODE) {
        // Wrap standalone text in a <p> for consistency
        const wrapper = document.createElement('p');
        wrapper.textContent = node.textContent?.trim() || '';
        paragraphs.push(wrapper);
      }
    });

    return paragraphs;
  }


    /**
 * @generatedInfoDoc
 * InfoDoc: method `FormattingService`.`findParentParagraph()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/formatting.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */











public findParentParagraph(element: HTMLElement): HTMLElement | null {
    while (element && element.tagName !== 'P') {
      element = element.parentElement as HTMLElement;
    }
    return element?.tagName === 'P' ? element : null;
  }

    /**
 * @generatedInfoDoc
 * InfoDoc: method `FormattingService`.`getSelectedHeaderTag()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/formatting.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */



private getSelectedHeaderTag(range: Range, fallbackNode: Node | null): string {
    const blocks = this.getSelectedTargetBlocks(range);
    const headingTags = blocks
      .map(block => block.tagName.toLowerCase())
      .filter(tagName => /^h[1-6]$/.test(tagName));

    if (headingTags.length > 0 && headingTags.every(tagName => tagName === headingTags[0]) && headingTags.length === blocks.length) {
      return headingTags[0];
    }

    const fallbackHeading = this.findNearestHeader(fallbackNode ?? range.commonAncestorContainer);
    return fallbackHeading?.tagName.toLowerCase() ?? '';
  }

    /**
 * @generatedInfoDoc
 * InfoDoc: method `FormattingService`.`findNearestHeader()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/formatting.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */



private findNearestHeader(node: Node | null): HTMLElement | null {
    let currentNode = node;
    while (currentNode) {
      if (currentNode instanceof HTMLElement && /^H[1-6]$/.test(currentNode.tagName)) {
        return currentNode;
      }
      currentNode = currentNode.parentNode;
    }
    return null;
  }

    /**
 * @generatedInfoDoc
 * InfoDoc: method `FormattingService`.`normalizeHeaderTag()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/formatting.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */



private normalizeHeaderTag(headerLevel: string): string {
    const tagName = headerLevel.toLowerCase();
    return /^h[1-6]$/.test(tagName) ? tagName : 'p';
  }

    /**
 * @generatedInfoDoc
 * InfoDoc: method `FormattingService`.`wrapSelectionInHeader()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/formatting.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */



private wrapSelectionInHeader(range: Range, headerTag: string): void {
    const headerElement = document.createElement(headerTag);
    headerElement.appendChild(range.extractContents());
    range.insertNode(headerElement);

    const newRange = document.createRange();
    newRange.selectNodeContents(headerElement);
    this.setActiveRange(newRange);
  }

    /**
 * @generatedInfoDoc
 * InfoDoc: method `FormattingService`.`replaceBlockTag()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/formatting.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */



private replaceBlockTag(block: HTMLElement, tagName: string): HTMLElement {
    if (block.tagName.toLowerCase() === tagName) {
      return block;
    }

    const replacement = document.createElement(tagName);
    Array.from(block.attributes).forEach(attribute => {
      replacement.setAttribute(attribute.name, attribute.value);
    });

    while (block.firstChild) {
      replacement.appendChild(block.firstChild);
    }

    block.replaceWith(replacement);
    return replacement;
  }

    /**
 * @generatedInfoDoc
 * InfoDoc: method `FormattingService`.`getSelectedTargetBlocks()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/formatting.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */



private getSelectedTargetBlocks(range: Range): HTMLElement[] {
    const caretBlock = this.findNearestTargetBlock(range.commonAncestorContainer);
    if (range.collapsed) {
      return caretBlock ? [caretBlock] : [];
    }

    const root = this.getEditableRoot(range) ?? caretBlock;
    if (!root) {
      return [];
    }

    const candidates = Array.from(root.querySelectorAll<HTMLElement>('p, li, div, section, article, blockquote, pre, h1, h2, h3, h4, h5, h6'))
      .filter(block => !block.isContentEditable || block !== root);

    if (this.isTargetBlock(root) && root !== this.getEditableRoot(range)) {
      candidates.unshift(root);
    }

    const intersecting = candidates.filter(block => {
      try {
        return range.intersectsNode(block);
      } catch {
        return false;
      }
    });

    if (intersecting.length > 0) {
      return this.removeNestedTargetBlocks(intersecting);
    }

    return caretBlock ? [caretBlock] : [];
  }

    /**
 * @generatedInfoDoc
 * InfoDoc: method `FormattingService`.`getEditableRoot()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/formatting.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */



private getEditableRoot(range: Range): HTMLElement | null {
    const container = this.normalizeContainerElement(range.commonAncestorContainer);
    return container?.closest('[contenteditable="true"]') as HTMLElement | null;
  }

    /**
 * @generatedInfoDoc
 * InfoDoc: method `FormattingService`.`removeNestedTargetBlocks()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/formatting.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */



private removeNestedTargetBlocks(blocks: HTMLElement[]): HTMLElement[] {
    return blocks.filter(block => !blocks.some(other => other !== block && other.contains(block)));
  }

  /** Retrieves paragraphs or list-items in selection or at caret */
    /**
 * @generatedInfoDoc
 * InfoDoc: method `FormattingService`.`getTargetBlocks()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/formatting.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */











private getTargetBlocks(): HTMLElement[] {
    let elements = this.contentService.getSelectedElements();
    if (elements.length === 0) {
      elements = this.getCaretTargetBlocks();
    }
    return elements;
  }

/**
 * @generatedInfoDoc
 * InfoDoc: method `FormattingService`.`getCaretTargetBlocks()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/formatting.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */











private getCaretTargetBlocks(): HTMLElement[] {
    const range = this.getActiveRange();
    if (!range) {
      return [];
    }

    const block = this.findNearestTargetBlock(range.commonAncestorContainer);
    return block ? [block] : [];
  }

/**
 * @generatedInfoDoc
 * InfoDoc: method `FormattingService`.`findNearestTargetBlock()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/formatting.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */











private findNearestTargetBlock(node: Node | null): HTMLElement | null {
    let currentNode = node;
    while (currentNode) {
      if (this.isTargetBlock(currentNode)) {
        return currentNode;
      }
      currentNode = currentNode.parentNode;
    }
    return null;
  }

/**
 * @generatedInfoDoc
 * InfoDoc: method `FormattingService`.`isTargetBlock()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/formatting.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */











private isTargetBlock(node: Node): node is HTMLElement {
    return node instanceof HTMLElement && ['P', 'LI', 'DIV', 'SECTION', 'ARTICLE', 'BLOCKQUOTE', 'PRE', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(node.tagName);
  }


    /**
 * @generatedInfoDoc
 * InfoDoc: method `FormattingService`.`setLineSpacing()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/formatting.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */











public setLineSpacing(value: string): void {
    const blocks = this.getTargetBlocks();
    blocks.forEach(el => el.style.lineHeight = value);
    this.saveSelection();
  }

    /**
 * @generatedInfoDoc
 * InfoDoc: method `FormattingService`.`setBackgroundColor()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/formatting.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */











public setBackgroundColor(value: string): void {
    const blocks = this.getTargetBlocks();
    blocks.forEach(el => el.style.backgroundColor = value);
    this.saveSelection();
  }

  /** Pixels added on every indent action (≈ 2 em) */
  private static readonly INDENT_STEP_PX = 20;


  /** Increase indent on selected blocks */
    /**
 * @generatedInfoDoc
 * InfoDoc: method `FormattingService`.`indent()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/formatting.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */











public indent(): void {
    const blocks = this.getTargetBlocks();
    blocks.forEach(el => this.adjustIndent(el, +FormattingService.INDENT_STEP_PX));
    this.saveSelection();
  }

  /** Adjusts margin-left by step (positive or negative) */
    /**
 * @generatedInfoDoc
 * InfoDoc: method `FormattingService`.`adjustIndent()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/formatting.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */











private adjustIndent(el: HTMLElement, delta: number): void {
    const current = Number.parseInt(getComputedStyle(el).marginLeft, 10) || 0;
    const next = Math.max(current + delta, 0);
    el.style.marginLeft = `${next}px`;
  }

  /** Wraps or unwraps the selection in a block tag */
    /**
 * @generatedInfoDoc
 * InfoDoc: method `FormattingService`.`wrapOrUnwrapBlock()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/formatting.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */











private wrapOrUnwrapBlock(tag: 'blockquote' | 'pre'): void {
    const range = this.getActiveRange();
    if (!range) { return; }

    // Determine ancestor block
    let ancestor = range.commonAncestorContainer as Node;
    while (ancestor && ancestor.nodeType !== Node.ELEMENT_NODE) {
      ancestor = ancestor.parentNode as Node;
    }
    const el = ancestor as HTMLElement;

    // If inside same block, unwrap
    if (el.tagName.toLowerCase() === tag) {
      this.unwrap(el);
      return;
    }

    // Else wrap
    const wrapper = document.createElement(tag);
    wrapper.appendChild(range.extractContents());
    range.insertNode(wrapper);

    this.saveSelection();
  }


  /** Decrease indent on selected blocks */
    /**
 * @generatedInfoDoc
 * InfoDoc: method `FormattingService`.`outdent()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/formatting.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */











public outdent(): void {
    const blocks = this.getTargetBlocks();
    blocks.forEach(el => this.adjustIndent(el, -FormattingService.INDENT_STEP_PX));
    this.saveSelection();
  }
  /** Toggles the selected text (or current paragraph) as a block-quote. */
    /**
 * @generatedInfoDoc
 * InfoDoc: method `FormattingService`.`blockquote()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/formatting.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */











public blockquote(): void {
    this.wrapOrUnwrapBlock('blockquote');
  }

  /** Toggles the selected text (or current paragraph) as a code block (`<pre>`). */
    /**
 * @generatedInfoDoc
 * InfoDoc: method `FormattingService`.`codeBlock()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/formatting.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */











public codeBlock(): void {
    this.wrapOrUnwrapBlock('pre');
  }
}
