import type { orgsConvertMemberToOutsideCollaborator } from "../../../../types/paths/orgs/{org}/outside_collaborators/{username}.types.js";
import type { orgsRemoveOutsideCollaborator } from "../../../../types/paths/orgs/{org}/outside_collaborators/{username}.types.js";

export const PUT: orgsConvertMemberToOutsideCollaborator = async ($) => {
  if (
    !$.context.getOrganization($.path.org) ||
    !$.context.getUser($.path.username) ||
    !$.context.isOrgMember($.path.org, $.path.username)
  ) {
    return $.response[404].json({ message: "Not Found", status: "404" });
  }
  $.context.addOutsideCollaborator($.path.org, $.path.username);
  return $.body.async ? $.response[202].json({}) : $.response[204].empty();
};

export const DELETE: orgsRemoveOutsideCollaborator = async ($) => {
  if ($.context.isOrgMember($.path.org, $.path.username)) {
    return $.response[422].json({
      message:
        "You cannot specify an organization member to remove as an outside collaborator.",
      documentation_url:
        "https://docs.github.com/rest/orgs/outside-collaborators#remove-outside-collaborator-from-an-organization",
    });
  }
  $.context.removeOutsideCollaborator($.path.org, $.path.username);
  return $.response[204].empty();
};
