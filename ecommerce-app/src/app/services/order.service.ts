import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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

// TODO extract to config somewhere

const ORDER_API_PATH="/api/orders"

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  constructor( private http: HttpClient ) {}

  placeOrder(order: Order): Observable<OrderResponse> {
    return this.http.post<OrderResponse>(
      `${ORDER_API_PATH}`,
      order
    );
  }
} 