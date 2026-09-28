import type { Destination } from "./Destination.js";

export type Destinations = {
  /**
   * The location and content type of related resources
   * @example {"self":{"href":"/api/v2/destinations","type":"application/json"}}
   */
  _links?: { [key: string]: unknown };
  /**
   * An array of Data Export destinations
   */
  items?: Array<Destination>;
};
