import type { ordersList } from "../types/paths/orders.types.js";

export const GET: ordersList = async ($) => {
  const query = $.query as unknown as Record<string, unknown>;
  let orders = $.context.state.orders;
  if ($.query.customer !== undefined) {
    orders = orders.filter((entry) => entry.customer === $.query.customer);
  }
  if ($.query.status !== undefined) {
    orders = orders.filter((entry) => entry.status === $.query.status);
  }
  if ($.query.subscription !== undefined) {
    const orderIds = new Set(
      $.context.state.items
        .filter((entry) => entry.subscription === $.query.subscription)
        .map((entry) => entry.order),
    );
    orders = orders.filter((entry) => orderIds.has(entry.public_id));
  }
  for (const [name, field] of [
    ["place", "place"],
    ["created", "created"],
    ["updated", "updated"],
  ] as const) {
    const exact = query[name];
    if (typeof exact === "string") {
      orders = orders.filter((entry) => entry[field].startsWith(exact));
    }
    const start = query[`${name}_start`];
    if (typeof start === "string") {
      orders = orders.filter((entry) => entry[field] >= start);
    }
    const end = query[`${name}_end`];
    if (typeof end === "string") {
      orders = orders.filter((entry) => entry[field] <= end);
    }
  }

  const includeHasPlan =
    query.include_has_plan === true || query.include_has_plan === "true";
  const responseOrders = includeHasPlan
    ? orders.map((order) => ({
        ...order,
        has_plan: $.context.state.items
          .filter((item) => item.order === order.public_id)
          .some(
            (item) =>
              $.context.state.products.find(
                (product) => product.external_product_id === item.product,
              )?.product_type === "plan",
          ),
      }))
    : orders;

  return $.response[200].json(
    $.context.paginate(responseOrders, {
      headers: $.headers,
      path: "/orders/",
      query: $.query,
    }),
  );
};
