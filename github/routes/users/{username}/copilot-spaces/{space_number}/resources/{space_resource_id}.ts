import type { copilotSpacesGetResourceForUser } from "../../../../../../types/paths/users/{username}/copilot-spaces/{space_number}/resources/{space_resource_id}.types.js";
import type { copilotSpacesUpdateResourceForUser } from "../../../../../../types/paths/users/{username}/copilot-spaces/{space_number}/resources/{space_resource_id}.types.js";
import type { copilotSpacesDeleteResourceForUser } from "../../../../../../types/paths/users/{username}/copilot-spaces/{space_number}/resources/{space_resource_id}.types.js";

export const GET: copilotSpacesGetResourceForUser = async ($) => {
  return $.response[200].random();
};

export const PUT: copilotSpacesUpdateResourceForUser = async ($) => {
  return $.response[200].random();
};

export const DELETE: copilotSpacesDeleteResourceForUser = async ($) => {
  return $.response[204].empty();
};
