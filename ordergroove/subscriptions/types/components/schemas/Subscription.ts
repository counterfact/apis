export type Subscription = {
  id?: string;
  public_id?: string;
  customer_id?: string;
  product_id?: string;
  quantity?: number;
  payment_id?: string;
  shipping_address_id?: string;
  offer_id?: string;
  every?: number;
  every_period?: "day" | "week" | "month" | "year";
  live?: boolean;
};
