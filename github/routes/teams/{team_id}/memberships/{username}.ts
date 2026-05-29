import type { teamsGetMembershipForUserLegacy } from "../../../../types/paths/teams/{team_id}/memberships/{username}.types.js";
import type { teamsAddOrUpdateMembershipForUserLegacy } from "../../../../types/paths/teams/{team_id}/memberships/{username}.types.js";
import type { teamsRemoveMembershipForUserLegacy } from "../../../../types/paths/teams/{team_id}/memberships/{username}.types.js";

export const GET: teamsGetMembershipForUserLegacy = async ($) => {
  return $.response[200].random();
};

export const PUT: teamsAddOrUpdateMembershipForUserLegacy = async ($) => {
  return $.response[200].random();
};

export const DELETE: teamsRemoveMembershipForUserLegacy = async ($) => {
  return $.response[204].empty();
};
