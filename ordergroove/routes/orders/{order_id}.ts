import type { ordersRetrieve } from "../../types/paths/orders/{order_id}.types.js";

export const GET: ordersRetrieve = async ($) => {
  const order = $.context.state.orders.find(
    (entry) => entry.public_id === $.path.order_id,
  );
  const includeHasPlan =
    $.query.include_has_plan === true ||
    ($.query.include_has_plan as unknown) === "true";
  const responseOrder =
    order && includeHasPlan
      ? {
          ...order,
          has_plan: $.context.state.items
            .filter((item) => item.order === order.public_id)
            .some(
              (item) =>
                $.context.state.products.find(
                  (product) => product.external_product_id === item.product,
                )?.product_type === "plan",
            ),
        }
      : order;
  return responseOrder
    ? $.response[200].json(responseOrder)
    : $.response[404].json({ detail: "Unable to find requested asset." });
};
