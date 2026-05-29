/**
 * License Simple
 */
export type license_simple = {
  /**
   * @example "mit"
   */
  key: string;
  /**
   * @example "MIT License"
   */
  name: string;
  /**
   * @format uri
   * @example "https://api.github.com/licenses/mit"
   */
  url: string;
  /**
   * @example "MIT"
   */
  spdx_id: string;
  /**
   * @example "MDc6TGljZW5zZW1pdA=="
   */
  node_id: string;
  /**
   * @format uri
   */
  html_url?: string;
};
