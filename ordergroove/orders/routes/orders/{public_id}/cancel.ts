import type { cancelOrder } from "../../../types/paths/orders/{public_id}/cancel.types.js";

export const POST: cancelOrder = async ($) => {
  return $.response[200].random();
};
