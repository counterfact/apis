import type { gistsCheckIsStarred } from "../../../types/paths/gists/{gist_id}/star.types.js";
import type { gistsStar } from "../../../types/paths/gists/{gist_id}/star.types.js";
import type { gistsUnstar } from "../../../types/paths/gists/{gist_id}/star.types.js";

export const GET: gistsCheckIsStarred = async ($) => {
  if (!$.context.hasGist($.path.gist_id)) {
    return $.response[404].empty();
  }
  if ($.context.isGistStarred($.path.gist_id)) {
    return $.response[204].empty();
  }
  return $.response[404].json({});
};

export const PUT: gistsStar = async ($) => {
  if (!$.context.hasGist($.path.gist_id)) {
    return $.response[404].empty();
  }
  $.context.starGist($.path.gist_id);
  return $.response[204].empty();
};

export const DELETE: gistsUnstar = async ($) => {
  if (!$.context.hasGist($.path.gist_id)) {
    return $.response[404].empty();
  }
  $.context.unstarGist($.path.gist_id);
  return $.response[204].empty();
};
