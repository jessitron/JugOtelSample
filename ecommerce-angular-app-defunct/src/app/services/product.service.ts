import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Product } from '../models/product.model';

const PRODUCT_API_PATH="/api/products"

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor( private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>('/api/products')
      .pipe(
        map(products => products.map(product => ({
          ...product,
          imageUrl: product.imageUrl
        })))
      );
  }

  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(import.meta.env.NG_APP_COMMERCE_ENDPOINT + `/products/${id}`)
      .pipe(
        map(product => ({
          ...product,
          imageUrl: product.imageUrl
        }))
      );
  }
} 