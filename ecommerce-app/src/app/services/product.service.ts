import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private mockProducts: Product[] = [
    {
      id: '1',
      name: 'Wireless Headphones',
      description: 'High-quality wireless headphones with noise cancellation',
      price: 199.99,
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      category: 'Electronics',
      stock: 15
    },
    {
      id: '2',
      name: 'Smart Watch',
      description: 'Feature-rich smartwatch with health tracking',
      price: 299.99,
      imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      category: 'Electronics',
      stock: 10
    },
    {
      id: '3',
      name: 'Laptop Backpack',
      description: 'Durable laptop backpack with multiple compartments',
      price: 49.99,
      imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      category: 'Accessories',
      stock: 20
    },
    {
      id: '4',
      name: 'Coffee Maker',
      description: 'Programmable coffee maker with thermal carafe',
      price: 79.99,
      imageUrl: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      category: 'Home',
      stock: 8
    },
    {
      id: '5',
      name: 'Fitness Tracker',
      description: 'Water-resistant fitness tracker with heart rate monitor',
      price: 89.99,
      imageUrl: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      category: 'Electronics',
      stock: 12
    }
  ];

  getProducts(): Observable<Product[]> {
    return of(this.mockProducts);
  }

  getProductById(id: string): Observable<Product | undefined> {
    return of(this.mockProducts.find(p => p.id === id));
  }
} 