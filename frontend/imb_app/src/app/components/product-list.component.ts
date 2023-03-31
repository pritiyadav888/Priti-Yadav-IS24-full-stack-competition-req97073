import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProductService, Product } from '../product.service';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { AddProductDialogComponent } from '../add-product-dialog/add-product-dialog.component';
import { FilterPipe } from '../filter.pipe';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  totalProducts = 0;
  errorMessage = '';
  productForm!: FormGroup;
  isEdit = false;
  selectedProduct: Product | undefined;
  showForm = false;
  searchText: string = '';
  filteredProducts: any[];

  private PRODUCT_API_URL = 'http://localhost:3000/api/products';

  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private http: HttpClient,
    private dialog: MatDialog
  ) {
    this.filteredProducts = [];
  }

  ngOnInit(): void {
    this.productForm = this.formBuilder.group({
      productName: '',
      productOwnerName: '',
      scrumMasterName: '',
      developers: '',
      startDate: '',
      methodology: '',
    });
    this.loadProducts();
    this.selectedProduct = undefined;
  }

  onBackButtonClick(): void {
    location.reload();
  }
  
  
  loadProducts(): void {
    this.http.get<Product[]>(this.PRODUCT_API_URL).subscribe(
      (data) => {
        this.products = data.sort(
          (a, b) => (a.productId ?? 0) - (b.productId ?? 0)
        );
        this.totalProducts = this.products.length;
      },
      (error) => {
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
    const productToSave: Product = { ...productToUpdate };
    if (this.isEdit) {
      // Editing an existing product
      productToSave.productId = this.selectedProduct?.productId;
      this.productService.updateProduct(productToUpdate.productId!, productToSave).subscribe(
        (product) => {
          const index = this.products.findIndex(
            (p) => p.productId === product.productId
          );
          if (index !== -1) {
            this.products[index] = product;
          }
          this.isEdit = false;
          this.selectedProduct = undefined;
        },
        (error) => {
          this.errorMessage = error.message;
          this.handleProductAddError(error);
        }
      );
    } else {
      // Adding a new product
      this.productService.addProduct(productToSave).subscribe(
        (product) => {
          this.products.push(product);
          this.totalProducts++;
          this.selectedProduct = undefined;
          this.isEdit = false;
          this.handleProductAdded(product);
        },
        (error) => {
          this.errorMessage = error.message;
          this.handleProductAddError(error);
        }
      );
    }
  }

// Update product
updateProduct(product: Product, event: Event): void {
  // Get updated values from table cells
  const productName = (event.target as HTMLElement)
    .closest('tr')
    ?.querySelector('td:nth-child(2)')?.textContent ?? '';
  const productOwnerName = (event.target as HTMLElement)
    .closest('tr')
    ?.querySelector('td:nth-child(3)')?.textContent ?? '';
  const scrumMasterName = (event.target as HTMLElement)
    .closest('tr')
    ?.querySelector('td:nth-child(4)')?.textContent ?? '';
  const developers = (event.target as HTMLElement)
    .closest('tr')
    ?.querySelector('td:nth-child(5)')?.textContent;
    const methodologySelect = (event.target as HTMLElement)
    .closest('tr')
    ?.querySelector('td:nth-child(7) select') as HTMLSelectElement;
  const methodology = methodologySelect?.value ?? '';

  // Create a new Product object with updated values
  const updatedProduct: Product = {
    ...product,
    productName,
    productOwnerName,
    scrumMasterName,
    developers: developers ? developers.split(', ') : [],
    methodology,
  };
  // Check if any of the required fields are empty
  function generateErrorMessage(fields: { value: any; message: string }[]): string {
    return fields.reduce((acc, field) => {
      if (!field.value) {
        acc += field.message;
      }
      return acc;
    }, '');
  }
  
  const fields = [
    { value: productName, message: 'Product Name field is required. ' },
    { value: productOwnerName, message: 'Product Owner Name field is required. ' },
    { value: scrumMasterName, message: 'Scrum Master Name field is required. ' },
    { value: developers, message: 'Developers field is required. ' },
    { value: methodology, message: 'Methodology field is required. ' },
  ];
  
  const errorMessage = generateErrorMessage(fields);
  
  if (errorMessage) {
    this.productAddedMessage = errorMessage;
    setTimeout(() => {
      this.productAddedMessage = undefined;
    }, 3000);
    return;
  }
    // Call productService.updateProduct() to update product on server
  this.productService.updateProduct(product.productId!, updatedProduct).subscribe(
    (updatedProduct) => {
      // Update product in products array
      const index = this.products.findIndex(
        (p) => p.productId === updatedProduct.productId
      );
      if (index !== -1) {
        this.products[index] = updatedProduct;
      }

      // Reset isEdit and selectedProduct properties
      this.isEdit = false;
      this.selectedProduct = undefined;

      // Display "product updated" message
      this.productAddedMessage = 'Product updated! 🎉👏';
      setTimeout(() => {
        this.productAddedMessage = undefined;
      }, 3000);
    },
    (error) => {
      // Handle error
      console.error(error);
    }
  );
}

editProduct(product: any) {
    this.selectedProduct = product;
    this.isEdit = true;
  }
cancelEdit(): void {
    this.isEdit = false;
    this.selectedProduct = undefined;
  }
deleteProduct(product: Product): void {
    // eslint-disable-next-line no-restricted-globals
    if (
      confirm(
        `Are you sure you want to delete product "${product.productName}"?`
      )
    ) {
      if (product.productId !== undefined) {
        this.productService.deleteProduct(product.productId).subscribe(() => {
          const index = this.products.findIndex(
            (p) => p.productId === product.productId
          );
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
  productAddedMessage?: string;

showAddProductDialog() {
  const dialogRef = this.dialog.open(AddProductDialogComponent);

  dialogRef.componentInstance.productAdded.subscribe((product: Product) => {
    this.getProducts();
    this.productAddedMessage = 'New product added! 🎉👏';
    setTimeout(() => {
      this.productAddedMessage = undefined;
    }, 3000);
  });

  dialogRef.afterClosed().subscribe((result) => {
    console.log(`Dialog result: ${result}`);
    if (result === 'confirm') {
      if (this.selectedProduct) {
        this.saveProduct(this.selectedProduct);
      }
    }
  });
}
getProducts() {
    this.productService.getProducts().subscribe(
      (products: Product[]) => {
        this.products = products;
      },
      error => {
        this.errorMessage = error.message;
      }
    );
  }
}
