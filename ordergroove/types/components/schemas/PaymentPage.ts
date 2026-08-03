import type { Payment } from "./Payment.js";

export type PaymentPage = {
  /**
   * @format uri
   */
  next: string | null;
  /**
   * @format uri
   */
  previous: string | null;
  results: Array<Payment>;
};
