/**
 * OCSF URL object.
 *
 * Spec: https://schema.ocsf.io/1.6.0/objects/url
 */
export type UrlModel = {
  /**
   * Full URL string
   */
  url_string?: string | null;
  /**
   * URL scheme (e.g., https)
   */
  scheme?: string | null;
  /**
   * URL hostname
   */
  hostname?: string | null;
  /**
   * URL port
   */
  port?: number | null;
  /**
   * URL path
   */
  path?: string | null;
  /**
   * URL query string
   */
  query_string?: string | null;
};
