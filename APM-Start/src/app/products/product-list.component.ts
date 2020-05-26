import { Component, OnInit, ChangeDetectionStrategy,  } from '@angular/core';

import { Observable, of, EMPTY, Subject, combineLatest, BehaviorSubject } from 'rxjs';
import {map} from 'rxjs/operators'

import { Product } from './product';
import { ProductService } from './product.service';
import { catchError } from 'rxjs/operators';
import { ProductCategoryService } from '../product-categories/product-category.service';

@Component({
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush // increases load time as it only looks for specific changes
})
export class ProductListComponent { // we dont need onInit now
  pageTitle = 'Product List';
  errorMessage = '';

  // first we create an action stream, that emits the category id, which is a number
  private categorySelectedSubject = new BehaviorSubject<number>(0); // creates subject of type number
  // second we expose the subjects observerable, as observable
  categorySelectedAction$ = this.categorySelectedSubject.asObservable();

  // finally we bind the data and action stream, this code is added to the products$ observable
  
  //selectedCategoryId = 1;

 // products: Product[] = []; to switch the array into an observable it becomes
 //products$: Observable<Product[]>
  //sub: Subscription;
  products$ = combineLatest([
    this.productService.productsWithCategories$, // combine product data
    this.categorySelectedAction$ // combines selected action stream data 
  ])// we can set directly to the observable within the service
  .pipe( // still has the same pipe method // can also do a start with 0 to make sure everything displays
    map(([products, selectedCategoryId]) => // maps the two products and category ID
      products.filter(product => 
        selectedCategoryId ? product.categoryId === selectedCategoryId : true // check, similar to the simple filter from before 
        ) // checks to see if the number in the action stream is the same as the product 
    ),
    catchError(err => {
      this.errorMessage = err; // we set the error message to the one that is passed in
      return EMPTY;
    })
  );

  // now i would need to add in an observable for the categories, went into the html and changes it to use 
  // the observable
  categories$ = this.productCategoryService.productCategories$
    .pipe(
      catchError(err => {
        this.errorMessage = err;
        return EMPTY;
      })
    )
  
  // to hard code another filter we can hard code like below

  /*productsSimpleFilter$ = this.productService.productsWithCategories$
    .pipe(
      map(products => // gets the array
        products.filter(product => // dereferences for each 
          this.selectedCategoryId ? product.categoryId === this.selectedCategoryId : true
          )
        )
    ) */

  

    // I also want to make an observable which just gets the categopries, from product-category service
  constructor(private productService: ProductService,
              private productCategoryService: ProductCategoryService) { } // we inject the product service we made into the component constructor

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
    //this.selectedCategoryId =+ categoryId // sets selected category id to what was passed in from dom
    this.categorySelectedSubject.next(+categoryId) // so it passes the category ID into the selected subject action stream 
  }
}
