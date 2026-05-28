import type { gistsCheckIsStarred } from "../../../types/paths/gists/{gist_id}/star.types.js";
import type { gistsStar } from "../../../types/paths/gists/{gist_id}/star.types.js";
import type { gistsUnstar } from "../../../types/paths/gists/{gist_id}/star.types.js";

export const GET: gistsCheckIsStarred = async ($) => {
  return $.response[204].empty();
};

export const PUT: gistsStar = async ($) => {
  return $.response[204].empty();
};

export const DELETE: gistsUnstar = async ($) => {
  return $.response[204].empty();
};
