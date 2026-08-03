import type { itemsList } from "../types/paths/items.types.js";

export const GET: itemsList = async ($) => {
  const query = $.query as unknown as Record<string, unknown>;
  let items = $.context.state.items;
  if ($.query.order !== undefined) {
    items = items.filter((entry) => entry.order === $.query.order);
  }
  if ($.query.subscription !== undefined) {
    items = items.filter(
      (entry) => entry.subscription === $.query.subscription,
    );
  }
  if ($.query.product !== undefined) {
    items = items.filter((entry) => entry.product === $.query.product);
  }
  const oneTime = query.one_time;
  if (oneTime !== undefined) {
    const expectedOneTime = oneTime === true || oneTime === "true";
    items = items.filter((entry) => entry.one_time === expectedOneTime);
  }
  const status = query.status;
  if (status !== undefined) {
    const expectedStatus = Number(status);
    const matchingOrderIds = new Set(
      $.context.state.orders
        .filter((entry) => entry.status === expectedStatus)
        .map((entry) => entry.public_id),
    );
    items = items.filter((entry) => matchingOrderIds.has(entry.order));
  }
  if (
    typeof query.place === "string" ||
    typeof query.place_start === "string" ||
    typeof query.place_end === "string"
  ) {
    const ordersById = new Map(
      $.context.state.orders.map((entry) => [entry.public_id, entry]),
    );
    items = items.filter((entry) => {
      const place = ordersById.get(entry.order)?.place;
      return (
        place !== undefined &&
        (typeof query.place !== "string" || place === query.place) &&
        (typeof query.place_start !== "string" || place >= query.place_start) &&
        (typeof query.place_end !== "string" || place <= query.place_end)
      );
    });
  }

  return $.response[200].json(
    $.context.paginate(items, {
      headers: $.headers,
      path: "/items/",
      query,
    }),
  );
};
