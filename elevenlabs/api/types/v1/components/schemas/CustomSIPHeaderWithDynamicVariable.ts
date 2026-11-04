/**
 * Custom SIP header for phone transfers with a dynamic variable reference.
 * The value is a variable name that will be resolved at runtime.
 * Value is not validated here since it will be substituted with actual value later.
 */
export type CustomSIPHeaderWithDynamicVariable = {
  /**
   * The dynamic variable name to resolve
   */
  value: string;
  type: "dynamic";
  /**
   * The SIP header name (e.g., 'X-Customer-ID')
   */
  key: string;
};
