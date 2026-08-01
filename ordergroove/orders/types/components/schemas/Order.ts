export type Order = {
  id?: string;
  public_id?: string;
  customer_id?: string;
  /**
   * @format date-time
   */
  place?: string;
  /**
   * Order status: unsent, pending, success, rejected, etc.
   */
  status?: string;
  sub_total?: string;
  shipping_total?: string;
  total?: string;
  order_merchant_id?: string;
  payment_id?: string;
  shipping_address_id?: string;
};
