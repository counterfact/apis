import type { retrieveOrder } from "../../types/paths/orders/{public_id}.types.js";

export const GET: retrieveOrder = async ($) => {
  return $.response[200].random();
};
