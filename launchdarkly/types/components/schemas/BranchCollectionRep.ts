import type { BranchRep } from "./BranchRep.js";

export type BranchCollectionRep = {
  /**
   * The location and content type of related resources
   */
  _links: { [key: string]: unknown };
  /**
   * An array of branches
   */
  items: Array<BranchRep>;
};
