import type { listCustomers } from "../types/paths/customers.types.js";
import type { createCustomer } from "../types/paths/customers.types.js";

export const GET: listCustomers = async ($) => {
  return $.response[200].random();
};

export const POST: createCustomer = async ($) => {
  return $.response[201].random();
};
