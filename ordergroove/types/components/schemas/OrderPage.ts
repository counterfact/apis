import type { Order } from "./Order.js";

export type OrderPage = {
  /**
   * @format uri
   */
  next: string | null;
  /**
   * @format uri
   */
  previous: string | null;
  results: Array<Order>;
};
