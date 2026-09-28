import type { FlagListingRep } from "./FlagListingRep.js";

export type ApplicationFlagCollectionRep = {
  /**
   * A list of the flags that have been evaluated by the application
   */
  items?: Array<FlagListingRep>;
  /**
   * The number of flags that have been evaluated by the application
   * @example 1
   */
  totalCount?: number;
  /**
   * The location and content type of related resources
   */
  _links?: { [key: string]: unknown };
};
