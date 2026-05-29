import type { copilotSpacesListCollaboratorsForOrg } from "../../../../../types/paths/orgs/{org}/copilot-spaces/{space_number}/collaborators.types.js";
import type { copilotSpacesAddCollaboratorForOrg } from "../../../../../types/paths/orgs/{org}/copilot-spaces/{space_number}/collaborators.types.js";

export const GET: copilotSpacesListCollaboratorsForOrg = async ($) => {
  return $.response[200].random();
};

export const POST: copilotSpacesAddCollaboratorForOrg = async ($) => {
  return $.response[201].random();
};
