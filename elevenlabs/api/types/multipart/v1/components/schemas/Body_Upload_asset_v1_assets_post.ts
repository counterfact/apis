import type { MultipartFile } from "../../../../../counterfact-types/index.ts";
export type Body_Upload_asset_v1_assets_post = {
  /**
   * The file to upload.
   * @format binary
   */
  asset: MultipartFile;
  /**
   * Display name for the asset.
   */
  name: string;
};
