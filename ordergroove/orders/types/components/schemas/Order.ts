export type Order = {
  id?: string;
  public_id?: string;
  customer_id?: string;
  /**
   * @format date-time
   */
  place?: string;
  /**
   * Order status code. See https://developer.ordergroove.com/reference/order-status-codes.
   */
  status?: 1 | 3 | 4 | 5 | 6 | 9 | 10;
  sub_total?: string;
  shipping_total?: string;
  total?: string;
  order_merchant_id?: string;
  payment_id?: string;
  shipping_address_id?: string;
};
