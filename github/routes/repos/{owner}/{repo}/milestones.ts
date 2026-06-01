import type { issuesListMilestones } from "../../../../types/paths/repos/{owner}/{repo}/milestones.types.js";
import type { issuesCreateMilestone } from "../../../../types/paths/repos/{owner}/{repo}/milestones.types.js";

export const GET: issuesListMilestones = async ($) => {
  if (!$.context.hasRepository($.path.owner, $.path.repo)) {
    return $.response[404].empty();
  }
  return $.response[200].json(
    $.context.listMilestones($.path.owner, $.path.repo, $.query),
  );
};

export const POST: issuesCreateMilestone = async ($) => {
  if (!$.context.hasRepository($.path.owner, $.path.repo)) {
    return $.response[404].empty();
  }
  return $.response[201].json(
    $.context.saveMilestone($.path.owner, $.path.repo, $.body),
  );
};
