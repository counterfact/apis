import type { orgsListOutsideCollaborators } from "../../../types/paths/orgs/{org}/outside_collaborators.types.js";

export const GET: orgsListOutsideCollaborators = async ($) => {
  return $.response[200].json(
    $.context.listOutsideCollaborators($.path.org, $.query),
  );
};
