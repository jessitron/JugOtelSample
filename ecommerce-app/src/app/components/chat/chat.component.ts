import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DragDropModule } from '@angular/cdk/drag-drop';
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
    MatFormFieldModule,
    DragDropModule
  ],
  template: `
    <div class="chat-flyout" 
         [class.open]="isOpen"
         cdkDrag
         [cdkDragDisabled]="!isOpen"
         [cdkDragBoundary]="'body'"
         (cdkDragEnded)="onDragEnded($event)">
      <div class="chat-header" cdkDragHandle>
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
      border-radius: 12px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
      z-index: 1000;
      overflow: hidden;
      transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
      transform: translateY(100%);
      opacity: 0;
      pointer-events: none;
      animation: float 6s ease-in-out infinite;
      cursor: move;
    }
    
    .chat-flyout.cdk-drag-preview {
      box-shadow: 0 12px 28px rgba(0, 0, 0, 0.25);
      animation: none;
    }
    
    .chat-flyout.cdk-drag-placeholder {
      opacity: 0.3;
    }
    
    .chat-flyout.cdk-drag-animating {
      transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
    }
    
    @keyframes float {
      0% {
        transform: translateY(100%) translateY(0px);
      }
      50% {
        transform: translateY(100%) translateY(-10px);
      }
      100% {
        transform: translateY(100%) translateY(0px);
      }
    }
    
    .chat-flyout.open {
      transform: translateY(0);
      opacity: 1;
      pointer-events: auto;
      animation: none;
    }
    
    .chat-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      background-color: #3f51b5;
      color: white;
      border-top-left-radius: 12px;
      border-top-right-radius: 12px;
      cursor: move;
    }
    
    .chat-header h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 500;
    }
    
    .chat-container {
      display: flex;
      flex-direction: column;
      height: 400px;
      background-color: #f9f9f9;
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
      border-radius: 12px;
      position: relative;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
    }
    
    .message-user {
      align-self: flex-end;
      background-color: #3f51b5;
      color: white;
      border-bottom-right-radius: 4px;
    }
    
    .message-assistant {
      align-self: flex-start;
      background-color: white;
      border: 1px solid #e0e0e0;
      border-bottom-left-radius: 4px;
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
  
  onDragEnded(event: any) {
    // You can add additional logic here if needed when dragging ends
    console.log('Drag ended at position:', event.source.getFreeDragPosition());
  }
  
  private scrollToBottom(): void {
    try {
      this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
    } catch(err) {}
  }
} 