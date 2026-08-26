import type { ContextAttributeValue } from "./ContextAttributeValue.js";

export type ContextAttributeValues = {
  /**
   * The kind associated with this collection of context attribute values.
   * @example "user"
   */
  kind: string;
  /**
   * A collection of context attribute values.
   */
  values: Array<ContextAttributeValue>;
};
