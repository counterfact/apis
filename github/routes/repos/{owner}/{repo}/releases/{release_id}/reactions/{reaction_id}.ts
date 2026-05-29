import type { reactionsDeleteForRelease } from "../../../../../../../types/paths/repos/{owner}/{repo}/releases/{release_id}/reactions/{reaction_id}.types.js";

export const DELETE: reactionsDeleteForRelease = async ($) => {
  return $.response[204].empty();
};
