import { Component } from '@angular/core';
import { ProductService, Product } from './product.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'IMB';
  products: Product[] = [];
  healthStatus: string = '';

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.getProducts();
  }

  getProducts() {
    this.productService.getProducts().subscribe(products => {
      this.products = products;
    });
    this.productService.getHealth().subscribe((data) => {
      this.healthStatus = data;
    }, error => {
      console.log(error); // Handle error
    });
  }
  
}
