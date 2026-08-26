import type { postMemberTeams } from "../../../../../types/paths/api/v2/members/{id}/teams.types.js";

export const POST: postMemberTeams = async ($) => {
  return $.response[201].random();
};
