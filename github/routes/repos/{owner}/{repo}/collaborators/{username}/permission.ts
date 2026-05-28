import type { reposGetCollaboratorPermissionLevel } from "../../../../../../types/paths/repos/{owner}/{repo}/collaborators/{username}/permission.types.js";

export const GET: reposGetCollaboratorPermissionLevel = async ($) => {
  return $.response[200].random();
};
