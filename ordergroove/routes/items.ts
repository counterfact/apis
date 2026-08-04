import type { itemsList } from "../types/paths/items.types.js";

const withoutPriceCalculation = <Item extends Record<string, unknown>>(
  item: Item,
) => {
  const result = { ...item };
  delete result.price;
  delete result.total_cost;
  delete result.extra_cost;
  return result;
};

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
  if (typeof query.offer === "string") {
    items = items.filter((entry) => entry.offer === query.offer);
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
  if (
    typeof query.order_updated_start === "string" ||
    typeof query.order_updated_end === "string"
  ) {
    const ordersById = new Map(
      $.context.state.orders.map((entry) => [entry.public_id, entry]),
    );
    items = items.filter((entry) => {
      const updated = ordersById.get(entry.order)?.updated;
      return (
        updated !== undefined &&
        (typeof query.order_updated_start !== "string" ||
          updated >= query.order_updated_start) &&
        (typeof query.order_updated_end !== "string" ||
          updated <= query.order_updated_end)
      );
    });
  }

  const omitPriceCalculation =
    query.omit_price_calculation === true ||
    query.omit_price_calculation === "true";
  const includeIncentives =
    query.include_incentives === true || query.include_incentives === "true";
  const responseItems = items.map((item) => {
    const result = omitPriceCalculation ? withoutPriceCalculation(item) : item;
    return includeIncentives
      ? { ...result, incentives: item.incentives ?? [] }
      : result;
  });

  return $.response[200].json(
    $.context.paginate(responseItems, {
      headers: $.headers,
      path: "/items/",
      query,
    }),
  );
};
