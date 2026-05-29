import type { copilotSpacesListResourcesForUser } from "../../../../../types/paths/users/{username}/copilot-spaces/{space_number}/resources.types.js";
import type { copilotSpacesCreateResourceForUser } from "../../../../../types/paths/users/{username}/copilot-spaces/{space_number}/resources.types.js";

export const GET: copilotSpacesListResourcesForUser = async ($) => {
  return $.response[200].random();
};

export const POST: copilotSpacesCreateResourceForUser = async ($) => {
  return $.response[200].random();
};
