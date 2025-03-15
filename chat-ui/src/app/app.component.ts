import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChatUI } from './chat/ChatUI';

@Component({
  selector: 'app-root',
  imports: [ChatUI],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'chat-ui';
}
