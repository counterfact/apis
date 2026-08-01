import type { retrieveItem } from "../../types/paths/items/{public_id}.types.js";
import type { deleteItem } from "../../types/paths/items/{public_id}.types.js";

export const GET: retrieveItem = async ($) => {
  return $.response[200].random();
};

export const DELETE: deleteItem = async ($) => {
  return $.response[204].empty();
};
