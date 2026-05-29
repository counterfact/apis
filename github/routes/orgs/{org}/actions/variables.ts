import type { actionsListOrgVariables } from "../../../../types/paths/orgs/{org}/actions/variables.types.js";
import type { actionsCreateOrgVariable } from "../../../../types/paths/orgs/{org}/actions/variables.types.js";

export const GET: actionsListOrgVariables = async ($) => {
  return $.response[200].random();
};

export const POST: actionsCreateOrgVariable = async ($) => {
  return $.response[201].random();
};
