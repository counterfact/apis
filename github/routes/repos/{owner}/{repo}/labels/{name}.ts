import type { issuesGetLabel } from "../../../../../types/paths/repos/{owner}/{repo}/labels/{name}.types.js";
import type { issuesUpdateLabel } from "../../../../../types/paths/repos/{owner}/{repo}/labels/{name}.types.js";
import type { issuesDeleteLabel } from "../../../../../types/paths/repos/{owner}/{repo}/labels/{name}.types.js";

export const GET: issuesGetLabel = async ($) => {
  if (!$.context.hasRepository($.path.owner, $.path.repo)) {
    return $.response[404].empty();
  }

  const label = $.context.getLabel($.path.owner, $.path.repo, $.path.name);
  if (!label) {
    return $.response[404].empty();
  }

  return $.response[200].json(label);
};

export const PATCH: issuesUpdateLabel = async ($) => {
  if (!$.context.hasRepository($.path.owner, $.path.repo)) {
    return $.response[404].empty();
  }

  const label = $.context.updateLabel($.path.owner, $.path.repo, $.path.name, {
    name: $.body.new_name,
    color: $.body.color,
    description: $.body.description,
  });
  if (!label) {
    return $.response[404].empty();
  }

  return $.response[200].json(label);
};

export const DELETE: issuesDeleteLabel = async ($) => {
  if (!$.context.hasRepository($.path.owner, $.path.repo)) {
    return ($.response as never)[404].empty();
  }

  $.context.deleteLabel($.path.owner, $.path.repo, $.path.name);
  return $.response[204].empty();
};
