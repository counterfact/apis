import type { copilotSpacesGetForOrg } from "../../../../types/paths/orgs/{org}/copilot-spaces/{space_number}.types.js";
import type { copilotSpacesUpdateForOrg } from "../../../../types/paths/orgs/{org}/copilot-spaces/{space_number}.types.js";
import type { copilotSpacesDeleteForOrg } from "../../../../types/paths/orgs/{org}/copilot-spaces/{space_number}.types.js";

export const GET: copilotSpacesGetForOrg = async ($) => {
  return $.response[200].random();
};

export const PUT: copilotSpacesUpdateForOrg = async ($) => {
  return $.response[200].random();
};

export const DELETE: copilotSpacesDeleteForOrg = async ($) => {
  return $.response[204].empty();
};
