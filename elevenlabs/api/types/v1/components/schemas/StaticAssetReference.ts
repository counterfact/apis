/**
 * An asset uploaded via the assets API.
 */
export type StaticAssetReference = {
  type: "asset";
  /**
   * The ID of an asset uploaded via the assets API (`POST /v1/assets`), as returned in that response's `asset_id`.
   */
  asset_id: string;
};
