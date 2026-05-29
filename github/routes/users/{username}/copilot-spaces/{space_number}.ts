import type { copilotSpacesGetForUser } from "../../../../types/paths/users/{username}/copilot-spaces/{space_number}.types.js";
import type { copilotSpacesUpdateForUser } from "../../../../types/paths/users/{username}/copilot-spaces/{space_number}.types.js";
import type { copilotSpacesDeleteForUser } from "../../../../types/paths/users/{username}/copilot-spaces/{space_number}.types.js";

export const GET: copilotSpacesGetForUser = async ($) => {
  return $.response[200].random();
};

export const PUT: copilotSpacesUpdateForUser = async ($) => {
  return $.response[200].random();
};

export const DELETE: copilotSpacesDeleteForUser = async ($) => {
  return $.response[204].empty();
};
