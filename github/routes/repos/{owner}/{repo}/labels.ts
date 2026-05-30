import type { issuesListLabelsForRepo } from "../../../../types/paths/repos/{owner}/{repo}/labels.types.js";
import type { issuesCreateLabel } from "../../../../types/paths/repos/{owner}/{repo}/labels.types.js";

export const GET: issuesListLabelsForRepo = async ($) => {
  if (!$.context.hasRepository($.path.owner, $.path.repo)) {
    return $.response[404].empty();
  }

  return $.response[200].json(
    $.context.listLabels($.path.owner, $.path.repo, $.query),
  );
};

export const POST: issuesCreateLabel = async ($) => {
  if (!$.context.hasRepository($.path.owner, $.path.repo)) {
    return $.response[404].empty();
  }

  const label = $.context.saveLabel($.path.owner, $.path.repo, {
    name: $.body.name,
    color: $.body.color ?? "ededed",
    description: $.body.description,
  });
  return $.response[201].json(label);
};
