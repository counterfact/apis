import type { nullable_simple_user } from "./nullable-simple-user.js";

/**
 * Data related to a release.
 */
export type release_asset = {
  /**
   * @format uri
   */
  url: string;
  /**
   * @format uri
   */
  browser_download_url: string;
  id: number;
  node_id: string;
  /**
   * The file name of the asset.
   * @example "Team Environment"
   */
  name: string;
  label: string;
  /**
   * State of the release asset.
   */
  state: "uploaded" | "open";
  content_type: string;
  size: number;
  digest: string;
  download_count: number;
  /**
   * @format date-time
   */
  created_at: string;
  /**
   * @format date-time
   */
  updated_at: string;
  uploader: nullable_simple_user;
};
