import type { ApplicationRep } from "./ApplicationRep.js";

export type ApplicationCollectionRep = {
  /**
   * The location and content type of related resources
   */
  _links?: { [key: string]: unknown };
  /**
   * A list of applications
   */
  items?: Array<ApplicationRep>;
  /**
   * The number of applications
   * @example 1
   */
  totalCount?: number;
};
