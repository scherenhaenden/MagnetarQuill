import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, HostListener, ViewChild } from '@angular/core';

@Component({
  selector: 'lib-magnetar-quill',
  standalone: true,
  imports: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './lib-magnetar-quill.component.html',
  styleUrl: './lib-magnetar-quill.component.less'
})
export class LibMagnetarQuillComponent {
  @ViewChild('editor', { static: true }) public editor!: ElementRef<HTMLDivElement>;

  // Bold Toggle
  public toggleBold(): void {
    this.applyStyle('font-weight', 'bold');
  }

  // Italic Toggle
  public toggleItalic(): void {
    this.applyStyle('font-style', 'italic');
  }

  // Underline Toggle
  public toggleUnderline(): void {
    this.applyStyle('text-decoration', 'underline');
  }

  // Strikethrough Toggle
  public toggleStrikethrough(): void {
    this.applyStyle('text-decoration', 'line-through');
  }

  // Font Family
  // Update to handle default values
public onFontFamilyChange(event: Event): void {
  const target = event.target as HTMLSelectElement;
  const fontFamily = target.value || '';  // Empty string for default
  this.applyStyle('font-family', fontFamily);
}

  // Font Size
  public onFontSizeChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const fontSize = target.value || '';  // Empty string for default
    this.applyStyle('font-size', fontSize);
  }

  // Text Color
  public onTextColorChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.applyStyle('color', target.value);
  }

  // Background Color
  public onBackgroundColorChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.applyStyle('background-color', target.value);
  }

  // Method to clear formatting
public clearFormatting(): void {
  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    const selectedText = range.extractContents();
    const span = document.createElement('span');
    span.style.cssText = '';  // Reset all styles
    span.appendChild(selectedText);
    range.insertNode(span);
  }
}


  // Method to apply styles to the selected text
  private applyStyle(styleName: string, value: string): void {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const selectedText = range.extractContents();
      const span = document.createElement('span');
      span.style[styleName as any] = value;
      span.appendChild(selectedText);
      range.insertNode(span);
    }
  }

  // Keydown event for shortcuts
  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    if (event.ctrlKey || event.metaKey) {
      switch (event.key.toLowerCase()) {
        case 'b':
          event.preventDefault();
          this.toggleBold();
          break;
        case 'i':
          event.preventDefault();
          this.toggleItalic();
          break;
        case 'u':
          event.preventDefault();
          this.toggleUnderline();
          break;
      }
    }
  }
}
