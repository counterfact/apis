import type { postTeamMembers } from "../../../../../types/paths/api/v2/teams/{teamKey}/members.types.js";

export const POST: postTeamMembers = async ($) => {
  return $.response[201].random();
};
