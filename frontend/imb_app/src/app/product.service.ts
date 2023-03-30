import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { of } from 'rxjs';

// Define the Product interface here
export interface Product {
  productId?: number;
  productName: string;
  productOwnerName: string;
  developers: string[];
  scrumMasterName: string;
  startDate: string;
  methodology: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly PRODUCT_API_URL = 'http://localhost:3000/api/products';
  private products: Product[] = [];

  constructor(private http: HttpClient) { }

  // Get all products
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.PRODUCT_API_URL).pipe(
      tap((products: Product[]) => this.products = products),
      catchError(this.handleError<Product[]>('getProducts', []))
    );
  }

  // Get product by ID
  getProduct(id: number): Observable<Product> {
    const url = `${this.PRODUCT_API_URL}/${id}`;
    return this.http.get<Product>(url);
  }

  // Add new product
  addProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.PRODUCT_API_URL, product).pipe(
      tap((newProduct: Product) => this.products.push(newProduct)),
      catchError(this.handleError<Product>('addProduct'))
    );
  }

  // Update existing product
  updateProduct(product: Product): Observable<Product> {
    const url = `${this.PRODUCT_API_URL}/${product.productId}`;
    return this.http.put<Product>(url, product).pipe(
      map(updatedProduct => {
        const productIndex = this.products.findIndex(p => p.productId === updatedProduct.productId);
        if (productIndex !== -1) {
          this.products[productIndex] = updatedProduct;
        }
        return updatedProduct;
      }),
      catchError(this.handleError<Product>('updateProduct'))
    );
  }

  // Delete product
  deleteProduct(id: number): Observable<any> {
    const url = `${this.PRODUCT_API_URL}/${id}`;
    return this.http.delete(url).pipe(
      tap(() => {
        const productIndex = this.products.findIndex(p => p.productId === id);
        if (productIndex !== -1) {
          this.products.splice(productIndex, 1);
        }
      }),
      catchError(this.handleError<any>('deleteProduct'))
    );
  }

  // Get server health
  getHealth(): Observable<string> {
    return this.http.get<string>('http://localhost:3000/api/health');
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
