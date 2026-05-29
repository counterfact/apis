import type { orgsConvertMemberToOutsideCollaborator } from "../../../../types/paths/orgs/{org}/outside_collaborators/{username}.types.js";
import type { orgsRemoveOutsideCollaborator } from "../../../../types/paths/orgs/{org}/outside_collaborators/{username}.types.js";

export const PUT: orgsConvertMemberToOutsideCollaborator = async ($) => {
  return $.response[202].random();
};

export const DELETE: orgsRemoveOutsideCollaborator = async ($) => {
  return $.response[204].empty();
};
