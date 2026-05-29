import type { reposListCollaborators } from "../../../../types/paths/repos/{owner}/{repo}/collaborators.types.js";

export const GET: reposListCollaborators = async ($) => {
  return $.response[200].random();
};
