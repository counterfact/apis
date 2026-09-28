import type { Client } from "./Client.js";

export type ClientCollection = {
  /**
   * The location and content type of related resources
   * @example {"self":{"href":"/api/v2/oauth/clients","type":"application/json"}}
   */
  _links: { [key: string]: unknown };
  /**
   * List of client objects
   */
  items: Array<Client>;
};
