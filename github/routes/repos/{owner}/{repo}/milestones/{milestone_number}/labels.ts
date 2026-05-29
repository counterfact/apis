import type { issuesListLabelsForMilestone } from "../../../../../../types/paths/repos/{owner}/{repo}/milestones/{milestone_number}/labels.types.js";

export const GET: issuesListLabelsForMilestone = async ($) => {
  return $.response[200].random();
};
