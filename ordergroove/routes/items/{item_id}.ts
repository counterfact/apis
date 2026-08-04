import type { itemsRetrieve } from "../../types/paths/items/{item_id}.types.js";

const withoutPriceCalculation = <Item extends Record<string, unknown>>(
  item: Item,
) => {
  const result = { ...item };
  delete result.price;
  delete result.total_cost;
  delete result.extra_cost;
  return result;
};

export const GET: itemsRetrieve = async ($) => {
  const item = $.context.state.items.find(
    (entry) => entry.public_id === $.path.item_id,
  );
  const omitPriceCalculation =
    $.query.omit_price_calculation === true ||
    ($.query.omit_price_calculation as unknown) === "true";
  const responseItem =
    item && omitPriceCalculation ? withoutPriceCalculation(item) : item;
  return responseItem
    ? $.response[200].json(responseItem)
    : $.response[404].json({ detail: "Unable to find requested asset." });
};
