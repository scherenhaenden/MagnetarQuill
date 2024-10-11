import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'lib-editor',
  standalone: true,
  imports: [],
  templateUrl: './editor.component.html',  
  styleUrl: './editor.component.less'
})
export class EditorComponent {

  @ViewChild('editor', { static: true }) public editor!: ElementRef<HTMLDivElement>;

}
