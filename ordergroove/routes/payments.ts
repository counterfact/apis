import type { paymentsList } from "../types/paths/payments.types.js";

export const GET: paymentsList = async ($) => {
  return $.response[200].random();
};
