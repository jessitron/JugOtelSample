import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EnvironmentService } from './environment.service';

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
  constructor(
    private http: HttpClient,
    private environmentService: EnvironmentService
  ) {}

  placeOrder(order: Order): Observable<OrderResponse> {
    return this.http.post<OrderResponse>(
      `${this.environmentService.commerceEndpoint}/orders`,
      order
    );
  }
} 