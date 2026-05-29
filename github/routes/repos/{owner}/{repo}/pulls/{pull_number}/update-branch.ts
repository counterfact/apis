import type { pullsUpdateBranch } from "../../../../../../types/paths/repos/{owner}/{repo}/pulls/{pull_number}/update-branch.types.js";

export const PUT: pullsUpdateBranch = async ($) => {
  return $.response[202].random();
};
