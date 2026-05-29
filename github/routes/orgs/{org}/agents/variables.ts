import type { agentsListOrgVariables } from "../../../../types/paths/orgs/{org}/agents/variables.types.js";
import type { agentsCreateOrgVariable } from "../../../../types/paths/orgs/{org}/agents/variables.types.js";

export const GET: agentsListOrgVariables = async ($) => {
  return $.response[200].random();
};

export const POST: agentsCreateOrgVariable = async ($) => {
  return $.response[201].random();
};
