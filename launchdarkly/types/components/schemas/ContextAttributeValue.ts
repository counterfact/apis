export type ContextAttributeValue = {
  /**
   * A value for a context attribute.
   * @example "Sandy"
   */
  name: unknown;
  /**
   * A relative estimate of the number of contexts seen recently that have a matching value for a given attribute.
   * @example 35
   */
  weight: number;
};
