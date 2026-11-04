import type { UrlModel } from "./UrlModel.js";
/**
 * HTTP request details.
 *
 * Spec: https://schema.ocsf.io/1.6.0/objects/http_request
 */
export type HttpRequestModel = {
  /**
   * HTTP method (GET, POST, etc.)
   */
  http_method: string;
  /**
   * Request URL object
   */
  url: UrlModel;
  /**
   * User agent string
   */
  user_agent?: string | null;
  /**
   * X-Forwarded-For header as a list
   */
  x_forwarded_for?: Array<string> | null;
};
