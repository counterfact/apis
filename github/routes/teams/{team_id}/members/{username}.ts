import type { teamsGetMemberLegacy } from "../../../../types/paths/teams/{team_id}/members/{username}.types.js";
import type { teamsAddMemberLegacy } from "../../../../types/paths/teams/{team_id}/members/{username}.types.js";
import type { teamsRemoveMemberLegacy } from "../../../../types/paths/teams/{team_id}/members/{username}.types.js";

export const GET: teamsGetMemberLegacy = async ($) => {
  return $.response[204].empty();
};

export const PUT: teamsAddMemberLegacy = async ($) => {
  return $.response[204].empty();
};

export const DELETE: teamsRemoveMemberLegacy = async ($) => {
  return $.response[204].empty();
};
