import type { Customer } from "./Customer.js";

export type CustomerList = {
  results?: Array<Customer>;
  next?: string;
  previous?: string;
};
