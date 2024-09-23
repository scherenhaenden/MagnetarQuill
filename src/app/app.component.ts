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
}
