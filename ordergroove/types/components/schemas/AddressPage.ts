import type { Address } from "./Address.js";

export type AddressPage = {
  /**
   * @format uri
   */
  next: string | null;
  /**
   * @format uri
   */
  previous: string | null;
  results: Array<Address>;
};
