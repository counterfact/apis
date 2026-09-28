import type { deleteBranches } from "../../../../../../types/paths/api/v2/code-refs/repositories/{repo}/branch-delete-tasks.types.js";

export const POST: deleteBranches = async ($) => {
  return $.response[200].empty();
};
