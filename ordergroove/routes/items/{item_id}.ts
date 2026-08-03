import type { itemsRetrieve } from "../../types/paths/items/{item_id}.types.js";

export const GET: itemsRetrieve = async ($) => {
  return $.response[200].random();
};
