import type { ItemId } from "./ItemId.js";
import type { QuoteInfo } from "./QuoteInfo.js";
/**
 * @example {"item_id":"proditem_01jgd3qhejfs7rm6swknz2ytjb","quote":{"amount_usd":11}}
 */
export type UpsertOrderItemResponse = {
  /**
   * The ID of the upserted order item.
   */
  item_id: ItemId;
  /**
   * The quoted price for this item.
   */
  quote?: QuoteInfo | null;
};
