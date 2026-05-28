import type { reposGetReleaseAsset } from "../../../../../../types/paths/repos/{owner}/{repo}/releases/assets/{asset_id}.types.js";
import type { reposUpdateReleaseAsset } from "../../../../../../types/paths/repos/{owner}/{repo}/releases/assets/{asset_id}.types.js";
import type { reposDeleteReleaseAsset } from "../../../../../../types/paths/repos/{owner}/{repo}/releases/assets/{asset_id}.types.js";

export const GET: reposGetReleaseAsset = async ($) => {
  return $.response[200].random();
};

export const PATCH: reposUpdateReleaseAsset = async ($) => {
  return $.response[200].random();
};

export const DELETE: reposDeleteReleaseAsset = async ($) => {
  return $.response[204].empty();
};
