import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartItem } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = new BehaviorSubject<CartItem[]>([]);

  getCartItems(): CartItem[] {
    return this.cartItems.value;
  }

  getCartItems$(): Observable<CartItem[]> {
    return this.cartItems.asObservable();
  }

  addToCart(product: any, quantity: number = 1): void {
    const currentItems = this.cartItems.value;
    const existingItem = currentItems.find(item => item.product.id === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      currentItems.push({ product, quantity });
    }

    this.cartItems.next([...currentItems]);
  }

  updateQuantity(productId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }

    const currentItems = this.cartItems.value;
    const item = currentItems.find(item => item.product.id === productId);
    
    if (item) {
      item.quantity = quantity;
      this.cartItems.next([...currentItems]);
    }
  }

  removeFromCart(productId: string): void {
    const currentItems = this.cartItems.value;
    const updatedItems = currentItems.filter(item => item.product.id !== productId);
    this.cartItems.next(updatedItems);
  }

  getTotal(): number {
    return this.cartItems.value.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  }

  clearCart(): void {
    this.cartItems.next([]);
  }
} 