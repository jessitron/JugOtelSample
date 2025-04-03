import { Component, OnInit } from '@angular/core';
import { StompService } from '../../chat/stomp.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'chat',
  providers: [StompService],
  template: `
    <input [(ngModel)]="name" placeholder="Enter your name"/>
    <button (click)="sendMessage()">Send</button>
    <p *ngIf="receivedMessage">Received: {{ receivedMessage }}</p>
  `,
  imports: [
    CommonModule,
    FormsModule
  ],
  styleUrl: './chatUI.component.scss'
})
export class ChatUIComponent implements OnInit {
  constructor(private stompService: StompService) {}
  ngOnInit(): void {
    this.stompService.message$.subscribe((msg) => {
      this.receivedMessage = msg;
    });
  }

  name = '';
  receivedMessage: string | null = null;

  sendMessage() {
    this.stompService.sendMessage(this.name);
  }
  title = 'chat-ui';
}
