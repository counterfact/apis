import type { customersRetrieve } from "../../types/paths/customers/{merchant_user_id}.types.js";

export const GET: customersRetrieve = async ($) => {
  return $.response[200].random();
};
