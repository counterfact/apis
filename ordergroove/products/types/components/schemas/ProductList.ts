import type { Product } from "./Product.js";

export type ProductList = {
  results?: Array<Product>;
  next?: string;
  previous?: string;
};
