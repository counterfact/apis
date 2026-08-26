import type { ApplicationVersionRep } from "./ApplicationVersionRep.js";

export type ApplicationVersionsCollectionRep = {
  /**
   * The location and content type of related resources
   */
  _links?: { [key: string]: unknown };
  /**
   * A list of the versions for this application
   */
  items?: Array<ApplicationVersionRep>;
  /**
   * The number of versions for this application
   * @example 1
   */
  totalCount?: number;
};
