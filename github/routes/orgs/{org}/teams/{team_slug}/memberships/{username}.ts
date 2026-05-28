import type { teamsGetMembershipForUserInOrg } from "../../../../../../types/paths/orgs/{org}/teams/{team_slug}/memberships/{username}.types.js";
import type { teamsAddOrUpdateMembershipForUserInOrg } from "../../../../../../types/paths/orgs/{org}/teams/{team_slug}/memberships/{username}.types.js";
import type { teamsRemoveMembershipForUserInOrg } from "../../../../../../types/paths/orgs/{org}/teams/{team_slug}/memberships/{username}.types.js";

export const GET: teamsGetMembershipForUserInOrg = async ($) => {
  return $.response[200].random();
};

export const PUT: teamsAddOrUpdateMembershipForUserInOrg = async ($) => {
  return $.response[200].random();
};

export const DELETE: teamsRemoveMembershipForUserInOrg = async ($) => {
  return $.response[204].empty();
};
