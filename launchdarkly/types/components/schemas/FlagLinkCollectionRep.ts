import type { FlagLinkRep } from "./FlagLinkRep.js";

export type FlagLinkCollectionRep = {
  /**
   * An array of flag links
   */
  items: Array<FlagLinkRep>;
  /**
   * The location and content type of related resources
   */
  _links: { [key: string]: unknown };
};
