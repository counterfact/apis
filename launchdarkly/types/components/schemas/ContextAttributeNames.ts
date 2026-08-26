import type { ContextAttributeName } from "./ContextAttributeName.js";

export type ContextAttributeNames = {
  /**
   * The kind associated with this collection of context attribute names.
   * @example "user"
   */
  kind: string;
  /**
   * A collection of context attribute names.
   */
  names: Array<ContextAttributeName>;
};
