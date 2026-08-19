import type { orgsConvertMemberToOutsideCollaborator } from "../../../../types/paths/orgs/{org}/outside_collaborators/{username}.types.js";
import type { orgsRemoveOutsideCollaborator } from "../../../../types/paths/orgs/{org}/outside_collaborators/{username}.types.js";

export const PUT: orgsConvertMemberToOutsideCollaborator = async ($) => {
  $.context.addOutsideCollaborator($.path.org, $.path.username);
  return $.body.async ? $.response[202].json({}) : $.response[204].empty();
};

export const DELETE: orgsRemoveOutsideCollaborator = async ($) => {
  $.context.removeOutsideCollaborator($.path.org, $.path.username);
  return $.response[204].empty();
};
