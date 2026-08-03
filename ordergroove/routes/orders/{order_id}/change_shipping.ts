import type { ordersChangeShippingAddress } from "../../../types/paths/orders/{order_id}/change_shipping.types.js";

export const PATCH: ordersChangeShippingAddress = async ($) => {
  const order = $.context.state.orders.find(
    (entry) => entry.public_id === $.path.order_id,
  );
  if (!order) {
    return $.response[404].json({ detail: "Unable to find requested asset." });
  }
  const address = $.context.state.addresses.find(
    (entry) => entry.public_id === $.body.shipping_address,
  );
  if (!address || !address.live || address.customer !== order.customer) {
    return $.response[400].json({ detail: "Invalid shipping address." });
  }

  order.shipping_address = address.public_id;
  return $.response[200].json(order);
};
