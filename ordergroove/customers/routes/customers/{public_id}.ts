import type { retrieveCustomer } from "../../types/paths/customers/{public_id}.types.js";
import type { updateCustomer } from "../../types/paths/customers/{public_id}.types.js";

export const GET: retrieveCustomer = async ($) => {
  return $.response[200].random();
};

export const PUT: updateCustomer = async ($) => {
  return $.response[200].random();
};
