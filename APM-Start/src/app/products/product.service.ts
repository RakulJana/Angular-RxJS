import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, throwError, combineLatest } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';

import { Product } from './product'; // we add in this import from product.ts
import { Supplier } from '../suppliers/supplier';
import { SupplierService } from '../suppliers/supplier.service';
import { ProductCategoryService } from '../product-categories/product-category.service'; // auto import this 

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productsUrl = 'api/products';
  private suppliersUrl = this.supplierService.suppliersUrl;

  /*
    products$ = this.http.get<Product[]>(this.productsUrl) // makes sure it is in the format from the product.ts
  .pipe( // pipe is used to look through, this gets the data from the back end
    // since it is in the product interface shape (the rtesponse), to map, we need to dereference
    map(products => // map emitted array
      products.map(product => ({ // within the map function we now use the arrays mnap method, to map each
        ...product,
        price:product.price * 1.5, // transform each array element
        searchKey: [product.productName]
      }) as Product) // as clause needed to type the resuly 
      ),
    tap(data => console.log('Products: ', JSON.stringify(data))),
    catchError(this.handleError)
  ); 
  */
  
  // what this does now, is it directly removes the method and makes it implicit
  products$ = this.http.get<Product[]>(this.productsUrl) // makes sure it is in the format from the product.ts
  .pipe( // pipe is used to look through, this gets the data from the back end
    tap(data => console.log('Products: ', JSON.stringify(data))),
    catchError(this.handleError)
  ); 
  
  
  // now within this, we will make a new operator that combines productCategories$ and products4
  // we will store this in productsWithCategories$
  productsWithCategories$ = combineLatest([
    this.products$,
    this.productCategoryService.productCategories$ // i got this by importing and adding it to my constructor
  ]).pipe(
    map(([products, categories]) =>  // i mapped the observable and declared two named arrays, destructuring
      products.map(product => ({ // now i push into each array and dereference with product
        ...product,
        price: product.price * 1.5,
        category: categories.find(c => product.categoryId === c.id).name, // in this it checks the actual products with categories to name
        searchKey: [product.productName]
      }) as Product)
    )
  )

  // to get a single product detail, we can create another selectedProduct observable from the existing one
  selectedProduct$ = this.productsWithCategories$
      .pipe(
        map(products => // array name
          products.find(product => // each item
            product.id === 5)) // passed to see if it equals 5, hard coded for now as no action stream 
      )

  constructor(private http: HttpClient, private supplierService: SupplierService,
    private productCategoryService: ProductCategoryService) { } // injects HTTPclient into the service
/* 
bottomg part is a method to get the list of products
- Observable<Product[] specifies the type returns by the product\
// http get for the reutrn is set so it automatically maps to that shape
*/


  private fakeProduct() {
    return {
      id: 42,
      productName: 'Another One',
      productCode: 'TBX-0042',
      description: 'Our new product',
      price: 8.9,
      categoryId: 3,
      category: 'Toolbox',
      quantityInStock: 30
    };
  }

  private handleError(err: any) {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Backend returned code ${err.status}: ${err.body.error}`;
    }
    console.error(err);
    return throwError(errorMessage);
  }

}
