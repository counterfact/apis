import type { OrderId } from "./OrderId.js";
import type { OrderState } from "./OrderState.js";
import type { OrderItemInfo } from "./OrderItemInfo.js";
/**
 * @example {"created_at":"2025-03-15T10:00:00Z","items":[{"item":{"captions_sdh":false,"destination_languages":["hi","fr-FR","de"],"include_captions":true,"include_source_captions":false,"instructions":"Voices don't need to match the originals, prioritize native-sounding voices","kind":"dub","media_id":"prodmedia_01jgb2zd68f8f9tfvbb968wb8z","source_language":"en"},"item_id":"proditem_01jgd3qhejfs7rm6swknz2ytjb","quote":{"amount_usd":11}}],"name":"Spanish Dubs","order_id":"prodorder_01jgatk6h0fwxrtbjade61yqhx","sandbox":false,"state":"open","total_amount_usd":11}
 */
export type OrderResponse = {
  /**
   * The ID of the order.
   */
  order_id: OrderId;
  /**
   * The display name of the order.
   */
  name: string;
  /**
   * The current state of the order.
   */
  state: OrderState;
  /**
   * The list of items in this order with their quotes.
   */
  items: Array<OrderItemInfo>;
  /**
   * The total price for all items in USD. Excluded from response until quotes are available.
   */
  total_amount_usd?: number | null;
  /**
   * Whether this is a sandbox order that auto-progresses without producer intervention.
   * @default false
   */
  sandbox?: boolean;
  /**
   * The timestamp when the order was created.
   * @format date-time
   */
  created_at: string;
  /**
   * The timestamp when the order was submitted, if applicable.
   */
  submitted_at?: string | null;
  /**
   * The timestamp when payment was received, if applicable.
   */
  paid_at?: string | null;
  /**
   * The timestamp when the order was accepted for production, if applicable.
   */
  accepted_at?: string | null;
  /**
   * The timestamp when the order was completed, if applicable.
   */
  completed_at?: string | null;
  /**
   * The reason the order was cancelled, if applicable.
   */
  cancel_reason?: string | null;
};
