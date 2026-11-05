export type ConstantSchemaOverride = {
  /**
   * @default "constant"
   */
  source?: "constant";
  /**
   * The constant value to use
   */
  constant_value:
    | string
    | number
    | number
    | boolean
    | Array<unknown>
    | { [key: string]: unknown }
    | null;
};
