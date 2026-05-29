import type { reposListReleaseAssets } from "../../../../../../types/paths/repos/{owner}/{repo}/releases/{release_id}/assets.types.js";
import type { reposUploadReleaseAsset } from "../../../../../../types/paths/repos/{owner}/{repo}/releases/{release_id}/assets.types.js";

export const GET: reposListReleaseAssets = async ($) => {
  return $.response[200].random();
};

export const POST: reposUploadReleaseAsset = async ($) => {
  return $.response[201].random();
};
