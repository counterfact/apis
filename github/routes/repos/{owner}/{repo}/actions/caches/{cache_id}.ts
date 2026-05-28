import type { actionsDeleteActionsCacheById } from "../../../../../../types/paths/repos/{owner}/{repo}/actions/caches/{cache_id}.types.js";

export const DELETE: actionsDeleteActionsCacheById = async ($) => {
  return $.response[204].empty();
};
