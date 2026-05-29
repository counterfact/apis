import type { copilotSpacesListForUser } from "../../../types/paths/users/{username}/copilot-spaces.types.js";
import type { copilotSpacesCreateForUser } from "../../../types/paths/users/{username}/copilot-spaces.types.js";

export const GET: copilotSpacesListForUser = async ($) => {
  return $.response[200].random();
};

export const POST: copilotSpacesCreateForUser = async ($) => {
  return $.response[201].random();
};
