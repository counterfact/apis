import type { agentsGetOrgVariable } from "../../../../../types/paths/orgs/{org}/agents/variables/{name}.types.js";
import type { agentsUpdateOrgVariable } from "../../../../../types/paths/orgs/{org}/agents/variables/{name}.types.js";
import type { agentsDeleteOrgVariable } from "../../../../../types/paths/orgs/{org}/agents/variables/{name}.types.js";

export const GET: agentsGetOrgVariable = async ($) => {
  return $.response[200].random();
};

export const PATCH: agentsUpdateOrgVariable = async ($) => {
  return $.response[204].empty();
};

export const DELETE: agentsDeleteOrgVariable = async ($) => {
  return $.response[204].empty();
};
