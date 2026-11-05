/**
 * Custom SIP header for phone transfers with a static (validated) value.
 */
export type CustomSIPHeader = {
  /**
   * @default "static"
   */
  type?: "static";
  /**
   * The SIP header name (e.g., 'X-Customer-ID')
   */
  key: string;
  /**
   * The header value
   */
  value: string;
};
