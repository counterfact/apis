import type { reposCheckCollaborator } from "../../../../../types/paths/repos/{owner}/{repo}/collaborators/{username}.types.js";
import type { reposAddCollaborator } from "../../../../../types/paths/repos/{owner}/{repo}/collaborators/{username}.types.js";
import type { reposRemoveCollaborator } from "../../../../../types/paths/repos/{owner}/{repo}/collaborators/{username}.types.js";

export const GET: reposCheckCollaborator = async ($) => {
  return $.response[204].empty();
};

export const PUT: reposAddCollaborator = async ($) => {
  return $.response[201].random();
};

export const DELETE: reposRemoveCollaborator = async ($) => {
  return $.response[204].empty();
};
