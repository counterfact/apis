/**
 * An autolink reference.
 */
export type autolink = {
  /**
   * @example 3
   */
  id: number;
  /**
   * The prefix of a key that is linkified.
   * @example "TICKET-"
   */
  key_prefix: string;
  /**
   * A template for the target URL that is generated if a key was found.
   * @example "https://example.com/TICKET?query=<num>"
   */
  url_template: string;
  /**
   * Whether this autolink reference matches alphanumeric characters. If false, this autolink reference only matches numeric characters.
   * @example true
   */
  is_alphanumeric: boolean;
  /**
   * @format date-time
   */
  updated_at?: string;
};
