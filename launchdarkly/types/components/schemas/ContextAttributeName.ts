export type ContextAttributeName = {
  /**
   * A context attribute's name.
   * @example "/firstName"
   */
  name: string;
  /**
   * A relative estimate of the number of contexts seen recently that have an attribute with the associated name.
   * @example 2225
   */
  weight: number;
  /**
   * Whether or not the attribute has one or more redacted values.
   * @example false
   */
  redacted?: boolean;
};
