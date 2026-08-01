import type { listItems } from "../types/paths/items.types.js";
import type { createItem } from "../types/paths/items.types.js";

export const GET: listItems = async ($) => {
  return $.response[200].random();
};

export const POST: createItem = async ($) => {
  return $.response[201].random();
};
