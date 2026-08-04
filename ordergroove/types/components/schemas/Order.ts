import type { OrderStatus } from "./OrderStatus.js";

export type Order = {
  merchant: string;
  customer: string;
  payment?: string | null;
  shipping_address?: string | null;
  public_id: string;
  sub_total?: string;
  tax_total?: string;
  shipping_total?: string;
  discount_total?: string;
  total?: string;
  created: string;
  updated: string;
  place: string;
  cancelled?: string | null;
  tries?: number;
  generic_error_count?: number;
  status: OrderStatus;
  type?: number;
  merchant_order_id?: string | null;
  order_merchant_id?: string | null;
  rejected_message?: string | null;
  locked?: boolean | null;
  oos_free_shipping?: boolean | null;
  extra_data?: { [key: string]: unknown } | string | null;
  [key: string]: unknown;
};
