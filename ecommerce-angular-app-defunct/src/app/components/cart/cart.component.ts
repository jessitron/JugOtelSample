import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../models/product.model';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

interface BackendCartItem {
  id: number;
  product: {
    id: number;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    category: string;
    stock: number;
  };
  quantity: number;
}

interface BackendCart {
  id: number;
  userId: string;
  items: BackendCartItem[];
  total: number;
}

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    FormsModule
  ],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit, OnDestroy {
  cartItems?: CartItem[] = [];
  total: number = 0;
  isLoading = true;
  error: string | null = null;
  private cartSubscription?: Subscription;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.loadCart();
    this.cartSubscription = this.cartService.getCartItems$().subscribe({
      next: (items) => {
        if (items) {
          this.cartItems = items;
          this.total = this.calculateTotal(items);
        }
        this.isLoading = false;
        this.error = null;
      },
      error: (err) => {
        this.error = 'Failed to load cart. Please try again later.';
        this.isLoading = false;
        console.error('Error loading cart:', err);
      }
    });
  }

  private calculateTotal(items: CartItem[]): number {
    return items.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  }

  loadCart(): void {
    this.isLoading = true;
    this.error = null;
    this.cartService.loadCart();
  }

  ngOnDestroy(): void {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  updateQuantity(productId: string, quantity: number): void {
    if (quantity > 0 && !isNaN(quantity)) {
      this.cartService.updateQuantity(productId, Math.floor(quantity));
    }
  }

  removeFromCart(productId: string): void {
    this.cartService.removeFromCart(productId);
  }
} 