import type { reposRenameBranch } from "../../../../../../types/paths/repos/{owner}/{repo}/branches/{branch}/rename.types.js";

export const POST: reposRenameBranch = async ($) => {
  return $.response[201].random();
};
