import type { actionsGetGithubActionsPermissionsRepository } from "../../../../../types/paths/repos/{owner}/{repo}/actions/permissions.types.js";
import type { actionsSetGithubActionsPermissionsRepository } from "../../../../../types/paths/repos/{owner}/{repo}/actions/permissions.types.js";

export const GET: actionsGetGithubActionsPermissionsRepository = async ($) => {
  return $.response[200].random();
};

export const PUT: actionsSetGithubActionsPermissionsRepository = async ($) => {
  return $.response[204].empty();
};
