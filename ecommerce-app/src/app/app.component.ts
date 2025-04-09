import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CartService } from './services/cart.service';
import { ChatComponent } from './components/chat/chat.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatBadgeModule,
    MatTooltipModule,
    ChatComponent
  ],
  template: `
    <mat-toolbar color="primary">
      <span>E-Commerce App</span>
      <span class="spacer"></span>
      <button mat-button routerLink="/products">Products</button>
      <button mat-button routerLink="/cart">
        <mat-icon>shopping_cart</mat-icon>
        <span matBadge="{{ cartItemCount }}" matBadgeColor="warn" matBadgeSize="small">Cart</span>
      </button>
      <button mat-icon-button (click)="toggleChat()" matTooltip="Chat with Support">
        <mat-icon>chat</mat-icon>
      </button>
    </mat-toolbar>
    <main>
      <router-outlet></router-outlet>
    </main>
    
    <!-- Chat component -->
    <app-chat [(isOpen)]="isChatOpen"></app-chat>
  `,
  styles: [`
    .spacer {
      flex: 1 1 auto;
    }
    main {
      padding: 20px;
    }
  `]
})
export class AppComponent implements OnInit {
  cartItemCount = 0;
  isChatOpen = false;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.updateCartCount();
  }

  updateCartCount(): void {
    const cartItems = this.cartService.getCartItems();
    this.cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  }
  
  toggleChat(): void {
    this.isChatOpen = !this.isChatOpen;
  }
}
