import type { issuesGetMilestone } from "../../../../../types/paths/repos/{owner}/{repo}/milestones/{milestone_number}.types.js";
import type { issuesUpdateMilestone } from "../../../../../types/paths/repos/{owner}/{repo}/milestones/{milestone_number}.types.js";
import type { issuesDeleteMilestone } from "../../../../../types/paths/repos/{owner}/{repo}/milestones/{milestone_number}.types.js";

export const GET: issuesGetMilestone = async ($) => {
  return $.response[200].random();
};

export const PATCH: issuesUpdateMilestone = async ($) => {
  return $.response[200].random();
};

export const DELETE: issuesDeleteMilestone = async ($) => {
  return $.response[204].empty();
};
