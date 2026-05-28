import type { reposGet } from "../../../types/paths/repos/{owner}/{repo}.types.js";
import type { reposUpdate } from "../../../types/paths/repos/{owner}/{repo}.types.js";
import type { reposDelete } from "../../../types/paths/repos/{owner}/{repo}.types.js";

export const GET: reposGet = async ($) => {
  return $.response[200].random();
};

export const PATCH: reposUpdate = async ($) => {
  return $.response[200].random();
};

export const DELETE: reposDelete = async ($) => {
  return $.response[204].empty();
};
