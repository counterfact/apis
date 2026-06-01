import type { issuesGetMilestone } from "../../../../../types/paths/repos/{owner}/{repo}/milestones/{milestone_number}.types.js";
import type { issuesUpdateMilestone } from "../../../../../types/paths/repos/{owner}/{repo}/milestones/{milestone_number}.types.js";
import type { issuesDeleteMilestone } from "../../../../../types/paths/repos/{owner}/{repo}/milestones/{milestone_number}.types.js";

export const GET: issuesGetMilestone = async ($) => {
  const milestone = $.context.getMilestone(
    $.path.owner,
    $.path.repo,
    $.path.milestone_number,
  );
  if (!milestone) {
    return $.response[404].empty();
  }
  return $.response[200].json(milestone);
};

export const PATCH: issuesUpdateMilestone = async ($) => {
  const milestone = $.context.updateMilestone(
    $.path.owner,
    $.path.repo,
    $.path.milestone_number,
    $.body,
  );
  if (!milestone) {
    return $.response[404].empty();
  }
  return $.response[200].json(milestone);
};

export const DELETE: issuesDeleteMilestone = async ($) => {
  if (
    !$.context.deleteMilestone(
      $.path.owner,
      $.path.repo,
      $.path.milestone_number,
    )
  ) {
    return $.response[404].empty();
  }
  return $.response[204].empty();
};
