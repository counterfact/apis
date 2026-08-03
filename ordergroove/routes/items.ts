import type { itemsList } from "../types/paths/items.types.js";

export const GET: itemsList = async ($) => {
  return $.response[200].random();
};
