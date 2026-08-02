import type { Customer } from "./Customer.js";

export type CustomerPage = {
  /**
   * @format uri
   */
  next: string | null;
  /**
   * @format uri
   */
  previous: string | null;
  results: Array<Customer>;
};
