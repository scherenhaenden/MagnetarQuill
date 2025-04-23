import { KeyboardShortcutService } from './keyboard-shortcut.service';
import { TestBed } from '@angular/core/testing';
import { FormattingService } from './formatting.service';

describe('KeyboardShortcutService', () => {
  let service: KeyboardShortcutService;
  let fmt: jasmine.SpyObj<FormattingService>;

  beforeEach(() => {
    fmt = jasmine.createSpyObj('FormattingService', ['toggleBold', 'toggleItalic', 'toggleUnderline']);
    TestBed.configureTestingModule({
      providers: [
        KeyboardShortcutService,
        { provide: FormattingService, useValue: fmt },
      ],
    });
    service = TestBed.inject(KeyboardShortcutService);
  });

  afterEach(() => service.ngOnDestroy());

  it('fires toggleBold on Ctrl+B', () => {
    const ev = new KeyboardEvent('keydown', { key: 'b', ctrlKey: true });
    window.dispatchEvent(ev);
    expect(fmt.toggleBold).toHaveBeenCalled();
  });
});
