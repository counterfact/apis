import type { gistsListComments } from "../../../types/paths/gists/{gist_id}/comments.types.js";
import type { gistsCreateComment } from "../../../types/paths/gists/{gist_id}/comments.types.js";

export const GET: gistsListComments = async ($) => {
  return $.response[200].random();
};

export const POST: gistsCreateComment = async ($) => {
  return $.response[201].random();
};
