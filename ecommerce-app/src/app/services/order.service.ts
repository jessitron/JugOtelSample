import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface Order {
  items: any[];
  total: number;
  shipping: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  payment: {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
  };
}

export interface OrderResponse {
  orderId: string;
  status: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  placeOrder(order: Order): Observable<OrderResponse> {
    // Simulate API call with a delay
    return of({
      orderId: Math.random().toString(36).substring(2, 15),
      status: 'success',
      message: 'Order placed successfully'
    }).pipe(delay(1000));
  }
} 