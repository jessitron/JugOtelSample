import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { CartItem } from '../models/product.model';

interface CartOperation {
  productId: string;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = new BehaviorSubject<CartItem[]|undefined>(undefined);
  private readonly CART_API_PATH = '/api/cart';
  private readonly userId = 'test-user-123'; // TODO: Get from auth service

  constructor(private http: HttpClient) {
    this.loadCart();
  }

  loadCart(): void {
    this.http.get<CartItem[]>(this.CART_API_PATH, {
      headers: {
        'X-User-ID': this.userId
      }
    }).subscribe({
      next: (items) => this.cartItems.next(items),
      error: (error) => {
        console.error('Error loading cart:', error);
        this.cartItems.next(undefined);
      }
    });
  }

  getCartItems(): CartItem[] {
    debugger;
    if (this.cartItems.value === undefined) {
      throw new Error('Cart is not loaded');
    }
    return this.cartItems.value;
  }

  getCartItems$(): Observable<CartItem[]|undefined> {
    if (this.cartItems.value === undefined) {
      throw new Error('Cart is not loaded');
    }
    return this.cartItems.asObservable();
  }

  addToCart(product: any, quantity: number = 1): void {
    const operation: CartOperation = {
      productId: product.id,
      quantity: quantity
    };

    this.http.post<CartItem[]>(
      `${this.CART_API_PATH}/items`,
      operation,
      {
        headers: {
          'X-User-ID': this.userId
        }
      }
    ).pipe(
      tap(items => this.cartItems.next(items))
    ).subscribe();
  }

  updateQuantity(productId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }

    // For simplicity, we'll remove and re-add the item with new quantity
    this.removeFromCart(productId);
    this.addToCart({ id: productId }, quantity);
  }

  removeFromCart(productId: string): void {
    this.http.delete<CartItem[]>(
      `${this.CART_API_PATH}/items/${productId}`,
      {
        headers: {
          'X-User-ID': this.userId
        }
      }
    ).pipe(
      tap(items => this.cartItems.next(items))
    ).subscribe();
  }

  getTotal(): number {
    return this.cartItems?.value?.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0) ?? 0;
  }

  clearCart(): void {
    // Remove all items one by one
    this.cartItems?.value?.forEach(item => {
      this.removeFromCart(item.product.id);
    });
  }
} 