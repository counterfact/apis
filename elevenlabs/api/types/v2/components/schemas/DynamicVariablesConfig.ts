/**
 * @example {"dynamic_variable_placeholders":{"user_name":"John Doe"}}
 */
export type DynamicVariablesConfig = {
  /**
   * A dictionary of dynamic variable placeholders and their values
   */
  dynamic_variable_placeholders?: { [key: string]: unknown };
};
