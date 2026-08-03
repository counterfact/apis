/**
 * @example {"merchant":"merchant_demo","external_product_id":"coffee_demo","name":"Example Coffee","price":"18.00","autoship_enabled":true,"discontinued":false}
 */
export type Product = {
  merchant: string;
  external_product_id: string;
  name: string;
  price: string;
  autoship_enabled: boolean;
  discontinued?: boolean;
  [key: string]: unknown;
};
