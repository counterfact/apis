import type { copilotSpacesUpdateCollaboratorForOrg } from "../../../../../../../types/paths/orgs/{org}/copilot-spaces/{space_number}/collaborators/{actor_type}/{actor_identifier}.types.js";
import type { copilotSpacesRemoveCollaboratorForOrg } from "../../../../../../../types/paths/orgs/{org}/copilot-spaces/{space_number}/collaborators/{actor_type}/{actor_identifier}.types.js";

export const PUT: copilotSpacesUpdateCollaboratorForOrg = async ($) => {
  return $.response[200].random();
};

export const DELETE: copilotSpacesRemoveCollaboratorForOrg = async ($) => {
  return $.response[204].empty();
};
