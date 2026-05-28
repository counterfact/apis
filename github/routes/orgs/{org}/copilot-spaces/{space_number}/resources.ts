import type { copilotSpacesListResourcesForOrg } from "../../../../../types/paths/orgs/{org}/copilot-spaces/{space_number}/resources.types.js";
import type { copilotSpacesCreateResourceForOrg } from "../../../../../types/paths/orgs/{org}/copilot-spaces/{space_number}/resources.types.js";

export const GET: copilotSpacesListResourcesForOrg = async ($) => {
  return $.response[200].random();
};

export const POST: copilotSpacesCreateResourceForOrg = async ($) => {
  return $.response[200].random();
};
