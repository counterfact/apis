import type { Order } from "./Order.js";

export type OrderList = {
  results?: Array<Order>;
  next?: string;
  previous?: string;
};
