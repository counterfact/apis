/**
 * An enterprise on GitHub.
 */
export type enterprise = {
  /**
   * A short description of the enterprise.
   */
  description?: string;
  /**
   * @format uri
   * @example "https://github.com/enterprises/octo-business"
   */
  html_url: string;
  /**
   * The enterprise's website URL.
   * @format uri
   */
  website_url?: string;
  /**
   * Unique identifier of the enterprise
   * @example 42
   */
  id: number;
  /**
   * @example "MDEwOlJlcG9zaXRvcnkxMjk2MjY5"
   */
  node_id: string;
  /**
   * The name of the enterprise.
   * @example "Octo Business"
   */
  name: string;
  /**
   * The slug url identifier for the enterprise.
   * @example "octo-business"
   */
  slug: string;
  /**
   * @format date-time
   * @example "2019-01-26T19:01:12Z"
   */
  created_at: string;
  /**
   * @format date-time
   * @example "2019-01-26T19:14:43Z"
   */
  updated_at: string;
  /**
   * @format uri
   */
  avatar_url: string;
};
