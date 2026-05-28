import type { copilotSpacesGetResourceForOrg } from "../../../../../../types/paths/orgs/{org}/copilot-spaces/{space_number}/resources/{space_resource_id}.types.js";
import type { copilotSpacesUpdateResourceForOrg } from "../../../../../../types/paths/orgs/{org}/copilot-spaces/{space_number}/resources/{space_resource_id}.types.js";
import type { copilotSpacesDeleteResourceForOrg } from "../../../../../../types/paths/orgs/{org}/copilot-spaces/{space_number}/resources/{space_resource_id}.types.js";

export const GET: copilotSpacesGetResourceForOrg = async ($) => {
  return $.response[200].random();
};

export const PUT: copilotSpacesUpdateResourceForOrg = async ($) => {
  return $.response[200].random();
};

export const DELETE: copilotSpacesDeleteResourceForOrg = async ($) => {
  return $.response[204].empty();
};
