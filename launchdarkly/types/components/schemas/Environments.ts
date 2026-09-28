import type { Environment } from "./Environment.js";

export type Environments = {
  /**
   * The location and content type of related resources
   */
  _links?: { [key: string]: unknown };
  /**
   * The number of environments returned
   * @example 2
   */
  totalCount?: number;
  /**
   * An array of environments
   */
  items: Array<Environment>;
};
