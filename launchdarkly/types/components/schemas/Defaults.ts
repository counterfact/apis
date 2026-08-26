export type Defaults = {
  /**
   * The index, from the array of variations for this flag, of the variation to serve by default when targeting is on.
   * @example 0
   */
  onVariation: number;
  /**
   * The index, from the array of variations for this flag, of the variation to serve by default when targeting is off.
   * @example 1
   */
  offVariation: number;
};
