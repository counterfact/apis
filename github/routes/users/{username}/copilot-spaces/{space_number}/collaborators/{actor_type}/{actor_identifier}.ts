import type { copilotSpacesUpdateCollaboratorForUser } from "../../../../../../../types/paths/users/{username}/copilot-spaces/{space_number}/collaborators/{actor_type}/{actor_identifier}.types.js";
import type { copilotSpacesRemoveCollaboratorForUser } from "../../../../../../../types/paths/users/{username}/copilot-spaces/{space_number}/collaborators/{actor_type}/{actor_identifier}.types.js";

export const PUT: copilotSpacesUpdateCollaboratorForUser = async ($) => {
  return $.response[200].random();
};

export const DELETE: copilotSpacesRemoveCollaboratorForUser = async ($) => {
  return $.response[204].empty();
};
