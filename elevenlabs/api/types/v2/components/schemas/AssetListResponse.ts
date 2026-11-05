import type { AssetResponse } from "./AssetResponse.js";
/**
 * One page of the workspace's assets, most recently created first.
 * @example {"assets":[{"asset_id":"5xM2KqOnZyce22SPZ9d4","content_url":"https://.../a1b2c3d4/content?...","created_at_unix":1721520000,"mime_type":"audio/mpeg","name":"podcast-intro.mp3"}],"has_more":true,"next_cursor":"eyJvZmZzZXQiOjEwfQ"}
 */
export type AssetListResponse = {
  /**
   * List of Asset objects.
   */
  assets: Array<AssetResponse>;
  /**
   * Pass as `cursor` to fetch the next page. `null` if there are no more results.
   */
  next_cursor: string | null;
  /**
   * Whether there are more results to fetch.
   */
  has_more: boolean;
};
