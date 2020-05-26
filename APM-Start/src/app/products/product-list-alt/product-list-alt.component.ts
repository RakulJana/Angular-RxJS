import { Component, OnInit } from '@angular/core';

import {  Observable, EMPTY } from 'rxjs';

import { Product } from '../product';
import { ProductService } from '../product.service';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'pm-product-list',
  templateUrl: './product-list-alt.component.html'
})
export class ProductListAltComponent {
  pageTitle = 'Products';
  errorMessage = '';
  selectedProductId;
  
  products$ = this.productService.productsWithCategories$
  .pipe(
    catchError(err => {
      this.errorMessage = err;
      return EMPTY;
    })
  )

  constructor(private productService: ProductService) { }

  onSelected(productId: number): void { // passes in the selected id
    this.productService.selectedProductChanged(productId)
  }
}
