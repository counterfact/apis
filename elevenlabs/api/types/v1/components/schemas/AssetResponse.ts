/**
 * The public Asset object.
 * @example {"asset_id":"5xM2KqOnZyce22SPZ9d4","content_url":"https://.../a1b2c3d4/content?...","created_at_unix":1721520000,"mime_type":"audio/mpeg","name":"podcast-intro.mp3"}
 */
export type AssetResponse = {
  /**
   * Unique identifier for the asset.
   */
  asset_id: string;
  /**
   * Display name of the asset.
   */
  name: string;
  /**
   * MIME type of the uploaded file (e.g. `audio/mpeg`).
   */
  mime_type: string;
  /**
   * Unix timestamp (seconds) the asset was created.
   */
  created_at_unix: number;
  /**
   * Signed URL to fetch the asset's content. May be `null` if the asset has not finished processing. Do not rely on it being valid for more than 1 hour; fetch the asset again for a fresh URL.
   */
  content_url: string | null;
};
