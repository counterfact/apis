import type { FlagReferenceRep } from "./FlagReferenceRep.js";

export type FlagReferenceCollectionRep = {
  /**
   * The total number of flag references
   * @example 25
   */
  totalCount: number;
  /**
   * A list of flag references
   */
  items: Array<FlagReferenceRep>;
};
