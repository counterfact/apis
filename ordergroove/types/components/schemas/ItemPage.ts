import type { Item } from "./Item.js";

export type ItemPage = {
  /**
   * @format uri
   */
  next: string | null;
  /**
   * @format uri
   */
  previous: string | null;
  results: Array<Item>;
};
