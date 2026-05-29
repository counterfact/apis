/**
 * Org Hook
 */
export type org_hook = {
  /**
   * @example 1
   */
  id: number;
  /**
   * @format uri
   * @example "https://api.github.com/orgs/octocat/hooks/1"
   */
  url: string;
  /**
   * @format uri
   * @example "https://api.github.com/orgs/octocat/hooks/1/pings"
   */
  ping_url: string;
  /**
   * @format uri
   * @example "https://api.github.com/orgs/octocat/hooks/1/deliveries"
   */
  deliveries_url?: string;
  /**
   * @example "web"
   */
  name: string;
  /**
   * @example ["push","pull_request"]
   */
  events: Array<string>;
  /**
   * @example true
   */
  active: boolean;
  config: {
    /**
     * @example "\"http://example.com/2\""
     */
    url?: string;
    /**
     * @example "\"0\""
     */
    insecure_ssl?: string;
    /**
     * @example "\"form\""
     */
    content_type?: string;
    /**
     * @example "\"********\""
     */
    secret?: string;
  };
  /**
   * @format date-time
   * @example "2011-09-06T20:39:23Z"
   */
  updated_at: string;
  /**
   * @format date-time
   * @example "2011-09-06T17:26:27Z"
   */
  created_at: string;
  type: string;
};
