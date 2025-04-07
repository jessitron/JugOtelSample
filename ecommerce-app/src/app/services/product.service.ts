import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Product } from '../models/product.model';

const COMMERCE_ENDPOINT = import.meta.env.NG_APP_COMMERCE_ENDPOINT;

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor( private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${COMMERCE_ENDPOINT}/products`)
      .pipe(
        map(products => products.map(product => ({
          ...product,
          imageUrl: `${COMMERCE_ENDPOINT}${product.imageUrl}`
        })))
      );
  }

  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${COMMERCE_ENDPOINT}/products/${id}`)
      .pipe(
        map(product => ({
          ...product,
          imageUrl: `${COMMERCE_ENDPOINT}/${product.imageUrl}`
        }))
      );
  }
} 