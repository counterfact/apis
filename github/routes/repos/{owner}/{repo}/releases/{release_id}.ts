import type { reposGetRelease } from "../../../../../types/paths/repos/{owner}/{repo}/releases/{release_id}.types.js";
import type { reposUpdateRelease } from "../../../../../types/paths/repos/{owner}/{repo}/releases/{release_id}.types.js";
import type { reposDeleteRelease } from "../../../../../types/paths/repos/{owner}/{repo}/releases/{release_id}.types.js";

export const GET: reposGetRelease = async ($) => {
  return $.response[200].random();
};

export const PATCH: reposUpdateRelease = async ($) => {
  return $.response[200].random();
};

export const DELETE: reposDeleteRelease = async ($) => {
  return $.response[204].empty();
};
