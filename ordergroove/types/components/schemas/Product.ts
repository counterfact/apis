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
  groups?: Array<{ [key: string]: unknown }>;
  /**
   * @format uri
   */
  image_url?: string | null;
  /**
   * @format uri
   */
  detail_url?: string | null;
  sku?: string | null;
  premier_enabled?: boolean | null;
  created?: string | null;
  last_update?: string | null;
  live?: boolean | null;
  offer_profile?: string | null;
  extra_data?: { [key: string]: unknown } | string | null;
  incentive_group?: string | null;
  product_type?: string | null;
  autoship_by_default?: boolean | null;
  every?: number | null;
  every_period?: number | null;
  [key: string]: unknown;
};
