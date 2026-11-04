export type DynamicVariableSchemaOverride = {
  /**
   * @default "dynamic_variable"
   */
  source?: "dynamic_variable";
  /**
   * The name of the dynamic variable to use
   */
  dynamic_variable: string;
};
