import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { StompService } from '../../services/stomp.service';

interface ChatMessage {
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    MatButtonModule, 
    MatIconModule, 
    MatInputModule,
    MatCardModule,
    MatFormFieldModule
  ],
  template: `
    <div class="chat-flyout" [class.open]="isOpen">
      <div class="chat-header">
        <h3>Chat with Support</h3>
        <button mat-icon-button (click)="toggleChat()">
          <mat-icon>{{ isOpen ? 'close' : 'chat' }}</mat-icon>
        </button>
      </div>
      
      <div class="chat-container" *ngIf="isOpen">
        <div class="chat-messages" #messageContainer>
          <div *ngFor="let message of messages" 
               [ngClass]="{'message': true, 'message-user': message.sender === 'user', 'message-assistant': message.sender === 'assistant'}">
            <div class="message-sender">
              {{ message.sender === 'user' ? 'You' : 'Assistant' }}
            </div>
            <div class="message-content">{{ message.content }}</div>
            <div class="message-timestamp">
              {{ message.timestamp | date:'shortTime' }}
            </div>
          </div>
        </div>
        
        <div class="chat-input-container">
          <form class="chat-input-form" (ngSubmit)="sendMessage()">
            <mat-form-field appearance="outline" class="chat-input-field">
              <input matInput
                     type="text" 
                     [(ngModel)]="newMessage" 
                     name="message"
                     placeholder="Type your message..."
                     (keyup.enter)="sendMessage()">
            </mat-form-field>
            <button mat-icon-button color="primary" type="submit">
              <mat-icon>send</mat-icon>
            </button>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .chat-flyout {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 350px;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 1000;
      overflow: hidden;
      transition: all 0.3s ease;
      transform: translateY(100%);
      opacity: 0;
      pointer-events: none;
    }
    
    .chat-flyout.open {
      transform: translateY(0);
      opacity: 1;
      pointer-events: auto;
    }
    
    .chat-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      background-color: #3f51b5;
      color: white;
    }
    
    .chat-header h3 {
      margin: 0;
      font-size: 16px;
    }
    
    .chat-container {
      display: flex;
      flex-direction: column;
      height: 400px;
    }
    
    .chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    
    .message {
      max-width: 80%;
      padding: 12px;
      border-radius: 8px;
      position: relative;
    }
    
    .message-user {
      align-self: flex-end;
      background-color: #3f51b5;
      color: white;
    }
    
    .message-assistant {
      align-self: flex-start;
      background-color: #f5f5f5;
      border: 1px solid #e0e0e0;
    }
    
    .message-sender {
      font-size: 12px;
      margin-bottom: 4px;
      opacity: 0.8;
    }
    
    .message-content {
      word-break: break-word;
    }
    
    .message-timestamp {
      font-size: 10px;
      margin-top: 4px;
      opacity: 0.7;
      text-align: right;
    }
    
    .chat-input-container {
      padding: 12px;
      background-color: white;
      border-top: 1px solid #e0e0e0;
    }
    
    .chat-input-form {
      display: flex;
      gap: 8px;
      align-items: center;
    }
    
    .chat-input-field {
      flex: 1;
      margin-bottom: -1.25em;
    }
  `]
})
export class ChatComponent implements OnInit, AfterViewChecked {
  @ViewChild('messageContainer') private messageContainer!: ElementRef;
  @Input() isOpen = false;
  @Output() isOpenChange = new EventEmitter<boolean>();
  
  messages: ChatMessage[] = [];
  newMessage: string = '';
  
  constructor(private stompService: StompService) {}
  
  ngOnInit() {
    // Subscribe to incoming messages
    this.stompService.message$.subscribe((message: string | null) => {
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
  
  toggleChat() {
    this.isOpen = !this.isOpen;
    this.isOpenChange.emit(this.isOpen);
  }
  
  private scrollToBottom(): void {
    try {
      this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
    } catch(err) {}
  }
} 