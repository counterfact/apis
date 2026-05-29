import type { gistsGetComment } from "../../../../types/paths/gists/{gist_id}/comments/{comment_id}.types.js";
import type { gistsUpdateComment } from "../../../../types/paths/gists/{gist_id}/comments/{comment_id}.types.js";
import type { gistsDeleteComment } from "../../../../types/paths/gists/{gist_id}/comments/{comment_id}.types.js";

export const GET: gistsGetComment = async ($) => {
  return $.response[200].random();
};

export const PATCH: gistsUpdateComment = async ($) => {
  return $.response[200].random();
};

export const DELETE: gistsDeleteComment = async ($) => {
  return $.response[204].empty();
};
