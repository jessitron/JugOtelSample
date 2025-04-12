import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CartItem } from '../models/product.model';

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface ShippingInfo {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface PaymentInfo {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

export interface Order {
  items: OrderItem[];
  total: number;
  shipping: ShippingInfo;
  payment: PaymentInfo;
}

export interface OrderResponse {
  orderId: string;
  status: 'SUCCESS' | 'FAILED';
  message: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface OrderError {
  status: number;
  message: string;
  validationErrors?: ValidationError[];
}

// TODO extract to config somewhere

const ORDER_API_PATH = '/api/orders/checkout';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  constructor( private http: HttpClient ) {}

  private transformCartItemsToOrderItems(cartItems: CartItem[]): OrderItem[] {
    return cartItems.map(item => ({
      productId: item.product.id,
      quantity: item.quantity,
      price: item.product.price
    }));
  }

  private validateOrder(order: Order): ValidationError[] {
    const errors: ValidationError[] = [];

    // Validate items
    if (!order.items || order.items.length === 0) {
      errors.push({ field: 'items', message: 'Order must contain at least one item' });
    } else {
      order.items.forEach((item, index) => {
        if (!item.productId) {
          errors.push({ field: `items[${index}].productId`, message: 'Product ID is required' });
        }
        if (!item.quantity || item.quantity < 1) {
          errors.push({ field: `items[${index}].quantity`, message: 'Quantity must be at least 1' });
        }
        if (!item.price || item.price <= 0) {
          errors.push({ field: `items[${index}].price`, message: 'Price must be greater than 0' });
        }
      });
    }

    // Validate total
    if (!order.total || order.total <= 0) {
      errors.push({ field: 'total', message: 'Total must be greater than 0' });
    }

    // Validate shipping info
    const requiredShippingFields: (keyof ShippingInfo)[] = ['firstName', 'lastName', 'address', 'city', 'state', 'zipCode', 'country'];
    requiredShippingFields.forEach(field => {
      if (!order.shipping[field]) {
        errors.push({ field: `shipping.${field}`, message: `${field} is required` });
      }
    });

    // Validate payment info
    if (!order.payment.cardNumber || !/^\d{16}$/.test(order.payment.cardNumber.replace(/\s/g, ''))) {
      errors.push({ field: 'payment.cardNumber', message: 'Card number must be 16 digits' });
    }
    if (!order.payment.expiryDate || !/^(0[1-9]|1[0-2])\/\d{2}$/.test(order.payment.expiryDate)) {
      errors.push({ field: 'payment.expiryDate', message: 'Expiry date must be in MM/YY format' });
    }
    if (!order.payment.cvv || !/^\d{3,4}$/.test(order.payment.cvv)) {
      errors.push({ field: 'payment.cvv', message: 'CVV must be 3 or 4 digits' });
    }

    return errors;
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unexpected error occurred';
    let validationErrors: ValidationError[] | undefined;

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      if (error.status === 400 && error.error.validationErrors) {
        validationErrors = error.error.validationErrors;
        errorMessage = 'Validation failed';
      } else if (error.status === 422) {
        errorMessage = 'Invalid order data';
      } else if (error.status === 500) {
        errorMessage = 'Server error occurred while processing the order';
      }
    }

    return throwError(() => ({
      status: error.status,
      message: errorMessage,
      validationErrors
    }));
  }

  placeOrder(cartItems: CartItem[], total: number, shipping: ShippingInfo, payment: PaymentInfo): Observable<OrderResponse> {
    const order: Order = {
      items: this.transformCartItemsToOrderItems(cartItems),
      total,
      shipping,
      payment
    };

    const validationErrors = this.validateOrder(order);
    if (validationErrors.length > 0) {
      return throwError(() => ({
        status: 400,
        message: 'Validation failed',
        validationErrors
      }));
    }

    // TODO: Get actual user ID from auth service
    const userId = 'test-user-123'; // Temporary hardcoded user ID

    return this.http.post<OrderResponse>(
      ORDER_API_PATH,
      order,
      {
        headers: {
          'X-User-ID': userId
        }
      }
    ).pipe(
      catchError(this.handleError)
    );
  }
} 