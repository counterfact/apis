import type { ordersChangeShippingAddress } from "../../../types/paths/orders/{order_id}/change_shipping.types.js";

export const PATCH: ordersChangeShippingAddress = async ($) => {
  return $.response[200].random();
};
