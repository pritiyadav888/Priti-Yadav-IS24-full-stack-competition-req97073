import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ProductService } from '../product.service';
import { Product } from '../product.service';
import { MatDialogRef } from '@angular/material/dialog';

interface ProductFormValue {
  productName: string;
  scrumMasterName: string;
  productOwnerName: string;
  developers: string;
  startDate: string;
  methodology: string;
}

@Component({
  selector: 'app-add-product-dialog',
  templateUrl: './add-product-dialog.component.html',
  styleUrls: ['./add-product-dialog.component.css']
})
export class AddProductDialogComponent implements OnInit {
  productForm!: FormGroup;
  productName!: string;
  scrumMasterName!: string;
  productOwnerName!: string;
  developers!: string;
  startDate!: string;
  methodology!: string;

  @Output() productAdded = new EventEmitter<Product>();
  errorMessage!: string;

  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private dialogRef: MatDialogRef<AddProductDialogComponent>
  ) { }

  ngOnInit(): void {
    this.productForm = this.formBuilder.group({
      productName: ['', Validators.required],
      scrumMasterName: ['', Validators.required],
      productOwnerName: ['', Validators.required],
      developers: ['', Validators.required],
      startDate: ['', Validators.required],
      methodology: ['', Validators.required]
    }) as FormGroup & { value: ProductFormValue };
  }
  
  addProduct() {
    const newProduct = this.productForm.value as Product;
    // split developerNames by comma and remove any leading/trailing whitespaces
    newProduct.developers = this.productForm.value.developers.split(',').map((name: string) => name.trim());
    this.productService.addProduct(newProduct).subscribe(
      (product: Product) => {
        this.productAdded.emit(product);
      },
      error => {
        this.errorMessage = error.message;
      }
    );
  }

  cancel() {
    this.productForm.reset();
    this.dialogRef.close();
  }
}
