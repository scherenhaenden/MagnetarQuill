import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {LibMagnetarQuillComponent} from "lib-magnetar-quill";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LibMagnetarQuillComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.less'
})
export class AppComponent {
  title = 'MagnetarQuill';

  testText = `<p dir="auto"><strong>MagnetarQuill</strong>&nbsp;is a versatile, extensible, and powerful&nbsp;<strong>WYSIWYG editor</strong>&nbsp;built with&nbsp;<strong>Angular</strong>, designed to streamline content creation with&nbsp;<strong>rich text</strong>,&nbsp;<strong>media</strong>,&nbsp;<strong>tables</strong>, and more. MagnetarQuill stands out with its&nbsp;<strong>plugin architecture</strong>,&nbsp;<strong>cross-browser support</strong>, and stunning&nbsp;<strong>theming options</strong>.</p>`;

}
