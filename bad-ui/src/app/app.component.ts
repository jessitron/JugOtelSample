import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <main class="min-h-screen bg-gray-50">
      <app-chat></app-chat>
    </main>
  `,
  styles: []
})
export class AppComponent {
  title = 'chat-ui';
}
