import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StompService } from './stomp.service';

interface ChatMessage {
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="chat-container">
      <div class="chat-messages" #messageContainer>
        <div *ngFor="let message of messages" 
             [ngClass]="{'message': true, 'message-user': message.sender === 'user', 'message-assistant': message.sender === 'assistant'}">
          <div class="text-sm text-secondary mb-1">
            {{ message.sender === 'user' ? 'You' : 'Assistant' }}
          </div>
          <div class="whitespace-pre-wrap">{{ message.content }}</div>
          <div class="text-xs text-secondary mt-1">
            {{ message.timestamp | date:'shortTime' }}
          </div>
        </div>
      </div>
      
      <div class="chat-input-container">
        <form class="chat-input-form" (ngSubmit)="sendMessage()">
          <input type="text" 
                 class="chat-input" 
                 [(ngModel)]="newMessage" 
                 name="message"
                 placeholder="Type your message..."
                 (keyup.enter)="sendMessage()">
          <button type="submit" class="send-button">
            Send
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100%;
    }
  `]
})
export class ChatComponent implements OnInit, AfterViewChecked {
  @ViewChild('messageContainer') private messageContainer!: ElementRef;
  
  messages: ChatMessage[] = [];
  newMessage: string = '';
  
  constructor(private stompService: StompService) {}
  
  ngOnInit() {
    // Subscribe to incoming messages
    this.stompService.message$.subscribe(message => {
      if (message) {
        this.messages.push({
          content: message,
          sender: 'assistant',
          timestamp: new Date()
        });
      }
    });

    // Add welcome message
    this.messages.push({
      content: 'Hello! How can I help you today?',
      sender: 'assistant',
      timestamp: new Date()
    });
  }
  
  ngAfterViewChecked() {
    this.scrollToBottom();
  }
  
  sendMessage() {
    if (this.newMessage.trim()) {
      this.messages.push({
        content: this.newMessage,
        sender: 'user',
        timestamp: new Date()
      });
      
      // Send message through STOMP
      this.stompService.sendMessage(this.newMessage);
      
      this.newMessage = '';
    }
  }
  
  private scrollToBottom(): void {
    try {
      this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
    } catch(err) {}
  }
} 