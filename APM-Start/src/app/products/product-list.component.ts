import { Component, OnInit, ChangeDetectionStrategy,  } from '@angular/core';

import { Observable, of, EMPTY } from 'rxjs';

import { Product } from './product';
import { ProductService } from './product.service';
import { catchError } from 'rxjs/operators';

@Component({
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush // increases load time as it only looks for specific changes
})
export class ProductListComponent { // we dont need onInit now
  pageTitle = 'Product List';
  errorMessage = '';
  categories;

 // products: Product[] = []; to switch the array into an observable it becomes
 //products$: Observable<Product[]>
  //sub: Subscription;
  products$ = this.productService.productsWithCategories$ // we can set directly to the observable within the service
  .pipe( // still has the same pipe method 
    catchError(err => {
      this.errorMessage = err; // we set the error message to the one that is passed in
      return EMPTY;
    })
  ); 

  constructor(private productService: ProductService) { } // we inject the product service we made into the component constructor

/*  ngOnInit(): void { // every time page is initialized, it gets the product service and subscribes to start the stream
    this.sub = this.productService.getProducts()
      .subscribe(
        products => this.products = products, // stores a local product
        error => this.errorMessage = error
      );
       ngOnDestroy(): void { // unsubscribe when the page stops 
    this.sub.unsubscribe();
  }
  }*/


  // however, there is a trick that allows you to display the products array as a set up observable
  // therefore, you dont need to do the inhouse subsribe methods 
  // it will become the following, ondestory wont be needed as it unsubscribes automatically

  onAdd(): void {
    console.log('Not yet implemented');
  }

  onSelected(categoryId: string): void {
    console.log('Not yet implemented');
  }
}
