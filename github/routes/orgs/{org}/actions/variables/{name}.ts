import type { actionsGetOrgVariable } from "../../../../../types/paths/orgs/{org}/actions/variables/{name}.types.js";
import type { actionsUpdateOrgVariable } from "../../../../../types/paths/orgs/{org}/actions/variables/{name}.types.js";
import type { actionsDeleteOrgVariable } from "../../../../../types/paths/orgs/{org}/actions/variables/{name}.types.js";

export const GET: actionsGetOrgVariable = async ($) => {
  return $.response[200].random();
};

export const PATCH: actionsUpdateOrgVariable = async ($) => {
  return $.response[204].empty();
};

export const DELETE: actionsDeleteOrgVariable = async ($) => {
  return $.response[204].empty();
};
