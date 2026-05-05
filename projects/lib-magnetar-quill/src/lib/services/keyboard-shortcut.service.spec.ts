// keyboard-shortcut.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { KeyboardShortcutService } from './keyboard-shortcut.service';
import { FormattingService } from './formatting.service';
import { ShortcutAction } from '../models/key-shortcuts';
import { SHORTCUTS } from '../models/shortcut-map';
import { ElementRef } from '@angular/core';

// Helper function to dispatch keydown events
function dispatchKeydownEvent(
  key: string,
  options: {
    ctrlKey?: boolean;
    metaKey?: boolean;
    shiftKey?: boolean;
    altKey?: boolean;
    target?: EventTarget | null;
  } = {}
): KeyboardEvent {
  const event = new KeyboardEvent('keydown', {
    key: key,
    code: key.toUpperCase(),
    ctrlKey: options.ctrlKey ?? false,
    metaKey: options.metaKey ?? false,
    shiftKey: options.shiftKey ?? false,
    altKey: options.altKey ?? false,
    bubbles: true,
    cancelable: true,
  });

  spyOn(event, 'stopImmediatePropagation').and.callThrough();
  spyOn(event, 'preventDefault').and.callThrough();

  if (options.target !== undefined) {
    Object.defineProperty(event, 'target', { writable: false, value: options.target });
  } else {
     Object.defineProperty(event, 'target', { writable: false, value: document.body });
  }

  window.dispatchEvent(event);
  return event;
}

describe('KeyboardShortcutService', () => {
  let service: KeyboardShortcutService;
  let mockFormattingService: jasmine.SpyObj<FormattingService>;
  let consoleWarnSpy: jasmine.Spy;
  let consoleErrorSpy: jasmine.Spy;
  const mockElement = document.createElement('div');
  const mockElementRef = new ElementRef(mockElement);

  const formattingServiceMethods = [
    'toggleBold', 'toggleItalic', 'toggleUnderline', 'toggleStrikethrough',
    'toggleSuperscript', 'toggleSubscript', 'toggleList', 'indent', 'outdent',
    'blockquote', 'codeBlock', 'clearFormatting',
  ];

  beforeEach(() => {
    mockFormattingService = jasmine.createSpyObj('FormattingService', formattingServiceMethods);

    TestBed.configureTestingModule({
      providers: [
        KeyboardShortcutService,
        { provide: FormattingService, useValue: mockFormattingService }
      ],
    });

    service = TestBed.inject(KeyboardShortcutService);
    service.initialize(mockElement);
    consoleWarnSpy = spyOn(console, 'warn');
    consoleErrorSpy = spyOn(console, 'error');
  });

  afterEach(() => {
    mockElement.innerHTML = ''; // Clean up children
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Shortcut Scoping', () => {
    it('should ignore shortcuts when target is outside the editor element', () => {
      const externalDiv = document.createElement('div');
      externalDiv.contentEditable = 'true';
      // externalDiv is NOT a child of mockElement
      const event = dispatchKeydownEvent('b', { ctrlKey: true, target: externalDiv });

      expect(mockFormattingService.toggleBold).not.toHaveBeenCalled();
      expect(event.preventDefault).not.toHaveBeenCalled();
    });

    it('should NOT ignore shortcuts when target is inside the editor element', () => {
      const internalDiv = document.createElement('div');
      internalDiv.contentEditable = 'true';
      mockElement.appendChild(internalDiv);
      const event = dispatchKeydownEvent('b', { ctrlKey: true, target: internalDiv });

      expect(mockFormattingService.toggleBold).toHaveBeenCalled();
      expect(event.preventDefault).toHaveBeenCalled();
    });
  });

  describe('Target Element Filtering', () => {
    it('should ignore shortcuts when target is an INPUT element', () => {
      const input = document.createElement('input');
      mockElement.appendChild(input);
      const event = dispatchKeydownEvent('b', { ctrlKey: true, target: input });

      expect(mockFormattingService.toggleBold).not.toHaveBeenCalled();
      expect(event.preventDefault).not.toHaveBeenCalled();
    });
  });

  describe('Shortcut Handling', () => {
    SHORTCUTS.forEach(shortcut => {
      it(`should trigger action "${shortcut.action}" for ${shortcut.key}`, () => {
        const internalDiv = document.createElement('div');
        internalDiv.contentEditable = 'true';
        mockElement.appendChild(internalDiv);

        const options = {
          ctrlKey: shortcut.ctrl,
          metaKey: shortcut.meta,
          shiftKey: shortcut.shift,
          altKey: shortcut.alt,
          target: internalDiv
        };

        const event = dispatchKeydownEvent(shortcut.key, options);

        if (shortcut.action === ShortcutAction.Undo || shortcut.action === ShortcutAction.Redo) {
          expect(event.preventDefault).not.toHaveBeenCalled();
          expect(event.stopImmediatePropagation).not.toHaveBeenCalled();
        } else {
          expect(event.preventDefault).toHaveBeenCalled();
        }
      });
    });
  });
});
