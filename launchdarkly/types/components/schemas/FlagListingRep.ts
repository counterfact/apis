import type { Link } from "./Link.js";

export type FlagListingRep = {
  /**
   * The flag name
   * @example "Example flag"
   */
  name: string;
  /**
   * The flag key
   * @example "flag-key-123abc"
   */
  key: string;
  _links?: { [key: string]: unknown };
  _site?: Link;
};
