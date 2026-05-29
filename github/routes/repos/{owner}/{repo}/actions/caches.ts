import type { actionsGetActionsCacheList } from "../../../../../types/paths/repos/{owner}/{repo}/actions/caches.types.js";
import type { actionsDeleteActionsCacheByKey } from "../../../../../types/paths/repos/{owner}/{repo}/actions/caches.types.js";

export const GET: actionsGetActionsCacheList = async ($) => {
  return $.response[200].random();
};

export const DELETE: actionsDeleteActionsCacheByKey = async ($) => {
  return $.response[200].random();
};
