import type { copilotSpacesListCollaboratorsForUser } from "../../../../../types/paths/users/{username}/copilot-spaces/{space_number}/collaborators.types.js";
import type { copilotSpacesAddCollaboratorForUser } from "../../../../../types/paths/users/{username}/copilot-spaces/{space_number}/collaborators.types.js";

export const GET: copilotSpacesListCollaboratorsForUser = async ($) => {
  return $.response[200].random();
};

export const POST: copilotSpacesAddCollaboratorForUser = async ($) => {
  return $.response[201].random();
};
