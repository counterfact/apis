export type Body_Upload_asset_v1_assets_post = {
  /**
   * The file to upload.
   * @format binary
   */
  asset: Uint8Array | string;
  /**
   * Display name for the asset.
   */
  name: string;
};
