import type { issuesListLabelsForRepo } from "../../../../types/paths/repos/{owner}/{repo}/labels.types.js";
import type { issuesCreateLabel } from "../../../../types/paths/repos/{owner}/{repo}/labels.types.js";

export const GET: issuesListLabelsForRepo = async ($) => {
  return $.response[200].random();
};

export const POST: issuesCreateLabel = async ($) => {
  return $.response[201].random();
};
