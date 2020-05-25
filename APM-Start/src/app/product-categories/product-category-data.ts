import { ProductCategory } from './product-category';
// files for retrieving product categories
export class ProductCategoryData {

  static categories: ProductCategory[] = [
    {
      id: 1,
      name: 'Garden'
    },
    {
      id: 3,
      name: 'Toolbox'
    },
    {
      id: 5,
      name: 'Gaming'
    }
  ];
}
