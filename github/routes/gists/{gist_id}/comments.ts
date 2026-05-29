import type { gistsListComments } from "../../../types/paths/gists/{gist_id}/comments.types.js";
import type { gistsCreateComment } from "../../../types/paths/gists/{gist_id}/comments.types.js";

export const GET: gistsListComments = async ($) => {
  if (!$.context.hasGist($.path.gist_id)) {
    return $.response[404].empty();
  }
  return $.response[200].json($.context.listComments($.path.gist_id));
};

export const POST: gistsCreateComment = async ($) => {
  if (!$.context.hasGist($.path.gist_id)) {
    return $.response[404].empty();
  }
  const comment = $.context.saveComment($.path.gist_id, {
    body: $.body.body,
  });
  return $.response[201].json(comment);
};
