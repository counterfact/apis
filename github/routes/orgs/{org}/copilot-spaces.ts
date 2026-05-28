import type { copilotSpacesListForOrg } from "../../../types/paths/orgs/{org}/copilot-spaces.types.js";
import type { copilotSpacesCreateForOrg } from "../../../types/paths/orgs/{org}/copilot-spaces.types.js";

export const GET: copilotSpacesListForOrg = async ($) => {
  return $.response[200].random();
};

export const POST: copilotSpacesCreateForOrg = async ($) => {
  return $.response[201].random();
};
