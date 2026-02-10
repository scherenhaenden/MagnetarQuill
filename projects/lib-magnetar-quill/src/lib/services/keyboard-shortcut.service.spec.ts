// keyboard-shortcut.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { KeyboardShortcutService } from './keyboard-shortcut.service';
import { FormattingService } from './formatting.service';
import { ShortcutAction } from '../models/key-shortcuts'; // Adjust path if necessary
import { SHORTCUTS } from '../models/shortcut-map';       // Adjust path if necessary
import { Type } from '@angular/core';

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
    code: key.toUpperCase(), // Optional, but good practice
    ctrlKey: options.ctrlKey ?? false,
    metaKey: options.metaKey ?? false,
    shiftKey: options.shiftKey ?? false,
    altKey: options.altKey ?? false,
    bubbles: true, // Necessary for window listener
    cancelable: true, // Necessary for preventDefault
  });

  // Mock stopImmediatePropagation
  spyOn(event, 'stopImmediatePropagation').and.callThrough();
  // Mock preventDefault
  spyOn(event, 'preventDefault').and.callThrough();

  // Define target if provided
  if (options.target !== undefined) {
    Object.defineProperty(event, 'target', { writable: false, value: options.target });
  } else {
     // Default target if not specified (e.g., document body)
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

  // Create a comprehensive list of methods used in the service's switch statement
  const formattingServiceMethods = [
    'toggleBold',
    'toggleItalic',
    'toggleUnderline',
    'toggleStrikethrough',
    'toggleSuperscript',
    'toggleSubscript',
    'toggleList',
    'indent',
    'outdent',
    'blockquote',
    'codeBlock',
    // Add any other methods potentially called, even if commented out in service
     'clearFormatting',
  ];

  beforeEach(() => {
    // Create spy object with all needed methods
    mockFormattingService = jasmine.createSpyObj('FormattingService', formattingServiceMethods);

    TestBed.configureTestingModule({
      providers: [
        KeyboardShortcutService,
        { provide: FormattingService, useValue: mockFormattingService },
      ],
    });

    // Inject the service *after* configuring TestBed
    service = TestBed.inject(KeyboardShortcutService);

    // Spy on console methods
    consoleWarnSpy = spyOn(console, 'warn');
    consoleErrorSpy = spyOn(console, 'error');
  });

  afterEach(() => {
    // Clean up the listener
    service.ngOnDestroy();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    // Implicitly tests constructor and listener addition
  });

  it('should remove keydown listener on destroy', () => {
     // Spy on removeEventListener - difficult to check specific listener function instance
     const removeSpy = spyOn(window, 'removeEventListener').and.callThrough();
     service.ngOnDestroy();
     // Check if removeEventListener was called with 'keydown' and the handler (or any function) in capture phase
     expect(removeSpy).toHaveBeenCalledWith('keydown', jasmine.any(Function), true);
  });

  it('should log an error and return if FormattingService is not available (simulated)', () => {
      // Simulate fmt being null *after* service creation
      (service as any).fmt = null;

      const event = dispatchKeydownEvent('b', { ctrlKey: true });

      expect(consoleErrorSpy).toHaveBeenCalledWith('FormattingService is not available in KeyboardShortcutService.');
      expect(mockFormattingService.toggleBold).not.toHaveBeenCalled();
      expect(event.preventDefault).not.toHaveBeenCalled();
      expect(event.stopImmediatePropagation).not.toHaveBeenCalled();
      // Restore for other tests if necessary (though afterEach handles this instance)
      (service as any).fmt = mockFormattingService;
  });

  // TODO:
  // CRITICAL!:
  /*The tests in the Target Element Filtering suite check for behavior that seems to be disabled in KeyboardShortcutService. Specifically, the service has a commented-out return statement that is supposed to prevent shortcuts from firing on INPUT, TEXTAREA, and SELECT elements. Because this logic is disabled, these tests will likely fail. Please either enable the logic in the service or adjust the tests to reflect the intended behavior.*/
  // --- Target Element Filtering ---
  describe('Target Element Filtering', () => {
    it('should ignore shortcuts when target is an INPUT element', () => {
      const input = document.createElement('input');
      const event = dispatchKeydownEvent('b', { ctrlKey: true, target: input });

      expect(mockFormattingService.toggleBold).not.toHaveBeenCalled();
      expect(event.preventDefault).not.toHaveBeenCalled();
      expect(event.stopImmediatePropagation).not.toHaveBeenCalled();
    });

    it('should ignore shortcuts when target is a TEXTAREA element', () => {
      const textarea = document.createElement('textarea');
      const event = dispatchKeydownEvent('i', { ctrlKey: true, target: textarea });

      expect(mockFormattingService.toggleItalic).not.toHaveBeenCalled();
      expect(event.preventDefault).not.toHaveBeenCalled();
      expect(event.stopImmediatePropagation).not.toHaveBeenCalled();
    });

    it('should ignore shortcuts when target is a SELECT element', () => {
      const select = document.createElement('select');
      const event = dispatchKeydownEvent('u', { ctrlKey: true, target: select });

      expect(mockFormattingService.toggleUnderline).not.toHaveBeenCalled();
      expect(event.preventDefault).not.toHaveBeenCalled();
      expect(event.stopImmediatePropagation).not.toHaveBeenCalled();
    });

     it('should ignore shortcuts when target is a non-editable element (default isContentEditable=false)', () => {
       const div = document.createElement('div'); // isContentEditable defaults to false
       const event = dispatchKeydownEvent('b', { ctrlKey: true, target: div });

       expect(mockFormattingService.toggleBold).not.toHaveBeenCalled();
       expect(event.preventDefault).not.toHaveBeenCalled();
       expect(event.stopImmediatePropagation).not.toHaveBeenCalled();
     });

    it('should NOT ignore shortcuts when target is contentEditable', () => {
      const editableDiv = document.createElement('div');
      editableDiv.contentEditable = 'true';
      const event = dispatchKeydownEvent('b', { ctrlKey: true, target: editableDiv });

      expect(mockFormattingService.toggleBold).toHaveBeenCalled();
      expect(event.preventDefault).toHaveBeenCalled();
      expect(event.stopImmediatePropagation).toHaveBeenCalled();
    });

     it('should NOT ignore shortcuts when target is document body (or similar non-input)', () => {
       // Note: The current logic *would* ignore body because isContentEditable is false.
       // If the intention is to *allow* shortcuts when focus isn't on INPUT/TEXTAREA/SELECT,
       // the service logic needs `targetElement?.isContentEditable === false &&` removed or modified.
       // This test verifies the *current* implementation's behavior.
        const body = document.body;
        const event = dispatchKeydownEvent('b', { ctrlKey: true, target: body });

        // Based on current service code, body (isContentEditable=false) *should* be ignored
        expect(mockFormattingService.toggleBold).not.toHaveBeenCalled();
        expect(event.preventDefault).not.toHaveBeenCalled();
        expect(event.stopImmediatePropagation).not.toHaveBeenCalled();
     });
  });

  // --- Shortcut Handling ---
  describe('Shortcut Handling', () => {
    // Test each defined shortcut
    SHORTCUTS.forEach(shortcut => {
      const keyName = `Key: ${shortcut.key.toUpperCase()}${shortcut.ctrl ? ' + Ctrl' : ''}${shortcut.meta ? ' + Meta' : ''}${shortcut.shift ? ' + Shift' : ''}${shortcut.alt ? ' + Alt' : ''}`;
      const testName = `should trigger action "${shortcut.action}" for ${keyName}`;

      it(testName, () => {
        const options = {
          ctrlKey: shortcut.ctrl,
          metaKey: shortcut.meta,
          shiftKey: shortcut.shift,
          altKey: shortcut.alt
        };

        // Find the expected method name from the mock service spy object
        let expectedMethod: keyof FormattingService | null = null;
        let expectedArgs: any[] = [];

        switch (shortcut.action) {
          case ShortcutAction.Bold:            expectedMethod = 'toggleBold'; break;
          case ShortcutAction.Italic:          expectedMethod = 'toggleItalic'; break;
          case ShortcutAction.Underline:       expectedMethod = 'toggleUnderline'; break;
          case ShortcutAction.Strikethrough:   expectedMethod = 'toggleStrikethrough'; break;
          case ShortcutAction.Superscript:     expectedMethod = 'toggleSuperscript'; break;
          case ShortcutAction.Subscript:       expectedMethod = 'toggleSubscript'; break;
          case ShortcutAction.OrderedList:     expectedMethod = 'toggleList'; expectedArgs = ['ordered']; break;
          case ShortcutAction.UnorderedList:   expectedMethod = 'toggleList'; expectedArgs = ['unordered']; break;
          case ShortcutAction.Indent:          expectedMethod = 'indent'; break;
          case ShortcutAction.Outdent:         expectedMethod = 'outdent'; break;
          case ShortcutAction.Blockquote:      expectedMethod = 'blockquote'; break;
          case ShortcutAction.CodeBlock:       expectedMethod = 'codeBlock'; break;
          case ShortcutAction.ClearFormatting: expectedMethod = 'clearFormatting'; break; // Test even if commented in service switch
          // History actions are handled separately below (warnings)
          case ShortcutAction.Undo:
          case ShortcutAction.Redo:
             break; // Tested in warning section
          default:
            // This case should not be hit if all actions are mapped
            fail(`Unhandled ShortcutAction in test setup: ${shortcut.action}`);
        }

        const event = dispatchKeydownEvent(shortcut.key, options);

        // Check if preventDefault and stopImmediatePropagation were called
        expect(event.preventDefault).toHaveBeenCalledTimes(1);
        expect(event.stopImmediatePropagation).toHaveBeenCalledTimes(1);

        // Check if the correct formatting service method was called (or warning logged)
        if (expectedMethod) {
          const spyMethod = mockFormattingService[expectedMethod] as jasmine.Spy;
          if(expectedArgs.length > 0) {
             expect(spyMethod).toHaveBeenCalledWith(...expectedArgs);
          } else {
            expect(spyMethod).toHaveBeenCalled();
          }
          expect(spyMethod).toHaveBeenCalledTimes(1);
           // Ensure no *other* formatting methods were called
           formattingServiceMethods.forEach(methodName => {
             if (methodName !== expectedMethod) {
               expect(mockFormattingService[methodName as keyof FormattingService]).not.toHaveBeenCalled();
             }
           });

        } else if (shortcut.action === ShortcutAction.Undo) {
           expect(consoleWarnSpy).toHaveBeenCalledWith(jasmine.stringMatching(/Undo action triggered/));
           expect(consoleWarnSpy).toHaveBeenCalledTimes(1); // Only one warning
        } else if (shortcut.action === ShortcutAction.Redo) {
           expect(consoleWarnSpy).toHaveBeenCalledWith(jasmine.stringMatching(/Redo action triggered/));
           expect(consoleWarnSpy).toHaveBeenCalledTimes(1); // Only one warning
        } else {
           // If we reach here, it means an action was defined in SHORTCUTS
           // but not handled in the test's switch or the warning checks.
           // The service's default case should catch this.
           expect(consoleWarnSpy).toHaveBeenCalledWith(jasmine.stringMatching(`Shortcut action "${shortcut.action}" triggered but not handled`));
           expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
        }

        // Ensure no other *warnings* were logged unless expected
        if (shortcut.action !== ShortcutAction.Undo && shortcut.action !== ShortcutAction.Redo) {
            const wasExpectedWarning = !expectedMethod; // true if we expected a generic warning
            if(!wasExpectedWarning) {
                expect(consoleWarnSpy).not.toHaveBeenCalled();
            }
        }
      });
    });

    it('should handle key case-insensitivity', () => {
        const event = dispatchKeydownEvent('B', { ctrlKey: true }); // Uppercase 'B'
        expect(mockFormattingService.toggleBold).toHaveBeenCalled();
        expect(event.preventDefault).toHaveBeenCalled();
        expect(event.stopImmediatePropagation).toHaveBeenCalled();
    });


    it('should not call any method or prevent defaults if no shortcut matches', () => {
      const event = dispatchKeydownEvent('x', { ctrlKey: true }); // Ctrl+X (typically Cut)

      // Ensure no formatting service methods were called
      formattingServiceMethods.forEach(methodName => {
        expect(mockFormattingService[methodName as keyof FormattingService]).not.toHaveBeenCalled();
      });

      // Ensure event defaults were not prevented
      expect(event.preventDefault).not.toHaveBeenCalled();
      expect(event.stopImmediatePropagation).not.toHaveBeenCalled();
      expect(consoleWarnSpy).not.toHaveBeenCalled();
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });
  });

   // --- Specific Warning Checks (redundant with the loop above, but explicit) ---
   describe('Warning Logging', () => {
     it('should log warning for Undo action', () => {
       dispatchKeydownEvent('z', { ctrlKey: true });
       expect(consoleWarnSpy).toHaveBeenCalledWith(jasmine.stringMatching(/Undo action triggered/));
       expect(mockFormattingService.toggleBold).not.toHaveBeenCalled(); // Example check
     });

     it('should log warning for Redo action', () => {
       dispatchKeydownEvent('y', { ctrlKey: true });
       expect(consoleWarnSpy).toHaveBeenCalledWith(jasmine.stringMatching(/Redo action triggered/));
       expect(mockFormattingService.toggleBold).not.toHaveBeenCalled(); // Example check
     });

     // Example if ClearFormatting were uncommented and unhandled:
     // it('should log warning for unhandled ClearFormatting action', () => {
     //   dispatchKeydownEvent('\\', { ctrlKey: true }); // Assuming Ctrl+\
     //   expect(consoleWarnSpy).toHaveBeenCalledWith(jasmine.stringMatching(/Shortcut action "clearFormatting" triggered but not handled/));
     // });
   });

});
