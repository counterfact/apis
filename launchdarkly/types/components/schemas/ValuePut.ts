export type ValuePut = {
  /**
   * The variation value to set for the context. Must match the flag's variation type.
   * @example "existing_variation_value_to_use"
   */
  setting?: unknown;
  /**
   * Optional comment describing the change
   * @example "make sure this context experiences a specific variation"
   */
  comment?: string;
};
