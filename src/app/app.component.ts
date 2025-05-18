import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {LibMagnetarQuillComponent} from "lib-magnetar-quill";
import { TestText } from './test-text';
import {NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LibMagnetarQuillComponent, NgIf, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.less'
})
export class AppComponent {
  title = 'MagnetarQuill';

  public showOutput = true;

  public testText = '';

  constructor() {

    this.testText = TestText.testText;
  }

  someTest(value: string) {
    console.log(this.testText);
    this.testText = value;

  }
}
