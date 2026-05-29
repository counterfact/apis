import type { issuesListMilestones } from "../../../../types/paths/repos/{owner}/{repo}/milestones.types.js";
import type { issuesCreateMilestone } from "../../../../types/paths/repos/{owner}/{repo}/milestones.types.js";

export const GET: issuesListMilestones = async ($) => {
  return $.response[200].random();
};

export const POST: issuesCreateMilestone = async ($) => {
  return $.response[201].random();
};
