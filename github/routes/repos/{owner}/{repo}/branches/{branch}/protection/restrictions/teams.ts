import type { reposGetTeamsWithAccessToProtectedBranch } from "../../../../../../../../types/paths/repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams.types.js";
import type { reposAddTeamAccessRestrictions } from "../../../../../../../../types/paths/repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams.types.js";
import type { reposSetTeamAccessRestrictions } from "../../../../../../../../types/paths/repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams.types.js";
import type { reposRemoveTeamAccessRestrictions } from "../../../../../../../../types/paths/repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams.types.js";

export const GET: reposGetTeamsWithAccessToProtectedBranch = async ($) => {
  return $.response[200].random();
};

export const POST: reposAddTeamAccessRestrictions = async ($) => {
  return $.response[200].random();
};

export const PUT: reposSetTeamAccessRestrictions = async ($) => {
  return $.response[200].random();
};

export const DELETE: reposRemoveTeamAccessRestrictions = async ($) => {
  return $.response[200].random();
};
