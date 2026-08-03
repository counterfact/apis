import type { paymentsRetrieve } from "../../types/paths/payments/{payment_id}.types.js";

export const GET: paymentsRetrieve = async ($) => {
  return $.response[200].random();
};
