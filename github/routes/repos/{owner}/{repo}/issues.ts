import type { issuesListForRepo } from "../../../../types/paths/repos/{owner}/{repo}/issues.types.js";
import type { issuesCreate } from "../../../../types/paths/repos/{owner}/{repo}/issues.types.js";

export const GET: issuesListForRepo = async ($) => {
  return $.response[200].random();
};

export const POST: issuesCreate = async ($) => {
  return $.response[201].random();
};
