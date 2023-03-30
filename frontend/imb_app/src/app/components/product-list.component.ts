import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProductService, Product } from '../product.service';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { AddProductDialogComponent } from '../add-product-dialog/add-product-dialog.component';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  totalProducts = 0;
  errorMessage = '';
  productForm!: FormGroup;
  isEdit = false;
  selectedProduct: Product | undefined;
  showForm = false;

  private PRODUCT_API_URL = 'http://localhost:3000/api/products';

  constructor(
    private formBuilder: FormBuilder, 
    private productService: ProductService, 
    private http: HttpClient,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.productForm = this.formBuilder.group({
      productName: '',
      productOwnerName: '',
      scrumMasterName: '',
      developers: '',
      startDate: '',
      methodology: ''
    });
    this.loadProducts();
  }

  loadProducts(): void {
    this.http.get<Product[]>(this.PRODUCT_API_URL).subscribe(
      data => {
        this.products = data.sort((a, b) => (a.productId ?? 0) - (b.productId ?? 0));
        this.totalProducts = this.products.length;
      },
      error => {
        this.errorMessage = error.message;
      }
    );
  }

  showProductForm(): void {
    this.showForm = true;
  }

  hideProductForm(): void {
    this.showForm = false;
  }

  addProduct(newProduct: Product): void {
    this.products.push(newProduct);
    this.totalProducts++;
    this.productForm.reset();
    this.hideProductForm();
  }

  saveProduct(productToUpdate: Product): void {
    const productToSave: Product = {...productToUpdate};
    if (this.isEdit) {
      // Editing an existing product
      productToSave.productId = this.selectedProduct?.productId;
      this.productService.updateProduct(productToSave).subscribe(
        product => {
          const index = this.products.findIndex(p => p.productId === product.productId);
          if (index !== -1) {
            this.products[index] = product;
          }
          this.isEdit = false;
          this.selectedProduct = undefined;
          this.productForm.reset();
          this.hideProductForm();
        },
        error => {
          this.errorMessage = error.message;
          this.handleProductAddError(error);
        }
      );
    } else {
      // Adding a new product
      this.productService.addProduct(productToSave).subscribe(
        product => {
          this.addProduct(product);
          this.handleProductAdded(product);
        },
        error => {
          this.errorMessage = error.message;
          this.handleProductAddError(error);
        }
      );
    }
  }
  
  updateProduct(product: Product): void {
    this.productService.updateProduct(product)
      .subscribe(updatedProduct => {
        this.selectedProduct = undefined;
        this.isEdit = false;
      });
  }
  
editProduct(product: any) {
  this.selectedProduct = product;
  this.isEdit = true;
}


  deleteProduct(product: Product): void {
    // eslint-disable-next-line no-restricted-globals
    if (confirm(`Are you sure you want to delete product "${product.productName}"?`)) {
      if (product.productId !== undefined) {
        this.productService.deleteProduct(product.productId).subscribe(() => {
          const index = this.products.findIndex(p => p.productId === product.productId);
          if (index !== -1) {
            this.products.splice(index, 1);
            this.totalProducts--;
          }
        });
      }
    }
  }

  // New dialogue below
  handleProductAdded(newProduct: Product) {
    console.log(`Product "${newProduct.productName}" added successfully!`);
  }

  handleProductAddError(error: any) {
    console.log(`Error adding product: ${error.message}`);
  }
   // Add this method
   showAddProductDialog() {
    const dialogRef = this.dialog.open(AddProductDialogComponent);
  
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      if (result === 'confirm') {
        if (this.selectedProduct) {
          this.saveProduct(this.selectedProduct);
        }
      }
    });
  }
}