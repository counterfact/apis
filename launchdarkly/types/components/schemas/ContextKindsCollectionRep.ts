import type { ContextKindRep } from "./ContextKindRep.js";

export type ContextKindsCollectionRep = {
  /**
   * An array of context kinds
   */
  items: Array<ContextKindRep>;
  /**
   * The location and content type of related resources
   */
  _links: { [key: string]: unknown };
};
