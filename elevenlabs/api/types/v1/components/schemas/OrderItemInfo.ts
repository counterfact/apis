import type { ItemId } from "./ItemId.js";
import type { OrderItemRequest_Output } from "./OrderItemRequest-Output.js";
import type { QuoteInfo } from "./QuoteInfo.js";
/**
 * @example {"item":{"captions_sdh":false,"destination_languages":["hi","fr-FR","de"],"include_captions":true,"include_source_captions":false,"instructions":"Voices don't need to match the originals, prioritize native-sounding voices","kind":"dub","media_id":"prodmedia_01jgatk6h0fwxrtbjade61yqhx","source_language":"en"},"item_id":"proditem_01jgd3qhejfs7rm6swknz2ytjb","quote":{"amount_usd":11}}
 */
export type OrderItemInfo = {
  /**
   * The ID of the order item.
   */
  item_id: ItemId;
  /**
   * The item configuration details.
   */
  item: OrderItemRequest_Output;
  /**
   * The quoted price for this item.
   */
  quote?: QuoteInfo | null;
};
