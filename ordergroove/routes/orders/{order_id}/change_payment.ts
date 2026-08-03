import type { ordersChangePayment } from "../../../types/paths/orders/{order_id}/change_payment.types.js";
import { DomainError } from "../../../domain/store.ts";

export const PATCH: ordersChangePayment = async ($) => {
  // Source: https://developer.ordergroove.com/reference/orders-change-payment
  try {
    return $.response[200].json(
      $.context.store.changeOrderPayment($.path.order_id, $.body.payment),
    );
  } catch (error) {
    if (error instanceof DomainError) {
      const response = error.status === 404 ? $.response[404] : $.response[400];
      return response.json({ detail: error.message });
    }
    throw error;
  }
};
