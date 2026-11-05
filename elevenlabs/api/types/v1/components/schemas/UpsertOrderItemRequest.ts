import type { OrderItemRequest_Input } from "./OrderItemRequest-Input.js";
import type { ItemId } from "./ItemId.js";
export type UpsertOrderItemRequest = {
  /**
   * The order item to add or update.
   */
  item: OrderItemRequest_Input;
  /**
   * The ID of an existing item to update. Omit to create a new item.
   */
  item_id?: ItemId | null;
};
