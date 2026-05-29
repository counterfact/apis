import type { gistsGetComment } from "../../../../types/paths/gists/{gist_id}/comments/{comment_id}.types.js";
import type { gistsUpdateComment } from "../../../../types/paths/gists/{gist_id}/comments/{comment_id}.types.js";
import type { gistsDeleteComment } from "../../../../types/paths/gists/{gist_id}/comments/{comment_id}.types.js";

export const GET: gistsGetComment = async ($) => {
  const comment = $.context.getComment($.path.gist_id, $.path.comment_id);
  if (!comment) {
    return $.response[404].empty();
  }
  return $.response[200].json(comment);
};

export const PATCH: gistsUpdateComment = async ($) => {
  if (!$.context.hasComment($.path.gist_id, $.path.comment_id)) {
    return $.response[404].empty();
  }
  const updated = $.context.saveComment($.path.gist_id, {
    id: $.path.comment_id,
    body: $.body.body,
  });
  return $.response[200].json(updated);
};

export const DELETE: gistsDeleteComment = async ($) => {
  if (!$.context.hasComment($.path.gist_id, $.path.comment_id)) {
    return $.response[404].empty();
  }
  $.context.deleteComment($.path.gist_id, $.path.comment_id);
  return $.response[204].empty();
};
