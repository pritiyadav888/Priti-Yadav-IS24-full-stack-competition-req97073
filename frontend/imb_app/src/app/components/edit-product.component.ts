import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService, Product } from '../product.service';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit {
  productId: number = 0;
  productForm: FormGroup = new FormGroup({});
  errorMessage: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) { }

  ngOnInit() {
    this.productId = Number(this.route.snapshot.paramMap.get('id'));

    this.productService.getProduct(this.productId).subscribe(product => {
      this.productForm = this.formBuilder.group({
        productName: [product.productName, Validators.required],
        productOwnerName: [product.productOwnerName, Validators.required],
        scrumMasterName: [product.scrumMasterName, Validators.required],
        developers: [product.developers.join(','), Validators.required],
        startDate: [product.startDate, Validators.required],
        methodology: [product.methodology, Validators.required]
      });
    });
  }

  onSubmit() {
    const updatedProduct: Product = {
      productId: this.productId,
      productName: this.productForm.value.productName,
      productOwnerName: this.productForm.value.productOwnerName,
      scrumMasterName: this.productForm.value.scrumMasterName,
      developers: this.productForm.value.developers.split(','),
      startDate: this.productForm.value.startDate,
      methodology: this.productForm.value.methodology
    };

    this.productService.updateProduct(updatedProduct).subscribe(
      () => {
        // Redirect to the product list after updating the product
        this.router.navigate(['/products']);
      },
      error => {
        this.errorMessage = error.message;
      }
    );
  }
}
