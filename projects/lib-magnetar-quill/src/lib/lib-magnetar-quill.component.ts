import {Component, ElementRef, ViewChild} from '@angular/core';

@Component({
  selector: 'lib-lib-magnetar-quill',
  standalone: true,
  imports: [],
  templateUrl: './lib-magnetar-quill.component.html',
  styleUrl: './lib-magnetar-quill.component.less'
})
export class LibMagnetarQuillComponent {
  // Access modifier and explicit type declaration for ViewChild
  @ViewChild('editor', { static: true }) public editor!: ElementRef<HTMLDivElement>;

  // Bold Toggle - applies bold formatting
  public toggleBold(): void {
    this.applyStyle('font-weight', 'bold');
  }

  // Italic Toggle - applies italic formatting
  public toggleItalic(): void {
    this.applyStyle('font-style', 'italic');
  }

  // Underline Toggle - applies underline formatting
  public toggleUnderline(): void {
    this.applyStyle('text-decoration', 'underline');
  }

  // Strikethrough Toggle - applies strikethrough formatting
  public toggleStrikethrough(): void {
    this.applyStyle('text-decoration', 'line-through');
  }

  // Method to apply styles to the selected text
  private applyStyle(styleName: string, value: string): void {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const selectedText = range.extractContents();
      const span = document.createElement('span');
      span.style[styleName as any] = value;  // Apply the style dynamically
      span.appendChild(selectedText);
      range.insertNode(span);
    }
  }

}
