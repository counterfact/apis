import type { Extinction } from "./Extinction.js";

export type ExtinctionCollectionRep = {
  /**
   * The location and content type of related resources
   */
  _links: { [key: string]: unknown };
  /**
   * An array of extinction events
   */
  items: { [key: string]: Array<Extinction> };
};
