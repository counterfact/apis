import type { nullable_license_simple } from "./nullable-license-simple.js";

/**
 * License Content
 */
export type license_content = {
  name: string;
  path: string;
  sha: string;
  size: number;
  /**
   * @format uri
   */
  url: string;
  /**
   * @format uri
   */
  html_url: string;
  /**
   * @format uri
   */
  git_url: string;
  /**
   * @format uri
   */
  download_url: string;
  type: string;
  content: string;
  encoding: string;
  _links: {
    /**
     * @format uri
     */
    git: string;
    /**
     * @format uri
     */
    html: string;
    /**
     * @format uri
     */
    self: string;
  };
  license: nullable_license_simple;
};
