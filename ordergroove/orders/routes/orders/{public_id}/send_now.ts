import type { sendOrderNow } from "../../../types/paths/orders/{public_id}/send_now.types.js";

export const POST: sendOrderNow = async ($) => {
  return $.response[200].random();
};
