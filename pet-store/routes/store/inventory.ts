import type { getInventory } from "../../types/paths/store/inventory.types.js";

export const GET: getInventory = async ($) => {
  return $.response[200].random();
};
