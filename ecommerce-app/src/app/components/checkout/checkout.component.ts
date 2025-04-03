import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CartService } from '../../services/cart.service';
import { OrderService, OrderResponse } from '../../services/order.service';
import { CartItem } from '../../models/product.model';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class CheckoutComponent implements OnInit {
  checkoutForm: FormGroup;
  cartItems: CartItem[] = [];
  total = 0;

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router
  ) {
    this.checkoutForm = this.fb.group({
      shipping: this.fb.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        address: ['', Validators.required],
        city: ['', Validators.required],
        state: ['', Validators.required],
        zipCode: ['', [Validators.required, Validators.pattern('^[0-9]{5}$')]],
        country: ['', Validators.required]
      }),
      payment: this.fb.group({
        cardNumber: ['', [Validators.required, Validators.pattern('^[0-9]{16}$')]],
        expiryDate: ['', [Validators.required, Validators.pattern('^(0[1-9]|1[0-2])\/([0-9]{2})$')]],
        cvv: ['', [Validators.required, Validators.pattern('^[0-9]{3,4}$')]]
      })
    });
  }

  ngOnInit(): void {
    this.cartItems = this.cartService.getCartItems();
    this.total = this.cartService.getTotal();
    
    if (this.cartItems.length === 0) {
      this.router.navigate(['/cart']);
    }
  }

  onSubmit(): void {
    if (this.checkoutForm.valid) {
      const order = {
        items: this.cartItems,
        total: this.total,
        shipping: this.checkoutForm.get('shipping')?.value,
        payment: this.checkoutForm.get('payment')?.value
      };

      this.orderService.placeOrder(order).subscribe(
        (response: OrderResponse) => {
          this.cartService.clearCart();
          this.router.navigate(['/order-success', response.orderId]);
        },
        (error: Error) => {
          console.error('Error placing order:', error);
          // Handle error appropriately
        }
      );
    }
  }
} 